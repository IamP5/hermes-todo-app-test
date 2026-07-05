# Domain

**Single-context.** This is one small Angular app (todo list with categories,
inline editing, theme toggle, localStorage persistence) — not a monorepo with
independently-versioned packages, so there is no `CONTEXT-MAP.md` split.

- Domain terminology and invariants: root `CONTEXT.md` (created lazily by the
  domain-modeling skill once there's real content to capture).
- Architectural decisions: `docs/adr/` (created lazily, same skill).
- Existing feature/behavior spec in the meantime: `docs/todo-app-spec.md`.
- Harness/workflow conventions: `docs/sdd-harness.md`.

Do not re-derive domain context from scratch each session — read `CONTEXT.md`
and `docs/adr/` first once they exist, and don't re-litigate decisions already
recorded there.
