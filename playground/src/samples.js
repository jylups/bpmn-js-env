import emptyXML from './diagrams/empty.bpmn?raw';
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
    fileName: 'diagram.bpmn',
    xml: emptyXML
  }
];

export const emptyDiagram = emptyXML;
