import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import library from "../data/library.json";
import type { BoardCard, Library, Priority, Skill, ViewId } from "./types";

const data = library as unknown as Library;

/* ---------- persisted state ---------- */

function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

const SEED_CARDS: BoardCard[] = [
  {
    id: "seed-1",
    title: "Wire a11y contrast gates into CI",
    detail: "ux-ui-agent-skills ships 52 gates; only contrast is not yet enforced on pull requests.",
    tag: "Quality Gates",
    priority: "now",
    linkedSkill: "ux-ui-agent-skills:skills",
    createdAt: Date.now() - 864e5 * 2,
  },
  {
    id: "seed-2",
    title: "Promote motion guidelines to core",
    detail: "160 skills mention motion across 9 modules — the guidance overlaps in four places.",
    tag: "Motion",
    priority: "next",
    createdAt: Date.now() - 864e5 * 5,
  },
  {
    id: "seed-3",
    title: "Consolidate Figma workflows",
    detail: "figwright and ai-design-skills both author frames; pick one canonical entry point.",
    tag: "Figma",
    priority: "next",
    createdAt: Date.now() - 864e5 * 6,
  },
  {
    id: "seed-4",
    title: "Rewrite thin skill descriptions",
    detail: "Three skills score under 70 — most lack a frontmatter description longer than one line.",
    tag: "Content",
    priority: "later",
    createdAt: Date.now() - 864e5 * 9,
  },
  {
    id: "seed-5",
    title: "Archive REA into an engineering volume",
    detail: "REA contributes 116 MB of binaries; it is not a UI/UX skill and skews library size metrics.",
    tag: "Library",
    priority: "later",
    createdAt: Date.now() - 864e5 * 11,
  },
  {
    id: "seed-6",
    title: "Publish the orchestrator routing table",
    detail: "SKILL.md classifies tasks A–G; surface it as a browsable index in the dashboard.",
    tag: "Agent Workflow",
    priority: "done",
    createdAt: Date.now() - 864e5 * 14,
  },
];

/* ---------- helpers shared across views ---------- */

export const allModules = data.modules;
export const allSkills = data.skills;

export const moduleById = new Map(data.modules.map((m) => [m.id, m]));

export const skillsByModule = data.skills.reduce<Record<string, Skill[]>>((acc, s) => {
  (acc[s.module] ||= []).push(s);
  return acc;
}, {});

export const featureIndex = data.features;

export const hotFeatures = featureIndex.slice(0, 8);

export function hueColor(hue: number, s = 70, l = 62, a = 1) {
  return `hsl(${hue} ${s}% ${l}% / ${a})`;
}

export function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  const day = 864e5;
  if (diff < 6e4) return "just now";
  if (diff < 36e5) return `${Math.round(diff / 6e4)}m ago`;
  if (diff < day) return `${Math.round(diff / 36e5)}h ago`;
  if (diff < day * 30) return `${Math.round(diff / day)}d ago`;
  return new Date(ts).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export const fmt = new Intl.NumberFormat("en-US");
export const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export function bytes(n: number) {
  const units = ["B", "KB", "MB", "GB"];
  let v = n;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v < 10 && i > 0 ? v.toFixed(1) : Math.round(v)} ${units[i]}`;
}

/* ---------- context ---------- */

interface Store {
  data: Library;
  view: ViewId;
  setView: (v: ViewId) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  collapsed: boolean;
  setCollapsed: (b: boolean) => void;
  query: string;
  setQuery: (q: string) => void;
  selected: Skill | null;
  select: (s: Skill | null) => void;
  saved: string[];
  toggleSave: (id: string) => void;
  cards: BoardCard[];
  addCard: (c: Omit<BoardCard, "id" | "createdAt">) => void;
  moveCard: (id: string, p: Priority) => void;
  removeCard: (id: string) => void;
  activeModules: string[];
  toggleModule: (id: string) => void;
  activeFeature: string | null;
  setActiveFeature: (f: string | null) => void;
  density: "comfortable" | "compact";
  setDensity: (d: "comfortable" | "compact") => void;
  units: "binary" | "decimal";
  setUnits: (u: "binary" | "decimal") => void;
  toast: string | null;
  notify: (msg: string) => void;
  focusSearch: () => void;
  searchRef: React.RefObject<HTMLInputElement> | null;
  setSearchRef: (el: HTMLInputElement | null) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ViewId>("overview");
  const [theme, setTheme] = usePersisted<"dark" | "light">("atlas.theme", "dark");
  const [collapsed, setCollapsed] = usePersisted("atlas.collapsed", false);
  const [query, setQuery] = useState("");
  const [selected, select] = useState<Skill | null>(null);
  const [saved, setSaved] = usePersisted<string[]>("atlas.saved", []);
  const [cards, setCards] = usePersisted<BoardCard[]>("atlas.cards", SEED_CARDS);
  const [activeModules, setActiveModules] = usePersisted<string[]>("atlas.modules", []);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [density, setDensity] = usePersisted<"comfortable" | "compact">("atlas.density", "comfortable");
  const [units, setUnits] = usePersisted<"binary" | "decimal">("atlas.units", "binary");
  const [toast, setToast] = useState<string | null>(null);
  const [searchEl, setSearchEl] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchEl?.focus();
        searchEl?.select();
      }
      if (e.key === "Escape") select(null);
      if (e.key === "[" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCollapsed((c) => !c);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchEl, setCollapsed]);

  const store = useMemo<Store>(
    () => ({
      data,
      view,
      setView: (v) => {
        setView(v);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      theme,
      toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
      collapsed,
      setCollapsed,
      query,
      setQuery,
      selected,
      select,
      saved,
      toggleSave: (id) =>
        setSaved((prev) => {
          const has = prev.includes(id);
          setToast(has ? "Removed from saved" : "Saved to your shelf");
          return has ? prev.filter((x) => x !== id) : [...prev, id];
        }),
      cards,
      addCard: (c) =>
        setCards((prev) => [
          { ...c, id: `card-${Date.now().toString(36)}`, createdAt: Date.now() },
          ...prev,
        ]),
      moveCard: (id, p) => setCards((prev) => prev.map((c) => (c.id === id ? { ...c, priority: p } : c))),
      removeCard: (id) => setCards((prev) => prev.filter((c) => c.id !== id)),
      activeModules,
      toggleModule: (id) =>
        setActiveModules((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
      activeFeature,
      setActiveFeature,
      density,
      setDensity,
      units,
      setUnits,
      toast,
      notify: setToast,
      focusSearch: () => searchEl?.focus(),
      searchRef: null,
      setSearchRef: setSearchEl,
    }),
    [view, theme, collapsed, query, selected, saved, cards, activeModules, activeFeature, density, units, toast, setSaved, setCollapsed, setCards, setDensity, setUnits]
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
