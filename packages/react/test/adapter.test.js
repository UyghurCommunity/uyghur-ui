import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import React, { act, createElement as h, createRef, useState } from 'react';
import { JSDOM } from 'jsdom';
import { Button, Icon, Dialog, Tabs, UyghurInput, Interaction } from '../src/index.js';

const dom = new JSDOM('<!doctype html><html lang="ug" dir="rtl"><head></head><body></body></html>', { url: 'https://example.test/', pretendToBeVisual: true });
const win = dom.window;
for (const key of ['window', 'document', 'HTMLElement', 'Element', 'Node', 'Event', 'InputEvent', 'MouseEvent', 'KeyboardEvent', 'CompositionEvent']) globalThis[key] = key === 'window' ? win : key === 'document' ? win.document : win[key];
Object.defineProperty(globalThis, 'navigator', { value: win.navigator, configurable: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import('react-dom/client');
win.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
win.HTMLDialogElement.prototype.close = function () { this.open = false; this.ownerDocument.closeEvents.push(() => this.dispatchEvent(new win.Event('close'))); };

function fixture(t) {
  const container = document.createElement('div'); document.body.append(container);
  const renderer = createRoot(container), media = new win.EventTarget(), observers = [];
  media.matches = false; media.listeners = new Set();
  const add = media.addEventListener.bind(media), remove = media.removeEventListener.bind(media);
  media.addEventListener = (type, fn) => { media.listeners.add(fn); add(type, fn); };
  media.removeEventListener = (type, fn) => { media.listeners.delete(fn); remove(type, fn); };
  win.matchMedia = () => media;
  win.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; this.disconnected = false; observers.push(this); }
    observe(node) { this.node = node; }
    disconnect() { this.disconnected = true; }
    deliver(visible) { this.callback([{ target: this.node, isIntersecting: visible }]); }
  };
  document.closeEvents = [];
  let mounted = true;
  const render = async (element) => act(async () => { renderer.render(element); });
  const unmount = async () => { if (mounted) { await act(async () => renderer.unmount()); mounted = false; } };
  t.after(async () => { await unmount(); container.remove(); });
  return { container, render, unmount, media, observers };
}
const click = (node) => act(async () => { node.dispatchEvent(new win.MouseEvent('click', { bubbles: true, button: 0 })); });
const input = (node, text, isComposing = false) => act(async () => { node.value = text; node.dispatchEvent(new win.InputEvent('input', { bubbles: true, data: text, inputType: 'insertText', isComposing })); });
const pointer = (node, type, { x = 0, y = 0, button = 0, isPrimary = true } = {}) => {
  const event = new win.MouseEvent(type, { bubbles: true, cancelable: true, clientX: x, clientY: y, button });
  Object.defineProperties(event, { pointerId: { value: 1 }, isPrimary: { value: isPrimary } }); node.dispatchEvent(event);
};

test('public declarations compile realistic React consumers and reject incompatible callbacks', () => {
  const result = spawnSync(process.execPath, [new URL('../node_modules/typescript/bin/tsc', import.meta.url).pathname, '--noEmit', '--strict', '--target', 'ES2022', '--lib', 'ES2022,DOM', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', 'test/types.ts'], { cwd: new URL('../', import.meta.url), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});

test('every adapter imports and server-renders without browser globals', () => {
  const source = `import React from 'react'; import { renderToString } from 'react-dom/server'; import { Button,Icon,Dialog,Tabs,UyghurInput,Interaction } from './src/index.js';
if (typeof document !== 'undefined') throw Error('Expected a plain Node process');
const h=React.createElement; console.log(renderToString(h('main',null,h(Button,null,'باشلاڭ'),h(Icon,{name:'dutar',label:'<دۇتار>'}),h(Dialog,{open:false},'مەزمۇن'),h(Tabs,{items:[{id:'a',label:'بىر',content:'مەزمۇن'}]}),h(UyghurInput,{defaultValue:'سالام <world>'}),h(Interaction,{effect:'compare'}))));`;
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', source], { cwd: new URL('../', import.meta.url), encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /type="button"/);
  assert.match(result.stdout, /aria-label="&lt;دۇتار&gt;"/);
  assert.match(result.stdout, /سالام &lt;world&gt;/);
  assert.match(result.stdout, /role="tablist"/);
  assert.match(result.stdout, /data:image\/svg\+xml/);
  assert.doesNotMatch(result.stderr, /useLayoutEffect|ReferenceError|Warning/);
});

test('native button/icon refs and controlled RTL tabs preserve callbacks, disabled skipping, and panels', async (t) => {
  const app = fixture(t), button = createRef(), icon = createRef(), changes = [];
  const items = [{ id: 'a', label: 'بىر', content: 'A' }, { id: 'b', label: 'ئىككى', content: 'B' }, { id: 'c', label: 'چەكلەنگەن', content: 'C', disabled: true }, { id: 'd', label: 'تۆت', content: 'D' }];
  const page = (value) => h('div', null, h(Button, { ref: button, variant: 'secondary' }, 'باشلاڭ'), h(Icon, { ref: icon, name: 'doppa', label: 'دوپپا' }), h(Tabs, { items, value, onValueChange: (next) => changes.push(next) }));
  await app.render(page('a'));
  assert.equal(button.current.tagName, 'BUTTON'); assert.equal(button.current.type, 'button');
  assert.equal(icon.current.querySelector('svg').getAttribute('role'), 'img');
  let tabs = app.container.querySelectorAll('[role=tab]'); await click(tabs[1]);
  assert.deepEqual(changes, ['b']); assert.equal(tabs[0].getAttribute('aria-selected'), 'true', 'controlled value waits for its parent');
  await app.render(page('b')); tabs = app.container.querySelectorAll('[role=tab]');
  assert.equal(app.container.querySelectorAll('[role=tabpanel]')[1].hidden, false);
  await act(async () => tabs[1].dispatchEvent(new win.KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true })));
  assert.equal(changes.at(-1), 'd'); assert.equal(document.activeElement, tabs[3]);
  await app.render(page('d'));
  await act(async () => tabs[3].dispatchEvent(new win.KeyboardEvent('keydown', { key: 'Home', bubbles: true, cancelable: true })));
  assert.equal(changes.at(-1), 'a'); assert.equal(document.activeElement, tabs[0]);
  await app.unmount(); assert.equal(button.current, null); assert.equal(icon.current, null);
});

test('controlled dialog guards queued close events, primary backdrop gestures, Escape, and cleanup', async (t) => {
  const app = fixture(t), ref = createRef(), requested = [];
  const page = (open) => h(Dialog, { open, ref, onOpenChange: (value) => requested.push(value), 'aria-label': 'مىسال' }, h('p', null, 'ئىچىدىكى مەزمۇن'));
  await app.render(page(true)); const dialog = ref.current;
  dialog.getBoundingClientRect = () => ({ left: 10, top: 10, right: 110, bottom: 110 });
  assert.equal(dialog.open, true);
  await act(async () => {
    pointer(dialog, 'pointerdown', { button: 2 }); pointer(dialog, 'pointerup', { button: 2 });
    pointer(dialog, 'pointerdown', { isPrimary: false }); pointer(dialog, 'pointerup', { isPrimary: false });
    pointer(dialog, 'pointerdown', { x: 20, y: 20 }); pointer(dialog, 'pointerup');
    pointer(dialog, 'pointerdown'); pointer(dialog, 'pointercancel'); pointer(dialog, 'pointerup');
  });
  assert.deepEqual(requested, []);
  await act(async () => { pointer(dialog, 'pointerdown'); pointer(dialog, 'pointerup'); });
  assert.deepEqual(requested, [false]); assert.equal(dialog.open, true, 'parent accepts a controlled dismissal');
  await app.render(page(false)); assert.equal(dialog.open, false);
  await app.render(page(true)); assert.equal(dialog.open, true);
  await act(async () => { document.closeEvents.splice(0).forEach((emit) => emit()); });
  assert.deepEqual(requested, [false], 'a stale native close event cannot dismiss the reopened dialog');
  const cancel = new win.Event('cancel', { bubbles: true, cancelable: true });
  await act(async () => dialog.dispatchEvent(cancel));
  assert.equal(cancel.defaultPrevented, true); assert.deepEqual(requested, [false, false]);
  await app.unmount();
  await act(async () => { document.closeEvents.splice(0).forEach((emit) => emit()); });
  assert.deepEqual(requested, [false, false]); assert.equal(ref.current, null);
});

test('writing adapter delivers real virtual-keyboard and explicit cleanup edits, then cleans up Strict Mode bindings', async (t) => {
  const app = fixture(t), ref = createRef(), changes = [], controllers = [];
  await app.render(h(React.StrictMode, null, h(UyghurInput, { ref, defaultValue: 'e\u0301', onChange: (value) => changes.push(value), onReady: (controller) => controllers.push(controller) })));
  const textarea = ref.current;
  assert.equal(textarea.value, 'e\u0301');
  assert.equal(app.container.querySelector('[data-ug-writing-preview]').textContent, textarea.value);
  await click(app.container.querySelector('[data-ug-cleanup-preview-button]'));
  assert.equal(textarea.value, 'e\u0301', 'preview never silently normalizes input');
  await click(app.container.querySelector('[data-ug-cleanup-apply]'));
  assert.equal(textarea.value, 'é'); assert.equal(changes.at(-1), 'é');
  await click(app.container.querySelector('[data-ug-cleanup-undo]'));
  assert.equal(textarea.value, 'e\u0301');
  await click(app.container.querySelector('[data-ug-keyboard-toggle]'));
  const host = app.container.querySelector('[data-ug-keyboard]'); assert.equal(host.hidden, false);
  const key = host.querySelector('button[data-text]'); textarea.setSelectionRange(0, 0);
  await click(key); assert.ok(textarea.value.startsWith(key.dataset.text)); assert.equal(changes.at(-1), textarea.value);
  assert.equal(controllers.filter(Boolean).length, 2, 'Strict Mode remount receives a fresh binding');
  assert.throws(() => controllers[0].getValue(), /destroyed/);
  const current = controllers.filter(Boolean).at(-1); await app.unmount();
  assert.throws(() => current.getValue(), /destroyed/); assert.equal(controllers.at(-1), null); assert.equal(ref.current, null);
});

test('controlled writing synchronizes parent updates without duplicate changes and preserves IME composition', async (t) => {
  const app = fixture(t), changes = [], ref = createRef(); let setValue, accept = true, nativeInputs = 0;
  function Page() {
    const [value, set] = useState('سالام'); setValue = set;
    return h(UyghurInput, { ref, value, onChange(next) { changes.push(next); if (accept) set(next); }, onInput() { nativeInputs++; } });
  }
  await app.render(h(Page)); await input(ref.current, 'ئۇيغۇر');
  assert.equal(ref.current.value, 'ئۇيغۇر'); assert.deepEqual(changes, ['ئۇيغۇر']);
  await act(async () => setValue('parent <update>'));
  assert.equal(ref.current.value, 'parent <update>'); assert.deepEqual(changes, ['ئۇيغۇر']);
  assert.equal(app.container.querySelector('[data-ug-writing-preview]').textContent, 'parent <update>');
  accept = false; await input(ref.current, 'rejected edit');
  assert.equal(ref.current.value, 'parent <update>'); assert.equal(changes.at(-1), 'rejected edit');
  assert.equal(app.container.querySelector('[data-ug-writing-preview]').textContent, 'parent <update>');
  accept = true; const before = changes.length;
  await act(async () => ref.current.dispatchEvent(new win.CompositionEvent('compositionstart', { bubbles: true })));
  await input(ref.current, 'يېزىش', true);
  assert.equal(ref.current.value, 'يېزىش'); assert.equal(changes.length, before, 'intermediate IME text is not committed');
  await act(async () => ref.current.dispatchEvent(new win.CompositionEvent('compositionend', { bubbles: true })));
  assert.equal(ref.current.value, 'يېزىش'); assert.equal(changes.at(-1), 'يېزىش'); assert.ok(nativeInputs >= 3);
});

test('changing a writing limit rebuilds its controller without retaining the previous native maximum', async (t) => {
  const app = fixture(t), ref = createRef(), changes = [];
  const page = (maxLength, value) => h(UyghurInput, { ref, maxLength, value, onChange: (next) => changes.push(next) });
  await app.render(page(2, 'ab')); assert.equal(ref.current.maxLength, 2);
  await app.render(page(20, 'a longer value')); assert.equal(ref.current.maxLength, 20);
  assert.equal(ref.current.value, 'a longer value');
  assert.equal(app.container.querySelector('[data-ug-writing-preview]').textContent, 'a longer value');
  assert.deepEqual(changes, [], 'prop synchronization is not a user change');
});

test('all six interaction defaults bind, act, pause/resume, honor system/viewport gates, and detach on unmount', async (t) => {
  const app = fixture(t), effects = ['spotlight', 'tilt', 'selection', 'send', 'compare', 'ripple'];
  const ready = [];
  const page = (paused) => h(React.StrictMode, null, h('div', null, effects.map((effect) => h(Interaction, { key: effect, effect, paused, onReady: (controller) => ready.push([effect, controller]) }))));
  await app.render(page(false));
  const roots = [...app.container.querySelectorAll('[data-interaction]')]; assert.equal(roots.length, 6);
  assert.ok(roots.every((root) => root.dataset.motion === 'running'));
  await click(roots[0].querySelector('[data-action=spotlight]')); assert.notEqual(roots[0].querySelector('[data-surface]').style.getPropertyValue('--pointer-x'), '50%');
  await click(roots[1].querySelector('[data-tilt-card]')); assert.notEqual(roots[1].querySelector('[data-tilt-card]').style.getPropertyValue('--tilt-x'), '0deg');
  await click(roots[2].querySelector('[data-choice]')); assert.equal(roots[2].querySelector('[data-choice]').getAttribute('aria-pressed'), 'true');
  await click(roots[3].querySelector('[data-action=send]')); assert.equal(roots[3].dataset.phase, 'sending');
  const slider = roots[4].querySelector('input'); await input(slider, '100'); assert.equal(roots[4].style.getPropertyValue('--split'), '100%');
  await click(roots[5].querySelector('[data-action=ripple]')); assert.equal(roots[5].dataset.phase, 'active');
  await app.render(page(true)); assert.ok(roots.every((root) => root.dataset.motion === 'paused'));
  assert.equal(roots[3].dataset.phase, 'sent'); assert.equal(roots[5].dataset.phase, 'ready');
  await app.render(page(false)); assert.ok(roots.every((root) => root.dataset.motion === 'running'), 'resume restores both CSS and controller motion');
  await act(async () => { app.media.matches = true; app.media.dispatchEvent(new win.Event('change')); });
  assert.ok(roots.every((root) => root.dataset.motion === 'paused'));
  await act(async () => { app.media.matches = false; app.media.dispatchEvent(new win.Event('change')); app.observers.filter((observer) => !observer.disconnected).forEach((observer) => observer.deliver(false)); });
  assert.ok(roots.every((root) => root.dataset.motion === 'paused'));
  await app.unmount(); assert.equal(app.media.listeners.size, 0); assert.ok(app.observers.every((observer) => observer.disconnected));
  assert.equal(ready.filter(([, controller]) => controller === null).length, 12, 'Strict Mode and final unmount both clean all effects');
});
