---
name: qiaomu-skills
description: Qiaomu Skills Collection - A curated suite of 19 AI-powered skills for content creation, research, design, and productivity. Use when user asks "qiaomu skills 有哪些", "安装乔木技能包", "show me qiaomu skills", or wants to explore available qiaomu tools. Provides categorized index and batch installation scripts.
---

# Qiaomu Skills Collection

A comprehensive suite of 19 AI-powered skills designed for content creators, researchers, and productivity enthusiasts.

## Quick Start

**View all skills:**
```
Tell me about qiaomu skills
```

**Install specific category:**
```bash
# Content creation suite (5 skills)
~/.claude/skills/qiaomu-skills/scripts/install.sh content

# Research & learning suite (4 skills)
~/.claude/skills/qiaomu-skills/scripts/install.sh research

# Design & media suite (6 skills)
~/.claude/skills/qiaomu-skills/scripts/install.sh design

# Productivity tools (4 skills)
~/.claude/skills/qiaomu-skills/scripts/install.sh tools
```

**Install all:**
```bash
~/.claude/skills/qiaomu-skills/scripts/install.sh all
```

**Install specific skills:**
```bash
~/.claude/skills/qiaomu-skills/scripts/install.sh qiaomu-writer qiaomu-image-generator
```

## Skills Catalog

### 📝 Content Creation (5 skills)

| Skill | Description | Triggers |
|-------|-------------|----------|
| **qiaomu-writer** | Full-stack article creation with web search, Qiaomu style, and AI images. Self-improving from your edits. | "联网搜索...写一篇文章", "用乔木风格写", "写文章并配图" |
| **qiaomu-content-interpreter** | Transform any content into Qiaomu's conversational style with TWO-PASS refinement. | "用乔木风格改写", "转换成对话式" |
| **qiaomu-article-team** | 10-person AI team for high-quality article creation from links/content. | "创建文章团队", "10人团队写文章" |
| **qiaomu-x-article-publisher** | Publish Markdown articles to X (Twitter) Articles with cover images. | "publish to X", "发布到 Twitter" |
| **qiaomu-word-card** | Generate vintage paper-textured word cards / quote posters. | "生成词语卡片", "制作短句卡片" |

### 🔬 Research & Learning (4 skills)

| Skill | Description | Triggers |
|-------|-------------|----------|
| **qiaomu-ai-radar** | Daily topic assistant - monitors Import AI, Hacker News, Wait But Why, Product Hunt for content ideas. | "检查今天的更新", "抓取最新文章", "推荐选题" |
| **qiaomu-paper-interpreter** | Transform academic papers into conversational Chinese articles. | "解读论文", "理解paper", "乔木风格解读" |
| **qiaomu-libgen-downloader** | Search and download ebooks from LibGen.li. | "从libgen下载", "libgen搜索电子书" |
| **qiaomu-epub-book-generator** | Generate EPUB ebooks from Markdown with image embedding and WeChat Reading compatibility. | "生成epub", "制作电子书" |

### 🎨 Design & Media (6 skills)

| Skill | Description | Triggers |
|-------|-------------|----------|
| **qiaomu-image-generator** | AI image generation for articles, covers, social media (Seedream API). | "配图", "生成封面", "小红书配图", "公众号封面" |
| **qiaomu-mondo-poster-design** | Master-level poster/cover design based on 37 legendary designers' styles. | "生成海报", "书籍封面", "专辑封面" |
| **qiaomu-info-card-designer** | Transform text/URL into magazine-quality HTML info cards with auto-screenshot. | "生成信息卡片", "制作HTML卡片" |
| **qiaomu-video-composer** | Audio-driven professional video composer with ListenHub subtitle timing and Manim animations. | "创建知识视频", "音频生成视频" |
| **qiaomu-design-advisor** | Obsessive design consultant - Jobs-style product intuition + Rams-style functional purism. | "设计咨询", "重新设计", "设计评审" |
| **qiaomu-music-player-spotify** | Spotify music control + 5947 style database. | "播放音乐", "搜索歌曲", "Spotify控制" |

### 🛠️ Productivity Tools (4 skills)

| Skill | Description | Triggers |
|-------|-------------|----------|
| **qiaomu-music-player-ncm** | NetEase Cloud Music control + 5947 style database. | "网易云播放", "搜索歌曲", "ncm控制" |
| **qiaomu-mac-cleaner** | Mac disk cleanup tool - diagnose usage, safely clean caches, free space. | "清理电脑", "Mac磁盘清理", "释放空间" |
| **qiaomu-markdown-proxy** | Fetch any URL as clean Markdown via proxy. | "抓取网页", "转换成Markdown" |
| **qiaomu-index-update** | Knowledge base index sync - scan directory structure, detect changes, update CLAUDE.md index. | "更新索引", "同步知识库目录" |

## Installation Script Features

- **Batch installation**: Install multiple skills with one command
- **Category-based**: Install by functional category (content/research/design/tools)
- **Dependency check**: Verifies `npx` and `gh` CLI availability
- **Progress tracking**: Shows installation status for each skill
- **Error handling**: Continues on failure, reports issues at the end
- **Dry-run mode**: Preview what will be installed without actually installing

## Usage Examples

**Explore skills:**
```
User: qiaomu skills 有哪些？
Claude: [Shows categorized catalog with descriptions]
```

**Install content creation suite:**
```
User: 安装内容创作相关的 qiaomu skills
Claude: [Runs install.sh content, installs 5 skills]
```

**Check what's installed:**
```
User: 我已经安装了哪些 qiaomu skills？
Claude: [Lists installed qiaomu-* skills from ~/.claude/skills/]
```

**Install specific skills:**
```
User: 只安装 qiaomu-writer 和 qiaomu-image-generator
Claude: [Runs install.sh with specific skill names]
```

## Maintenance

**Update all installed skills:**
```bash
~/.claude/skills/qiaomu-skills/scripts/update.sh
```

**Check for new skills:**
```bash
~/.claude/skills/qiaomu-skills/scripts/check-updates.sh
```

## Contributing

All qiaomu skills are open source and published on GitHub under [@joeseesun](https://github.com/joeseesun).

To suggest improvements or report issues:
1. Visit the specific skill's GitHub repository
2. Open an issue or pull request
3. Or contact via X: [@vista8](https://x.com/vista8)

## Philosophy

**Self-Improving**: Many skills (like qiaomu-writer) learn from your edits and get better over time.

**One-Step Execution**: User says what they want → Skill delivers complete result.

**Failure Resilience**: Graceful degradation when dependencies fail (e.g., image generation failures don't block article delivery).

**Zero User Intervention**: Complete workflows automatically unless explicitly interrupted.

## License

All qiaomu skills are released under MIT License.
