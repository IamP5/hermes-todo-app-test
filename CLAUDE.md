# angular-todo

A small Angular (v22, signals-based) todo list app — add/edit/delete todos with
categories, inline editing, status/category filtering, and a dark/light theme,
persisted to `localStorage`.

## Session start

1. Read this file fully.
2. Run `./init.sh`. If baseline verification fails and your task isn't fixing
   it, report blocked — never build on a red baseline.

## How work arrives

Work comes as a GitHub issue (a PRD or a vertical slice) referenced in your
brief, usually via a Hermes kanban card. The issue's acceptance criteria are
the contract. Tracker details: `docs/agents/issue-tracker.md`.

## Skills routing

- Implementing a slice/issue: `/implement` — uses `/tdd` at the seams agreed in
  the PRD.
- Hard bug, cause unknown: `/diagnosing-bugs`.
- Before finishing any change: `/code-review` against the originating issue.
- Domain terms live in `CONTEXT.md` (once created); decisions in `docs/adr/`.
  Until then, current feature behavior is documented in
  `docs/todo-app-spec.md`, and harness/workflow conventions in
  `docs/sdd-harness.md`. Read them before exploring; don't re-litigate.

## Definition of done

- `./init.sh` green, plus tests for the new behavior at the agreed seams.
- `/code-review` run (standards + spec axes), findings addressed.
- Committed to a branch; PR opened referencing the issue (`Closes #N`); CI green.
- Evidence (actual command output — tests, typecheck) posted on your card/PR.

Anything less is not done — state exactly what's missing instead of claiming
completion.

## Scope

- Exactly one issue/card per session. Discovered bigger scope? Stop and report
  blocked with the question — never expand silently.
- Off-limits without an explicit brief: `angular.json`, build/CI config, and
  the `localStorage` persistence scheme in `TodoService`/`ThemeService`.

## Commands

- Install: `npm install`
- Typecheck: `npm run typecheck`
- Lint: none configured (no eslint in this repo)
- Test: `npm test -- --watch=false`
- Build: `npm run build`
- Run: `npm start`
