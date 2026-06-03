# CCMS TanStack Design System & Styling Guide

This document outlines the design philosophy, color tokens, typography, custom layouts, and styling components that make up the visual identity of the **Computer Course Management System (CCMS)**. 

The application utilizes a custom **"Oceanic Glassmorphism"** aesthetic built on top of **Tailwind CSS v4** and **shadcn/ui** primitives.

---

## 1. Design Philosophy

The visual system is designed to feel **organic, modern, and professional**. It moves away from sterile, flat UI designs by introducing:
*   **Ambient Glows:** Soft, layered radial gradients in the background that suggest depth and light sources.
*   **Tactile Glassmorphism:** Card containers (`.island-shell`) that blend semi-translucently with the background, featuring subtle borders and glossy inner glints.
*   **Serif & Sans-Serif Contrast:** Pairing a warm, academic editorial serif for headers with a clean, high-readability sans-serif for interface controls.
*   **Harmonious Earth-Sea Colors:** Deep greens, ocean teals, and soft sandy tones rather than generic primary colors.

---

## 2. Typography

We use Google Fonts imported directly via `styles.css`.

| Font Family | Usage | Characteristics | CSS Variable |
| :--- | :--- | :--- | :--- |
| **Fraunces** | Titles, Hero Headers, Section Headers (`.display-title`) | High-contrast editorial serif, warm, humanistic | Custom CSS |
| **Manrope** | UI Elements, Body Copy, Tables, Forms, Navigation | Clean, modern geometric sans-serif, high legibility | `--font-sans` |

### Font Configurations
*   **Body Copy:** `font-family: var(--font-sans)` with `-webkit-font-smoothing: antialiased`
*   **Titles:** Class `.display-title` maps to `'Fraunces', Georgia, serif`

---

## 3. Color Palette

The project uses a custom color palette defined with semantic CSS variables for automatic light/dark mode support.

### Theme Colors

| Variable | Light Mode | Dark Mode | Description |
| :--- | :--- | :--- | :--- |
| `--sea-ink` | `#173a40` | `#d7ece8` | Primary text and major header color. |
| `--sea-ink-soft` | `#416166` | `#afcdc8` | Secondary/muted body copy. |
| `--lagoon` | `#4fb8b2` | `#60d7cf` | Vibrant brand highlight / accent. |
| `--lagoon-deep` | `#328f97` | `#8de5db` | Interactive state color (links, focus). |
| `--palm` | `#2f6a4a` | `#6ec89a` | Organic brand secondary / success color. |
| `--sand` | `#e7f0e8` | `#0f1a1e` | Soft backdrop warm tint. |
| `--foam` | `#f3faf5` | `#101d22` | Soft backdrop light cream/green tint. |
| `--bg-base` | `#e7f3ec` | `#0a1418` | Standard background canvas color. |
| `--kicker` | `rgba(47,106,74,0.9)`| `#b8efe5` | Micro-headings & meta tags accent color. |

### Glass & Transparency Tokens

| Variable | Light Mode | Dark Mode | Description |
| :--- | :--- | :--- | :--- |
| `--surface` | `rgba(255,255,255,0.74)`| `rgba(16,30,34,0.8)` | Standard card/modal backdrop. |
| `--surface-strong` | `rgba(255,255,255,0.9)` | `rgba(15,27,31,0.92)`| Raised card/form body backdrop. |
| `--line` | `rgba(23,58,64,0.14)` | `rgba(141,229,219,0.18)`| Card, table, and divider borders. |
| `--inset-glint` | `rgba(255,255,255,0.82)`| `rgba(194,247,238,0.14)`| Top edge inner reflection highlight. |

---

## 4. Backgrounds & Ambient Lighting

The canvas background is engineered to be dynamic and layered, using pseudo-elements on the `body` tag:

1.  **Glow Layer (`body` background):** Three layered radial gradients overlaying a linear gradient:
    *   Top Left: Turquoise glow (`--hero-a`)
    *   Top Right: Soft forest green glow (`--hero-b`)
    *   Bottom Center: Subtle lagoon wash
2.  **Highlight Layer (`body::before`):** Adds randomized depth pools with soft opacity to emulate ambient lighting.
3.  **Grid Overlay (`body::after`):** A fine `28px x 28px` semi-transparent white grid layered with a radial mask so it gently fades out towards the screen edges.

---

## 5. Core Layout & UI Classes ("The Island System")

To maintain styling consistency across pages, use the following layout utilities instead of creating ad-hoc configurations:

### Container: `.page-wrap`
Centers content and applies responsive padding.
```css
.page-wrap {
  width: min(1080px, calc(100% - 2rem));
  margin-inline: auto;
}
```

### Glass Panel: `.island-shell`
The standard container for cards, dashboard panels, and data displays. Includes:
*   Subtle borders (`--line`)
*   Glossy top edge highlight (`--inset-glint` inside shadow)
*   Dynamic, soft drop shadow
*   Micro-blur backdrop filter (`blur(4px)`)
```css
.island-shell {
  border: 1px solid var(--line);
  background: linear-gradient(165deg, var(--surface-strong), var(--surface));
  box-shadow:
    0 1px 0 var(--inset-glint) inset,
    0 22px 44px rgba(30, 90, 72, 0.1),
    0 6px 18px rgba(23, 58, 64, 0.08);
  backdrop-filter: blur(4px);
}
```

### Specialized Card: `.feature-card`
Used for grid highlights (e.g., landing page features).
*   Inherits glass styling.
*   Triggers smooth scale and translation animations on hover.
*   Subtly brightens border color on hover.

### Meta Kicker: `.island-kicker`
For small, punchy subheaders above title texts.
*   Spaced out (`letter-spacing: 0.16em`), uppercase, and bold text.
*   Uses `--kicker` color.

### Nav Links: `.nav-link`
Interactive state for headers and sidebar links.
*   No standard underline.
*   Utilizes a sliding bottom underline transition (`transform: scaleX(0)` to `scaleX(1)`) anchored on hover or active states.

### Entrance Animation: `.rise-in`
Smooth slide-and-fade entrance transition for dashboard page loads or hero elements.
```css
.rise-in {
  animation: rise-in 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
```

---

## 6. Tailwind & UI Primitives Integration

We map Shadcn/Radix components to Tailwind CSS tokens in `@theme inline` inside `styles.css`.

### Base Shadcn Mapping
*   `--color-background` is bound to `var(--background)`
*   `--color-foreground` is bound to `var(--foreground)`
*   `--color-card` and `--color-card-foreground` map to `var(--card)` / `var(--card-foreground)`
*   `--color-primary` maps to the theme's `--primary` OKLCH variable
*   `--color-border` maps to `var(--border)`
*   `--radius-lg` is configured as `var(--radius)` (`0.625rem`)

### Best Practices for New Components
1.  **Prefer Theme Variables:** Do not hardcode specific hex colors (e.g., `text-[#173a40]`). Instead, use custom Tailwind utilities or standard color mappings (e.g., `text-[var(--sea-ink)]`).
2.  **Maintain Transitions:** Apply `transition-all duration-200` to buttons and hover states to align with the global transition defaults:
    ```css
    transition: background-color 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease;
    ```
3.  **Use Glass Elements:** Form pages, summaries, tables, and modal contents should reside inside an `.island-shell` container to maintain depth consistency.
4.  **Header Styling:** Always couple `.display-title` (Fraunces serif) with an `.island-kicker` (small sans-serif meta) to preserve typographic hierarchy.
