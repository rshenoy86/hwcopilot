interface MascotProps {
  size?: number;
  className?: string;
}

export default function Mascot({ size = 48, className }: MascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rays emanating from bulb */}
      <g stroke="#F97316" strokeWidth="2" strokeLinecap="round">
        <line x1="40" y1="0" x2="40" y2="4" />
        <line x1="50" y1="2" x2="48" y2="5.5" />
        <line x1="57" y1="8" x2="54" y2="10.5" />
        <line x1="30" y1="2" x2="32" y2="5.5" />
        <line x1="23" y1="8" x2="26" y2="10.5" />
        <line x1="61" y1="15" x2="57" y2="15" />
        <line x1="19" y1="15" x2="23" y2="15" />
      </g>

      {/* Lightbulb — bulb */}
      <path
        d="M 29 15 A 11 11 0 0 1 51 15 C 51 21 48 25 46 27 L 34 27 C 32 25 29 21 29 15 Z"
        fill="#F97316"
      />

      {/* Filament detail */}
      <path
        d="M 34 17 Q 37 21 40 17 Q 43 21 46 17"
        stroke="white"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />

      {/* Screw base threads */}
      <rect x="34" y="27" width="12" height="2.5" rx="1.2" fill="#EA580C" />
      <rect x="34.5" y="30" width="11" height="2.5" rx="1.2" fill="#EA580C" />
      <rect x="35.5" y="32.5" width="9" height="2" rx="1" fill="#EA580C" />

      {/* Neck */}
      <rect x="37" y="34.5" width="6" height="5" fill="#EA580C" />

      {/* Main robe — flowing wide shape */}
      <path
        d="
          M 37 39
          C 26 40 16 47 12 60
          L 7 82
          L 12 86
          L 29 89
          L 40 91
          L 51 89
          L 68 86
          L 73 82
          L 68 60
          C 64 47 54 40 43 39
          Z
        "
        fill="#F97316"
      />

      {/* Extended arm — left side gesturing outward */}
      <path
        d="
          M 15 58
          C 9 55 3 57 0 63
          L 4 66
          C 6 61 11 59 17 62
          Z
        "
        fill="#F97316"
      />

      {/* Hand */}
      <ellipse
        cx="1.5"
        cy="64.5"
        rx="4"
        ry="3"
        fill="#F97316"
        transform="rotate(-20 1.5 64.5)"
      />

      {/* Feet — offset to suggest walking */}
      <ellipse
        cx="31"
        cy="92"
        rx="10"
        ry="4"
        fill="#EA580C"
        transform="rotate(-6 31 92)"
      />
      <ellipse
        cx="53"
        cy="92"
        rx="10"
        ry="4"
        fill="#EA580C"
        transform="rotate(6 53 92)"
      />
    </svg>
  );
}
