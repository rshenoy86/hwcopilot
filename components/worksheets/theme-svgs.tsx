// Duolingo-style SVG characters — one per theme, parametric color variants

interface SvgProps {
  variant: number; // 0–4, derived from worksheet ID
  className?: string;
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function Eye({ cx, cy, r = 8, irisColor }: { cx: number; cy: number; r?: number; irisColor: string }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={r * 0.58} fill={irisColor} />
      <circle cx={cx + r * 0.1} cy={cy} r={r * 0.34} fill="#1a1a1a" />
      <circle cx={cx - r * 0.25} cy={cy - r * 0.25} r={r * 0.18} fill="white" />
    </>
  );
}

function Smile({ cx, cy, w = 12 }: { cx: number; cy: number; w?: number }) {
  return (
    <path
      d={`M ${cx - w} ${cy} Q ${cx} ${cy + w * 0.75} ${cx + w} ${cy}`}
      stroke="#1a1a1a"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
  );
}

// ── DINOSAUR ─────────────────────────────────────────────────────────────────
const DINO = [
  { body: "#4CAF50", shade: "#2E7D32", belly: "#A5D6A7", iris: "#FF5722" },
  { body: "#42A5F5", shade: "#1565C0", belly: "#BBDEFB", iris: "#FF8F00" },
  { body: "#AB47BC", shade: "#6A1B9A", belly: "#E1BEE7", iris: "#FFD54F" },
  { body: "#FF7043", shade: "#BF360C", belly: "#FFCCBC", iris: "#5C6BC0" },
  { body: "#26C6DA", shade: "#00838F", belly: "#B2EBF2", iris: "#FF7043" },
];

export function DinoSVG({ variant, className }: SvgProps) {
  const c = DINO[variant % DINO.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* tail */}
      <path d="M 88 72 Q 112 58 106 38 Q 96 32 86 52" fill={c.body} stroke={c.shade} strokeWidth="2" />
      {/* body */}
      <ellipse cx="58" cy="82" rx="30" ry="26" fill={c.body} stroke={c.shade} strokeWidth="2.5" />
      {/* belly */}
      <ellipse cx="58" cy="86" rx="18" ry="15" fill={c.belly} />
      {/* head */}
      <ellipse cx="44" cy="50" rx="22" ry="19" fill={c.body} stroke={c.shade} strokeWidth="2.5" />
      {/* snout */}
      <ellipse cx="30" cy="56" rx="13" ry="9" fill={c.body} stroke={c.shade} strokeWidth="2" />
      {/* spikes */}
      <polygon points="52,32 56,22 60,32" fill={c.shade} />
      <polygon points="62,29 66,19 70,29" fill={c.shade} />
      {/* arm */}
      <ellipse cx="78" cy="72" rx="9" ry="5" fill={c.shade} transform="rotate(-25 78 72)" />
      {/* legs */}
      <rect x="41" y="102" width="11" height="14" rx="5" fill={c.shade} />
      <rect x="58" y="102" width="11" height="14" rx="5" fill={c.shade} />
      {/* eye */}
      <Eye cx={42} cy={44} r={8} irisColor={c.iris} />
      {/* nostrils */}
      <circle cx="24" cy="55" r="1.5" fill={c.shade} />
      <circle cx="28" cy="54" r="1.5" fill={c.shade} />
      {/* smile */}
      <Smile cx={30} cy={60} w={9} />
    </svg>
  );
}

// ── ROCKET (Space) ────────────────────────────────────────────────────────────
const ROCKET = [
  { body: "#5C6BC0", shade: "#283593", window: "#80DEEA", flame: "#FF7043" },
  { body: "#EF5350", shade: "#B71C1C", window: "#B3E5FC", flame: "#FFA726" },
  { body: "#AB47BC", shade: "#6A1B9A", window: "#F8BBD0", flame: "#FF5722" },
  { body: "#26C6DA", shade: "#006064", window: "#E1BEE7", flame: "#FF7043" },
  { body: "#66BB6A", shade: "#2E7D32", window: "#BBDEFB", flame: "#FFA726" },
];

export function RocketSVG({ variant, className }: SvgProps) {
  const c = ROCKET[variant % ROCKET.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* flame */}
      <ellipse cx="60" cy="105" rx="10" ry="14" fill={c.flame} opacity="0.9" />
      <ellipse cx="60" cy="108" rx="6" ry="10" fill="#FFEB3B" />
      {/* body */}
      <rect x="42" y="48" width="36" height="52" rx="8" fill={c.body} stroke={c.shade} strokeWidth="2.5" />
      {/* nose cone */}
      <path d="M 42 50 Q 60 10 78 50 Z" fill={c.body} stroke={c.shade} strokeWidth="2.5" />
      {/* fins */}
      <path d="M 42 90 L 28 108 L 42 100 Z" fill={c.shade} />
      <path d="M 78 90 L 92 108 L 78 100 Z" fill={c.shade} />
      {/* window */}
      <circle cx="60" cy="68" r="14" fill={c.window} stroke={c.shade} strokeWidth="2" />
      {/* face in window */}
      <Eye cx={55} cy={66} r={5} irisColor={c.shade} />
      <Eye cx={65} cy={66} r={5} irisColor={c.shade} />
      <Smile cx={60} cy={72} w={6} />
      {/* stars */}
      <circle cx="18" cy="22" r="2.5" fill="#FFD54F" />
      <circle cx="98" cy="30" r="2" fill="#FFD54F" />
      <circle cx="25" cy="55" r="1.8" fill="#FFD54F" />
      <circle cx="100" cy="58" r="2.2" fill="#FFD54F" />
    </svg>
  );
}

// ── DOG (Pets) ────────────────────────────────────────────────────────────────
const DOG = [
  { fur: "#D4A76A", shade: "#A0522D", nose: "#1a1a1a", inner: "#FFCCBC" },
  { fur: "#90A4AE", shade: "#37474F", nose: "#37474F", inner: "#F8BBD0" },
  { fur: "#EF9A9A", shade: "#C62828", nose: "#1a1a1a", inner: "#FCE4EC" },
  { fur: "#BCAAA4", shade: "#4E342E", nose: "#4E342E", inner: "#EFEBE9" },
  { fur: "#FFD54F", shade: "#F57F17", nose: "#1a1a1a", inner: "#FFF9C4" },
];

export function DogSVG({ variant, className }: SvgProps) {
  const c = DOG[variant % DOG.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* left ear */}
      <ellipse cx="32" cy="42" rx="14" ry="22" fill={c.shade} transform="rotate(-12 32 42)" />
      {/* right ear */}
      <ellipse cx="88" cy="42" rx="14" ry="22" fill={c.shade} transform="rotate(12 88 42)" />
      {/* head */}
      <circle cx="60" cy="62" r="38" fill={c.fur} stroke={c.shade} strokeWidth="2.5" />
      {/* snout */}
      <ellipse cx="60" cy="76" rx="20" ry="15" fill={c.inner} stroke={c.shade} strokeWidth="1.5" />
      {/* nose */}
      <ellipse cx="60" cy="70" rx="9" ry="6" fill={c.nose} />
      <circle cx="56" cy="68" r="2" fill="white" opacity="0.5" />
      {/* eyes */}
      <Eye cx={46} cy={56} r={9} irisColor={c.shade} />
      <Eye cx={74} cy={56} r={9} irisColor={c.shade} />
      {/* eyebrows */}
      <path d="M 39 45 Q 46 41 53 45" stroke={c.shade} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 67 45 Q 74 41 81 45" stroke={c.shade} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* tongue */}
      <ellipse cx="60" cy="86" rx="8" ry="9" fill="#EF9A9A" stroke={c.shade} strokeWidth="1.5" />
      <path d="M 52 86 Q 60 82 68 86" stroke={c.shade} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// ── SUPERHERO ─────────────────────────────────────────────────────────────────
const HERO = [
  { suit: "#E53935", cape: "#B71C1C", skin: "#FFCCBC", star: "#FFD54F" },
  { suit: "#1E88E5", cape: "#0D47A1", skin: "#FFCCBC", star: "#FFD54F" },
  { suit: "#8E24AA", cape: "#4A148C", skin: "#FFCCBC", star: "#FF8A65" },
  { suit: "#43A047", cape: "#1B5E20", skin: "#FFCCBC", star: "#FFD54F" },
  { suit: "#FF6F00", cape: "#E65100", skin: "#FFCCBC", star: "#FFFFFF" },
];

export function HeroSVG({ variant, className }: SvgProps) {
  const c = HERO[variant % HERO.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* cape */}
      <path d="M 38 58 Q 20 90 30 115 Q 60 100 90 115 Q 100 90 82 58 Z" fill={c.cape} stroke={c.cape} strokeWidth="1" />
      {/* body / suit */}
      <rect x="38" y="58" width="44" height="46" rx="10" fill={c.suit} stroke="#1a1a1a" strokeWidth="2" />
      {/* star emblem */}
      <text x="60" y="88" textAnchor="middle" fontSize="18" fill={c.star}>★</text>
      {/* neck */}
      <rect x="52" y="50" width="16" height="12" rx="4" fill={c.skin} />
      {/* head */}
      <circle cx="60" cy="38" r="22" fill={c.skin} stroke="#1a1a1a" strokeWidth="2" />
      {/* mask */}
      <path d="M 38 36 Q 60 28 82 36 L 78 44 Q 60 38 42 44 Z" fill={c.suit} />
      {/* eyes (in mask) */}
      <Eye cx={50} cy={40} r={6} irisColor={c.star} />
      <Eye cx={70} cy={40} r={6} irisColor={c.star} />
      {/* smile */}
      <Smile cx={60} cy={52} w={8} />
      {/* arms */}
      <ellipse cx="28" cy="72" rx="11" ry="7" fill={c.suit} stroke="#1a1a1a" strokeWidth="2" transform="rotate(-40 28 72)" />
      <ellipse cx="92" cy="72" rx="11" ry="7" fill={c.suit} stroke="#1a1a1a" strokeWidth="2" transform="rotate(40 92 72)" />
    </svg>
  );
}

// ── FISH (Ocean) ──────────────────────────────────────────────────────────────
const FISH = [
  { body: "#FF7043", shade: "#BF360C", fin: "#FF8A65", iris: "#1565C0" },
  { body: "#29B6F6", shade: "#0277BD", fin: "#4FC3F7", iris: "#E53935" },
  { body: "#FFD54F", shade: "#F57F17", fin: "#FFE082", iris: "#5C6BC0" },
  { body: "#66BB6A", shade: "#2E7D32", fin: "#A5D6A7", iris: "#E53935" },
  { body: "#EC407A", shade: "#880E4F", fin: "#F48FB1", iris: "#1565C0" },
];

export function FishSVG({ variant, className }: SvgProps) {
  const c = FISH[variant % FISH.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* tail */}
      <path d="M 95 60 L 115 40 L 115 80 Z" fill={c.shade} stroke={c.shade} strokeWidth="1" />
      {/* body */}
      <ellipse cx="58" cy="60" rx="42" ry="28" fill={c.body} stroke={c.shade} strokeWidth="2.5" />
      {/* belly */}
      <ellipse cx="52" cy="64" rx="28" ry="16" fill={c.fin} opacity="0.5" />
      {/* top fin */}
      <path d="M 40 32 Q 55 22 70 32" fill={c.shade} stroke={c.shade} strokeWidth="1" />
      {/* scales */}
      <path d="M 55 48 Q 65 44 70 52" stroke={c.shade} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M 65 55 Q 75 51 80 59" stroke={c.shade} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* eye */}
      <Eye cx={30} cy={54} r={10} irisColor={c.iris} />
      {/* mouth */}
      <path d="M 14 60 Q 18 65 14 70" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* bubbles */}
      <circle cx="12" cy="38" r="4" fill="none" stroke={c.shade} strokeWidth="1.5" />
      <circle cx="20" cy="26" r="2.5" fill="none" stroke={c.shade} strokeWidth="1.5" />
    </svg>
  );
}

// ── CUPCAKE (Baking) ──────────────────────────────────────────────────────────
const CUPCAKE = [
  { frosting: "#EC407A", base: "#FF8A65", wrapper: "#F48FB1", sprinkle: "#FFD54F" },
  { frosting: "#AB47BC", base: "#CE93D8", wrapper: "#E1BEE7", sprinkle: "#FFEB3B" },
  { frosting: "#42A5F5", base: "#90CAF9", wrapper: "#BBDEFB", sprinkle: "#FF8A65" },
  { frosting: "#EF5350", base: "#FFCDD2", wrapper: "#FFEBEE", sprinkle: "#66BB6A" },
  { frosting: "#66BB6A", base: "#A5D6A7", wrapper: "#E8F5E9", sprinkle: "#EC407A" },
];

export function CupcakeSVG({ variant, className }: SvgProps) {
  const c = CUPCAKE[variant % CUPCAKE.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* wrapper */}
      <path d="M 28 72 L 36 108 L 84 108 L 92 72 Z" fill={c.wrapper} stroke="#1a1a1a" strokeWidth="2" />
      {/* wrapper lines */}
      <line x1="48" y1="72" x2="44" y2="108" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />
      <line x1="60" y1="72" x2="60" y2="108" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />
      <line x1="72" y1="72" x2="76" y2="108" stroke="#1a1a1a" strokeWidth="1" opacity="0.3" />
      {/* cake body */}
      <rect x="28" y="65" width="64" height="12" rx="4" fill={c.base} stroke="#1a1a1a" strokeWidth="2" />
      {/* frosting swirl */}
      <ellipse cx="60" cy="58" rx="34" ry="20" fill={c.frosting} stroke="#1a1a1a" strokeWidth="2" />
      <ellipse cx="60" cy="46" rx="24" ry="16" fill={c.frosting} stroke="#1a1a1a" strokeWidth="2" />
      <ellipse cx="60" cy="36" rx="14" ry="12" fill={c.frosting} stroke="#1a1a1a" strokeWidth="2" />
      {/* cherry on top */}
      <circle cx="60" cy="26" r="7" fill="#E53935" stroke="#B71C1C" strokeWidth="1.5" />
      <path d="M 60 26 Q 68 16 72 12" stroke="#43A047" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* face */}
      <Eye cx={50} cy={52} r={6} irisColor={c.base} />
      <Eye cx={70} cy={52} r={6} irisColor={c.base} />
      <Smile cx={60} cy={60} w={7} />
      {/* sprinkles */}
      <rect x="44" y="55" width="6" height="2.5" rx="1" fill={c.sprinkle} transform="rotate(-30 44 55)" />
      <rect x="68" y="48" width="6" height="2.5" rx="1" fill="#FFFFFF" transform="rotate(20 68 48)" />
      <rect x="55" y="43" width="6" height="2.5" rx="1" fill={c.sprinkle} transform="rotate(10 55 43)" />
    </svg>
  );
}

// ── RAINBOW CLOUD ─────────────────────────────────────────────────────────────
const RAINBOW_COLORS = ["#EF5350", "#FF8A65", "#FFD54F", "#66BB6A", "#42A5F5", "#7E57C2"];

export function RainbowSVG({ variant, className }: SvgProps) {
  const offsets = [0, 1, 2, 3, 4];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* rainbow arcs */}
      {offsets.map((i) => (
        <path
          key={i}
          d={`M ${14 + i * 6} 72 A ${46 - i * 6} ${46 - i * 6} 0 0 1 ${106 - i * 6} 72`}
          fill="none"
          stroke={RAINBOW_COLORS[i]}
          strokeWidth="7"
          strokeLinecap="round"
        />
      ))}
      {/* main cloud */}
      <ellipse cx="60" cy="76" rx="36" ry="22" fill="white" stroke="#B0BEC5" strokeWidth="2" />
      <circle cx="40" cy="68" r="18" fill="white" stroke="#B0BEC5" strokeWidth="2" />
      <circle cx="62" cy="62" r="22" fill="white" stroke="#B0BEC5" strokeWidth="2" />
      <circle cx="82" cy="68" r="16" fill="white" stroke="#B0BEC5" strokeWidth="2" />
      {/* face */}
      <Eye cx={52} cy={74} r={7} irisColor="#29B6F6" />
      <Eye cx={70} cy={74} r={7} irisColor="#29B6F6" />
      <Smile cx={61} cy={82} w={8} />
      {/* rosy cheeks */}
      <circle cx="42" cy="80" r="5" fill="#FF8A65" opacity="0.35" />
      <circle cx="80" cy="80" r="5" fill="#FF8A65" opacity="0.35" />
    </svg>
  );
}

// ── TRAIN ─────────────────────────────────────────────────────────────────────
const TRAIN = [
  { body: "#EF5350", shade: "#B71C1C", window: "#B3E5FC", wheel: "#424242" },
  { body: "#42A5F5", shade: "#1565C0", window: "#FFECB3", wheel: "#424242" },
  { body: "#66BB6A", shade: "#2E7D32", window: "#FCE4EC", wheel: "#424242" },
  { body: "#FF8A65", shade: "#BF360C", window: "#E8EAF6", wheel: "#424242" },
  { body: "#7E57C2", shade: "#4527A0", window: "#E8F5E9", wheel: "#424242" },
];

export function TrainSVG({ variant, className }: SvgProps) {
  const c = TRAIN[variant % TRAIN.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* steam puffs */}
      <circle cx="34" cy="22" r="8" fill="white" stroke="#B0BEC5" strokeWidth="1.5" opacity="0.85" />
      <circle cx="46" cy="14" r="6" fill="white" stroke="#B0BEC5" strokeWidth="1.5" opacity="0.7" />
      <circle cx="56" cy="9" r="4" fill="white" stroke="#B0BEC5" strokeWidth="1.5" opacity="0.55" />
      {/* smokestack */}
      <rect x="28" y="26" width="12" height="14" rx="3" fill={c.shade} />
      {/* body */}
      <rect x="14" y="40" width="92" height="52" rx="12" fill={c.body} stroke={c.shade} strokeWidth="2.5" />
      {/* front face panel */}
      <rect x="14" y="40" width="38" height="52" rx="12" fill={c.shade} opacity="0.25" />
      {/* windows */}
      <rect x="22" y="50" width="22" height="18" rx="6" fill={c.window} stroke={c.shade} strokeWidth="1.5" />
      <rect x="56" y="50" width="20" height="18" rx="5" fill={c.window} stroke={c.shade} strokeWidth="1.5" />
      <rect x="82" y="50" width="16" height="18" rx="5" fill={c.window} stroke={c.shade} strokeWidth="1.5" />
      {/* face in front window */}
      <Eye cx={30} cy={58} r={5} irisColor={c.window} />
      <Eye cx={40} cy={58} r={5} irisColor={c.window} />
      <Smile cx={35} cy={65} w={6} />
      {/* wheels */}
      {[22, 48, 72, 96].map((x) => (
        <g key={x}>
          <circle cx={x} cy={96} r={12} fill={c.wheel} stroke="#1a1a1a" strokeWidth="2" />
          <circle cx={x} cy={96} r={5} fill="#757575" />
          <circle cx={x} cy={96} r={2} fill={c.body} />
        </g>
      ))}
    </svg>
  );
}

// ── BUTTERFLY (Nature) ────────────────────────────────────────────────────────
const BUTTERFLY = [
  { wing1: "#FF8A65", wing2: "#FFD54F", body: "#5D4037", spot: "#FFFFFF" },
  { wing1: "#7E57C2", wing2: "#EC407A", body: "#4A148C", spot: "#FFD54F" },
  { wing1: "#29B6F6", wing2: "#66BB6A", body: "#01579B", spot: "#FFFFFF" },
  { wing1: "#EF5350", wing2: "#AB47BC", body: "#B71C1C", spot: "#FFEB3B" },
  { wing1: "#26C6DA", wing2: "#FF8A65", body: "#006064", spot: "#FFFFFF" },
];

export function ButterflySVG({ variant, className }: SvgProps) {
  const c = BUTTERFLY[variant % BUTTERFLY.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* left upper wing */}
      <path d="M 60 55 Q 10 20 14 60 Q 18 80 60 70 Z" fill={c.wing1} stroke={c.body} strokeWidth="1.5" />
      {/* right upper wing */}
      <path d="M 60 55 Q 110 20 106 60 Q 102 80 60 70 Z" fill={c.wing1} stroke={c.body} strokeWidth="1.5" />
      {/* left lower wing */}
      <path d="M 60 70 Q 22 80 26 105 Q 44 110 60 85 Z" fill={c.wing2} stroke={c.body} strokeWidth="1.5" />
      {/* right lower wing */}
      <path d="M 60 70 Q 98 80 94 105 Q 76 110 60 85 Z" fill={c.wing2} stroke={c.body} strokeWidth="1.5" />
      {/* wing spots */}
      <circle cx="38" cy="52" r="7" fill={c.spot} opacity="0.6" />
      <circle cx="82" cy="52" r="7" fill={c.spot} opacity="0.6" />
      <circle cx="38" cy="90" r="5" fill={c.spot} opacity="0.5" />
      <circle cx="82" cy="90" r="5" fill={c.spot} opacity="0.5" />
      {/* body */}
      <ellipse cx="60" cy="70" rx="6" ry="24" fill={c.body} stroke="#1a1a1a" strokeWidth="1.5" />
      {/* head */}
      <circle cx="60" cy="44" r="10" fill={c.body} stroke="#1a1a1a" strokeWidth="1.5" />
      {/* antennae */}
      <path d="M 56 36 Q 46 24 40 18" stroke={c.body} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="18" r="3" fill={c.wing1} />
      <path d="M 64 36 Q 74 24 80 18" stroke={c.body} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <circle cx="80" cy="18" r="3" fill={c.wing1} />
      {/* face */}
      <Eye cx={55} cy={44} r={4} irisColor={c.wing1} />
      <Eye cx={65} cy={44} r={4} irisColor={c.wing1} />
    </svg>
  );
}

// ── FROG ─────────────────────────────────────────────────────────────────────
const FROG = [
  { body: "#43A047", shade: "#1B5E20", belly: "#A5D6A7", iris: "#FFEB3B" },
  { body: "#26C6DA", shade: "#006064", belly: "#B2EBF2", iris: "#FF8A65" },
  { body: "#7CB342", shade: "#33691E", belly: "#DCEDC8", iris: "#FF5722" },
  { body: "#66BB6A", shade: "#2E7D32", belly: "#E8F5E9", iris: "#FF9800" },
  { body: "#29B6F6", shade: "#01579B", belly: "#E1F5FE", iris: "#FFD54F" },
];

export function FrogSVG({ variant, className }: SvgProps) {
  const c = FROG[variant % FROG.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* body */}
      <ellipse cx="60" cy="88" rx="38" ry="26" fill={c.body} stroke={c.shade} strokeWidth="2.5" />
      {/* belly */}
      <ellipse cx="60" cy="92" rx="24" ry="17" fill={c.belly} />
      {/* head */}
      <ellipse cx="60" cy="62" rx="34" ry="26" fill={c.body} stroke={c.shade} strokeWidth="2.5" />
      {/* eye sockets on top */}
      <circle cx="40" cy="44" r="14" fill={c.body} stroke={c.shade} strokeWidth="2.5" />
      <circle cx="80" cy="44" r="14" fill={c.body} stroke={c.shade} strokeWidth="2.5" />
      {/* eyes */}
      <Eye cx={40} cy={44} r={10} irisColor={c.iris} />
      <Eye cx={80} cy={44} r={10} irisColor={c.iris} />
      {/* nostrils */}
      <circle cx="54" cy="62" r="3" fill={c.shade} />
      <circle cx="66" cy="62" r="3" fill={c.shade} />
      {/* wide smile */}
      <path d="M 34 72 Q 60 88 86 72" stroke="#1a1a1a" strokeWidth="2.5" fill={c.belly} strokeLinecap="round" />
      {/* front legs */}
      <path d="M 22 88 Q 10 100 16 110" stroke={c.body} strokeWidth="8" fill="none" strokeLinecap="round" />
      <path d="M 98 88 Q 110 100 104 110" stroke={c.body} strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ── GAME CONTROLLER (Gaming) ──────────────────────────────────────────────────
const CONTROLLER = [
  { body: "#7E57C2", shade: "#4527A0", btn1: "#EF5350", btn2: "#66BB6A", btn3: "#FFD54F", btn4: "#42A5F5" },
  { body: "#424242", shade: "#212121", btn1: "#EF5350", btn2: "#66BB6A", btn3: "#FFD54F", btn4: "#42A5F5" },
  { body: "#1E88E5", shade: "#0D47A1", btn1: "#EC407A", btn2: "#FFD54F", btn3: "#66BB6A", btn4: "#EF5350" },
  { body: "#E53935", shade: "#B71C1C", btn1: "#FFD54F", btn2: "#42A5F5", btn3: "#66BB6A", btn4: "#AB47BC" },
  { body: "#00897B", shade: "#004D40", btn1: "#EF5350", btn2: "#FFD54F", btn3: "#42A5F5", btn4: "#FF8A65" },
];

export function ControllerSVG({ variant, className }: SvgProps) {
  const c = CONTROLLER[variant % CONTROLLER.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* body */}
      <path d="M 16 55 Q 14 38 32 36 L 88 36 Q 106 38 104 55 L 96 90 Q 92 108 76 106 Q 66 104 60 94 Q 54 104 44 106 Q 28 108 24 90 Z"
        fill={c.body} stroke={c.shade} strokeWidth="2.5" />
      {/* face */}
      <Eye cx={42} cy={60} r={7} irisColor={c.shade} />
      <Eye cx={78} cy={60} r={7} irisColor={c.shade} />
      <Smile cx={60} cy={72} w={10} />
      {/* d-pad */}
      <rect x="24" y="56" width="24" height="8" rx="3" fill={c.shade} opacity="0.6" />
      <rect x="32" y="48" width="8" height="24" rx="3" fill={c.shade} opacity="0.6" />
      {/* buttons */}
      <circle cx="88" cy="54" r="6" fill={c.btn1} stroke={c.shade} strokeWidth="1.5" />
      <circle cx="96" cy="62" r="6" fill={c.btn2} stroke={c.shade} strokeWidth="1.5" />
      <circle cx="80" cy="62" r="6" fill={c.btn3} stroke={c.shade} strokeWidth="1.5" />
      <circle cx="88" cy="70" r="6" fill={c.btn4} stroke={c.shade} strokeWidth="1.5" />
      {/* center buttons */}
      <rect x="52" y="50" width="7" height="5" rx="2" fill={c.shade} opacity="0.5" />
      <rect x="61" y="50" width="7" height="5" rx="2" fill={c.shade} opacity="0.5" />
    </svg>
  );
}

// ── SUN (Beach) ───────────────────────────────────────────────────────────────
const SUN = [
  { body: "#FFD54F", shade: "#F57F17", glass: "#42A5F5", wave: "#29B6F6" },
  { body: "#FFA726", shade: "#E65100", glass: "#7E57C2", wave: "#26C6DA" },
  { body: "#FFEB3B", shade: "#F9A825", glass: "#EF5350", wave: "#29B6F6" },
  { body: "#FFD54F", shade: "#FF6F00", glass: "#66BB6A", wave: "#00ACC1" },
  { body: "#FFF176", shade: "#F57F17", glass: "#EC407A", wave: "#29B6F6" },
];

export function SunSVG({ variant, className }: SvgProps) {
  const c = SUN[variant % SUN.length];
  const rays = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* rays */}
      {rays.map((angle) => (
        <line
          key={angle}
          x1="60" y1="60"
          x2={60 + 46 * Math.cos((angle * Math.PI) / 180)}
          y2={60 + 46 * Math.sin((angle * Math.PI) / 180)}
          stroke={c.shade}
          strokeWidth="5"
          strokeLinecap="round"
        />
      ))}
      {/* body */}
      <circle cx="60" cy="60" r="30" fill={c.body} stroke={c.shade} strokeWidth="2.5" />
      {/* sunglasses bar */}
      <rect x="34" y="54" width="52" height="4" rx="2" fill="#1a1a1a" />
      {/* left lens */}
      <rect x="32" y="50" width="22" height="16" rx="6" fill={c.glass} stroke="#1a1a1a" strokeWidth="2" />
      <rect x="32" y="50" width="22" height="16" rx="6" fill="white" opacity="0.25" />
      {/* right lens */}
      <rect x="66" y="50" width="22" height="16" rx="6" fill={c.glass} stroke="#1a1a1a" strokeWidth="2" />
      <rect x="66" y="50" width="22" height="16" rx="6" fill="white" opacity="0.25" />
      {/* smile */}
      <Smile cx={60} cy={72} w={10} />
      {/* rosy cheeks */}
      <circle cx="42" cy="72" r="5" fill="#FF8A65" opacity="0.4" />
      <circle cx="78" cy="72" r="5" fill="#FF8A65" opacity="0.4" />
    </svg>
  );
}

// ── TENT (Camping) ────────────────────────────────────────────────────────────
const TENT = [
  { tent: "#8D6E63", shade: "#4E342E", fire: "#FF7043", sky: "#283593" },
  { tent: "#546E7A", shade: "#263238", fire: "#FF5722", sky: "#1A237E" },
  { tent: "#5D4037", shade: "#3E2723", fire: "#FF8A65", sky: "#0D47A1" },
  { tent: "#558B2F", shade: "#1B5E20", fire: "#FF7043", sky: "#1A237E" },
  { tent: "#6D4C41", shade: "#4E342E", fire: "#FFA726", sky: "#283593" },
];

export function TentSVG({ variant, className }: SvgProps) {
  const c = TENT[variant % TENT.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* sky background */}
      <rect x="0" y="0" width="120" height="80" rx="8" fill={c.sky} opacity="0.15" />
      {/* stars */}
      <circle cx="20" cy="18" r="2" fill="#FFD54F" />
      <circle cx="50" cy="12" r="1.5" fill="#FFD54F" />
      <circle cx="80" cy="20" r="2" fill="#FFD54F" />
      <circle cx="100" cy="14" r="1.5" fill="#FFD54F" />
      <circle cx="35" cy="30" r="1.5" fill="#FFD54F" />
      {/* tent */}
      <polygon points="60,18 14,82 106,82" fill={c.tent} stroke={c.shade} strokeWidth="2.5" />
      {/* tent door */}
      <path d="M 46 82 Q 60 58 74 82 Z" fill={c.shade} opacity="0.5" />
      {/* tent line */}
      <line x1="60" y1="18" x2="60" y2="82" stroke={c.shade} strokeWidth="1.5" opacity="0.4" />
      {/* ground */}
      <rect x="0" y="82" width="120" height="10" rx="0" fill="#795548" opacity="0.3" />
      {/* campfire */}
      <ellipse cx="96" cy="96" rx="10" ry="4" fill="#5D4037" />
      <path d="M 88 96 L 92 80 L 96 88 L 100 76 L 104 90 L 108 96 Z" fill={c.fire} />
      <path d="M 91 96 L 94 84 L 96 90 L 99 82 L 102 92 Z" fill="#FFD54F" />
    </svg>
  );
}

// ── PALETTE (Art) ─────────────────────────────────────────────────────────────
const PALETTE_COLORS = [
  { base: "#FF7043", handle: "#5D4037" },
  { base: "#7E57C2", handle: "#4A148C" },
  { base: "#29B6F6", handle: "#01579B" },
  { base: "#66BB6A", handle: "#2E7D32" },
  { base: "#EC407A", handle: "#880E4F" },
];
const PAINT_DOTS = ["#EF5350", "#FFD54F", "#66BB6A", "#42A5F5", "#AB47BC", "#FF8A65"];

export function ArtSVG({ variant, className }: SvgProps) {
  const c = PALETTE_COLORS[variant % PALETTE_COLORS.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* paintbrush */}
      <rect x="76" y="8" width="8" height="52" rx="4" fill={c.handle} />
      <rect x="74" y="56" width="12" height="10" rx="2" fill="#B0BEC5" />
      <path d="M 74 66 Q 80 90 80 96 Q 80 90 86 66 Z" fill={c.base} />
      {/* palette */}
      <ellipse cx="50" cy="72" rx="40" ry="34" fill="white" stroke="#B0BEC5" strokeWidth="2.5" />
      <ellipse cx="50" cy="72" rx="40" ry="34" fill={c.base} opacity="0.08" />
      {/* thumb hole */}
      <circle cx="60" cy="88" r="8" fill="white" stroke="#B0BEC5" strokeWidth="2" />
      {/* paint dots */}
      {PAINT_DOTS.map((color, i) => {
        const angle = (i / PAINT_DOTS.length) * Math.PI * 1.4 + Math.PI * 0.1;
        const r = 26;
        return (
          <circle
            key={i}
            cx={50 + r * Math.cos(angle)}
            cy={72 + r * 0.7 * Math.sin(angle)}
            r={7}
            fill={color}
            stroke="white"
            strokeWidth="1.5"
          />
        );
      })}
      {/* face on palette */}
      <Eye cx={40} cy={66} r={6} irisColor={c.base} />
      <Eye cx={58} cy={66} r={6} irisColor={c.base} />
      <Smile cx={49} cy={76} w={8} />
    </svg>
  );
}

// ── HEADPHONES (Music) ────────────────────────────────────────────────────────
const HEADPHONE = [
  { band: "#EC407A", cup: "#C2185B", skin: "#FFCCBC", note: "#FFD54F" },
  { band: "#7E57C2", cup: "#4527A0", skin: "#FFCCBC", note: "#FF8A65" },
  { band: "#1E88E5", cup: "#0D47A1", skin: "#FFCCBC", note: "#FFD54F" },
  { band: "#43A047", cup: "#1B5E20", skin: "#FFCCBC", note: "#FF8A65" },
  { band: "#FF7043", cup: "#BF360C", skin: "#FFCCBC", note: "#FFD54F" },
];

export function MusicSVG({ variant, className }: SvgProps) {
  const c = HEADPHONE[variant % HEADPHONE.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* head */}
      <circle cx="60" cy="64" r="32" fill={c.skin} stroke="#1a1a1a" strokeWidth="2" />
      {/* headband */}
      <path d="M 22 62 Q 24 22 60 20 Q 96 22 98 62" fill="none" stroke={c.band} strokeWidth="8" strokeLinecap="round" />
      {/* left cup */}
      <rect x="12" y="56" width="18" height="26" rx="9" fill={c.cup} stroke="#1a1a1a" strokeWidth="2" />
      {/* right cup */}
      <rect x="90" y="56" width="18" height="26" rx="9" fill={c.cup} stroke="#1a1a1a" strokeWidth="2" />
      {/* face */}
      <Eye cx={48} cy={60} r={8} irisColor={c.band} />
      <Eye cx={72} cy={60} r={8} irisColor={c.band} />
      <Smile cx={60} cy={74} w={10} />
      {/* rosy cheeks */}
      <circle cx="38" cy="72" r="6" fill="#FF8A65" opacity="0.35" />
      <circle cx="82" cy="72" r="6" fill="#FF8A65" opacity="0.35" />
      {/* music notes floating */}
      <text x="94" y="36" fontSize="16" fill={c.note}>♪</text>
      <text x="14" y="30" fontSize="12" fill={c.note}>♫</text>
    </svg>
  );
}

// ── PIZZA SLICE (Food) ────────────────────────────────────────────────────────
const PIZZA = [
  { crust: "#D4A76A", cheese: "#FFD54F", sauce: "#EF5350", topping: "#C62828" },
  { crust: "#BCAAA4", cheese: "#FFF9C4", sauce: "#FF7043", topping: "#795548" },
  { crust: "#D4A76A", cheese: "#FFF176", sauce: "#FF5722", topping: "#6D4C41" },
  { crust: "#A1887F", cheese: "#FFD54F", sauce: "#E53935", topping: "#4E342E" },
  { crust: "#D4A76A", cheese: "#FFEE58", sauce: "#FF8A65", topping: "#BF360C" },
];

export function FoodSVG({ variant, className }: SvgProps) {
  const c = PIZZA[variant % PIZZA.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* crust (outer) */}
      <path d="M 10 108 L 60 12 L 110 108 Z" fill={c.crust} stroke={c.topping} strokeWidth="2.5" />
      {/* cheese/sauce fill */}
      <path d="M 22 100 L 60 26 L 98 100 Z" fill={c.sauce} />
      <path d="M 26 100 L 60 32 L 94 100 Z" fill={c.cheese} />
      {/* toppings */}
      <circle cx="60" cy="58" r="7" fill={c.topping} />
      <circle cx="44" cy="76" r="6" fill={c.topping} />
      <circle cx="76" cy="76" r="6" fill={c.topping} />
      <circle cx="60" cy="86" r="5" fill={c.topping} />
      {/* face */}
      <Eye cx={50} cy={70} r={6} irisColor={c.sauce} />
      <Eye cx={70} cy={70} r={6} irisColor={c.sauce} />
      <Smile cx={60} cy={82} w={8} />
      {/* steam lines */}
      <path d="M 48 10 Q 52 4 48 0" stroke="#B0BEC5" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 60 8 Q 64 2 60 -2" stroke="#B0BEC5" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 72 10 Q 76 4 72 0" stroke="#B0BEC5" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ── AIRPLANE (Travel) ─────────────────────────────────────────────────────────
const PLANE = [
  { body: "#29B6F6", shade: "#0277BD", wing: "#B3E5FC", trail: "#ECEFF1" },
  { body: "#EF5350", shade: "#B71C1C", wing: "#FFCDD2", trail: "#ECEFF1" },
  { body: "#66BB6A", shade: "#2E7D32", wing: "#C8E6C9", trail: "#ECEFF1" },
  { body: "#7E57C2", shade: "#4527A0", wing: "#EDE7F6", trail: "#ECEFF1" },
  { body: "#FF8A65", shade: "#BF360C", wing: "#FFCCBC", trail: "#ECEFF1" },
];

export function PlaneSVG({ variant, className }: SvgProps) {
  const c = PLANE[variant % PLANE.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* contrail */}
      <path d="M 8 72 Q 30 68 50 70" stroke={c.trail} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8" />
      <path d="M 14 82 Q 32 78 48 80" stroke={c.trail} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.6" />
      {/* clouds */}
      <ellipse cx="18" cy="30" rx="14" ry="9" fill="white" opacity="0.8" />
      <circle cx="12" cy="26" r="7" fill="white" opacity="0.8" />
      <circle cx="24" cy="25" r="9" fill="white" opacity="0.8" />
      {/* main body */}
      <path d="M 50 60 Q 100 50 112 60 Q 100 70 50 60 Z" fill={c.body} stroke={c.shade} strokeWidth="2" />
      {/* nose */}
      <path d="M 108 60 Q 118 56 118 60 Q 118 64 108 60 Z" fill={c.shade} />
      {/* cockpit window */}
      <ellipse cx="100" cy="58" rx="7" ry="5" fill={c.wing} stroke={c.shade} strokeWidth="1.5" />
      {/* face in window */}
      <Eye cx={97} cy={58} r={3} irisColor={c.shade} />
      <Eye cx={104} cy={58} r={3} irisColor={c.shade} />
      {/* main wings */}
      <path d="M 72 60 L 58 30 L 86 52 Z" fill={c.wing} stroke={c.shade} strokeWidth="1.5" />
      <path d="M 72 60 L 58 90 L 86 68 Z" fill={c.wing} stroke={c.shade} strokeWidth="1.5" />
      {/* tail fins */}
      <path d="M 52 60 L 44 46 L 58 58 Z" fill={c.shade} opacity="0.8" />
      <path d="M 52 60 L 44 74 L 58 62 Z" fill={c.shade} opacity="0.8" />
    </svg>
  );
}

// ── BASKETBALL (Sports) ───────────────────────────────────────────────────────
const BBALL = [
  { ball: "#FF6F00", stripe: "#1a1a1a", jersey: "#E53935", number: "#FFFFFF" },
  { ball: "#FF8A65", stripe: "#1a1a1a", jersey: "#1E88E5", number: "#FFFFFF" },
  { ball: "#FF6F00", stripe: "#1a1a1a", jersey: "#7B1FA2", number: "#FFD54F" },
  { ball: "#FF7043", stripe: "#1a1a1a", jersey: "#2E7D32", number: "#FFFFFF" },
  { ball: "#FF6F00", stripe: "#1a1a1a", jersey: "#F57F17", number: "#1a1a1a" },
];

export function BasketballSVG({ variant, className }: SvgProps) {
  const c = BBALL[variant % BBALL.length];
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* body / jersey */}
      <rect x="32" y="62" width="56" height="50" rx="10" fill={c.jersey} stroke="#1a1a1a" strokeWidth="2" />
      {/* jersey number */}
      <text x="60" y="94" textAnchor="middle" fontSize="20" fontWeight="bold" fill={c.number} fontFamily="sans-serif">23</text>
      {/* arms reaching up */}
      <ellipse cx="18" cy="52" rx="12" ry="7" fill={c.jersey} stroke="#1a1a1a" strokeWidth="2" transform="rotate(-50 18 52)" />
      <ellipse cx="102" cy="52" rx="12" ry="7" fill={c.jersey} stroke="#1a1a1a" strokeWidth="2" transform="rotate(50 102 52)" />
      {/* hands */}
      <circle cx="10" cy="40" r="8" fill="#FFCCBC" stroke="#1a1a1a" strokeWidth="1.5" />
      <circle cx="110" cy="40" r="8" fill="#FFCCBC" stroke="#1a1a1a" strokeWidth="1.5" />
      {/* neck */}
      <rect x="50" y="54" width="20" height="12" rx="4" fill="#FFCCBC" />
      {/* head */}
      <circle cx="60" cy="40" r="22" fill="#FFCCBC" stroke="#1a1a1a" strokeWidth="2" />
      {/* headband */}
      <path d="M 38 34 Q 60 28 82 34" stroke={c.jersey} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* eyes */}
      <Eye cx={50} cy={38} r={7} irisColor={c.jersey} />
      <Eye cx={70} cy={38} r={7} irisColor={c.jersey} />
      {/* big smile */}
      <Smile cx={60} cy={50} w={10} />
      {/* basketball */}
      <circle cx="96" cy="28" r="14" fill={c.ball} stroke={c.stripe} strokeWidth="1.5" />
      <path d="M 82 28 Q 96 22 110 28" stroke={c.stripe} strokeWidth="1.5" fill="none" />
      <path d="M 82 28 Q 96 34 110 28" stroke={c.stripe} strokeWidth="1.5" fill="none" />
      <line x1="96" y1="14" x2="96" y2="42" stroke={c.stripe} strokeWidth="1.5" />
    </svg>
  );
}

// ── STAR (generic fallback for any unrecognized custom theme) ─────────────────
const STAR_COLORS = [
  { body: "#FFD54F", shade: "#F57F17", iris: "#EF5350" },
  { body: "#FF8A65", shade: "#BF360C", iris: "#5C6BC0" },
  { body: "#AB47BC", shade: "#6A1B9A", iris: "#FFD54F" },
  { body: "#42A5F5", shade: "#1565C0", iris: "#FF8A65" },
  { body: "#66BB6A", shade: "#2E7D32", iris: "#FF5722" },
];

export function StarSVG({ variant, className }: SvgProps) {
  const c = STAR_COLORS[variant % STAR_COLORS.length];
  const pts = Array.from({ length: 5 }, (_, i) => {
    const outer = ((i * 72 - 90) * Math.PI) / 180;
    const inner = ((i * 72 - 90 + 36) * Math.PI) / 180;
    return [
      `${60 + 46 * Math.cos(outer)},${60 + 46 * Math.sin(outer)}`,
      `${60 + 20 * Math.cos(inner)},${60 + 20 * Math.sin(inner)}`,
    ];
  }).flat().join(" ");
  return (
    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* star shape */}
      <polygon points={pts} fill={c.body} stroke={c.shade} strokeWidth="2.5" strokeLinejoin="round" />
      {/* shine */}
      <polygon points={pts} fill="white" opacity="0.15" />
      {/* face */}
      <Eye cx={50} cy={56} r={7} irisColor={c.iris} />
      <Eye cx={70} cy={56} r={7} irisColor={c.iris} />
      <Smile cx={60} cy={68} w={9} />
      {/* rosy cheeks */}
      <circle cx="40" cy="66" r="5" fill="#FF8A65" opacity="0.35" />
      <circle cx="80" cy="66" r="5" fill="#FF8A65" opacity="0.35" />
      {/* sparkles */}
      <circle cx="20" cy="20" r="3" fill={c.body} opacity="0.7" />
      <circle cx="100" cy="18" r="2" fill={c.body} opacity="0.7" />
      <circle cx="14" cy="90" r="2.5" fill={c.body} opacity="0.6" />
    </svg>
  );
}

// ── MASTER SELECTOR ───────────────────────────────────────────────────────────

const SVG_MAP: Record<string, React.ComponentType<SvgProps>> = {
  dinosaurs: DinoSVG,
  space: RocketSVG,
  pets: DogSVG,
  superheroes: HeroSVG,
  ocean: FishSVG,
  baking: CupcakeSVG,
  rainbows: RainbowSVG,
  trains: TrainSVG,
  nature: ButterflySVG,
  frogs: FrogSVG,
  gaming: ControllerSVG,
  beach: SunSVG,
  camping: TentSVG,
  art: ArtSVG,
  music: MusicSVG,
  food: FoodSVG,
  travel: PlaneSVG,
  sports: BasketballSVG,
};

// Keyword matching for custom themes typed by users
function matchByKeyword(theme: string): React.ComponentType<SvgProps> | null {
  const t = theme.toLowerCase();
  if (/mario|luigi|bowser|yoshi|peach|nintendo|zelda|pokemon|pikachu|kirby/.test(t)) return ControllerSVG;
  if (/basket|nba|football|soccer|baseball|sport|athlete|lebron|curry|dunk/.test(t)) return BasketballSVG;
  if (/minecraft|roblox|fortnite|gamer|video game|playstation|xbox/.test(t)) return ControllerSVG;
  if (/star wars|jedi|sith|galaxy|nasa|astronaut|alien|rocket/.test(t)) return RocketSVG;
  if (/mermaid|shark|whale|dolphin|underwater|coral|fish/.test(t)) return FishSVG;
  if (/cook|bak|cake|cookie|cupcake|chef|dessert/.test(t)) return CupcakeSVG;
  if (/cat|dog|puppy|kitten|bunny|rabbit|hamster|guinea/.test(t)) return DogSVG;
  if (/superhero|marvel|dc|spider|batman|avenger|captain|wonder woman/.test(t)) return HeroSVG;
  if (/dino|t-rex|jurassic|raptor|prehistoric/.test(t)) return DinoSVG;
  if (/music|song|sing|guitar|piano|drum|concert/.test(t)) return MusicSVG;
  if (/draw|paint|color|craft|sketch|art/.test(t)) return ArtSVG;
  if (/pizza|burger|taco|sushi|restaurant|snack/.test(t)) return FoodSVG;
  if (/beach|surf|swim|pool|summer|tropical/.test(t)) return SunSVG;
  if (/plane|fly|airport|vacation|trip|travel/.test(t)) return PlaneSVG;
  if (/camp|hike|forest|mountain|outdoor/.test(t)) return TentSVG;
  if (/butterfly|flower|garden|plant|bug|insect/.test(t)) return ButterflySVG;
  if (/frog|toad|pond|tadpole/.test(t)) return FrogSVG;
  if (/train|railroad|locomotive|subway/.test(t)) return TrainSVG;
  if (/rainbow|unicorn|magic|fairy|color/.test(t)) return RainbowSVG;
  return null;
}

export function ThemeSVG({
  theme,
  worksheetId,
  className,
}: {
  theme?: string | null;
  worksheetId: string;
  className?: string;
}) {
  if (!theme) return null;

  const key = theme.toLowerCase();

  // Deterministic variant: stable per worksheet, different across worksheets
  const hash = worksheetId
    .split("")
    .reduce((h, c) => (h * 31 + c.charCodeAt(0)) & 0xffff, 0);
  const variant = hash % 5;

  // 1. Exact preset match
  const Exact = SVG_MAP[key];
  if (Exact) return <Exact variant={variant} className={className} />;

  // 2. Keyword match for custom themes (e.g. "Mario", "NBA", "Minecraft")
  const Keyword = matchByKeyword(key);
  if (Keyword) return <Keyword variant={variant} className={className} />;

  // 3. Fallback: star character — always show something fun
  return <StarSVG variant={variant} className={className} />;
}
