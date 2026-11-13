import { hueColor, bytes } from "../lib/store";
import type { ModuleRow } from "../lib/types";

export function ModuleCard({ module, onClick }: { module: ModuleRow; onClick?: () => void }) {
  return (
    <button className="modcard" onClick={onClick} aria-label={`${module.name}, ${module.skills} skills`}>
      <span
        className="modcard__glow"
        style={{ background: hueColor(module.hue, 80, 55) }}
        aria-hidden
      />
      <div className="modcard__top">
        <span className="modcard__mono" style={{ color: hueColor(module.hue, 72, 66) }}>
          {module.id.slice(0, 2).toUpperCase()}
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="modcard__name">{module.name}</div>
          <div style={{ fontSize: 10.5, color: "var(--text-mute)", marginTop: 2 }}>{module.category}</div>
        </div>
        <span className="tag" style={{ fontSize: 10 }}>{module.quality}</span>
      </div>
      <div className="modcard__tag">{module.tagline}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {module.features.slice(0, 2).map((f) => (
          <span key={f} className="tag">{f}</span>
        ))}
        <span className="tag">{bytes(module.bytes)}</span>
      </div>
      <div className="modcard__stats">
        <span className="mini">
          <b>{module.skills}</b>
          <span>skills</span>
        </span>
        <span className="mini">
          <b>{module.docs}</b>
          <span>docs</span>
        </span>
        <span className="mini">
          <b>{module.scripts}</b>
          <span>scripts</span>
        </span>
        <span className="mini" style={{ marginLeft: "auto", textAlign: "right" }}>
          <b>{module.features.length}</b>
          <span>features</span>
        </span>
      </div>
    </button>
  );
}
