import type { ReactNode } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { IconChevron, IconX } from "../icons";

export function Card({
  title,
  sub,
  actions,
  children,
  flush,
}: {
  title?: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  flush?: boolean;
}) {
  return (
    <section className={`card${flush ? " card--flush" : ""}`}>
      {(title || actions) && (
        <header className="card__head">
          <div>
            {title && <h3>{title}</h3>}
            {sub && <div className="sub">{sub}</div>}
          </div>
          {actions && <div className="card__actions">{actions}</div>}
        </header>
      )}
      {flush ? children : <div className="card__body">{children}</div>}
    </section>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label?: string;
}) {
  return (
    <div className="segmented" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={o.value === value}
          data-on={o.value === value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function useCountUp(target: number, ms = 900) {
  const [v, setV] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(from + (target - from) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, ms]);
  return v;
}

/* Sparkline: smooth area + line, no dependencies. */
export function Sparkline({
  values,
  color = "var(--accent)",
  height = 42,
  area = true,
  gradientId,
}: {
  values: number[];
  color?: string;
  height?: number;
  area?: boolean;
  gradientId?: string;
}) {
  const auto = useId().replace(/:/g, "");
  const id = gradientId || `sp-${auto}`;
  const w = 120;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1 || 1)) * w;
    const y = height - 3 - ((v - min) / span) * (height - 8);
    return [x, y] as const;
  });
  const d = smoothPath(pts);
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ height }} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {area && <path d={`${d} L ${w} ${height} L 0 ${height} Z`} fill={`url(#${id})`} />}
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function smoothPath(pts: readonly (readonly [number, number])[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const mx = (p0[0] + p1[0]) / 2;
    d += ` C ${mx} ${p0[1]}, ${mx} ${p1[1]}, ${p1[0]} ${p1[1]}`;
  }
  return d;
}

/* Bar chart with hover tooltip + optional comparison series. */
export function BarChart({
  labels,
  primary,
  secondary,
  primaryLabel,
  secondaryLabel,
  height = 168,
  format = (n: number) => String(n),
}: {
  labels: string[];
  primary: number[];
  secondary?: number[];
  primaryLabel: string;
  secondaryLabel?: string;
  height?: number;
  format?: (n: number) => string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...primary, ...(secondary || [0]));
  const n = labels.length;
  return (
    <div className="chart" style={{ height }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: n > 16 ? 3 : 7,
          height: height - 22,
          position: "relative",
        }}
        onMouseLeave={() => setHover(null)}
      >
        {primary.map((v, i) => {
          const h = Math.max(2, (v / max) * (height - 34));
          const sh = secondary ? Math.max(2, (secondary[i] / max) * (height - 34)) : 0;
          const on = hover === i;
          return (
            <div
              key={labels[i] + i}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                gap: 2,
                height: "100%",
                position: "relative",
                cursor: "default",
              }}
              onMouseEnter={() => setHover(i)}
            >
              {secondary && (
                <div
                  style={{
                    width: "42%",
                    height: sh,
                    borderRadius: "3px 3px 1px 1px",
                    background: "var(--chart-bar-alt)",
                    transition: "height .5s var(--ease-out), background .2s",
                    backgroundImage: on ? "linear-gradient(180deg, var(--chart-bar-alt-hover), var(--chart-bar-alt))" : undefined,
                  }}
                />
              )}
              <div
                style={{
                  width: secondary ? "42%" : "62%",
                  height: h,
                  borderRadius: "3px 3px 1px 1px",
                  background: on
                    ? "linear-gradient(180deg, color-mix(in srgb, var(--accent) 100%, white 12%), var(--accent-deep))"
                    : "linear-gradient(180deg, color-mix(in srgb, var(--accent) 82%, transparent), color-mix(in srgb, var(--accent) 40%, transparent))",
                  transition: "height .5s var(--ease-out), background .2s",
                  minWidth: 3,
                }}
              />
              {on && (
                <div className="tooltip" style={{ left: "50%", bottom: h + 10 }}>
                  <strong>{labels[i]}</strong>
                  <div className="trow">
                    <span>{primaryLabel}</span>
                    <b>{format(v)}</b>
                  </div>
                  {secondary && (
                    <div className="trow">
                      <span>{secondaryLabel}</span>
                      <b>{format(secondary[i])}</b>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          display: "flex",
          gap: n > 16 ? 3 : 7,
          marginTop: 6,
          fontSize: 9.5,
          color: "var(--text-mute)",
          fontFamily: "var(--mono)",
        }}
      >
        {labels.map((l, i) => (
          <div key={l + i} style={{ flex: 1, textAlign: "center", opacity: i % (n > 16 ? 4 : 1) === 0 ? 1 : 0 }}>
            {i % (n > 16 ? 4 : 1) === 0 ? l : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

/* Donut with center label. */
export function Donut({
  segments,
  size = 132,
  thickness = 13,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: `0 0 ${size}px` }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--chart-track)" strokeWidth={thickness} />
        {segments.map((s) => {
          const len = (s.value / total) * c;
          const el = (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${Math.max(0, len - 2.5)} ${c}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray .7s var(--ease-out)" }}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 550, letterSpacing: "-0.03em", lineHeight: 1 }}>{centerValue}</div>
          <div style={{ fontSize: 9.5, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--text-mute)", marginTop: 4 }}>
            {centerLabel}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Large area chart with gradient + hover crosshair. */
export function AreaChart({
  points,
  labels,
  height = 210,
  valueFormat = (n: number) => String(n),
  accent = "var(--accent)",
}: {
  points: number[];
  labels: string[];
  height?: number;
  valueFormat?: (n: number) => string;
  accent?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const auto = useId().replace(/:/g, "");
  const w = 640;
  const h = height;
  const pad = { t: 12, r: 6, b: 22, l: 30 };
  const max = Math.max(...points) * 1.08;
  const min = 0;
  const xy = points.map((v, i) => {
    const x = pad.l + (i / (points.length - 1)) * (w - pad.l - pad.r);
    const y = h - pad.b - ((v - min) / (max - min)) * (h - pad.t - pad.b);
    return [x, y] as const;
  });
  const line = smoothPath(xy);
  const areaD = `${line} L ${xy[xy.length - 1][0]} ${h - pad.b} L ${pad.l} ${h - pad.b} Z`;
  const gridY = [0, 0.25, 0.5, 0.75, 1];
  return (
    <div className="chart">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        style={{ height }}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const rel = ((e.clientX - rect.left) / rect.width) * w;
          const idx = Math.round(((rel - pad.l) / (w - pad.l - pad.r)) * (points.length - 1));
          setHover(Math.max(0, Math.min(points.length - 1, idx)));
        }}
      >
        <defs>
          <linearGradient id={`ac-${auto}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {gridY.map((g) => (
          <line
            key={g}
            x1={pad.l}
            x2={w - pad.r}
            y1={pad.t + g * (h - pad.t - pad.b)}
            y2={pad.t + g * (h - pad.t - pad.b)}
            stroke="var(--chart-grid)"
            strokeDasharray="2 4"
          />
        ))}
        <path d={areaD} fill={`url(#ac-${auto})`} />
        <path d={line} fill="none" stroke={accent} strokeWidth="1.9" strokeLinecap="round" />
        {hover !== null && (
          <>
            <line
              x1={xy[hover][0]}
              x2={xy[hover][0]}
              y1={pad.t}
              y2={h - pad.b}
              stroke="var(--chart-cross)"
              strokeDasharray="3 3"
            />
            <circle cx={xy[hover][0]} cy={xy[hover][1]} r="3.6" fill={accent} stroke="var(--bg-raised)" strokeWidth="2" />
          </>
        )}
        {labels.map((l, i) =>
          i % Math.ceil(labels.length / 6) === 0 ? (
            <text
              key={l + i}
              x={xy[i][0]}
              y={h - 6}
              fill="var(--chart-label)"
              fontSize="9"
              fontFamily="var(--mono)"
              textAnchor="middle"
            >
              {l}
            </text>
          ) : null
        )}
      </svg>
      {hover !== null && (
        <div
          className="tooltip"
          style={{
            left: `${(xy[hover][0] / w) * 100}%`,
            top: xy[hover][1] - 6,
            position: "absolute",
          }}
        >
          <strong>{labels[hover]}</strong>
          <div className="trow">
            <span>Cumulative</span>
            <b>{valueFormat(points[hover])}</b>
          </div>
        </div>
      )}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  children,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  labelledBy?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        ref={ref}
      >
        {children}
      </div>
    </>
  );
}

export function DrawerClose({ onClose }: { onClose: () => void }) {
  return (
    <button className="iconbtn" onClick={onClose} aria-label="Close panel">
      <IconX />
    </button>
  );
}

export function Caret({ open }: { open: boolean }) {
  return (
    <IconChevron
      width={13}
      height={13}
      style={{ transform: open ? "rotate(90deg)" : "none", transition: "transform .2s", color: "var(--text-mute)" }}
    />
  );
}

export function useMediaQuery(q: string) {
  const [match, setMatch] = useState(() => (typeof window === "undefined" ? false : window.matchMedia(q).matches));
  useEffect(() => {
    const mq = window.matchMedia(q);
    const fn = () => setMatch(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, [q]);
  return match;
}

export function relativeWeeks(labels: string[]) {
  return useMemo(() => labels.map((l) => l.slice(5).replace("-", "/")), [labels]);
}
