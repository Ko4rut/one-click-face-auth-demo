"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaceGateLogo } from "@/components/brand/FaceGateLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { enrollFace, identifyFace } from "@/service/face-auth/face-auth.service";
import { stripImageDataUrlPrefix } from "@/service/face-auth/image-base64";
import { ApiRequestError } from "@/service/http/api-client";

type CaptureMode = "enroll" | "verify";
type CameraState = "idle" | "requesting" | "ready" | "capturing" | "done" | "error";
type ApiState = "idle" | "submitting" | "success" | "error";

const ENROLL_TARGET = 5;
const PENDING_ENROLLMENT_USER_KEY = "facegate.pendingEnrollmentUserId";

type FaceCapturePageProps = {
  mode: CaptureMode;
};

type CapturedFrame = {
  id: number;
  dataUrl: string;
};

export function FaceCapturePage({ mode }: FaceCapturePageProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureTimerRef = useRef<number | null>(null);

  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [apiState, setApiState] = useState<ApiState>("idle");
  const [frames, setFrames] = useState<CapturedFrame[]>([]);
  const [message, setMessage] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [enrollmentUserId, setEnrollmentUserId] = useState("");

  const isEnroll = mode === "enroll";

  useEffect(() => {
    if (isEnroll) {
      setEnrollmentUserId(
        sessionStorage.getItem(PENDING_ENROLLMENT_USER_KEY) ?? ""
      );
    }
  }, [isEnroll]);

  const copy = useMemo(
    () =>
      isEnroll
        ? {
            eyebrow: "FACE ENROLLMENT",
            title: "Đăng ký khuôn mặt",
            description:
              "Giữ khuôn mặt trong khung. Web sẽ thu 5 frame để chuẩn bị gửi sang AI Backend.",
            backHref: "/register",
            backLabel: "Quay lại đăng ký",
          }
        : {
            eyebrow: "FACE VERIFICATION",
            title: "Đăng nhập bằng khuôn mặt",
            description:
              "Nhìn thẳng vào camera. Frame sẽ được gửi qua API identify để thực hiện nhận diện 1:N.",
            backHref: "/login",
            backLabel: "Quay lại đăng nhập",
          },
    [isEnroll]
  );

  const stopCamera = useCallback(() => {
    if (captureTimerRef.current) {
      window.clearInterval(captureTimerRef.current);
      captureTimerRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const startCamera = async () => {
    setCameraError("");
    setMessage("");
    setFrames([]);
    setApiState("idle");
    setCameraState("requesting");

    try {
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraState("ready");
    } catch (error) {
      console.error(error);
      setCameraState("error");
      setCameraError(
        "Không thể mở camera. Hãy kiểm tra quyền camera của trình duyệt rồi thử lại."
      );
    }
  };

  const captureFrame = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return null;

    const canvas = document.createElement("canvas");
    const targetWidth = 640;
    const ratio = video.videoHeight / video.videoWidth || 0.75;

    canvas.width = targetWidth;
    canvas.height = Math.round(targetWidth * ratio);

    const context = canvas.getContext("2d");
    if (!context) return null;

    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL("image/jpeg", 0.82);
  }, []);

  const beginEnrollmentCapture = () => {
    if (!isEnroll || cameraState !== "ready") return;

    setFrames([]);
    setMessage("");
    setApiState("idle");
    setCameraState("capturing");

    let count = 0;

    captureTimerRef.current = window.setInterval(() => {
      const dataUrl = captureFrame();
      if (!dataUrl) return;

      count += 1;
      setFrames((current) => [
        ...current,
        { id: Date.now() + count, dataUrl },
      ]);

      if (count >= ENROLL_TARGET) {
        if (captureTimerRef.current) {
          window.clearInterval(captureTimerRef.current);
          captureTimerRef.current = null;
        }
        setCameraState("done");
        setMessage(
          "Đã thu đủ 5 frame. Bạn có thể gửi dữ liệu sang API enrollment."
        );
      }
    }, 650);
  };

  const submitEnrollment = async () => {
    if (!enrollmentUserId) {
      setApiState("error");
      setMessage(
        "Không tìm thấy user_id từ bước đăng ký. Hãy quay lại /register và thực hiện lại flow."
      );
      return;
    }

    if (frames.length < ENROLL_TARGET) {
      setApiState("error");
      setMessage("Chưa thu đủ frame để enrollment.");
      return;
    }

    setApiState("submitting");
    setMessage("Đang gửi 5 frame sang API enrollment...");

    try {
      const result = await enrollFace({
        user_id: enrollmentUserId,
        frames: frames.map((frame) =>
          stripImageDataUrlPrefix(frame.dataUrl)
        ),
      });

      if (result.is_enrolled) {
        setApiState("success");
        setMessage(
          `Đăng ký khuôn mặt thành công cho ${result.user_id}. Accepted ${result.accepted_samples}/${result.required_samples} frame.`
        );
        sessionStorage.removeItem(PENDING_ENROLLMENT_USER_KEY);
        return;
      }

      setApiState("error");
      setMessage(
        `Enrollment chưa hoàn tất: accepted ${result.accepted_samples}/${result.required_samples}, rejected ${result.rejected_samples}.`
      );
    } catch (error) {
      setApiState("error");
      setMessage(
        error instanceof ApiRequestError
          ? error.message
          : "Có lỗi khi gọi API enrollment."
      );
    }
  };

  const beginVerification = async () => {
    if (isEnroll || cameraState !== "ready") return;

    const dataUrl = captureFrame();
    if (!dataUrl) {
      setMessage("Chưa lấy được frame từ camera. Hãy thử lại.");
      return;
    }

    setFrames([{ id: Date.now(), dataUrl }]);
    setCameraState("capturing");
    setApiState("submitting");
    setMessage("Đang gửi frame sang API identify...");

    try {
      const result = await identifyFace({
        image: stripImageDataUrlPrefix(dataUrl),
      });

      setCameraState("done");

      if (result.is_valid_frame && result.is_match && result.matched_id) {
        setApiState("success");
        setMessage(
          `Nhận diện thành công: ${result.matched_id} — score ${result.score.toFixed(3)}.`
        );
        return;
      }

      setApiState("error");
      setMessage(
        result.is_valid_frame
          ? `Không tìm thấy danh tính phù hợp — score ${result.score.toFixed(3)}.`
          : `Frame không hợp lệ: ${result.validation_message}.`
      );
    } catch (error) {
      setCameraState("done");
      setApiState("error");
      setMessage(
        error instanceof ApiRequestError
          ? error.message
          : "Có lỗi khi gọi API identify."
      );
    }
  };

  const resetCapture = () => {
    setFrames([]);
    setMessage("");
    setApiState("idle");
    setCameraState(streamRef.current ? "ready" : "idle");
  };

  const progress = isEnroll
    ? Math.min((frames.length / ENROLL_TARGET) * 100, 100)
    : cameraState === "done"
      ? 100
      : cameraState === "capturing"
        ? 70
        : 0;

  const isSubmitting = apiState === "submitting";

  return (
    <main className="capture-page">
      <div className="capture-background" aria-hidden="true">
        <span className="capture-orb capture-orb-one" />
        <span className="capture-orb capture-orb-two" />
        <span className="capture-grid" />
        <span className="capture-background-scan" />
      </div>

      <header className="capture-header">
        <FaceGateLogo />
        <div className="capture-header-actions">
          <ThemeToggle />
          <Link href={copy.backHref}>{copy.backLabel}</Link>
        </div>
      </header>

      <section className="capture-shell">
        <aside className="capture-guide">
          <span className="capture-eyebrow">{copy.eyebrow}</span>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>

          <div className="capture-guide-list">
            <div>
              <span>01</span>
              <div>
                <strong>Đặt mặt giữa khung</strong>
                <small>Giữ khoảng cách vừa phải với webcam.</small>
              </div>
            </div>
            <div>
              <span>02</span>
              <div>
                <strong>Ánh sáng rõ</strong>
                <small>Tránh ngược sáng hoặc vùng quá tối.</small>
              </div>
            </div>
            <div>
              <span>03</span>
              <div>
                <strong>Nhìn thẳng camera</strong>
                <small>Giữ biểu cảm tự nhiên và hạn chế di chuyển.</small>
              </div>
            </div>
            <div>
              <span>04</span>
              <div>
                <strong>Không che khuôn mặt</strong>
                <small>Hạn chế khẩu trang, nón hoặc vật cản.</small>
              </div>
            </div>
          </div>

          <div className="capture-privacy-note">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3 5 6v5c0 4.5 2.7 8 7 10 4.3-2 7-5.5 7-10V6l-7-3Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <div>
              <strong>API integration skeleton</strong>
              <span>
                Browser gọi Next.js /api/face/*; Next.js mới proxy sang AI Backend.
              </span>
            </div>
          </div>
        </aside>

        <section className="capture-camera-panel">
          <div className="capture-camera-header">
            <div>
              <span className="capture-camera-kicker">
                <i className={cameraState === "ready" || cameraState === "capturing" ? "active" : ""} />
                {cameraState === "ready" || cameraState === "capturing"
                  ? "Camera ready"
                  : "Camera inactive"}
              </span>
              <strong>
                {isEnroll ? "Thu thập frame khuôn mặt" : "Nhận diện khuôn mặt"}
              </strong>
            </div>
            <span className="capture-mode-chip">
              {isEnroll ? "ENROLL" : "VERIFY"}
            </span>
          </div>

          <div className="capture-video-stage">
            <video
              ref={videoRef}
              className="capture-video"
              playsInline
              muted
            />

            {cameraState === "idle" || cameraState === "requesting" || cameraState === "error" ? (
              <div className="capture-video-placeholder">
                <span className="capture-placeholder-icon">
                  <svg viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M15 6H8a2 2 0 0 0-2 2v7M33 6h7a2 2 0 0 1 2 2v7M15 42H8a2 2 0 0 1-2-2v-7M33 42h7a2 2 0 0 0 2-2v-7" />
                    <path d="M15 22c0-7 3.8-11 9-11s9 4 9 11v6c0 7-3.8 11-9 11s-9-4-9-11v-6Z" />
                  </svg>
                </span>
                <strong>
                  {cameraState === "requesting"
                    ? "Đang xin quyền camera..."
                    : cameraState === "error"
                      ? "Camera chưa khả dụng"
                      : "Camera chưa được bật"}
                </strong>
                <span>
                  Nhấn nút bên dưới để cho phép FaceGate sử dụng webcam.
                </span>
              </div>
            ) : null}

            <div className="capture-overlay" aria-hidden="true">
              <div className="capture-face-oval" />
              <div className="capture-corner capture-corner-tl" />
              <div className="capture-corner capture-corner-tr" />
              <div className="capture-corner capture-corner-bl" />
              <div className="capture-corner capture-corner-br" />
              <div className="capture-scan-line" />
              <span className="capture-landmark capture-landmark-one" />
              <span className="capture-landmark capture-landmark-two" />
              <span className="capture-landmark capture-landmark-three" />
              <span className="capture-landmark capture-landmark-four" />
              <span className="capture-landmark capture-landmark-five" />
            </div>

            <div className="capture-live-label">
              <span>{cameraState === "capturing" ? "Scanning" : "Position face"}</span>
              <strong>
                {cameraState === "capturing"
                  ? "Giữ nguyên tư thế"
                  : "Đặt khuôn mặt trong vùng quét"}
              </strong>
            </div>
          </div>

          <div className="capture-progress-row">
            <div>
              <span>
                {isEnroll
                  ? `${frames.length} / ${ENROLL_TARGET} frame`
                  : cameraState === "done"
                    ? "1 frame captured"
                    : "Chưa có frame"}
              </span>
              <strong>{Math.round(progress)}%</strong>
            </div>
            <div className="capture-progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>

          {frames.length > 0 && (
            <div className="capture-thumbnails">
              {frames.map((frame) => (
                <div className="capture-thumbnail" key={frame.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={frame.dataUrl} alt="Captured face frame" />
                  <span>✓</span>
                </div>
              ))}
            </div>
          )}

          <div className="capture-actions">
            {cameraState === "idle" || cameraState === "error" ? (
              <button className="capture-primary-button" onClick={startCamera} type="button">
                <span className="capture-button-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 8h3l2-2h6l2 2h3v10H4V8Z" />
                    <circle cx="12" cy="13" r="3.5" />
                  </svg>
                </span>
                Mở camera
              </button>
            ) : (
              <>
                <button
                  className="capture-secondary-button"
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    stopCamera();
                    setCameraState("idle");
                    setFrames([]);
                    setMessage("");
                    setApiState("idle");
                  }}
                >
                  Tắt camera
                </button>

                {isEnroll ? (
                  cameraState === "done" ? (
                    <>
                      <button
                        className="capture-secondary-button"
                        type="button"
                        disabled={isSubmitting}
                        onClick={resetCapture}
                      >
                        Thu lại
                      </button>
                      <button
                        className="capture-primary-button"
                        type="button"
                        disabled={isSubmitting}
                        onClick={submitEnrollment}
                      >
                        {isSubmitting ? "Đang gửi API..." : "Gửi đăng ký khuôn mặt"}
                      </button>
                    </>
                  ) : (
                    <button
                      className="capture-primary-button"
                      type="button"
                      disabled={cameraState === "capturing"}
                      onClick={beginEnrollmentCapture}
                    >
                      {cameraState === "capturing"
                        ? "Đang thu thập..."
                        : "Bắt đầu thu khuôn mặt"}
                    </button>
                  )
                ) : (
                  <button
                    className="capture-primary-button"
                    type="button"
                    disabled={cameraState === "capturing" || isSubmitting}
                    onClick={cameraState === "done" ? resetCapture : beginVerification}
                  >
                    {isSubmitting
                      ? "Đang gọi identify..."
                      : cameraState === "done"
                        ? "Thử lại"
                        : "Xác minh khuôn mặt"}
                  </button>
                )}
              </>
            )}
          </div>

          {cameraError && (
            <p className="capture-message capture-message-error" role="alert">
              {cameraError}
            </p>
          )}

          {message && (
            <p
              className={`capture-message ${apiState === "error" ? "capture-message-error" : ""}`}
              role="status"
            >
              {message}
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
