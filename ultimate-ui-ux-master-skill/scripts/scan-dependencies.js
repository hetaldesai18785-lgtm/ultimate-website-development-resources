const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const MODULES = path.join(ROOT, "modules");
const index = JSON.parse(fs.readFileSync("registry/skills-index.json", "utf8"));
const skills = Array.isArray(index) ? index : index.skills;

const files = [];

function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) walk(full);
    else files.push(full);
  }
}
walk(MODULES);

function wildcardMatch(pattern, candidate) {
  const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*").replace(/\?/g, ".");
  return new RegExp("^" + escaped + "$").test(candidate);
}

function findMatches(base, ref) {
  const normalized = ref.replace(/\\/g, "/").replace(/^\.?\//, "");
  const wildcard = /[*?]/.test(normalized);
  const matches = [];

  for (const file of files) {
    const rel = path.relative(base, file).split(path.sep).join("/");
    const moduleRel = path.relative(MODULES, file).split(path.sep).join("/");
    const target = wildcard ? normalized : normalized;

    if (
      wildcard
        ? wildcardMatch(target, rel) || wildcardMatch(target, moduleRel)
        : rel === target || moduleRel === target
    ) matches.push(path.relative(ROOT, file).split(path.sep).join("/"));
  }
  return [...new Set(matches)];
}

const results = [];

for (const skill of skills) {
  const skillFile = path.resolve(ROOT, skill.path);
  if (!fs.existsSync(skillFile)) continue;

  const content = fs.readFileSync(skillFile, "utf8");
  const skillDir = path.dirname(skillFile);
  const moduleDir = path.resolve(MODULES, skill.path.split("/")[1]);

  const candidates = content.match(
    /(?:\.{1,2}\/)?(?:references|scripts|assets|examples|templates|workflows)\/[A-Za-z0-9_.*?/-]+/g
  ) || [];

  const refs = [...new Set(candidates.map(x =>
    x.replace(/[)\]>,.;:'"`]+$/, "")
  ))];

  const dependencies = refs.map(ref => {
    if (ref.includes("<") || ref.includes(">")) {
      return { reference: ref, status: "unresolved" };
    }

    const local = path.resolve(skillDir, ref);
    if (fs.existsSync(local)) {
      return {
        reference: ref,
        status: "local",
        foundAt: path.relative(ROOT, local).split(path.sep).join("/")
      };
    }

    const matches = [
      ...findMatches(skillDir, ref),
      ...findMatches(moduleDir, ref)
    ].filter((v, i, a) => a.indexOf(v) === i);

    if (matches.length === 1) {
      return { reference: ref, status: "shared", foundAt: matches[0] };
    }
    if (matches.length > 1) {
      return {
        reference: ref,
        status: "unresolved",
        possibleLocations: matches.slice(0, 10)
      };
    }
    return { reference: ref, status: "missing" };
  });

  results.push({
    name: skill.name,
    repository: skill.repository,
    skill: skill.path,
    dependencies
  });
}

const counts = { local: 0, shared: 0, missing: 0, unresolved: 0 };
for (const skill of results) {
  for (const dep of skill.dependencies) counts[dep.status]++;
}

const report = {
  scannedAt: new Date().toISOString(),
  skillsScanned: results.length,
  referenceCandidates: Object.values(counts).reduce((a, b) => a + b, 0),
  counts,
  skills: results
};

fs.writeFileSync("registry/dependencies.json", JSON.stringify(report, null, 2));

console.log("Improved scan completed.");
console.log("Skills scanned:", report.skillsScanned);
console.log("Local:", counts.local);
console.log("Shared:", counts.shared);
console.log("Missing:", counts.missing);
console.log("Unresolved:", counts.unresolved);
console.log("Created: registry/dependencies.json");
