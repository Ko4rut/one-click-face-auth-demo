type FaceGateLogoProps = {
  compact?: boolean;
};

export function FaceGateLogo({ compact = false }: FaceGateLogoProps) {
  return (
    <a className="brand" href="/" aria-label="FaceGate home">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" role="img">
          <path d="M14 6H8a2 2 0 0 0-2 2v6M34 6h6a2 2 0 0 1 2 2v6M14 42H8a2 2 0 0 1-2-2v-6M34 42h6a2 2 0 0 0 2-2v-6" />
          <path d="M15 21c0-6 3.9-10 9-10s9 4 9 10v6c0 6-3.9 10-9 10s-9-4-9-10v-6Z" />
          <path d="M19 23h1M28 23h1M20 30c2.4 1.8 5.6 1.8 8 0" />
        </svg>
      </span>
      <span className="brand-copy">
        <span className="brand-name">
          Face<span>Gate</span>
        </span>
        {!compact && (
          <span className="brand-tagline">
            One-click face authentication
          </span>
        )}
      </span>
    </a>
  );
}
