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

- The add form has a title input (required), an optional description textarea, and a
  category selector defaulting to `Personal`.
- Submitting with a blank (or whitespace-only) title is a no-op — the submit button
  is disabled in that state.
- After a successful add, the form resets to empty title/description and the default
  category.

## Editing a todo

- Editing happens inline (no `window.prompt`): activating edit (via the Edit button or
  double-clicking the title) reveals an editable title input, description textarea,
  and category selector for that todo.
- Saving updates title, description, and category together. Saving with a blank title
  deletes the todo (existing behavior, preserved).
- Escape cancels editing without saving changes.

## Categories & filtering

- Each todo displays a category chip alongside its title.
- In addition to the status filter (All / Active / Completed), a category filter
  lets the user narrow the list to one category or show all categories.
- Both filters apply simultaneously (AND, not OR).

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

- Base (unprefixed) CSS targets small screens: full-bleed layout, stacked form rows,
  stacked toolbar/filters, minimum 44px touch targets on buttons and inputs.
- A `min-width: 600px` media query progressively enhances the layout for larger
  viewports (card container with max-width, side-by-side form rows and toolbar).

## Accessibility

- All form controls have an associated `<label>` (visually hidden where a visible
  label would be redundant with a placeholder).
- Icon-only/ambiguous controls (theme toggle, delete, edit, checkboxes) carry
  descriptive `aria-label`s.
- All interactive controls are reachable and operable via keyboard (native buttons,
  inputs, and selects; Escape cancels inline editing).

## Existing behavior (unchanged)

- Toggle a todo's completed state; toggle all; clear completed; active/completed
  counts in the footer.
- Deleting a todo removes it immediately.
- Todos loaded from another browser tab/window sync via the `storage` event.
