"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordField } from "./PasswordField";

const PENDING_ENROLLMENT_USER_KEY = "facegate.pendingEnrollmentUserId";

export function RegisterForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    const consent = form.get("biometricConsent");

    if (password !== confirmPassword) {
      setMessage("Mật khẩu xác nhận chưa khớp.");
      return;
    }

    if (!consent) {
      setMessage("Bạn cần đồng ý thu thập dữ liệu sinh trắc để tiếp tục.");
      return;
    }

    sessionStorage.setItem(PENDING_ENROLLMENT_USER_KEY, username);
    router.push("/face-enroll");
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="auth-field" htmlFor="register-username">
        <span>Tài khoản</span>
        <span className="auth-input-wrap">
          <svg className="auth-input-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c.7-4 3.1-6 7-6s6.3 2 7 6" />
          </svg>
          <input
            id="register-username"
            name="username"
            type="text"
            placeholder="Tạo tên tài khoản"
            autoComplete="username"
            minLength={4}
            required
          />
        </span>
      </label>

      <PasswordField
        id="register-password"
        name="password"
        label="Mật khẩu"
        placeholder="Tạo mật khẩu"
        autoComplete="new-password"
        minLength={6}
      />

      <PasswordField
        id="register-confirm-password"
        name="confirmPassword"
        label="Xác nhận mật khẩu"
        placeholder="Nhập lại mật khẩu"
        autoComplete="new-password"
        minLength={6}
      />

      <label className="auth-consent">
        <input type="checkbox" name="biometricConsent" />
        <span className="auth-consent-check" aria-hidden="true">✓</span>
        <span>
          Tôi đồng ý cho FaceGate thu thập dữ liệu khuôn mặt để phục vụ
          đăng ký và xác thực sinh trắc học.
          <small>
            Camera chỉ được mở ở bước tiếp theo sau khi bạn xác nhận.
          </small>
        </span>
      </label>

      <button className="auth-submit" type="submit">
        Tiếp tục lấy khuôn mặt
        <span aria-hidden="true">→</span>
      </button>

      {message && (
        <p className="auth-form-message" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
