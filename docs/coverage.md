# Coverage matrix

Tracks which Flowable BPMN extensions each package covers. It follows [flowable-bpmn-extensions.md](flowable-bpmn-extensions.md); the section numbers below refer to that inventory.

Each pull request that adds coverage updates the rows it touches: replace `todo` with `done` and the pull request reference, for example `done (jylups/flowable-bpmn-moddle#4)`.

- **Moddle:** typed in `@jylups/flowable-bpmn-moddle`; reads and writes without loss.
- **Panel:** editable in `@jylups/bpmn-js-properties-panel-flowable`.
- **Behaviors / Editor:** only filled where those packages do something specific for the row; see the lists at the end for work that applies across rows.
- `–` means not applicable.

## Common to flow nodes

Inventory section 1. Moddle: [#8](https://github.com/jylups/bpmn-js-env/issues/8). Panel: [#22](https://github.com/jylups/bpmn-js-env/issues/22).

| Extension | Kind | On | Moddle | Panel | Behaviors | Editor |
|---|---|---|---|---|---|---|
| `async` | attribute | flow nodes | done ([jylups/flowable-bpmn-moddle#4](https://github.com/jylups/flowable-bpmn-moddle/pull/4)) | todo [#22](https://github.com/jylups/bpmn-js-env/issues/22) |  |  |
| `exclusive` | attribute | flow nodes | done ([jylups/flowable-bpmn-moddle#4](https://github.com/jylups/flowable-bpmn-moddle/pull/4)) | todo [#22](https://github.com/jylups/bpmn-js-env/issues/22) |  |  |
| `asyncLeave` | attribute | flow nodes | done ([jylups/flowable-bpmn-moddle#4](https://github.com/jylups/flowable-bpmn-moddle/pull/4)) | todo [#22](https://github.com/jylups/bpmn-js-env/issues/22) |  |  |
| `asyncLeaveExclusive` | attribute | flow nodes | done ([jylups/flowable-bpmn-moddle#4](https://github.com/jylups/flowable-bpmn-moddle/pull/4)) | todo [#22](https://github.com/jylups/bpmn-js-env/issues/22) |  |  |
| `failedJobRetryTimeCycle` | element | activities | done ([jylups/flowable-bpmn-moddle#4](https://github.com/jylups/flowable-bpmn-moddle/pull/4)) | todo [#22](https://github.com/jylups/bpmn-js-env/issues/22) |  |  |
| `element-name` | element | flow elements | done ([jylups/flowable-bpmn-moddle#4](https://github.com/jylups/flowable-bpmn-moddle/pull/4)) | todo [#22](https://github.com/jylups/bpmn-js-env/issues/22) |  |  |
| `jobCategory` | element | async activities, timers, external worker | done ([jylups/flowable-bpmn-moddle#4](https://github.com/jylups/flowable-bpmn-moddle/pull/4)) | todo [#22](https://github.com/jylups/bpmn-js-env/issues/22) |  |  |
| `includeInHistory` | element | flow elements | done ([jylups/flowable-bpmn-moddle#4](https://github.com/jylups/flowable-bpmn-moddle/pull/4)) | todo [#22](https://github.com/jylups/bpmn-js-env/issues/22) |  |  |
| localization (locale, name) | element | process, flow elements, data objects | done ([jylups/flowable-bpmn-moddle#4](https://github.com/jylups/flowable-bpmn-moddle/pull/4)) | todo [#31](https://github.com/jylups/bpmn-js-env/issues/31) |  |  |
| localization › documentation | child | localization | done ([jylups/flowable-bpmn-moddle#4](https://github.com/jylups/flowable-bpmn-moddle/pull/4)) | todo [#31](https://github.com/jylups/bpmn-js-env/issues/31) |  |  |

## Listeners, fields and scripts

Inventory section 14. Moddle: [#9](https://github.com/jylups/bpmn-js-env/issues/9). Panel: [#23](https://github.com/jylups/bpmn-js-env/issues/23).

| Extension | Kind | On | Moddle | Panel | Behaviors | Editor |
|---|---|---|---|---|---|---|
| `executionListener` | element | process, flow elements, sequence flows | done ([jylups/flowable-bpmn-moddle#5](https://github.com/jylups/flowable-bpmn-moddle/pull/5)) | todo [#23](https://github.com/jylups/bpmn-js-env/issues/23) |  |  |
| `taskListener` | element | user task | done ([jylups/flowable-bpmn-moddle#5](https://github.com/jylups/flowable-bpmn-moddle/pull/5)) | todo [#23](https://github.com/jylups/bpmn-js-env/issues/23) |  |  |
| listener: event | attribute | execution/task listener | done ([jylups/flowable-bpmn-moddle#5](https://github.com/jylups/flowable-bpmn-moddle/pull/5)) | todo [#23](https://github.com/jylups/bpmn-js-env/issues/23) |  |  |
| listener: class / expression / delegateExpression / type=script | attribute | execution/task listener | done ([jylups/flowable-bpmn-moddle#5](https://github.com/jylups/flowable-bpmn-moddle/pull/5)) | todo [#23](https://github.com/jylups/bpmn-js-env/issues/23) |  |  |
| listener: onTransaction | attribute | execution/task listener | done ([jylups/flowable-bpmn-moddle#5](https://github.com/jylups/flowable-bpmn-moddle/pull/5)) | todo [#23](https://github.com/jylups/bpmn-js-env/issues/23) |  |  |
| listener: customPropertiesResolverClass / Expression / DelegateExpression | attribute | execution/task listener | done ([jylups/flowable-bpmn-moddle#5](https://github.com/jylups/flowable-bpmn-moddle/pull/5)) | todo [#23](https://github.com/jylups/bpmn-js-env/issues/23) |  |  |
| `eventListener` | element | process | done ([jylups/flowable-bpmn-moddle#5](https://github.com/jylups/flowable-bpmn-moddle/pull/5)) | todo [#23](https://github.com/jylups/bpmn-js-env/issues/23) |  |  |
| eventListener: events, entityType | attribute | eventListener | done ([jylups/flowable-bpmn-moddle#5](https://github.com/jylups/flowable-bpmn-moddle/pull/5)) | todo [#23](https://github.com/jylups/bpmn-js-env/issues/23) |  |  |
| eventListener: class / delegateExpression / throwEvent | attribute | eventListener | done ([jylups/flowable-bpmn-moddle#5](https://github.com/jylups/flowable-bpmn-moddle/pull/5)) | todo [#23](https://github.com/jylups/bpmn-js-env/issues/23) |  |  |
| eventListener: signalName / messageName / errorCode | attribute | eventListener | done ([jylups/flowable-bpmn-moddle#5](https://github.com/jylups/flowable-bpmn-moddle/pull/5)) | todo [#23](https://github.com/jylups/bpmn-js-env/issues/23) |  |  |
| eventListener: onTransaction | attribute | eventListener | done ([jylups/flowable-bpmn-moddle#5](https://github.com/jylups/flowable-bpmn-moddle/pull/5)) | todo [#23](https://github.com/jylups/bpmn-js-env/issues/23) |  |  |
| field (name, stringValue, expression) | element | service/send task, listeners, HTTP handlers | done ([jylups/flowable-bpmn-moddle#5](https://github.com/jylups/flowable-bpmn-moddle/pull/5)) | todo [#23](https://github.com/jylups/bpmn-js-env/issues/23) |  |  |
| field › string / expression | child | field | done ([jylups/flowable-bpmn-moddle#5](https://github.com/jylups/flowable-bpmn-moddle/pull/5)) | todo [#23](https://github.com/jylups/bpmn-js-env/issues/23) |  |  |
| script (language, resultVariable, text) | child | script listeners, HTTP handlers | done ([jylups/flowable-bpmn-moddle#5](https://github.com/jylups/flowable-bpmn-moddle/pull/5)) | todo [#23](https://github.com/jylups/bpmn-js-env/issues/23) |  |  |

## Process and start event

Inventory section 2, 3. Moddle: [#10](https://github.com/jylups/bpmn-js-env/issues/10). Panel: [#24](https://github.com/jylups/bpmn-js-env/issues/24).

| Extension | Kind | On | Moddle | Panel | Behaviors | Editor |
|---|---|---|---|---|---|---|
| `candidateStarterUsers` | attribute | process | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |
| `candidateStarterGroups` | attribute | process | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |
| `isEagerExecutionFetching` | attribute | process | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |
| potentialStarter (resourceAssignmentExpression) | element | process | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |
| `historyLevel` | element | process | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |
| `initiator` | attribute | start event | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |
| `formKey` | attribute | start event | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |
| `formFieldValidation` | attribute | start event | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |
| `sameDeployment` | attribute | start event | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |
| `formProperty` | element | start event, user task | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |
| formProperty: id, name, type, expression, variable, default | attribute | formProperty | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |
| formProperty: datePattern, lenientDateParsing | attribute | formProperty | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |
| formProperty: readable, writable, required | attribute | formProperty | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |
| formProperty › value (id, name) | child | formProperty | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |
| in (start event) | element | start event | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#24](https://github.com/jylups/bpmn-js-env/issues/24) |  |  |

## User task

Inventory section 4. Moddle: [#11](https://github.com/jylups/bpmn-js-env/issues/11). Panel: [#25](https://github.com/jylups/bpmn-js-env/issues/25).

| Extension | Kind | On | Moddle | Panel | Behaviors | Editor |
|---|---|---|---|---|---|---|
| `assignee` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) | todo [#35](https://github.com/jylups/bpmn-js-env/issues/35) |  |
| `owner` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) | todo [#35](https://github.com/jylups/bpmn-js-env/issues/35) |  |
| `candidateUsers` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) | todo [#35](https://github.com/jylups/bpmn-js-env/issues/35) |  |
| `candidateGroups` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) | todo [#35](https://github.com/jylups/bpmn-js-env/issues/35) |  |
| `dueDate` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) |  | todo [#44](https://github.com/jylups/bpmn-js-env/issues/44) |
| `businessCalendarName` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) |  |  |
| `category` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) |  |  |
| `formKey` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) |  |  |
| `formFieldValidation` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) |  |  |
| `sameDeployment` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) |  |  |
| `priority` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) |  |  |
| `extensionId` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) |  |  |
| `skipExpression` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) |  |  |
| `taskIdVariableName` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) |  |  |
| `taskCompleterVariableName` | attribute | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) |  |  |
| customResource (name, resourceAssignmentExpression) | element | user task | done ([jylups/flowable-bpmn-moddle#7](https://github.com/jylups/flowable-bpmn-moddle/pull/7)) | todo [#25](https://github.com/jylups/bpmn-js-env/issues/25) |  |  |

## Service task

Inventory section 5. Moddle: [#12](https://github.com/jylups/bpmn-js-env/issues/12). Panel: [#26](https://github.com/jylups/bpmn-js-env/issues/26).

| Extension | Kind | On | Moddle | Panel | Behaviors | Editor |
|---|---|---|---|---|---|---|
| class / expression / delegateExpression | attribute | service task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) | todo [#35](https://github.com/jylups/bpmn-js-env/issues/35) | todo [#44](https://github.com/jylups/bpmn-js-env/issues/44) |
| resultVariableName (alias resultVariable) | attribute | service task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| `useLocalScopeForResultVariable` | attribute | service task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| `storeResultVariableAsTransient` | attribute | service task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| `skipExpression` | attribute | service task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| `extensionId` | attribute | service task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| `triggerable` | attribute | service task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| `type` | attribute | service task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) | todo [#35](https://github.com/jylups/bpmn-js-env/issues/35) | todo [#41](https://github.com/jylups/bpmn-js-env/issues/41), [#42](https://github.com/jylups/bpmn-js-env/issues/42) |
| formKey / formFieldValidation (form-aware service task) | attribute | service task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| mapException (errorCode, includeChildExceptions, rootCause) | element | service task, call activity | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| parallelInSameTransaction (http) | attribute | service task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| httpRequestHandler / httpResponseHandler | element | service task (http) | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| caseDefinitionKey, caseInstanceName (case) | attribute | service task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| businessKey, inheritBusinessKey, inheritVariables (case) | attribute | service task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| sameDeployment, fallbackToDefaultTenant, idVariableName (case) | attribute | service task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| in / out (case) | element | service task | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| topic, doNotIncludeVariables (external-worker) | attribute | service task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| externalWorkerInParameter / externalWorkerOutParameter | element | service task (external-worker) | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| eventType, triggerEventType (send-event) | element | service task (send-event) | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| sendSynchronously (send-event) | element | service task (send-event) | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| eventInParameter / eventOutParameter (send-event) | element | service task (send-event) | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| triggerEventCorrelationParameter (send-event) | element | service task (send-event) | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |
| channelKey / systemChannel (send-event) | element | service task (send-event) | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) |  |  |

## Script, business rule, send and receive tasks

Inventory section 6, 7, 8. Moddle: [#13](https://github.com/jylups/bpmn-js-env/issues/13). Panel: [#27](https://github.com/jylups/bpmn-js-env/issues/27).

| Extension | Kind | On | Moddle | Panel | Behaviors | Editor |
|---|---|---|---|---|---|---|
| resultVariable (alias resultVariableName) | attribute | script task | done ([jylups/flowable-bpmn-moddle#9](https://github.com/jylups/flowable-bpmn-moddle/pull/9)) | todo [#27](https://github.com/jylups/bpmn-js-env/issues/27) |  |  |
| `autoStoreVariables` | attribute | script task | done ([jylups/flowable-bpmn-moddle#9](https://github.com/jylups/flowable-bpmn-moddle/pull/9)) | todo [#27](https://github.com/jylups/bpmn-js-env/issues/27) |  |  |
| `doNotIncludeVariables` | attribute | script task | done ([jylups/flowable-bpmn-moddle#9](https://github.com/jylups/flowable-bpmn-moddle/pull/9)) | todo [#27](https://github.com/jylups/bpmn-js-env/issues/27) |  |  |
| `skipExpression` | attribute | script task | done ([jylups/flowable-bpmn-moddle#9](https://github.com/jylups/flowable-bpmn-moddle/pull/9)) | todo [#27](https://github.com/jylups/bpmn-js-env/issues/27) |  |  |
| in (script task) | element | script task | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#27](https://github.com/jylups/bpmn-js-env/issues/27) |  |  |
| ruleVariablesInput, rules, resultVariable, class, exclude | attribute | business rule task | done ([jylups/flowable-bpmn-moddle#9](https://github.com/jylups/flowable-bpmn-moddle/pull/9)) | todo [#27](https://github.com/jylups/bpmn-js-env/issues/27) |  |  |
| type + field (mail, camel, dmn) | attribute | send task | done ([jylups/flowable-bpmn-moddle#9](https://github.com/jylups/flowable-bpmn-moddle/pull/9)) | todo [#27](https://github.com/jylups/bpmn-js-env/issues/27) |  |  |
| `skipExpression` | attribute | receive task | done ([jylups/flowable-bpmn-moddle#9](https://github.com/jylups/flowable-bpmn-moddle/pull/9)) | todo [#27](https://github.com/jylups/bpmn-js-env/issues/27) |  |  |
| eventType and event registry elements | element | receive task | done ([jylups/flowable-bpmn-moddle#12](https://github.com/jylups/flowable-bpmn-moddle/pull/12)) | todo [#27](https://github.com/jylups/bpmn-js-env/issues/27) |  |  |

## Call activity

Inventory section 9. Moddle: [#14](https://github.com/jylups/bpmn-js-env/issues/14). Panel: [#28](https://github.com/jylups/bpmn-js-env/issues/28).

| Extension | Kind | On | Moddle | Panel | Behaviors | Editor |
|---|---|---|---|---|---|---|
| `calledElementType` | attribute | call activity | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#28](https://github.com/jylups/bpmn-js-env/issues/28) |  | todo [#44](https://github.com/jylups/bpmn-js-env/issues/44) |
| `processInstanceName` | attribute | call activity | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#28](https://github.com/jylups/bpmn-js-env/issues/28) |  |  |
| businessKey, inheritBusinessKey | attribute | call activity | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#28](https://github.com/jylups/bpmn-js-env/issues/28) |  |  |
| `inheritVariables` | attribute | call activity | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#28](https://github.com/jylups/bpmn-js-env/issues/28) |  |  |
| sameDeployment (legacy calledElementBinding) | attribute | call activity | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#28](https://github.com/jylups/bpmn-js-env/issues/28) |  |  |
| `useLocalScopeForOutParameters` | attribute | call activity | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#28](https://github.com/jylups/bpmn-js-env/issues/28) |  |  |
| `completeAsync` | attribute | call activity | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#28](https://github.com/jylups/bpmn-js-env/issues/28) |  |  |
| `fallbackToDefaultTenant` | attribute | call activity | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#28](https://github.com/jylups/bpmn-js-env/issues/28) |  |  |
| `idVariableName` | attribute | call activity | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#28](https://github.com/jylups/bpmn-js-env/issues/28) |  |  |
| in / out | element | call activity | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#28](https://github.com/jylups/bpmn-js-env/issues/28) |  |  |
| in/out: source, sourceExpression, target, targetExpression | attribute | in/out | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#28](https://github.com/jylups/bpmn-js-env/issues/28) |  |  |
| in/out: sourceType, targetType, transient | attribute | in/out | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#28](https://github.com/jylups/bpmn-js-env/issues/28) |  |  |
| in/out: variables="all", local, businessKey (Activiti 5) | attribute | in/out | done ([jylups/flowable-bpmn-moddle#10](https://github.com/jylups/flowable-bpmn-moddle/pull/10)) | todo [#28](https://github.com/jylups/bpmn-js-env/issues/28) |  |  |

## Multi-instance

Inventory section 10. Moddle: [#15](https://github.com/jylups/bpmn-js-env/issues/15). Panel: [#29](https://github.com/jylups/bpmn-js-env/issues/29).

| Extension | Kind | On | Moddle | Panel | Behaviors | Editor |
|---|---|---|---|---|---|---|
| `collection` | attribute | multiInstanceLoopCharacteristics | done ([jylups/flowable-bpmn-moddle#11](https://github.com/jylups/flowable-bpmn-moddle/pull/11)) | todo [#29](https://github.com/jylups/bpmn-js-env/issues/29) |  |  |
| `elementVariable` | attribute | multiInstanceLoopCharacteristics | done ([jylups/flowable-bpmn-moddle#11](https://github.com/jylups/flowable-bpmn-moddle/pull/11)) | todo [#29](https://github.com/jylups/bpmn-js-env/issues/29) |  |  |
| `elementIndexVariable` | attribute | multiInstanceLoopCharacteristics | done ([jylups/flowable-bpmn-moddle#11](https://github.com/jylups/flowable-bpmn-moddle/pull/11)) | todo [#29](https://github.com/jylups/bpmn-js-env/issues/29) |  |  |
| `noWaitStatesAsyncLeave` | attribute | multiInstanceLoopCharacteristics | done ([jylups/flowable-bpmn-moddle#11](https://github.com/jylups/flowable-bpmn-moddle/pull/11)) | todo [#29](https://github.com/jylups/bpmn-js-env/issues/29) |  |  |
| collection (class, delegateExpression) | element | multiInstanceLoopCharacteristics | done ([jylups/flowable-bpmn-moddle#11](https://github.com/jylups/flowable-bpmn-moddle/pull/11)) | todo [#29](https://github.com/jylups/bpmn-js-env/issues/29) |  |  |
| collection › string / expression | child | collection | done ([jylups/flowable-bpmn-moddle#11](https://github.com/jylups/flowable-bpmn-moddle/pull/11)) | todo [#29](https://github.com/jylups/bpmn-js-env/issues/29) |  |  |
| `variableAggregation` | element | multiInstanceLoopCharacteristics | done ([jylups/flowable-bpmn-moddle#11](https://github.com/jylups/flowable-bpmn-moddle/pull/11)) | todo [#29](https://github.com/jylups/bpmn-js-env/issues/29) |  |  |
| variableAggregation: target, targetExpression, storeAsTransientVariable, createOverviewVariable, class, delegateExpression | attribute | variableAggregation | done ([jylups/flowable-bpmn-moddle#11](https://github.com/jylups/flowable-bpmn-moddle/pull/11)) | todo [#29](https://github.com/jylups/bpmn-js-env/issues/29) |  |  |
| variableAggregation › variable (source, sourceExpression, target, targetExpression; written unprefixed) | child | variableAggregation | done ([jylups/flowable-bpmn-moddle#11](https://github.com/jylups/flowable-bpmn-moddle/pull/11)) | todo [#29](https://github.com/jylups/bpmn-js-env/issues/29) |  |  |

## Events and event definitions

Inventory section 11, 12. Moddle: [#16](https://github.com/jylups/bpmn-js-env/issues/16). Panel: [#30](https://github.com/jylups/bpmn-js-env/issues/30).

| Extension | Kind | On | Moddle | Panel | Behaviors | Editor |
|---|---|---|---|---|---|---|
| `businessCalendarName` | attribute | timerEventDefinition | done ([jylups/flowable-bpmn-moddle#12](https://github.com/jylups/flowable-bpmn-moddle/pull/12)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |
| `endDate` | attribute | timeCycle | done ([jylups/flowable-bpmn-moddle#12](https://github.com/jylups/flowable-bpmn-moddle/pull/12)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |
| `signalExpression` | attribute | signalEventDefinition | done ([jylups/flowable-bpmn-moddle#12](https://github.com/jylups/flowable-bpmn-moddle/pull/12)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |
| `async` | attribute | signalEventDefinition (throw) | done ([jylups/flowable-bpmn-moddle#12](https://github.com/jylups/flowable-bpmn-moddle/pull/12)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |
| `messageExpression` | attribute | messageEventDefinition | done ([jylups/flowable-bpmn-moddle#12](https://github.com/jylups/flowable-bpmn-moddle/pull/12)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |
| errorVariableName, errorVariableTransient, errorVariableLocalScope | attribute | errorEventDefinition | done ([jylups/flowable-bpmn-moddle#12](https://github.com/jylups/flowable-bpmn-moddle/pull/12)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |
| terminateAll, terminateMultiInstance | attribute | terminateEventDefinition | done ([jylups/flowable-bpmn-moddle#12](https://github.com/jylups/flowable-bpmn-moddle/pull/12)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |
| variableListenerEventDefinition (variableName, variableChangeType) | element | start (event sub-process), boundary, catch events | done ([jylups/flowable-bpmn-moddle#12](https://github.com/jylups/flowable-bpmn-moddle/pull/12)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |
| `in` | element | boundary and intermediate catch events | done ([jylups/flowable-bpmn-moddle#12](https://github.com/jylups/flowable-bpmn-moddle/pull/12)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |
| `out` | element | end event, intermediate throw event | done ([jylups/flowable-bpmn-moddle#12](https://github.com/jylups/flowable-bpmn-moddle/pull/12)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |
| `eventType` | element | catch events, receive task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |
| `eventName` | element | catch events | done ([jylups/flowable-bpmn-moddle#12](https://github.com/jylups/flowable-bpmn-moddle/pull/12)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |
| eventCorrelationParameter (name, value) | element | catch events, receive task | done ([jylups/flowable-bpmn-moddle#12](https://github.com/jylups/flowable-bpmn-moddle/pull/12)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |
| eventOutParameter (source, target, sourceType, transient) | element | catch events, receive task | done ([jylups/flowable-bpmn-moddle#8](https://github.com/jylups/flowable-bpmn-moddle/pull/8)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |
| `startEventCorrelationConfiguration` | element | start event | done ([jylups/flowable-bpmn-moddle#12](https://github.com/jylups/flowable-bpmn-moddle/pull/12)) | todo [#30](https://github.com/jylups/bpmn-js-env/issues/30) |  |  |

## Data objects, signals, sequence flows and DI

Inventory section 10. Moddle: [#17](https://github.com/jylups/bpmn-js-env/issues/17). Panel: [#31](https://github.com/jylups/bpmn-js-env/issues/31).

| Extension | Kind | On | Moddle | Panel | Behaviors | Editor |
|---|---|---|---|---|---|---|
| `value` | element | dataObject | done ([jylups/flowable-bpmn-moddle#6](https://github.com/jylups/flowable-bpmn-moddle/pull/6)) | todo [#31](https://github.com/jylups/bpmn-js-env/issues/31) |  |  |
| itemSubjectRef types (string, int, long, double, boolean, datetime, json) | attribute | dataObject | todo [#17](https://github.com/jylups/bpmn-js-env/issues/17) | todo [#31](https://github.com/jylups/bpmn-js-env/issues/31) |  |  |
| scope (global, processInstance) | attribute | signal | todo [#17](https://github.com/jylups/bpmn-js-env/issues/17) | todo [#31](https://github.com/jylups/bpmn-js-env/issues/31) |  |  |
| skipExpression (written unprefixed) | attribute | sequence flow | todo [#17](https://github.com/jylups/bpmn-js-env/issues/17) | todo [#31](https://github.com/jylups/bpmn-js-env/issues/31) |  |  |
| sourceDockerX/Y, targetDockerX/Y | attribute | bpmndi:BPMNEdge | todo [#17](https://github.com/jylups/bpmn-js-env/issues/17) | – |  | – |
| `rotation` | attribute | bpmndi:BPMNLabel | todo [#17](https://github.com/jylups/bpmn-js-env/issues/17) | – |  | – |

## Aliases and legacy forms

Inventory section Parsing rules, 13. Moddle: [#18](https://github.com/jylups/bpmn-js-env/issues/18). Panel: shown through the regular entries, nothing extra.

| Extension | Kind | On | Moddle | Panel | Behaviors | Editor |
|---|---|---|---|---|---|---|
| activiti: and camunda: spellings of (F) attributes | attribute | everywhere | todo [#18](https://github.com/jylups/bpmn-js-env/issues/18) | – |  |  |
| unprefixed attributes (listener, field, formProperty, in/out sub-attributes) | attribute | everywhere | todo [#18](https://github.com/jylups/bpmn-js-env/issues/18) | – |  |  |
| camunda:asyncBefore / asyncAfter | attribute | flow nodes | todo [#18](https://github.com/jylups/bpmn-js-env/issues/18) | – |  |  |
| type="external" (alias of external-worker) | attribute | service task | todo [#18](https://github.com/jylups/bpmn-js-env/issues/18) | – |  |  |
| calledElementBinding="deployment" | attribute | call activity | todo [#18](https://github.com/jylups/bpmn-js-env/issues/18) | – |  |  |

## Service task type fields

These are `field` children (section 5); the moddle covers them through `field`. The panel gives each type its own field group ([#26](https://github.com/jylups/bpmn-js-env/issues/26)).

| Type | Fields | Panel | Editor |
|---|---|---|---|
| mail | to, from, cc, bcc, headers, subject, text, textVar, html, htmlVar, charset, ignoreException, exceptionVariableName, attachments | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) | todo [#41](https://github.com/jylups/bpmn-js-env/issues/41), [#42](https://github.com/jylups/bpmn-js-env/issues/42) |
| http | requestMethod, requestUrl, requestHeaders, requestSecureHeaders, requestBody, requestBodyEncoding, requestTimeout, disallowRedirects, failStatusCodes, handleStatusCodes, ignoreException, saveRequestVariables, saveResponseParameters, responseVariableName, saveResponseParametersTransient, saveResponseVariableAsJson, resultVariablePrefix, httpActivityBehaviorClass | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) | todo [#41](https://github.com/jylups/bpmn-js-env/issues/41), [#42](https://github.com/jylups/bpmn-js-env/issues/42) |
| shell | command, wait, arg1–arg5, outputVariable, errorCodeVariable, redirectError, cleanEnv, directory | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) | todo [#41](https://github.com/jylups/bpmn-js-env/issues/41), [#42](https://github.com/jylups/bpmn-js-env/issues/42) |
| camel | camelContext, camelBehaviorClass | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) | todo [#41](https://github.com/jylups/bpmn-js-env/issues/41), [#42](https://github.com/jylups/bpmn-js-env/issues/42) |
| dmn | decisionTableReferenceKey, decisionTaskThrowErrorOnNoHits, fallbackToDefaultTenant, sameDeployment | todo [#26](https://github.com/jylups/bpmn-js-env/issues/26) | todo [#41](https://github.com/jylups/bpmn-js-env/issues/41), [#42](https://github.com/jylups/bpmn-js-env/issues/42) |

## Behaviors that apply across rows

- [ ] [#35](https://github.com/jylups/bpmn-js-env/issues/35): Clean up Flowable properties when an element's type is replaced (for example assignment when a user task becomes a service task, implementation when `type` changes)
- [ ] [#36](https://github.com/jylups/bpmn-js-env/issues/36): Create `extensionElements` when needed; remove empty containers and lists
- [ ] [#37](https://github.com/jylups/bpmn-js-env/issues/37): Update error, signal and message references when IDs change; copy and paste Flowable properties

## Editor work that applies across rows

- [ ] [#41](https://github.com/jylups/bpmn-js-env/issues/41): Palette and replace menu entries for the typed service tasks (mail, http, shell, camel, dmn, case, send-event, external-worker)
- [ ] [#42](https://github.com/jylups/bpmn-js-env/issues/42): Renderer icons for the typed service tasks
- [ ] [#44](https://github.com/jylups/bpmn-js-env/issues/44): Lint rules: missing service task implementation, invalid durations (due date, timers, retry cycle), missing called element
