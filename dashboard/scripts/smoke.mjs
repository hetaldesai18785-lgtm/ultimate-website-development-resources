/**
 * Smoke test: build the app's data + run a real React render of each view in
 * jsdom, then assert each view produced content and no console errors.
 */
import { JSDOM } from "jsdom";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dom = new JSDOM("<!doctype html><div id='root'></div>", { url: "http://localhost/", pretendToBeVisual: true });
global.window = dom.window;
global.document = dom.window.document;

global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.getComputedStyle = dom.window.getComputedStyle;
global.matchMedia = dom.window.matchMedia =
  window.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
global.localStorage = dom.window.localStorage;
global.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
dom.window.requestAnimationFrame = global.requestAnimationFrame;
dom.window.cancelAnimationFrame = global.cancelAnimationFrame;
window.scrollTo = () => {};

const errors = [];
const origError = console.error;
console.error = (...a) => {
  errors.push(a.map(String).join(" "));
  origError(...a);
};

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/data/library.json"), "utf8"));

// Invariants on the generated dataset.
const checks = [];
const ok = (name, cond, extra = "") => checks.push({ name, pass: !!cond, extra });
ok("skills > 700", data.skills.length > 700, String(data.skills.length));
ok("modules === 19", data.modules.length === 19, String(data.modules.length));
ok("features >= 15", data.features.length >= 15, String(data.features.length));
ok("every skill has a module row", data.skills.every((s) => data.modules.some((m) => m.id === s.module)));
ok("every skill has tags", data.skills.every((s) => s.tags.length > 0));
ok("every skill has a description", data.skills.every((s) => s.description && s.description.length > 10));
ok("scores bounded 0-100", data.skills.every((s) => s.score >= 0 && s.score <= 100));
ok("weekly totals increase", data.weekly.every((w, i) => i === 0 || w.total >= data.weekly[i - 1].total));
ok("no duplicate skill ids", new Set(data.skills.map((s) => s.id)).size === data.skills.length);
ok("feature counts match skills", data.features.every((f) => data.skills.filter((s) => s.tags.includes(f.name)).length === f.count));

const { renderToString } = await import("react-dom/server");
const React = await import("react");
const { StoreProvider } = await import("../src/lib/store.tsx");
const views = {
  Overview: (await import("../src/views/Overview.tsx")).Overview,
  Library: (await import("../src/views/Library.tsx")).Library,
  Skills: (await import("../src/views/Skills.tsx")).Skills,
  Features: (await import("../src/views/Features.tsx")).Features,
  Quality: (await import("../src/views/Quality.tsx")).Quality,
  Board: (await import("../src/views/Board.tsx")).Board,
  Settings: (await import("../src/views/Settings.tsx")).Settings,
};

for (const [name, View] of Object.entries(views)) {
  try {
    const html = renderToString(
      React.createElement(StoreProvider, null, React.createElement(View))
    );
    ok(`render ${name}`, html.length > 1500, `${html.length} chars`);
    ok(`render ${name} has text`, /[A-Za-z]{8}/.test(html.replace(/<[^>]+>/g, "")));
  } catch (e) {
    ok(`render ${name}`, false, String(e).slice(0, 300));
  }
}

const failed = checks.filter((c) => !c.pass);
for (const c of checks) console.log(`${c.pass ? "✓" : "✗"} ${c.name}${c.extra ? `  (${c.extra})` : ""}`);
if (errors.length) {
  console.log("\nconsole errors:");
  errors.slice(0, 12).forEach((e) => console.log("  ! " + e.slice(0, 400)));
}
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed, ${errors.length} console errors`);
process.exit(failed.length || errors.length ? 1 : 0);
