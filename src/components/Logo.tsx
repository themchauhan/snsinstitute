/** SNS Institute wordmark, redrawn as SVG from the institute's poster branding. */
export function Logo({ className = '', light = false }: { className?: string; light?: boolean }) {
  const ink = light ? '#ffffff' : 'var(--sns-primary-900)';
  return (
    <svg viewBox="0 0 236 58" className={className} role="img" aria-label="SNS Institute Rewari">
      <g fill="var(--sns-primary-500)">
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => <circle key={`${r}${c}`} cx={7 + c * 13} cy={9 + r * 13} r={5} />),
        )}
      </g>
      <text x="48" y="38" fill={ink} fontFamily="var(--sns-font-heading)" fontWeight="800" fontSize="40" letterSpacing="-1">
        SNS
      </text>
      <text x="134" y="22" fill={ink} fontFamily="var(--sns-font-heading)" fontWeight="700" fontSize="15.5">
        INSTITUTE
      </text>
      <text x="134" y="39" fill="var(--sns-accent-500)" fontFamily="var(--sns-font-heading)" fontWeight="700" fontSize="15.5">
        REWARI
      </text>
      <text x="48" y="54" fill={light ? 'var(--sns-primary-200)' : 'var(--sns-primary-700)'} fontFamily="var(--sns-font-body)" fontWeight="600" fontSize="7.8" letterSpacing="0.4">
        IIT-JEE • NEET • FOUNDATION • 5–12
      </text>
    </svg>
  );
}
