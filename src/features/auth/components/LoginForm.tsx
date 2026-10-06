"use client";

import { FormEvent, useState } from "react";
import { PasswordField } from "./PasswordField";

export function LoginForm() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Form hợp lệ. Bước tiếp theo sẽ nối API xác thực tài khoản.");
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="auth-field" htmlFor="login-username">
        <span>Tài khoản</span>
        <span className="auth-input-wrap">
          <svg className="auth-input-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c.7-4 3.1-6 7-6s6.3 2 7 6" />
          </svg>
          <input
            id="login-username"
            name="username"
            type="text"
            placeholder="Nhập tài khoản"
            autoComplete="username"
            required
          />
        </span>
      </label>

      <PasswordField
        id="login-password"
        name="password"
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        autoComplete="current-password"
      />

      <div className="auth-form-row">
        <label className="auth-checkbox">
          <input type="checkbox" name="remember" />
          <span>Ghi nhớ đăng nhập</span>
        </label>

        <button className="auth-link-button" type="button">
          Quên mật khẩu?
        </button>
      </div>

      <button className="auth-submit" type="submit">
        Đăng nhập
        <span aria-hidden="true">→</span>
      </button>

      <div className="auth-divider">
        <span>hoặc</span>
      </div>

      <button
        className="auth-face-button"
        type="button"
        onClick={() =>
          setMessage("Face Login sẽ chuyển sang page lấy khuôn mặt ở bước tiếp theo.")
        }
      >
        <span className="auth-face-icon" aria-hidden="true">
          <svg viewBox="0 0 32 32">
            <path d="M10 3H5a2 2 0 0 0-2 2v5M22 3h5a2 2 0 0 1 2 2v5M10 29H5a2 2 0 0 1-2-2v-5M22 29h5a2 2 0 0 0 2-2v-5" />
            <path d="M10 14c0-5 2.6-8 6-8s6 3 6 8v4c0 5-2.6 8-6 8s-6-3-6-8v-4Z" />
            <path d="M13 15h1M18 15h1M13.5 21c1.6 1.1 3.4 1.1 5 0" />
          </svg>
        </span>
        Đăng nhập bằng khuôn mặt
        <span aria-hidden="true">↗</span>
      </button>

      {message && (
        <p className="auth-form-message" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
