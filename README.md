# bpmn-js-env

Development workspace and issue tracker for the Flowable BPMN editor packages: moddle descriptor, properties panel, modeling behaviors and editor, built on the upstream bpmn.io packages.

- Working conventions, repositories and planning: [AGENTS.md](AGENTS.md)
- Flowable BPMN extension inventory: [docs/flowable-bpmn-extensions.md](docs/flowable-bpmn-extensions.md)
- Board: [BPMN Flowable](https://github.com/users/jylups/projects/4)

## Setup

You need Node 26 (see `.nvmrc`; with nvm, run `nvm use`) and SSH access to GitHub.

```sh
git clone git@github.com:jylups/bpmn-js-env.git
cd bpmn-js-env
nvm use
./setup.sh
```

`setup.sh` clones the four package repositories into this folder (they are gitignored here) and runs `npm install`. npm workspaces then link them, so the playground and the packages use each other's local sources. A package folder without a `package.json` is skipped until its scaffold exists.

| Folder | Repository |
|---|---|
| `flowable-bpmn-moddle/` | [jylups/flowable-bpmn-moddle](https://github.com/jylups/flowable-bpmn-moddle) |
| `bpmn-js-properties-panel-flowable/` | [jylups/bpmn-js-properties-panel-flowable](https://github.com/jylups/bpmn-js-properties-panel-flowable) |
| `flowable-bpmn-js-behaviors/` | [jylups/flowable-bpmn-js-behaviors](https://github.com/jylups/flowable-bpmn-js-behaviors) |
| `flowable-bpmn-js/` | [jylups/flowable-bpmn-js](https://github.com/jylups/flowable-bpmn-js) |
| `playground/` | this repository |

## Scripts

Run them from the workspace root:

| Command | What it does |
|---|---|
| `npm run dev` | starts the playground at http://localhost:5180 |
| `npm run build` | builds every workspace that has a `build` script |
| `npm run lint` | lints every workspace |
| `npm test` | runs the tests of every workspace |

## Playground

The playground (Vite) loads bpmn-js with the bpmn.io properties panel:

- Viewer and modeler modes.
- Sample diagrams, a new empty diagram, and opening `.bpmn`, `.bpmn20.xml` or `.xml` files from the file picker or by drag and drop.
- An exported XML pane that follows every change, and an "Import XML from editor" button to load edited XML.
- A Problems tab with the import warnings. Click a warning to select its element.
- Download of the current XML. The state is kept in session storage across reloads.
- `window.bpmnPlayground` gives access to the current instance, the problems, `importXML(xml)` and `exportXML()` from the browser console.

The Flowable moddle, properties provider and behaviors are wired in as their packages land (#7, #20, #33). Until then, `flowable:` attributes and extension elements are kept as unknown content, and attributes without a namespace, such as `skipExpression` on sequence flows, show up as import warnings.
