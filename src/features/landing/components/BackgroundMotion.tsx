export function BackgroundMotion() {
  return (
    <div className="background-motion" aria-hidden="true">
      <div className="background-grid" />

      <svg
        className="background-network"
        viewBox="0 0 1440 980"
        preserveAspectRatio="none"
      >
        <path
          className="background-network-line background-network-line-one"
          d="M-120 250C180 70 430 450 720 260S1190 40 1560 210"
        />
        <path
          className="background-network-line background-network-line-two"
          d="M-120 610C170 770 420 400 740 590S1210 840 1560 620"
        />
        <path
          className="background-network-line background-network-line-three"
          d="M120 1040C220 690 610 780 760 520S1110 170 1450 340"
        />
      </svg>

      <span className="background-orb background-orb-one" />
      <span className="background-orb background-orb-two" />
      <span className="background-orb background-orb-three" />

      <div className="background-face-target background-face-target-one">
        <span />
        <span />
        <span />
        <i className="background-target-sweep" />
      </div>

      <div className="background-face-target background-face-target-two">
        <span />
        <span />
        <i className="background-target-sweep" />
      </div>

      <span className="background-dot background-dot-one" />
      <span className="background-dot background-dot-two" />
      <span className="background-dot background-dot-three" />
      <span className="background-dot background-dot-four" />
      <span className="background-dot background-dot-five" />
      <span className="background-dot background-dot-six" />
      <span className="background-dot background-dot-seven" />

      <div className="background-scan-beam" />
      <div className="background-scan-line" />
    </div>
  );
}
