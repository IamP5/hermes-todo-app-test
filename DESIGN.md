---
# Machine-readable design tokens. Prose below explains rationale and usage
# rules; this frontmatter is the single source of concrete values.
color:
  brand:
    light: '#6c63ff'
    light-hover: '#574fd6'
    light-muted: '#c6c2ff'
    dark: '#8b83ff'
    dark-hover: '#a29bff'
    dark-muted: '#4a4680'
  semantic:
    danger:
      light: '#e12d39'
      dark: '#ff6b78'
    success:
      light: '#1c6b3c'
      dark: '#a9e8c0'
  category-chips:
    personal:
      light: { bg: '#ece9ff', text: '#4b3aad' }
      dark: { bg: '#352a66', text: '#d9d2ff' }
    work:
      light: { bg: '#e3eefd', text: '#1d4ed8' }
      dark: { bg: '#1c3a63', text: '#bcdcff' }
    errands:
      light: { bg: '#e2f6ea', text: '#1c6b3c' }
      dark: { bg: '#1d3f2c', text: '#a9e8c0' }
    ideas:
      light: { bg: '#fdf1d9', text: '#8a5a00' }
      dark: { bg: '#4a3710', text: '#ffd98a' }
typography:
  scale:
    xs: '0.75rem'   # 12px — chip labels, meta text
    sm: '0.875rem'  # 14px — controls, buttons, secondary text
    base: '1rem'    # 16px — body text, inputs
    lg: '1.25rem'   # 20px — reserved: section emphasis
    xl: '1.5rem'    # 24px — app title, mobile
    '2xl': '1.875rem' # 30px — app title, >=600px
  weights:
    regular: 400
    semibold: 600
    bold: 700
spacing:
  base-unit: '4px'
  scale: ['0.25rem', '0.5rem', '0.75rem', '1rem', '1.25rem', '1.5rem', '2rem']
  breakpoint: '600px'
  container-max-width: '560px'
radius:
  control: '8px'   # buttons, inputs, list rows
  card: '12px'     # outer app container, >=600px
shadow:
  surface: '0 10px 30px rgba(0, 0, 0, 0.08)'  # light
  surface-dark: '0 10px 30px rgba(0, 0, 0, 0.35)'
  usage: 'card container only, never flat list rows'
motion:
  durations:
    enter: '150-200ms'
    exit: '150-200ms'
    toggle: '100-150ms'
    crossfade: '150ms'
    press: '100-150ms'
  easings:
    enter: 'ease-out'
    exit: 'ease-in'
    toggle: 'ease-out'
  reduced-motion: 'transform/translate motion removed; fall back to instant or <=1-frame opacity change'
---

## Identity & voice

This is a calm, focused, single-user productivity tool — not a playful or
marketing surface. Every color and motion choice should read as restraint,
not decoration. One brand color, used sparingly, carries all "this is
active/primary" meaning; everything else is neutral gray-scale plus the four
fixed category hues.

## Color system

**Brand voltage.** A single violet primary — `#6c63ff` (light) / `#8b83ff`
(dark), already in use as `--color-primary` — is retained as the one
"brand voltage" color and locked as the app's sole primary-action /
active-state hue. It must never be used decoratively (e.g. as a background
fill) outside of primary buttons, active filter states, and focus rings.

**Semantic tokens.** `danger` (`#e12d39` light / `#ff6b78` dark, already
`--color-danger`) marks destructive actions (delete). `success` reuses the
Errands chip hue (`#1c6b3c` light / `#a9e8c0` dark) — there is no separate
"success" concept in this app beyond the completed-todo state, which is
already carried by strikethrough + opacity, not color alone (see
Accessibility contract).

**Category chip hues.** Four fixed, distinguishable-but-muted hues, one per
default category, identical across the app regardless of session:

| Category | Hue family | Light bg / text | Dark bg / text |
|---|---|---|---|
| Personal | Violet (brand family) | `#ece9ff` / `#4b3aad` | `#352a66` / `#d9d2ff` |
| Work | Blue | `#e3eefd` / `#1d4ed8` | `#1c3a63` / `#bcdcff` |
| Errands | Green | `#e2f6ea` / `#1c6b3c` | `#1d3f2c` / `#a9e8c0` |
| Ideas | Amber | `#fdf1d9` / `#8a5a00` | `#4a3710` / `#ffd98a` |

Rationale for the mapping: Personal stays in the brand's own violet family
(closest to "self"); Work uses blue (conventional, professional); Errands
uses green (action/go); Ideas uses amber (creativity/"lightbulb"). Each pair
is a light, desaturated background with a dark, saturated text color in
light theme, inverted (dark desaturated background, light saturated text)
in dark theme — this keeps chips visually quiet next to the flat list rows
while remaining legible. See **Contrast documentation** below for the
computed ratios.

### Contrast documentation — category chip pairs

All 8 pairs (4 categories × 2 themes) were computed using the WCAG 2.x
relative-luminance formula (`L = 0.2126R + 0.7152G + 0.0722B` on
linearized sRGB channels, contrast = `(L_lighter + 0.05) / (L_darker + 0.05)`).
Chip text is 12px/600 weight, below the "large text" AA exception threshold,
so the required minimum is **4.5:1**.

| Pair | Background | Text | Ratio | AA (4.5:1) |
|---|---|---|---|---|
| Light / Personal | `#ece9ff` | `#4b3aad` | 7.05:1 | PASS |
| Light / Work | `#e3eefd` | `#1d4ed8` | 5.72:1 | PASS |
| Light / Errands | `#e2f6ea` | `#1c6b3c` | 5.78:1 | PASS |
| Light / Ideas | `#fdf1d9` | `#8a5a00` | 5.30:1 | PASS |
| Dark / Personal | `#352a66` | `#d9d2ff` | 8.73:1 | PASS |
| Dark / Work | `#1c3a63` | `#bcdcff` | 8.08:1 | PASS |
| Dark / Errands | `#1d3f2c` | `#a9e8c0` | 8.33:1 | PASS |
| Dark / Ideas | `#4a3710` | `#ffd98a` | 8.43:1 | PASS |

All 8 pairs clear AA with margin (minimum observed: 5.30:1, comfortably
above the 4.5:1 floor). Dark-theme pairs run higher because light text on a
deep, desaturated background yields more luminance separation than a dark
text on a pale background at equivalent saturation — this is expected and
not a sign the light-theme values need revisiting.

## Typography

Expanded from the current effective 2 sizes (`0.85rem` controls, `1rem`
body) to a 6-step scale:

| Token | Size | Used for |
|---|---|---|
| `xs` | 0.75rem (12px) | Category chip label, description text |
| `sm` | 0.875rem (14px) | Filter buttons, footer text, edit save/cancel |
| `base` | 1rem (16px) | Todo title, form inputs |
| `lg` | 1.25rem (20px) | Reserved — not yet used by any component |
| `xl` | 1.5rem (24px) | App title, mobile (`<600px`) |
| `2xl` | 1.875rem (30px) | App title, desktop (`>=600px`) |

Weight scale is capped at three: `400` regular (body/description text),
`600` semibold (labels, buttons, chips, filter/edit controls), `700` bold
(app title only — the single strongest element on the page).

Casing rule: no forced uppercase transform anywhere. The current sentence
case for buttons/labels/chips is retained — this app has too little chrome
to need an uppercase+tracking convention, and introducing one would be
decoration without a scanability payoff here.

## Spacing & layout

Base unit `4px`; scale is `0.25rem / 0.5rem / 0.75rem / 1rem / 1.25rem /
1.5rem / 2rem`, matching the gap/padding values already used ad hoc across
`app.css` (e.g. `0.35rem`, `0.5rem`, `0.75rem`, `1.25rem`). Future spacing
values should snap to this scale rather than introducing new arbitrary
values.

Breakpoint stays at `600px` (mobile-first base styles, one `min-width:
600px` progressive-enhancement query) — matches `docs/todo-app-spec.md`
"Mobile-first layout" section, unchanged. Desktop container max-width stays
`560px`.

## Radius & elevation

Two radius values, locked:

- `8px` — controls: buttons, inputs, selects, list rows (`.todo-item`).
- `12px` — the outer app card container, all breakpoints (see addendum below).

Shadow: one elevation token, `--shadow-surface` (`>=600px`) plus a lighter
`--shadow-surface-sm` variant (`<600px`, see addendum below), applied
**only** to the outer card container. Flat surfaces — list rows, chips, the
toolbar — never get a shadow; elevation is reserved for the single
"floating card on a gradient page" moment, not decoration on every surface.
Category-color row accents (see addendum) are a left border, not a shadow,
and don't violate this rule.

### Addendum — mobile card shell (issue #14)

Slice #8 shipped a mobile viewport that read as "basically unchanged" —
`.app` filled the full mobile viewport edge-to-edge with a flat surface
color and no radius/shadow (both were locked to `>=600px` only), so the
gradient page background never showed and the app never read as a
"designed" card on the device most users actually test on. This addendum
amends the two rules above rather than adding new tokens:

- The outer `.app` shell now gets its `12px` radius and a shadow at every
  breakpoint, not just `>=600px`. `body` gets `0.75rem` padding (already on
  the locked spacing scale) so the page gradient frames the card on mobile.
- A new `--shadow-surface-sm` token (`0 6px 20px rgba(63, 61, 86, 0.12)`
  light / `0 6px 20px rgba(0, 0, 0, 0.45)` dark) is used below `600px`; the
  existing `--shadow-surface` continues to apply at `>=600px` where the
  card floats further off the page.
- Todo rows and the filter toolbar keep their flat, shadow-less treatment
  per the rule above — only the outer shell changed.
- The theme toggle is now an inline SVG sun/moon icon button (circular,
  44×44) instead of the emoji-text button — this implements the icon
  decision already locked in the Iconography section below, deferred at
  the time this document was first written.
- Todo rows get a `4px` left-border accent using each category's existing
  chip *text* color (not a new hue) — a locked color reused as a border
  instead of a new decorative fill, so it doesn't touch the "don't add a
  5th color" or "single brand-voltage fill" rules.
- The two status/category filter groups now sit inside one pill-shaped
  "track" (`--color-surface-muted` bg, `999px` radius) so they read as a
  single toolbar instead of two bolted-on controls; individual
  `.filters__button` chips drop their resting border (the track supplies
  the visual grouping instead) — see the updated Component specs table.
- `.todo-item__edit-button` / `.todo-item__delete` become circular
  icon-only ghost buttons (pencil/trash, no resting border) instead of
  bordered text buttons — directly addressing issue #14's "less
  admin-ish edit/delete buttons" ask. `.footer__clear` keeps its bordered
  ghost-button treatment (it's a standalone action, not part of a row of
  repeated per-item controls), so it's split into its own table row rather
  than sharing one with the filter chips.
- The primary Add button relies on its solid `--color-primary` fill (vs.
  `--color-primary-muted` when disabled) to read as "enabled" — no
  drop-shadow was added, since shadow stays reserved for the outer card
  shell per the rule above.
- The theme toggle's accessible name is now a single dynamic
  `[attr.aria-label]` ("Switch to light/dark mode") rather than a static
  label plus a visually-hidden span, so there's one unambiguous source for
  the accessible name.

## Iconography

**Decision: inline SVG, not an icon font.** Replace the emoji glyphs
(`🌙`/`☀️` theme toggle, diagnosis #11 in
`docs/ui-ux-redesign-plan.md`) with a small, consistent inline SVG icon set
— emoji rendering varies by OS/font stack and doesn't match the rest of the
UI's weight. An icon font is unnecessary dependency weight for ~2-4 icons
in an app this size.

Tokens:
- Size: `16px` (inline with text), `20px` (inside a 44px button), `24px`
  (standalone, e.g. empty-state icon).
- Stroke width: `1.5px` (`1.75px` for the smaller edit/delete/clear glyphs),
  `currentColor` stroke, no fill — icons inherit text color so they theme
  automatically with light/dark tokens.
- ViewBox: `0 0 24 24` for all icons regardless of rendered size, so the
  set stays internally consistent.

**Update (issue #14):** the theme toggle (sun/moon) and the todo-row
edit/delete actions (pencil/trash, plus the footer's clear-completed
action) now all use this icon set — the edit/delete deferral noted in the
original version of this section is lifted; icon+label legibility for
those three controls is covered by the accessible-name requirements in the
Accessibility contract below, not by visible text.

## Component specs

Every interactive component must define all five states below. `min target`
confirms the 44×44 CSS px rule from `docs/todo-app-spec.md` — met by every
control below (the touch-target fix landed in an earlier slice).

| Component | Default | Hover | Focus-visible | Active | Disabled | Min target |
|---|---|---|---|---|---|---|
| Primary button (`.add-todo__button`) | `--color-primary` bg, white text | `--color-primary-hover` bg | ring (see below) | slightly darker bg (`translateY(1px)` press, gated on reduced-motion) | `--color-primary-muted` bg, `not-allowed` cursor | 44×44 |
| Filter chip (`.filters__button`, inside the `.filters` pill track) | transparent bg, muted text, no border | `--color-surface-hover` bg, full text color | ring | `--color-primary` text, `--color-primary-soft` bg (no border — the pill track supplies the visual grouping) | n/a | 44×44 |
| Secondary/ghost button (`.footer__clear`) | transparent bg, muted text, bordered in `--color-border` | `--color-danger` text+border | ring | n/a | muted text, `not-allowed` cursor | 44×44 |
| Icon ghost button (`.todo-item__edit-button`) | transparent bg, muted text, no border, circular | `--color-primary` text, `--color-primary-soft` bg | ring | n/a | n/a | 44×44 |
| Destructive icon button (`.todo-item__delete`) | transparent bg, `--color-danger` text, no border, circular | `--color-danger` bg, white text | ring | darker danger bg | n/a (always available) | 44×44 |
| Text input / textarea | `--color-surface` bg, `--color-border` border | border → `--color-primary` on focus (see below) | ring, replaces border-only change | n/a | n/a | 44×44 |
| Select | same as text input | same | ring | n/a | n/a | 44×44 |
| Checkbox | native, `accent-color: --color-primary` | n/a | ring on the control, not just the label | checked = filled | n/a | 24×24 control, 44×44 tap area via label |
| Category chip | bg/text pair per category (see Color system) | n/a — chips are not interactive | n/a | n/a | n/a | n/a (not a control) |
| Category row accent (`.todo-item` left border) | 4px border in the todo's category text color | n/a — not interactive | n/a | n/a | dims to `--color-border` when completed | n/a (not a control) |
| Unified filter toolbar (`.filters`) | pill track (`--color-surface-muted` bg, `999px` radius) containing ghost chip buttons | per-button hover | per-button ring | active chip = filled `--color-primary-soft` bg | n/a | 44×44 per segment |

## Motion tokens

| Moment | Motion | Duration | Easing |
|---|---|---|---|
| Todo added | Fade + slight `translateY` enter | 150–200ms | ease-out |
| Todo deleted | Fade + height-collapse exit | 150–200ms | ease-in |
| Toggle complete | Checkbox fill + strikethrough transition | 100–150ms | ease-out |
| Filter changed | Crossfade list content (no hard reflow) | ~150ms | ease-out |
| Edit mode enter/exit | Height/opacity transition | 150–200ms | ease-out |
| Button/control press | Existing color/border transition | 100–150ms | ease-out |

**Reduced motion is a hard requirement.** Under `prefers-reduced-motion:
reduce`, remove all transform/translate-based motion; state changes fall
back to an instant change or a ≤1-frame opacity swap. Motion is never the
sole carrier of state: a completed todo shows strikethrough + chip
regardless of whether any animation played, matching the existing "color is
never the only signal" rule.

No motion library dependency — implement with CSS transitions or Angular's
native `animate.enter`/`animate.leave` only (`package.json` has no
`@angular/animations` and none should be added for this).

## Accessibility contract

- **Contrast:** WCAG AA minimum — 4.5:1 for normal text (including all 8
  category chip pairs, see Contrast documentation above), 3:1 for large
  text (≥18.66px bold or ≥24px regular) and UI component boundaries.
- **Touch targets:** every interactive control ≥44×44 CSS px, no
  exceptions — this locks the fix target for the four known 40px
  violations.
- **Focus-visible:** one consistent treatment across every interactive
  element — a `3px` `box-shadow` ring using `--color-primary-ring`
  (currently applied to inputs only; buttons must adopt the same ring
  instead of relying on the browser default outline).
- **Live regions:** the active/completed counts footer uses
  `aria-live="polite"` so screen-reader users get non-visual feedback when
  the list changes (add, delete, toggle, cross-tab sync) without a forced
  focus move.
- **Color is never the only signal:** category chips always pair color
  with a text label; completed state always pairs any color/opacity change
  with strikethrough.
- **Respect system/user preferences:** `prefers-reduced-motion` (see Motion
  tokens) and `prefers-color-scheme` (already implemented in
  `ThemeService`) both continue to be honored.

## Do / Don't

**Category chips**
- Do: give each category its own locked hue pair from the table above,
  keep the text label visible alongside the color.
- Don't: introduce a 5th ad hoc color for a new category without adding it
  to this document first, or drop the text label in favor of color alone.

**Buttons**
- Do: use the ghost/secondary style (`.filters__button` pattern) for
  low-emphasis actions; reserve the brand-voltage fill for the single
  primary action per screen (`.add-todo__button`).
- Don't: apply `--color-primary` as a background fill to more than one
  control class per view — that dilutes "primary" back into decoration.

**Motion**
- Do: animate `transform`/`opacity` only (per the table above), and gate
  every animation on `prefers-reduced-motion`.
- Don't: animate `height`/`max-height` directly where a transform-based
  alternative exists — that's the jank risk called out in the redesign
  plan's risk section.

**Elevation**
- Do: reserve `--shadow-surface` for the single outer card container at
  `>=600px`.
- Don't: add a shadow to list rows, chips, or the toolbar — flat surfaces
  stay flat; shadow is the one "this floats" signal in the whole app.
