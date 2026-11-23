# Zola 0.23 基准实测子站 (`page2401/zola`)

本仓库为 [page.2401.xyz](https://page.2401.xyz/) 静态网站生成器多版本基准对比平台的 **Rust 单体二进制 `Zola v0.23.6`** 独立派生子模块。

- **线上实测地址**：<https://page.2401.xyz/zola/>
- **核心引擎**：`zola 0.23.6`（内置 `Tera` 模板引擎与 `pulldown-cmark`）
- **本地零 CDN 扩展**：`static/vendor/` 锁定 `katex@0.19.1`（含 Webfont）与 `mermaid@12.3.0`
- **构建命令**：`zola build --base-url /zola`（产物输出至 `public/`，推送到孤儿分支 `page`）
