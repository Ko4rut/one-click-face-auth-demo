import type { Metadata } from "next";
import { FaceCapturePage } from "@/features/face-capture/components/FaceCapturePage";

export const metadata: Metadata = {
  title: "Đăng ký khuôn mặt",
  description: "Thu thập các khung hình khuôn mặt phục vụ đăng ký sinh trắc học.",
};

export default function FaceEnrollPage() {
  return <FaceCapturePage mode="enroll" />;
}
