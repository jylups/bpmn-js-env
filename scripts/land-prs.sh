#!/usr/bin/env bash

###
# Lands a package pull request and the bpmn-js-env pull request that goes
# with it, in order, each only after its CI passes:
#
#   1. wait for CI on the package PR's branch, then merge the package PR
#   2. push the bpmn-js-env branch (same name) and open its PR
#   3. wait for CI on it (which checks out the package's main), then merge
#
# It can be run again after an interruption: a merged package PR is skipped,
# an open bpmn-js-env PR is reused, and a finished CI run is read instead of
# watched.
#
# Usage (from a bpmn-js-env checkout, on the branch to push):
#
#   scripts/land-prs.sh <package-repo> <package-pr> <branch> <env-pr-title> <env-pr-body-file>
#
# Example:
#
#   scripts/land-prs.sh flowable-bpmn-moddle 16 feature/65-unknown-elements \
#     "Keep unknown flowable:* elements" /path/to/body.md
###

set -uo pipefail

OWNER=jylups
PACKAGE_REPO=$OWNER/$1 PACKAGE_PR=$2 BRANCH=$3 TITLE=$4 BODY=$5
ENV_REPO=$OWNER/bpmn-js-env

cd "$(dirname "$0")/.."

# waits for the latest CI run on a branch and returns its success
wait_ci() {
  local repo=$1 branch=$2 run=""

  for _ in $(seq 1 40); do
    run=$(gh run list --repo "$repo" --branch "$branch" --workflow ci.yml --limit 1 --json databaseId --jq '.[0].databaseId // empty')
    [ -n "$run" ] && break
    sleep 3
  done

  if [ -z "$run" ]; then
    echo "no CI run found for $repo $branch"
    return 1
  fi

  gh run watch "$run" --repo "$repo" --exit-status --interval 15 >/dev/null 2>&1
  local rc=$?

  echo "$repo run $run: $(gh run view "$run" --repo "$repo" --json conclusion --jq .conclusion)"

  return $rc
}

merge() {
  local repo=$1 pr=$2

  gh pr merge "$pr" --repo "$repo" --merge --delete-branch >/dev/null 2>&1
  echo "$repo#$pr: $(gh pr view "$pr" --repo "$repo" --json state,mergeCommit --jq '"\(.state) \(.mergeCommit.oid[0:7] // "")"')"
}

# 1. the package PR
state=$(gh pr view "$PACKAGE_PR" --repo "$PACKAGE_REPO" --json state --jq .state)

if [ "$state" = MERGED ]; then
  echo "$PACKAGE_REPO#$PACKAGE_PR already merged"
else
  wait_ci "$PACKAGE_REPO" "$BRANCH" || { echo "package CI failed; stopping"; exit 1; }
  merge "$PACKAGE_REPO" "$PACKAGE_PR"
fi

# 2. the bpmn-js-env PR
ENV_PR=$(gh pr list --repo "$ENV_REPO" --head "$BRANCH" --state all --json number,state --jq '.[0] | select(.state != "CLOSED") | .number')

if [ -z "$ENV_PR" ]; then
  git push -q -u origin "$BRANCH" 2>/dev/null
  gh pr create --repo "$ENV_REPO" --base main --head "$BRANCH" --title "$TITLE" --body-file "$BODY" >/dev/null 2>&1
  ENV_PR=$(gh pr list --repo "$ENV_REPO" --head "$BRANCH" --json number --jq '.[0].number')
  [ -z "$ENV_PR" ] && { echo "bpmn-js-env PR was not created"; exit 1; }
  echo "bpmn-js-env PR #$ENV_PR opened"
fi

if [ "$(gh pr view "$ENV_PR" --repo "$ENV_REPO" --json state --jq .state)" = MERGED ]; then
  echo "$ENV_REPO#$ENV_PR already merged"
  exit 0
fi

# 3. CI on the bpmn-js-env PR, then merge
wait_ci "$ENV_REPO" "$BRANCH" || { echo "bpmn-js-env CI failed; PR #$ENV_PR left open"; exit 1; }
merge "$ENV_REPO" "$ENV_PR"
