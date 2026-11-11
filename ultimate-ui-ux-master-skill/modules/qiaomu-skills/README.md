# Qiaomu Skills Collection

> A curated suite of 19 AI-powered skills for content creation, research, design, and productivity
> 19 个 AI 驱动的技能集合，涵盖内容创作、研究学习、设计媒体和生产力工具

**[English](#english) | [中文](#中文)**

---

<a name="english"></a>
## English

### What This Is

A comprehensive collection of Claude Code skills designed for:
- **Content creators** who want AI-assisted writing with distinctive style
- **Researchers** who need to process papers, books, and web content
- **Designers** who want AI-powered image/video generation
- **Productivity enthusiasts** who want to automate repetitive tasks

All skills follow the **self-improving** philosophy: they learn from your edits and get better over time.

### Prerequisites

- [ ] **Claude Code CLI** installed and authenticated
  ```bash
  # Install Claude Code
  npm install -g @anthropic-ai/claude-code

  # Verify installation
  claude --version
  ```
- [ ] **Node.js** (v18+) for `npx` command
  ```bash
  node --version  # Should be v18 or higher
  ```
- [ ] **Git** for cloning repositories
  ```bash
  git --version
  ```

### Installation

**Option 1: Install all skills (recommended for first-time users)**
```bash
npx skills add joeseesun/qiaomu-skills
cd ~/.claude/skills/qiaomu-skills
./scripts/install.sh all
```

**Option 2: Install by category**
```bash
npx skills add joeseesun/qiaomu-skills
cd ~/.claude/skills/qiaomu-skills

# Content creation suite (5 skills)
./scripts/install.sh content

# Research & learning suite (4 skills)
./scripts/install.sh research

# Design & media suite (6 skills)
./scripts/install.sh design

# Productivity tools (4 skills)
./scripts/install.sh tools
```

**Option 3: Install specific skills**
```bash
npx skills add joeseesun/qiaomu-skills
cd ~/.claude/skills/qiaomu-skills
./scripts/install.sh qiaomu-writer qiaomu-image-generator
```

**Preview before installing (dry-run)**
```bash
./scripts/install.sh --dry-run all
```

### Skills Catalog

#### 📝 Content Creation (5 skills)

| Skill | What It Does | When To Use |
|-------|--------------|-------------|
| [qiaomu-writer](https://github.com/joeseesun/qiaomu-writer) | Full-stack article creation with web search, Qiaomu style, and AI images | "联网搜索...写一篇文章", "用乔木风格写" |
| [qiaomu-content-interpreter](https://github.com/joeseesun/qiaomu-content-interpreter) | Transform any content into conversational style | "用乔木风格改写", "转换成对话式" |
| [qiaomu-article-team](https://github.com/joeseesun/qiaomu-article-team) | 10-person AI team for article creation | "创建文章团队", "10人团队写文章" |
| [qiaomu-x-article-publisher](https://github.com/joeseesun/qiaomu-x-article-publisher) | Publish Markdown to X (Twitter) Articles | "publish to X", "发布到 Twitter" |
| [qiaomu-word-card](https://github.com/joeseesun/qiaomu-word-card) | Generate vintage word cards / quote posters | "生成词语卡片", "制作短句卡片" |

#### 🔬 Research & Learning (4 skills)

| Skill | What It Does | When To Use |
|-------|--------------|-------------|
| [qiaomu-ai-radar](https://github.com/joeseesun/qiaomu-ai-radar) | Daily topic assistant - monitors top content sources | "检查今天的更新", "推荐选题" |
| [qiaomu-paper-interpreter](https://github.com/joeseesun/qiaomu-paper-interpreter) | Transform academic papers into conversational articles | "解读论文", "理解paper" |
| [qiaomu-libgen-downloader](https://github.com/joeseesun/qiaomu-libgen-downloader) | Search and download ebooks from LibGen | "从libgen下载", "libgen搜索" |
| [qiaomu-epub-book-generator](https://github.com/joeseesun/qiaomu-epub-book-generator) | Generate EPUB ebooks from Markdown | "生成epub", "制作电子书" |

#### 🎨 Design & Media (6 skills)

| Skill | What It Does | When To Use |
|-------|--------------|-------------|
| [qiaomu-image-generator](https://github.com/joeseesun/qiaomu-image-generator) | AI image generation for articles and covers | "配图", "生成封面", "小红书配图" |
| [qiaomu-mondo-poster-design](https://github.com/joeseesun/qiaomu-mondo-poster-design) | Master-level poster design (37 designer styles) | "生成海报", "书籍封面" |
| [qiaomu-info-card-designer](https://github.com/joeseesun/qiaomu-info-card-designer) | Magazine-quality HTML info cards | "生成信息卡片", "制作HTML卡片" |
| [qiaomu-video-composer](https://github.com/joeseesun/qiaomu-video-composer) | Audio-driven professional video composer | "创建知识视频", "音频生成视频" |
| [qiaomu-design-advisor](https://github.com/joeseesun/qiaomu-design-advisor) | Obsessive design consultant (Jobs + Rams style) | "设计咨询", "重新设计" |
| [qiaomu-music-player-spotify](https://github.com/joeseesun/qiaomu-music-player-spotify) | Spotify control + 5947 style database | "播放音乐", "搜索歌曲" |

#### 🛠️ Productivity Tools (4 skills)

| Skill | What It Does | When To Use |
|-------|--------------|-------------|
| [qiaomu-music-player-ncm](https://github.com/joeseesun/qiaomu-music-player-ncm) | NetEase Cloud Music control + 5947 style | "网易云播放", "搜索歌曲" |
| [qiaomu-mac-cleaner](https://github.com/joeseesun/qiaomu-mac-cleaner) | Mac disk cleanup tool | "清理电脑", "Mac磁盘清理" |
| [qiaomu-markdown-proxy](https://github.com/joeseesun/qiaomu-markdown-proxy) | Fetch URLs as clean Markdown | "抓取网页", "转换成Markdown" |
| [qiaomu-index-update](https://github.com/joeseesun/qiaomu-index-update) | Knowledge base index sync | "更新索引", "同步知识库目录" |

### Usage Examples

**Explore available skills:**
```
User: qiaomu skills 有哪些？
Claude: [Shows categorized catalog]
```

**Install content creation suite:**
```
User: 安装内容创作相关的 qiaomu skills
Claude: [Runs install.sh content]
```

**Check installed skills:**
```
User: 我已经安装了哪些 qiaomu skills？
Claude: [Lists installed qiaomu-* skills]
```

### Troubleshooting

| Problem | Solution |
|---------|----------|
| "npx: command not found" | Install Node.js: `brew install node` (macOS) or download from nodejs.org |
| "Permission denied" when running install.sh | Add execute permission: `chmod +x scripts/install.sh` |
| Some skills fail to install | They may not be published yet. Check individual skill repositories. |
| "Claude Code not found" | Install Claude Code CLI: `npm install -g @anthropic-ai/claude-code` |

### Philosophy

**Self-Improving**: Skills learn from your edits and get better over time.

**One-Step Execution**: User says what they want → Skill delivers complete result.

**Failure Resilience**: Graceful degradation when dependencies fail.

**Zero User Intervention**: Complete workflows automatically unless explicitly interrupted.

### Credits

All skills created by [@vista8](https://x.com/vista8) and published under MIT License.

Special thanks to:
- **Claude Code** team for the skills framework
- **Anthropic** for Claude AI
- Open source community for inspiration

---

<a name="中文"></a>
## 中文

### 这是什么

一个精心策划的 Claude Code 技能集合，专为以下用户设计：
- **内容创作者**：需要 AI 辅助写作，保持独特风格
- **研究学习者**：需要处理论文、书籍和网页内容
- **设计师**：需要 AI 驱动的图片/视频生成
- **效率爱好者**：需要自动化重复性任务

所有技能遵循**自我进化**哲学：从你的修改中学习，持续改进。

### 前置条件

- [ ] **Claude Code CLI** 已安装并登录
  ```bash
  # 安装 Claude Code
  npm install -g @anthropic-ai/claude-code

  # 验证安装
  claude --version
  ```
- [ ] **Node.js** (v18+) 用于 `npx` 命令
  ```bash
  node --version  # 应该是 v18 或更高
  ```
- [ ] **Git** 用于克隆仓库
  ```bash
  git --version
  ```

### 安装

**方案 1：安装全部技能（首次使用推荐）**
```bash
npx skills add joeseesun/qiaomu-skills
cd ~/.claude/skills/qiaomu-skills
./scripts/install.sh all
```

**方案 2：按分类安装**
```bash
npx skills add joeseesun/qiaomu-skills
cd ~/.claude/skills/qiaomu-skills

# 内容创作套件（5 个技能）
./scripts/install.sh content

# 研究学习套件（4 个技能）
./scripts/install.sh research

# 设计媒体套件（6 个技能）
./scripts/install.sh design

# 生产力工具（4 个技能）
./scripts/install.sh tools
```

**方案 3：安装指定技能**
```bash
npx skills add joeseesun/qiaomu-skills
cd ~/.claude/skills/qiaomu-skills
./scripts/install.sh qiaomu-writer qiaomu-image-generator
```

**预览安装（dry-run）**
```bash
./scripts/install.sh --dry-run all
```

### 技能目录

#### 📝 内容创作（5 个技能）

| 技能 | 功能 | 触发词 |
|------|------|--------|
| [qiaomu-writer](https://github.com/joeseesun/qiaomu-writer) | 全栈文章创作：联网搜索 + 乔木风格 + AI 配图 | "联网搜索...写一篇文章", "用乔木风格写" |
| [qiaomu-content-interpreter](https://github.com/joeseesun/qiaomu-content-interpreter) | 将任意内容转换为对话式风格 | "用乔木风格改写", "转换成对话式" |
| [qiaomu-article-team](https://github.com/joeseesun/qiaomu-article-team) | 10 人 AI 团队创作文章 | "创建文章团队", "10人团队写文章" |
| [qiaomu-x-article-publisher](https://github.com/joeseesun/qiaomu-x-article-publisher) | 发布 Markdown 到 X (Twitter) Articles | "publish to X", "发布到 Twitter" |
| [qiaomu-word-card](https://github.com/joeseesun/qiaomu-word-card) | 生成复古纸张质感的词语卡片 | "生成词语卡片", "制作短句卡片" |

#### 🔬 研究学习（4 个技能）

| 技能 | 功能 | 触发词 |
|------|------|--------|
| [qiaomu-ai-radar](https://github.com/joeseesun/qiaomu-ai-radar) | 每日选题助手 - 监控顶级内容源 | "检查今天的更新", "推荐选题" |
| [qiaomu-paper-interpreter](https://github.com/joeseesun/qiaomu-paper-interpreter) | 将学术论文转换为对话式文章 | "解读论文", "理解paper" |
| [qiaomu-libgen-downloader](https://github.com/joeseesun/qiaomu-libgen-downloader) | 从 LibGen 搜索和下载电子书 | "从libgen下载", "libgen搜索" |
| [qiaomu-epub-book-generator](https://github.com/joeseesun/qiaomu-epub-book-generator) | 从 Markdown 生成 EPUB 电子书 | "生成epub", "制作电子书" |

#### 🎨 设计媒体（6 个技能）

| 技能 | 功能 | 触发词 |
|------|------|--------|
| [qiaomu-image-generator](https://github.com/joeseesun/qiaomu-image-generator) | AI 图片生成（文章配图、封面） | "配图", "生成封面", "小红书配图" |
| [qiaomu-mondo-poster-design](https://github.com/joeseesun/qiaomu-mondo-poster-design) | 大师级海报设计（37 位设计师风格） | "生成海报", "书籍封面" |
| [qiaomu-info-card-designer](https://github.com/joeseesun/qiaomu-info-card-designer) | 杂志质感 HTML 信息卡片 | "生成信息卡片", "制作HTML卡片" |
| [qiaomu-video-composer](https://github.com/joeseesun/qiaomu-video-composer) | 音频驱动的专业视频合成 | "创建知识视频", "音频生成视频" |
| [qiaomu-design-advisor](https://github.com/joeseesun/qiaomu-design-advisor) | 偏执型设计顾问（Jobs + Rams 风格） | "设计咨询", "重新设计" |
| [qiaomu-music-player-spotify](https://github.com/joeseesun/qiaomu-music-player-spotify) | Spotify 控制 + 5947 风格数据库 | "播放音乐", "搜索歌曲" |

#### 🛠️ 生产力工具（4 个技能）

| 技能 | 功能 | 触发词 |
|------|------|--------|
| [qiaomu-music-player-ncm](https://github.com/joeseesun/qiaomu-music-player-ncm) | 网易云音乐控制 + 5947 风格 | "网易云播放", "搜索歌曲" |
| [qiaomu-mac-cleaner](https://github.com/joeseesun/qiaomu-mac-cleaner) | Mac 磁盘清理工具 | "清理电脑", "Mac磁盘清理" |
| [qiaomu-markdown-proxy](https://github.com/joeseesun/qiaomu-markdown-proxy) | 抓取 URL 转换为 Markdown | "抓取网页", "转换成Markdown" |
| [qiaomu-index-update](https://github.com/joeseesun/qiaomu-index-update) | 知识库索引同步 | "更新索引", "同步知识库目录" |

### 使用示例

**查看可用技能：**
```
用户：qiaomu skills 有哪些？
Claude：[显示分类目录]
```

**安装内容创作套件：**
```
用户：安装内容创作相关的 qiaomu skills
Claude：[运行 install.sh content]
```

**检查已安装的技能：**
```
用户：我已经安装了哪些 qiaomu skills？
Claude：[列出已安装的 qiaomu-* 技能]
```

### 常见问题

| 问题 | 解决方法 |
|------|----------|
| "npx: command not found" | 安装 Node.js：`brew install node` (macOS) 或从 nodejs.org 下载 |
| 运行 install.sh 时 "Permission denied" | 添加执行权限：`chmod +x scripts/install.sh` |
| 部分技能安装失败 | 可能尚未发布。检查各个技能的 GitHub 仓库。 |
| "Claude Code not found" | 安装 Claude Code CLI：`npm install -g @anthropic-ai/claude-code` |

### 设计哲学

**自我进化**：技能从你的修改中学习，持续改进。

**一步执行**：用户说出需求 → 技能交付完整结果。

**容错机制**：依赖失败时优雅降级。

**零干预**：自动完成整个工作流，除非用户明确打断。

### 致谢

所有技能由 [@vista8](https://x.com/vista8) 创建，采用 MIT 许可证发布。

特别感谢：
- **Claude Code** 团队提供的技能框架
- **Anthropic** 提供的 Claude AI
- 开源社区的灵感

---

## 📱 关注作者

如果这个项目对你有帮助，欢迎关注我获取更多技术分享：

- **X (Twitter)**: [@vista8](https://x.com/vista8)
- **微信公众号「向阳乔木推荐看」**

## License

MIT License - see individual skill repositories for details.
