+++
title = "05. 高阶代码块与语法高亮"
description = "标准 GFM 母版派生：实测 Zola 0.23.6 全新内置 Rust Giallo (TextMate 引擎) 的 linenos、hl_lines=3 7-9 信息串属性与 diff 着色。"
weight = 5

[extra]
badge = "giallo@0.5.2"
+++

# 05. 高阶代码块与语法高亮（Zola 0.23 + Rust Giallo 引擎）

技术文档中超过 40% 的篇幅由代码块构成，但标准 CommonMark / GitHub Flavored Markdown **仅定义了围栏语言标识（```` ```ts ````）**，并未定义文件名标题栏、指定行高亮、带语法着色的行级 Diff 以及多语言 Tab 代码组。本文件由原始 GFM 母版派生适配至 **`Zola v0.23.6`**，实测其全新内置的 **Rust `Giallo`（v0.5.2）** 语法高亮器。

## 1. 代码块文件名标题栏与基础语法高亮（从 `syntect` 到 `Giallo`）

自 `Zola 0.22+` 起，Zola 正式弃用了早期基于 Sublime Text 语法的 `syntect`，全面切换为由 Zola 作者亲自用 Rust 编写的 **Giallo**（兼容 VS Code / Shiki 同源的 TextMate 语法与双主题亮暗色切换）。在 `config.toml` 配置 `[markdown.highlighting]` 后，构建期以亚毫秒速度直接编译出零客户端 JS 的 `<pre class="giallo">` 节点：

**`scripts/resolve-route.ts`**

```ts
export interface RouteContext {
  basePath: string
  slug: string
  cleanUrls: boolean
}

export function formatDocRoute(ctx: RouteContext): string {
  const prefix = ctx.basePath.endsWith('/') ? ctx.basePath : `${ctx.basePath}/`
  const normalized = ctx.slug.replace(/^\/+|\/+$/g, '')
  if (!normalized || normalized === 'index') return prefix
  return ctx.cleanUrls ? `${prefix}${normalized}/` : `${prefix}${normalized}.html`
}
```

## 2. 关键行聚焦与行号渲染（`linenos` 与 `hl_lines=3 7-9`）

Zola 沿用了经典的逗号分隔围栏信息串协议（无需侵入修改源码内容）：

- **`linenos`**：为每一行生成 `<span aria-hidden="true" class="giallo-ln">` 不可选中行号前缀；
- **`hl_lines=3 7-9`**：以空格分隔单行与闭区间（1-based 索引），将第 `3` 行与第 `7–9` 行标记为高亮行：

```json,linenos,hl_lines=3 7-9
{
  "id": "ssg-benchmark",
  "routeStyle": "clean",
  "strictZeroCdn": true,
  "markdown": {
    "mathEngine": "katex",
    "diagramEngine": "mermaid",
    "lineHighlight": true,
    "codeTransformers": ["diff", "focus"]
  }
}
```

## 3. 代码增删对比着色（Giallo `diff` 语法高亮）

Giallo 内置标准 `diff` TextMate 语法定义，无需额外插件即可在构建期对 `-` 删除行与 `+` 新增行赋予双主题色彩（同样受限于标准 `diff` 围栏，内部不再嵌套解析 TypeScript 词法）：

```diff
 export function mountSubsite(baseDir: string, subPath: string): string | null {
-  const cleanRel = decodeURIComponent(subPath).replace(/\.\./g, '')
-  return `${baseDir}/${cleanRel}`
+  const resolvedBase = path.resolve(baseDir)
+  const target = path.resolve(resolvedBase, decodeURIComponent(subPath).replace(/^\/+/, ''))
+  return target.startsWith(`${resolvedBase}${path.sep}`) ? target : null
 }
```

## 4. 多语言运行时命令组（原生 `<details>` 零脚本手风琴）

Zola 坚持零前端框架绑定的纯粹静态哲学。借助标准 HTML `<details name="zola-cmd-group">` 互斥展开特性，无需引入任何运行时 Tab 脚本即可组织跨语言构建命令：

<details name="zola-cmd-group" open>
<summary>Rust 单体二进制（<code>config.toml</code> · 当前子站）</summary>

```bash
zola build --base-url /zola
```

</details>

<details name="zola-cmd-group">
<summary>Node.js（<code>package.json</code>）</summary>

```bash
npm ci && npm run build
```

</details>

<details name="zola-cmd-group">
<summary>Deno 2（<code>deno.json</code>）</summary>

```bash
deno task build
```

</details>

<details name="zola-cmd-group">
<summary>Python（<code>requirements.txt</code>）与 Ruby（<code>Gemfile</code>）</summary>

```bash
pip install -r requirements.txt && sphinx-build -b dirhtml . _build/dirhtml
bundle install && bundle exec jekyll build
```

</details>

## 5. 四大底层高亮引擎能力对照小结

| 高亮引擎代表 | 典型采用框架 | 构建期零运行时 JS | 原生行号 / 行高亮 | 保留词法着色的 Diff |
| :--- | :--- | :--- | :--- | :--- |
| **Shiki / Expressive Code** | VitePress、Starlight、Fumadocs、Nextra、Rspress、Nuxt、Quartz | ✅ 纯静态内联样式 | ✅ `{1,3-5}` / `[!code highlight]` | ✅ `// [!code ++]` |
| **Prism.js** | Docusaurus、VuePress、Eleventy (plugin)、Gatsby | ✅ 静态 Token 类名 | ✅ `{1,3-5}` / 魔法注释 | ⚠️ 需配 diff-highlight 插件 |
| **Pygments / Rouge** | MkDocs Material、Sphinx、Pelican、Jekyll | ✅ Python/Ruby 编译直出 | ✅ `hl_lines` / `emphasize-lines` | ⚠️ 仅标准 `diff` 块红绿 |
| **Chroma / Giallo / hljs** | Hugo (Go Chroma)、**Zola (Rust Giallo)**、mdBook (hljs) | ✅ (mdBook 为客户端 hljs) | ✅ **Zola 原生 `linenos,hl_lines=3 7-9`** | ⚠️ 仅标准 `diff` 块红绿 |
