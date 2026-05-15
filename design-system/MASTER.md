# Design System — Cen21 Hospitality

Source of truth for UI. **MCP cahier des charges overrides** generic ui-ux-pro-max color suggestions.

## Brand colors (MCP)

| Token | HEX | Usage |
|-------|-----|--------|
| petrol | `#0B2429` | Primary background |
| gold | `#C5A059` | Accent, CTA, focus rings |
| anthracite | `#121212` | Structure, cards |
| ivory | `#F5F2E8` | Primary text |
| taupe | `#7D746D` | Secondary UI |
| stone | `#8E8E8E` | Subtle UI |

## Typography (MCP)

- **Headings:** Cormorant Garamond (H1–H3)
- **Body / UI:** Inter

## Style

- Cinematic editorial luxury on dark petrol base
- Subtle glass: `bg-white/5 backdrop-blur-md border border-white/10`
- Storytelling layout: hero → sections → CTA
- Lucide icons, thin strokes, 24px
- Transitions: 150–300ms, `ease-out`
- No infinite decorative animations
- Respect `prefers-reduced-motion`

## Anti-patterns

- No emoji icons
- No generic navy/gold palette from generic luxury templates
- No reservation UI (V2)
- cursor-pointer on all interactive elements
