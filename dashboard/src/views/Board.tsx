import { useMemo, useState } from "react";
import { useStore, relativeTime, hueColor, moduleById } from "../lib/store";
import { Card } from "../components/ui";
import { PageHeader } from "../components/Shell";
import { IconCheck, IconX, IconChevron, IconBookmark, IconGrid, IconTarget } from "../icons";
import type { Priority } from "../lib/types";

const COLUMNS: { id: Priority; label: string; hint: string }[] = [
  { id: "now", label: "Now", hint: "in flight" },
  { id: "next", label: "Next", hint: "queued" },
  { id: "later", label: "Later", hint: "someday" },
  { id: "done", label: "Done", hint: "shipped" },
];

export function Board() {
  const { cards, addCard, moveCard, removeCard, saved, data, select, notify, setView } = useStore();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<Priority | null>(null);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("next");
  const [composing, setComposing] = useState(false);

  const savedSkills = useMemo(() => data.skills.filter((s) => saved.includes(s.id)), [saved, data.skills]);

  const byCol = (p: Priority) => cards.filter((c) => c.priority === p);

  const submit = () => {
    const t = title.trim();
    if (!t) return;
    addCard({ title: t, detail: "Added from the planning board.", tag: "Manual", priority });
    setTitle("");
    setComposing(false);
    notify("Card added to " + priority);
  };

  return (
    <div className="view">
      <PageHeader
        eyebrow="Planning board"
        title={
          <>
            What the library <em style={{ fontStyle: "italic", color: "var(--accent)" }}>needs next</em>
          </>
        }
        actions={
          <button className="btn btn--primary btn--sm" onClick={() => setComposing(true)}>
            <IconTarget /> New card
          </button>
        }
      >
        Drag cards between columns, or use the arrow buttons. Everything is saved to this browser, so the board
        you leave is the board you come back to.
      </PageHeader>

      {composing && (
        <Card title="New card" sub="Give it a title and a starting column" actions={<button className="iconbtn" onClick={() => setComposing(false)} aria-label="Cancel"><IconX /></button>} flush>
          <div style={{ padding: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="e.g. Add a motion budget checklist to the motion guide"
              className="select"
              style={{ flex: "1 1 320px", height: 34, padding: "0 11px", appearance: "none", background: "var(--bg-sunken)", color: "var(--text)" }}
              aria-label="Card title"
            />
            <select className="select" value={priority} onChange={(e) => setPriority(e.target.value as Priority)} aria-label="Column">
              {COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <button className="btn btn--primary" onClick={submit} disabled={!title.trim()}>Add card</button>
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 12, marginTop: composing ? 12 : 0 }}>
        {COLUMNS.map((col) => {
          const list = byCol(col.id);
          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                setOverCol(col.id);
              }}
              onDragLeave={() => setOverCol((c) => (c === col.id ? null : c))}
              onDrop={() => {
                if (dragId) moveCard(dragId, col.id);
                setDragId(null);
                setOverCol(null);
              }}
              style={{
                background: overCol === col.id ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent",
                border: `1px dashed ${overCol === col.id ? "color-mix(in srgb, var(--accent) 45%, transparent)" : "transparent"}`,
                borderRadius: "var(--r-lg)",
                transition: "background .18s, border-color .18s",
                minHeight: 220,
                padding: 2,
              }}
            >
              <div className="row" style={{ padding: "4px 6px 10px" }}>
                <span className={`dot`} style={{ background: col.id === "done" ? "var(--ink-500)" : "var(--accent)", width: 5, height: 5 }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{col.label}</span>
                <span className="mono" style={{ fontSize: 10.5, color: "var(--text-mute)" }}>{list.length}</span>
                <span className="spacer" />
                <span style={{ fontSize: 10, color: "var(--text-mute)" }}>{col.hint}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {list.map((c) => {
                  const linked = c.linkedSkill ? data.skills.find((s) => s.id === c.linkedSkill) : undefined;
                  const mod = linked ? moduleById.get(linked.module) : undefined;
                  return (
                    <article
                      key={c.id}
                      draggable
                      onDragStart={() => setDragId(c.id)}
                      onDragEnd={() => setDragId(null)}
                      className="card"
                      style={{
                        padding: "12px 13px",
                        opacity: dragId === c.id ? 0.45 : c.priority === "done" ? 0.72 : 1,
                        cursor: "grab",
                        borderColor: mod ? hueColor(mod.hue, 60, 55, 0.28) : undefined,
                      }}
                    >
                      <div className="row" style={{ gap: 6, marginBottom: 7 }}>
                        <span className="tag" style={{ fontSize: 9.5 }}>{c.tag}</span>
                        <span className="spacer" />
                        <span style={{ fontSize: 9.5, color: "var(--text-mute)" }}>{relativeTime(c.createdAt)}</span>
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 550, lineHeight: 1.35, letterSpacing: "-0.005em" }}>{c.title}</div>
                      <p style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 5, lineHeight: 1.5 }}>{c.detail}</p>
                      {linked && (
                        <button
                          onClick={() => select(linked)}
                          className="row"
                          style={{
                            marginTop: 9,
                            width: "100%",
                            padding: "5px 7px",
                            borderRadius: 6,
                            background: "rgba(255,255,255,.04)",
                            fontSize: 10.5,
                            color: "var(--text-soft)",
                            gap: 6,
                          }}
                        >
                          <IconGrid width={11} height={11} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{linked.name}</span>
                        </button>
                      )}
                      <div className="row" style={{ marginTop: 9, gap: 4 }}>
                        <button
                          className="iconbtn"
                          style={{ width: 24, height: 24 }}
                          aria-label="Move left"
                          onClick={() => {
                            const i = COLUMNS.findIndex((x) => x.id === c.priority);
                            if (i > 0) moveCard(c.id, COLUMNS[i - 1].id);
                          }}
                        >
                          <IconChevron width={12} height={12} style={{ transform: "rotate(180deg)" }} />
                        </button>
                        <button
                          className="iconbtn"
                          style={{ width: 24, height: 24 }}
                          aria-label="Move right"
                          onClick={() => {
                            const i = COLUMNS.findIndex((x) => x.id === c.priority);
                            if (i < COLUMNS.length - 1) moveCard(c.id, COLUMNS[i + 1].id);
                          }}
                        >
                          <IconChevron width={12} height={12} />
                        </button>
                        <span className="spacer" />
                        {c.priority !== "done" && (
                          <button className="iconbtn" style={{ width: 24, height: 24 }} aria-label="Mark done" onClick={() => moveCard(c.id, "done")}>
                            <IconCheck width={12} height={12} />
                          </button>
                        )}
                        <button className="iconbtn" style={{ width: 24, height: 24 }} aria-label="Delete card" onClick={() => removeCard(c.id)}>
                          <IconX width={12} height={12} />
                        </button>
                      </div>
                    </article>
                  );
                })}
                {list.length === 0 && (
                  <div style={{ padding: "22px 12px", textAlign: "center", fontSize: 11, color: "var(--text-mute)", border: "1px dashed var(--line)", borderRadius: "var(--r-md)" }}>
                    Drop a card here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12, marginTop: 18 }}>
        <Card
          title="Your shelf"
          sub={savedSkills.length ? `${savedSkills.length} saved skills` : "Nothing saved yet"}
          flush
          actions={<button className="btn btn--ghost btn--sm" onClick={() => setView("skills")}><IconBookmark /> Browse</button>}
        >
          {savedSkills.length === 0 ? (
            <div className="empty">Open any skill and press “Save” to keep it here.</div>
          ) : (
            <div className="skills">
              {savedSkills.slice(0, 6).map((s) => (
                <div key={s.id} className="skillrow" role="button" tabIndex={0} onClick={() => select(s)} onKeyDown={(e) => e.key === "Enter" && select(s)}>
                  <span className="skillrow__icon" style={{ color: hueColor(moduleById.get(s.module)?.hue ?? 200, 72, 66) }}>
                    {s.module.slice(0, 2).toUpperCase()}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div className="skillrow__name">{s.name}</div>
                    <div className="skillrow__desc">{moduleById.get(s.module)?.name}</div>
                  </div>
                  <div className="skillrow__meta">{s.words} w</div>
                  <div className="skillrow__meta">{s.tags[0]}</div>
                  <div className="scorecell"><b>{s.score}</b></div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Board summary" sub="Sprint health at a glance">
          <div className="kv"><span>Cards total</span><b>{cards.length}</b></div>
          <div className="kv"><span>In flight</span><b>{byCol("now").length}</b></div>
          <div className="kv"><span>Queued</span><b>{byCol("next").length}</b></div>
          <div className="kv"><span>Someday</span><b>{byCol("later").length}</b></div>
          <div className="kv"><span>Shipped</span><b>{byCol("done").length}</b></div>
          <div className="bar" style={{ height: 6, marginTop: 12 }}>
            <i style={{ width: `${(byCol("done").length / Math.max(1, cards.length)) * 100}%` }} />
          </div>
          <p style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 8 }}>
            {Math.round((byCol("done").length / Math.max(1, cards.length)) * 100)}% of planned work is closed.
          </p>
        </Card>
      </div>
    </div>
  );
}
