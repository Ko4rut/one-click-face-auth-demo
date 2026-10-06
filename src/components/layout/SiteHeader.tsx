import { FaceGateLogo } from "@/components/brand/FaceGateLogo";
import { LANDING_NAVIGATION } from "@/constants/navigation";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <FaceGateLogo />

        <nav className="site-nav" aria-label="Điều hướng chính">
          {LANDING_NAVIGATION.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header-actions">
          <a className="text-link" href="#experience">
            Đăng nhập
          </a>
          <a className="button button-small button-primary" href="#flow">
            Bắt đầu
          </a>
        </div>
      </div>
    </header>
  );
}
