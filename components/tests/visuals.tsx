import type { TestVisual, WorksheetVisual } from "@/types";

export function TestVisualRenderer({ visual }: { visual: TestVisual }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = visual.data as any;
  switch (visual.type) {
    case "clock":
      return <ClockVisual data={d} />;
    case "number_line":
      return <NumberLineVisual data={d} />;
    case "fraction_model":
      return <FractionModelVisual data={d} />;
    case "shape":
      return <ShapeVisual data={d} />;
    case "dot_array":
      return <DotArrayVisual data={d} />;
    default:
      return null;
  }
}

// ─── Clock ───────────────────────────────────────────────────────────────────

interface ClockData {
  hours: number;
  minutes: number;
}

function ClockVisual({ data }: { data: ClockData }) {
  const { hours, minutes } = data;
  const cx = 60, cy = 60, r = 52;

  const hourAngle = ((hours % 12) + minutes / 60) * 30 * (Math.PI / 180);
  const minuteAngle = minutes * 6 * (Math.PI / 180);

  const hourLen = r * 0.52;
  const minuteLen = r * 0.76;

  const hx = cx + hourLen * Math.sin(hourAngle);
  const hy = cy - hourLen * Math.cos(hourAngle);
  const mx = cx + minuteLen * Math.sin(minuteAngle);
  const my = cy - minuteLen * Math.cos(minuteAngle);

  const numbers = Array.from({ length: 12 }, (_, i) => {
    const angle = (i + 1) * 30 * (Math.PI / 180);
    const nr = r * 0.78;
    return { num: i + 1, x: cx + nr * Math.sin(angle), y: cy - nr * Math.cos(angle) };
  });

  const ticks = Array.from({ length: 60 }, (_, i) => {
    const angle = i * 6 * (Math.PI / 180);
    const inner = i % 5 === 0 ? r * 0.87 : r * 0.93;
    return {
      x1: cx + inner * Math.sin(angle),
      y1: cy - inner * Math.cos(angle),
      x2: cx + r * Math.sin(angle),
      y2: cy - r * Math.cos(angle),
      major: i % 5 === 0,
    };
  });

  return (
    <div className="flex justify-center my-3">
      <svg width="120" height="120" aria-label={`Clock showing ${hours}:${String(minutes).padStart(2, "0")}`}>
        <circle cx={cx} cy={cy} r={r} fill="white" stroke="#1a1a1a" strokeWidth="2.5" />
        {ticks.map((t, i) => (
          <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
            stroke="#1a1a1a" strokeWidth={t.major ? 2 : 1} />
        ))}
        {numbers.map((n) => (
          <text key={n.num} x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fontWeight="600" fontFamily="sans-serif" fill="#1a1a1a">
            {n.num}
          </text>
        ))}
        {/* Hour hand */}
        <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#1a1a1a" strokeWidth="3.5" strokeLinecap="round" />
        {/* Minute hand */}
        <line x1={cx} y1={cy} x2={mx} y2={my} stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        {/* Center */}
        <circle cx={cx} cy={cy} r="3.5" fill="#1a1a1a" />
      </svg>
    </div>
  );
}

// ─── Number Line ─────────────────────────────────────────────────────────────

interface NumberLineData {
  min: number;
  max: number;
  marked?: number[];
  label?: string;
}

function NumberLineVisual({ data }: { data: NumberLineData }) {
  const { min, max, marked = [], label } = data;
  const W = 220, H = 52, pad = 18, lineY = 28;
  const range = max - min || 1;
  const xOf = (v: number) => pad + ((v - min) / range) * (W - pad * 2);

  const ticks = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="flex flex-col items-center my-3">
      {label && <p className="text-xs text-muted-foreground mb-1">{label}</p>}
      <svg width={W} height={H} aria-label={`Number line from ${min} to ${max}`}>
        {/* Line */}
        <line x1={pad} y1={lineY} x2={W - pad} y2={lineY} stroke="#1a1a1a" strokeWidth="2" />
        {/* Left arrow */}
        <polygon points={`${pad},${lineY} ${pad + 7},${lineY - 4} ${pad + 7},${lineY + 4}`} fill="#1a1a1a" />
        {/* Right arrow */}
        <polygon points={`${W - pad},${lineY} ${W - pad - 7},${lineY - 4} ${W - pad - 7},${lineY + 4}`} fill="#1a1a1a" />

        {ticks.map((t) => {
          const x = xOf(t);
          const isMarked = marked.includes(t);
          return (
            <g key={t}>
              <line x1={x} y1={lineY - 6} x2={x} y2={lineY + 6} stroke="#1a1a1a" strokeWidth="1.5" />
              <text x={x} y={lineY + 18} textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#1a1a1a">
                {t}
              </text>
              {isMarked && <circle cx={x} cy={lineY} r="5" fill="#1a1a1a" />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Fraction Model ───────────────────────────────────────────────────────────

interface FractionModelData {
  total_parts: number;
  shaded_parts: number;
  shape: "circle" | "rectangle";
}

function FractionModelVisual({ data }: { data: FractionModelData }) {
  const { total_parts, shaded_parts, shape } = data;
  const n = Math.max(1, total_parts);
  const s = Math.min(shaded_parts, n);

  if (shape === "circle") {
    const cx = 55, cy = 55, r = 48;
    const slices = Array.from({ length: n }, (_, i) => {
      const a1 = (i / n) * 2 * Math.PI - Math.PI / 2;
      const a2 = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
      const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      const large = 1 / n > 0.5 ? 1 : 0;
      return { d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`, shaded: i < s };
    });
    return (
      <div className="flex justify-center my-3">
        <svg width="110" height="110" aria-label={`${s} out of ${n} parts shaded`}>
          {slices.map((sl, i) => (
            <path key={i} d={sl.d} fill={sl.shaded ? "#374151" : "white"} stroke="#1a1a1a" strokeWidth="1.5" />
          ))}
        </svg>
      </div>
    );
  }

  // Rectangle
  const W = 180, H = 44, pw = W / n;
  return (
    <div className="flex justify-center my-3">
      <svg width={W} height={H} aria-label={`${s} out of ${n} parts shaded`}>
        {Array.from({ length: n }, (_, i) => (
          <rect key={i} x={i * pw} y={0} width={pw} height={H}
            fill={i < s ? "#374151" : "white"} stroke="#1a1a1a" strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  );
}

// ─── Shape ────────────────────────────────────────────────────────────────────

interface ShapeData {
  shape: "rectangle" | "square" | "triangle" | "circle";
  width_label?: string;
  height_label?: string;
  side_label?: string;
  radius_label?: string;
}

function ShapeVisual({ data }: { data: ShapeData }) {
  const { shape } = data;

  if (shape === "rectangle" || shape === "square") {
    const W = 140, H = 80;
    return (
      <div className="flex justify-center my-3">
        <svg width={W + 40} height={H + 40} aria-label={`${shape}`}>
          <rect x={20} y={20} width={W} height={H} fill="white" stroke="#1a1a1a" strokeWidth="2" />
          {data.width_label && (
            <text x={20 + W / 2} y={H + 36} textAnchor="middle" fontSize="11" fontFamily="sans-serif" fill="#1a1a1a">
              {data.width_label}
            </text>
          )}
          {data.height_label && (
            <text x={8} y={20 + H / 2} textAnchor="middle" fontSize="11" fontFamily="sans-serif" fill="#1a1a1a"
              transform={`rotate(-90, 8, ${20 + H / 2})`}>
              {data.height_label}
            </text>
          )}
          {data.side_label && (
            <text x={20 + W / 2} y={H + 36} textAnchor="middle" fontSize="11" fontFamily="sans-serif" fill="#1a1a1a">
              {data.side_label}
            </text>
          )}
        </svg>
      </div>
    );
  }

  if (shape === "triangle") {
    const W = 140, H = 100;
    return (
      <div className="flex justify-center my-3">
        <svg width={W + 20} height={H + 30} aria-label="triangle">
          <polygon points={`${(W + 20) / 2},10 10,${H + 10} ${W + 10},${H + 10}`}
            fill="white" stroke="#1a1a1a" strokeWidth="2" />
          {data.side_label && (
            <text x={(W + 20) / 2} y={H + 26} textAnchor="middle" fontSize="11" fontFamily="sans-serif" fill="#1a1a1a">
              {data.side_label}
            </text>
          )}
        </svg>
      </div>
    );
  }

  if (shape === "circle") {
    const r = 50;
    return (
      <div className="flex justify-center my-3">
        <svg width={r * 2 + 20} height={r * 2 + 20} aria-label="circle">
          <circle cx={r + 10} cy={r + 10} r={r} fill="white" stroke="#1a1a1a" strokeWidth="2" />
          {data.radius_label && (
            <>
              <line x1={r + 10} y1={r + 10} x2={r * 2 + 10} y2={r + 10} stroke="#1a1a1a" strokeWidth="1.5" strokeDasharray="4" />
              <text x={r + 10 + r / 2} y={r + 6} textAnchor="middle" fontSize="11" fontFamily="sans-serif" fill="#1a1a1a">
                {data.radius_label}
              </text>
            </>
          )}
        </svg>
      </div>
    );
  }

  return null;
}

// ─── Worksheet Visual Renderer ────────────────────────────────────────────────

export function WorksheetVisualRenderer({ visual }: { visual: WorksheetVisual }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = visual.data as any;
  switch (visual.type) {
    case "clock":
      return <ClockVisual data={d} />;
    case "ruler":
      return <RulerVisual data={d} />;
    case "beaker":
      return <BeakerVisual data={d} />;
    case "number_line":
      return <NumberLineVisual data={d} />;
    default:
      return null;
  }
}

// ─── Ruler ────────────────────────────────────────────────────────────────────

interface RulerData {
  length_cm: number;
  unit: "cm" | "in";
}

function RulerVisual({ data }: { data: RulerData }) {
  const { length_cm, unit = "cm" } = data;
  const numTicks = Math.min(Math.max(length_cm, 2), 20);
  const tickSpacing = 24;
  const W = numTicks * tickSpacing + 24;
  const H = 54;
  const rulerTop = 10;
  const rulerH = 32;

  return (
    <div className="flex justify-center my-3">
      <svg width={W} height={H} aria-label={`Ruler showing ${numTicks} ${unit}`}>
        {/* Ruler body */}
        <rect x={4} y={rulerTop} width={W - 8} height={rulerH} fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" rx="2" />
        {/* Tick marks and labels */}
        {Array.from({ length: numTicks + 1 }, (_, i) => {
          const x = 4 + i * tickSpacing;
          const isMajor = true; // every mark is labeled for a ruler
          return (
            <g key={i}>
              <line x1={x} y1={rulerTop} x2={x} y2={rulerTop + (isMajor ? 14 : 8)} stroke="#92400e" strokeWidth={isMajor ? 1.5 : 1} />
              {isMajor && (
                <text x={x} y={rulerTop + 26} textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#78350f">
                  {i}
                </text>
              )}
              {/* half-tick */}
              {i < numTicks && (
                <line x1={x + tickSpacing / 2} y1={rulerTop} x2={x + tickSpacing / 2} y2={rulerTop + 8} stroke="#92400e" strokeWidth="1" />
              )}
            </g>
          );
        })}
        {/* Unit label */}
        <text x={W / 2} y={rulerTop + rulerH - 4} textAnchor="middle" fontSize="8" fontFamily="sans-serif" fill="#92400e" opacity="0.7">
          {unit}
        </text>
      </svg>
    </div>
  );
}

// ─── Beaker ───────────────────────────────────────────────────────────────────

interface BeakerData {
  capacity: number;
  filled: number;
  unit: string;
}

function BeakerVisual({ data }: { data: BeakerData }) {
  const { capacity, filled, unit = "mL" } = data;
  const clampedFilled = Math.min(Math.max(filled, 0), capacity);
  const fillRatio = capacity > 0 ? clampedFilled / capacity : 0;

  const W = 70, beakerTop = 10, beakerH = 100, beakerW = 50, beakerX = 10;
  const totalH = beakerTop + beakerH + 24;
  const fillH = beakerH * fillRatio;
  const fillY = beakerTop + beakerH - fillH;

  // Graduation marks (4 evenly spaced)
  const numGrads = 4;

  return (
    <div className="flex justify-center my-3">
      <svg width={W + 30} height={totalH} aria-label={`Beaker with ${clampedFilled} ${unit} of ${capacity} ${unit}`}>
        {/* Liquid fill */}
        <rect x={beakerX} y={fillY} width={beakerW} height={fillH} fill="#bfdbfe" />
        {/* Beaker outline — open top */}
        <path
          d={`M${beakerX},${beakerTop} L${beakerX},${beakerTop + beakerH} L${beakerX + beakerW},${beakerTop + beakerH} L${beakerX + beakerW},${beakerTop}`}
          fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinejoin="round"
        />
        {/* Spout at top */}
        <line x1={beakerX - 6} y1={beakerTop} x2={beakerX + beakerW + 6} y2={beakerTop} stroke="#1d4ed8" strokeWidth="2.5" />
        {/* Graduation lines and labels */}
        {Array.from({ length: numGrads }, (_, i) => {
          const gradFraction = (i + 1) / numGrads;
          const gradY = beakerTop + beakerH - beakerH * gradFraction;
          const gradValue = Math.round(capacity * gradFraction);
          return (
            <g key={i}>
              <line x1={beakerX + beakerW} y1={gradY} x2={beakerX + beakerW + 8} y2={gradY} stroke="#1d4ed8" strokeWidth="1" />
              <text x={beakerX + beakerW + 10} y={gradY + 3} fontSize="8" fontFamily="sans-serif" fill="#1d4ed8">
                {gradValue}
              </text>
            </g>
          );
        })}
        {/* Unit label */}
        <text x={beakerX + beakerW / 2} y={beakerTop + beakerH + 14} textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#1d4ed8">
          {unit}
        </text>
      </svg>
    </div>
  );
}

// ─── Dot Array ────────────────────────────────────────────────────────────────

interface DotArrayData {
  rows: number;
  cols: number;
}

function DotArrayVisual({ data }: { data: DotArrayData }) {
  const { rows, cols } = data;
  const r = 5, sp = 18, pad = 10;
  const W = cols * sp + pad * 2;
  const H = rows * sp + pad * 2;

  return (
    <div className="flex justify-center my-3">
      <svg width={W} height={H} aria-label={`${rows} rows of ${cols} dots`}>
        {Array.from({ length: rows }, (_, row) =>
          Array.from({ length: cols }, (_, col) => (
            <circle key={`${row}-${col}`}
              cx={pad + col * sp + r}
              cy={pad + row * sp + r}
              r={r} fill="#1a1a1a" />
          ))
        )}
      </svg>
    </div>
  );
}
