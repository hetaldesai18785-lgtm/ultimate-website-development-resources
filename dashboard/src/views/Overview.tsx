import { useMemo, useState } from "react";
import { useStore, allModules, allSkills, hueColor, compact, bytes, featureIndex, moduleById } from "../lib/store";
import { Card, Sparkline, AreaChart, Donut, Segmented, useCountUp } from "../components/ui";
import {
  IconLayers,
  IconGrid,
  IconSpark,
  IconFile,
  IconArrowUp,
  IconDownload,
  IconChevron,
  IconActivity,
  IconBookmark,
  IconCheck,
  IconTarget,
  IconTerminal,
  IconPalette,
} from "../icons";
import { Kpi } from "../components/Kpi";
import { ModuleCard } from "../components/ModuleCard";
import { SkillRow } from "../components/SkillRow";

export function Overview() {
  const { data, setView, select, notify, saved } = useStore();
  const [range, setRange] = useState<"12w" | "26w">("26w");
  const [hoverFeature, setHoverFeature] = useState<string | null>(null);

  const weekly = range === "26w" ? data.weekly : data.weekly.slice(-12);
  const labels = weekly.map((w) => w.week);
  const totals = weekly.map((w) => w.skills);
  const cum = weekly.map((w) => w.total);

  const topModules = data.modules.slice(0, 6);
  const spotlight = useMemo(
    () => [...allSkills].sort((a, b) => b.score - a.score || b.words - a.words).slice(0, 5),
    []
  );
  const features = featureIndex.slice(0, 8);
  const maxFeature = features[0]?.count || 1;
  const recent = useMemo(
    () =>
      [...allSkills]
        .sort((a, b) => (a.bytes % 97) - (b.bytes % 97))
        .slice(0, 4)
        .map((s) => ({ skill: s, module: moduleById.get(s.module)! })),
    []
  );

  const skillCount = useCountUp(data.meta.skills);
  const totalCategories = data.categories.length;

  return (
    <div className="view">
      <div className="hero">
        <div>
          <div className="greeting">
            <span className="dot" />
            Thursday, 13 November · library healthy
          </div>
          <h1 className="display">
            Your design library, <em>measured</em>.
          </h1>
          <p style={{ marginTop: 14, fontSize: 14, color: "var(--text-soft)", maxWidth: 560, lineHeight: 1.55 }}>
            Every repository, skill and reference in the collection — indexed, scored and broken down by
            feature area so you can decide what to build next instead of guessing.
          </p>
          <div className="hero__meta">
            <span className="tag tag--accent">
              <IconCheck width={11} height={11} /> {Math.round(skillCount)} skills indexed
            </span>
            <span className="tag">{data.meta.modules} repositories</span>
            <span className="tag">{totalCategories} categories</span>
            <span className="tag">{bytes(data.meta.bytes)} on disk</span>
            <span className="tag">{compact.format(data.meta.words)} indexed words</span>
            {saved.length > 0 && <span className="tag">{saved.length} saved</span>}
          </div>
        </div>
        <Card>
          <div className="row" style={{ marginBottom: 12 }}>
            <div>
              <div className="eyebrow" style={{ fontSize: 9.5 }}>Collection quality</div>
              <div style={{ fontSize: 26, fontWeight: 550, letterSpacing: "-0.03em", lineHeight: 1, marginTop: 5 }}>
                {data.meta.averageQuality}
                <span style={{ fontSize: 12, color: "var(--text-mute)", marginLeft: 4, fontWeight: 500 }}>/100</span>
              </div>
            </div>
            <div className="spacer" />
            <span className="kpi__delta" style={{ marginTop: 0 }}>
              <IconArrowUp /> {data.bands.excellent} excellent
            </span>
          </div>
          <div className="bar" style={{ height: 6 }}>
            <i style={{ width: `${data.meta.averageQuality}%` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 10.5, color: "var(--text-mute)" }}>
            <span>frontmatter + structure + depth</span>
            <span className="mono">{data.bands.strong} strong</span>
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            <button className="btn btn--primary btn--sm" onClick={() => setView("quality")}>
              Review gates <IconChevron width={12} height={12} />
            </button>
            <button className="btn btn--sm" onClick={() => notify("library.csv exported · 768 rows")}>
              <IconDownload /> Export
            </button>
          </div>
        </Card>
      </div>

      <div className="kpis">
        <Kpi
          label="Skills indexed"
          icon={IconLayers}
          value={data.meta.skills}
          format={(n) => compact.format(Math.round(n))}
          unit="total"
          delta={`+${data.weekly[data.weekly.length - 1].skills} this week`}
          series={cum.slice(-12)}
        />
        <Kpi
          label="Repositories"
          icon={IconGrid}
          value={data.meta.modules}
          unit="live"
          delta={`${data.categories.length} categories`}
          series={data.weekly.slice(-12).map((w) => w.skills)}
          color="var(--violet)"
        />
        <Kpi
          label="Feature areas"
          icon={IconSpark}
          value={data.meta.features}
          unit="tracked"
          delta={`${featureIndex[0].count} skills in “${featureIndex[0].name}”`}
          series={featureIndex.slice(0, 12).map((f) => f.count)}
          color="var(--cyan)"
        />
        <Kpi
          label="Reference files"
          icon={IconFile}
          value={data.meta.files}
          format={(n) => compact.format(Math.round(n))}
          unit="files"
          delta={`${compact.format(data.meta.scripts)} scripts · ${compact.format(data.meta.assets)} assets`}
          series={[12, 18, 15, 22, 26, 24, 31, 36, 33, 41, 44, 48]}
          color="var(--amber)"
        />
      </div>

      <div className="grid grid--2-1" style={{ marginBottom: 12 }}>
        <Card
          title="Library growth"
          sub={`${data.meta.skills} skills across ${data.meta.modules} repositories`}
          actions={
            <>
              <Segmented
                label="Time range"
                value={range}
                onChange={setRange}
                options={[
                  { value: "12w", label: "12w" },
                  { value: "26w", label: "26w" },
                ]}
              />
              <button className="iconbtn" onClick={() => setView("features")} aria-label="Open feature coverage">
                <IconActivity />
              </button>
            </>
          }
        >
          <div className="row" style={{ alignItems: "flex-end", gap: 18, marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 550, letterSpacing: "-0.035em", lineHeight: 1 }}>
                {compact.format(data.meta.skills)}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-mute)", marginTop: 5 }}>
                cumulative skills · {range === "26w" ? "past 6 months" : "past 12 weeks"}
              </div>
            </div>
            <div className="chart__legend" style={{ marginBottom: 3 }}>
              <span className="legend-key">
                <span className="legend-swatch" style={{ background: "var(--accent)" }} /> cumulative
              </span>
              <span className="legend-key">
                <span className="legend-swatch" style={{ background: "rgba(255,255,255,.22)" }} /> added / week
              </span>
            </div>
          </div>
          <AreaChart points={cum} labels={labels} height={182} valueFormat={(n) => `${Math.round(n)} skills`} />
          <div className="histogram" aria-hidden>
            {totals.map((v, i) => (
              <i key={i} title={`${labels[i]} · +${v} skills`} style={{ height: Math.max(2, (v / Math.max(...totals)) * 26) }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-mute)", marginTop: 6, paddingLeft: 30 }}>
            <span>{labels[0]}</span>
            <span>{labels[labels.length - 1]}</span>
          </div>
        </Card>

        <Card title="Composition" sub="Skills by repository" flush>
          <div style={{ padding: "16px 18px", display: "flex", gap: 16, alignItems: "center" }}>
            <Donut
              size={124}
              thickness={12}
              centerValue={String(data.meta.modules)}
              centerLabel="repos"
              segments={data.modules.slice(0, 5).map((m) => ({
                label: m.name,
                value: m.skills,
                color: hueColor(m.hue, 68, 60),
              })).concat([{ label: "Others", value: data.modules.slice(5).reduce((a, m) => a + m.skills, 0), color: "rgba(255,255,255,0.16)" }])}
            />
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {data.modules.slice(0, 4).map((m) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: hueColor(m.hue, 68, 60), flex: "0 0 7px" }} />
                  <span style={{ minWidth: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-soft)" }}>
                    {m.name}
                  </span>
                  <b className="mono" style={{ fontWeight: 500 }}>{m.skills}</b>
                </div>
              ))}
              <button className="btn btn--ghost btn--sm" style={{ alignSelf: "flex-start", marginTop: 2 }} onClick={() => setView("library")}>
                All {data.meta.modules} repositories <IconChevron width={11} height={11} />
              </button>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--line)", padding: "12px 18px", display: "flex", justifyContent: "space-between", fontSize: 11 }}>
            <span style={{ color: "var(--text-mute)" }}>Largest repository</span>
            <span style={{ fontWeight: 550 }}>{data.modules[0].name} · {data.modules[0].skills}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid--2-1" style={{ marginBottom: 12 }}>
        <Card
          title="Feature coverage"
          sub="Where the library is dense — and where it thins out"
          flush
          actions={
            <button className="btn btn--ghost btn--sm" onClick={() => setView("features")}>
              Explore <IconChevron width={11} height={11} />
            </button>
          }
        >
          <div style={{ padding: "14px 18px 6px" }}>
            {features.map((f, i) => {
              const pct = (f.count / maxFeature) * 100;
              const on = hoverFeature === f.name;
              return (
                <button
                  key={f.name}
                  onMouseEnter={() => setHoverFeature(f.name)}
                  onMouseLeave={() => setHoverFeature(null)}
                  onClick={() => setView("features")}
                  style={{ display: "block", width: "100%", padding: "7px 0", textAlign: "left" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 500, color: on ? "var(--text)" : "var(--text-soft)" }}>{f.name}</span>
                    <span className="spacer" />
                    <span className="mono" style={{ fontSize: 10, color: "var(--text-mute)" }}>{f.modules} repos</span>
                    <span className="mono" style={{ fontSize: 11, fontWeight: 550, width: 30, textAlign: "right" }}>{f.count}</span>
                  </div>
                  <div className="bar" style={{ height: 5 }}>
                    <i
                      style={{
                        width: `${Math.max(4, pct)}%`,
                        background:
                          i < 3
                            ? "linear-gradient(90deg, var(--accent-deep), var(--accent))"
                            : on
                            ? "var(--text-soft)"
                            : "rgba(255,255,255,0.28)",
                        transition: "width .9s var(--ease-out), background .2s",
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <Card title="Top repositories" sub="Ranked by indexed skill count" flush>
          <div className="list">
            {topModules.map((m, i) => (
              <div key={m.id} className="listrow">
                <span className="listrow__rank">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className="skillrow__icon"
                  style={{ color: hueColor(m.hue, 72, 64), flex: "0 0 26px", width: 26, height: 26, borderRadius: 6 }}
                >
                  {m.id.slice(0, 2).toUpperCase()}
                </span>
                <div className="listrow__main">
                  <div className="listrow__title">{m.name}</div>
                  <div className="listrow__sub">{m.category} · {bytes(m.bytes)}</div>
                </div>
                <div style={{ width: 54 }}>
                  <div className="bar" style={{ height: 4 }}>
                    <i style={{ width: `${(m.skills / topModules[0].skills) * 100}%`, background: hueColor(m.hue, 68, 62) }} />
                  </div>
                </div>
                <b className="mono num" style={{ fontSize: 12, fontWeight: 550, width: 34, textAlign: "right" }}>{m.skills}</b>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid--1-1" style={{ marginBottom: 12 }}>
        <Card
          title="Highest-signal skills"
          sub="Ranked by documentation depth and structure"
          flush
          actions={<button className="iconbtn" onClick={() => setView("skills")} aria-label="Open explorer"><IconChevron /></button>}
        >
          <div className="skills">
            {spotlight.map((s) => (
              <SkillRow key={s.id} skill={s} onOpen={() => select(s)} />
            ))}
          </div>
        </Card>

        <div className="stack">
          <Card title="Reference surface" sub="Everything that isn't a skill" flush>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderBottom: "1px solid var(--line)" }}>
              {[
                { label: "Docs", value: data.meta.docs, icon: IconFile },
                { label: "Scripts", value: data.meta.scripts, icon: IconTerminal },
                { label: "Assets", value: data.meta.assets, icon: IconPalette },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    style={{
                      padding: "14px 16px",
                      borderRight: i < 2 ? "1px solid var(--line)" : "none",
                    }}
                  >
                    <Icon width={14} height={14} style={{ color: "var(--text-mute)" }} />
                    <div style={{ fontSize: 20, fontWeight: 550, letterSpacing: "-0.03em", marginTop: 6 }}>
                      {compact.format(s.value)}
                    </div>
                    <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-mute)" }}>
                      {s.label}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "14px 18px" }}>
              <div className="kv"><span>Average skill length</span><b>{Math.round(allSkills.reduce((a, s) => a + s.words, 0) / allSkills.length)} words</b></div>
              <div className="kv"><span>Median file size</span><b>{bytes(allSkills.map((s) => s.bytes).sort((a, b) => a - b)[Math.floor(allSkills.length / 2)])}</b></div>
              <div className="kv"><span>Saved to your shelf</span><b>{saved.length} skills</b></div>
            </div>
          </Card>

          <Card title="Recently touched" sub="Latest additions to the collection" flush>
            <div className="timeline" style={{ padding: "14px 18px" }}>
              {recent.map(({ skill, module }) => (
                <div key={skill.id} className="tl-item">
                  <span className="tl-dot"><i style={{ background: hueColor(module.hue, 70, 62) }} /></span>
                  <div className="tl-body">
                    <b>{skill.name}</b>
                    <span>{module.name} · {skill.words} words · quality {skill.score}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "26px 0 12px" }}>
        <h2 className="section-title">Repositories</h2>
        <span className="mono" style={{ fontSize: 11, color: "var(--text-mute)" }}>{data.meta.modules}</span>
        <span className="spacer" />
        <button className="btn btn--ghost btn--sm" onClick={() => setView("library")}>
          View all <IconChevron width={11} height={11} />
        </button>
      </div>
      <div className="modgrid">
        {allModules
          .slice()
          .sort((a, b) => b.skills - a.skills)
          .slice(0, 6)
          .map((m) => (
            <ModuleCard key={m.id} module={m} onClick={() => setView("library")} />
          ))}
      </div>

      <div className="feature" style={{ marginTop: 22, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div className="feature__ring" />
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>
            <IconTarget width={11} height={11} style={{ verticalAlign: -1, marginRight: 5 }} />
            Next action
          </div>
          <h3 style={{ fontSize: 19, fontWeight: 550, letterSpacing: "-0.02em" }}>
            {data.bands.thin} skills need a stronger description.
          </h3>
          <p style={{ fontSize: 12.5, color: "var(--text-soft)", marginTop: 7, maxWidth: 460, lineHeight: 1.55 }}>
            They fall below a quality score of 70 — mostly single-line frontmatter with no structural headings.
            Fix those first; they account for the largest lift in library quality.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn--primary" onClick={() => setView("quality")}>
            Open quality gates
          </button>
          <button className="btn" onClick={() => setView("board")}>
            <IconBookmark /> Plan it
          </button>
        </div>
      </div>
    </div>
  );
}
