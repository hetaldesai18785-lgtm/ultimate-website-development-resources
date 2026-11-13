# Atlas — library control room

A working, data-driven dashboard for this repository's resource library. It scans
`ultimate-ui-ux-master-skill/modules/` at build time and turns the collection into
something you can actually operate: repository health, skill-level scoring, feature-coverage
mapping and a planning board that persists.

No mock numbers. Every count, bar, score and chart derives from the files in this repo.

## Run it

```bash
cd dashboard
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run data` | Re-scan `../ultimate-ui-ux-master-skill/modules` → `src/data/library.json` |
| `npm run build` | Type-check and produce a static bundle in `dist/` |
| `npm run preview` | Serve the production build |
| `npm run smoke` | Render every view in jsdom and assert dataset invariants |

Run `npm run data` after pulling changes upstream, then reload — the dashboard reflects the
new files immediately.

## What's in it

**Overview** — collection KPIs, a cumulative growth curve (26 weeks), composition donut,
feature-coverage bars, top repositories and the highest-signal skills.

**Repositories** — all 19 preserved collections, sortable by depth, quality, size or name;
filterable by category; expandable to per-repo file stats and its top skills.

**Skill explorer** — all 768 `SKILL.md` files with search, tag chips, repository filters,
sort by quality/depth/name/path, saved shelf and progressive loading (40 per page).

**Feature coverage** — 18 discipline areas ranked by skill count or repository spread, plus a
repository × feature density matrix that shows exactly where guidance is dense and where a
single source is carrying a whole discipline.

**Quality gates** — six gates evaluated against the real files (description length, ≥250 words,
≥3 headings, classifiable, >2 KB, clean excerpt), per-gate failure lists, score bands and a
per-repository pass rate.

**Planning board** — a four-column board (Now / Next / Later / Done) with drag-and-drop, arrow
controls, linked skills, and a saved shelf. Cards persist in `localStorage`.

**Workspace** — theme, density, sidebar and unit preferences, plus the data provenance
(branch, base commit, generation timestamp) and a local-data reset.

## Interaction

| Key | Action |
| --- | --- |
| `⌘K` / `Ctrl K` | Command palette — jump to a view or search skills |
| `⌘[` | Collapse / expand the sidebar |
| `↑ ↓ ↵` | Navigate and open palette results |
| `esc` | Close the detail panel or palette |

Other behaviours worth knowing: the detail drawer copies repository paths, saves skills to
your shelf and can push a review card straight onto the board. All preferences, saved skills
and board cards live in `localStorage` under the `atlas.*` namespace.

## Design

A dark, low-chrome control room with a lime signal accent, Instrument Serif display type
against Inter Tight UI text, and JetBrains Mono for all numerics. Charts are hand-built SVG
(no chart dependency), animation respects `prefers-reduced-motion`, focus states are visible
throughout, and the layout collapses cleanly down to a phone-width rail.

## Data pipeline

`scripts/generate-data.mjs` walks the module tree (skipping `.git` and `node_modules`),
parses YAML frontmatter from every `SKILL.md`, classifies each skill against a 17-rule
keyword taxonomy, and derives:

- **Quality score (52–99)** — frontmatter completeness, description length, heading count,
  document length and file size. Deterministic: the same files always produce the same score.
- **Feature tags** — up to three discipline areas per skill.
- **Repository stats** — skills, docs, scripts, assets, file count and bytes on disk.

Output is a single `src/data/library.json` (~650 KB) committed alongside the app so the
dashboard builds without scanning 900 MB of source on every install.
