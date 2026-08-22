# BAZAR360 Typography System & Design Guidelines

This document outlines the official typography standards, font stacks, weights, and usage guidelines for the **Bazar360** multi-tenant automotive marketplace.

---

## 1. Font Families & Stacks

| Role | Font Family | Fallback Stack | CSS Variable |
|------|-------------|----------------|--------------|
| **Primary Sans (Body & UI)** | **Manrope** | `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` | `--font-sans` |
| **Display (Headings & Hero)** | **Plus Jakarta Sans** / **Manrope** | `Manrope, ui-sans-serif, system-ui, sans-serif` | `--font-display` |
| **Monospace (Specs & Pricing)** | **JetBrains Mono** | `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` | `--font-mono` |

### Font Loading Standard
Fonts are loaded via Google Fonts CDN in `index.html` and `src/index.css` with `display=swap` to eliminate layout shifts (CLS) and FOIT (Flash of Invisible Text):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Manrope:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
```

---

## 2. Standardized Font Weights

| Weight | Tailwind Class | Description & Key Application |
|--------|----------------|-------------------------------|
| **400** (Regular) | `font-normal` | Long-form reading, vehicle descriptions, terms & conditions, placeholder copy |
| **500** (Medium) | `font-medium` | Secondary metadata, location labels, subtitle details, form input text |
| **600** (Semi-Bold) | `font-semibold` | Subheaders, navigation links, card labels, interactive button states |
| **700** (Bold) | `font-bold` | Section headers, card vehicle titles, verified badge text, CTA buttons |
| **800** (Extra-Bold) | `font-extrabold` / `font-black` | Hero headlines, primary price tags, showroom branding titles |

---

## 3. Typographic Hierarchy & Guidelines

### A. Display & Section Headers (H1 - H3)
- **H1 (Hero Headlines)**:
  - Font: `font-display` (`Plus Jakarta Sans` / `Manrope`)
  - Weight: `font-black` (800)
  - Size: `text-2xl sm:text-4xl lg:text-5xl`
  - Tracking: `tracking-tight` (-0.03em to -0.04em)
  - Line Height: `leading-[1.15]`
- **H2 (Section Titles)**:
  - Weight: `font-bold` (700) or `font-black` (800)
  - Size: `text-xl sm:text-2xl lg:text-3xl`
  - Line Height: `leading-tight`
- **H3 (Vehicle Card Titles & Subsections)**:
  - Weight: `font-bold` (700)
  - Size: `text-base sm:text-lg`
  - Line Height: `leading-snug`

### B. Body & Form Text
- **Default Body**:
  - Font: `font-sans` (`Manrope`)
  - Size: `text-sm sm:text-base` (14px – 16px)
  - Weight: `font-normal` (400) / `font-medium` (500)
  - Line Height: `leading-relaxed` (1.6)
  - Contrast: Minimum 4.5:1 WCAG AA compliant against background surfaces.
- **Form Controls & Inputs**:
  - Size: `text-sm` (14px)
  - Weight: `font-semibold` (600)
  - Color: Direct high-contrast `#0F172A` / `#FFFFFF` with clear focus-visible outline.

### C. Numerical Specs & Price Badges
- **Chassis, Mileage & Engine CC**:
  - Font: `font-mono` (`JetBrains Mono`)
  - Weight: `font-bold` (700)
  - Letter Spacing: `tracking-wider`
- **Pricing Tags**:
  - Format: `PKR 4,850,000` (or dynamic dual-currency USD conversion)
  - Font: `font-mono` or `font-sans font-black`
  - Size: `text-base sm:text-lg lg:text-xl`

---

## 4. Accessibility & Responsive Stability
1. **No Layout Shift on Hover**: Avoid changing `font-weight` on hover states; utilize background color, border-color, or subtle scale transforms (`scale-[1.02]`) instead.
2. **Fluid Clamp Sizing**: Headings scale smoothly across viewports via CSS `clamp()` tokens (`clamp(1.75rem, 6vw, 2.25rem)`), preventing sudden breakpoint reflows.
3. **High Legibility in Both Light & Dark Themes**: Foreground ink dynamically adapts through `--color-text-main` and `--color-text-header` CSS variables.
