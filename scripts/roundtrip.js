/**
 * Load-and-save report: imports BPMN models with bpmn-moddle and the Flowable
 * descriptor from the workspace's flowable-bpmn-moddle, exports them again and
 * reports what changed.
 *
 * Usage (from the workspace root):
 *
 *   npm run roundtrip -- [options] [dir ...]
 *
 * Directories default to roundtrip/samples and .flowable-models (see
 * scripts/fetch-flowable-models.sh). Options:
 *
 *   --json <file>       write the full report as JSON (default roundtrip-report.json)
 *   --markdown <file>   write the summary as Markdown (default roundtrip-report.md);
 *                       it is also appended to $GITHUB_STEP_SUMMARY when set
 *   --baseline <file>   known differences (default roundtrip/known-losses.json);
 *                       exits with 1 when a difference is not in it
 *   --update-baseline   add the current differences to the baseline and remove
 *                       the ones no longer found
 *
 * The original and exported XML are compared as namespace-resolved trees, so
 * namespace prefixes, element order, whitespace, CDATA and number formatting
 * (76.0 / 76) are not reported. Elements are matched by name and id, then by
 * position among siblings of the same name.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DOMParser } from '@xmldom/xmldom';
import { BpmnModdle } from 'bpmn-moddle';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const DESCRIPTOR_FILE = path.join(ROOT, 'flowable-bpmn-moddle', 'resources', 'flowable.json');

const NAMESPACES = {
  'http://www.omg.org/spec/BPMN/20100524/MODEL': 'bpmn',
  'http://www.omg.org/spec/BPMN/20100524/DI': 'bpmndi',
  'http://www.omg.org/spec/DD/20100524/DC': 'dc',
  'http://www.omg.org/spec/DD/20100524/DI': 'di',
  'http://flowable.org/bpmn': 'flowable',
  'http://activiti.org/bpmn': 'activiti',
  'http://camunda.org/schema/1.0/bpmn': 'camunda',
  'http://www.w3.org/2001/XMLSchema-instance': 'xsi'
};

const XMLNS = 'http://www.w3.org/2000/xmlns/';

const XSI = 'http://www.w3.org/2001/XMLSchema-instance';

const KINDS = {
  'import-error': 'File fails to import',
  'dropped-element': 'Element dropped',
  'dropped-attribute': 'Attribute dropped',
  'changed-attribute': 'Attribute value changed',
  'changed-text': 'Text changed',
  'added-element': 'Element added',
  'added-attribute': 'Attribute added'
};

/**
 * Inventory areas (docs/flowable-bpmn-extensions.md) and a pattern that finds
 * them in a model, whatever prefix (flowable, activiti, camunda) it uses. The
 * report counts the models per area to show what the corpus exercises.
 */
const P = '(?:flowable|activiti|camunda):';

const AREAS = [
  [ '1 Common to flow nodes', `${P}(?:async|asyncLeave|exclusive)=|${P}(?:failedJobRetryTimeCycle|jobCategory|includeInHistory|localization|element-name)\\b` ],
  [ '2 Process', `${P}(?:candidateStarterUsers|candidateStarterGroups|isEagerExecutionFetching)=|${P}(?:potentialStarter|historyLevel)\\b` ],
  [ '3 Start event', `<(?:\\w+:)?startEvent[^>]*${P}(?:initiator|formKey)=|${P}formProperty\\b` ],
  [ '4 User task', `${P}(?:assignee|owner|candidateUsers|candidateGroups|dueDate|taskIdVariableName)=|${P}customResource\\b` ],
  [ '5 Service task and types', `<(?:\\w+:)?serviceTask[^>]*${P}(?:class|expression|delegateExpression|type|triggerable)=|${P}mapException\\b` ],
  [ '6 Script task', `${P}autoStoreVariables=|<(?:\\w+:)?scriptTask[^>]*${P}resultVariable=` ],
  [ '7 Business rule task', `${P}(?:ruleVariablesInput|rules)=` ],
  [ '8 Send and receive tasks', '<(?:\\w+:)?(?:sendTask|receiveTask)\\b' ],
  [ '9 Call activity', `${P}(?:calledElementType|inheritBusinessKey|inheritVariables|processInstanceName)=|<${P}(?:in|out)\\b` ],
  [ '10 Multi-instance', `${P}(?:collection|elementVariable|elementIndexVariable)=|${P}(?:variableAggregation|collection)\\b` ],
  [ '10 Data objects, signals and DI', `<(?:\\w+:)?dataObject\\b|${P}(?:scope|sourceDockerX|rotation)=` ],
  [ '11 Event definitions', `${P}(?:businessCalendarName|signalExpression|messageExpression|errorVariableName|terminateAll)=|${P}variableListenerEventDefinition\\b` ],
  [ '12 Event registry', `${P}(?:eventType|eventCorrelationParameter|eventOutParameter|channelKey)\\b` ],
  [ '14 Listeners and fields', `${P}(?:executionListener|taskListener|eventListener|field)\\b` ],
  [ 'Activiti namespace', 'xmlns:\\w+="http://activiti\\.org/bpmn"' ],
  [ 'Unprefixed skipExpression (Flowable export style)', '<(?:\\w+:)?sequenceFlow[^>]*\\sskipExpression=' ]
].map(([ name, pattern ]) => ({ name, pattern: new RegExp(pattern) }));


// arguments

function parseArgs(argv) {
  const args = {
    dirs: [],
    json: 'roundtrip-report.json',
    markdown: 'roundtrip-report.md',
    baseline: path.join('roundtrip', 'known-losses.json'),
    updateBaseline: false
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === '--json') {
      args.json = argv[++i];
    } else if (arg === '--markdown') {
      args.markdown = argv[++i];
    } else if (arg === '--baseline') {
      args.baseline = argv[++i];
    } else if (arg === '--update-baseline') {
      args.updateBaseline = true;
    } else {
      args.dirs.push(arg);
    }
  }

  if (!args.dirs.length) {
    args.dirs = [ path.join('roundtrip', 'samples'), '.flowable-models' ].filter(dir => fs.existsSync(dir));
  }

  return args;
}

function findModels(dir) {
  let found = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== '.git' && entry.name !== 'node_modules') {
        found = found.concat(findModels(file));
      }
    } else if (/\.bpmn(20)?(\.xml)?$/.test(entry.name)) {
      found.push(file);
    }
  }

  return found.sort();
}


// moddle import / export

function readDescriptor() {
  if (!fs.existsSync(DESCRIPTOR_FILE)) {
    throw new Error(`${DESCRIPTOR_FILE} not found; run ./setup.sh to clone flowable-bpmn-moddle into the workspace`);
  }

  return JSON.parse(fs.readFileSync(DESCRIPTOR_FILE, 'utf8'));
}

const flowableDescriptor = readDescriptor();

function createModdle() {
  return new BpmnModdle({ flowable: flowableDescriptor });
}

async function roundtrip(xml) {
  const moddle = createModdle();

  let imported;

  try {
    imported = await moddle.fromXML(xml, 'bpmn:Definitions');
  } catch (error) {
    return { error: error.message, warnings: (error.warnings || []).map(w => w.message) };
  }

  const warnings = imported.warnings.map(w => w.message);

  // the writer reports some problems on the console; collect them as warnings
  const { warn, error } = console;
  const logged = [];

  console.warn = console.error = (...messages) => logged.push(messages.join(' '));

  let result;

  try {
    const { xml: savedXML } = await moddle.toXML(imported.rootElement);

    result = { savedXML };
  } catch (err) {
    result = { error: `export failed: ${err.message}` };
  } finally {
    console.warn = warn;
    console.error = error;
  }

  return { ...result, warnings: warnings.concat(logged.map(message => `export: ${message}`)) };
}


// canonical trees

function displayName(namespaceURI, localName, prefix) {
  if (!namespaceURI) {
    return localName;
  }

  return `${NAMESPACES[namespaceURI] || prefix || `{${namespaceURI}}`}:${localName}`;
}

function normalizeSpace(value) {
  return String(value).replace(/\s+/g, ' ').trim();
}

function resolveQName(element, value) {
  const parts = value.split(':');

  if (parts.length !== 2) {
    return value;
  }

  const uri = element.lookupNamespaceURI(parts[0]);

  return uri ? displayName(uri, parts[1], parts[0]) : value;
}

function toTree(element) {
  const node = {
    name: displayName(element.namespaceURI, element.localName, element.prefix),
    attrs: {},
    children: [],
    text: ''
  };

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];

    if (attr.namespaceURI === XMLNS || attr.name === 'xmlns' || attr.prefix === 'xmlns') {
      continue;
    }

    let value = attr.value;

    if (attr.namespaceURI === XSI && attr.localName === 'type') {
      value = resolveQName(element, value);
    }

    node.attrs[displayName(attr.namespaceURI, attr.localName, attr.prefix)] = value;
  }

  let text = '';

  for (let c = element.firstChild; c; c = c.nextSibling) {
    if (c.nodeType === 1) {
      node.children.push(toTree(c));
    } else if (c.nodeType === 3 || c.nodeType === 4) {
      text += c.data;
    }
  }

  node.text = normalizeSpace(text);

  return node;
}

function parseTree(xml) {
  const errors = [];

  const doc = new DOMParser({
    onError(level, message) {
      if (level !== 'warning') {
        errors.push(message);
      }
    }
  }).parseFromString(xml, 'text/xml');

  if (!doc || !doc.documentElement) {
    throw new Error(`not well-formed XML: ${errors.join('; ')}`);
  }

  return toTree(doc.documentElement);
}


// descriptor defaults

const defaultsModdle = createModdle();

function upperFirst(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Whether value is the default of attribute attrName on elementName, as the
 * descriptors define it. moddle does not write properties that hold their
 * default value, so such attributes disappear without changing the model.
 */
function isDefaultValue(elementName, attrName, value) {
  const parts = elementName.split(':');

  if (parts.length !== 2) {
    return false;
  }

  for (const candidate of [ elementName, `${parts[0]}:${upperFirst(parts[1])}` ]) {
    try {
      const element = defaultsModdle.create(candidate);
      const descriptor = defaultsModdle.getPropertyDescriptor(element, attrName);

      if (descriptor && descriptor.default !== undefined) {
        return sameValue(String(descriptor.default), value);
      }
    } catch {
      // not a type of the descriptors
    }
  }

  return false;
}


// comparison

function sameValue(a, b) {
  a = normalizeSpace(a);
  b = normalizeSpace(b);

  if (a === b) {
    return true;
  }

  if (/^(true|false)$/i.test(a) && a.toLowerCase() === b.toLowerCase()) {
    return true;
  }

  const x = Number(a), y = Number(b);

  return a !== '' && b !== '' && isFinite(x) && isFinite(y) && x === y;
}

function describe(node) {
  return `<${node.name}${node.attrs.id ? ` id="${node.attrs.id}"` : ''}>`;
}

function truncate(value, length) {
  value = normalizeSpace(value);

  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}

function matchChildren(original, saved) {
  const pairs = [];
  const unmatchedSaved = saved.slice();

  const take = predicate => o => {
    const index = unmatchedSaved.findIndex(s => predicate(o, s));

    if (index === -1) {
      return true;
    }

    pairs.push([ o, unmatchedSaved[index] ]);
    unmatchedSaved.splice(index, 1);

    return false;
  };

  let unmatchedOriginal = original.filter(o => !o.attrs.id || take((o, s) => s.name === o.name && s.attrs.id === o.attrs.id)(o));

  unmatchedOriginal = unmatchedOriginal.filter(take((o, s) => s.name === o.name && (!o.attrs.id || !s.attrs.id)));

  return { pairs, dropped: unmatchedOriginal, added: unmatchedSaved };
}

function compare(original, saved, report) {

  for (const name of Object.keys(original.attrs)) {
    if (!(name in saved.attrs)) {
      if (!isDefaultValue(original.name, name, original.attrs[name])) {
        report('dropped-attribute', `${original.name}@${name}`,
          `${describe(original)} ${name}="${truncate(original.attrs[name], 60)}"`);
      }
    } else if (!sameValue(original.attrs[name], saved.attrs[name])) {
      report('changed-attribute', `${original.name}@${name}`,
        `${describe(original)} ${name}: "${truncate(original.attrs[name], 40)}" → "${truncate(saved.attrs[name], 40)}"`);
    }
  }

  for (const name of Object.keys(saved.attrs)) {
    if (!(name in original.attrs)) {
      report('added-attribute', `${original.name}@${name}`,
        `${describe(original)} ${name}="${truncate(saved.attrs[name], 60)}"`);
    }
  }

  if (!sameValue(original.text, saved.text)) {
    report('changed-text', original.name,
      `${describe(original)}: "${truncate(original.text, 40)}" → "${truncate(saved.text, 40)}"`);
  }

  const match = matchChildren(original.children, saved.children);

  for (const child of match.dropped) {
    report('dropped-element', `${original.name} > ${child.name}`, `${describe(original)} > ${describe(child)}`);
  }

  for (const child of match.added) {
    report('added-element', `${original.name} > ${child.name}`, `${describe(original)} > ${describe(child)}`);
  }

  for (const [ o, s ] of match.pairs) {
    compare(o, s, report);
  }
}


// report

function normalizeWarning(message) {
  return message
    .split('\n')[0]
    .replace(/<([^>\s/]+)[^>]*>/g, '<$1>')
    .replace(/(unresolved reference|duplicate ID|illegal ID) <[^>]*>/, '$1');
}

async function checkFile(file) {
  const xml = fs.readFileSync(file, 'utf8');
  const result = await roundtrip(xml);
  const differences = [];

  const report = (kind, subject, detail) => differences.push({ kind, subject, detail });

  if (result.error) {
    const cause = result.warnings[0] || result.error;

    report('import-error', normalizeWarning(cause), truncate(cause, 160));
  } else {
    try {
      compare(parseTree(xml), parseTree(result.savedXML), report);
    } catch (err) {
      report('import-error', 'original is not well-formed XML', truncate(err.message, 160));
    }
  }

  return {
    file,
    areas: AREAS.filter(area => area.pattern.test(xml)).map(area => area.name),
    warnings: result.warnings.map(normalizeWarning),
    differences
  };
}

function groupDifferences(results) {
  const groups = {};

  for (const result of results) {
    for (const d of result.differences) {
      const key = `${d.kind} ${d.subject}`;

      const group = groups[key] = groups[key] || {
        key, kind: d.kind, subject: d.subject, count: 0, files: [], example: d.detail
      };

      group.count++;

      if (!group.files.includes(result.file)) {
        group.files.push(result.file);
      }
    }
  }

  const order = Object.keys(KINDS);

  return Object.values(groups).sort((a, b) =>
    (order.indexOf(a.kind) - order.indexOf(b.kind)) ||
    (b.files.length - a.files.length) ||
    a.subject.localeCompare(b.subject));
}

function groupWarnings(results) {
  const counts = {};

  for (const result of results) {
    for (const w of new Set(result.warnings)) {
      counts[w] = counts[w] || { warning: w, files: 0 };
      counts[w].files++;
    }
  }

  return Object.values(counts).sort((a, b) => b.files - a.files || a.warning.localeCompare(b.warning));
}

function countAreas(results) {
  return AREAS.map(area => ({
    area: area.name,
    files: results.filter(r => r.areas.includes(area.name)).length
  }));
}

function readBaseline(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return { losses: {} };
  }
}

function escapeCell(value) {
  return String(value).replace(/\|/g, '\\|').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function toMarkdown(summary, areas, groups, warnings, baseline, fixed) {
  const lines = [];
  const w = line => lines.push(line);

  w('## Load-and-save report');
  w('');
  w('| | Files |');
  w('|---|---|');
  w(`| Checked | ${summary.files} |`);
  w(`| Unchanged after load and save | ${summary.unchanged} |`);
  w(`| With differences | ${summary.changed} |`);
  w(`| Failing to import | ${summary.failed} |`);
  w('');

  w('### Corpus coverage by inventory area');
  w('');
  w('| Area | Files |');
  w('|---|---|');
  areas.forEach(a => w(`| ${escapeCell(a.area)} | ${a.files} |`));
  w('');

  if (groups.length) {
    w('### Differences by kind');
    w('');
    w('| Kind | Where | Files | Example | Tracked |');
    w('|---|---|---|---|---|');

    for (const g of groups) {
      const known = baseline.losses[g.key];

      w(`| ${[
        KINDS[g.kind],
        `\`${escapeCell(g.subject)}\``,
        g.files.length,
        `${escapeCell(g.example)}<br>${escapeCell(g.files[0])}`,
        known === undefined ? '**new**' : (known.issue || 'known')
      ].join(' | ')} |`);
    }

    w('');
  }

  if (fixed.length) {
    w('### No longer found (remove from the baseline)');
    w('');
    fixed.forEach(key => w(`- \`${escapeCell(key)}\``));
    w('');
  }

  if (warnings.length) {
    w('### Import warnings');
    w('');
    w('| Warning | Files |');
    w('|---|---|');
    warnings.forEach(x => w(`| ${escapeCell(x.warning)} | ${x.files} |`));
    w('');
  }

  return lines.join('\n');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = args.dirs.flatMap(dir => findModels(dir));

  if (!files.length) {
    console.error(`no BPMN models found in ${args.dirs.join(', ') || 'roundtrip/samples, .flowable-models'}`);
    process.exit(1);
  }

  const results = [];

  for (const file of files) {
    results.push(await checkFile(file));
  }

  const groups = groupDifferences(results);
  const warnings = groupWarnings(results);
  const areas = countAreas(results);
  const baseline = readBaseline(args.baseline);

  const summary = {
    files: results.length,
    unchanged: results.filter(r => !r.differences.length).length,
    changed: results.filter(r => r.differences.length && !r.differences.some(d => d.kind === 'import-error')).length,
    failed: results.filter(r => r.differences.some(d => d.kind === 'import-error')).length
  };

  const keys = groups.map(g => g.key);
  const newKeys = keys.filter(key => !(key in baseline.losses));
  const fixed = Object.keys(baseline.losses).filter(key => !keys.includes(key));

  const markdown = toMarkdown(summary, areas, groups, warnings, baseline, fixed);

  fs.writeFileSync(args.json, JSON.stringify({ summary, areas, groups, warnings, files: results }, null, 2));
  fs.writeFileSync(args.markdown, `${markdown}\n`);

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${markdown}\n`);
  }

  console.log('checked %d files: %d unchanged, %d with differences, %d failing to import',
    summary.files, summary.unchanged, summary.changed, summary.failed);
  console.log('%d kinds of difference (%d new, %d no longer found); report in %s and %s',
    groups.length, newKeys.length, fixed.length, args.markdown, args.json);

  const emptyAreas = areas.filter(a => !a.files).map(a => a.area);

  if (emptyAreas.length) {
    console.log('areas without a model: %s', emptyAreas.join(', '));
  }

  if (args.updateBaseline) {
    const losses = {};

    for (const key of keys) {
      losses[key] = baseline.losses[key] || { issue: null, note: '' };
    }

    fs.mkdirSync(path.dirname(args.baseline), { recursive: true });
    fs.writeFileSync(args.baseline, `${JSON.stringify({ losses }, null, 2)}\n`);

    console.log('updated %s', args.baseline);

    return;
  }

  if (newKeys.length) {
    console.error('\nnew differences, not in %s:', args.baseline);
    newKeys.forEach(key => console.error(`  ${key}`));

    process.exitCode = 1;
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
