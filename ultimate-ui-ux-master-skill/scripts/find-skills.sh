#!/data/data/com.termux/files/usr/bin/bash

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODULES="$ROOT/modules"

if [ -z "$1" ]; then
  echo 'Usage: ./scripts/find-skills.sh "keywords"'
  exit 1
fi

python - "$MODULES" "$*" <<'PY'
import os, sys, re

root, query = sys.argv[1], sys.argv[2]
terms = list(dict.fromkeys(re.findall(r"[\w-]+", query.lower())))

results = []

for base, dirs, files in os.walk(root):
    if "SKILL.md" not in files:
        continue

    path = os.path.join(base, "SKILL.md")
    rel = os.path.relpath(path, root)

    try:
        with open(path, encoding="utf-8", errors="ignore") as f:
            content = f.read()
    except OSError:
        continue

    lines = content.splitlines()
    name = os.path.basename(base).replace("-", " ").lower()

    front = ""
    if lines and lines[0].strip() == "---":
        for line in lines[1:]:
            if line.strip() == "---":
                break
            front += line + "\n"

    front_lower = front.lower()
    description = ""

    match = re.search(
        r"(?ms)^description:\s*(.*?)(?=^\S|\Z)",
        front
    )
    if match:
        description = match.group(1).lower()

    headings = "\n".join(
        line for line in lines if line.strip().startswith("#")
    ).lower()

    body = content.lower()
    score = 0

    for term in terms:
        if term in name:
            score += 15
        if term in front_lower:
            score += 12
        if term in description:
            score += 8
        if term in headings:
            score += 5
        score += min(body.count(term), 2)

    if query.lower() in name:
        score += 20
    if query.lower() in description:
        score += 15

    if score:
        results.append((score, rel))

results.sort(key=lambda x: (-x[0], x[1]))

print("=" * 60)
print(" ULTIMATE UI/UX MASTER — SMART SKILL SEARCH")
print("=" * 60)
print("Query:", query)
print("Relevant matches:", len(results))
print("Showing top 20 results\n")

for score, path in results[:20]:
    print(f"[Score: {score:03}] {path}")

if not results:
    print("No matching skills found.")
PY
