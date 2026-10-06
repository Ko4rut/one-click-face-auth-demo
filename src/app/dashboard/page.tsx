"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaceGateLogo } from "@/components/brand/FaceGateLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const AUTH_USER_KEY = "facegate.authenticatedUserId";

export default function DashboardPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setUserId(sessionStorage.getItem(AUTH_USER_KEY));
    setLoaded(true);
  }, []);

  const logout = () => {
    sessionStorage.removeItem(AUTH_USER_KEY);
    router.push("/login");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "48px",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <FaceGateLogo />
        <ThemeToggle />
      </header>

      <section
        style={{
          width: "min(720px, 100%)",
          margin: "8vh auto 0",
          padding: "40px",
          border: "1px solid color-mix(in srgb, currentColor 14%, transparent)",
          borderRadius: "24px",
        }}
      >
        {!loaded ? (
          <p>Đang kiểm tra phiên xác thực...</p>
        ) : userId ? (
          <>
            <p style={{ marginBottom: "12px", opacity: 0.7 }}>
              FACE AUTHENTICATION CONFIRMED
            </p>
            <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", marginBottom: "16px" }}>
              Đăng nhập thành công
            </h1>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "28px" }}>
              Hệ thống đã nhận diện và định danh bạn với mã người dùng{" "}
              <strong>{userId}</strong>. Trang này chỉ dùng để xác nhận flow demo
              1:N đã đi hết từ camera → Next.js → AI Backend → kết quả nhận diện.
            </p>
            <button
              type="button"
              onClick={logout}
              style={{
                padding: "12px 18px",
                borderRadius: "12px",
                border: "1px solid currentColor",
                cursor: "pointer",
              }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <h1 style={{ marginBottom: "16px" }}>Chưa có phiên xác thực</h1>
            <p style={{ marginBottom: "24px", lineHeight: 1.7 }}>
              Hãy nhận diện khuôn mặt thành công trước khi vào trang xác nhận.
            </p>
            <Link href="/face-verify">Đi tới xác minh khuôn mặt</Link>
          </>
        )}
      </section>
    </main>
  );
}
