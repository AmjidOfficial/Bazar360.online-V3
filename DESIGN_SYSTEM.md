# Bazar360 UI System v2

## Product direction
Bazar360 should feel as easy to use as a familiar social marketplace, without copying another product. The user should understand the next action in seconds.

Principles:
- Mobile first, then scale up.
- One clear primary action per surface.
- Simple navigation with progressive disclosure.
- Real user content first: vehicle image, price, seller/showroom, location, trust state.
- Motion adds feedback, not decoration.
- 3D depth comes from perspective, soft elevation and media movement, not heavy WebGL on normal screens.
- Never sacrifice speed for visual effects.

## Typography
- Display: Manrope, 600-800.
- Body/UI: DM Sans, 400-700.
- Technical data: JetBrains Mono, 400-700.
- Body target: 14-16px.
- H1 target: 28-48px responsive.
- H2 target: 22-34px responsive.
- Keep a strong visible hierarchy. Do not make headings only a few pixels larger than body copy.

## Color tokens
Light:
- Page: #F4F6F8
- Surface: #FFFFFF
- Soft surface: #EEF1F4
- Text: #253041
- Heading: #111827
- Muted: #667085
- Border: #DFE4EA
- Primary: #1877F2

Dark:
- Page: #0B0F14
- Surface: #111820
- Soft surface: #18212C
- Text: #E5E7EB
- Heading: #F9FAFB
- Muted: #9AA5B4
- Border: rgba(255,255,255,.09)
- Primary: #4595FF

Brand red may be used for BAZAR360 identity and status emphasis, but it must not compete with the primary action color.

## Buttons
Use only three visual families:
1. Primary: filled, high contrast.
2. Secondary: surface + border.
3. Ghost/icon: transparent, only for low-risk utility actions.

Minimum touch target: 44px on touch devices. Never use tiny 16px action triggers.

## Cards and media
- Radius: 16-18px.
- Vehicle media: 16:10 by default.
- Use object-fit: cover and object-position: center.
- Preserve the original uploaded media. Never distort images.
- Avoid unnecessary borders. Use one subtle border or elevation.
- Hover: 2-3px lift and very small media scale, disabled/reduced for reduced-motion users.

## Layout
- Phone: one-column feed and vehicle cards.
- Tablet: two-column grid where useful.
- Desktop: three-column inventory by default, four only on wide screens when cards remain readable.
- Use CSS Grid for page-level layout and Flexbox for small groups.
- Keep content width around 1200-1280px on large screens.
- Use consistent spacing tokens. Avoid arbitrary gaps.

## Navigation
- Desktop: compact sticky top bar with grouped navigation and one obvious primary action.
- Mobile: bottom navigation for the most-used destinations plus contextual top controls.
- Do not pack many utilities into one cluster.
- Secondary actions belong in an overflow menu.
- Search should always be easy to reach.

## Motion and 3D
- Use Motion/Framer Motion for route, list and interaction transitions already supported by the project.
- Use transform, perspective, subtle parallax and layered shadows for 3D feel.
- Avoid continuous animations on large lists.
- Respect prefers-reduced-motion.
- Prefer CSS gradients and transforms over canvas/WebGL for common UI.

## Accessibility
- One H1 per page.
- Never skip heading levels.
- Visible focus states.
- Keyboard accessible controls.
- Touch targets 44px minimum on coarse pointers.
- Good contrast in both themes.
- Text must remain readable at 200% zoom.

## Performance
- Lazy load below-the-fold media.
- Use responsive image sizes and modern formats where the media pipeline supports them.
- Avoid rendering heavy 3D scenes until requested.
- Keep animations GPU-friendly: transform and opacity first.
- Do not block first content with decorative effects.

## Usability audit response
The September 13, 2026 audit reported 9 issues: 3 major and 6 minor, with a 68/100 usability score. The redesign directly addresses its themes: fewer button styles, fewer text colors, stronger typography, clear primary CTAs, clean heading structure, less crowded utility controls, larger interactive scroll controls and proper action hit areas.
