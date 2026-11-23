+++
title = "嵌套子页 A：排序前缀与 URL 纯净度"
weight = 1
+++

# 嵌套子页 A：排序前缀与 URL 纯净度权衡

在 Zola 的 `content/04-directory/nested/` 目录中，章节阅读顺序由父级 `_index.md` 的 `sort_by = "weight"` 与当前页的 `weight = 1` 严格控制。若保留母版文件名 `01-order-and-url.md`，Zola 默认生成的 Clean URL 为 `/zola/04-directory/nested/01-order-and-url/`；若追求无序号 URL，也可在不改文件名的前提下直接在 `+++` 头中声明 `slug = "order-and-url"`！

- [返回《04. 目录结构与路由取舍》](@/04-directory/_index.md)
- [下一篇：《嵌套子页 B：多级子目录与侧边栏同步机制》](@/04-directory/nested/02-sidebar-sync.md)
