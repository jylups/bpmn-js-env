#!/usr/bin/env bash

###
# Sets up the Flowable BPMN development workspace.
#
# Run it from the root of a bpmn-js-env checkout. It clones the package
# repositories next to this script (skipping any that already exist) and
# installs everything with npm workspaces, so the packages and the
# playground use each other's local sources instead of published versions.
###

set -euo pipefail

cd "$(dirname "$0")"

clone() {
  local repo=$1 branch=$2

  if [ -d "$repo/.git" ]; then
    echo "$repo already cloned (on branch $(git -C "$repo" branch --show-current)), skipping"
  else
    git clone --branch "$branch" "git@github.com:jylups/$repo.git"
  fi
}

echo "cloning repositories"

clone flowable-bpmn-moddle main
clone bpmn-js-properties-panel-flowable main
clone flowable-bpmn-js-behaviors main
clone flowable-bpmn-js main

echo "installing workspace dependencies"

npm install

echo "all done. start the playground with: npm run dev"
