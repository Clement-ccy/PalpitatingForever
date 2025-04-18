# Neumorphism CSS 基础库开发计划

**目标:** 创建一个名为 `neumorphism-ui` 的 CSS 基础库，采用 Neumorphism 风格（米色基调，支持暗黑模式），使用“字由芳华体”字体，并规划如何将其逐步集成到现有 Vue 项目中，优先处理按钮、卡片和输入框。

**核心要求:**

1.  **风格:** Neumorphism (新拟物)
2.  **颜色:** 基础色调偏米色，**需要支持暗黑模式**。
3.  **内容层级:** 强调、普通、弱化 (3 级)
4.  **页面层级:** 背景层、面板层、内容层、覆盖层 (玻璃拟态) (4 层)
5.  **字体:** **更换为“字由芳华体” (位于 `src/assets/fonts/字由芳华体.ttf`)**
6.  **优先组件:** **按钮 (Button), 卡片 (Card), 输入框 (Input)**
7.  **集成方式:** **逐步替换**
8.  **先行:** 创建测试页面和 CSS 进行效果验证。

**计划步骤:**

1.  **基础定义 (Foundation):**
    *   **颜色体系:** 确定 Neumorphism 风格的米色基础背景色。定义**浅色模式和暗黑模式**下的阴影颜色、文本颜色（强调、普通、弱化三种）。
    *   **阴影和高光:** 定义 Neumorphism 核心的 `box-shadow` 样式，考虑两种模式下的效果。
    *   **圆角:** 设定统一的 `border-radius` 值。
    *   **字体:** 在 `_variables.css` 或 `_typography.css` 中**定义 `@font-face` 规则引入 "字由芳华体"**，并设置全局 `font-family`。
    *   **CSS 变量:** 将所有基础定义存储在 CSS 变量中，并为暗黑模式提供备用值（可通过 `prefers-color-scheme` 媒体查询或切换 body 类实现）。

2.  **CSS 库结构设计:**
    *   在 `src/` 下创建新目录 `neumorphism-ui/`。
    *   在 `neumorphism-ui/` 内创建模块化 CSS 文件：
        *   `_variables.css`: 存储所有 CSS 变量。
        *   `_base.css`: 基础重置、`body` 样式（包含模式切换逻辑）、全局背景。
        *   `_typography.css`: 文本元素样式（使用新字体），体现内容层级。
        *   `_layout.css`: 页面层级结构类。
        *   `_panel.css`: 面板层样式。
        *   `_components/`: (拆分更细)
            *   `_buttons.css`: **优先开发**
            *   `_cards.css`: **优先开发**
            *   `_forms.css`: (包含输入框) **优先开发**
            *   ... (其他组件)
        *   `_glassmorphism.css`: 覆盖层玻璃拟态样式。
        *   `neumorphism.css`: 主入口文件，使用 `@import` 引入以上所有模块。

3.  **页面和内容层级实现:**
    *   **页面层级:**
        *   **背景层:** 在 `_base.css` 中设置 `body` 或根元素的背景色。
        *   **面板层:** 在 `_panel.css` 中创建如 `.neum-panel` 类，应用凸起的 Neumorphism 效果。
        *   **内容层:** 在 `_typography.css` 和 `_components/` 中定义元素样式。
        *   **覆盖层:** 在 `_glassmorphism.css` 中创建如 `.glass-overlay` 类，实现玻璃拟态。
    *   **内容层级:**
        *   在 `_variables.css` 中定义不同层级的文本颜色变量。
        *   在 `_typography.css` 中应用这些变量或创建工具类。

4.  **创建测试环境:**
    *   在 `src/` 下创建 `test-neumorphism/` 目录。
    *   创建 `test-neumorphism/index.html` 文件。
    *   创建 `test-neumorphism/test.css` 文件，用于 `@import '../neumorphism-ui/neumorphism.css';`。
    *   在 `index.html` 中引入 `test.css`。
    *   在 `index.html` 中**优先添加按钮、卡片、输入框**进行测试。

5.  **核心样式开发与迭代:**
    *   **优先完成 `_buttons.css`, `_cards.css`, `_forms.css` (输入框部分)** 的 Neumorphism 样式开发，**同时实现亮色和暗色模式**。
    *   在测试页面预览和调整。

6.  **项目集成策略:**
    *   **逐步替换:**
        *   首先在项目中引入 `neumorphism.css`。
        *   然后修改使用到按钮、卡片、输入框的 Vue 组件，移除旧样式，应用新类。
        *   验证无误后，再逐步开发和替换其他组件的样式。
        *   最后移除或清理旧的 CSS 文件 (`base.css`, `main.css`, `articlePage.css`)。

**可视化计划 (Mermaid Diagram):**

```mermaid
graph TD
    A[开始] --> B(1. 定义基础: 米色调, 支持暗黑模式, 字由芳华体, CSS变量);
    B --> C(2. 设计 CSS 库结构: neumorphism-ui/);
    C -- 包含 --> C1[_variables.css (含暗黑模式)];
    C -- 包含 --> C2[_base.css (含模式切换)];
    C -- 包含 --> C3[_typography.css (新字体)];
    C -- 包含 --> C4[_layout.css];
    C -- 包含 --> C5[_panel.css];
    C -- 包含 --> C6[_components/];
    C6 -- 优先 --> C6a[_buttons.css];
    C6 -- 优先 --> C6b[_cards.css];
    C6 -- 优先 --> C6c[_forms.css (含输入框)];
    C -- 包含 --> C7[_glassmorphism.css];
    C -- 包含 --> C8[neumorphism.css (主入口)];
    C --> D(3. 实现页面/内容层级);
    C --> E(4. 创建测试环境: test-neumorphism/);
    E -- 优先测试 --> E1[按钮, 卡片, 输入框];
    E --> F(5. 开发核心样式 & 迭代);
    F -- 优先开发 --> F1[按钮, 卡片, 输入框 (含暗黑模式)];
    F -- 反馈 --> E;
    F --> G(6. 制定项目集成策略);
    G -- 策略 --> G1[引入新库 neumorphism.css];
    G -- 策略 --> G2[逐步替换: 先按钮/卡片/输入框];
    G -- 策略 --> G3[适配 Vue 组件];
    G -- 策略 --> G4[最终清理旧 CSS];
    G --> H[完成];

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style H fill:#ccf,stroke:#333,stroke-width:2px
    style C6a fill:#ffc
    style C6b fill:#ffc
    style C6c fill:#ffc
    style F1 fill:#ffc