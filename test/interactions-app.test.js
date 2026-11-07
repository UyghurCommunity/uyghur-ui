import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { setMaxListeners } from 'node:events';
import { interactionExamples } from '../docs/interactions-data.js';
import { interactionBindings as realBindings } from '../docs/interaction-controls.js';
import { standaloneDocument } from '../docs/interaction-document.js';
import { normalizeDocsQuery } from '../docs/docs-shell.js';

const appURL = new URL('../docs/interactions.js', import.meta.url);
const appSource = (await readFile(appURL, 'utf8')).replace(/^import .*;\n/gm, '').replaceAll('import.meta.url', JSON.stringify(appURL.href));
const css = await readFile(new URL('../docs/interaction-demo.css', import.meta.url), 'utf8');
const flush = () => new Promise((resolve) => setImmediate(resolve));

class Events {
  constructor() { this.events = new Map(); }
  addEventListener(type, listener, options = {}) {
    if (options.signal?.aborted) return;
    if (!this.events.has(type)) this.events.set(type, new Set());
    this.events.get(type).add(listener);
    options.signal?.addEventListener('abort', () => this.removeEventListener(type, listener), { once: true });
  }
  removeEventListener(type, listener) { this.events.get(type)?.delete(listener); }
  emit(type, extra = {}) {
    const event = { type, target: this, ...extra };
    return Promise.all([...(this.events.get(type) ?? [])].map((listener) => listener(event)));
  }
  listenerCount(type) { return this.events.get(type)?.size ?? 0; }
}
class Element extends Events {
  constructor(doc, tag = 'div') {
    super(); this.ownerDocument = doc; this.tagName = tag.toUpperCase(); this.dataset = {};
    this.attrs = new Map(); this.children = []; this.className = ''; this.hidden = false;
    this.value = ''; this.disabled = false; this.open = false; this._text = '';
  }
  set id(value) { this.attrs.set('id', value); this.ownerDocument.nodes.set(value, this); }
  get id() { return this.attrs.get('id'); }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return this._text + this.children.map((child) => child.textContent).join(''); }
  setAttribute(name, value) { this.attrs.set(name, String(value)); }
  getAttribute(name) { return this.attrs.get(name) ?? null; }
  append(...nodes) { for (const node of nodes) { node.parentNode = this; this.children.push(node); } }
  remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter((child) => child !== this); this.parentNode = null; }
  matches(selector) {
    if (selector.startsWith('.')) return this.className.split(/\s+/).includes(selector.slice(1));
    const data = selector.match(/^\[data-([a-z-]+)\]$/);
    if (data) return Object.hasOwn(this.dataset, data[1].replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()));
    return this.tagName.toLowerCase() === selector;
  }
  querySelectorAll(selector) { return this.children.flatMap((child) => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]); }
  querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null; }
  focus(options) { this.ownerDocument.activeElement = this; this.focusOptions = options; }
  select() { this.ownerDocument.selectedText = this.value; }
  scrollIntoView(options) { this.scrollOptions = options; }
  click() {
    if (this.tagName === 'A') this.ownerDocument.downloads.push({ href: this.href, filename: this.download });
    return this.emit('click');
  }
}

function harness() {
  const doc = new Events(), win = new Events(), media = new Events();
  Object.assign(doc, { nodes: new Map(), hidden: false, downloads: [] });
  doc.createElement = (tag) => new Element(doc, tag);
  doc.getElementById = (id) => doc.nodes.get(id) ?? null;
  doc.documentElement = doc.createElement('html'); doc.body = doc.createElement('body');
  doc.documentElement.append(doc.body); doc.activeElement = doc.body;
  doc.querySelectorAll = (selector) => doc.body.querySelectorAll(selector);
  const add = (tag, parent = doc.body, { id, data, className, text } = {}) => {
    const node = doc.createElement(tag); if (id) node.id = id;
    Object.assign(node.dataset, data); if (className) node.className = className;
    if (text) node.textContent = text; parent.append(node); return node;
  };
  for (const id of ['interactions-search', 'interactions-pause', 'interactions-results', 'interactions-empty', 'interactions-motion-status']) add(id.includes('search') ? 'input' : id.includes('pause') ? 'button' : 'p', doc.body, { id });
  doc.getElementById('interactions-pause').hidden = true;
  const filters = ['all', 'pointer', 'actions', 'data'].map((category) => add('button', doc.body, { data: { interactionCategory: category } }));
  const records = new Map(interactionExamples.map((example) => {
    const card = add('article', doc.body, { id: `interaction-${example.id}` });
    const root = add('div', card, { data: { interaction: example.id, motion: 'paused', phase: 'ready' } });
    const details = add('details', card, { data: { code: example.id } });
    const body = add('div', details, { className: 'ix-code-body' });
    const copy = add('button', body, { data: { copyExample: example.id } });
    const download = add('button', body, { data: { downloadExample: example.id } });
    const code = add('code', add('pre', body), { data: { exampleSource: example.id }, text: 'Lazy source placeholder' });
    const status = add('p', body, { data: { exampleStatus: example.id } });
    return [example.id, { example, card, root, details, body, copy, download, code, status }];
  }));
  media.matches = false;
  const lifecycle = new Map(), bindings = {};
  for (const example of interactionExamples) {
    bindings[example.id] = function mount(root, { motionAllowed }) {
      const record = { root, allowed: motionAllowed, sync: [], destroyed: 0 };
      lifecycle.set(example.id, record);
      return { syncMotion() { record.sync.push(motionAllowed()); }, destroy() { record.destroyed++; } };
    };
    // Preserve real portable controller code while replacing only its DOM lifecycle.
    bindings[example.id].toString = () => realBindings[example.id].toString();
  }
  const observers = [], requests = [], written = [], blobs = new Map(), revoked = [];
  let blobCount = 0, clipboardDenied = false;
  class Observer {
    constructor(callback) { this.callback = callback; this.observed = new Set(); this.disconnected = false; observers.push(this); }
    observe(node) { this.observed.add(node); }
    disconnect() { this.disconnected = true; this.observed.clear(); }
    deliver(root, isIntersecting) { this.callback([{ target: root, isIntersecting }]); }
  }
  class ObjectURL extends URL {
    static createObjectURL(blob) { const url = `blob:interaction-test-${++blobCount}`; blobs.set(url, blob); return url; }
    static revokeObjectURL(url) { revoked.push(url); blobs.delete(url); }
  }
  class Controller extends AbortController { constructor() { super(); setMaxListeners(0, this.signal); } }
  const fetch = (url, options) => new Promise((resolve, reject) => {
    const request = { url: String(url), signal: options.signal, resolve, reject }; requests.push(request);
    options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
  });
  const clipboard = { async writeText(text) { if (clipboardDenied) throw new Error('Clipboard denied'); written.push(text); } };
  const shell = { destroyed: 0, destroy() { this.destroyed++; } };
  const links = { destroyed: 0, destroy() { this.destroyed++; } };
  const location = { hash: '' };
  Object.assign(win, { IntersectionObserver: Observer, document: doc });
  doc.defaultView = win;
  runInNewContext(appSource, {
    document: doc, window: win, location, navigator: { clipboard }, URL: ObjectURL, Blob, AbortController: Controller,
    matchMedia: () => media, IntersectionObserver: Observer, fetch,
    initDocsShell: () => shell, normalizeDocsQuery, interactionExamples, interactionBindings: bindings, standaloneDocument,
    bindGalleryLinks(_window, _document, reveal) { links.reveal = reveal; return links; },
  }, { filename: appURL.pathname });
  return {
    doc, win, media, records, lifecycle, filters, observers, requests, written, blobs, revoked, shell, links, location,
    get: doc.getElementById, visible: () => [...records].filter(([, record]) => !record.card.hidden).map(([id]) => id),
    denyClipboard(value) { clipboardDenied = value; },
    async search(value) { doc.getElementById('interactions-search').value = value; await doc.getElementById('interactions-search').emit('input'); },
    async category(value) { await filters.find((node) => node.dataset.interactionCategory === value).click(); },
    respond(index, response = { ok: true, text: async () => css }) { requests[index].resolve(response); },
    async destroy() { await win.emit('pagehide', { persisted: false }); await flush(); },
  };
}

test('actual gallery filters bilingual aliases with category and reveals filtered deep-link destinations', async () => {
  const app = harness();
  assert.equal(app.visible().length, 6);
  assert.equal(app.requests.length, 0, 'stylesheet/source generation is lazy');
  await app.search('خەرىتە'); assert.deepEqual(app.visible(), ['compare']);
  await app.category('actions'); assert.deepEqual(app.visible(), []);
  assert.equal(app.get('interactions-empty').hidden, false);
  assert.match(app.get('interactions-results').textContent, /0/);
  await app.category('all'); await app.search('ETLES'); assert.deepEqual(app.visible(), ['selection']);
  await app.search('no-such-effect'); assert.deepEqual(app.visible(), []);
  app.location.hash = '#interaction-send'; app.links.reveal();
  assert.equal(app.visible().length, 6);
  assert.equal(app.get('interactions-search').value, '');
  assert.equal(app.filters[0].getAttribute('aria-pressed'), 'true');
  const target = app.records.get('send').card;
  assert.equal(app.doc.activeElement, target);
  assert.equal(target.tabIndex, -1);
  assert.equal(target.scrollOptions.block, 'start');
  assert.equal(app.get('interactions-empty').hidden, true);
  await app.destroy();
});

test('pause, reduced motion, visibility, viewport, and filtering all gate actual controller lifecycle sync', async () => {
  const app = harness(), observer = app.observers[0], pause = app.get('interactions-pause');
  assert.equal(observer.observed.size, 6);
  assert.equal(pause.hidden, false);
  for (const record of app.lifecycle.values()) assert.equal(record.allowed(), true);
  const tilt = app.lifecycle.get('tilt'), originalSyncs = tilt.sync.length;
  observer.deliver(tilt.root, false);
  assert.equal(tilt.allowed(), false); assert.equal(tilt.root.dataset.motion, 'paused');
  assert.ok(tilt.sync.length > originalSyncs); assert.equal(tilt.sync.at(-1), false);
  await pause.click();
  assert.equal(pause.getAttribute('aria-pressed'), 'true');
  assert.ok([...app.lifecycle.values()].every((record) => !record.allowed()));
  observer.deliver(tilt.root, true); assert.equal(tilt.allowed(), false, 'viewport cannot override explicit pause');
  await pause.click(); assert.equal(tilt.allowed(), true);
  app.media.matches = true; await app.media.emit('change');
  assert.equal(pause.disabled, true); assert.equal(tilt.allowed(), false);
  assert.match(app.get('interactions-motion-status').textContent, /سىستېمىڭىز/);
  app.media.matches = false; await app.media.emit('change'); assert.equal(tilt.allowed(), true);
  app.doc.hidden = true; await app.doc.emit('visibilitychange'); assert.equal(tilt.allowed(), false);
  app.doc.hidden = false; await app.doc.emit('visibilitychange'); assert.equal(tilt.allowed(), true);
  await app.category('actions'); assert.equal(tilt.allowed(), false);
  assert.equal(app.lifecycle.get('send').allowed(), true);
  await app.category('all'); assert.equal(tilt.allowed(), true);
  await app.destroy();
});

test('lazy stylesheet failures retry, concurrent copy shares the source, and clipboard denial preserves exact selectable HTML', async () => {
  const app = harness(), selection = app.records.get('selection');
  selection.details.open = true; await selection.details.emit('toggle');
  assert.equal(app.requests.length, 1);
  assert.equal(app.requests[0].url, new URL('../docs/interaction-demo.css', import.meta.url).href);
  app.respond(0, { ok: false }); await flush();
  assert.match(selection.status.textContent, /قايتا سىناڭ/);
  assert.match(selection.code.textContent, /يۈكلەنمىدى/);
  selection.details.open = false; await selection.details.emit('toggle');
  selection.details.open = true; await selection.details.emit('toggle');
  app.denyClipboard(true);
  const copying = selection.copy.click();
  assert.equal(app.requests.length, 2, 'opening and copying retry through a single shared request');
  app.respond(1); await copying; await flush();
  const panel = selection.card.querySelector('.ix-manual-copy'), textarea = panel.querySelector('textarea');
  assert.ok(textarea.readOnly); assert.equal(textarea.dir, 'ltr');
  assert.equal(textarea.value, selection.code.textContent);
  assert.equal(app.doc.selectedText, textarea.value); assert.equal(app.doc.activeElement, textarea);
  assert.match(textarea.value, /^<!doctype html>/);
  assert.ok(textarea.value.includes(css));
  assert.ok(textarea.value.includes(realBindings.selection.toString()));
  assert.match(textarea.value, /lang="ug" dir="rtl"/);
  assert.match(selection.status.textContent, /قولدا/);
  await selection.copy.click();
  assert.equal(selection.card.querySelectorAll('.ix-manual-copy').length, 1, 'retries replace the fallback');
  app.denyClipboard(false); await selection.copy.click();
  assert.equal(app.written.at(-1), textarea.value);
  assert.match(selection.status.textContent, /كۆچۈرۈلدى/);
  assert.equal(app.requests.length, 2, 'successful CSS/source remains cached');
  await app.destroy();
});

test('downloads reuse one URL per example, survive BFCache, and revoke all resources at actual teardown', async () => {
  const app = harness(), first = app.records.get('spotlight');
  const pending = first.download.click(); app.respond(0); await pending;
  for (const record of app.records.values()) { await record.download.click(); await record.download.click(); }
  assert.equal(app.requests.length, 1, 'all examples share their demo stylesheet');
  assert.equal(app.blobs.size, 6, 'repeated downloads are bounded to one URL per example');
  for (const [id, record] of app.records) {
    const downloads = app.doc.downloads.filter(({ filename }) => filename === `uyghur-ui-${id}.html`);
    assert.ok(downloads.length >= 2);
    assert.equal(new Set(downloads.map(({ href }) => href)).size, 1, `${id}: stable reusable URL`);
    const blob = app.blobs.get(downloads[0].href), html = await blob.text();
    assert.equal(blob.type, 'text/html;charset=utf-8');
    assert.equal(html, record.code.textContent);
    assert.ok(html.includes(record.example.title));
    if (id === 'compare') { assert.match(html, /data:image\/svg\+xml/); assert.doesNotMatch(html, /src="assets\/maps\//); }
  }
  assert.equal(app.doc.body.querySelectorAll('a').length, 0, 'temporary download links are removed');
  await app.win.emit('pagehide', { persisted: true });
  assert.equal(app.blobs.size, 6); assert.equal(app.revoked.length, 0);
  assert.ok([...app.lifecycle.values()].every((record) => record.destroyed === 0));
  await app.get('interactions-pause').click();
  assert.equal(app.lifecycle.get('send').allowed(), false, 'BFCache preserves functional bindings');
  const urls = [...app.blobs.keys()];
  await app.destroy();
  assert.equal(app.blobs.size, 0); assert.deepEqual([...app.revoked].sort(), urls.sort());
  assert.ok([...app.lifecycle.values()].every((record) => record.destroyed === 1));
  assert.equal(app.shell.destroyed, 1); assert.equal(app.links.destroyed, 1);
  assert.equal(app.observers[0].disconnected, true);
  assert.equal(app.media.listenerCount('change'), 0); assert.equal(app.doc.listenerCount('visibilitychange'), 0);
  assert.equal(app.get('interactions-search').listenerCount('input'), 0);
  assert.equal(first.copy.listenerCount('click'), 0); assert.equal(first.download.listenerCount('click'), 0);
});

test('real pagehide aborts an in-flight shared source fetch and suppresses stale copy/download UI writes', async () => {
  const app = harness(), send = app.records.get('send');
  const originalCode = send.code.textContent, originalStatus = send.status.textContent;
  const copying = send.copy.click(), downloading = send.download.click();
  assert.equal(app.requests.length, 1);
  const request = app.requests[0];
  await app.win.emit('pagehide', { persisted: true });
  assert.equal(request.signal.aborted, false, 'BFCache does not cancel pending work');
  await app.destroy(); await Promise.all([copying, downloading]); await flush();
  assert.equal(request.signal.aborted, true);
  assert.equal(send.code.textContent, originalCode); assert.equal(send.status.textContent, originalStatus);
  assert.equal(app.written.length, 0); assert.equal(app.blobs.size, 0); assert.equal(app.doc.downloads.length, 0);
  assert.equal(send.card.querySelector('.ix-manual-copy'), null);
  assert.ok([...app.lifecycle.values()].every((record) => record.destroyed === 1));
  assert.equal(app.get('interactions-pause').listenerCount('click'), 0);
});
