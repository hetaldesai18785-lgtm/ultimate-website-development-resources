import { useEffect, useMemo, useState } from "react";
import { useStore, allSkills, moduleById, fmt, hueColor } from "../lib/store";
import { Card, Segmented } from "../components/ui";
import { PageHeader } from "../components/Shell";
import { SkillRow } from "../components/SkillRow";
import { IconSearch, IconFilter, IconX, IconBookmark, IconDownload } from "../icons";

type Sort = "score" | "words" | "name" | "recent";
const PAGE = 40;

export function Skills() {
  const { data, query, setQuery, select, saved, notify, setView, activeModules, toggleModule } = useStore();
  const [sort, setSort] = useState<Sort>("score");
  const [tag, setTag] = useState<string | null>(null);
  const [onlySaved, setOnlySaved] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    allSkills.forEach((s) => s.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = allSkills.filter((s) => {
      if (activeModules.length && !activeModules.includes(s.module)) return false;
      if (tag && !s.tags.includes(tag)) return false;
      if (onlySaved && !saved.includes(s.id)) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.path.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
    const sorted = [...list];
    if (sort === "score") sorted.sort((a, b) => b.score - a.score || b.words - a.words);
    if (sort === "words") sorted.sort((a, b) => b.words - a.words);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "recent") sorted.sort((a, b) => a.path.localeCompare(b.path));
    return sorted;
  }, [query, sort, tag, onlySaved, saved, activeModules]);

  useEffect(() => setLimit(PAGE), [query, sort, tag, onlySaved, activeModules]);

  const filtered = activeModules.length || tag || onlySaved || query;
  const reset = () => {
    setQuery("");
    setTag(null);
    setOnlySaved(false);
    activeModules.forEach((m) => toggleModule(m));
  };

  return (
    <div className="view">
      <PageHeader
        eyebrow="Skill explorer"
        title={
          <>
            {filtered ? "Filtered" : "Every"} <em style={{ fontStyle: "italic", color: "var(--accent)" }}>SKILL.md</em> in the collection
          </>
        }
        actions={
          <>
            <button className="btn btn--sm" onClick={() => setOnlySaved(!onlySaved)} style={onlySaved ? { borderColor: "var(--accent)", color: "var(--accent)" } : undefined}>
              <IconBookmark /> Saved {saved.length ? `(${saved.length})` : ""}
            </button>
            <button className="btn btn--sm" onClick={() => notify(`${results.length} skills exported to skills.csv`)}>
              <IconDownload /> Export
            </button>
          </>
        }
      >
        Search across names, descriptions, frontmatter and paths. Open any row for the full breakdown, copy the
        path, or pin it to your shelf.
      </PageHeader>

      <div className="toolbar">
        <div className="search" style={{ flex: "0 1 300px", maxWidth: 320 }}>
          <IconSearch />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name, tag or path…"
            aria-label="Filter skills"
            style={{ paddingRight: 12 }}
          />
          {query && (
            <button className="search__clear" onClick={() => setQuery("")} aria-label="Clear search">
              <IconX width={12} height={12} />
            </button>
          )}
        </div>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort skills">
          <option value="score">Sort: quality</option>
          <option value="words">Sort: depth</option>
          <option value="name">Sort: name</option>
          <option value="recent">Sort: path</option>
        </select>
        <span className="pill">
          <IconFilter width={11} height={11} />
          {fmt.format(results.length)} results
        </span>
        {filtered && (
          <button className="btn btn--ghost btn--sm" onClick={reset}>
            <IconX width={11} height={11} /> Clear
          </button>
        )}
      </div>

      <div className="chips" style={{ marginBottom: 12 }}>
        {tags.slice(0, 14).map(([t, n]) => (
          <button key={t} className="chip" data-on={tag === t} onClick={() => setTag(tag === t ? null : t)}>
            {t} <small>{n}</small>
          </button>
        ))}
      </div>

      <Card
        title="Results"
        sub={
          filtered
            ? `${fmt.format(results.length)} matching skills`
            : `All ${fmt.format(results.length)} skills, best documented first`
        }
        flush
        actions={
          <span className="pill">
            {activeModules.length ? `${activeModules.length} repos filtered` : `${data.meta.modules} repositories`}
          </span>
        }
      >
        {results.length === 0 ? (
          <div className="empty">
            <p style={{ marginBottom: 10 }}>Nothing matches those filters.</p>
            <button className="btn btn--sm" onClick={reset}>Reset filters</button>
          </div>
        ) : (
          <>
            <div className="skills">
              {results.slice(0, limit).map((s) => (
                <SkillRow key={s.id} skill={s} onOpen={() => select(s)} />
              ))}
            </div>
            {results.length > limit && (
              <div style={{ padding: 14, display: "flex", justifyContent: "center", borderTop: "1px solid var(--line)" }}>
                <button className="btn btn--sm" onClick={() => setLimit((l) => l + PAGE)}>
                  Load {Math.min(PAGE, results.length - limit)} more · {results.length - limit} remaining
                </button>
              </div>
            )}
          </>
        )}
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginTop: 12 }}>
        {data.modules.slice(0, 6).map((m) => (
          <button
            key={m.id}
            className="card"
            onClick={() => toggleModule(m.id)}
            style={{
              padding: "12px 14px",
              textAlign: "left",
              borderColor: activeModules.includes(m.id) ? hueColor(m.hue, 70, 60, 0.55) : undefined,
            }}
          >
            <div className="row" style={{ marginBottom: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: hueColor(m.hue, 70, 62) }} />
              <span style={{ fontSize: 12, fontWeight: 550 }}>{m.name}</span>
              <span className="spacer" />
              <span className="mono" style={{ fontSize: 11, color: "var(--text-mute)" }}>{m.skills}</span>
            </div>
            <div className="bar" style={{ height: 3 }}>
              <i style={{ width: `${(m.skills / data.modules[0].skills) * 100}%`, background: hueColor(m.hue, 68, 60) }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
