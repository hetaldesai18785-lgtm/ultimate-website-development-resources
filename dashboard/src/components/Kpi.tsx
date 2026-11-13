import { useCountUp, Sparkline } from "./ui";
import { IconArrowUp } from "../icons";

export function Kpi({
  label,
  value,
  format = (n) => String(Math.round(n)),
  unit,
  delta,
  series,
  icon: Icon,
  color = "var(--accent)",
}: {
  label: string;
  value: number;
  format?: (n: number) => string;
  unit?: string;
  delta: string;
  series: number[];
  icon: (p: any) => JSX.Element;
  color?: string;
}) {
  const animated = useCountUp(value);
  return (
    <article className="kpi">
      <div className="kpi__label">
        <Icon />
        {label}
      </div>
      <div className="kpi__value">
        {format(animated)}
        {unit && <small>{unit}</small>}
      </div>
      <div className="kpi__delta" style={{ color }}>
        <IconArrowUp />
        {delta}
      </div>
      <div className="kpi__spark">
        <Sparkline values={series} color={color} height={42} />
      </div>
    </article>
  );
}
