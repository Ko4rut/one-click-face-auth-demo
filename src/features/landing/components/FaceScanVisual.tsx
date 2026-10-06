const landmarks = [
  [42, 38],
  [58, 38],
  [50, 47],
  [43, 56],
  [57, 56],
  [50, 61],
  [35, 48],
  [65, 48],
  [39, 66],
  [61, 66],
];

export function FaceScanVisual() {
  return (
    <div className="scan-shell" aria-label="Minh họa quét khuôn mặt">
      <div className="scan-aura scan-aura-one" />
      <div className="scan-aura scan-aura-two" />

      <div className="scan-status">
        <span className="status-dot" />
        Camera ready
      </div>

      <div className="scan-card">
        <div className="scan-grid" aria-hidden="true" />
        <div className="scan-ring scan-ring-outer" aria-hidden="true" />
        <div className="scan-ring scan-ring-inner" aria-hidden="true" />

        <div className="scan-corner scan-corner-tl" aria-hidden="true" />
        <div className="scan-corner scan-corner-tr" aria-hidden="true" />
        <div className="scan-corner scan-corner-bl" aria-hidden="true" />
        <div className="scan-corner scan-corner-br" aria-hidden="true" />

        <svg
          className="face-illustration"
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="faceFill" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#C9CAAC" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#869B7E" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <path
            className="face-neck"
            d="M41 72v11c0 5-8 6-13 11h44c-5-5-13-6-13-11V72"
          />
          <path
            className="face-shape"
            d="M29 37c0-18 10-28 21-28s21 10 21 28v17c0 17-9 29-21 29S29 71 29 54V37Z"
            fill="url(#faceFill)"
          />
          <path className="face-hair" d="M28 38c1-19 12-31 25-29 11 1 20 10 19 28-7-9-15-14-25-13-7 1-13 5-19 14Z" />
          <path className="face-detail" d="M37 43h8M55 43h8M39 58c7 5 15 5 22 0" />
        </svg>

        <div className="landmark-layer" aria-hidden="true">
          {landmarks.map(([left, top], index) => (
            <span
              className="landmark"
              key={`${left}-${top}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${index * 90}ms`,
              }}
            />
          ))}
        </div>

        <div className="scan-line" aria-hidden="true" />

        <span className="particle particle-a" aria-hidden="true" />
        <span className="particle particle-b" aria-hidden="true" />
        <span className="particle particle-c" aria-hidden="true" />
        <span className="particle particle-d" aria-hidden="true" />

        <div className="scan-caption">
          <span>Face detected</span>
          <strong>Ready to identify</strong>
        </div>
      </div>

      <div className="scan-chip scan-chip-left">
        <span>CPU</span>
        Lightweight runtime
      </div>
      <div className="scan-chip scan-chip-right">
        <span>1:N</span>
        Identity matching
      </div>
    </div>
  );
}
