export const AUTH_FLOW = [
  {
    step: "01",
    title: "Tạo tài khoản",
    description:
      "Khởi tạo tài khoản web và xác nhận quyền sử dụng camera, dữ liệu khuôn mặt cho mục đích xác thực.",
  },
  {
    step: "02",
    title: "Đăng ký khuôn mặt",
    description:
      "Webcam thu các khung hình hợp lệ, sau đó gửi qua pipeline phát hiện, căn chỉnh và tạo đặc trưng.",
  },
  {
    step: "03",
    title: "Đăng nhập 1-click",
    description:
      "Người dùng nhìn vào camera, hệ thống thực hiện nhận diện 1:N và tự động xác định tài khoản phù hợp.",
  },
] as const;

export const TECHNOLOGIES = [
  "YuNet Detection",
  "Quality Validation",
  "5-point Alignment",
  "PCA / Eigenfaces",
  "1:N Matching",
] as const;
