1.  **风格:** Neumorphism (新拟物)
2.  **颜色:** 基础色调偏米色，**需要支持暗黑模式**。
3.  **内容层级:** 强调、普通、弱化 (3 级)
4.  **页面层级:** 背景层、面板层、内容层、覆盖层 (玻璃拟态) (4 层)
5.  **字体:** **更换为“字由芳华体” (位于 `src/assets/fonts/字由芳华体.ttf`)**
6.  **集成方式:** **由控制器控制 Theme 主题**


1.  **CSS 库结构设计:**
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

2.  **页面和内容层级实现:**
    *   **页面层级:**
        *   **背景层:** 在 `_base.css` 中设置 `body` 或根元素的背景色。
        *   **面板层:** 在 `_panel.css` 中创建如 `.neum-panel` 类，应用凸起的 Neumorphism 效果。
        *   **内容层:** 在 `_typography.css` 和 `_components/` 中定义元素样式。
        *   **覆盖层:** 在 `_glassmorphism.css` 中创建如 `.glass-overlay` 类，实现玻璃拟态。
    *   **内容层级:**
        *   在 `_variables.css` 中定义不同层级的文本颜色变量。
        *   在 `_typography.css` 中应用这些变量或创建工具类。