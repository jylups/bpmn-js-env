import { createNewDiagramXML } from '@jylups/flowable-bpmn-js';

import flowableBasicsXML from './diagrams/flowable-basics.bpmn20.xml?raw';

/**
 * Diagrams offered in the playground's sample menu.
 */
export const samples = [
  {
    id: 'flowable-basics',
    name: 'Flowable basics (user task, listeners, mail task)',
    fileName: 'flowable-basics.bpmn20.xml',
    xml: flowableBasicsXML
  },
  {
    id: 'empty',
    name: 'Empty process',
    fileName: 'diagram.bpmn20.xml',
    xml: createNewDiagramXML({ processId: 'Process_1' })
  }
];

/**
 * A new process, from the editor's template, with its own process key.
 */
export function newDiagram() {
  return createNewDiagramXML();
}
