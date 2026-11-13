import { hueColor, moduleById, fmt } from "../lib/store";
import type { Skill } from "../lib/types";

export function SkillRow({ skill, onOpen }: { skill: Skill; onOpen: () => void }) {
  const module = moduleById.get(skill.module);
  const hue = module?.hue ?? 200;
  return (
    <div
      className="skillrow"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-label={`${skill.name}, ${skill.words} words, quality score ${skill.score}`}
    >
      <span className="skillrow__icon" style={{ color: hueColor(hue, 72, 66) }}>
        {skill.module.slice(0, 2).toUpperCase()}
      </span>
      <div style={{ minWidth: 0 }}>
        <div className="skillrow__name">{skill.name}</div>
        <div className="skillrow__desc">
          {module?.name} · {skill.description}
        </div>
      </div>
      <div className="skillrow__meta">{fmt.format(skill.words)} w</div>
      <div className="skillrow__meta">{skill.tags[0] ?? "—"}</div>
      <div className="scorecell">
        <span className="bar" style={{ width: 34, height: 3 }}>
          <i style={{ width: `${skill.score}%`, background: hueColor(hue, 70, 60) }} />
        </span>
        <b>{skill.score}</b>
      </div>
    </div>
  );
}
