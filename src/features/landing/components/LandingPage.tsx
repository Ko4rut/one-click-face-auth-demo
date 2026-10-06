import { SiteHeader } from "@/components/layout/SiteHeader";
import { AUTH_FLOW, TECHNOLOGIES } from "@/features/landing/constants";
import { BackgroundMotion } from "./BackgroundMotion";
import { FaceScanVisual } from "./FaceScanVisual";
import { FeatureGrid } from "./FeatureGrid";

export function LandingPage() {
  return (
    <main className="landing-page">
      <BackgroundMotion />

      <SiteHeader />

      <section className="hero" id="experience">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            FACE AUTHENTICATION FOR THE WEB
          </div>

          <h1>
            Your face.
            <br />
            <span>Your key.</span>
          </h1>

          <p className="hero-lead">
            FaceGate là web demo cho cơ chế xác thực khuôn mặt một chạm:
            đăng ký mẫu qua webcam, nhận diện danh tính và đưa người dùng
            vào hệ thống với ít thao tác nhất.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#flow">
              Bắt đầu trải nghiệm
              <span aria-hidden="true">↗</span>
            </a>
            <a className="button button-secondary" href="#technology">
              Xem pipeline
            </a>
          </div>

          <div className="hero-proof" aria-label="Điểm nổi bật">
            <div>
              <strong>1:N</strong>
              <span>Identification</span>
            </div>
            <div>
              <strong>CPU</strong>
              <span>First design</span>
            </div>
            <div>
              <strong>Webcam</strong>
              <span>Native capture</span>
            </div>
          </div>
        </div>

        <FaceScanVisual />
      </section>

      <section className="section" id="flow">
        <div className="section-heading">
          <span>HOW IT WORKS</span>
          <h2>Một luồng xác thực rõ ràng từ camera đến tài khoản.</h2>
          <p>
            Landing page được dựng như lớp giới thiệu của demo. Các màn hình
            đăng ký, lấy khuôn mặt, đăng nhập và trang thành công sẽ đi theo
            cùng một hệ thống nhận diện và ngôn ngữ thiết kế.
          </p>
        </div>

        <div className="flow-grid">
          {AUTH_FLOW.map((item) => (
            <article className="flow-card" key={item.step}>
              <span className="flow-step">{item.step}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section technology-section" id="technology">
        <div className="technology-copy">
          <span className="section-kicker">LIGHTWEIGHT PIPELINE</span>
          <h2>Được thiết kế để thể hiện đúng chủ đề face authentication.</h2>
          <p>
            Các chi tiết chuyển động trên giao diện bám theo chính luồng xử lý:
            phát hiện khuôn mặt, căn chỉnh, trích đặc trưng và matching.
          </p>
        </div>

        <div className="technology-track" aria-label="Các bước công nghệ">
          {TECHNOLOGIES.map((technology, index) => (
            <div className="technology-pill" key={technology}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {technology}
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading compact">
          <span>DESIGN PRINCIPLES</span>
          <h2>Nhẹ về giao diện, rõ về nghiệp vụ.</h2>
        </div>
        <FeatureGrid />
      </section>

      <section className="closing-cta">
        <div>
          <span className="section-kicker">NEXT STEP</span>
          <h2>Sẵn sàng nối landing page với luồng đăng ký và đăng nhập.</h2>
        </div>
        <a className="button button-light" href="#flow">
          Xem lại luồng
          <span aria-hidden="true">→</span>
        </a>
      </section>

      <footer className="site-footer">
        <span>FaceGate</span>
        <p>One-click face authentication demo.</p>
      </footer>
    </main>
  );
}
