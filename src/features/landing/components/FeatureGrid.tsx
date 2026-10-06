const FEATURES = [
  {
    label: "ONE-CLICK",
    title: "Một lần nhìn, ít thao tác hơn",
    description:
      "Luồng đăng nhập bằng khuôn mặt được thiết kế để người dùng không cần nhập lại tài khoản trước khi nhận diện.",
  },
  {
    label: "CPU-FIRST",
    title: "Gọn nhẹ cho web demo",
    description:
      "Pipeline hướng tới khả năng chạy trên CPU phổ thông, phù hợp cho môi trường thử nghiệm không cần GPU rời.",
  },
  {
    label: "MODULAR",
    title: "Tách web và AI rõ ràng",
    description:
      "Frontend chỉ tập trung vào trải nghiệm, camera và phiên đăng nhập; AI backend được tích hợp qua API độc lập.",
  },
] as const;

export function FeatureGrid() {
  return (
    <div className="feature-grid">
      {FEATURES.map((feature, index) => (
        <article
          className="feature-card"
          key={feature.label}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <span className="feature-label">{feature.label}</span>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
          <span className="feature-index" aria-hidden="true">
            0{index + 1}
          </span>
        </article>
      ))}
    </div>
  );
}
