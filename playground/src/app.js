import Modeler from 'bpmn-js/lib/Modeler';
import NavigatedViewer from 'bpmn-js/lib/NavigatedViewer';

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';

import flowableDescriptor, {
  migrateActivitiXML,
  registerUnknownFlowableElements,
  useFlowablePrefix
} from '@jylups/flowable-bpmn-moddle';

import { FlowablePropertiesProviderModule } from '@jylups/bpmn-js-properties-panel-flowable';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import '@bpmn-io/properties-panel/dist/assets/properties-panel.css';
import './styles.css';

import { samples, emptyDiagram } from './samples.js';

/*
 * The Flowable behaviors (jylups/bpmn-js-env#33) are added here when that
 * package has its first modules.
 */
const MODELER_MODULES = [
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  FlowablePropertiesProviderModule
];

const MODDLE_EXTENSIONS = {
  flowable: flowableDescriptor
};

const STORAGE_KEY = 'bpmn-playground';

const canvasEl = document.getElementById('canvas');
const propertiesEl = document.getElementById('properties');
const sampleEl = document.getElementById('sample');
const fileEl = document.getElementById('file');
const xmlEl = document.getElementById('xml');
const problemsEl = document.getElementById('problems');
const problemCountEl = document.getElementById('problem-count');
const statusEl = document.getElementById('status');

const state = {
  mode: 'modeler',
  xml: emptyDiagram,
  source: { kind: 'sample', id: 'empty', fileName: 'diagram.bpmn' },
  tab: 'xml'
};

let instance = null;
let problems = [];
let exportTimer = null;


// diagram instance //////////

function createInstance(mode) {
  if (instance) {
    instance.destroy();
  }

  propertiesEl.innerHTML = '';
  document.body.classList.toggle('modeler', mode === 'modeler');

  if (mode === 'modeler') {
    instance = new Modeler({
      container: canvasEl,
      propertiesPanel: { parent: propertiesEl },
      additionalModules: MODELER_MODULES,
      moddleExtensions: MODDLE_EXTENSIONS
    });

    instance.on('commandStack.changed', scheduleExport);
  } else {
    instance = new NavigatedViewer({ container: canvasEl, moddleExtensions: MODDLE_EXTENSIONS });
  }

  return instance;
}

async function importXML(xml, source) {
  problems = [];

  try {

    // as an app imports Flowable models: Activiti spellings become flowable:,
    // and flowable:* elements without a type are kept
    xml = migrateActivitiXML(xml);
    registerUnknownFlowableElements(instance.get('moddle'), xml);

    const { warnings } = await instance.importXML(xml);

    problems = warnings.map(toProblem);
    state.xml = xml;

    if (source) {
      state.source = source;
    }

    fitViewport();
    await exportXML();

    setStatus(`Opened ${describeSource(state.source)}` +
      (problems.length ? ` with ${problems.length} warning(s)` : ''), problems.length ? 'warning' : 'ok');
  } catch (err) {
    problems = [ { severity: 'error', message: err.message } ].concat((err.warnings || []).map(toProblem));
    setStatus(`Could not open ${describeSource(source || state.source)}: ${err.message}`, 'error');
  }

  renderProblems();
  persist();
}

function fitViewport() {
  requestAnimationFrame(() => {
    const canvas = instance.get('canvas');
    const { width, height } = canvas.getSize();

    // a hidden or not yet laid out canvas has no size to fit into
    if (!width || !height) {
      return;
    }

    canvas.zoom('fit-viewport', 'auto');

    // keep small diagrams at a readable size
    if (canvas.zoom() > 1) {
      canvas.zoom(1, 'auto');
    }
  });
}

async function exportXML() {
  try {
    useFlowablePrefix(instance.getDefinitions());

    const { xml } = await instance.saveXML({ format: true });

    state.xml = xml;
    xmlEl.value = xml;
    persist();

    return xml;
  } catch (err) {
    setStatus(`Could not export XML: ${err.message}`, 'error');
  }
}

function scheduleExport() {
  clearTimeout(exportTimer);
  exportTimer = setTimeout(exportXML, 300);
}

async function switchMode(mode) {
  if (instance && state.mode === 'modeler') {
    await exportXML();
  }

  state.mode = mode;

  document.querySelectorAll('[data-mode]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.mode === mode));
  });

  createInstance(mode);
  await importXML(state.xml);
}


// problems //////////

function toProblem(warning) {
  const element = warning.element || warning.context?.element;

  return {
    severity: 'warning',
    message: warning.message,
    elementId: element?.id
  };
}

function renderProblems() {
  problemsEl.innerHTML = '';
  problemCountEl.textContent = problems.length ? `(${problems.length})` : '';

  if (!problems.length) {
    problemsEl.textContent = 'No problems found while importing.';
    return;
  }

  const list = document.createElement('ul');

  problems.forEach(problem => {
    const item = document.createElement('li');

    item.className = problem.severity;
    item.textContent = problem.message;

    if (problem.elementId) {
      item.title = `Select ${problem.elementId}`;
      item.classList.add('selectable');
      item.addEventListener('click', () => selectElement(problem.elementId));
    }

    list.appendChild(item);
  });

  problemsEl.appendChild(list);
}

function selectElement(id) {
  const element = instance.get('elementRegistry').get(id);

  if (!element) {
    return;
  }

  instance.get('canvas').scrollToElement(element);

  if (state.mode === 'modeler') {
    instance.get('selection').select(element);
  }
}


// files //////////

function openFile(file) {
  const reader = new FileReader();

  reader.onload = () => importXML(reader.result, { kind: 'file', fileName: file.name });
  reader.readAsText(file);
}

async function download() {
  const xml = await exportXML();

  if (!xml) {
    return;
  }

  const link = document.createElement('a');

  link.href = URL.createObjectURL(new Blob([ xml ], { type: 'application/xml' }));
  link.download = state.source.fileName || 'diagram.bpmn';
  link.click();

  URL.revokeObjectURL(link.href);
}

function describeSource(source) {
  if (!source) {
    return 'diagram';
  }

  return source.kind === 'sample' ? `sample "${findSample(source.id)?.name || source.id}"` : source.fileName;
}

function findSample(id) {
  return samples.find(sample => sample.id === id);
}


// ui //////////

function setStatus(message, kind = 'ok') {
  statusEl.textContent = message;
  statusEl.dataset.kind = kind;
}

function showTab(name) {
  state.tab = name;

  document.querySelectorAll('[data-tab]').forEach(tab => {
    tab.setAttribute('aria-selected', String(tab.dataset.tab === name));
  });

  document.querySelectorAll('[data-pane]').forEach(pane => {
    pane.hidden = pane.dataset.pane !== name;
  });

  persist();
}

function persist() {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage may be unavailable; the playground still works without it
  }
}

function restore() {
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY));

    if (stored && stored.xml) {
      Object.assign(state, stored);
    }
  } catch {
    // ignore unreadable state
  }
}

samples.forEach(sample => {
  const option = document.createElement('option');

  option.value = sample.id;
  option.textContent = sample.name;
  sampleEl.appendChild(option);
});

sampleEl.addEventListener('change', () => {
  const sample = findSample(sampleEl.value);

  importXML(sample.xml, { kind: 'sample', id: sample.id, fileName: sample.fileName });
});

document.getElementById('new').addEventListener('click', () => {
  importXML(emptyDiagram, { kind: 'sample', id: 'empty', fileName: 'diagram.bpmn' });
});

document.getElementById('open').addEventListener('click', () => fileEl.click());

fileEl.addEventListener('change', () => {
  if (fileEl.files[0]) {
    openFile(fileEl.files[0]);
  }

  fileEl.value = '';
});

document.querySelectorAll('[data-mode]').forEach(button => {
  button.addEventListener('click', () => switchMode(button.dataset.mode));
});

document.getElementById('download').addEventListener('click', download);

document.getElementById('import-xml').addEventListener('click', () => {
  importXML(xmlEl.value, { kind: 'file', fileName: state.source.fileName || 'diagram.bpmn' });
});

document.querySelectorAll('[data-tab]').forEach(tab => {
  tab.addEventListener('click', () => showTab(tab.dataset.tab));
});

document.addEventListener('dragover', event => {
  event.preventDefault();
  document.body.classList.add('dragging');
});

document.addEventListener('dragleave', event => {
  if (!event.relatedTarget) {
    document.body.classList.remove('dragging');
  }
});

document.addEventListener('drop', event => {
  event.preventDefault();
  document.body.classList.remove('dragging');

  const file = event.dataTransfer.files[0];

  if (file) {
    openFile(file);
  }
});

restore();

if (state.source.kind === 'sample') {
  sampleEl.value = state.source.id;
}

showTab(state.tab);
switchMode(state.mode);

window.bpmnPlayground = {
  get instance() {
    return instance;
  },
  get problems() {
    return problems;
  },
  importXML: xml => importXML(xml, { kind: 'file', fileName: 'diagram.bpmn' }),
  exportXML
};
