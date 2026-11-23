+++
title = "01. 专属标注与元数据"
description = "测试 Zola 0.23.6 的 +++ TOML Frontmatter、Tera v2 Component 提示块与 github_alerts = true 原生警报。"
weight = 1

[extra]
badge = "zola@0.23.6"
+++

# 01. 专属标注与元数据（Zola 0.23 实测）

不同静态网站生成器对“提示框 / 标注（Callouts / Admonitions）”和页面元数据的语法约定存在显著分歧。本文件由原始 GFM 母版派生至 **`Zola v0.23.6`**，集中展示 TOML 元数据、**Zola 0.23 全新 Tera v2 组件语法**与 GFM Alerts 的分工边界。

## 1. Frontmatter 元数据机制（`+++` TOML 与 `[extra]` 命名空间）

虽然 Zola 也兼容 `---` YAML，但 Zola 官方与 Rust 生态的标准惯例是使用 **`+++ ... +++` TOML Frontmatter**，并对顶层保留字段执行严格校验：

- **内置顶层字段**：`title`、`description`、`weight`（控制章节排序权重）、`sort_by` 等由 Zola 内核直接解析；
- **自定义字段隔离**：任何非内置的业务字段（如 `badge`）**必须放入 `[extra]` 表下**（模板中通过 `page.extra.badge` 读取），否则 `zola build` 会在编译期直接报错退出！

## 2. 标准提示语义块（Zola 0.23 重大变更：Tera v2 `<callout>` 组件）

在 `Zola <=0.22` 中，开发者使用旧版 Shortcode `{% raw %}{% callout(type="tip") %} ... {% end %}{% endraw %}`；而 **`Zola 0.23` 升级内置 Tera v2 后彻底移除了旧版 Shortcode 机制**，统一改用卫生组件定义 `{% raw %}{% component callout(...) %}{% endraw %}`，并在 Markdown 正文中通过类 XML 组件标签 `{% raw %}{% <callout type="..." title="..."> %} ... {% </callout> %}{% endraw %}` 调用：

{% <callout type="note" title="NOTE · 双分支隔离约定"> %}
默认信息提示块：静态站点对比平台的每个子模块均独立维护 `main`（源码）与 `page`（构建产物）双分支，互不污染提交历史。
{% </callout> %}

{% <callout type="tip" title="性能优化建议（Tera v2 Component 自定义标题）"> %}
在 Zola 0.23 中，块级组件通过 `{% raw %}{% <callout type="tip" title="..."> %}{% endraw %}` 传参，内部 `body | markdown | safe` 在单次 Rust 编译管线内极速展开。
{% </callout> %}

{% <callout type="warning" title="Zola 0.23 跨代迁移破坏性边界"> %}
升级至 `zola@0.23` 后，全文 Markdown 默认直接经过 Tera v2 模板求值：旧版 `{% raw %}{% callout(...) %}{% endraw %}` 会立即触发 `Unknown tag` 编译错误，展示字面量模板标签时则必须包裹 `{{ "{% raw %}...{% endraw %}" }}`！
{% </callout> %}

{% <callout type="caution" title="不可逆分支覆盖警告"> %}
自动化流水线在向 `page` 分支推送构建产物时会启用 `force_orphan: true`，切勿在 `page` 分支直接手工修改代码！
{% </callout> %}

## 3. 可折叠详情容器（标准 HTML `<details>`）

Zola 默认允许在 Markdown 中混写标准 HTML `<details>` 与 `<summary>` 标签（`<summary>` 后保留空行即可在内部正常解析代码块与公式）：

<details>
<summary>点击展开查看 Zola 0.23 Tera v2 组件源码结构</summary>

```markdown
{% raw %}{% <callout type="tip" title="性能优化建议"> %}
Zola 0.23 使用 Tera v2 Component 替代了旧版 Shortcode。
{% </callout> %}{% endraw %}
```

除了代码块，折叠容器内同样支持列表、表格与数学公式 $f(x) = x^2 + 1$。

</details>

## 4. GitHub 风格引用警报（GFM Alerts）跨框架直通测试

Zola 提供 `[markdown] github_alerts = true` 配置开关（默认关闭）。在 `config.toml` 显式开启后，下方与母版**一字不改**的三段标准 GFM 警报即可原生编译为 `<blockquote class="markdown-alert-*">`：

> [!NOTE]
> 这是一段标准的 GitHub Flavored Markdown `[!NOTE]` 警报文本，用于检验各生成器对母版语法的零改造直通能力。

> [!IMPORTANT]
> 跨平台迁移 Markdown 文档时，是否原生兼容 `> [!IMPORTANT]` 与 `> [!WARNING]` 直接决定了母版文档的派生改造成本。

> [!CAUTION]
> 若目标生成器未内置 GFM Alert 解析器（如 VuePress v1、Starlight 默认配置、Docsify v4 旧插件），上方标记会退化为普通引用块并原样露出 `[!CAUTION]` 字符串。
