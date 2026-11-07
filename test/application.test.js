import test from 'node:test';
import assert from 'node:assert/strict';
import { bindCombobox, bindDropdown, bindDrawer, bindDataTable } from '../src/application.js';

class Node {
  constructor(tag = 'div', doc) { this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.attrs = new Map(); this.events = new Map(); this.children = []; this.queries = new Map(); this.dataset = {}; this.hidden = false; this.disabled = false; this.value = ''; this._text = ''; this.isConnected = true; }
  get id() { return this.getAttribute('id') ?? ''; } set id(value) { this.setAttribute('id', value); }
  get textContent() { return this._text + this.children.map((node) => node.textContent).join(' '); } set textContent(value) { this._text = value; this.children = []; }
  getAttribute(name) { return this.attrs.get(name) ?? null; } setAttribute(name, value) { this.attrs.set(name, String(value)); } removeAttribute(name) { this.attrs.delete(name); }
  addEventListener(type, fn) { if (!this.events.has(type)) this.events.set(type, new Set()); this.events.get(type).add(fn); } removeEventListener(type, fn) { this.events.get(type)?.delete(fn); }
  emit(type, props = {}) { const event = { target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...props }; [...(this.events.get(type) ?? [])].forEach((fn) => fn(event)); return event; }
  listenerCount() { return [...this.events.values()].reduce((sum, set) => sum + set.size, 0); }
  appendChild(node) { if (node.parent) node.parent.children = node.parent.children.filter((item) => item !== node); node.parent = this; this.children.push(node); return node; }
  contains(node) { return node === this || this.children.some((child) => child.contains(node)); }
  closest(selector) { if (selector === 'th' && this.tagName === 'TH' || selector === '[data-ug-close]' && this.getAttribute('data-ug-close') !== null) return this; return this.parent?.closest(selector) ?? null; }
  querySelector(selector) { return this.queries.get(selector) ?? null; }
  querySelectorAll(selector) { if (selector === 'tr') return this.children.filter((node) => node.tagName === 'TR'); return this.queries.get(selector) ?? []; }
  focus() { this.ownerDocument.activeElement = this; }
}
function setup() {
  const doc = new Node('document'); doc.activeElement = null; const root = new Node('section', doc); doc.appendChild(root);
  const find = (node, id) => node.id === id ? node : node.children.map((child) => find(child, id)).find(Boolean);
  doc.getElementById = (id) => find(doc, id);
  const add = (selector, tag = 'div', parent = root) => { const node = new Node(tag, doc); parent.appendChild(node); root.queries.set(selector, node); return node; };
  return { doc, root, add };
}
function combo() {
  const f = setup(), input = f.add('[data-ug-combobox-input]', 'input'), list = f.add('[data-ug-combobox-list]'); list.hidden = true;
  const options = ['دوپپا · Doppa', 'ئەتلەس · Atlas', '<script> Ceramic', 'قۇملۇق · Desert'].map((text, i) => { const option = new Node('button', f.doc); option.dataset.value = ['doppa', 'atlas', 'ceramic', 'desert'][i]; option.textContent = text; list.appendChild(option); return option; });
  list.queries.set('button[data-ug-option]', options); f.add('[data-ug-combobox-status]', 'p'); return { ...f, input, list, options };
}
function menu() {
  const f = setup(), trigger = f.add('[data-ug-menu-trigger]', 'button'), panel = f.add('[data-ug-menu]'); panel.hidden = true;
  const items = [0, 1, 2].map(() => panel.appendChild(new Node('button', f.doc))); panel.queries.set('button, [data-ug-menu-item]', items); return { ...f, trigger, panel, items };
}
function tableFixture() {
  const f = setup(), table = f.add('table', 'table'), body = new Node('tbody', f.doc); table.appendChild(body); table.queries.set('tbody', body);
  const rows = [['دوپپا Doppa', '110'], ['ئەتلەس Atlas', '٢'], ['ساپال Ceramic', '11'], ['گۈل Flower', '4']].map((values) => { const row = new Node('tr', f.doc); row.cells = values.map((value) => { const cell = new Node('td', f.doc); cell.textContent = value; row.appendChild(cell); return cell; }); body.appendChild(row); return row; });
  const sorts = [0, 1].map((column) => { const heading = new Node('th', f.doc); table.appendChild(heading); const button = new Node('button', f.doc); button.dataset.ugSort = String(column); heading.appendChild(button); return button; }); table.queries.set('button[data-ug-sort]', sorts);
  const search = f.add('[data-ug-table-search]', 'input'), prev = f.add('[data-ug-table-prev]', 'button'), next = f.add('[data-ug-table-next]', 'button'), status = f.add('[data-ug-table-status]', 'p');
  return { ...f, table, body, rows, sorts, search, prev, next, status, visible: () => body.children.filter((row) => !row.hidden) };
}

test('combobox filters bilingual plain-text labels, exposes an active descendant, and selects with native keys', () => {
  const f = combo(), changes = [], control = bindCombobox(f.root, { onChange: (value) => changes.push(value) });
  assert.equal(f.input.getAttribute('role'), 'combobox'); assert.equal(f.list.hidden, true);
  f.input.value = 'ATLAS'; f.input.emit('input'); assert.equal(f.list.hidden, false); assert.deepEqual(f.options.map((node) => node.hidden), [true, false, true, true]);
  assert.equal(f.input.getAttribute('aria-activedescendant'), f.options[1].id); assert.equal(f.options[1].getAttribute('data-ug-active'), 'true');
  assert.ok(f.input.emit('keydown', { key: 'Enter' }).defaultPrevented); assert.equal(control.getValue(), 'atlas'); assert.deepEqual(changes, ['atlas']); assert.equal(f.doc.activeElement, f.input); assert.equal(f.list.hidden, true);
  f.input.emit('keydown', { key: 'ArrowDown' }); assert.ok(f.options.every((node) => !node.hidden));
  f.input.emit('keydown', { key: 'ArrowDown' }); f.input.emit('keydown', { key: 'Enter' }); assert.equal(control.getValue(), 'ceramic'); assert.equal(f.input.value, '<script> Ceramic'); assert.equal(f.input.children.length, 0);
  control.destroy(); assert.equal(f.input.getAttribute('role'), null); assert.equal(f.options[0].getAttribute('tabindex'), null); assert.equal(f.doc.listenerCount(), 0);
});

test('combobox protects IME Enter, closes outside/Escape, skips disabled options, and rejects unknown values', () => {
  const f = combo(), control = bindCombobox(f.root); f.options[1].disabled = true;
  f.input.emit('keydown', { key: 'ArrowDown' }); f.input.emit('keydown', { key: 'ArrowDown' }); assert.equal(f.input.getAttribute('aria-activedescendant'), f.options[2].id);
  assert.equal(f.input.emit('keydown', { key: 'Enter', isComposing: true }).defaultPrevented, false); assert.equal(control.getValue(), '');
  f.input.emit('keydown', { key: 'Escape' }); assert.equal(f.list.hidden, true); control.open(); f.doc.emit('pointerdown', { target: new Node('aside', f.doc) }); assert.equal(f.list.hidden, true);
  assert.equal(control.select('atlas'), false); assert.throws(() => control.select('missing'), RangeError);
  f.input.emit('compositionstart'); f.input.value = 'قۇملۇق'; f.input.emit('input'); f.input.emit('compositionend'); assert.equal(f.options[3].hidden, false);
  control.destroy(); control.destroy(); assert.equal(f.input.listenerCount() + f.list.listenerCount() + f.root.listenerCount(), 0);
});

test('dropdown wraps only enabled items, restores focus on Escape/action, and closes without stealing outside focus', () => {
  const f = menu(), control = bindDropdown(f.root); f.items[1].disabled = true;
  f.trigger.emit('keydown', { key: 'ArrowDown' }); assert.equal(f.doc.activeElement, f.items[0]); assert.equal(f.trigger.getAttribute('aria-expanded'), 'true');
  f.panel.emit('keydown', { key: 'ArrowDown', target: f.items[0] }); assert.equal(f.doc.activeElement, f.items[2]);
  f.panel.emit('keydown', { key: 'ArrowDown', target: f.items[2] }); assert.equal(f.doc.activeElement, f.items[0]);
  f.panel.emit('keydown', { key: 'Escape', target: f.items[0] }); assert.equal(f.doc.activeElement, f.trigger); assert.equal(f.panel.hidden, true);
  control.open(); f.panel.emit('click', { target: f.items[2] }); assert.equal(f.panel.hidden, true); assert.equal(f.doc.activeElement, f.trigger);
  control.open(); f.doc.emit('pointerdown', { target: new Node('div', f.doc) }); assert.equal(f.panel.hidden, true); assert.equal(f.doc.activeElement, f.trigger);
  control.open(); control.close(); assert.equal(f.doc.activeElement, f.trigger);
  control.open(); const outside = new Node('button', f.doc); outside.focus(); f.doc.emit('pointerdown', { target: outside }); assert.equal(f.panel.hidden, true); assert.equal(f.doc.activeElement, outside);
  control.destroy(); control.destroy(); assert.equal(f.trigger.getAttribute('aria-haspopup'), null); assert.equal(f.doc.listenerCount() + f.panel.listenerCount() + f.trigger.listenerCount(), 0);
});

test('drawer delegates native dialog lifecycle, outside dismissal, labelled semantics and cleanup', () => {
  const f = setup(), trigger = f.add('[data-ug-drawer-trigger]', 'button'), dialog = f.add('[data-ug-drawer]', 'dialog'), heading = new Node('h3', f.doc), close = new Node('button', f.doc);
  dialog.setAttribute('aria-label', 'تەڭشەكلەر'); dialog.appendChild(heading); dialog.appendChild(close); close.setAttribute('data-ug-close', 'done'); dialog.queries.set('[autofocus]', heading);
  dialog.getBoundingClientRect = () => ({ left: 100, right: 400, top: 0, bottom: 600 }); dialog.showModal = () => { dialog.open = true; }; dialog.close = (value) => { dialog.open = false; dialog.returnValue = value; dialog.emit('close'); };
  const control = bindDrawer(f.root); trigger.focus(); trigger.emit('click'); assert.equal(dialog.open, true); assert.equal(f.doc.activeElement, heading);
  dialog.emit('click', { target: close }); assert.equal(dialog.open, false); assert.equal(dialog.returnValue, 'done'); assert.equal(f.doc.activeElement, trigger);
  trigger.emit('click'); dialog.emit('pointerdown', { clientX: 20, clientY: 200, button: 0 }); dialog.emit('click', { clientX: 20, clientY: 200 }); assert.equal(dialog.open, false);
  control.destroy(); assert.equal(dialog.listenerCount() + trigger.listenerCount(), 0);
});

test('local table sorts numeric/Arabic-number cells, searches both scripts, paginates and restores original row identities', () => {
  const f = tableFixture(), control = bindDataTable(f.root, { pageSize: 2 });
  assert.equal(control.getState().pageCount, 2); assert.deepEqual(f.visible(), f.rows.slice(0, 2)); assert.equal(f.prev.disabled, true);
  f.next.emit('click'); assert.equal(control.getState().page, 2); assert.equal(f.next.disabled, true);
  f.sorts[1].emit('click'); assert.deepEqual(f.visible(), [f.rows[1], f.rows[3]]); assert.equal(f.sorts[1].parent.getAttribute('aria-sort'), 'ascending');
  f.sorts[1].emit('click'); assert.deepEqual(f.visible(), [f.rows[0], f.rows[2]]); assert.equal(f.sorts[1].parent.getAttribute('aria-sort'), 'descending');
  f.search.value = 'ئەتلەس ATLAS'; f.search.emit('input'); assert.deepEqual(f.visible(), [f.rows[1]]); assert.equal(control.getState().page, 1); assert.equal(control.getState().filtered, 1);
  f.search.value = '<script>'; f.search.emit('input'); assert.equal(f.visible().length, 0); assert.match(f.status.textContent, /تېپىلمىدى/); assert.equal(f.status.children.length, 0);
  assert.throws(() => control.setPage(0), RangeError); control.setPage(100); assert.equal(control.getState().page, 1); assert.ok(Object.isFrozen(control.getState()));
  control.destroy(); control.destroy(); assert.deepEqual(f.body.children, f.rows); assert.ok(f.rows.every((row) => !row.hidden)); assert.equal(f.sorts[1].parent.getAttribute('aria-sort'), null); assert.equal(f.search.listenerCount() + f.next.listenerCount() + f.prev.listenerCount(), 0);
});

test('table keeps in-progress IME search stable and rejects invalid bounds before adding listeners', () => {
  const f = tableFixture(), control = bindDataTable(f.root, { pageSize: 3 });
  f.search.emit('compositionstart'); f.search.value = 'Atlas'; f.search.emit('input'); assert.equal(control.getState().filtered, 4);
  f.search.emit('compositionend'); assert.equal(control.getState().filtered, 1); control.destroy();
  for (const pageSize of [0, 101, Infinity, 1.5]) assert.throws(() => bindDataTable(tableFixture().root, { pageSize }), RangeError);
  const malformed = tableFixture(); malformed.sorts[0].dataset.ugSort = '99'; assert.throws(() => bindDataTable(malformed.root), TypeError); assert.equal(malformed.sorts[0].listenerCount(), 0);
});
