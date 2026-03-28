interface MascotProps {
  size?: number;
  className?: string;
}

export default function Mascot({ size = 48, className }: MascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Glow behind bulb */}
      <circle cx="24" cy="19" r="14" fill="#FED7AA" opacity="0.5" />

      {/* Rays */}
      <g stroke="#F97316" strokeWidth="1.8" strokeLinecap="round">
        <line x1="24" y1="1" x2="24" y2="4.5" />
        <line x1="34.5" y1="4" x2="32.5" y2="7" />
        <line x1="41" y1="12" x2="38" y2="13.5" />
        <line x1="13.5" y1="4" x2="15.5" y2="7" />
        <line x1="7" y1="12" x2="10" y2="13.5" />
        <line x1="43" y1="22" x2="39.5" y2="22" />
        <line x1="5" y1="22" x2="8.5" y2="22" />
      </g>

      {/* Bulb — outer shape */}
      <path
        d="M 24 8 C 16 8 11 13.5 11 20 C 11 24.5 13.5 28.5 17 30.5 L 17 33 L 31 33 L 31 30.5 C 34.5 28.5 37 24.5 37 20 C 37 13.5 32 8 24 8 Z"
        fill="url(#bulbGrad)"
      />

      {/* Inner glow highlight */}
      <ellipse cx="20" cy="16" rx="4" ry="5" fill="white" opacity="0.25" />

      {/* Filament */}
      <path
        d="M 19 22 L 21.5 19 L 24 22 L 26.5 19 L 29 22"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.9"
      />

      {/* Base — thread 1 */}
      <rect x="17" y="33" width="14" height="3" rx="1.5" fill="#EA580C" />
      {/* Base — thread 2 */}
      <rect x="17.5" y="36.5" width="13" height="3" rx="1.5" fill="#C2410C" />
      {/* Base — thread 3 (tip) */}
      <rect x="19" y="40" width="10" height="3" rx="1.5" fill="#9A3412" />

      {/* Bottom tip */}
      <rect x="21.5" y="43" width="5" height="2.5" rx="1.2" fill="#7C2D12" />

      {/* Gradient def */}
      <defs>
        <radialGradient id="bulbGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#EA580C" />
        </radialGradient>
      </defs>
    </svg>
  );
}
