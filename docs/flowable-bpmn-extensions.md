# Flowable BPMN extension inventory (`xmlns:flowable="http://flowable.org/bpmn"`)

**Source.** [flowable/flowable-engine](https://github.com/flowable/flowable-engine) `main` at commit 64d64909 (2026-11-19). Read-only review of the converter and engine sources; citations are paths in that repository.

**Path abbreviations used in citations:**
- `C/` = `modules/flowable-bpmn-converter/src/main/java/org/flowable/bpmn/converter/`
- `K` = `C/../constants/BpmnXMLConstants.java`
- `E/` = `modules/flowable-engine/src/main/java/org/flowable/engine/impl/`

### Parsing rules that matter for a moddle descriptor
1. **Activiti and Camunda aliases.** Prefixed attributes are read through `BpmnXMLUtil.getAttributeValue()`. It tries `flowable:`, then `activiti:` (`http://activiti.org/bpmn`), then `camunda:`. So every attribute below marked (F) also accepts `activiti:` and `camunda:`.
   - Exceptions, read from the flowable namespace only: `errorVariableName`, `errorVariableTransient`, `errorVariableLocalScope`, and the multi-instance `noWaitStatesAsyncLeave`.
   - Extra Camunda aliases: `camunda:asyncBefore` maps to async, and `asyncAfter` maps to asyncLeave (`C/BaseBpmnXMLConverter.java`).
2. **Unprefixed reads accept any prefix.** Some attributes are read with `xtr.getAttributeValue(null, x)`. StAX then ignores the namespace, so `x`, `flowable:x` and `activiti:x` all work. Flowable *writes* these unprefixed. The most notable case is sequenceFlow `skipExpression`: the engine's own tests use `activiti:skipExpression`, but the exporter writes plain `skipExpression`.
3. **Extension elements match on local name only.** Inside `extensionElements`, a child is matched by local name, so `activiti:field` and `flowable:field` are the same. Unknown children are kept as generic `ExtensionElement`s, which the engine reads by name.
4. **Flowable's exporter writes some children unprefixed.**
   - Inside `flowable:variableAggregation`, the `<variable>` child is written with no prefix, which puts it in the BPMN default namespace (`C/export/MultiInstanceExport.java`).
   - Field children `flowable:string` / `flowable:expression` are written as CDATA.
   - Listener, field, formProperty and in/out sub-attributes are written unprefixed.
   - A moddle descriptor must tolerate an unprefixed `<variable>`.
5. **The shipped XSD is stale.** `modules/flowable-bpmn-converter/src/main/resources/org/flowable/impl/bpmn/parser/flowable-bpmn-extensions.xsd` (944 lines) exists, but `BPMN20.xsd` does not import it, so nothing validates against it.
   - It is missing mapException, the HTTP handlers, the event registry, variableAggregation, external-worker parameters, owner, category, skipExpression on several elements, and more.
   - It still lists legacy attributes the converter no longer reads: `flowable:history` (process), `flowable:formHandlerClass`, and a `businessCalendarName` element.
   - Treat it as documentation only.

Legend: **(F)** = prefixed attribute. **(u)** = unprefixed attribute (any prefix accepted). **EE** = child of `bpmn:extensionElements`. "Text" means element text content.

---

### 1. Common to all flow nodes (activities, gateways, events, sub-processes)
Cite: `C/BaseBpmnXMLConverter.java`, `C/parser/SubProcessParser.java`.
- **async** (F): boolean, default false.
- **exclusive** (F): boolean, default true. Only written when async=true.
- **asyncLeave** (F): boolean, default false. Legacy alias: `asyncAfter`.
- **asyncLeaveExclusive** (F): boolean, default true.
- **EE `flowable:executionListener`** (0..n). Allowed on Process and on every FlowElement, including sequenceFlow and sub-process. See section 14.
- **EE `flowable:element-name`** (0..1). Text holds a multi-line name (`C/child/ElementNameParser.java`).
- **EE `flowable:failedJobRetryTimeCycle`** (0..1). Text is an ISO-8601 repeat, e.g. `R5/PT7M`. Parsed for any Activity; exported by the base converter for activities (sub-processes take another path) (`C/child/FlowableFailedjobRetryParser.java`, `C/export/FailedJobRetryCountExport.java`).
- **EE `flowable:mapException`** (0..n). Parsed for any Activity, but only exported for serviceTask and callActivity (`C/child/FlowableMapExceptionParser.java`, `C/export/MapExceptionExport.java`).
  - `errorCode` (required).
  - `includeChildExceptions` (boolean, default false).
  - `rootCause` (class name).
  - Text = exception class name.
- **Engine-read generic EEs** (no converter support; read by the engine by name):
  - `flowable:jobCategory`: text expression, for async jobs, timers and external worker (`E/util/JobUtil.java`, `E/util/TimerUtil.java`, `E/bpmn/behavior/ExternalWorkerTaskActivityBehavior.java`).
  - `flowable:includeInHistory`: text boolean (`E/history/DefaultHistoryConfigurationSettings.java`).
  - `flowable:localization`: attributes `locale`, `name`; child `flowable:documentation` (text). Applies to process, flow elements and dataObjects. Prefix must be `flowable` or `activiti` (`E/bpmn/deployer/BpmnDeployer.java`).

### 2. Process
Cite: `C/parser/ProcessParser.java`, `C/export/ProcessExport.java`, `C/parser/ExtensionElementsParser.java`.
- **Attributes:**
  - `candidateStarterUsers` (F): comma list.
  - `candidateStarterGroups` (F): comma list.
  - `isEagerExecutionFetching` (F): boolean, default false.
- **EE:**
  - `flowable:executionListener` (events start/end).
  - `flowable:eventListener` (process only; see section 14).
  - `flowable:potentialStarter`. Child `bpmn:resourceAssignmentExpression/formalExpression` with text like `user(x), group(y)`. Plain BPMN `potentialStarter` is also accepted.
  - `flowable:historyLevel`: text, one of none / instance / task / activity / audit / full (`E/history/DefaultHistoryConfigurationSettings.java`).
  - `flowable:localization`.
- **Legacy/XSD-only:** `flowable:history`.

### 3. Start event
Cite: `C/StartEventXMLConverter.java`.
- **Attributes:**
  - `initiator` (F): variable name.
  - `formKey` (F).
  - `formFieldValidation` (F): "true", "false" or an expression.
  - `sameDeployment` (F): boolean, default true; only "false" is written.
  - `isInterrupting` is BPMN standard.
- **EE:**
  - `flowable:formProperty` (0..n; see section 14).
  - `flowable:in` (0..n).
  - `flowable:variableListenerEventDefinition` (section 11).
  - Event-registry elements (section 12), including `flowable:startEventCorrelationConfiguration`.

### 4. User task
Cite: `C/UserTaskXMLConverter.java`.
- **Attributes (all F):**
  - `assignee`, `owner`.
  - `candidateUsers`, `candidateGroups`: comma lists.
  - `dueDate`: date, ISO duration or expression.
  - `businessCalendarName`, `category`.
  - `formKey`, `formFieldValidation`.
  - `sameDeployment`: default true.
  - `priority`: string or expression.
  - `extensionId`, `skipExpression`.
  - `taskIdVariableName`, `taskCompleterVariableName`.
- **EE:**
  - `flowable:taskListener` (0..n; events create / assignment / complete / delete / all).
  - `flowable:formProperty` (0..n).
  - `flowable:customResource` (0..n): attribute `name` (= identity-link type, prefixed or not). Child `bpmn:resourceAssignmentExpression/bpmn:formalExpression` with text `user(a), group(b)`.
  - BPMN `humanPerformer` and `potentialOwner` are mapped to assignee and candidates.
- **Alfresco legacy:** arbitrary `flowable:<name>` text elements written from CustomProperty.

### 5. Service task: base attributes and every `flowable:type`
Cite: `C/ServiceTaskXMLConverter.java`, `modules/flowable-bpmn-model/.../ServiceTask.java`, `E/bpmn/parser/handler/AbstractServiceTaskParseHandler.java`.

**Base attributes (all F):**
- Implementation, exactly one of: `class`, `expression`, `delegateExpression`. Alternatively the BPMN standard `implementation="##WebService"` plus `operationRef`.
- `resultVariableName`, with legacy alias `resultVariable`.
- `useLocalScopeForResultVariable`, `storeResultVariableAsTransient`: booleans.
- `skipExpression`, `extensionId`.
- `triggerable`: boolean.
- `type`.
- When `formKey` is present, the task becomes a FormAwareServiceTask and also takes `formFieldValidation`.

**Base EE:**
- `flowable:field` (0..n).
- `flowable:mapException` (0..n).

**`flowable:type` values.** `mule` and `script` do not exist in current source.

| type | Fields or extra markup |
|---|---|
| `mail` | Fields `to`, `from`, `cc`, `bcc`, `headers`, `subject`, `text`, `textVar`, `html`, `htmlVar`, `charset`, `ignoreException`, `exceptionVariableName`, `attachments` (`modules/flowable-engine-common/.../mail/BaseMailActivityDelegate.java`). Never triggerable. |
| `http` | Fields `requestMethod`, `requestUrl`, `requestHeaders`, `requestSecureHeaders`, `requestBody`, `requestBodyEncoding`, `requestTimeout`, `disallowRedirects`, `failStatusCodes`, `handleStatusCodes`, `ignoreException`, `saveRequestVariables`, `saveResponseParameters`, `responseVariableName`, `saveResponseParametersTransient`, `saveResponseVariableAsJson`, `resultVariablePrefix`, `httpActivityBehaviorClass` (`modules/flowable-http-common/.../BaseHttpActivityDelegate.java`, `E/bpmn/parser/factory/DefaultActivityBehaviorFactory.java`). Attribute `parallelInSameTransaction` (F, boolean). EE `flowable:httpRequestHandler` and `flowable:httpResponseHandler` (0..1 each): attributes `class` / `delegateExpression` / `type="script"`, children `flowable:field*` or `flowable:script`. |
| `shell` | Fields `command`, `wait`, `arg1`–`arg5`, `outputVariable`, `errorCodeVariable`, `redirectError`, `cleanEnv`, `directory` (`E/bpmn/behavior/ShellActivityBehavior.java`). |
| `camel` | Fields `camelContext`, `camelBehaviorClass` (`modules/flowable-camel/.../CamelBehavior.java`). |
| `dmn` | Fields `decisionTableReferenceKey`, `decisionTaskThrowErrorOnNoHits`, `fallbackToDefaultTenant`, `sameDeployment` (`E/bpmn/behavior/DmnActivityBehavior.java`). |
| `case` | Attributes (F) `caseDefinitionKey`, `caseInstanceName`, `businessKey`, `inheritBusinessKey`, `inheritVariables`, `sameDeployment`, `fallbackToDefaultTenant`, `idVariableName`, `skipExpression`. EE `flowable:in` / `flowable:out` (0..n). |
| `send-event` | Attributes `triggerable` (F), `skipExpression`. EE: `flowable:eventType` (1, text), `flowable:triggerEventType` (0..1), `flowable:sendSynchronously` (text "true"), `flowable:eventInParameter*`, `flowable:eventOutParameter*`, `flowable:triggerEventCorrelationParameter*`, `flowable:channelKey` (text expression or comma list), `flowable:systemChannel` (presence flag) (`E/bpmn/behavior/SendEventTaskActivityBehavior.java`). |
| `external-worker` (legacy `external`) | Attributes `topic` (F), `doNotIncludeVariables` (F, boolean), `exclusive`, `skipExpression`. EE `flowable:externalWorkerInParameter*` / `flowable:externalWorkerOutParameter*`, same attributes as in/out (section 14). Also `flowable:jobCategory`. |

### 6. Script task
Cite: `C/ScriptTaskXMLConverter.java`.
- `scriptFormat` is BPMN standard.
- `resultVariable` (F), with alias `resultVariableName`.
- `skipExpression` (F).
- `autoStoreVariables` (F): boolean, default false; always written.
- `doNotIncludeVariables` (F): boolean.
- EE `flowable:in` (0..n).

### 7. Business rule task (Drools-era, rarely used)
Cite: `C/BusinessRuleTaskXMLConverter.java`.
- All F: `ruleVariablesInput` (comma list), `rules` (comma list), `resultVariable`, `class`, `exclude` (boolean).

### 8. Send task and receive task
Cite: `C/SendTaskXMLConverter.java`, `C/ReceiveTaskXMLConverter.java`, `E/bpmn/parser/handler/SendTaskParseHandler.java`, `E/bpmn/parser/handler/ReceiveTaskParseHandler.java`.
- **Send task:**
  - `type` (F): mail / camel / dmn, with the same fields as the service task types.
  - EE `flowable:field*`.
  - `##WebService` is BPMN standard.
- **Receive task:**
  - `skipExpression` (F).
  - With EE `flowable:eventType` it becomes an event-registry receive task, using the section 12 elements (correlation and out parameters).

### 9. Call activity
Cite: `C/CallActivityXMLConverter.java`, `C/child/InParameterParser.java`, `C/child/OutParameterParser.java`.
- **Attributes:**
  - `calledElement` (BPMN).
  - `calledElementType` (F): `key` (default) or `id`.
  - `processInstanceName` (F).
  - `businessKey` (F), `inheritBusinessKey` (F, boolean).
  - `inheritVariables` (F, boolean).
  - `sameDeployment` (F, boolean). Legacy equivalent: `calledElementBinding="deployment"`.
  - `useLocalScopeForOutParameters` (F, boolean).
  - `completeAsync` (F, boolean).
  - `fallbackToDefaultTenant` (F, boolean).
  - `idVariableName` (F).
- **EE:**
  - `flowable:in*` / `flowable:out*`. Activiti-5 forms are also accepted: `variables="all"` with `local="true"`, and `businessKey` on `in`.
  - `flowable:mapException*`.

### 10. Sequence flow, gateways, sub-processes, multi-instance, data objects, lanes, DI
- **Sequence flow:**
  - `skipExpression` (u). Write it unprefixed; `flowable:` / `activiti:` are also accepted.
  - `conditionExpression@language` is standard tFormalExpression.
  - EE `flowable:executionListener` (default event `take`).
  - Cite `C/SequenceFlowXMLConverter.java`, `C/child/ExecutionListenerParser.java`.
- **Gateways:** only the section 1 attributes plus generic EE. No gateway-specific extensions (`C/*GatewayXMLConverter.java`).
- **Sub-process, event sub-process, transaction, ad-hoc sub-process:**
  - Section 1 async attributes (not written for transaction).
  - EE `executionListener` and `element-name`.
  - Ad-hoc `ordering` and `cancelRemainingInstances` are BPMN standard.
  - Cite `C/BpmnXMLConverter.java` (createXML), `C/parser/SubProcessParser.java`.
- **multiInstanceLoopCharacteristics** (`C/child/MultiInstanceParser.java`, `C/child/FlowableCollectionParser.java`, `C/child/VariableAggregationDefinitionParser.java`, `C/export/MultiInstanceExport.java`):
  - Attributes: `collection` (F; expression or variable name), `elementVariable` (F), `elementIndexVariable` (F), `noWaitStatesAsyncLeave` (F, flowable namespace only).
  - EE `flowable:collection` (0..1): `class` or `delegateExpression` (a collection handler), plus child `flowable:string` (CDATA) or `flowable:expression`.
  - EE `flowable:variableAggregation` (0..n): attributes `target`, `targetExpression`, `storeAsTransientVariable`, `createOverviewVariable`, `class` / `delegateExpression`. Child `variable*` with `source`, `sourceExpression`, `target`, `targetExpression`. The child is unprefixed when Flowable writes it.
- **dataObject** (`C/ValuedDataObjectXMLConverter.java`):
  - `itemSubjectRef` is one of `xsd:string`, `int`, `long`, `double`, `boolean`, `datetime` (format `yyyy-MM-dd'T'HH:mm:ss`), `json`.
  - EE `flowable:value` (0..1, text default value).
  - EE `flowable:localization`.
- **Lanes:** no Flowable-specific extensions; generic EE only (`C/parser/LaneParser.java`).
- **Signal / message definitions:**
  - `<signal flowable:scope="global|processInstance">` (`C/parser/SignalParser.java`).
  - Extension elements on `<message>` are copied onto its messageEventDefinitions (`E/bpmn/parser/handler/MessageEventDefinitionParseHandler.java`).
- **DI** (`C/export/BPMNDIExport.java`):
  - `bpmndi:BPMNEdge` takes `flowable:sourceDockerX`, `sourceDockerY`, `targetDockerX`, `targetDockerY`.
  - `bpmndi:BPMNLabel` takes `flowable:rotation`.

### 11. Boundary, intermediate and end events; event definitions
Cite: `C/BoundaryEventXMLConverter.java`, `CatchEventXMLConverter.java`, `ThrowEventXMLConverter.java`, `EndEventXMLConverter.java`, `C/child/*EventDefinitionParser.java`, the writers in `BaseBpmnXMLConverter`.
- **Where in/out mappings go:**
  - boundaryEvent and intermediateCatchEvent: EE `flowable:in*`, `flowable:variableListenerEventDefinition`, and section 12 elements.
  - endEvent: EE `flowable:out*`.
  - intermediateThrowEvent: `flowable:out*` is parsed but never exported.
- **timerEventDefinition:** `businessCalendarName` (F). Child `timeCycle` also takes `endDate` (F).
- **signalEventDefinition:** `signalExpression` (F), and `async` (F, boolean, throw events only).
- **messageEventDefinition:** `messageExpression` (F).
- **errorEventDefinition:** `errorVariableName`, `errorVariableTransient`, `errorVariableLocalScope` (F, flowable namespace only). In Flowable, `errorRef` may be an error code.
- **terminateEventDefinition:** `terminateAll` (F, boolean), `terminateMultiInstance` (F, boolean).
- **conditionalEventDefinition / condition@language:** standard. Escalation, compensate and cancel have no Flowable extensions.
- **EE `flowable:variableListenerEventDefinition`** (custom event definition, inside the event's extensionElements):
  - `variableName` (required).
  - `variableChangeType`: all / create / update / update-create / delete.
  - Allowed on start (event sub-process), boundary and intermediate catch events (`C/child/VariableListenerEventDefinitionParser.java`, model `VariableListenerEventDefinition.java`).

### 12. Event registry (catch side)
Allowed on start, boundary and intermediate catch events, event-sub-process start events, and receive tasks. The converter keeps these as generic EEs; `eventType` is promoted to an `EventRegistryEventDefinition` (`C/BpmnXMLConverter.java`). Engine readers: `E/util/CorrelationUtil.java`, `E/eventregistry/BpmnEventInstanceOutParameterHandlerImpl.java`, `E/eventregistry/BpmnEventRegistryEventConsumer.java`.
- `flowable:eventType` (1, text = event definition key).
- `flowable:eventName` (text): written by the modeler and converter tests, not read by the engine.
- `flowable:eventCorrelationParameter*`: `name`, `value` (expression). `type` is modeler-only.
- `flowable:eventOutParameter*`: `source` (payload field), `target` (variable), `sourceType`, `transient`.
- `flowable:startEventCorrelationConfiguration` (start events only): text `storeAsUniqueReferenceId` or `manualSubscription`.

### 13. Removed or legacy forms
- `flowable:type="mule"` and `"script"`: not present.
- `external`: alias of `external-worker`.
- `resultVariable` on service task, and `resultVariableName` on script task: aliases.
- `calledElementBinding`, `asyncAfter`, `camunda:asyncBefore`: legacy.
- `flowable:in variables="all"` / `businessKey`: Activiti 5 forms.
- XSD-only: `history`, `formHandlerClass`, `businessCalendarName` element.
- Every `activiti:` spelling.

### 14. Reusable sub-structures
- **`flowable:executionListener` / `flowable:taskListener`** (`C/child/FlowableListenerParser.java`, `C/export/FlowableListenerExport.java`):
  - Attributes (u): `event`; one of `class`, `expression`, `delegateExpression`, or `type="script"`; `onTransaction` (before-commit / committed / rolled-back); one of `customPropertiesResolverClass`, `customPropertiesResolverExpression`, `customPropertiesResolverDelegateExpression`.
  - Children: `flowable:field*`, or `flowable:script` when type is script.
  - Execution listener events: start / end / take. Task listener events: create / assignment / complete / delete / all.
- **`flowable:eventListener`** (process only; `C/child/FlowableEventListenerParser.java`):
  - `events` (comma list of engine event types), `entityType`.
  - One of `class`, `delegateExpression`, or `throwEvent` = signal / globalSignal / message / error together with `signalName` / `messageName` / `errorCode`.
  - `onTransaction`.
- **`flowable:field`** (`C/child/FieldExtensionParser.java`):
  - `name`, plus `stringValue` or `expression` as an attribute, or a child `flowable:string` / `flowable:expression` (text or CDATA).
  - Allowed on serviceTask, sendTask, listeners and HTTP handlers.
- **`flowable:script`** (`C/child/ScriptInfoParser.java`): `language`, `resultVariable`, text = script. Used in script listeners and HTTP handlers.
- **`flowable:formProperty`** (`C/child/FormPropertyParser.java`):
  - Attributes `id`, `name`, `type`, `expression`, `variable`, `default`, `datePattern`, `lenientDateParsing`, `readable` (default true), `writable` (default true), `required` (default false).
  - Child `flowable:value*` with `id`, `name` (enum values).
- **`flowable:in` / `flowable:out`** and the event/external-worker parameter variants (`C/util/BpmnXMLUtil.java` parseIn/OutIOParameter):
  - `source` | `sourceExpression`, `target`.
  - Out only: `targetExpression`.
  - In: `targetType`. Out: `sourceType`.
  - `transient` (boolean).
  - Call activity only: `variables="all"`, `local`, `businessKey`.
  - Any other attributes are kept as custom attributes.

---

### Counts (approximate; derived from the converters)
- About **94 element/attribute pairs**, using about **70 distinct `flowable:` attribute names**.
- About **40 distinct extension-element names**. About 30 have dedicated converter parsers; about 10 are generic EEs read by the engine: eventType family, channelKey, systemChannel, startEventCorrelationConfiguration, historyLevel, includeInHistory, jobCategory, localization.
- **7 service-task types** plus FormAware: mail, http, shell, camel, dmn, case, send-event, external-worker.
- **Name clashes moddle needs distinct type names for:**
  - `collection`: an attribute on multi-instance and also an EE.
  - `value`: formProperty enum (id/name) vs dataObject text.
  - `string` / `expression`: field children and collection children.
  - `type`: a prefixed attribute on tasks vs an unprefixed one on listeners and handlers.

### Existing npm and GitHub packages (checked 2026-11-22)
None model Flowable's own extensions. Each is a renamed copy of Camunda's descriptor, and none contains skipExpression, formFieldValidation, triggerable, mapException, eventType, sameDeployment, asyncLeave, calledElementType, variableAggregation, caseDefinitionKey or category.
- **`flowable-bpmn-moddle`** 0.0.2, last published 2024-05-26. A copy of `camunda.json` with the prefix changed to `flowable` (48 Camunda types). Its repo link points at camunda/camunda-bpmn-moddle.
- **`jp-flowable-bpmn-moddle`** 5.1.6, published 2020-03-31 (registry metadata last modified 2022-05-06). Same Camunda clone, prefix `flow`, and the URI is wrong (`http://flowable.org/schema/1.0/bpmn`).
- **`flowable-bpmn-modeler`** 1.0.0 (2020) and the GitHub project **miyuesc/bpmn-process-designer** (1.8k stars; `flowable.json` / `flowableDescriptor.json`) also embed Camunda-derived descriptors under the Flowable URI, with no Flowable-specific coverage.
- **`@flowable/*`**: no BPMN moddle package exists (`@flowable/bpmn-moddle` returns 404).
- For CMMN only, `flowable-cmmn-moddle` 1.5.0 and `cmmn-js-properties-panel-flowable` 2.1.1 exist (the jylups CMMN packages, as of 2026-11-22).
- **Conclusion:** there is no usable prior art; a descriptor would need to be written from this inventory.

### Most-used areas in practice (assessment)
1. User-task assignment and forms: assignee, candidateUsers / candidateGroups, owner, dueDate, priority, category, formKey, formFieldValidation, plus taskListener.
2. Service-task implementation: class / expression / delegateExpression, resultVariableName, `flowable:field`, triggerable.
3. Async / exclusive / asyncLeave plus `failedJobRetryTimeCycle` (and `jobCategory`).
4. Execution listeners (including script listeners and fields) and process-level `eventListener`.
5. Call activity: `flowable:in` / `out`, calledElementType, businessKey / inheritBusinessKey, inheritVariables, sameDeployment, fallbackToDefaultTenant.
6. Multi-instance: `flowable:collection`, `elementVariable`, `elementIndexVariable`, and `variableAggregation` in newer models.
7. Start event `initiator` / `formKey` and process `candidateStarterUsers` / `candidateStarterGroups`.
8. HTTP and mail task fields, and the HTTP request/response handlers.
9. skipExpression on user task, service task and sequenceFlow, and `mapException` for errors.
10. Newer but growing: event registry (send-event, eventType, correlation and out parameters, channelKey) and external-worker `topic`.