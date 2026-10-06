import type { Metadata } from "next";
import { FaceCapturePage } from "@/features/face-capture/components/FaceCapturePage";

export const metadata: Metadata = {
  title: "Xác minh khuôn mặt",
  description: "Nhận diện khuôn mặt để đăng nhập vào FaceGate.",
};

export default function FaceVerifyPage() {
  return <FaceCapturePage mode="verify" />;
}
