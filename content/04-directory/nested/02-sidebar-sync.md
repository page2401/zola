+++
title = "嵌套子页 B：多级子目录与侧边栏同步"
weight = 2
+++

# 嵌套子页 B：多级子目录与侧边栏同步机制

得益于 Zola 的 `_index.md` 分支元数据机制与 Tera 模板引擎的 `get_section()` 查询能力，`templates/base.html` 会自动递归渲染所有子章节及其子页面：既避免了手写全局侧边栏数组导致的“孤岛页”，又解决了纯文件名自动扫描无法定义中文分组标题的痛点。

- [返回上一篇：《嵌套子页 A：排序前缀与 URL 纯净度权衡》](@/04-directory/nested/01-order-and-url.md)
- [返回《04. 目录结构与路由取舍》](@/04-directory/_index.md)
