#!/usr/bin/env bash

###
# Fetches the BPMN models from the Flowable engine repository
# (https://github.com/flowable/flowable-engine, Apache-2.0) at a pinned
# commit into .flowable-models/, for the load-and-save report
# (npm run roundtrip). See roundtrip/README.md.
#
# Only the BPMN files are downloaded: a partial clone without file
# contents, then a sparse checkout of *.bpmn, *.bpmn20.xml and *.bpmn.xml.
#
# The default commit is the one the extension inventory
# (docs/flowable-bpmn-extensions.md) was taken from. Set
# FLOWABLE_ENGINE_REF to use another commit, branch or tag.
###

set -euo pipefail

cd "$(dirname "$0")/.."

REPO=https://github.com/flowable/flowable-engine.git
REF=${FLOWABLE_ENGINE_REF:-64d64909452d1f97f3cdffe76a8fd24f5ee645e3}
DEST=.flowable-models

if [ ! -d "$DEST/.git" ]; then
  git clone --quiet --filter=blob:none --no-checkout "$REPO" "$DEST"
fi

cd "$DEST"

git sparse-checkout set --no-cone '*.bpmn' '*.bpmn20.xml' '*.bpmn.xml'
git fetch --quiet --filter=blob:none origin "$REF"
git -c advice.detachedHead=false checkout --quiet FETCH_HEAD

COUNT=$(find . -path ./.git -prune -o -type f -print | wc -l | tr -d ' ')

echo "flowable-engine $(git rev-parse --short HEAD): $COUNT BPMN models in $DEST"
