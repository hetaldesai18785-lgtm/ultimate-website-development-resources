import { useStore, moduleById, hueColor, bytes, fmt, relativeTime } from "../lib/store";
import { Modal, DrawerClose } from "./ui";
import { IconBookmark, IconCopy, IconExternal, IconFile, IconCheck, IconType, IconTarget } from "../icons";

export function SkillDrawer() {
  const { selected, select, toggleSave, saved, notify, cards, addCard } = useStore();
  if (!selected) return null;
  const module = moduleById.get(selected.module);
  const isSaved = saved.includes(selected.id);
  const hue = module?.hue ?? 200;

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify(`${label} copied`);
    } catch {
      notify("Copy blocked by the browser");
    }
  };

  return (
    <Modal open onClose={() => select(null)} labelledBy="skill-drawer-title">
      <div className="drawer__head">
        <span
          className="skillrow__icon"
          style={{ color: hueColor(hue, 72, 66), width: 34, height: 34, flex: "0 0 34px", fontSize: 11, borderRadius: 9 }}
        >
          {selected.module.slice(0, 2).toUpperCase()}
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="eyebrow" style={{ marginBottom: 5 }}>{module?.name} · {module?.category}</div>
          <h2 id="skill-drawer-title" style={{ fontSize: 18, fontWeight: 550, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
            {selected.name}
          </h2>
          <div className="row" style={{ marginTop: 8, gap: 5, flexWrap: "wrap" }}>
            {selected.tags.map((t) => (
              <span key={t} className="tag tag--accent">{t}</span>
            ))}
            <span className="tag">{selected.folder}</span>
          </div>
        </div>
        <DrawerClose onClose={() => select(null)} />
      </div>

      <div className="drawer__body">
        <div className="rings">
          <div className="ring-cell">
            <b>{selected.score}</b>
            <span>quality</span>
          </div>
          <div className="ring-cell">
            <b>{fmt.format(selected.words)}</b>
            <span>words</span>
          </div>
          <div className="ring-cell">
            <b>{bytes(selected.bytes)}</b>
            <span>size</span>
          </div>
        </div>

        <div className="field">
          <label>Description</label>
          <p style={{ fontSize: 12.5, lineHeight: 1.6, color: "var(--text-soft)" }}>{selected.description}</p>
        </div>

        <div className="field">
          <label>Path in repository</label>
          <div className="field__value">
            <code title={selected.path}>modules/{selected.path}</code>
            <button className="iconbtn" style={{ width: 24, height: 24 }} onClick={() => copy(`ultimate-ui-ux-master-skill/modules/${selected.path}`, "Path")} aria-label="Copy path">
              <IconCopy width={13} height={13} />
            </button>
          </div>
        </div>

        {selected.headings.length > 0 && (
          <div className="field">
            <label>Structure</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {selected.headings.map((h, i) => (
                <div key={h + i} className="row" style={{ gap: 8, fontSize: 12, color: "var(--text-soft)" }}>
                  <IconType width={12} height={12} style={{ color: "var(--text-mute)", flex: "0 0 12px" }} />
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="field">
          <label>Extract</label>
          <div className="excerpt">{selected.excerpt || "This skill has no extractable body text."}</div>
        </div>

        <div className="field">
          <label>Repository</label>
          <div className="field__value" style={{ alignItems: "center" }}>
            <span style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontWeight: 550 }}>{module?.name}</span>
              <span style={{ fontSize: 11, color: "var(--text-mute)" }}>{module?.tagline}</span>
            </span>
            <span className="mono" style={{ fontSize: 10.5, color: "var(--text-mute)" }}>{module?.origin}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div className="ring-cell" style={{ textAlign: "left" }}>
            <b style={{ fontSize: 13 }}>{module?.skills}</b>
            <span>skills in repo</span>
          </div>
          <div className="ring-cell" style={{ textAlign: "left" }}>
            <b style={{ fontSize: 13 }}>{module ? relativeTime(Date.now() - (module.files % 900) * 36e5) : "—"}</b>
            <span>last indexed</span>
          </div>
        </div>
      </div>

      <div className="drawer__foot">
        <button
          className="btn btn--primary"
          onClick={() => {
            toggleSave(selected.id);
          }}
        >
          {isSaved ? <IconCheck /> : <IconBookmark />}
          {isSaved ? "Saved" : "Save"}
        </button>
        <button
          className="btn"
          onClick={() =>
            addCard({
              title: `Review ${selected.name}`,
              detail: `${module?.name} · flagged from the explorer for a closer read.`,
              tag: selected.tags[0] ?? "Library",
              priority: "next",
              linkedSkill: selected.id,
            })
          }
        >
          <IconTarget /> Plan
        </button>
        <button className="btn" onClick={() => copy(selected.description, "Description")}>
          <IconCopy /> Copy
        </button>
        <span className="spacer" />
        <span className="mono" style={{ fontSize: 10.5, color: "var(--text-mute)" }}>{cards.length} cards</span>
      </div>
    </Modal>
  );
}
