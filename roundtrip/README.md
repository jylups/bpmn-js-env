# Load-and-save report

Checks that reading and writing real Flowable BPMN models with bpmn-moddle and the Flowable descriptor (`flowable-bpmn-moddle/resources/flowable.json` in this workspace) loses nothing. Models are imported the way the editor imports them: unknown `flowable:*` elements are kept through `registerUnknownFlowableElements`, and references by code or name get their definitions through `createMissingDefinitions` (#67).

## Corpus

- **Flowable engine models:** every `*.bpmn`, `*.bpmn20.xml` and `*.bpmn.xml` file of [flowable/flowable-engine](https://github.com/flowable/flowable-engine) at commit `64d64909452d1f97f3cdffe76a8fd24f5ee645e3`, the commit the [extension inventory](../docs/flowable-bpmn-extensions.md) comes from. That is 3,265 models. They are not copied into this repository: `npm run roundtrip:fetch` downloads them into `.flowable-models/` (gitignored) with a sparse, partial clone. The models are © the Flowable project and its contributors, under the [Apache License 2.0](https://github.com/flowable/flowable-engine/blob/main/LICENSE).
- **Samples** in [samples/](samples/), written for this project, for cases the engine's test models don't show. [flowable-export-style.bpmn20.xml](samples/flowable-export-style.bpmn20.xml) is written the way Flowable's own exporter writes models: an unprefixed `skipExpression` on a sequence flow, unprefixed listener, field and in/out sub-attributes, CDATA field values, an unprefixed `<variable>` in a variable aggregation, a data object value, a signal scope, and the DI docker and rotation attributes.

The report counts how many models use each inventory area, so it shows that every area is exercised. At this commit, every inventory area has at least 5 models, 2,109 models use the Activiti namespace, and the sample adds the unprefixed export style.

## Running it

From the workspace root:

```sh
npm run roundtrip:fetch   # once, or after changing the pinned commit
npm run roundtrip
```

The report goes to `roundtrip-report.md` (summary) and `roundtrip-report.json` (every file), both gitignored. In CI it is also shown in the job summary and uploaded as an artifact.

The original and saved XML are compared as namespace-resolved trees. Namespace prefixes, element order, whitespace, CDATA and number formatting don't count as differences.

## Activiti namespace

2,109 of the corpus models use the Activiti namespace (`http://activiti.org/bpmn`), which Flowable still reads. The descriptor only registers the Flowable namespace, so a plain import keeps their `activiti:` content as untyped generic XML. The moddle package exports two helpers that move a model to the Flowable namespace, so that everything is typed and written as `flowable:`:

- `migrateActivitiXML(xml)` rewrites Activiti namespace declarations to the Flowable namespace before import. Only `xmlns` declarations change.
- `useFlowablePrefix(definitions)` removes other prefixes bound to the Flowable namespace after import, so the writer uses `flowable:`.

`npm run roundtrip -- --migrate-activiti` runs the report that way. It compares the two namespaces as one and uses its own baseline, [known-losses-migrated.json](known-losses-migrated.json). CI runs both modes.

## Known differences

[known-losses.json](known-losses.json) (and [known-losses-migrated.json](known-losses-migrated.json) for the migrated mode) lists every kind of difference that is expected, each with the issue that tracks it and a note. The report exits with an error when it finds a kind that isn't listed, so a regression fails CI.

- **Phase 1 gaps:** `flowable:*` elements are dropped while the descriptor has no type for them, because bpmn-moddle drops unknown elements of a registered namespace. They point at the moddle sub-issue that adds the type.
- **Accepted:** intentionally invalid test models, and references to IDs that no element in the file has. These point at [#6](https://github.com/jylups/bpmn-js-env/issues/6).
- **Expected additions:** references that Flowable resolves by code or name (`errorRef`, `messageRef`, `signalRef`, `escalationRef`) get the definition Flowable reads them as, through `createMissingDefinitions` from the behaviors package (#67), as the editor does on import. The report lists the added definitions, and the references that now point at an existing definition or a generated ID, with the same Flowable meaning.

When a change fixes a kind of difference, the report lists it under "No longer found". Remove it from the baseline in the same pull request, and update [docs/coverage.md](../docs/coverage.md). `npm run roundtrip -- --update-baseline` rewrites the baseline from the current report: it keeps the notes of entries that are still found, and new entries get an empty note to fill in.
