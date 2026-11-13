# ultimate-website-development-resources

A curated collection of web development design resources — 18 preserved repositories,
768 `SKILL.md` files and thousands of supporting references, scripts and assets, organised
under [`ultimate-ui-ux-master-skill/`](./ultimate-ui-ux-master-skill).

## Atlas dashboard

[`dashboard/`](./dashboard) is a working control room for the collection. It scans the
modules at build time and turns them into repository health, skill-level quality scores,
feature-coverage maps and a persistent planning board.

```bash
cd dashboard
npm install
npm run dev      # http://localhost:5173
```

Regenerate the dataset after pulling upstream changes with `npm run data`, verify it with
`npm run smoke`, and ship a static bundle with `npm run build`.

See [`dashboard/README.md`](./dashboard/README.md) for the full tour.

## The library

| Path | Contents |
| --- | --- |
| `ultimate-ui-ux-master-skill/SKILL.md` | Orchestrator: task classification and skill routing |
| `ultimate-ui-ux-master-skill/modules/` | 18 preserved upstream repositories, kept intact |
| `ultimate-ui-ux-master-skill/scripts/` | `find-skills.sh`, `inspect-skill.sh`, `load-skill.sh` |
| `ultimate-ui-ux-master-skill/dist/` | Packaged Figma build bundle |

The modules are source material, not automatically active skills. Read
`ultimate-ui-ux-master-skill/SKILL.md` first — it explains how to route a request to the right
specialist collection.
