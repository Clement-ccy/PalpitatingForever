# PalpitatingForever's Station

This is a Vue 3 project bootstrapped with Vite, featuring a dynamic Neumorphism UI theme.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

---

## Project Features

### Dynamic Neumorphism UI Theme

This project implements a Neumorphism UI theme located in `src/neumorphism-ui/`. The theme is highly customizable in real-time via the `ThemeController` component.

**Theme Structure (`src/neumorphism-ui/`):**

*   `neumorphism.css`: Main import file.
*   `_variables.css`: Defines core CSS variables (though many are now dynamically controlled).
*   `_base.css`: Basic element styling.
*   `_layout.css`: Layout helpers.
*   `_panel.css`: Panel styles.
*   `_typography.css`: Text styles.
*   `_components/`: Styles for specific components (buttons, cards, forms).
*   `_glassmorphism.css`: (Optional) Glassmorphism effect styles.

### Theme Controller (`src/components/ThemeController.vue`)

A floating panel (usually bottom-right) allows for live modification of the Neumorphism theme parameters:

*   **Base Color:** Select the primary background color using a color picker or HEX input.
*   **Angle:** Adjust the light source angle (0-360°) affecting shadow direction.
*   **Size:** Controls the base size, influencing distance and blur calculations.
*   **Radius:** Sets the border-radius for elements (max value linked to Size).
*   **Distance:** Determines the shadow offset distance (linked to Size).
*   **Blur:** Controls the shadow blur amount (linked to Size and Distance).
*   **Color Difference:** Adjusts the luminance difference between the base color and the light/dark shadows.
*   **Shape:** Choose the Neumorphism style (flat, concave, convex, pressed).
*   **Gradient:** Toggle background gradients for non-flat shapes.

**Dynamic Calculations:**

The `ThemeController` uses JavaScript (`watchEffect` in Vue) to:

1.  Calculate shadow positions (`--positionX`, `--positionY`, etc.) based on the selected `Angle` and `Distance` using trigonometry.
2.  Calculate shadow colors (`--lightColor`, `--darkColor`), gradient colors (`--firstGradientColor`, `--secondGradientColor`), and text colors (`--textEmphasis`, `--textNormal`, etc.) based on the `Base Color`, `Color Difference`, `Shape`, and `Gradient` settings. Color calculations utilize utility functions (`colorLuminance`, `getContrast`) found in `src/utils/colorUtils.js` to ensure proper contrast and appearance.
3.  Update all relevant CSS variables on the `:root` element, applying theme changes instantly across the application.

This dynamic approach allows for extensive theme customization without needing to manually edit CSS files.
