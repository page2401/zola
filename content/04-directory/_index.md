+++
title = "04. 目录结构与路由取舍"
description = "测试 Zola 0.23.6 的 content/ 隔离、_index.md 分支章节约定、weight 排序与 @/ 编译期链接校验。"
weight = 4
sort_by = "weight"
+++

# 04. 目录结构与路由取舍（Zola `_index.md` Section 体系）

将母版 `docs/04-directory/` 派生至 **`Zola v0.23.6`** 时，展现了与 Hugo 同源但更简明的 **Section（`_index.md`）+ Page（`*.md`）** 目录哲学：

1. **物理边界清晰（`content/`）**：所有正文统一存放在 `content/` 下，与 `templates/`、`static/` 和根 `README.md` 彻底隔离。
2. **强制 `_index.md` 分支入口**：
   - 母版中的 `index.md` 在 Zola 中表示**叶子页面资源包（Page Bundle）**；要让 `04-directory/` 与 `nested/` 成为拥有下属子页面的章节目录（Section），**必须改名为 `_index.md`** 并声明 `sort_by = "weight"`！
   - 借助 Tera 模板中的 `get_section(path=...)` 递归遍历 `subsections` 与 `pages`，无需手写侧边栏配置文件，新建 `_index.md` 即可为 `nested/` 指定优雅的中文分组标题。
3. **`@/` 编译期内部链接校验**：Zola 使用 `@/04-directory/nested/01-order-and-url.md` 语法引用内部文档，一旦目标路径拼错或移动，`zola build` 会直接在构建期报错拦截死链（代价是在离线普通编辑器中无法直接点击跳转）。

## 嵌套子文档入口

- [进入子文档 A：排序前缀与 URL 纯净度权衡](@/04-directory/nested/01-order-and-url.md)
- [进入子文档 B：多级子目录与侧边栏同步机制](@/04-directory/nested/02-sidebar-sync.md)
