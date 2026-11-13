import { useMemo, useState } from "react";
import { useStore, hueColor, bytes, compact } from "../lib/store";
import { Card, Segmented } from "../components/ui";
import { PageHeader } from "../components/Shell";
import { ModuleCard } from "../components/ModuleCard";
import { IconGrid, IconSearch, IconDownload, IconChevron, IconFile, IconTerminal, IconImage, IconActivity } from "../icons";

type Sort = "skills" | "quality" | "size" | "name";

export function Library() {
  const { data, setView, select, notify, query } = useStore();
  const [sort, setSort] = useState<Sort>("skills");
  const [cat, setCat] = useState<string>("All");
  const [local, setLocal] = useState("");
  const [detail, setDetail] = useState<string | null>(null);

  const term = (query || local).toLowerCase().trim();

  const modules = useMemo(() => {
    let list = data.modules.filter((m) => (cat === "All" ? true : m.category === cat));
    if (term)
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(term) ||
          m.id.includes(term) ||
          m.tagline.toLowerCase().includes(term) ||
          m.features.some((f) => f.toLowerCase().includes(term))
      );
    const sorted = [...list];
    if (sort === "skills") sorted.sort((a, b) => b.skills - a.skills);
    if (sort === "quality") sorted.sort((a, b) => b.quality - a.quality);
    if (sort === "size") sorted.sort((a, b) => b.bytes - a.bytes);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [data.modules, sort, cat, term]);

  const current = detail ? data.modules.find((m) => m.id === detail) : null;
  const currentSkills = current ? data.skills.filter((s) => s.module === current.id) : [];

  return (
    <div className="view">
      <PageHeader
        eyebrow="Repositories"
        title={
          <>
            {data.meta.modules} preserved <em style={{ fontStyle: "italic", color: "var(--accent)" }}>collections</em>
          </>
        }
        actions={
          <>
            <button className="btn btn--sm" onClick={() => notify("Snapshot taken · library.json v" + new Date().toISOString().slice(0, 10))}>
              <IconActivity /> Snapshot
            </button>
            <button className="btn btn--primary btn--sm" onClick={() => setView("skills")}>
              Browse skills <IconChevron width={12} height={12} />
            </button>
          </>
        }
      >
        Every upstream repository is kept intact under <code className="mono" style={{ fontSize: 12 }}>modules/</code>. Sort by depth,
        quality or disk footprint to decide which one to read first.
      </PageHeader>

      <div className="toolbar">
        <div className="search" style={{ flex: "0 1 260px", maxWidth: 260 }}>
          <IconSearch />
          <input
            placeholder="Filter repositories…"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            aria-label="Filter repositories"
            style={{ paddingRight: 12 }}
          />
        </div>
        <div className="chips" style={{ flex: 1 }}>
          {["All", ...data.categories.map((c) => c.name)].map((c) => (
            <button key={c} className="chip" data-on={cat === c} onClick={() => setCat(c)}>
              {c}
              <small>
                {c === "All" ? data.meta.modules : data.modules.filter((m) => m.category === c).length}
              </small>
            </button>
          ))}
        </div>
        <Segmented
          label="Sort repositories"
          value={sort}
          onChange={setSort}
          options={[
            { value: "skills", label: "Depth" },
            { value: "quality", label: "Quality" },
            { value: "size", label: "Size" },
            { value: "name", label: "A–Z" },
          ]}
        />
      </div>

      {modules.length === 0 ? (
        <Card>
          <div className="empty">No repository matches “{local || term}”.</div>
        </Card>
      ) : (
        <div className="modgrid">
          {modules.map((m) => (
            <ModuleCard key={m.id} module={m} onClick={() => setDetail(m.id)} />
          ))}
        </div>
      )}

      {current && (
        <div style={{ marginTop: 22 }}>
          <Card
            title={
              <span className="row">
                <span className="modcard__mono" style={{ color: hueColor(current.hue, 72, 66), width: 24, height: 24, flex: "0 0 24px" }}>
                  {current.id.slice(0, 2).toUpperCase()}
                </span>
                {current.name}
              </span>
            }
            sub={`${current.category} · ${current.tagline}`}
            actions={
              <>
                <span className="tag tag--accent">{currentSkills.length} skills</span>
                <button className="btn btn--ghost btn--sm" onClick={() => setDetail(null)}>
                  Collapse
                </button>
              </>
            }
            flush
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", borderBottom: "1px solid var(--line)" }}>
              {[
                { l: "Skills", v: current.skills, i: IconGrid },
                { l: "Docs", v: current.docs, i: IconFile },
                { l: "Scripts", v: current.scripts, i: IconTerminal },
                { l: "Assets", v: current.assets, i: IconImage },
                { l: "Files", v: current.files, i: IconFile },
                { l: "On disk", v: bytes(current.bytes), i: IconDownload },
              ].map((s, i) => {
                const Icon = s.i;
                return (
                  <div key={s.l} style={{ padding: "13px 15px", borderRight: i < 5 ? "1px solid var(--line)" : "none" }}>
                    <Icon width={13} height={13} style={{ color: "var(--text-mute)" }} />
                    <div style={{ fontSize: 16, fontWeight: 550, letterSpacing: "-0.02em", marginTop: 5 }}>{typeof s.v === "number" ? compact.format(s.v) : s.v}</div>
                    <div style={{ fontSize: 9.5, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-mute)" }}>{s.l}</div>
                  </div>
                );
              })}
            </div>
            {currentSkills.length > 0 ? (
              <div className="skills">
                {currentSkills
                  .slice()
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 7)
                  .map((s) => (
                    <div key={s.id} className="skillrow" onClick={() => select(s)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && select(s)}>
                      <span className="skillrow__icon" style={{ color: hueColor(current.hue, 72, 66) }}>
                        {s.name.slice(0, 2).toUpperCase()}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div className="skillrow__name">{s.name}</div>
                        <div className="skillrow__desc">{s.description}</div>
                      </div>
                      <div className="skillrow__meta">{s.words} w</div>
                      <div className="skillrow__meta">{s.tags[0]}</div>
                      <div className="scorecell"><b>{s.score}</b></div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="empty">This repository ships references and scripts but no SKILL.md files.</div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
