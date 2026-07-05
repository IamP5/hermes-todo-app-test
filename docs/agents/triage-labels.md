# Triage labels

Canonical labels, 1:1 with GitHub, applied to issues as they move through the
Hermes-driven workflow:

- `needs-triage` — new issue, not yet reviewed.
- `needs-info` — blocked on clarification from a human.
- `ready-for-agent` — triaged, acceptance criteria are clear, safe to dispatch
  to an agent.
- `ready-for-human` — agent work is done (PR up, CI green); needs human review
  or merge.
- `wontfix` — decided against.
- `bug` — defect in existing behavior.
- `enhancement` — new capability or improvement.

All of the above exist on the repo (`gh label list`). Create any that go
missing with `gh label create <name> --description "..." --color <hex>`.
