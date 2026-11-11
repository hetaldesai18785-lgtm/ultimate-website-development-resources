#!/usr/bin/env bash
#
# Qiaomu Skills Installer
# Install qiaomu skills from GitHub by category or name
#
# Usage:
#   ./install.sh all              # Install all 19 skills
#   ./install.sh content          # Install content creation skills
#   ./install.sh research         # Install research & learning skills
#   ./install.sh design           # Install design & media skills
#   ./install.sh tools            # Install productivity tools
#   ./install.sh qiaomu-writer qiaomu-image-generator  # Install specific skills
#   ./install.sh --dry-run all    # Preview without installing
#   ./install.sh --list           # List all available skills

set -euo pipefail

GITHUB_USER="joeseesun"

# ── Skill Categories ──────────────────────────────────────────────
CONTENT_SKILLS=(
  qiaomu-writer
  qiaomu-content-interpreter
  qiaomu-article-team
  qiaomu-x-article-publisher
  qiaomu-word-card
)

RESEARCH_SKILLS=(
  qiaomu-ai-radar
  qiaomu-paper-interpreter
  qiaomu-libgen-downloader
  qiaomu-epub-book-generator
)

DESIGN_SKILLS=(
  qiaomu-image-generator
  qiaomu-mondo-poster-design
  qiaomu-info-card-designer
  qiaomu-video-composer
  qiaomu-design-advisor
  qiaomu-music-player-spotify
)

TOOLS_SKILLS=(
  qiaomu-music-player-ncm
  qiaomu-mac-cleaner
  qiaomu-markdown-proxy
  qiaomu-index-update
)

ALL_SKILLS=(
  "${CONTENT_SKILLS[@]}"
  "${RESEARCH_SKILLS[@]}"
  "${DESIGN_SKILLS[@]}"
  "${TOOLS_SKILLS[@]}"
)

# ── Colors ────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

# ── State ─────────────────────────────────────────────────────────
DRY_RUN=false
INSTALLED=()
FAILED=()
SKIPPED=()

# ── Functions ─────────────────────────────────────────────────────

usage() {
  cat <<EOF
${BOLD}Qiaomu Skills Installer${NC}

${BOLD}Usage:${NC}
  $(basename "$0") [OPTIONS] <category|skill-names...>

${BOLD}Categories:${NC}
  all       Install all 19 skills
  content   Content creation (${#CONTENT_SKILLS[@]} skills): writer, interpreter, article-team, x-publisher, word-card
  research  Research & learning (${#RESEARCH_SKILLS[@]} skills): ai-radar, paper-interpreter, libgen, epub-generator
  design    Design & media (${#DESIGN_SKILLS[@]} skills): image-gen, poster, info-card, video, design-advisor, spotify
  tools     Productivity (${#TOOLS_SKILLS[@]} skills): ncm-player, mac-cleaner, markdown-proxy, index-update

${BOLD}Options:${NC}
  --dry-run   Preview what would be installed
  --list      List all available skills with categories
  --help      Show this help

${BOLD}Examples:${NC}
  $(basename "$0") all
  $(basename "$0") content design
  $(basename "$0") qiaomu-writer qiaomu-image-generator
  $(basename "$0") --dry-run research
EOF
}

list_skills() {
  echo -e "${BOLD}📝 Content Creation (${#CONTENT_SKILLS[@]})${NC}"
  for s in "${CONTENT_SKILLS[@]}"; do echo "   $s"; done
  echo
  echo -e "${BOLD}🔬 Research & Learning (${#RESEARCH_SKILLS[@]})${NC}"
  for s in "${RESEARCH_SKILLS[@]}"; do echo "   $s"; done
  echo
  echo -e "${BOLD}🎨 Design & Media (${#DESIGN_SKILLS[@]})${NC}"
  for s in "${DESIGN_SKILLS[@]}"; do echo "   $s"; done
  echo
  echo -e "${BOLD}🛠️  Productivity Tools (${#TOOLS_SKILLS[@]})${NC}"
  for s in "${TOOLS_SKILLS[@]}"; do echo "   $s"; done
  echo
  echo -e "${BOLD}Total: ${#ALL_SKILLS[@]} skills${NC}"
}

check_deps() {
  if ! command -v npx &>/dev/null; then
    echo -e "${RED}Error: npx not found. Install Node.js first.${NC}"
    exit 1
  fi
}

install_skill() {
  local skill="$1"
  local repo="${GITHUB_USER}/${skill}"

  # Check if already installed
  if [ -d "$HOME/.claude/skills/$skill" ]; then
    echo -e "  ${YELLOW}⏭${NC}  $skill (already installed)"
    SKIPPED+=("$skill")
    return 0
  fi

  if $DRY_RUN; then
    echo -e "  ${BLUE}🔍${NC} $skill → npx skills add $repo"
    return 0
  fi

  echo -ne "  ${BLUE}⏳${NC} $skill ..."
  if npx -y skills add "$repo" &>/dev/null; then
    echo -e "\r  ${GREEN}✅${NC} $skill"
    INSTALLED+=("$skill")
  else
    echo -e "\r  ${RED}❌${NC} $skill (not published yet or install failed)"
    FAILED+=("$skill")
  fi
}

install_skills() {
  local skills=("$@")
  echo -e "\n${BOLD}Installing ${#skills[@]} skills...${NC}\n"

  for skill in "${skills[@]}"; do
    install_skill "$skill"
  done

  # Summary
  echo
  echo -e "${BOLD}═══════════════════════════════════════${NC}"
  if [ ${#INSTALLED[@]} -gt 0 ]; then
    echo -e "${GREEN}✅ Installed: ${#INSTALLED[@]}${NC}"
  fi
  if [ ${#SKIPPED[@]} -gt 0 ]; then
    echo -e "${YELLOW}⏭  Skipped (already installed): ${#SKIPPED[@]}${NC}"
  fi
  if [ ${#FAILED[@]} -gt 0 ]; then
    echo -e "${RED}❌ Failed: ${#FAILED[@]}${NC}"
    echo -e "${RED}   Not yet published: ${FAILED[*]}${NC}"
    echo -e "${YELLOW}   Tip: Publish them first with /skill-publisher${NC}"
  fi
  echo -e "${BOLD}═══════════════════════════════════════${NC}"
}

resolve_skills() {
  local args=("$@")
  local result=()

  for arg in "${args[@]}"; do
    case "$arg" in
      all)       result+=("${ALL_SKILLS[@]}") ;;
      content)   result+=("${CONTENT_SKILLS[@]}") ;;
      research)  result+=("${RESEARCH_SKILLS[@]}") ;;
      design)    result+=("${DESIGN_SKILLS[@]}") ;;
      tools)     result+=("${TOOLS_SKILLS[@]}") ;;
      qiaomu-*)  result+=("$arg") ;;
      *)
        echo -e "${RED}Unknown argument: $arg${NC}"
        echo "Use --help for usage information"
        exit 1
        ;;
    esac
  done

  # Deduplicate
  printf '%s\n' "${result[@]}" | sort -u
}

# ── Main ──────────────────────────────────────────────────────────

if [ $# -eq 0 ]; then
  usage
  exit 0
fi

# Parse options
SKILL_ARGS=()
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --list)    list_skills; exit 0 ;;
    --help|-h) usage; exit 0 ;;
    *)         SKILL_ARGS+=("$arg") ;;
  esac
done

if [ ${#SKILL_ARGS[@]} -eq 0 ]; then
  usage
  exit 0
fi

check_deps

# Resolve categories to skill names
mapfile -t SKILLS_TO_INSTALL < <(resolve_skills "${SKILL_ARGS[@]}")

if $DRY_RUN; then
  echo -e "${YELLOW}[DRY RUN] Would install:${NC}"
fi

install_skills "${SKILLS_TO_INSTALL[@]}"
