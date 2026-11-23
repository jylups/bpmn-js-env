// Takes the screenshots of the properties panel README from the running
// playground (npm run dev, port 5180):
//
//   node scripts/panel-screenshots.js [playground-url]
//
// Uses the local Chrome (Playwright channel "chrome"); set
// PLAYWRIGHT_CHANNEL= to use Playwright's own Chromium instead.

/* global document, window -- used in page.evaluate, which runs in the browser */

import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { chromium } from 'playwright';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const panelRepo = join(root, 'bpmn-js-properties-panel-flowable');
const out = join(panelRepo, 'docs', 'screenshots');
const url = process.argv[2] || 'http://localhost:5180';
const channel = process.env.PLAYWRIGHT_CHANNEL ?? 'chrome';

/**
 * fixture: a panel test fixture; element: what to select (null: the process);
 * groups: Flowable groups to open; items: list items to open.
 */
const SHOTS = [
  { name: 'user-task', fixture: 'user-task.bpmn', element: 'review', groups: [ 'flowable-assignment', 'flowable-userTask' ] },
  { name: 'http-task', fixture: 'service-task.bpmn', element: 'httpTask', groups: [ 'flowable-implementation', 'flowable-http' ] },
  { name: 'execution-listener', fixture: 'listeners.bpmn', element: null, groups: [], items: [ 'process-flowable-executionListeners-0' ] },
  { name: 'call-activity', fixture: 'call-activity.bpmn', element: 'callChild', groups: [ 'flowable-callActivity' ] }
];

await mkdir(out, { recursive: true });

const browser = await chromium.launch(channel ? { channel } : {});
const page = await browser.newPage({ viewport: { width: 1040, height: 1180 }, deviceScaleFactor: 1 });

await page.goto(url);
await page.waitForFunction(() => window.bpmnPlayground?.instance);

for (const shot of SHOTS) {
  const xml = await readFile(join(panelRepo, 'test', 'fixtures', shot.fixture), 'utf8');

  await page.evaluate(async ({ xml, shot }) => {
    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    const { importXML, instance } = window.bpmnPlayground;

    await importXML(xml);

    const registry = instance.get('elementRegistry');

    instance.get('canvas').zoom('fit-viewport', 'auto');

    instance.get('selection').select(shot.element ? registry.get(shot.element) : null);
    await wait(300);

    // close every open group, then open the ones to show
    for (const header of document.querySelectorAll('.bio-properties-panel-group-header.open')) {
      header.click();
    }

    await wait(100);

    for (const id of shot.groups) {
      document.querySelector(`[data-group-id="group-${ id }"] .bio-properties-panel-group-header`).click();
      await wait(100);
    }

    for (const id of shot.items || []) {
      const item = document.querySelector(`[data-entry-id="${ id }"]`);
      const group = item.closest('[data-group-id]');
      const groupHeader = group.querySelector('.bio-properties-panel-group-header');

      if (!groupHeader.classList.contains('open')) {
        groupHeader.click();
        await wait(100);
      }

      item.querySelector('.bio-properties-panel-collapsible-entry-header').click();
      await wait(100);
    }

    const first = shot.groups[0] ? `[data-group-id="group-${ shot.groups[0] }"]` : `[data-entry-id="${ shot.items[0] }"]`;

    document.querySelector(first).scrollIntoView({ block: 'start' });
    await wait(200);
  }, { xml, shot });

  const file = join(out, `${ shot.name }.png`);

  await page.locator('.canvas-area').screenshot({ path: file });

  console.log(file);
}

await browser.close();
