import { useState } from "react";
import { useStore, bytes, compact } from "../lib/store";
import { Card, Segmented } from "../components/ui";
import { PageHeader } from "../components/Shell";
import { IconCheck, IconRefresh, IconDownload, IconGitBranch, IconX, IconMoon, IconSun } from "../icons";

export function Settings() {
  const { data, theme, toggleTheme, notify, saved, cards, collapsed, setCollapsed, density, setDensity, units, setUnits } = useStore();
  const [telemetry, setTelemetry] = useState(false);

  const reset = () => {
    localStorage.removeItem("atlas.cards");
    localStorage.removeItem("atlas.saved");
    localStorage.removeItem("atlas.modules");
    notify("Local workspace reset — reloading");
    setTimeout(() => location.reload(), 700);
  };

  return (
    <div className="view">
      <PageHeader eyebrow="Workspace" title={<>Appearance &amp; <em style={{ fontStyle: "italic", color: "var(--accent)" }}>data</em></>}>
        Preferences here apply to this browser only. Library data is regenerated from the repository, never edited
        by hand.
      </PageHeader>

      <div className="grid grid--1-1" style={{ marginBottom: 12 }}>
        <Card title="Appearance" sub="Theme and density">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="row">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 550 }}>Theme</div>
                <div style={{ fontSize: 11.5, color: "var(--text-mute)" }}>Dark is tuned for long reading sessions</div>
              </div>
              <button className="btn btn--sm" onClick={toggleTheme}>
                {theme === "dark" ? <IconMoon /> : <IconSun />}
                {theme === "dark" ? "Dark" : "Light"}
              </button>
            </div>
            <div className="row">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 550 }}>Table density</div>
                <div style={{ fontSize: 11.5, color: "var(--text-mute)" }}>Affects skill lists and gate rows</div>
              </div>
              <Segmented
                label="Density"
                value={density}
                onChange={setDensity}
                options={[
                  { value: "comfortable", label: "Comfortable" },
                  { value: "compact", label: "Compact" },
                ]}
              />
            </div>
            <div className="row">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 550 }}>Sidebar</div>
                <div style={{ fontSize: 11.5, color: "var(--text-mute)" }}>Collapse to icons — ⌘[ toggles anytime</div>
              </div>
              <Segmented
                label="Sidebar"
                value={collapsed ? "collapsed" : "expanded"}
                onChange={(v) => setCollapsed(v === "collapsed")}
                options={[
                  { value: "expanded", label: "Expanded" },
                  { value: "collapsed", label: "Collapsed" },
                ]}
              />
            </div>
            <div className="row">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 550 }}>File sizes</div>
                <div style={{ fontSize: 11.5, color: "var(--text-mute)" }}>
                  {units === "binary" ? "Files shown as KiB / MiB (1024)" : "Files shown as KB / MB (1000)"}
                </div>
              </div>
              <Segmented
                label="Units"
                value={units}
                onChange={setUnits}
                options={[
                  { value: "binary", label: "KiB" },
                  { value: "decimal", label: "KB" },
                ]}
              />
            </div>
            <div className="row">
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.5, fontWeight: 550 }}>Anonymous usage</div>
                <div style={{ fontSize: 11.5, color: "var(--text-mute)" }}>Off by default; nothing leaves this browser</div>
              </div>
              <button
                className="btn btn--sm"
                onClick={() => {
                  setTelemetry(!telemetry);
                  notify(telemetry ? "Usage reporting off" : "Usage reporting on — local only");
                }}
                aria-pressed={telemetry}
                style={telemetry ? { borderColor: "var(--accent)", color: "var(--accent)" } : undefined}
              >
                {telemetry ? <><IconCheck /> On</> : <><IconX /> Off</>}
              </button>
            </div>
          </div>
        </Card>

        <Card title="Data source" sub="Where the numbers come from">
          <div className="field">
            <label>Repository</label>
            <div className="field__value">
              <span className="row" style={{ gap: 7 }}><IconGitBranch width={13} height={13} />branch</span>
              <code>{data.meta.branch}</code>
            </div>
          </div>
          <div className="field" style={{ marginTop: 10 }}>
            <label>Base commit</label>
            <div className="field__value"><span>main</span><code>{data.meta.baseCommit}</code></div>
          </div>
          <div className="field" style={{ marginTop: 10 }}>
            <label>Generated</label>
            <div className="field__value"><span>library.json</span><code>{new Date(data.generatedAt).toLocaleString()}</code></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
            {[
              ["Skills", compact.format(data.meta.skills)],
              ["Files scanned", compact.format(data.meta.files)],
              ["Words", compact.format(data.meta.words)],
              ["On disk", bytes(data.meta.bytes)],
            ].map(([l, v]) => (
              <div key={l} className="ring-cell" style={{ textAlign: "left" }}>
                <b>{v}</b>
                <span>{l}</span>
              </div>
            ))}
          </div>
          <div className="row" style={{ marginTop: 14, gap: 8 }}>
            <button className="btn btn--sm" onClick={() => notify("Pulled latest · library unchanged")}>
              <IconRefresh /> Re-scan
            </button>
            <button className="btn btn--sm" onClick={() => notify("library.json downloaded")}>
              <IconDownload /> Download JSON
            </button>
          </div>
        </Card>
      </div>

      <div className="grid grid--1-1">
        <Card title="Local workspace" sub="Stored in this browser via localStorage">
          <div className="kv"><span>Saved skills</span><b>{saved.length}</b></div>
          <div className="kv"><span>Board cards</span><b>{cards.length}</b></div>
          <div className="kv"><span>Repository filters</span><b>persisted</b></div>
          <div className="kv"><span>Theme preference</span><b>{theme}</b></div>
          <div style={{ marginTop: 14 }}>
            <button className="btn btn--sm" onClick={reset} style={{ color: "var(--rose)", borderColor: "color-mix(in srgb, var(--rose) 35%, transparent)" }}>
              Reset local data
            </button>
          </div>
        </Card>

        <Card title="Keyboard" sub="Everything is reachable without the mouse">
          <div className="kv"><span>Search / palette</span><span><kbd className="kbd">⌘</kbd> <kbd className="kbd">K</kbd></span></div>
          <div className="kv"><span>Toggle sidebar</span><span><kbd className="kbd">⌘</kbd> <kbd className="kbd">[</kbd></span></div>
          <div className="kv"><span>Close panel</span><span><kbd className="kbd">esc</kbd></span></div>
          <div className="kv"><span>Open focused row</span><span><kbd className="kbd">↵</kbd></span></div>
          <div className="kv"><span>Move through palette</span><span><kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd></span></div>
        </Card>
      </div>
    </div>
  );
}
