# Working conventions

This file is for anyone, person or tool, who works on the Flowable BPMN editor packages. Read it before starting a task.

## Source of truth

GitHub is the only source of truth for this work: the repositories, their issues and the project board. Plans, decisions, inventories and conventions go into this repository (`docs/`, this file) or into issues. Nothing should exist only in a local folder or on one computer.

## Goal

A usable BPMN editor with Flowable's BPMN extensions (`xmlns:flowable="http://flowable.org/bpmn"`), built on the maintained upstream bpmn.io packages: `bpmn-js`, `bpmn-moddle`, `diagram-js`, `bpmn-js-properties-panel` 5.x and `@bpmn-io/properties-panel`. We do not fork them.

## Repositories and packages

| Repository | npm package | Contents |
|---|---|---|
| [jylups/bpmn-js-env](https://github.com/jylups/bpmn-js-env) | none | npm workspace, playground, docs, and the issue tracker for every package |
| [jylups/flowable-bpmn-moddle](https://github.com/jylups/flowable-bpmn-moddle) | `@jylups/flowable-bpmn-moddle` | moddle descriptor for the `flowable:` extensions |
| [jylups/bpmn-js-properties-panel-flowable](https://github.com/jylups/bpmn-js-properties-panel-flowable) | `@jylups/bpmn-js-properties-panel-flowable` | Flowable properties provider for bpmn-js-properties-panel |
| [jylups/flowable-bpmn-js-behaviors](https://github.com/jylups/flowable-bpmn-js-behaviors) | `@jylups/flowable-bpmn-js-behaviors` | modeling behaviors that keep Flowable data consistent |
| [jylups/flowable-bpmn-js](https://github.com/jylups/flowable-bpmn-js) | `@jylups/flowable-bpmn-js` | modeler and viewer with all of the above; the package apps import |

All packages use the `@jylups/` scope: the unscoped names are taken on npm by other publishers.

## Planning and tracking

- Board: GitHub project [BPMN Flowable](https://github.com/users/jylups/projects/4) (project 4). Status: Backlog, Ready, In progress, In review, Done.
- Issues live in this repository only, for all packages. Each phase is a parent issue with sub-issues:
  - Phase 0, workspace and release pipeline: #1
  - Phase 1, moddle descriptor: #7
  - Phase 2, properties panel: #20
  - Phase 3, modeling behaviors: #33
  - Phase 4, editor distribution: #39
- New issues are added to project 4 with status Backlog. Set In progress when work starts and check that the board shows Done when an issue closes.
- In comments and pull requests, refer to issues in other repositories with full references (`jylups/repo#N`).

## Scope

- First the extensions the open-source Flowable engine reads, as listed in [docs/flowable-bpmn-extensions.md](docs/flowable-bpmn-extensions.md). That inventory comes from flowable/flowable-engine `main` at 64d64909.
- Flowable Work/Design-only properties come in a later phase.
- Read `activiti:` spellings by importing through `migrateActivitiXML` and `useFlowablePrefix` from `@jylups/flowable-bpmn-moddle`; they are then written as `flowable:`. The few `camunda:` spellings Flowable accepts (3 corpus models) stay generic content.
- Import models through `registerUnknownFlowableElements` (keeps unknown `flowable:*` elements). References by code or name are kept by creating the missing definitions on import in the behaviors package (#67, decided in #62).
- [docs/coverage.md](docs/coverage.md) tracks which package covers each extension. A pull request that adds coverage updates the rows it touches in the same change.
- The load-and-save report ([roundtrip/README.md](roundtrip/README.md)) runs over the Flowable engine's 3,265 BPMN models in CI. A pull request that fixes a known difference removes it from `roundtrip/known-losses.json`; a new kind of difference fails CI until it is fixed or listed with its issue.

## Branches, commits and pull requests

- Branch names: `feature/<issue>-<short-slug>`, for example `feature/12-user-task`.
- Bundle work into as few pull requests as possible. Make a separate pull request only when another repository or a release has to come first.
- Pull requests are opened and merged without waiting for a review; report each pull request link and what was merged in the issue.
- A change to a package usually comes with a bpmn-js-env change (coverage, baselines). Land them in that order with `scripts/land-prs.sh <package-repo> <package-pr> <branch> <title> <body-file>`: it merges the package PR after its CI, then opens and merges the bpmn-js-env PR after its CI, and can be run again after an interruption.
- The properties panel README screenshots come from the running playground (`npm run dev`): `node scripts/panel-screenshots.js` writes them to `bpmn-js-properties-panel-flowable/docs/screenshots`. It uses the local Chrome; set `PLAYWRIGHT_CHANNEL=` for Playwright's Chromium.
- No AI tool, model or vendor attribution anywhere: commits (no co-author trailers), pull requests, issues, comments or docs.

## Packages and tests

- Each package is plain ES modules (`"type": "module"`, `exports`), published without a build step unless it needs a browser bundle.
- Upstream bpmn.io packages are peer dependencies of the extension packages and regular dependencies of `@jylups/flowable-bpmn-js`.
- Tests use Vitest: Node for `@jylups/flowable-bpmn-moddle`, browser mode (Playwright, headless Chromium) for the others. `TEST_BROWSER_CHANNEL=chrome` uses an installed Google Chrome instead of Playwright's Chromium.
- Each package repository keeps its own `package-lock.json` for CI, generated outside the workspace with `npm install --package-lock-only --ignore-scripts`.

## Releases

- Packages are published from GitHub releases with npm trusted publishing (OIDC); no npm tokens are stored.
- Prereleases (`x.y.z-next.N`) go to the `next` tag, stable releases to `latest`.
- After a release, verify the package on npm (`npm view <pkg> --prefer-online`) and unpack the tarball to check its contents.
- Release flow: branch `release/<version>` with the version bump, a GitHub release tagged `v<version>` (marked as prerelease for `-next.N` versions), then a pull request that brings the version back to `main`.
- CI: every package repository runs `ci.yml` (lint and tests on Node 24 and 26) and `publish.yml` (on published releases). This repository's `ci.yml` installs all packages together and lints, tests and builds the workspace.
- First publish of a new package: npm only accepts a trusted publisher for a package that already exists, and an unused trusted publisher expires after 2 days. So, shortly before a package's first real release:
  1. The maintainer publishes version 0.0.0 once from their own machine with Node 26 (`npm publish --access public` in the package folder). npm may handle this as a staged publish: it first creates a `0.0.0-stage` placeholder, and 0.0.0 appears once the maintainer approves it (2FA).
  2. Add the trusted publisher, either with the CLI (`npm trust github @jylups/<repo> --file publish.yml --repo jylups/<repo> --allow-publish --allow-stage-publish --yes`) or on npmjs.com (package settings, GitHub Actions: user `jylups`, repository `<repo>`, workflow `publish.yml`, no environment). Check it with `npm trust list @jylups/<repo>`.
  3. Release a prerelease through GitHub within 2 days, and verify it with `npm view @jylups/<repo> dist-tags` and `npm audit signatures`. npm can take a minute or two to list a new version.
- Trusted publishing is set up for `@jylups/flowable-bpmn-moddle` (first CI release: 0.0.1-next.0) and `@jylups/bpmn-js-properties-panel-flowable` (first CI release: 0.1.0-next.0). The other packages get it before their first release.
- `npm trust` needs npm 11 (Node 26); with an older default Node, run `nvm use` in the workspace first.
- Main branches are protected by a "Main Branch" ruleset (no deletion, no force push); normal pull request merges need no bypass.

## Constraints

- The bpmn-js licence requires the bpmn.io watermark to stay visible. Do not remove or cover it.
- The CMMN packages (jylups/cmmn-js-env and its package repos) are reference only for this work. Do not change them from here; their own work is tracked on GitHub project 3.
- Original artwork only: no icons or CSS copied from Flowable products.
- Node 26 (see `.nvmrc`). Set up a checkout with `./setup.sh` and run the playground with `npm run dev` (see the README).

## Related work

- Conscia Modeler ([Conscia-LLC/conscia-modeler](https://github.com/Conscia-LLC/conscia-modeler)) is the first app to consume `@jylups/flowable-bpmn-js`, for `.bpmn` and `.bpmn20.xml` files. That integration is planned on the Conscia-LLC board (project 3), not here.
- The CMMN editor packages (jylups/cmmn-js-env) follow the same workspace and release patterns and are a good reference.
