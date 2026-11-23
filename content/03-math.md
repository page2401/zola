+++
title = "03. 数学公式排版"
description = "测试 Zola 0.23.6 (pulldown-cmark) 下的反斜杠转义边界与本地 KaTeX 0.19.1 公式排版。"
weight = 3
+++

# 03. 数学公式排版（Zola 0.23 + KaTeX 0.19）

`Zola v0.23.6` 底层同样采用 Rust `pulldown-cmark` 解析器，且尚未内置构建期数学公式 AST 保护。因此直接挂载客户端 **`katex@0.19.1`（`static/vendor/` 本地托管）** 时，`pulldown-cmark` 会先按 CommonMark 标点转义规则消费单反斜杠——这要求派生文档将公式换行 `\\`、微间距 `\,` / `\!` 及字面量美元转义 `\$` 双写为 `\\\\`、`\\,`、`\\!` 与 `\\$`，与母版对比时清晰暴露出无公式 AST 保护引擎的改造成本。

## 1. 行内公式与中英文混排基线对齐

考察重点：行内公式在中文字号下的缩放比例、上下标是否撑乱行高，以及分数与根号在行内的紧凑度。

- 质能方程 $E = mc^2$ 与欧拉恒等式 $e^{i\pi} + 1 = 0$ 嵌入在连续中文段落中的视觉基线表现。
- 归并排序的平均时间复杂度为 $\mathcal{O}(n \log n)$，而空间复杂度为 $\Theta(n)$；当输入规模满足 $n \ge 2^{16}$ 时，常数因子差异显著。
- 贝叶斯条件概率公式行内排印：$P(A \mid B) = \frac{P(B \mid A)\\,P(A)}{P(B)}$，以及带根号的欧氏距离 $d(\mathbf{x}, \mathbf{y}) = \sqrt{\sum_{i=1}^{n}(x_i - y_i)^2}$。

## 2. 多行等式对齐推导（`aligned` 环境）

测试 `\begin{aligned} ... \end{aligned}` 多行对齐、积分算子与括号自动缩放 `\left( ... \right)`：

$$
\begin{aligned}
I^2 &= \left( \int_{-\infty}^{+\infty} e^{-x^2}\\,\mathrm{d}x \right) \left( \int_{-\infty}^{+\infty} e^{-y^2}\\,\mathrm{d}y \right) \\\\
    &= \iint_{\mathbb{R}^2} e^{-(x^2 + y^2)}\\,\mathrm{d}x\\,\mathrm{d}y \\\\
    &= \int_{0}^{2\pi} \int_{0}^{+\infty} e^{-r^2} r\\,\mathrm{d}r\\,\mathrm{d}\theta \\\\
    &= 2\pi \cdot \left[ -\frac{1}{2} e^{-r^2} \right]_{0}^{+\infty} = \pi \implies I = \sqrt{\pi}
\end{aligned}
$$

## 3. 矩阵运算与注意力机制（`bmatrix` 环境）

测试缩放点积注意力公式及矩阵乘法排版：

$$
\mathrm{Attention}(Q, K, V) = \mathrm{softmax}\\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

$$
\mathbf{J}_{\mathbf{f}}(\mathbf{x}) =
\begin{bmatrix}
\dfrac{\partial f_1}{\partial x_1} & \dfrac{\partial f_1}{\partial x_2} & \cdots & \dfrac{\partial f_1}{\partial x_n} \\\\[6pt]
\dfrac{\partial f_2}{\partial x_1} & \dfrac{\partial f_2}{\partial x_2} & \cdots & \dfrac{\partial f_2}{\partial x_n} \\\\[4pt]
\vdots & \vdots & \ddots & \vdots \\\\[4pt]
\dfrac{\partial f_m}{\partial x_1} & \dfrac{\partial f_m}{\partial x_2} & \cdots & \dfrac{\partial f_m}{\partial x_n}
\end{bmatrix}
$$

## 4. 分段函数与优化目标（`cases` 环境）

测试 Huber Loss 分段函数与花括号对齐：

$$
\mathcal{L}_{\delta}(y, \hat{y}) =
\begin{cases}
\dfrac{1}{2}(y - \hat{y})^2, & \text{if } |y - \hat{y}| \le \delta, \\\\[8pt]
\delta \cdot \left(|y - \hat{y}| - \dfrac{1}{2}\delta\right), & \text{otherwise.}
\end{cases}
$$

## 5. 字面量美元符号 `\$` 转义边界测试

在启用 `$...$` 行内数学公式后，同一段落出现两个价格数字（例如基础套餐 \\$29/月 与专业版 \\$99/月）时，因 `pulldown-cmark` 先消费一层反斜杠，须写作 `\\$` 才能避免中间中文被误解析为公式；而在反引号代码片段中编写环境变量 `$HOME` 或 `awk '{print $1}'` 则原样保留，无需反斜杠转义。
