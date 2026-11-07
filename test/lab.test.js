import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { createTheme, themePresets, exportThemeCSS, exportThemeJSON } from '../src/themes.js';
import { applicationExamples, applicationSnippet } from '../docs/application-examples.js';
import { applicationBlocks } from '../docs/application-blocks.js';
import { renderLabPage } from '../docs/lab-page.js';

class Node {
  constructor(tag, doc) { this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.children = []; this.events = new Map(); this.attrs = new Map(); this.dataset = {}; this.value = ''; this.textContent = ''; this.className = ''; this.style = { values: new Map(), setProperty(name, value) { this.values.set(name, value); } }; }
  setAttribute(name, value) { this.attrs.set(name, String(value)); } getAttribute(name) { return this.attrs.get(name) ?? null; }
  addEventListener(type, fn, options = {}) { if (options.signal?.aborted) return; if (!this.events.has(type)) this.events.set(type, new Set()); this.events.get(type).add(fn); options.signal?.subscribe?.(() => this.removeEventListener(type, fn)); }
  removeEventListener(type, fn) { this.events.get(type)?.delete(fn); }
  async emit(type, properties = {}) { const event = { target: this, preventDefault() { this.defaultPrevented = true; }, ...properties }; await Promise.all([...(this.events.get(type) ?? [])].map((fn) => fn(event))); return event; }
  append(...nodes) { nodes.forEach((node) => { node.parent = this; this.children.push(node); }); }
  remove() { if (this.parent) this.parent.children = this.parent.children.filter((node) => node !== this); }
  closest(selector) { return selector === 'article' && this.tagName === 'ARTICLE' || /^\[[\w-]+\]$/.test(selector) && this.attrs.has(selector.slice(1, -1)) ? this : this.parent?.closest(selector) ?? null; }
  querySelector(selector) { return this.children.find((node) => selector === 'textarea' ? node.tagName === 'TEXTAREA' : selector.startsWith('.') ? node.className === selector.slice(1) : /^\[[\w-]+\]$/.test(selector) && node.attrs.has(selector.slice(1, -1))) ?? this.children.map((node) => node.querySelector(selector)).find(Boolean) ?? null; }
  focus() { this.ownerDocument.activeElement = this; } select() { this.selected = true; }
  click() { if (this.tagName === 'A') this.ownerDocument.downloads.push({ href: this.href, filename: this.download }); else return this.emit('click'); }
}
const flush = () => new Promise((resolve) => setImmediate(resolve));
async function harness({ deniedClipboard = false } = {}) {
  const html = renderLabPage(), doc = { activeElement: null, downloads: [] }, nodes = new Map(), all = [];
  doc.createElement = (tag) => new Node(tag, doc); doc.body = doc.createElement('body');
  for (const match of html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)) {
    const attributes = Object.fromEntries([...match[2].matchAll(/([\w-]+)="([^"]*)"/g)].map((item) => [item[1], item[2]]));
    if (!attributes.id && !/\bdata-/.test(match[2])) continue;
    const node = doc.createElement(match[1]);
    for (const [name, value] of Object.entries(attributes)) { node.setAttribute(name, value); if (name === 'value') node.value = value; if (name === 'id') { node.id = value; nodes.set(value, node); } if (name.startsWith('data-')) node.dataset[name.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value; }
    for (const [, attr] of match[2].matchAll(/\b(data-[\w-]+)(?=[\s=>]|$)/g)) if (!node.attrs.has(attr)) node.setAttribute(attr, '');
    all.push(node);
  }
  const matches = (node, selector) => { const found = selector.match(/^\[([\w-]+)\]$/); return found ? node.attrs.has(found[1]) : false; };
  doc.getElementById = (id) => { if (!nodes.has(id)) throw new Error(`Missing lab node ${id}`); return nodes.get(id); };
  doc.querySelector = (selector) => all.find((node) => matches(node, selector)) ?? null;
  doc.querySelectorAll = (selector) => selector === '[data-menu-example] [data-ug-menu-item]' ? all.filter((node) => node.attrs.has('data-ug-menu-item')) : all.filter((node) => matches(node, selector));
  // Boolean-only root attributes need a node even when the source has no ID or valued data attribute.
  for (const attr of ['data-writing-example', 'data-combobox-example', 'data-menu-example', 'data-drawer-example', 'data-table-example', 'data-menu-result']) if (!doc.querySelector(`[${attr}]`)) { const node = doc.createElement('div'); node.setAttribute(attr, ''); all.push(node); }
  for (const button of all.filter((node) => node.dataset.labCopy)) { const article = doc.createElement('article'); article.append(button); }
  const editor = doc.querySelector('[data-editor-block]');
  if (editor) editor.append(...all.filter((node) => ['data-editor-title', 'data-editor-export', 'data-editor-export-status'].some((attr) => node.attrs.has(attr))));
  nodes.get('theme-mode').value = 'light';
  const win = new Node('window', doc), bindings = [], copied = [], blobs = new Map(), revoked = []; let nextURL = 0;
  const stub = (kind) => (node, options) => { const record = { kind, node, options, destroyed: 0, value: 'يەرلىك مەزمۇن' }; bindings.push(record); return { getValue() { return record.value; }, destroy() { record.destroyed++; } }; };
  class AbortControllerMock { constructor() { this.signal = { aborted: false, cleanup: [], subscribe(fn) { this.cleanup.push(fn); } }; } abort() { this.signal.aborted = true; this.signal.cleanup.splice(0).forEach((fn) => fn()); } }
  class LabURL extends URL { static createObjectURL(blob) { const value = `blob:lab-${++nextURL}`; blobs.set(value, blob); return value; } static revokeObjectURL(value) { revoked.push(value); } }
  const context = vm.createContext({ document: doc, window: win, AbortController: AbortControllerMock, URL: LabURL, Blob, createTheme, themePresets, exportThemeCSS, exportThemeJSON, applicationExamples, applicationSnippet, applicationBlocks,
    initDocsShell: stub('shell'), bindUyghurInput: stub('writing'), bindDialog: stub('dialog'), bindCombobox: stub('combobox'), bindDropdown: stub('dropdown'), bindDrawer: stub('drawer'), bindDataTable: stub('table'),
    navigator: { clipboard: { async writeText(text) { if (deniedClipboard) throw new Error('Clipboard denied'); copied.push(text); } } },
  });
  const source = (await readFile(new URL('../docs/lab.js', import.meta.url), 'utf8')).replace(/^import[^\n]+\n/gm, '');
  vm.runInContext(source, context); return { nodes, all, doc, win, bindings, copied, blobs, revoked, context };
}

test('lab mounts its authored application examples and updates the preview from real theme controls', async () => {
  const f = await harness(), node = (id) => f.nodes.get(id);
  for (const kind of ['shell', 'writing', 'dialog', 'combobox', 'dropdown', 'drawer', 'table']) assert.ok(f.bindings.some((binding) => binding.kind === kind), kind);
  assert.equal(f.bindings.filter((binding) => binding.kind === 'writing').length, 2);
  assert.equal(f.bindings.filter((binding) => binding.kind === 'table').length, 2);
  assert.ok(f.bindings.find((binding) => binding.kind === 'table').options.pageSize === 3);
  assert.equal(node('theme-preview').style.values.get('--ug-blue'), themePresets[0].accent);
  const preset = f.all.find((button) => button.dataset.themePreset === 'atlas'); await preset.emit('click');
  assert.equal(node('theme-accent').value, themePresets[1].accent); assert.equal(preset.getAttribute('aria-pressed'), 'true');
  node('theme-mode').value = 'dark'; node('theme-accent').value = '#123456'; node('theme-radius').value = '18'; node('theme-font-size').value = '20'; node('theme-line-height').value = '2.4'; await node('theme-controls').emit('input');
  const expected = createTheme('atlas', { mode: 'dark', accent: '#123456', radius: 18, fontSize: 20, lineHeight: 2.4 });
  assert.equal(node('theme-preview').dataset.ugTheme, 'dark');
  for (const [key, value] of Object.entries(expected.tokens)) assert.equal(node('theme-preview').style.values.get(key), value, key);
  assert.equal(node('theme-css-source').textContent, exportThemeCSS(expected)); assert.equal(node('theme-radius-value').textContent, '18px'); assert.equal(node('theme-font-size-value').textContent, '20px'); assert.equal(node('theme-line-height-value').textContent, '2.4');
  assert.ok(node('theme-contrast').textContent.includes(expected.contrast.button.toFixed(2) + ':1')); assert.ok(node('theme-contrast').textContent.includes(expected.contrast.text.toFixed(2) + ':1'));
  assert.ok((await node('theme-controls').emit('submit')).defaultPrevented);
  await node('theme-preview-action').emit('click'); assert.match(node('theme-action-status').textContent, /ھەرىكەت تەييار/);
  await node('theme-reset').emit('click'); assert.equal(node('theme-preview').dataset.ugTheme, 'light'); assert.equal(node('theme-preview').style.values.get('--ug-blue'), themePresets[0].accent);
});

test('lab copies exact generated CSS and uses a selectable plain-text fallback for denied clipboard access', async () => {
  const good = await harness(); await good.nodes.get('theme-copy-css').emit('click'); assert.equal(good.copied[0], good.nodes.get('theme-css-source').textContent);
  const denied = await harness({ deniedClipboard: true }); await denied.nodes.get('theme-copy-css').emit('click');
  const textarea = denied.nodes.get('theme-controls').querySelector('textarea'); assert.ok(textarea); assert.equal(textarea.value, denied.nodes.get('theme-css-source').textContent); assert.ok(textarea.readOnly); assert.ok(textarea.selected); assert.equal(denied.doc.activeElement, textarea);
  const copy = denied.all.find((node) => node.dataset.labCopy === 'combobox'); await copy.emit('click'); await flush();
  const sample = copy.closest('article').querySelector('textarea'); assert.equal(sample.value, applicationSnippet(applicationExamples.find((entry) => entry.id === 'combobox'))); assert.ok(sample.selected);
});

test('lab downloads actual CSS/JSON blobs, replaces owned URLs, and cleans up only after a non-BFcache pagehide', async () => {
  const f = await harness(); await f.nodes.get('theme-download-css').emit('click'); await f.nodes.get('theme-download-json').emit('click');
  const [css, json] = f.doc.downloads; assert.equal(css.filename, 'uyghur-ui-doppa.css'); assert.equal(json.filename, 'uyghur-ui-doppa.json');
  assert.equal(await f.blobs.get(css.href).text(), f.nodes.get('theme-css-source').textContent);
  assert.deepEqual(JSON.parse(await f.blobs.get(json.href).text()), JSON.parse(exportThemeJSON(createTheme())));
  await f.nodes.get('theme-download-css').emit('click'); assert.deepEqual(f.revoked, [css.href]);
  await f.win.emit('pagehide', { persisted: true }); assert.ok(f.bindings.every((binding) => binding.destroyed === 0));
  await f.win.emit('pagehide', { persisted: false }); assert.ok(f.bindings.every((binding) => binding.destroyed === 1));
  assert.ok(f.doc.downloads.every((download) => f.revoked.includes(download.href)));
  const count = f.doc.downloads.length; await f.nodes.get('theme-download-json').emit('click'); assert.equal(f.doc.downloads.length, count);
});

test('static lab output has six real application examples with unique IDs, native controls, labels and export hooks', () => {
  const html = renderLabPage(); assert.match(html, /<html lang="ug" dir="rtl">/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]); assert.equal(ids.length, new Set(ids).size);
  const examples = [...html.matchAll(/data-lab-example="([^"]+)"/g)].map((match) => match[1]); assert.deepEqual(examples, applicationExamples.map((entry) => entry.id));
  for (const entry of applicationExamples) { assert.ok(html.includes(entry.html)); assert.ok(html.includes(`data-lab-copy="${entry.id}"`)); }
  const blocks = [...html.matchAll(/data-lab-block="([^"]+)"/g)].map((match) => match[1]); assert.deepEqual(blocks, applicationBlocks.map((entry) => entry.id));
  for (const entry of applicationBlocks) assert.ok(html.includes(entry.html));
  assert.match(html, /<textarea[^>]+data-ug-writing-input/); assert.match(html, /<input[^>]+data-ug-combobox-input/); assert.match(html, /<dialog[^>]+data-ug-drawer/); assert.match(html, /<table class="ug-table">/);
  for (const id of ['theme-copy-css', 'theme-download-css', 'theme-download-json', 'theme-preview', 'theme-contrast']) assert.ok(ids.includes(id));
  assert.match(html, /<script type="module" src="docs\/lab\.js">/);
});

test('article editor block exports current local text with real paragraph breaks and owns its download URL', async () => {
  const f = await harness(), editor = f.doc.querySelector('[data-editor-block]');
  const title = editor.querySelector('[data-editor-title]'), button = editor.querySelector('[data-editor-export]'); title.value = '<ماۋزۇ> Title';
  const writer = f.bindings.find((binding) => binding.kind === 'writing' && binding.node === editor); writer.value = 'بىرىنچى قۇر\nئىككىنچى قۇر';
  await button.emit('click'); const first = f.doc.downloads.at(-1); assert.equal(first.filename, 'uyghur-article.txt'); assert.equal(await f.blobs.get(first.href).text(), `${title.value}\n\n${writer.value}`);
  await button.emit('click'); assert.ok(f.revoked.includes(first.href));
  await f.win.emit('pagehide', { persisted: false }); assert.ok(f.revoked.includes(f.doc.downloads.at(-1).href));
});

test('the copied editor block script exports the same newline-separated document as its live preview', async () => {
  const f = await harness(), editor = f.doc.querySelector('[data-editor-block]'), button = editor.querySelector('[data-editor-export]');
  editor.querySelector('[data-editor-title]').value = 'ماۋزۇ'; button.events.clear();
  vm.runInContext(applicationBlocks.find((block) => block.id === 'editor-block').js.replace(/^import[^\n]+\n/gm, ''), f.context);
  await button.emit('click'); assert.equal(await f.blobs.get(f.doc.downloads.at(-1).href).text(), 'ماۋزۇ\n\nيەرلىك مەزمۇن');
});
