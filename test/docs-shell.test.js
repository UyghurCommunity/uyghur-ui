import test from 'node:test';
import assert from 'node:assert/strict';
import { initDocsShell, normalizeDocsQuery, prepareSearchIndex, resolveSearchHref, searchDocumentation } from '../docs/docs-shell.js';

const INDEX = 'https://example.test/uyghur-ui/assets/docs-search.json';
const payload = { version: '0.2.0', entries: [
  { title: 'كۇنۇپكىلار', en: 'Buttons', description: 'كۇنۇپكا مىساللىرى', href: 'guide/components.html#buttons', keywords: ['button', 'native'] },
  { title: 'قاچىلاش', en: 'Installation', description: 'GitHub نەشرىنى قاچىلاڭ', href: 'guide/installation.html', keywords: ['npm', 'pnpm', 'yarn'] },
  { title: 'تېز باشلاش', en: 'Quick start', description: 'تۇنجى بۆلەكنى قۇرايلى', href: 'guide/quick-start.html', keywords: ['HTML', 'CSS'] },
  { title: 'راۋاپ', en: 'Rawap', description: 'ئەنئەنىۋى سىنبەلگە', href: 'index.html#icons', keywords: ['rawab', 'راۋاب', 'instrument'] },
  { title: '<img src=x onerror=alert(1)>', en: 'Plain text title', description: '<script>example</script>', href: 'guide/faq.html', keywords: ['literal'] },
] };

class Hub {
  constructor() { this.events = new Map(); }
  addEventListener(name, fn) { if (!this.events.has(name)) this.events.set(name, new Set()); this.events.get(name).add(fn); }
  removeEventListener(name, fn) { this.events.get(name)?.delete(fn); }
  emit(name, options = {}) {
    const event = { type: name, target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...options };
    this.pending = [...(this.events.get(name) || [])].map((fn) => fn(event)); return event;
  }
  async settled() { await Promise.all(this.pending || []); }
}
class Element extends Hub {
  constructor(doc, tag = 'div') { super(); this.ownerDocument = doc; this.tagName = tag.toUpperCase(); this.attrs = new Map(); this.children = []; this.dataset = {}; this.hidden = false; this.isConnected = true; this.value = ''; this._text = ''; this.className = ''; }
  get id() { return this.attrs.get('id') || ''; }
  set id(value) { this.attrs.set('id', value); this.ownerDocument.nodes.set(value, this); }
  get textContent() { return this._text + this.children.map((node) => node.textContent).join(''); }
  set textContent(value) { this._text = String(value); this.children = []; }
  get parentElement() { return this.parentNode; }
  get classList() { return { contains: (name) => this.className.split(/\s+/).includes(name) }; }
  get href() { return this.getAttribute('href'); }
  set href(value) { this.setAttribute('href', value); }
  getAttribute(name) { return this.attrs.get(name) ?? null; }
  setAttribute(name, value) { this.attrs.set(name, String(value)); }
  removeAttribute(name) { this.attrs.delete(name); }
  append(...nodes) { for (const node of nodes) { if (node.parentNode) node.parentNode.children = node.parentNode.children.filter((child) => child !== node); node.parentNode = this; node.isConnected = true; this.children.push(node); } }
  replaceChildren(...nodes) { this.children.forEach((node) => { node.parentNode = null; }); this.children = []; this._text = ''; this.append(...nodes); }
  insertBefore(node, reference) { const position = this.children.indexOf(reference); assert.ok(position >= 0); if (node.parentNode) node.parentNode.children = node.parentNode.children.filter((child) => child !== node); node.parentNode = this; node.isConnected = true; this.children.splice(position, 0, node); }
  remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter((child) => child !== this); this.parentNode = null; this.isConnected = false; }
  contains(node) { return node === this || this.children.some((child) => child.contains(node)); }
  matches(selector) {
    if (selector === 'a[href]') return this.tagName === 'A' && this.attrs.has('href');
    if (selector === '[data-ug-close]') return this.attrs.has('data-ug-close');
    if (selector === '[contenteditable=""]' || selector === '[contenteditable="true"]') return this.getAttribute('contenteditable') === selector.slice(18, -2);
    if (selector.startsWith('.')) return this.classList.contains(selector.slice(1));
    return this.tagName.toLowerCase() === selector;
  }
  closest(selector) { if (selector.split(',').some((part) => this.matches(part.trim()))) return this; return this.parentNode?.closest(selector) || null; }
  querySelectorAll(selector) { const found = []; for (const node of this.children) { if (node.matches(selector)) found.push(node); found.push(...node.querySelectorAll(selector)); } return found; }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  focus() { this.ownerDocument.activeElement = this; }
  select() { this.ownerDocument.selectedText = this.value; }
  click() { return this.emit('click'); }
  showModal() { this.open = true; }
  close() { this.open = false; queueMicrotask(() => this.emit('close')); }
  getBoundingClientRect() { return { top: this.top || 0, bottom: (this.top || 0) + 300 }; }
}
function fixture() {
  const doc = new Hub(); doc.nodes = new Map(); doc.copyBlocks = []; doc.tocLinks = [];
  doc.createElement = (tag) => new Element(doc, tag); doc.getElementById = (id) => doc.nodes.get(id) || null;
  doc.documentElement = doc.createElement('html'); doc.body = doc.createElement('body'); doc.documentElement.append(doc.body); doc.activeElement = doc.body;
  doc.location = { href: 'https://example.test/uyghur-ui/guide/installation.html', hash: '' }; doc.baseURI = doc.location.href; doc.body.dataset.searchIndex = '../assets/docs-search.json';
  doc.querySelector = (selector) => selector === 'dialog[open]' ? [...doc.nodes.values()].find((node) => node.tagName === 'DIALOG' && node.open) || null : null;
  doc.querySelectorAll = (selector) => selector.includes('data-docs-toc') ? doc.tocLinks : selector.includes('pre') ? doc.copyBlocks : [];
  const win = new Hub(), storage = new Map(), media = new Hub(); media.matches = false;
  Object.assign(win, { navigator: { clipboard: { writeText: async () => {} } }, localStorage: { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) }, matchMedia: () => media, setTimeout, clearTimeout, requestAnimationFrame: (fn) => setTimeout(fn, 0), cancelAnimationFrame: clearTimeout, AbortController });
  win.fetch = async () => ({ ok: true, json: async () => payload }); doc.defaultView = win;
  const add = (tag, id, parent = doc.body) => { const node = doc.createElement(tag); node.id = id; parent.append(node); return node; };
  add('button', 'theme').hidden = true; add('button', 'docs-search-open').hidden = true;
  const search = add('dialog', 'docs-search-dialog'); search.setAttribute('aria-label', 'Search');
  add('input', 'docs-search-input', search); add('div', 'docs-search-results', search); add('p', 'docs-search-status', search);
  add('button', 'docs-menu-open').hidden = true; const menu = add('dialog', 'docs-menu-dialog'); menu.setAttribute('aria-label', 'Menu');
  add('div', 'docs-copy-status');
  return { doc, win, storage, media, add, get: doc.getElementById };
}

test('search destinations stay inside the actual project base and reject traversal, schemes and non-documents', () => {
  assert.equal(resolveSearchHref('guide/installation.html', INDEX), 'https://example.test/uyghur-ui/guide/installation.html');
  assert.equal(resolveSearchHref('index.html#icons', INDEX), 'https://example.test/uyghur-ui/index.html#icons');
  assert.equal(resolveSearchHref('interactions.html', INDEX), 'https://example.test/uyghur-ui/interactions.html');
  for (const id of ['spotlight', 'tilt', 'selection', 'send', 'compare', 'ripple']) {
    assert.equal(resolveSearchHref(`interactions.html#interaction-${id}`, INDEX), `https://example.test/uyghur-ui/interactions.html#interaction-${id}`);
  }
  for (const href of ['https://evil.test/', '//evil.test/', 'javascript:alert(1)', '../index.html', 'guide/../index.html', 'guide/%2e%2e/index.html', 'guide/a.html?secret=x', 'assets/icons/dutar.svg', 'index.html#<img>',
    '../interactions.html', 'guide/../interactions.html', '%2e%2e/interactions.html', 'interactions.html/../index.html', 'interactions.html?secret=x', 'interactions.html#../send', 'interactions.html#<img>', 'interactions.html#interaction-%2fcompare',
  ]) assert.equal(resolveSearchHref(href, INDEX), null);
  assert.equal(resolveSearchHref('index.html', 'file:///assets/docs-search.json'), null);
  assert.equal(resolveSearchHref('index.html', 'https://example.test/other.json'), null);
});
test('interaction search results retain the project base and remain searchable after route validation', () => {
  const entries = prepareSearchIndex({ version: '0.3.0', entries: [
    { title: 'خەرىتە سېلىشتۇرۇش', en: 'Map comparison', description: 'سىزىق بىلەن رەڭنى سېلىشتۇرۇڭ.', href: 'interactions.html#interaction-compare', keywords: ['compare', 'slider', 'خەرىتە'] },
    { title: 'Wrong path', en: 'Traversal', description: 'Rejected', href: 'guide/../interactions.html#interaction-compare', keywords: ['compare'] },
  ] }, INDEX);
  assert.equal(entries.length, 1);
  const destination = 'https://example.test/uyghur-ui/interactions.html#interaction-compare';
  for (const query of ['خەرىتە', 'Map comparison', 'slider']) assert.equal(searchDocumentation(entries, query)[0].href, destination);
});
test('validated search data drops unsafe rows and duplicates, preserves plain text and snapshots aliases', () => {
  const rows = structuredClone(payload); rows.entries.push({ ...rows.entries[0] }, { ...rows.entries[0], href: 'https://evil.test' });
  const entries = prepareSearchIndex(rows, INDEX); assert.equal(entries.length, payload.entries.length);
  rows.entries[0].keywords.push('changed'); assert.equal(entries[0].keywords.includes('changed'), false);
  assert.ok(Object.isFrozen(entries)); assert.ok(Object.isFrozen(entries[0].keywords)); assert.match(entries.at(-1).title, /<img/);
  assert.throws(() => prepareSearchIndex({ entries: [] }, INDEX), TypeError);
  assert.throws(() => prepareSearchIndex({ version: '0.2.0', entries: [] }, INDEX), TypeError);
});
test('search combines Unicode-normalized tokens, English labels and aliases with bounded deterministic results', () => {
  const entries = prepareSearchIndex(payload, INDEX);
  assert.equal(normalizeDocsQuery('  QUICK_start  '), 'quick start');
  assert.equal(searchDocumentation(entries)[0].en, 'Installation');
  assert.equal(searchDocumentation(entries, 'راۋاب')[0].en, 'Rawap');
  assert.equal(searchDocumentation(entries, 'RAWAB instrument')[0].en, 'Rawap');
  assert.equal(searchDocumentation(entries, 'native button')[0].en, 'Buttons');
  assert.equal(searchDocumentation(entries, 'راۋاپ'.replace('ر', '\uFEAD'))[0].en, 'Rawap');
  assert.equal(searchDocumentation(entries, '', { limit: 2 }).length, 2);
  assert.deepEqual(searchDocumentation(entries, 'no-match-here'), []);
  assert.throws(() => searchDocumentation(entries, null), TypeError); assert.throws(() => searchDocumentation(entries, '', { limit: 0 }), RangeError);
});
test('actual shell searches the latest typed query when a lazy local request resolves and renders titles as text', async () => {
  const { doc, win, get } = fixture(); let finish; const calls = [];
  win.fetch = (url, options) => { calls.push({ url, options }); return new Promise((resolve) => { finish = resolve; }); };
  const shell = initDocsShell(doc); assert.equal(initDocsShell(doc), shell); assert.equal(get('docs-search-open').hidden, false);
  get('docs-search-open').focus(); const ready = shell.openSearch();
  assert.equal(get('docs-search-dialog').open, true); assert.equal(doc.activeElement, get('docs-search-input'));
  get('docs-search-input').value = 'RAWAB'; get('docs-search-input').emit('input'); assert.match(get('docs-search-status').textContent, /تەييارلىنىۋاتىدۇ/);
  finish({ ok: true, json: async () => payload }); await ready;
  assert.equal(calls.length, 1); assert.equal(calls[0].url, INDEX); assert.equal(calls[0].options.credentials, 'omit');
  const result = get('docs-search-results').children[0]; assert.equal(result.tagName, 'A'); assert.equal(result.href, 'https://example.test/uyghur-ui/index.html#icons'); assert.equal(result.children[0].textContent, 'راۋاپ');
  get('docs-search-input').emit('keydown', { key: 'ArrowDown' }); assert.equal(doc.activeElement, result);
  get('docs-search-input').value = 'literal'; get('docs-search-input').emit('input');
  const literal = get('docs-search-results').children[0]; assert.equal(literal.children[0].textContent, '<img src=x onerror=alert(1)>'); assert.equal(literal.querySelector('img'), null);
  get('docs-search-input').value = 'absent'; get('docs-search-input').emit('input'); assert.equal(get('docs-search-results').children[0].tagName, 'P');
  shell.destroy(); await Promise.resolve(); assert.equal(doc.activeElement, get('docs-search-open'));
});
test('search failures show a real retry, and foreign search-index URLs never receive a request', async () => {
  const { doc, win, get } = fixture(); let count = 0;
  win.fetch = async () => { count++; return count === 1 ? { ok: false } : { ok: true, json: async () => payload }; };
  const shell = initDocsShell(doc); await shell.openSearch(); assert.match(get('docs-search-status').textContent, /يۈكلىيەلمىدى/);
  const retry = get('docs-search-results').children[0]; assert.equal(retry.tagName, 'BUTTON'); retry.click();
  await shell.openSearch(); assert.equal(count, 2); assert.equal(get('docs-search-results').children[0].tagName, 'A'); shell.destroy();
  const other = fixture(); other.doc.body.dataset.searchIndex = 'https://evil.test/assets/docs-search.json'; let fetched = false; other.win.fetch = async () => { fetched = true; };
  const guarded = initDocsShell(other.doc); await guarded.openSearch(); assert.equal(fetched, false); assert.match(other.get('docs-search-status').textContent, /يۈكلىيەلمىدى/); guarded.destroy();
});
test('keyboard shortcuts respect editable fields and other modals; menu links keep native navigation', async () => {
  const { doc, get, add } = fixture(), shell = initDocsShell(doc), field = add('textarea', 'author-text');
  assert.equal(doc.emit('keydown', { key: 'k', ctrlKey: true, target: field }).defaultPrevented, false); assert.equal(get('docs-search-dialog').open, undefined);
  get('docs-menu-open').click(); assert.equal(get('docs-menu-dialog').open, true);
  assert.equal(doc.emit('keydown', { key: '/', target: doc.body }).defaultPrevented, false);
  const anchor = add('a', 'menu-guide', get('docs-menu-dialog')); anchor.href = 'installation.html';
  const clicked = get('docs-menu-dialog').emit('click', { target: anchor }); assert.equal(clicked.defaultPrevented, false); assert.equal(get('docs-menu-dialog').open, false);
  await Promise.resolve();
  assert.equal(doc.emit('keydown', { key: 'k', metaKey: true, target: doc.body }).defaultPrevented, true); assert.equal(get('docs-search-dialog').open, true); shell.destroy();
});
test('theme honors stored choices, follows the system before a user choice and tolerates blocked storage', () => {
  const { doc, media, storage, get } = fixture(); storage.set('uyghur-ui-theme', 'dark'); const shell = initDocsShell(doc);
  assert.equal(doc.documentElement.dataset.ugTheme, 'dark'); assert.equal(get('theme').getAttribute('aria-pressed'), 'true');
  media.matches = false; media.emit('change'); assert.equal(doc.documentElement.dataset.ugTheme, 'dark');
  get('theme').click(); assert.equal(doc.documentElement.dataset.ugTheme, 'light'); assert.equal(storage.get('uyghur-ui-theme'), 'light'); shell.destroy();
  const other = fixture(); other.win.localStorage = { getItem() { throw Error('blocked'); }, setItem() { throw Error('blocked'); } };
  const second = initDocsShell(other.doc); other.media.matches = true; other.media.emit('change'); assert.equal(other.doc.documentElement.dataset.ugTheme, 'dark'); other.get('theme').click(); assert.equal(other.doc.documentElement.dataset.ugTheme, 'light'); second.destroy();
});
test('clipboard denial exposes exact selectable code and BFcache keeps controls until a real teardown', async () => {
  const { doc, win, get, add } = fixture(), article = add('main', 'article'), pre = add('pre', 'sample-code', article), code = add('code', 'sample-content', pre);
  code.textContent = 'const text = "سالام <world>";\n'; doc.copyBlocks.push(pre); win.navigator.clipboard.writeText = async () => { throw Error('denied'); };
  const shell = initDocsShell(doc), wrapper = pre.parentNode, button = wrapper.children.find((node) => node.className === 'doc-copy'); button.click(); await button.settled();
  const panel = wrapper.children.find((node) => node.className === 'doc-copy-fallback'), textarea = panel.querySelector('textarea');
  assert.equal(textarea.value, code.textContent); assert.equal(doc.selectedText, code.textContent); assert.equal(doc.activeElement, textarea); assert.match(get('docs-copy-status').textContent, /قولدا/);
  panel.querySelector('button').click(); assert.equal(doc.activeElement, button); assert.equal(wrapper.querySelector('textarea'), null);
  win.emit('pagehide', { persisted: true }); assert.equal(button.isConnected, true);
  win.navigator.clipboard.writeText = async (text) => { assert.equal(text, code.textContent); }; button.click(); await button.settled(); assert.equal(button.textContent, 'كۆچۈرۈلدى');
  win.emit('pagehide', { persisted: false }); assert.equal(pre.parentNode, article); assert.equal(button.isConnected, false); shell.destroy();
});
test('responsive TOC copies track fast section jumps together without moving focus or observing duplicates', async () => {
  const { doc, win, add } = fixture(), first = add('h2', 'first'), second = add('h2', 'second'); first.top = 0; second.top = 900;
  for (const id of ['first', 'second', 'first', 'second']) { const anchor = add('a', `toc-${doc.tocLinks.length}`); anchor.href = `#${id}`; doc.tocLinks.push(anchor); }
  const observed = []; let callback, disconnected = false;
  win.IntersectionObserver = class { constructor(fn) { callback = fn; } observe(node) { observed.push(node); } disconnect() { disconnected = true; } };
  const focused = doc.activeElement, shell = initDocsShell(doc); assert.equal(observed.length, 2);
  assert.equal(doc.tocLinks[0].getAttribute('aria-current'), 'location'); assert.equal(doc.tocLinks[2].getAttribute('aria-current'), 'location');
  // A large jump may cross the complete observer zone between two frames.
  first.top = -1000; second.top = 0; win.emit('scroll'); await new Promise((resolve) => setTimeout(resolve, 5));
  assert.equal(doc.tocLinks[1].getAttribute('aria-current'), 'location'); assert.equal(doc.tocLinks[3].getAttribute('aria-current'), 'location'); assert.equal(doc.tocLinks[0].getAttribute('aria-current'), null); assert.equal(doc.activeElement, focused);
  callback([]); assert.equal(doc.tocLinks[3].getAttribute('aria-current'), 'location');
  shell.destroy(); assert.equal(disconnected, true); assert.ok(doc.tocLinks.every((anchor) => anchor.getAttribute('aria-current') === null));
});
