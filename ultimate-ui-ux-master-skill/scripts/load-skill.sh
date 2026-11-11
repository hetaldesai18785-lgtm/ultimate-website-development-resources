#!/data/data/com.termux/files/usr/bin/bash

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODULES="$ROOT/modules"

if [ -z "$1" ]; then
  echo 'Usage: ./scripts/load-skill.sh "repository/path/SKILL.md"'
  exit 1
fi

python - "$MODULES" "$ROOT" "$1" <<'PY'
import os, sys, re, shutil, zipfile

modules = os.path.realpath(sys.argv[1])
root = sys.argv[2]
requested = sys.argv[3]

source = os.path.realpath(os.path.join(modules, requested))

if not source.startswith(modules + os.sep) or not os.path.isfile(source):
    print("ERROR: Skill not found inside modules.")
    sys.exit(1)

skill_dir = os.path.dirname(source)
name = os.path.basename(skill_dir)
dist = os.path.join(root, "dist")
bundle = os.path.join(dist, name + "-bundle")
zip_path = bundle + ".zip"

if os.path.exists(bundle) or os.path.exists(zip_path):
    print("ERROR: Bundle already exists.")
    print("Existing output:", bundle)
    print("To rebuild, remove that generated bundle and ZIP first.")
    sys.exit(1)

os.makedirs(dist, exist_ok=True)

shutil.copytree(
    skill_dir,
    bundle,
    ignore=shutil.ignore_patterns(".git", "node_modules", "__pycache__")
)

with open(source, encoding="utf-8", errors="ignore") as f:
    content = f.read()

found = set()
unresolved = set()
directories = set()

patterns = [
    r'\[[^\]]*\]\(([^)]+)\)',
    r'`([^`\n]+\.(?:md|json|yaml|yml|js|ts|py|css|html|svg|png|jpg|webp))`',
]

for pattern in patterns:
    for ref in re.findall(pattern, content, flags=re.I):
        ref = ref.split("#")[0].strip()

        if not ref or ref.startswith(("http://", "https://", "mailto:", "#")):
            continue

        candidate = os.path.realpath(os.path.join(skill_dir, ref))

        if not candidate.startswith(modules + os.sep):
            unresolved.add(ref)
        elif os.path.isfile(candidate):
            found.add(os.path.relpath(candidate, skill_dir))
        elif os.path.isdir(candidate):
            directories.add(os.path.relpath(candidate, skill_dir))
        else:
            unresolved.add(ref)

files = []
for base, dirs, filenames in os.walk(bundle):
    dirs[:] = [d for d in dirs if d not in {".git", "node_modules", "__pycache__"}]
    for filename in filenames:
        files.append(os.path.relpath(os.path.join(base, filename), bundle))

report = [
    "# Skill Bundle Report",
    "",
    f"- Skill: {name}",
    f"- Source: {os.path.relpath(source, modules)}",
    f"- Files copied: {len(files)}",
    "",
    "## Detected local file references",
]

report += [f"- {x}" for x in sorted(found)] or ["- None detected"]

report += ["", "## Detected directories"]
report += [f"- {x}/" for x in sorted(directories)] or ["- None detected"]

report += ["", "## Unresolved references"]
report += [f"- {x}" for x in sorted(unresolved)] or ["- None detected"]

report += ["", "## Files included"]
report += [f"- {x}" for x in sorted(files)]

with open(os.path.join(bundle, "BUNDLE-REPORT.md"), "w", encoding="utf-8") as f:
    f.write("\n".join(report) + "\n")

with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for base, dirs, filenames in os.walk(bundle):
        dirs[:] = [d for d in dirs if d not in {".git", "node_modules", "__pycache__"}]
        for filename in filenames:
            full = os.path.join(base, filename)
            arc = os.path.relpath(full, dist)
            z.write(full, arc)

print("=" * 55)
print(" ULTIMATE UI/UX MASTER — SKILL BUNDLE CREATED")
print("=" * 55)
print("Skill:", name)
print("Files copied:", len(files))
print("Detected file references:", len(found))
print("Detected directories:", len(directories))
print("Unresolved references:", len(unresolved))
print("Bundle folder:", bundle)
print("ZIP archive:", zip_path)
print("\nReview BUNDLE-REPORT.md before using the skill.")
PY
