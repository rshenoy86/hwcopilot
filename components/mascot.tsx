interface MascotProps {
  size?: number;
  className?: string;
}

export default function Mascot({ size = 48, className }: MascotProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Wings */}
      <ellipse cx="20" cy="80" rx="13" ry="22" fill="#EA580C" transform="rotate(-18 20 80)" />
      <ellipse cx="80" cy="80" rx="13" ry="22" fill="#EA580C" transform="rotate(18 80 80)" />

      {/* Body */}
      <ellipse cx="50" cy="78" rx="27" ry="24" fill="#F97316" />

      {/* Head */}
      <circle cx="50" cy="47" r="27" fill="#F97316" />

      {/* Belly */}
      <ellipse cx="50" cy="76" rx="16" ry="18" fill="#FFEDD5" />

      {/* Face plate */}
      <ellipse cx="50" cy="47" rx="19" ry="17" fill="#FFEDD5" />

      {/* Eye whites */}
      <circle cx="39" cy="43" r="10" fill="white" />
      <circle cx="61" cy="43" r="10" fill="white" />

      {/* Eye rings */}
      <circle cx="39" cy="43" r="10" fill="none" stroke="#F97316" strokeWidth="1.5" />
      <circle cx="61" cy="43" r="10" fill="none" stroke="#F97316" strokeWidth="1.5" />

      {/* Pupils */}
      <circle cx="41" cy="43" r="6" fill="#0F172A" />
      <circle cx="63" cy="43" r="6" fill="#0F172A" />

      {/* Eye shine */}
      <circle cx="43" cy="40" r="2" fill="white" />
      <circle cx="65" cy="40" r="2" fill="white" />

      {/* Beak */}
      <polygon points="50,50 44,59 56,59" fill="#FBBF24" />

      {/* Feet */}
      <ellipse cx="41" cy="101" rx="9" ry="4" fill="#FBBF24" />
      <ellipse cx="59" cy="101" rx="9" ry="4" fill="#FBBF24" />

      {/* Ear tufts (peek out beside the cap) */}
      <polygon points="26,23 20,10 33,19" fill="#EA580C" />
      <polygon points="74,23 67,19 80,10" fill="#EA580C" />

      {/* Graduation cap — top */}
      <rect x="30" y="10" width="40" height="14" rx="3" fill="#1E293B" />

      {/* Graduation cap — brim */}
      <rect x="24" y="22" width="52" height="6" rx="3" fill="#1E293B" />

      {/* Tassel string */}
      <line x1="70" y1="24" x2="77" y2="38" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
      {/* Tassel bob */}
      <circle cx="77" cy="40" r="4" fill="#FBBF24" />

      {/* Stars (little sparkles around the owl) */}
      <circle cx="10" cy="30" r="2" fill="#FCD34D" />
      <circle cx="90" cy="25" r="2.5" fill="#FCD34D" />
      <circle cx="88" cy="55" r="1.5" fill="#FCD34D" />
    </svg>
  );
}
