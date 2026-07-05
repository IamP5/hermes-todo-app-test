# Spec-Driven Development Harness

This repo uses a lightweight spec-driven workflow: the spec is the source of truth
for *what* the app should do, and tests are how we prove it still does that.

## Working loop

1. **Update the spec first.** Before changing behavior, edit
   [`docs/todo-app-spec.md`](./todo-app-spec.md) so the acceptance criteria describe
   the feature you're about to build or change. If you can't state the acceptance
   criteria yet, you're not ready to write code.
2. **Implement.** Make the smallest change that satisfies the updated spec. Prefer
   editing existing services/components over introducing new abstractions.
3. **Run harness checks.** `npm run sdd:check` runs the full test suite and a
   production build. Both must pass before you consider the change done.
4. **Verify in the UI.** Start the dev server (`npm start`) and manually exercise the
   feature — add/edit/delete todos, toggle dark mode, filter by category, resize the
   viewport to confirm the mobile-first layout holds up. Automated tests catch
   regressions in logic; they don't catch a button that's unreachable on a phone
   screen.
5. **Reconcile the spec.** If implementation revealed the spec was wrong or
   incomplete, update `docs/todo-app-spec.md` again so it stays accurate.

## Scripts

- `npm run sdd:check` — runs `ng test --watch=false` followed by `ng build`. This is
  the single command to run before calling anything "done."
- `npm run verify` — alias for `npm run sdd:check`, kept for discoverability.
- `npm start` — dev server bound to `0.0.0.0:4200` with `--allowed-hosts` so it stays
  reachable over Tailscale. Don't change these flags without a reason — they're what
  makes the app reachable from other devices on the tailnet.

## Ground rules

- No new state management framework. Angular signals + a couple of small
  `@Injectable({ providedIn: 'root' })` services (`TodoService`, `ThemeService`) are
  enough for this app's size.
- LocalStorage is the only persistence layer. Any schema change to the stored `Todo`
  shape must migrate old data gracefully (see `TodoService.normalizeTodo`) — never
  assume a from-scratch localStorage on someone's existing device.
- Keep dependencies light. Reach for a library only when the alternative is
  meaningfully worse to hand-roll.
