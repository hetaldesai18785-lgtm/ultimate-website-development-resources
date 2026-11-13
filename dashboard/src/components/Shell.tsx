import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useStore, fmt, allSkills, moduleById, hueColor } from "../lib/store";
import type { ViewId } from "../lib/types";
import {
  IconGauge,
  IconGrid,
  IconLayers,
  IconSpark,
  IconSearch,
  IconBell,
  IconMoon,
  IconSun,
  IconPanelLeft,
  IconShield,
  IconCommand,
  IconCheck,
  IconX,
  IconBookmark,
} from "../icons";

const NAV: { group: string; items: { id: ViewId; label: string; icon: (p: any) => JSX.Element }[] }[] = [
  {
    group: "Operate",
    items: [
      { id: "overview", label: "Overview", icon: IconGauge },
      { id: "library", label: "Repositories", icon: IconGrid },
      { id: "skills", label: "Skill explorer", icon: IconLayers },
    ],
  },
  {
    group: "Analyse",
    items: [
      { id: "features", label: "Feature coverage", icon: IconSpark },
      { id: "quality", label: "Quality gates", icon: IconShield },
      { id: "board", label: "Planning board", icon: IconBookmark },
    ],
  },
  {
    group: "Configure",
    items: [{ id: "settings", label: "Workspace", icon: IconCommand }],
  },
];

export function Rail() {
  const { view, setView, collapsed, data, saved } = useStore();
  const counts: Partial<Record<ViewId, number>> = {
    library: data.meta.modules,
    skills: data.meta.skills,
    features: data.meta.features,
    board: saved.length || undefined,
  };
  return (
    <aside className="rail" aria-label="Primary">
      <div className="rail__brand">
        <div className="rail__mark">A</div>
        <div className="rail__wordmark">
          <strong>Atlas</strong>
          <span>Resource control room</span>
        </div>
      </div>
      <nav className="rail__nav">
        {NAV.map((g) => (
          <div key={g.group}>
            <div className="rail__group">{g.group}</div>
            {g.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className="navitem"
                  data-active={view === item.id}
                  aria-current={view === item.id ? "page" : undefined}
                  onClick={() => setView(item.id)}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon />
                  <span>{item.label}</span>
                  {counts[item.id] ? <span className="navitem__count mono">{fmt.format(counts[item.id]!)}</span> : null}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="rail__foot">
        <div className="pill" style={{ width: "fit-content", maxWidth: "100%" }}>
          <span className="dot" />
          <span className="mono" style={{ fontSize: 10 }}>
            {data.meta.baseCommit}
          </span>
          <span style={{ color: "var(--text-mute)", fontSize: 10 }}>synced</span>
        </div>
        <button className="rail__user">
          <span className="avatar">HD</span>
          <span style={{ minWidth: 0, textAlign: "left" }}>
            <span style={{ display: "block", fontSize: 12, fontWeight: 550 }}>Hetal Desai</span>
            <span style={{ display: "block", fontSize: 10, color: "var(--text-mute)" }}>Curator</span>
          </span>
        </button>
      </div>
    </aside>
  );
}

export function Topbar() {
  const {
    query,
    setQuery,
    theme,
    toggleTheme,
    collapsed,
    setCollapsed,
    setSearchRef,
    data,
    setView,
    notify,
  } = useStore();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const el = document.getElementById("global-search") as HTMLInputElement | null;
    setSearchRef(el);
  }, [setSearchRef]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return allSkills
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [query]);

  return (
    <>
      <header className="topbar">
        <button className="iconbtn" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle navigation" title="Toggle navigation (⌘[)">
          <IconPanelLeft />
        </button>
        <div className="search">
          <IconSearch />
          <input
            id="global-search"
            placeholder="Search 768 skills, 19 repositories, 18 feature areas…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) setView("skills");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && suggestions[0]) {
                setView("skills");
                setPaletteOpen(false);
              }
            }}
            aria-label="Search the library"
          />
          <span className="search__hint">
            <kbd className="kbd">⌘</kbd>
            <kbd className="kbd">K</kbd>
          </span>
        </div>
        <div className="topbar__right">
          <span className="pill topbar__hide-sm">
            <span className="dot" />
            {data.meta.skills} skills indexed
          </span>
          <button className="iconbtn topbar__hide-sm" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? <IconSun /> : <IconMoon />}
          </button>
          <button className="iconbtn" onClick={() => setPaletteOpen(true)} aria-label="Quick actions">
            <IconCommand />
          </button>
          <button
            className="iconbtn"
            aria-label="Notifications"
            onClick={() => notify("3 changes behind main · nothing needs review")}
          >
            <IconBell />
            <span className="iconbtn__badge" />
          </button>
        </div>
      </header>
      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          query={query}
          setQuery={setQuery}
          suggestions={suggestions}
        />
      )}
    </>
  );
}

function CommandPalette({
  onClose,
  query,
  setQuery,
  suggestions,
}: {
  onClose: () => void;
  query: string;
  setQuery: (s: string) => void;
  suggestions: ReturnType<typeof useStore>["data"]["skills"];
}) {
  const { setView, select, notify } = useStore();
  const [idx, setIdx] = useState(0);
  const actions: { label: string; hint: string; run: () => void }[] = [
    { label: "Go to overview", hint: "G then O", run: () => setView("overview") },
    { label: "Browse repositories", hint: "G then R", run: () => setView("library") },
    { label: "Open skill explorer", hint: "G then S", run: () => setView("skills") },
    { label: "Inspect feature coverage", hint: "G then F", run: () => setView("features") },
    { label: "Review quality gates", hint: "G then Q", run: () => setView("quality") },
    { label: "Open planning board", hint: "G then B", run: () => setView("board") },
    { label: "Export library index", hint: "⌘ E", run: () => notify("library.csv queued for export") },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setIdx((i) => i + 1);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setIdx((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const items = query.trim() ? suggestions : actions;

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        style={{
          position: "fixed",
          top: "14vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(560px, calc(100vw - 32px))",
          zIndex: 95,
          background: "var(--bg-raised)",
          border: "1px solid var(--line-strong)",
          borderRadius: "var(--r-lg)",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
          animation: "view-in .3s var(--ease-out) both",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: "1px solid var(--line)" }}>
          <IconSearch style={{ color: "var(--text-mute)" }} />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIdx(0);
            }}
            placeholder="Jump to a view or search skills…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 14 }}
            aria-label="Command palette input"
          />
          <button className="iconbtn" onClick={onClose} aria-label="Close">
            <IconX />
          </button>
        </div>
        <div style={{ maxHeight: 340, overflowY: "auto", padding: 6 }}>
          {items.length === 0 && <div className="empty">No matches for “{query}”.</div>}
          {items.map((it, i) => {
            const isSkill = "module" in it;
            return (
              <button
                key={isSkill ? it.id : it.label}
                onClick={() => {
                  if (isSkill) {
                    select(it);
                    onClose();
                    return;
                  }
                  it.run();
                  onClose();
                }}
                onMouseEnter={() => setIdx(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "9px 11px",
                  borderRadius: 8,
                  textAlign: "left",
                  background: idx === i ? "rgba(255,255,255,.06)" : "transparent",
                }}
              >
                {isSkill ? (
                  <span
                    className="skillrow__icon"
                    style={{
                      color: hueColor(moduleById.get(it.module)?.hue ?? 200, 70, 66),
                      flex: "0 0 26px",
                      width: 26,
                      height: 26,
                    }}
                  >
                    {it.module.slice(0, 2).toUpperCase()}
                  </span>
                ) : (
                  <IconCommand style={{ color: "var(--text-mute)", width: 15, height: 15 }} />
                )}
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 12.5, fontWeight: 550, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {isSkill ? it.name : it.label}
                  </span>
                  <span style={{ display: "block", fontSize: 11, color: "var(--text-mute)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {isSkill ? `${moduleById.get(it.module)?.name} · ${it.tags.join(", ")}` : it.hint}
                  </span>
                </span>
                {isSkill && <span className="mono" style={{ fontSize: 10.5, color: "var(--text-mute)" }}>{it.score}</span>}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 12, padding: "9px 14px", borderTop: "1px solid var(--line)", fontSize: 10.5, color: "var(--text-mute)" }}>
          <span><kbd className="kbd">↑</kbd> <kbd className="kbd">↓</kbd> navigate</span>
          <span><kbd className="kbd">↵</kbd> open</span>
          <span><kbd className="kbd">esc</kbd> dismiss</span>
        </div>
      </div>
    </>
  );
}

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div className="toast" role="status">
      <IconCheck />
      {toast}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 20,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div className="eyebrow" style={{ marginBottom: 9 }}>{eyebrow}</div>
        <h1 className="display" style={{ fontSize: "clamp(26px,2.6vw,36px)", lineHeight: 1.05 }}>{title}</h1>
        {children && <div style={{ marginTop: 10, fontSize: 13, color: "var(--text-soft)", maxWidth: 640 }}>{children}</div>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>{actions}</div>}
    </div>
  );
}
