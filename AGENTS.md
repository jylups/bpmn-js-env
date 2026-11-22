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
- Read `activiti:` and `camunda:` spellings where the engine accepts them; always write `flowable:`.

## Branches, commits and pull requests

- Branch names: `feature/<issue>-<short-slug>`, for example `feature/12-user-task`.
- Bundle work into as few pull requests as possible. Make a separate pull request only when another repository or a release has to come first.
- Pull requests are opened and merged without waiting for a review; report each pull request link and what was merged in the issue.
- No AI tool, model or vendor attribution anywhere: commits (no co-author trailers), pull requests, issues, comments or docs.

## Releases

- Packages are published from GitHub releases with npm trusted publishing (OIDC); no npm tokens are stored.
- Prereleases (`x.y.z-next.N`) go to the `next` tag, stable releases to `latest`.
- After a release, verify the package on npm (`npm view <pkg> --prefer-online`) and unpack the tarball to check its contents.

## Constraints

- The bpmn-js licence requires the bpmn.io watermark to stay visible. Do not remove or cover it.
- The CMMN packages (jylups/cmmn-js-env and its package repos) are reference only for this work. Do not change them from here; their own work is tracked on GitHub project 3.
- Original artwork only: no icons or CSS copied from Flowable products.
- Node 26 (see `.nvmrc`). Set up a checkout with `./setup.sh` and run the playground with `npm run dev` (see the README).

## Related work

- Conscia Modeler ([Conscia-LLC/conscia-modeler](https://github.com/Conscia-LLC/conscia-modeler)) is the first app to consume `@jylups/flowable-bpmn-js`, for `.bpmn` and `.bpmn20.xml` files. That integration is planned on the Conscia-LLC board (project 3), not here.
- The CMMN editor packages (jylups/cmmn-js-env) follow the same workspace and release patterns and are a good reference.
