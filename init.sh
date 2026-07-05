#!/usr/bin/env bash
# Harness verification gate. Green exit = safe baseline to build on.
# Run at session start and before claiming done.
set -uo pipefail

failed=0

step() {
  local name="$1"; shift
  echo "=== $name ==="
  if "$@"; then
    echo "--- $name: OK"
  else
    echo "--- $name: FAILED (exit $?)"
    failed=1
  fi
}

# No lint step: this project has no eslint/lint tooling configured.
step "install"   bash -c 'npm install'
step "typecheck" bash -c 'npm run typecheck'
step "test"      bash -c 'npm test -- --watch=false'
step "build"     bash -c 'npm run build'

if [ "$failed" -ne 0 ]; then
  echo "init.sh: VERIFICATION FAILED — do not build on this baseline"
  exit 1
fi
echo "init.sh: all verification green"
