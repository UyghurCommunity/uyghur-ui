import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { bindUyghurInput } from '../src/writing.js';

class Element extends EventTarget {
  constructor(tag, doc) { super(); this.tagName = tag.toUpperCase(); this.ownerDocument = doc; this.attrs = new Map(); this.dataset = {}; this.children = []; this.queries = new Map(); this.className = ''; this.value = ''; this.selectionStart = 0; this.selectionEnd = 0; this.selectionDirection = 'none'; this.disabled = false; this.readOnly = false; this.required = false; this.hidden = false; this.listeners = new Map(); }
  setAttribute(name, value) { this.attrs.set(name, String(value)); }
  getAttribute(name) { return this.attrs.get(name) ?? null; }
  removeAttribute(name) { this.attrs.delete(name); }
  querySelector(selector) { return this.queries.get(selector) ?? null; }
  appendChild(node) { node.parentNode = this; this.children.push(node); return node; }
  remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter((node) => node !== this); this.parentNode = null; }
  contains(node) { return node === this || this.children.some((child) => child.contains(node)); }
  closest(selector) { return selector === 'button.ug-keyboard__key' && this.className === 'ug-keyboard__key' ? this : this.parentNode?.closest(selector); }
  focus() { this.ownerDocument.activeElement = this; }
  setSelectionRange(start, end, direction = 'none') { this.selectionStart = start; this.selectionEnd = end; this.selectionDirection = direction; }
  addEventListener(name, fn, options) { super.addEventListener(name, fn, options); if (!this.listeners.has(name)) this.listeners.set(name, new Set()); this.listeners.get(name).add(fn); }
  removeEventListener(name, fn, options) { super.removeEventListener(name, fn, options); this.listeners.get(name)?.delete(fn); }
}
function fixture(value = '') {
  const doc = new EventTarget(); doc.defaultView = { Event, CustomEvent }; doc.createElement = (tag) => new Element(tag, doc); doc.head = doc.createElement('head');
  const root = doc.createElement('section');
  const find = (node, id) => node.id === id ? node : node.children.map((child) => find(child, id)).find(Boolean);
  doc.getElementById = (id) => find(doc.head, id) || find(root, id);
  const specs = { input: ['textarea', 'writing-input'], toggle: ['button', 'keyboard-toggle'], host: ['div', 'keyboard'], preview: ['div', 'writing-preview'], status: ['p', 'writing-status'], cleanup: ['pre', 'cleanup-preview'], previewButton: ['button', 'cleanup-preview-button'], apply: ['button', 'cleanup-apply'], undo: ['button', 'cleanup-undo'] }, nodes = {};
  for (const [name, [tag, data]] of Object.entries(specs)) { nodes[name] = doc.createElement(tag); root.appendChild(nodes[name]); root.queries.set(`[data-ug-${data}]`, nodes[name]); }
  nodes.input.value = value; nodes.input.setSelectionRange(value.length, value.length); nodes.host.hidden = true; nodes.apply.disabled = true; nodes.undo.disabled = true;
  return { root, doc, ...nodes };
}
function emit(node, type, props = {}) { const event = new Event(type, { cancelable: true }); Object.assign(event, props); node.dispatchEvent(event); return event; }
function clickKey(f, text) { const keyboard = f.host.children[0]; const all = (node) => node.children.flatMap((child) => [child, ...all(child)]); const key = all(keyboard).find((node) => node.dataset.text === text || node.dataset.action === text); assert.ok(key); const event = new Event('click', { cancelable: true }); Object.defineProperty(event, 'target', { value: key }); keyboard.dispatchEvent(event); }

test('writing preview is mixed-direction plain text, validates required/length, and preserves tighter native limits', () => {
  const f = fixture('<img src=x onerror=alert(1)> ئۇيغۇر Hello'); f.input.setAttribute('maxlength', '50');
  const control = bindUyghurInput(f.root, { maxLength: 60 });
  assert.equal(f.preview.textContent, f.input.value); assert.equal(f.preview.children.length, 0); assert.equal(f.preview.getAttribute('dir'), 'auto');
  assert.equal(control.validate().maxLength, 50); assert.throws(() => control.setValue('x'.repeat(51)), RangeError);
  control.setValue(''); f.input.required = true; assert.equal(control.validate().valid, false); assert.match(control.validate().message, /مەزمۇن/);
  assert.equal(f.input.getAttribute('aria-invalid'), 'true'); control.destroy(); assert.equal(f.input.getAttribute('maxlength'), '50');
});

test('real vendored keyboard preserves selection, honors cancelable beforeinput and maxLength, and leaves physical typing native', () => {
  const f = fixture('abc'), changes = [], control = bindUyghurInput(f.root, { maxLength: 4, onChange: (value) => changes.push(value) });
  f.input.setSelectionRange(1, 2); clickKey(f, 'ئا'); assert.equal(f.input.value, 'aئاc'); assert.equal(f.input.selectionStart, 3);
  clickKey(f, 'ق'); assert.equal(f.input.value, 'aئاc'); assert.equal(changes.length, 1);
  const cancel = (event) => event.preventDefault(); f.input.addEventListener('beforeinput', cancel); clickKey(f, 'backspace'); assert.equal(f.input.value, 'aئاc'); f.input.removeEventListener('beforeinput', cancel);
  assert.equal(emit(f.input, 'keydown', { key: 'q' }).defaultPrevented, false);
  emit(f.toggle, 'click'); assert.equal(f.host.hidden, false); assert.equal(f.toggle.getAttribute('aria-expanded'), 'true');
  emit(f.host, 'keydown', { key: 'Escape' }); assert.equal(f.host.hidden, true); assert.equal(f.doc.activeElement, f.toggle);
  control.destroy(); assert.equal(f.host.children.length, 0); assert.equal(f.doc.head.children.length, 0);
});

test('cleanup is opt-in, frozen, applies only the current preview, and undoes exact text and caret', () => {
  const f = fixture(' a\u200b '), control = bindUyghurInput(f.root); f.input.setSelectionRange(1, 3, 'backward');
  assert.equal(control.applyCleanup(), false); assert.equal(control.previewCleanup().changed, false); assert.equal(f.input.value, ' a\u200b ');
  const candidate = control.previewCleanup({ trim: true, removeZeroWidthSpace: true }); assert.equal(candidate.text, 'a'); assert.equal(f.input.value, candidate.original);
  assert.ok(Object.isFrozen(candidate)); assert.throws(() => { candidate.text = 'unsafe'; }, TypeError);
  assert.equal(control.applyCleanup(), true); assert.equal(f.input.value, 'a'); assert.equal(f.undo.disabled, false);
  assert.equal(control.undoCleanup(), true); assert.equal(f.input.value, ' a\u200b '); assert.equal(f.input.selectionStart, 1); assert.equal(f.input.selectionEnd, 3); assert.equal(f.input.selectionDirection, 'backward');
  control.previewCleanup({ trim: true }); f.input.value = 'new edit'; emit(f.input, 'input'); assert.equal(control.applyCleanup(), false); assert.equal(f.input.value, 'new edit'); assert.equal(control.undoCleanup(), false);
  control.destroy();
});

test('IME text is never truncated or cleaned mid-composition and onChange fires once for the committed value', () => {
  const f = fixture(''), changes = [], control = bindUyghurInput(f.root, { maxLength: 2, onChange: (value) => changes.push(value) });
  emit(f.input, 'compositionstart'); f.input.value = 'abc'; emit(f.input, 'input', { isComposing: true }); clickKey(f, 'ق');
  assert.equal(f.input.value, 'abc'); assert.equal(control.previewCleanup({ trim: true }), null); assert.equal(control.setValue('a'), false); assert.equal(changes.length, 0);
  assert.equal(emit(f.input, 'beforeinput', { inputType: 'insertCompositionText', data: 'extra', isComposing: true }).defaultPrevented, false);
  emit(f.input, 'compositionend'); emit(f.input, 'input'); assert.deepEqual(changes, ['abc']); assert.equal(f.input.value, 'abc'); assert.equal(control.validate().valid, false);
  control.destroy();
});

test('preview/apply buttons use NFC plus LF and cancelled replacements preserve value and selection', () => {
  const f = fixture('e\u0301\r\n'), control = bindUyghurInput(f.root); f.input.setSelectionRange(4, 4);
  emit(f.previewButton, 'click'); assert.equal(f.apply.disabled, false); assert.equal(f.input.value, 'e\u0301\r\n');
  const cancel = (event) => event.preventDefault(); f.input.addEventListener('beforeinput', cancel);
  assert.equal(control.applyCleanup(), false); assert.equal(f.input.selectionStart, 4); assert.equal(f.input.value, 'e\u0301\r\n');
  f.input.removeEventListener('beforeinput', cancel); emit(f.apply, 'click'); assert.equal(f.input.value, 'é\n'); emit(f.undo, 'click'); assert.equal(f.input.value, 'e\u0301\r\n');
  control.destroy(); control.destroy(); assert.ok([...f.input.listeners.values()].every((listeners) => listeners.size === 0));
  assert.throws(() => control.setValue('x'), /destroyed/);
});

test('writing rejects invalid options and unsafe cleanup option names without altering input', () => {
  assert.throws(() => bindUyghurInput(fixture().root, { maxLength: Infinity }), RangeError);
  assert.throws(() => bindUyghurInput(fixture().root, { onChange: 'not a function' }), TypeError);
  const f = fixture('سالام'), control = bindUyghurInput(f.root);
  assert.throws(() => control.setValue(null), TypeError); assert.throws(() => control.previewCleanup({ invented: true }), TypeError); assert.equal(f.input.value, 'سالام'); control.destroy();
});

test('vendored keyboard and text files retain their recorded hashes, versions and MIT notices', async () => {
  const readme = await readFile(new URL('../src/vendor/README.md', import.meta.url), 'utf8');
  assert.match(readme, /keyboard` 0\.1\.1/); assert.match(readme, /text` 0\.1\.0/);
  for (const [, file, hash] of readme.matchAll(/\| `((?:keyboard|text)\/(?:index\.js|style\.js|LICENSE))` \| `([a-f0-9]{64})` \|/g)) {
    const bytes = await readFile(new URL(`../src/vendor/${file}`, import.meta.url)); assert.equal(createHash('sha256').update(bytes).digest('hex'), hash, file);
  }
  for (const project of ['keyboard', 'text']) assert.match(await readFile(new URL(`../src/vendor/${project}/LICENSE`, import.meta.url), 'utf8'), /MIT License/);
});
