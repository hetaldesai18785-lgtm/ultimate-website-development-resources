import { useMemo, useState } from "react";
import { useStore, allSkills, moduleById, hueColor, bytes, fmt } from "../lib/store";
import { Card, Donut, Segmented } from "../components/ui";
import { PageHeader } from "../components/Shell";
import { IconShield, IconCheck, IconX, IconArrowUp, IconChevron } from "../icons";

/* Gates are computed from real properties of every SKILL.md. */
interface Gate {
  id: string;
  label: string;
  description: string;
  pass: (s: (typeof allSkills)[number]) => boolean;
}

const GATES: Gate[] = [
  { id: "desc", label: "Has a description", description: "Frontmatter declares a description longer than 40 characters", pass: (s) => s.description.length > 40 },
  { id: "depth", label: "Documented depth", description: "At least 250 words of instructions", pass: (s) => s.words >= 250 },
  { id: "structure", label: "Structural headings", description: "At least three markdown headings", pass: (s) => s.headings.length >= 3 },
  { id: "tags", label: "Classifiable", description: "Matches at least one feature area", pass: (s) => s.tags.length > 0 },
  { id: "size", label: "Substantive file", description: "File larger than 2 KB", pass: (s) => s.bytes > 2048 },
  { id: "excerpt", label: "Clean excerpt", description: "Body text extracts without markup noise", pass: (s) => s.excerpt.length > 80 },
];

export function Quality() {
  const { data, select, notify } = useStore();
  const [gate, setGate] = useState<string | null>(null);
  const [mode, setMode] = useState<"failing" | "all">("failing");

  const gateStats = useMemo(
    () =>
      GATES.map((g) => {
        const failing = allSkills.filter((s) => !g.pass(s));
        return { ...g, failing: failing.length, passing: allSkills.length - failing.length, pct: Math.round(((allSkills.length - failing.length) / allSkills.length) * 100) };
      }),
    []
  );

  const scored = useMemo(() => {
    const withGates = allSkills.map((s) => ({
      skill: s,
      passed: GATES.filter((g) => g.pass(s)).length,
      failing: GATES.filter((g) => !g.pass(s)),
    }));
    return withGates.sort((a, b) => a.passed - b.passed || a.skill.words - b.skill.words);
  }, []);

  const activeGate = gate ? gateStats.find((g) => g.id === gate) : null;
  const failingSkills = useMemo(
    () => (activeGate ? allSkills.filter((s) => !activeGate.pass(s)) : scored.filter((x) => mode === "all" || x.failing.length > 0)),
    [activeGate, scored, mode]
  );

  const clean = allSkills.filter((s) => GATES.every((g) => g.pass(s))).length;
  const worstModule = useMemo(() => {
    const rows = data.modules.map((m) => {
      const list = allSkills.filter((s) => s.module === m.id);
      const passRate = list.length
        ? list.reduce((a, s) => a + GATES.filter((g) => g.pass(s)).length / GATES.length, 0) / list.length
        : 0;
      return { module: m, passRate: Math.round(passRate * 100) };
    });
    return rows.sort((a, b) => a.passRate - b.passRate);
  }, [data.modules]);

  return (
    <div className="view">
      <PageHeader
        eyebrow="Quality gates"
        title={
          <>
            Six gates, <em style={{ fontStyle: "italic", color: "var(--accent)" }}>{fmt.format(allSkills.length)}</em> skills checked
          </>
        }
        actions={
          <>
            <button className="btn btn--sm" onClick={() => notify("Gate report exported as quality-report.md")}>Export report</button>
            <button className="btn btn--primary btn--sm" onClick={() => notify("Re-ran all gates · library still at " + data.meta.averageQuality)}>
              <IconShield /> Re-run
            </button>
          </>
        }
      >
        Each gate is evaluated against the real file — frontmatter, word count, headings and body extraction.
        Green means the whole collection passes; amber means there is work worth doing.
      </PageHeader>

      <div className="kpis" style={{ marginBottom: 12 }}>
        <article className="kpi">
          <div className="kpi__label"><IconShield />Average quality</div>
          <div className="kpi__value">{data.meta.averageQuality}<small>/100</small></div>
          <div className="kpi__delta"><IconArrowUp />+{data.bands.excellent} skills at 90+</div>
        </article>
        <article className="kpi">
          <div className="kpi__label"><IconCheck />Fully compliant</div>
          <div className="kpi__value">{clean}<small>skills</small></div>
          <div className="kpi__delta">{Math.round((clean / allSkills.length) * 100)}% of the library</div>
        </article>
        <article className="kpi">
          <div className="kpi__label"><IconX />Needs attention</div>
          <div className="kpi__value">{allSkills.length - clean}<small>skills</small></div>
          <div className="kpi__delta" style={{ color: "var(--amber)" }}>Fails at least one gate</div>
        </article>
        <article className="kpi">
          <div className="kpi__label"><IconShield />Weakest repository</div>
          <div className="kpi__value" style={{ fontSize: 19 }}>{worstModule[0].module.name}</div>
          <div className="kpi__delta" style={{ color: "var(--rose)" }}>{worstModule[0].passRate}% gate pass rate</div>
        </article>
      </div>

      <div className="grid grid--2-1" style={{ marginBottom: 12 }}>
        <Card title="Gate results" sub="Click a gate to inspect every skill that fails it" flush>
          <div className="list">
            {gateStats.map((g) => {
              const full = g.pct === 100;
              return (
                <button
                  key={g.id}
                  className="listrow"
                  onClick={() => setGate(gate === g.id ? null : g.id)}
                  style={{ background: gate === g.id ? "rgba(255,255,255,.04)" : undefined, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      flex: "0 0 22px",
                      borderRadius: 6,
                      display: "grid",
                      placeItems: "center",
                      marginTop: 1,
                      background: full ? "color-mix(in srgb, var(--accent) 16%, transparent)" : "color-mix(in srgb, var(--amber) 14%, transparent)",
                      color: full ? "var(--accent)" : "var(--amber)",
                    }}
                  >
                    {full ? <IconCheck width={12} height={12} /> : <IconX width={11} height={11} />}
                  </span>
                  <div className="listrow__main">
                    <div className="listrow__title">{g.label}</div>
                    <div className="listrow__sub" style={{ whiteSpace: "normal" }}>{g.description}</div>
                    <div className="bar" style={{ height: 4, marginTop: 7, maxWidth: 340 }}>
                      <i style={{ width: `${g.pct}%`, background: full ? "var(--accent)" : "var(--amber)" }} />
                    </div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: 60 }}>
                    <div className="mono" style={{ fontSize: 12, fontWeight: 550 }}>{g.pct}%</div>
                    <div style={{ fontSize: 10, color: "var(--text-mute)" }}>{g.failing} fail</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="stack">
          <Card title="Score bands" sub="Skills grouped by quality score">
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <Donut
                size={124}
                thickness={13}
                centerValue={`${data.meta.averageQuality}`}
                centerLabel="avg"
                segments={[
                  { label: "90+", value: data.bands.excellent, color: "var(--accent)" },
                  { label: "80–89", value: data.bands.strong, color: "var(--cyan)" },
                  { label: "70–79", value: data.bands.fair, color: "var(--amber)" },
                  { label: "<70", value: data.bands.thin, color: "var(--rose)" },
                ]}
              />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { l: "Excellent 90+", v: data.bands.excellent, c: "var(--accent)" },
                  { l: "Strong 80–89", v: data.bands.strong, c: "var(--cyan)" },
                  { l: "Fair 70–79", v: data.bands.fair, c: "var(--amber)" },
                  { l: "Thin <70", v: data.bands.thin, c: "var(--rose)" },
                ].map((b) => (
                  <div key={b.l} className="row" style={{ gap: 7, fontSize: 11.5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: b.c }} />
                    <span style={{ color: "var(--text-soft)" }}>{b.l}</span>
                    <span className="spacer" />
                    <b className="mono" style={{ fontWeight: 550 }}>{b.v}</b>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card title="Per repository" sub="Gate pass rate" flush>
            <div style={{ padding: "12px 18px" }}>
              {worstModule.slice(0, 6).map((w) => (
                <div key={w.module.id} style={{ marginBottom: 9 }}>
                  <div className="row" style={{ marginBottom: 4, fontSize: 11.5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 2, background: hueColor(w.module.hue, 70, 62) }} />
                    <span style={{ color: "var(--text-soft)" }}>{w.module.name}</span>
                    <span className="spacer" />
                    <span className="mono" style={{ fontSize: 10.5 }}>{w.passRate}%</span>
                  </div>
                  <div className="bar" style={{ height: 4 }}>
                    <i style={{ width: `${w.passRate}%`, background: w.passRate > 90 ? "var(--accent)" : "var(--amber)" }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card
        title={activeGate ? `Failing: ${activeGate.label}` : mode === "all" ? "All skills by gate compliance" : "Skills that need attention"}
        sub={activeGate ? activeGate.description : "Sorted by how many gates each skill fails"}
        flush
        actions={
          <Segmented
            label="Filter list"
            value={mode}
            onChange={setMode}
            options={[
              { value: "failing", label: "Needs work" },
              { value: "all", label: "Everything" },
            ]}
          />
        }
      >
        <div className="skills">
          {failingSkills.slice(0, 14).map((row) => {
            const s = "skill" in row ? row.skill : row;
            const failing = GATES.filter((g) => !g.pass(s));
            const m = moduleById.get(s.module);
            return (
              <div key={s.id} className="skillrow" role="button" tabIndex={0} onClick={() => select(s)} onKeyDown={(e) => e.key === "Enter" && select(s)}>
                <span className="skillrow__icon" style={{ color: hueColor(m?.hue ?? 200, 72, 66) }}>
                  {s.module.slice(0, 2).toUpperCase()}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="skillrow__name">{s.name}</div>
                  <div className="skillrow__desc">
                    {m?.name} · {s.words} words · {bytes(s.bytes)}
                    {failing.length ? ` · missing ${failing.map((f) => f.label.toLowerCase()).join(", ")}` : " · all gates pass"}
                  </div>
                </div>
                <div className="skillrow__meta">{s.headings.length} h</div>
                <div className="skillrow__meta">
                  <span style={{ color: failing.length ? "var(--amber)" : "var(--accent)" }}>
                    {GATES.length - failing.length}/{GATES.length}
                  </span>
                </div>
                <div className="scorecell">
                  <b>{s.score}</b>
                  <IconChevron width={12} height={12} style={{ color: "var(--text-mute)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
