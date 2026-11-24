+++
title = "00. 概览与版本档案 (Zola 0.23)"
description = "Rust 单体二进制静态网站生成器 Zola v0.23.6 (Tera v2) 派生适配版总览与锁定版本档案。"
sort_by = "weight"
+++

# Zola 0.23 基准实测子站（Rust + Tera v2 单体二进制引擎）

本子站（`page2401/zola`）由主仓库 `page2401.github.io/docs/` 的**标准 GitHub Flavored Markdown（GFM）母版**派生适配而来，用于实测 Rust 社区代表性通用静态网站生成器 **`Zola v0.23.6`**（升级内置 **Tera v2 组件引擎**、**Giallo 高亮器**与 `pulldown-cmark`）的毫秒级构建与跨代破坏性变更。

## 锁定版本与技术栈档案

| 模块 / 组件 | 锁定版本 | 角色与实测说明 |
| :--- | :--- | :--- |
| `zola` | `0.23.6` | Rust 单体二进制全功能 SSG（内置 Giallo 高亮、Sass 编译与编译期死链校验，全站构建仅约 20ms） |
| `tera` | `builtin` | **Zola 0.23 重大升级**：内置 Tera v2 彻底移除旧版 Shortcode，全面转向 `{% raw %}{% <component> %}{% endraw %}` 标签组件 |
| `katex` | `0.19.1` | 置于 `static/vendor/` 本地静态托管（含全套 Webfont，零外部 CDN 依赖） |
| `mermaid` | `12.3.0` | 识别 Zola 输出的 `<code data-lang="mermaid">` 节点并随深浅色 CSS 变量实时重绘 |

## 五大基准测试章节导航

| 章节路径 | 测试维度 | `Zola 0.23.6` 派生适配实录 |
| :--- | :--- | :--- |
| [`01-annotations.md`](@/01-annotations.md) | 专属标注与元数据 | **`+++` TOML Frontmatter** + `[extra]` 强约束；**0.23 破坏性变更**：旧版 `{% raw %}{% callout() %}{% endraw %}` 被移除，改用 Tera v2 组件 `{% raw %}{% <callout> %}{% endraw %}`，同时支持 `github_alerts = true` |
| [`02-diagrams.md`](@/02-diagrams.md) | 流程图与时序图 | 正文代码块零改动；Zola 输出 `data-lang="mermaid"` 属性而非 `class="language-mermaid"` |
| [`03-math.md`](@/03-math.md) | 数学公式排版 | 同属 `pulldown-cmark` 家族，公式换行 `\\`、细间距 `\,` 与字面量 `\$` 需双写反斜杠防止构建期被吞噬 |
| [`04-directory/`](@/04-directory/_index.md) | 目录结构与路由取舍 | 强制 `content/` 隔离 + 每个分支子目录须放置 `_index.md`（Branch Section）+ `@/` 编译期死链校验内部链接 |
| [`05-code-blocks.md`](@/05-code-blocks.md) | 高阶代码块与语法高亮 | `weight = 5`；启用 Zola 0.22+ 全新 Rust **Giallo** TextMate 引擎，实测 `linenos`、`hl_lines=3 7-9` 与 `diff` 着色 |
