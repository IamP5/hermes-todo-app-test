# Issue tracker

- **Tracker:** GitHub Issues, via the `gh` CLI.
- **Repo:** `IamP5/hermes-todo-app-test`.
- **Source of truth:** PRDs and vertical-slice issues live as GitHub issues. The
  issue's acceptance criteria are the contract for any implementation work.
- **Intake:** Hermes owns intake — work arrives as a Hermes kanban card carrying
  an agent brief that references the originating issue. External PRs are not a
  triage surface.
- **Definition of done:** PR opened against the issue (`Closes #N`), CI green,
  evidence (actual command output) posted on the card/PR, human merges.

See `docs/agents/triage-labels.md` for the labels used to move issues through
this flow, and `docs/agents/domain.md` for how domain context is organized.
