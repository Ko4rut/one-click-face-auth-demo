import Link from "next/link";
import { FaceGateLogo } from "@/components/brand/FaceGateLogo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { FaceScanVisual } from "@/features/landing/components/FaceScanVisual";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  alternateText: string;
  alternateLabel: string;
  alternateHref: string;
  children: React.ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  alternateText,
  alternateLabel,
  alternateHref,
  children,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <div className="auth-background" aria-hidden="true">
        <span className="auth-background-orb auth-background-orb-one" />
        <span className="auth-background-orb auth-background-orb-two" />
        <span className="auth-background-grid" />
        <span className="auth-background-scan" />
      </div>

      <header className="auth-header">
        <FaceGateLogo />
        <div className="auth-header-actions">
          <ThemeToggle />
          <Link className="auth-back-link" href="/">
            Về trang chủ
          </Link>
        </div>
      </header>

      <section className="auth-shell">
        <div className="auth-form-panel">
          <div className="auth-form-heading">
            <span className="auth-eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          {children}

          <p className="auth-alternate">
            {alternateText}{" "}
            <Link href={alternateHref}>{alternateLabel}</Link>
          </p>
        </div>

        <aside className="auth-visual-panel" aria-label="FaceGate biometric preview">
          <div className="auth-visual-copy">
            <span className="auth-visual-label">
              <i />
              FACE AUTHENTICATION
            </span>
            <h2>Khuôn mặt của bạn là chìa khóa đăng nhập.</h2>
            <p>
              FaceGate tách phần tài khoản và nhận diện khuôn mặt thành hai lớp,
              giúp bạn luôn có phương án đăng nhập dự phòng.
            </p>
          </div>

          <div className="auth-scan-wrap">
            <FaceScanVisual />
          </div>

          <div className="auth-visual-footer">
            <span>1:N Identification</span>
            <span>CPU-first</span>
            <span>Webcam capture</span>
          </div>
        </aside>
      </section>
    </main>
  );
}
