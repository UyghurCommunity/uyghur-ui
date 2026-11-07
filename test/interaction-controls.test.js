import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { interactionBindings } from '../docs/interaction-controls.js';

class Events {
  constructor() { this.listeners = new Map(); }
  addEventListener(name, callback) { if (!this.listeners.has(name)) this.listeners.set(name, new Set()); this.listeners.get(name).add(callback); }
  removeEventListener(name, callback) { this.listeners.get(name)?.delete(callback); }
  emit(name, options = {}) {
    const event = { target: this, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...options };
    [...(this.listeners.get(name) ?? [])].forEach((callback) => callback(event)); return event;
  }
  listenerCount() { return [...this.listeners.values()].reduce((count, listeners) => count + listeners.size, 0); }
}
class Element extends Events {
  constructor(doc) {
    super(); this.ownerDocument = doc; this.queries = new Map(); this.dataset = {}; this.attributes = new Map();
    this.disabled = false; this.textContent = ''; this.value = ''; this.clientLeft = 0; this.scrollLeft = 0;
    this.rect = { left: 100, top: 50, width: 200, height: 100 };
    const properties = new Map();
    this.style = { transition: '', left: '', width: '', setProperty(name, value) { properties.set(name, String(value)); }, getPropertyValue(name) { return properties.get(name) ?? ''; } };
  }
  querySelector(selector) { const value = this.queries.get(selector); return Array.isArray(value) ? value[0] ?? null : value ?? null; }
  querySelectorAll(selector) { const value = this.queries.get(selector); return value ? Array.isArray(value) ? value : [value] : []; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  getBoundingClientRect() { return this.rect; }
  focus() { this.ownerDocument.activeElement = this; }
}
function fixture(name, { resizeObserver = true } = {}) {
  const win = new Events(), doc = { defaultView: win, documentElement: { dir: 'rtl' }, activeElement: null };
  let now = 0, nextTimer = 0, reduced = false, network = 0;
  const timers = new Map(), observers = [];
  win.matchMedia = () => ({ matches: reduced });
  win.getComputedStyle = (node) => ({ direction: node.dir || doc.documentElement.dir });
  win.setTimeout = (callback, delay) => { const id = nextTimer++; timers.set(id, { callback, due: now + delay, delay }); return id; };
  win.clearTimeout = (id) => timers.delete(id);
  win.fetch = () => { network++; throw new Error('This interaction must stay local.'); };
  if (resizeObserver) win.ResizeObserver = class {
    constructor(callback) { this.callback = callback; this.nodes = new Set(); this.disconnected = false; observers.push(this); }
    observe(node) { this.nodes.add(node); }
    disconnect() { this.nodes.clear(); this.disconnected = true; }
    fire() { this.callback(); }
  };
  const root = new Element(doc), status = new Element(doc), nodes = { root, status };
  status.textContent = 'تەييار'; root.queries.set('[data-demo-status]', status);
  const add = (key, selector) => { const element = new Element(doc); nodes[key] = element; root.queries.set(selector, element); return element; };
  if (name === 'spotlight') { add('surface', '[data-surface]'); add('button', 'button[data-action="spotlight"]'); }
  if (name === 'tilt') { const card = add('card', '[data-tilt-card]'); nodes.button = card; root.queries.set('button[data-action="tilt"]', card); add('depth', 'input[data-setting="depth"]').value = '12'; }
  if (name === 'selection') {
    const track = add('track', '[data-choice-track]'); track.clientLeft = 2;
    const indicator = add('indicator', '[data-selection-indicator]'); indicator.style.transition = 'left 180ms ease, width 180ms ease';
    nodes.choices = ['كۆك', 'ئالتۇن', 'يېشىل'].map((label, i) => { const choice = new Element(doc); choice.textContent = label; choice.rect = { left: [300, 200, 110][i], top: 50, width: [95, 90, 80][i], height: 45 }; return choice; });
    track.queries.set('button[data-choice]', nodes.choices);
  }
  if (name === 'send') { add('button', 'button[data-action="send"]'); add('resetButton', 'button[data-action="reset"]'); }
  if (name === 'compare') add('input', 'input[data-setting="compare"]').value = '42';
  if (name === 'ripple') add('button', 'button[data-action="ripple"]');
  return {
    ...nodes, win, doc, timers, observers,
    reduce(value) { reduced = value; }, networkCalls: () => network,
    tick(milliseconds) {
      const target = now + milliseconds;
      while (true) {
        const next = [...timers.entries()].filter(([, timer]) => timer.due <= target).sort((a, b) => a[1].due - b[1].due)[0];
        if (!next) break;
        timers.delete(next[0]); now = next[1].due; next[1].callback();
      }
      now = target;
    },
  };
}
const value = (node, property) => node.style.getPropertyValue(property);
const pressed = (choices) => choices.map((choice) => choice.getAttribute('aria-pressed'));

test('six frozen interaction bindings can each be copied without module dependencies', () => {
  assert.ok(Object.isFrozen(interactionBindings));
  assert.deepEqual(Object.keys(interactionBindings), ['spotlight', 'tilt', 'selection', 'send', 'compare', 'ripple']);
  for (const [name, mount] of Object.entries(interactionBindings)) {
    const standalone = runInNewContext(`(${mount.toString()})`), f = fixture(name);
    const control = standalone(f.root, { motionAllowed: () => false });
    for (const method of ['syncMotion', 'reset', 'destroy']) assert.equal(typeof control[method], 'function', `${name}.${method}`);
    control.syncMotion(); control.reset(); control.destroy(); control.destroy(); control.syncMotion(); control.reset();
    assert.equal(f.timers.size, 0, `${name}: no pending work after cleanup`);
    assert.equal(f.networkCalls(), 0);
  }
});

test('spotlight clamps pointer coordinates, supports touch/key clicks, and clears poses on pause and cleanup', () => {
  const f = fixture('spotlight'), control = interactionBindings.spotlight(f.root);
  assert.equal(value(f.surface, '--pointer-x'), '50%');
  const touch = f.surface.emit('pointermove', { pointerType: 'touch', clientX: 300, clientY: 100 });
  assert.equal(value(f.surface, '--pointer-x'), '50%'); assert.equal(touch.defaultPrevented, false);
  f.surface.emit('pointermove', { clientX: -500, clientY: 500 });
  assert.equal(value(f.surface, '--pointer-x'), '0%'); assert.equal(value(f.surface, '--pointer-y'), '100%');
  f.surface.emit('pointermove', { clientX: 200, clientY: 75 });
  assert.equal(value(f.surface, '--pointer-x'), '50%'); assert.equal(value(f.surface, '--pointer-y'), '25%');
  f.surface.emit('pointerleave'); assert.equal(value(f.surface, '--pointer-y'), '50%');
  f.button.emit('click'); assert.equal(value(f.surface, '--pointer-x'), '20%');
  for (let i = 0; i < 4; i++) f.button.emit('click');
  assert.equal(value(f.surface, '--pointer-x'), '20%');
  f.reduce(true); control.syncMotion(); f.surface.emit('pointermove', { clientX: 300, clientY: 100 });
  assert.equal(value(f.surface, '--pointer-x'), '50%');
  f.button.emit('click'); assert.match(f.status.textContent, /ھەرىكەت ئازايتىلدى/);
  f.surface.rect.width = 0; f.surface.emit('pointermove', { clientX: NaN, clientY: Infinity });
  assert.equal(value(f.surface, '--pointer-y'), '50%');
  control.destroy(); control.destroy();
  f.reduce(false); f.button.emit('click'); assert.equal(value(f.surface, '--pointer-x'), '50%');
  assert.equal(f.surface.listenerCount() + f.button.listenerCount(), 0);
});

test('tilt bounds pointer and keyboard angles, applies depth sensitivity, and neutralizes blur and reduced motion', () => {
  const f = fixture('tilt'), control = interactionBindings.tilt(f.root);
  const touch = f.card.emit('pointermove', { pointerType: 'touch', clientX: 300, clientY: 100 });
  assert.equal(value(f.card, '--tilt-y'), '0deg'); assert.equal(touch.defaultPrevented, false);
  f.card.emit('pointermove', { clientX: 1000, clientY: -1000 });
  assert.equal(value(f.card, '--tilt-x'), '12deg'); assert.equal(value(f.card, '--tilt-y'), '12deg');
  f.depth.value = '8'; f.depth.emit('input');
  assert.equal(value(f.card, '--tilt-y'), '8deg');
  f.depth.value = '200'; f.depth.emit('input'); assert.equal(f.depth.value, '20');
  f.card.emit('blur'); assert.equal(value(f.card, '--tilt-x'), '0deg');
  for (let i = 0; i < 30; i++) assert.ok(f.card.emit('keydown', { key: 'ArrowLeft' }).defaultPrevented);
  assert.equal(value(f.card, '--tilt-y'), '-12deg');
  assert.equal(f.card.emit('keydown', { key: 'Tab' }).defaultPrevented, false);
  f.card.emit('pointerleave'); assert.equal(value(f.card, '--tilt-y'), '0deg');
  f.button.emit('click'); assert.equal(value(f.card, '--tilt-y'), '10deg');
  f.button.emit('click'); assert.equal(value(f.card, '--tilt-y'), '0deg');
  f.button.emit('click'); f.reduce(true); control.syncMotion();
  assert.equal(value(f.card, '--tilt-x'), '0deg'); assert.equal(value(f.card, '--tilt-y'), '0deg');
  f.card.emit('keydown', { key: 'ArrowUp' }); assert.equal(value(f.card, '--tilt-x'), '0deg');
  control.reset(); assert.equal(f.depth.value, '12');
  control.destroy(); assert.equal(f.card.listenerCount() + f.depth.listenerCount(), 0);
});

test('the artwork button and separate angle button both activate the Doppa pose and clean up', () => {
  const f = fixture('tilt'), external = new Element(f.doc);
  f.root.queries.set('button[data-action="tilt"]', external);
  const control = interactionBindings.tilt(f.root);
  f.card.emit('click'); assert.equal(value(f.card, '--tilt-y'), '10deg');
  external.emit('click'); assert.equal(value(f.card, '--tilt-y'), '0deg');
  control.destroy(); control.destroy();
  assert.equal(f.card.listenerCount() + external.listenerCount() + f.depth.listenerCount(), 0);
});

test('selection aligns the physical indicator, preserves button semantics, and supports RTL/LTR arrows and resizing', () => {
  const f = fixture('selection'), control = interactionBindings.selection(f.root);
  assert.deepEqual(pressed(f.choices), ['false', 'true', 'false']);
  assert.equal(f.indicator.style.left, '98px'); assert.equal(f.indicator.style.width, '90px');
  assert.equal(f.choices[1].getAttribute('role'), null); assert.equal(f.choices[1].getAttribute('tabindex'), null);
  f.choices[1].emit('keydown', { key: 'ArrowLeft' });
  assert.deepEqual(pressed(f.choices), ['false', 'false', 'true']); assert.equal(f.doc.activeElement, f.choices[2]);
  assert.equal(f.indicator.style.left, '8px');
  f.choices[2].emit('keydown', { key: 'ArrowLeft' }); assert.equal(f.doc.activeElement, f.choices[0]);
  f.doc.documentElement.dir = 'ltr'; f.choices[0].emit('keydown', { key: 'ArrowRight' }); assert.equal(f.doc.activeElement, f.choices[1]);
  f.choices[1].emit('keydown', { key: 'End' }); assert.equal(f.doc.activeElement, f.choices[2]);
  f.choices[2].emit('keydown', { key: 'Home' }); assert.equal(f.doc.activeElement, f.choices[0]);
  f.choices[2].emit('click'); f.choices[2].rect.left = 140; f.choices[2].rect.width = 100; f.observers[0].fire();
  assert.equal(f.indicator.style.left, '38px'); assert.equal(f.indicator.style.width, '100px');
  f.reduce(true); control.syncMotion(); assert.equal(f.indicator.style.transition, 'none');
  f.choices[0].emit('click'); assert.deepEqual(pressed(f.choices), ['true', 'false', 'false']); assert.match(f.status.textContent, /كۆك/);
  f.reduce(false); control.syncMotion(); assert.match(f.indicator.style.transition, /180ms/);
  control.reset(); assert.deepEqual(pressed(f.choices), ['false', 'true', 'false']);
  control.destroy(); assert.ok(f.observers[0].disconnected); assert.equal(f.observers[0].nodes.size, 0);
  const old = f.indicator.style.left; f.choices[1].rect.left = 999; f.observers[0].fire();
  assert.equal(f.indicator.style.left, old); assert.equal(f.choices.reduce((sum, node) => sum + node.listenerCount(), 0), 0);
});

test('selection has a removable window resize fallback when ResizeObserver is unavailable', () => {
  const f = fixture('selection', { resizeObserver: false }), control = interactionBindings.selection(f.root);
  f.choices[1].rect.left = 250; f.win.emit('resize'); assert.equal(f.indicator.style.left, '148px');
  control.destroy(); control.destroy(); assert.equal(f.win.listenerCount(), 0);
});

test('send completes only its local 900ms demo, blocks duplicate sends, and reset cancels pending completion', () => {
  const f = fixture('send'), control = interactionBindings.send(f.root);
  assert.equal(f.root.dataset.phase, 'ready');
  f.button.emit('click'); f.button.emit('click'); assert.equal(f.root.dataset.phase, 'sending'); assert.equal(f.timers.size, 1);
  assert.ok(f.button.disabled); f.tick(899); assert.equal(f.root.dataset.phase, 'sending');
  f.tick(1); assert.equal(f.root.dataset.phase, 'sent'); assert.equal(f.timers.size, 0); assert.match(f.status.textContent, /ئۇچۇر ئەۋەتىلمىدى/);
  f.button.emit('click'); assert.equal(f.timers.size, 0);
  f.resetButton.emit('click'); assert.equal(f.root.dataset.phase, 'ready'); assert.equal(f.button.disabled, false);
  f.button.emit('click'); f.resetButton.emit('click'); f.tick(1000);
  assert.equal(f.root.dataset.phase, 'ready'); assert.equal(f.timers.size, 0); assert.equal(f.networkCalls(), 0);
  control.destroy(); assert.equal(f.button.listenerCount() + f.resetButton.listenerCount(), 0);
});

test('send finishes immediately for reduced motion and mid-flight pause, and destruction cancels timers including ID zero', () => {
  const f = fixture('send'); let allowed = false;
  const control = interactionBindings.send(f.root, { motionAllowed: () => allowed });
  f.button.emit('click'); assert.equal(f.root.dataset.phase, 'sent'); assert.equal(f.timers.size, 0);
  control.reset(); allowed = true; f.button.emit('click'); assert.ok(f.timers.has(0));
  allowed = false; control.syncMotion(); assert.equal(f.root.dataset.phase, 'sent'); assert.equal(f.timers.size, 0);
  allowed = true; control.reset(); f.button.emit('click'); assert.equal(f.timers.size, 1);
  control.destroy(); control.destroy(); f.tick(1000); f.button.emit('click');
  assert.equal(f.root.dataset.phase, 'ready'); assert.equal(f.timers.size, 0);
});

test('compare keeps native range changes meaningful under reduced motion and clamps all split values', () => {
  const f = fixture('compare'), control = interactionBindings.compare(f.root, { motionAllowed: () => false });
  assert.equal(value(f.root, '--split'), '42%');
  for (const [input, expected] of [['-20', '0%'], ['200', '100%'], ['73.25', '73.25%'], ['bad', '50%']]) {
    f.input.value = input; const event = f.input.emit('input');
    assert.equal(value(f.root, '--split'), expected); assert.equal(event.defaultPrevented, false);
    assert.ok(f.status.textContent.includes(expected.replace('%', '٪')));
  }
  control.reset(); assert.equal(f.input.value, '42');
  control.destroy(); f.input.value = '10'; f.input.emit('input'); assert.equal(value(f.root, '--split'), '42%'); assert.equal(f.input.listenerCount(), 0);
});

test('ripple restarts with alternating pulses, owns one 1400ms timer, and becomes static when paused', () => {
  const f = fixture('ripple'), control = interactionBindings.ripple(f.root);
  f.button.emit('click'); assert.equal(f.root.dataset.pulse, 'a'); assert.equal(f.root.dataset.phase, 'active');
  f.button.emit('click'); assert.equal(f.root.dataset.pulse, 'b');
  for (let i = 0; i < 10; i++) f.button.emit('click');
  assert.equal(f.timers.size, 1); f.tick(1399); assert.equal(f.root.dataset.phase, 'active');
  f.tick(1); assert.equal(f.root.dataset.phase, 'ready'); assert.equal(f.root.dataset.pulse, 'b');
  f.reduce(true); f.button.emit('click'); assert.equal(f.timers.size, 0); assert.match(f.status.textContent, /كۇنۇپكا ئىشلىدى/);
  assert.equal(f.root.dataset.phase, 'ready'); assert.equal(f.root.dataset.pulse, 'a');
  f.button.emit('click'); assert.equal(f.root.dataset.pulse, 'b'); assert.equal(f.timers.size, 0);
  f.reduce(false); f.button.emit('click'); assert.equal(f.timers.size, 1);
  f.reduce(true); control.syncMotion(); assert.equal(f.root.dataset.phase, 'ready'); assert.equal(f.root.dataset.pulse, 'a'); assert.equal(f.timers.size, 0);
  control.reset(); assert.equal(f.status.textContent, 'تەييار'); assert.equal(f.root.dataset.pulse, undefined);
  f.reduce(false); f.button.emit('click'); control.destroy(); control.destroy(); f.tick(2000);
  assert.equal(f.root.dataset.phase, 'ready'); assert.equal(f.timers.size, 0); assert.equal(f.button.listenerCount(), 0);
});

test('missing required demo controls fail explicitly rather than installing partial listeners', () => {
  for (const mount of Object.values(interactionBindings)) {
    const f = fixture('empty'); assert.throws(() => mount(f.root), TypeError); assert.equal(f.win.listenerCount(), 0);
  }
});
