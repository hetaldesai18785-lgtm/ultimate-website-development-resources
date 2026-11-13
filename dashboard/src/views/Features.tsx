import { useMemo, useState } from "react";
import { useStore, allSkills, featureIndex, hueColor } from "../lib/store";
import { Card, Donut, Segmented } from "../components/ui";
import { PageHeader } from "../components/Shell";
import { SkillRow } from "../components/SkillRow";
import { IconSpark, IconGrid, IconArrowUp, IconChevron } from "../icons";

export function Features() {
  const { data, select, activeFeature, setActiveFeature, setView } = useStore();
  const [mode, setMode] = useState<"count" | "spread">("count");

  const features = useMemo(() => {
    const list = [...featureIndex];
    list.sort((a, b) => (mode === "count" ? b.count - a.count : b.modules - a.modules || b.count - a.count));
    return list;
  }, [mode]);

  const max = Math.max(...features.map((f) => (mode === "count" ? f.count : f.modules)));

  const coverage = useMemo(() => {
    // how many of the 19 repositories touch each feature
    return features.map((f) => ({
      ...f,
      pct: Math.round((f.modules / data.meta.modules) * 100),
    }));
  }, [features, data.meta.modules]);

  const active = activeFeature ? coverage.find((f) => f.name === activeFeature) : null;
  const activeSkills = useMemo(
    () => (activeFeature ? allSkills.filter((s) => s.tags.includes(activeFeature)) : []),
    [activeFeature]
  );

  const blank = coverage.filter((c) => c.modules <= 2);
  const dense = coverage.filter((c) => c.modules >= 8);

  return (
    <div className="view">
      <PageHeader
        eyebrow="Feature coverage"
        title={
          <>
            Where the library is <em style={{ fontStyle: "italic", color: "var(--accent)" }}>thick</em> — and thin
          </>
        }
        actions={
          <Segmented
            label="Sort metric"
            value={mode}
            onChange={setMode}
            options={[
              { value: "count", label: "Skill count" },
              { value: "spread", label: "Repo spread" },
            ]}
          />
        }
      >
        Skills are tagged by what they actually teach. Use this map to see which disciplines a dozen repositories
        cover, and which sit on a single source you should probably diversify.
      </PageHeader>

      <div className="kpis" style={{ marginBottom: 12 }}>
        {[
          { label: "Feature areas", value: data.meta.features, sub: `${dense.length} well covered`, color: "var(--accent)" },
          { label: "Deepest area", value: features[0].count, sub: features[0].name, color: "var(--violet)" },
          { label: "Broadest spread", value: `${Math.max(...features.map((f) => f.modules))} repos`, sub: "Typography leads reach", color: "var(--cyan)" },
          { label: "Single-source areas", value: blank.length, sub: "only 1–2 repositories", color: "var(--rose)" },
        ].map((k) => (
          <article key={k.label} className="kpi">
            <div className="kpi__label"><IconSpark />{k.label}</div>
            <div className="kpi__value">{k.value}<small>skills</small></div>
            <div className="kpi__delta" style={{ color: k.color }}>
              <IconArrowUp />{k.sub}
            </div>
          </article>
        ))}
      </div>

      <div className="grid grid--2-1" style={{ marginBottom: 12 }}>
        <Card title="Coverage by feature" sub={`Sorted by ${mode === "count" ? "skill count" : "repository spread"}`} flush>
          <div style={{ padding: "14px 18px 8px" }}>
            {coverage.map((f, i) => {
              const on = activeFeature === f.name;
              return (
                <button
                  key={f.name}
                  onClick={() => setActiveFeature(on ? null : f.name)}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "6px 0",
                    textAlign: "left",
                    opacity: activeFeature && !on ? 0.6 : 1,
                    transition: "opacity .2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 500, color: on ? "var(--accent)" : "var(--text-soft)" }}>
                      {f.name}
                    </span>
                    <span className="spacer" />
                    <span className="mono" style={{ fontSize: 10, color: "var(--text-mute)" }}>{f.modules}/{data.meta.modules} repos</span>
                    <span className="mono" style={{ fontSize: 11, fontWeight: 550, width: 32, textAlign: "right" }}>
                      {mode === "count" ? f.count : f.modules}
                    </span>
                  </div>
                  <div className="bar" style={{ height: 6 }}>
                    <i
                      style={{
                        width: `${Math.max(3, ((mode === "count" ? f.count : f.modules) / max) * 100)}%`,
                        background: on
                          ? "var(--accent)"
                          : i < 4
                          ? "linear-gradient(90deg, var(--accent-deep), color-mix(in srgb, var(--accent) 70%, transparent))"
                          : "rgba(255,255,255,0.26)",
                        transition: "width .8s var(--ease-out)",
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="stack">
          <Card title="Spread" sub="Feature presence across repositories">
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <Donut
                size={116}
                thickness={12}
                centerValue={String(dense.length)}
                centerLabel="dense"
                segments={[
                  { label: "8+ repos", value: dense.length, color: "var(--accent)" },
                  { label: "3–7 repos", value: coverage.filter((c) => c.modules >= 3 && c.modules < 8).length, color: "var(--violet)" },
                  { label: "1–2 repos", value: blank.length, color: "rgba(255,255,255,0.18)" },
                ]}
              />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9, fontSize: 11.5 }}>
                {[
                  { l: "8+ repositories", v: dense.length, c: "var(--accent)" },
                  { l: "3–7 repositories", v: coverage.filter((c) => c.modules >= 3 && c.modules < 8).length, c: "var(--violet)" },
                  { l: "1–2 repositories", v: blank.length, c: "rgba(255,255,255,0.3)" },
                ].map((r) => (
                  <div key={r.l} className="row" style={{ gap: 7 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: r.c }} />
                    <span style={{ color: "var(--text-soft)" }}>{r.l}</span>
                    <span className="spacer" />
                    <b className="mono" style={{ fontWeight: 550 }}>{r.v}</b>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Suggested focus" sub="Thinnest areas in the collection" flush>
            <div className="list">
              {[...coverage].sort((a, b) => a.modules - b.modules || a.count - b.count).slice(0, 5).map((f) => (
                <button key={f.name} className="listrow" onClick={() => setActiveFeature(f.name)}>
                  <span className="listrow__rank">{f.modules}</span>
                  <div className="listrow__main">
                    <div className="listrow__title">{f.name}</div>
                    <div className="listrow__sub">{f.count} skills · {f.pct}% of repos</div>
                  </div>
                  <IconChevron width={12} height={12} style={{ color: "var(--text-mute)" }} />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {active ? (
        <Card
          title={`${active.name} · ${active.count} skills`}
          sub={`Present in ${active.modules} of ${data.meta.modules} repositories`}
          flush
          actions={
            <>
              <span className="tag tag--accent">{active.pct}% coverage</span>
              <button className="iconbtn" onClick={() => setActiveFeature(null)} aria-label="Clear feature filter">
                <IconChevron style={{ transform: "rotate(90deg)" }} />
              </button>
            </>
          }
        >
          <div className="skills">
            {activeSkills.slice(0, 8).map((s) => (
              <SkillRow key={s.id} skill={s} onOpen={() => select(s)} />
            ))}
          </div>
          <div style={{ padding: 12, borderTop: "1px solid var(--line)" }}>
            <button className="btn btn--sm" onClick={() => setView("skills")}>
              See all {active.count} skills in this area <IconChevron width={11} height={11} />
            </button>
          </div>
        </Card>
      ) : (
        <Card title="Repository × feature matrix" sub="Density of each feature per repository" flush>
          <div style={{ overflowX: "auto", padding: "4px 0 10px" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 720, fontSize: 11 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--text-mute)", fontWeight: 500 }}>Repository</th>
                  {coverage.slice(0, 9).map((f) => (
                    <th key={f.name} style={{ padding: "10px 6px", color: "var(--text-mute)", fontWeight: 500, fontSize: 9.5, writingMode: "vertical-rl", transform: "rotate(180deg)", height: 74 }}>
                      {f.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.modules.slice(0, 12).map((m) => {
                  const modSkills = allSkills.filter((s) => s.module === m.id);
                  return (
                    <tr key={m.id} style={{ borderTop: "1px solid var(--line)" }}>
                      <td style={{ padding: "8px 14px", whiteSpace: "nowrap" }}>
                        <span className="row" style={{ gap: 7 }}>
                          <span style={{ width: 6, height: 6, borderRadius: 2, background: hueColor(m.hue, 70, 62) }} />
                          <span style={{ fontWeight: 500 }}>{m.name}</span>
                        </span>
                      </td>
                      {coverage.slice(0, 9).map((f) => {
                        const n = modSkills.filter((s) => s.tags.includes(f.name)).length;
                        const intensity = n === 0 ? 0 : Math.min(1, 0.18 + Math.log10(n + 1) / 2.2);
                        return (
                          <td key={f.name} style={{ padding: 4, textAlign: "center" }}>
                            <div
                              title={`${m.name} · ${f.name}: ${n} skills`}
                              style={{
                                height: 24,
                                borderRadius: 4,
                                display: "grid",
                                placeItems: "center",
                                background: n ? `color-mix(in srgb, var(--accent) ${Math.round(intensity * 62)}%, transparent)` : "rgba(255,255,255,0.035)",
                                fontSize: 10,
                                fontFamily: "var(--mono)",
                                color: n > 6 ? "#0d1206" : "var(--text-soft)",
                              }}
                            >
                              {n || ""}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
