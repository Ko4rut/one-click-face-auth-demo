import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập vào FaceGate bằng tài khoản hoặc khuôn mặt.",
};

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="WELCOME BACK"
      title="Đăng nhập vào FaceGate"
      description="Sử dụng tài khoản và mật khẩu, hoặc chuyển sang nhận diện khuôn mặt để đăng nhập nhanh hơn."
      alternateText="Chưa có tài khoản?"
      alternateLabel="Đăng ký"
      alternateHref="/register"
    >
      <LoginForm />
    </AuthShell>
  );
}
