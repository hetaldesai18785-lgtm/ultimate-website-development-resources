#!/data/data/com.termux/files/usr/bin/bash

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODULES="$ROOT/modules"

if [ -z "$1" ]; then
  echo 'Usage: ./scripts/inspect-skill.sh "repository/path/SKILL.md"'
  exit 1
fi

python - "$MODULES" "$1" <<'PY'
import os, sys, re

modules = os.path.realpath(sys.argv[1])
requested = sys.argv[2]
path = os.path.realpath(os.path.join(modules, requested))

if not path.startswith(modules + os.sep) or not os.path.isfile(path):
    print("ERROR: Skill file not found inside modules.")
    sys.exit(1)

skill_dir = os.path.dirname(path)

with open(path, encoding="utf-8", errors="ignore") as f:
    content = f.read()

print("=" * 65)
print(" ULTIMATE UI/UX MASTER — SKILL DEPENDENCY INSPECTOR")
print("=" * 65)
print("Skill:", os.path.relpath(path, modules))
print("Folder:", os.path.relpath(skill_dir, modules))

found = set()
unresolved = set()

# Find Markdown links and inline file paths.
patterns = [
    r'\[[^\]]*\]\(([^)]+)\)',
    r'`([^`\n]+\.(?:md|json|yaml|yml|js|ts|py|css|html|svg|png|jpg|webp))`',
]

for pattern in patterns:
    for match in re.findall(pattern, content, flags=re.I):
        ref = match.split("#")[0].strip()
        if not ref or ref.startswith(("http://", "https://", "mailto:")):
            continue

        candidate = os.path.realpath(os.path.join(skill_dir, ref))

        if candidate.startswith(modules + os.sep) and os.path.isfile(candidate):
            found.add(candidate)
        elif not os.path.isabs(ref):
            unresolved.add(ref)

print("\n[1] REFERENCED FILES")
if found:
    for item in sorted(found):
        print("  FOUND:", os.path.relpath(item, modules))
else:
    print("  No existing local file references detected.")

print("\n[2] UNRESOLVED REFERENCES")
if unresolved:
    for item in sorted(unresolved):
        print("  CHECK:", item)
else:
    print("  None detected.")

print("\n[3] SUPPORTING FILES IN SKILL FOLDER")
support = []
for base, dirs, files in os.walk(skill_dir):
    dirs[:] = [d for d in dirs if d not in {".git", "node_modules", "__pycache__"}]
    for filename in files:
        full = os.path.join(base, filename)
        if full == path:
            continue
        support.append(os.path.relpath(full, modules))

if support:
    for item in sorted(support)[:100]:
        print("  FILE:", item)
    if len(support) > 100:
        print("  ...and", len(support) - 100, "more files")
else:
    print("  No additional files in this skill folder.")

print("\n[4] POSSIBLE COMPANION SKILLS")
nearby = []
for base, dirs, files in os.walk(skill_dir):
    dirs[:] = [d for d in dirs if d not in {".git", "node_modules", "__pycache__"}]
    for filename in files:
        if filename == "SKILL.md":
            candidate = os.path.join(base, filename)
            if candidate != path:
                nearby.append(os.path.relpath(candidate, modules))

if nearby:
    for item in sorted(nearby)[:50]:
        print("  SKILL:", item)
else:
    print("  No nested companion skills detected.")

print("\nInspection complete. Original files were not modified.")
PY
