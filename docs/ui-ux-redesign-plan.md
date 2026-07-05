# UI/UX Redesign Plan

Status: planning only. No app code changed as part of this document. Produced
for Kanban card `t_bb38619c`.

This plan diagnoses concrete problems in the current Angular todo UI, proposes
a `DESIGN.md` to lock visual/motion/interaction decisions before implementation,
and breaks the redesign into SDD-sized slices. It does not implement anything;
follow-on cards should each take one slice through `/implement` (spec update →
build → `/code-review`).

## 1. Diagnosis of current UI/UX problems

Based on reading `src/app/app.html`, `src/app/app.css`, `src/styles.css`, and
`docs/todo-app-spec.md` as of this session.

1. **Add form always shows full detail, no progressive disclosure.** The add
   form renders a description textarea and category select on every load
   (`app.html:30-51`), even though most todos are one-line entries. This adds
   two extra controls above the list before a user sees any content — directly
   fights "get to a first meaningful action fast" mobile UX guidance.
2. **Own spec's touch-target rule is violated in four places.**
   `docs/todo-app-spec.md` mandates "minimum 44px touch targets," but
   `.filters__button`, `.todo-item__edit-button`, `.todo-item__delete`, and
   `.footer__clear` are all `min-height: 40px` (`app.css:164`, `292`, `394`).
   This is a measurable regression against the app's own documented contract,
   not a taste opinion.
3. **Too much chrome before the list on small screens.** Header, 2-row add
   form, and a 3-row stacked toolbar (mark-all, status filters, category
   select) all sit above the todo list in the mobile layout
   (`app.html:1-106`). On a small phone viewport this can push the actual
   content — the todos — below the fold on first load.
4. **Two filter mechanisms with inconsistent UI patterns.** Status filtering
   uses a segmented button row; category filtering uses a native `<select>`
   (`app.html:65-105`). Both do the same conceptual job ("narrow what I see")
   but look and behave differently, which reads as inconsistent rather than
   intentional.
5. **Category chips carry no distinguishing color.** All categories render
   with the same `--color-chip-bg`/`--color-chip-text` pair (`app.css:263-271`,
   `styles.css:33-34`, `58-59`). With 4 fixed categories, color is an obvious,
   cheap scanability win the current design leaves unused — the chip currently
   only encodes text, not color.
6. **Nested/double scrolling.** `.todo-list` has `max-height: 60vh;
   overflow-y: auto` (`app.css:207-208`) inside a page that also scrolls at
   `min-height: 100vh` on mobile. A scrollable region inside a scrollable page
   is a well-known mobile friction point (users "trap" a scroll gesture inside
   the list instead of scrolling the page).
7. **No motion anywhere except color/border easing.** Every state change —
   adding, deleting, toggling complete, switching filters, entering/leaving
   edit mode — is an instant DOM swap (`app.html:109-199`). List filtering and
   deletion in particular jump-cut, which reads as broken/laggy even though
   it's just unanimated.
8. **dblclick-to-edit doesn't map to a touch gesture.** `(dblclick)` on the
   title (`app.html:167`) is a desktop-only affordance; there's no
   discoverable equivalent gesture on a touchscreen. The explicit Edit button
   is the only reliable path on mobile, but the template treats dblclick as a
   co-equal entry point in the spec language.
9. **Flat typographic hierarchy.** Filter buttons, the category select, footer
   counts, and edit save/cancel buttons all sit at `0.85rem` regardless of
   importance (`app.css:166`, `193`, `295`, `356`). Combined with (4), it's
   hard to visually scan "what's a control" vs. "what's status text."
10. **Weak empty state.** A single centered sentence (`app.html:216-218`,
    `app.css:415-419`) with no icon, no distinction between "no todos exist
    yet" and "no todos match the current filter," and no direct call to
    action (e.g., focus the add input).
11. **Icon-only affordances rely on emoji glyphs.** The theme toggle uses
    `🌙`/`☀️` as its only visual signal besides text (`app.html:11`). Emoji
    rendering is inconsistent across OS/font stacks and doesn't match the
    weight of the rest of the UI.
12. **No installed motion/animation tooling.** `package.json` has no
    `@angular/animations` and no motion library — any motion recommendations
    below must work with plain CSS or Angular's built-in animation hooks, not
    assume a dependency that isn't there.

## 2. Proposed `DESIGN.md` structure

Modeled on the [DESIGN.md open spec](https://github.com/google-labs-code/design.md)
(YAML token frontmatter + human-readable rationale) and shadcn/ui's
restraint-and-composability philosophy. Add `DESIGN.md` at the repo root,
referenced from `sdd-harness.md` alongside `todo-app-spec.md` as a second
source of truth (spec = *what*, DESIGN.md = *how it looks/moves*).

```
---
# YAML frontmatter: machine-readable tokens
color: { brand voltage, semantic (success/danger/muted), per-category chip hues, light+dark pairs }
typography: { type scale steps, weight scale, casing rules for labels vs body }
spacing: { base unit, scale }
radius: { input/button value, card value }
shadow: { surface elevation }
motion: { durations, easings, reduced-motion fallback }
---

## Identity & voice
One paragraph: this is a calm, focused, single-user productivity tool — not a
playful/marketing surface. Motion and color choices should read as restraint,
not decoration.

## Color system
Single "brand voltage" primary, restricted to primary actions/active states.
Per-category chip palette (4 fixed hues, one per category, contrast-checked
in both themes). Semantic danger/success tokens. Locks: exact hex values,
which chip color maps to which category name.

## Typography
Type scale (expand beyond current 2 sizes to ~4 steps), weight scale (cap at
2-3 weights), casing rule for labels (uppercase+tracking) vs. body copy.
Locks: px/rem scale, which elements use which step.

## Spacing & layout
Base unit and scale, container max-width, breakpoint list (keep existing
mobile-first `600px` breakpoint unless a slice argues for more).

## Radius & elevation
One or two radius values (e.g. 6px controls / 12px cards), shadow usage rule
(only floating/card surfaces, never flat list rows).

## Iconography
Icon set/style decision (replace emoji glyphs — inline SVG vs. a small icon
font), fixed size tokens, stroke width if applicable.

## Component specs
Per component (button incl. destructive variant, input, select, checkbox,
category chip, segmented filter control): default/hover/focus-visible/
active/disabled states, min touch target confirmed at 44px.

## Motion tokens
Durations/easings per interaction class (see §5), explicit reduced-motion
behavior, statement that motion never fully carries state (paired with a
persistent visual: strikethrough, chip, filter label).

## Accessibility contract
Contrast minimums (WCAG AA), touch target minimum, focus-visible rule applied
uniformly, aria-live regions, "color is never the only signal" rule.

## Do / Don't
Concrete before/after snippets from this app's own screens (add form, list
row, filter bar) so the doc is testable against real components, not
abstract.
```

Decisions this document must **lock** before implementation starts: primary
hex, the 4 category-chip hues, the radius value(s), the motion
duration/easing tokens, the icon approach, and the expanded type scale. Once
locked, slices below implement against it rather than re-deciding per-PR.

## 3. Mobile-first interaction model

**Information architecture (top to bottom on a phone viewport):**
header (title + theme toggle) → single-line quick-add → todo list → a
lightweight filter affordance → footer summary. Filters move from
always-visible chrome to an on-demand affordance so the list is visible
higher on the page (fixes diagnosis #1, #3).

**Add flow:** collapse to a single-line input by default. An explicit
"Add details" control (not just an icon — icon + label, per mobile nav
guidance of pairing icon with text) expands description + category inline.
Collapsing after fields are filled must not silently discard data — either
keep expanded once used, or fold values into a one-line summary chip on
collapse. This is the acceptance bar for slice 2 below.

**Edit flow:** Edit button remains the primary, documented entry point on all
devices. Keep dblclick as a bonus desktop accelerator, but stop describing it
as a co-equal path in the spec — mobile has no equivalent gesture.

**Filters/category UX:** unify status and category filtering into one visual
pattern (either: both become chips in a single scrollable row, or both live
inside one "Filter" affordance that opens a small popover/sheet). Whichever
DESIGN.md locks, both filters must keep applying as AND per the existing
spec — this is a visual-pattern change, not a logic change.

**Empty states:** two distinct messages — "no todos yet" (first run, includes
a CTA that focuses the add input) vs. "no todos match this filter" (includes
a one-tap "clear filter" action). Never show the generic first-run message
when a filter is simply hiding everything.

**Density:** keep the current single-line-by-default row (title + chip
inline, description as an optional second line) — this part already works,
don't change it.

**Touch targets:** every interactive control ≥44×44 CSS px, including the
three button classes and the clear-completed button currently at 40px
(diagnosis #2). No exceptions.

## 4. Visual design direction

Borrow the *principles*, not the components, from the references:

- **From design.md:** a single restrained "brand voltage" color used only for
  primary actions and active states; one or two corner-radius values applied
  uniformly rather than an ad hoc scale; document the system as tokens +
  rationale so it's portable and reviewable independent of Angular.
- **From shadcn's philosophy:** "less is more" — ample whitespace, minimal
  chrome, hierarchy carried by weight/size more than by color; every
  component gets explicit default/hover/focus-visible/disabled states rather
  than styling only the happy path; composability (one button component with
  variants, not one-off classes per screen).
- **Concretely for this app:** expand the type scale to create real
  hierarchy (diagnosis #9), give each category a distinguishable-but-muted
  chip hue (diagnosis #5), replace emoji icons with a small consistent SVG
  icon set (diagnosis #11), and keep photography/illustration out — this is
  a utility app, not a marketing surface.

## 5. Motion design guidelines

No motion library is installed (diagnosis #12); implement with CSS
transitions or Angular's native `animate.enter`/`animate.leave` — do not add
a dependency (Framer Motion, GSAP) for an app this size, per the "keep
dependencies light" ground rule in `sdd-harness.md`.

Borrow *categories* of interaction from motion.dev's examples — enter/exit,
layout, hover feedback — not the springy/bouncy personality of its demos,
which doesn't fit a focused productivity tool.

| Moment | Motion | Timing/easing |
|---|---|---|
| New todo added | Fade + slight translateY enter | 150–200ms, ease-out |
| Todo deleted | Fade + height collapse exit (no abrupt cut) | 150–200ms, ease-in |
| Toggle complete | Checkbox fill + strikethrough transition | 100–150ms, ease-out |
| Filter changed | Crossfade the list content, not a hard reflow snap | ~150ms, ease-out |
| Edit mode enter/exit | Height/opacity transition, not a layout jump | 150–200ms, ease-out |
| Button/control press | Existing color/border transitions (already present) | keep 100–150ms |

**Reduced motion:** respect `prefers-reduced-motion: reduce` globally — under
that query, remove transform/translate-based motion and fall back to an
instant or ≤1-frame opacity change. Motion must never be the only carrier of
state (completed still shows strikethrough+chip regardless of animation
state). This is a hard requirement, not a nice-to-have — [~35% of users who
have access to the setting report using it](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion),
and WCAG 2.3.3 treats motion-from-interaction as an accessibility criterion.

## 6. Accessibility requirements

- Carry over and keep enforcing existing good patterns: visually-hidden
  `<label>`s, `aria-label` on icon/ambiguous controls, full keyboard
  operability, Escape-to-cancel.
- Fix the touch-target violations (§1.2) to meet the app's own 44px rule.
- WCAG AA contrast for every text/background pairing in both themes,
  including new category chip colors — check all 4 categories × 2 themes
  explicitly, not just the primary color.
- Focus-visible ring must be consistent across *all* interactive elements
  (buttons currently rely on default browser outline while inputs use a
  custom box-shadow ring — unify under one focus treatment in DESIGN.md).
- `aria-live="polite"` region for the active/completed counts so screen
  reader users get non-visual feedback when the list changes (add, delete,
  toggle, cross-tab sync) without a focus move.
- Color is never the only signal: category chips keep their text label
  alongside color; completed state keeps strikethrough alongside any
  opacity/color change.
- Respect `prefers-reduced-motion` (see §5) and the existing
  `prefers-color-scheme` handling.

## 7. Implementation slices (for a future SDD run)

Each slice is sized for one Kanban card, per CLAUDE.md's one-issue-per-session
rule. Order roughly matches priority/risk.

1. **Author `DESIGN.md`.** Lock color, type, spacing, radius, motion, icon
   tokens per §2. No app code changes.
   *Acceptance:* `DESIGN.md` merged at repo root; every "Locks" item in §2 has
   a concrete value; category chip contrast pairs documented and pass AA in
   both themes. *Verification:* manual contrast check recorded in the doc
   (e.g., WebAIM contrast checker results per pair); `/code-review` against
   this planning doc as the spec.
2. **Quick-add progressive disclosure.** Collapse description/category
   behind an explicit "Add details" control.
   *Acceptance:* spec's existing "Adding a todo" criteria still hold; new
   criterion — description/category hidden by default, revealed via a
   labeled control, no data loss if collapsed after being filled.
   *Tests:* component test for expand/collapse state; existing add-flow
   tests continue to pass unmodified.
3. **Touch-target fix.** Bump `.filters__button`, `.todo-item__edit-button`,
   `.todo-item__delete`, `.footer__clear` to `min-height: 44px`.
   *Acceptance:* no control has a computed min dimension under 44px.
   *Verification:* since jsdom doesn't compute real layout, verify via a
   manual viewport check (documented in the PR) plus a source-level check
   that no button/input class sets a min-height below 44px.
4. **List motion pass.** Add enter/exit/toggle/filter-change transitions per
   §5, gated on `prefers-reduced-motion`.
   *Acceptance:* add/remove/toggle/filter-switch all animate per the table in
   §5; with reduced motion emulated, no transform-based motion occurs.
   *Verification:* manual QA checklist in the PR (add item, remove item,
   toggle complete, switch filter, with and without `prefers-reduced-motion`
   emulated in devtools) — CSS animation timing isn't meaningfully unit
   -testable in this stack.
5. **Unified filter control.** Merge status + category filters into one
   visual pattern per §3.
   *Acceptance:* both filters still combine as AND per existing spec; one
   consistent control style replaces the segmented-buttons + native-select
   mismatch. *Tests:* existing filtering logic tests unchanged; new
   interaction tests for the unified control.
6. **Empty states + category color.** Split "no todos yet" vs. "no matches
   for this filter" copy/CTA; apply the per-category chip hues from
   `DESIGN.md`.
   *Acceptance:* spec updated with both empty-state variants; chip colors
   match locked DESIGN.md values and pass contrast in both themes.
7. **Accessibility/motion audit pass.** Uniform focus-visible treatment,
   `aria-live` count region, full contrast recheck after the visual changes
   above land. *Acceptance:* documented keyboard walkthrough + an
   axe/Lighthouse pass noted in the PR with no new violations.

## 8. Non-goals and risks

**Non-goals (explicitly out of scope for this redesign):**
- No due dates, reminders, priority levels, or subtasks — not in the current
  data model (`docs/todo-app-spec.md` §Data model); adding them is a separate
  product decision, not a UI polish pass.
- No drag-to-reorder — would require a new persisted ordering field and adds
  complexity disproportionate to this app's size.
- No motion/animation library dependency — CSS/Angular-native only.
- No PWA/installability work.
- No changes to `angular.json`, build/CI config, or the `localStorage`
  persistence scheme in `TodoService`/`ThemeService` — off-limits per
  CLAUDE.md without an explicit brief; any visual token work touching
  `styles.css` must stay purely cosmetic (CSS custom properties), not alter
  `ThemeService` logic.

**Risks:**
- Progressive disclosure on the add form (slice 2) could reduce discoverability
  of description/category for existing users — mitigate with a visible
  labeled control, not an icon-only affordance.
- Motion (slice 4) risks jank on low-end devices if it animates layout
  properties directly — restrict to `transform`/`opacity`, avoid animating
  `height`/`max-height` where a transform-based alternative exists.
- Category chip recoloring (slice 6) touches shared CSS custom properties in
  `styles.css` — must be scoped to token values only, verified against both
  themes, and reviewed carefully given `styles.css` also carries the
  theme-toggle mechanism (off-limits to logic changes).
- `DESIGN.md` is only useful if treated as authoritative — add a pointer to
  it from `docs/sdd-harness.md` in slice 1 so future sessions read it
  alongside `todo-app-spec.md` rather than re-deriving visual decisions
  per-PR.
- This plan itself is a synthesis of a design-token spec, a component
  library's marketing/docs page, and a motion demo gallery — none of these
  are prescriptive for a small todo app. Treat §2–§5 as a starting proposal
  for slice 1 to ratify or amend, not as pre-locked values.

## Sources researched

- [google-labs-code/design.md](https://github.com/google-labs-code/design.md) —
  DESIGN.md open spec (YAML token frontmatter + prose rationale, Design Token
  JSON-style token groups).
- [designmd.app](https://designmd.app/) — library of example DESIGN.md files
  (direct fetch of designmd.co returned HTTP 403; used search-indexed
  content and the GitHub spec instead).
- `https://www.shadcn.io/design` — shadcn/ui design principles (composability,
  restraint, accessible-by-default components).
- `https://motion.dev/examples` — motion.dev example gallery (enter/exit,
  layout, gesture, scroll-linked, spring categories).
- [MDN: `prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
  and [W3C WCAG 2.3.3 Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) —
  reduced-motion requirements.
- General mobile-first UX/touch-target research (44×44px minimum, thumb-zone
  placement, fast-time-to-first-action) via web search, cross-checked against
  this app's own `docs/todo-app-spec.md` mobile-first section.
