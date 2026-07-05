# Todo App — Spec & Acceptance Criteria

## Data model

A `Todo` has:

- `id: string` — stable unique identifier.
- `text: string` — the title/body of the todo.
- `description: string` — optional longer detail, may be empty.
- `category: string` — one of the default categories; defaults to `Personal` when unset.
- `completed: boolean`
- `createdAt: number` — epoch ms.

Default categories: `Personal`, `Work`, `Errands`, `Ideas`.

### Persistence & migration

- Todos persist to `localStorage` under `angular-todo.todos` as a JSON array.
- Data written by older versions of the app (only `id`/`text`/`completed`/`createdAt`)
  must still load. Missing `description` defaults to `''`; missing/blank `category`
  defaults to `Personal`. Malformed JSON is treated as an empty list rather than
  throwing.
- Theme preference persists separately under `angular-todo.theme` (`'light'` or
  `'dark'`).

## Adding a todo

- The add form has a title input (required); the optional description textarea and
  category selector are collapsed by default behind a labeled "Add details" control
  (icon + text, not icon-only) so a one-line add is the fast path on small screens.
- Activating "Add details" reveals the description and category fields inline; the
  control becomes "Hide details" and can be used to collapse them again.
- Collapsing the details panel never discards entered data: if a description was
  typed or a non-default category chosen, that state folds into a one-line summary
  (category chip + description snippet) shown next to the collapsed toggle until the
  panel is reopened or the todo is added.
- Submitting with a blank (or whitespace-only) title is a no-op — the submit button
  is disabled in that state.
- After a successful add, the form resets to empty title/description, the default
  category, and the details panel collapses back to its default (hidden) state.

## Editing a todo

- Editing happens inline (no `window.prompt`): activating edit (via the Edit button or
  double-clicking the title) reveals an editable title input, description textarea,
  and category selector for that todo.
- Saving updates title, description, and category together. Saving with a blank title
  deletes the todo (existing behavior, preserved).
- Escape cancels editing without saving changes.

## Categories & filtering

- Each todo displays a category chip alongside its title, colored with a hue
  specific to that category (`DESIGN.md`'s locked chip palette — Personal violet,
  Work blue, Errands green, Ideas amber), in addition to the text label. Chip colors
  pass WCAG AA contrast in both light and dark themes.
- Each todo row also carries a left-edge accent border in that same category color,
  reinforcing the chip for at-a-glance scanning without adding a new color.
- Status (All / Active / Completed) and category (All categories / Personal / Work /
  Errands / Ideas) filters render as one unified row of ghost-button chips — the same
  visual pattern for both — rather than a segmented control paired with a native
  `<select>`. The row scrolls horizontally on narrow viewports instead of wrapping
  into extra toolbar rows.
- Both filters apply simultaneously (AND, not OR): selecting a status chip and a
  category chip narrows the list to todos matching both.

## Empty states

- **No todos yet** (first run — no todos exist at all): shown only when there are
  zero todos in storage. Includes a CTA button that focuses the add-todo title
  input.
- **No todos match this filter** (todos exist, but the current status/category
  filter combination hides all of them): shown instead of the todo list. Includes
  a one-tap "Clear filter" action that resets both the status and category filters
  back to "All".
- The first-run message never shows when a filter is simply hiding everything —
  the two messages are mutually exclusive and selected by whether any todos exist
  at all, not by whether the filtered list is empty.

## Descriptions

- When a todo has a non-empty description, it renders under the title in the list.
- Todos without a description show no description line (no empty placeholder).

## Dark mode

- A toggle button in the header switches between light and dark themes.
- On first load with no saved preference, the app respects
  `prefers-color-scheme: dark`.
- Once the user toggles the theme, that explicit choice is saved to `localStorage`
  and takes precedence over the system preference on future loads.
- Theme is applied via a `data-theme` attribute on `<html>`; component and global
  styles read colors from CSS custom properties so both themes stay in one place.

## Mobile-first layout

- Base (unprefixed) CSS targets small screens: the app renders as an inset card
  (rounded corners, elevation, framed by the gradient page background) rather than
  a full-bleed flat surface, with stacked form rows, stacked toolbar/filters, and
  minimum 44px touch targets on buttons and inputs.
- A `min-width: 600px` media query progressively enhances the layout for larger
  viewports (wider card container with max-width, stronger elevation, side-by-side
  form rows and toolbar).

## Accessibility

- All form controls have an associated `<label>` (visually hidden where a visible
  label would be redundant with a placeholder).
- Icon-only/ambiguous controls (theme toggle, delete, edit, checkboxes) carry
  descriptive `aria-label`s.
- All interactive controls are reachable and operable via keyboard (native buttons,
  inputs, and selects; Escape cancels inline editing).
- Every interactive element (button, input, textarea, select) shows the same
  focus-visible treatment — a 3px ring using the primary color at reduced opacity —
  instead of relying on the browser's default outline for some controls and a
  custom ring for others.
- The footer's active/completed counts sit in an `aria-live="polite"` region so
  screen-reader users hear updates when the list changes (add, delete, toggle,
  cross-tab sync) without a forced focus move.
- Motion (list enter/exit, edit-mode transitions) respects `prefers-reduced-motion:
  reduce` globally: transform-based animation is replaced with a near-instant
  opacity swap. Motion never carries state alone — completed todos always show
  strikethrough regardless of whether an animation played.

## Existing behavior (unchanged)

- Toggle a todo's completed state; toggle all; clear completed; active/completed
  counts in the footer.
- Deleting a todo removes it immediately.
- Todos loaded from another browser tab/window sync via the `storage` event.
