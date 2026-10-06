import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản FaceGate và đăng ký dữ liệu khuôn mặt.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="CREATE YOUR ACCOUNT"
      title="Tạo tài khoản FaceGate"
      description="Tạo tài khoản trước, sau đó hệ thống sẽ chuyển sang bước xin quyền camera và đăng ký khuôn mặt."
      alternateText="Đã có tài khoản?"
      alternateLabel="Đăng nhập"
      alternateHref="/login"
    >
      <RegisterForm />
    </AuthShell>
  );
}
