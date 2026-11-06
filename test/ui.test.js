import test from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { iconSVG, flagSVG, iconNames, bindDialog, bindDisclosure, bindTabs, validateForm, bindForm, showToast } from '../src/index.js';
import { components } from '../docs/components.js';
import { componentSnippet } from '../docs/snippets.js';

class Node {
  constructor(doc) { this.ownerDocument = doc; this.attrs = new Map(); this.events = new Map(); this.children = []; this.hidden = false; this.isConnected = true; this.textContent = ''; }
  getAttribute(name) { return this.attrs.get(name) ?? null; }
  setAttribute(name, value) { this.attrs.set(name, String(value)); }
  removeAttribute(name) { this.attrs.delete(name); }
  addEventListener(name, fn) { if (!this.events.has(name)) this.events.set(name, new Set()); this.events.get(name).add(fn); }
  removeEventListener(name, fn) { this.events.get(name)?.delete(fn); }
  emit(name, extra = {}) { const event = { target: this, prevented: false, defaultPrevented: false, preventDefault() { this.prevented = true; this.defaultPrevented = true; }, ...extra }; this.events.get(name)?.forEach((fn) => fn(event)); return event; }
  append(...nodes) { nodes.forEach((node) => { node.parent = this; this.children.push(node); }); }
  remove() { this.isConnected = false; if (this.parent) this.parent.children = this.parent.children.filter((n) => n !== this); }
  contains(node) { return node === this || this.children.some((n) => n.contains(node)); }
  closest(selector) { if (selector === '[role="tab"]' && this.getAttribute('role') === 'tab' || selector === '[role="tablist"]' && this.getAttribute('role') === 'tablist' || selector === '[data-ug-close]' && this.getAttribute('data-ug-close') !== null || selector === '.ug-ui' && this.className?.split(/\s+/).includes('ug-ui')) return this; return this.parent?.closest(selector) ?? null; }
  focus() { this.ownerDocument.activeElement = this; }
}
function documentMock(dir = 'rtl') { const doc = { documentElement: { dir }, nodes: new Map(), createElement: () => new Node(doc), getElementById: (id) => doc.nodes.get(id), defaultView: { getComputedStyle: (node) => ({ direction: node.dir || dir }) } }; return doc; }

test('icons are bounded, accessible, deterministic and reject untrusted names/options', () => {
  assert.ok(iconNames.length >= 48);
  assert.equal(new Set(iconNames).size, iconNames.length);
  assert.match(iconSVG('search'), /aria-hidden="true"/);
  assert.match(iconSVG('search', { label: '<Search "now">' }), /aria-label="&lt;Search &quot;now&quot;&gt;"/);
  assert.doesNotMatch(iconSVG('search', { label: '<script>' }), /<script>/);
  assert.equal(iconSVG('flower'), iconSVG('flower'));
  assert.throws(() => iconSVG('constructor'), RangeError);
  assert.throws(() => iconSVG('search', { size: '24" onload="alert(1)' }), RangeError);
  assert.throws(() => iconSVG('search', { strokeWidth: Infinity }), RangeError);
});
test('flag retains blue field, white geometry, ratio and escaped accessible name without RTL mirroring', () => {
  const svg = flagSVG({ width: 900, label: '<Flag>' });
  assert.match(svg, /width="900" height="600"/);
  assert.match(svg, /viewBox="0 -30000 90000 60000"/);
  assert.match(svg, /fill="#559EE2"/); assert.match(svg, /fill="#fff"/);
  assert.match(svg, /aria-label="&lt;Flag&gt;"/); assert.doesNotMatch(svg, /transform=|scale\(-1/);
  assert.throws(() => flagSVG({ width: NaN }), RangeError);
});
test('copied gallery snippets carry the Uyghur scope and rendered SVG rather than gallery-only placeholders', () => {
  for (const component of components) {
    const snippet = componentSnippet(component);
    assert.match(snippet, /<div class="ug-ui" lang="ug" dir="rtl">/);
    assert.ok(snippet.includes("import '@uyghurcommunity/ui/styles.css';"));
    assert.equal(snippet.includes('data-ug-icon'), false);
    assert.equal(snippet.includes('demo-row'), false);
    assert.equal(snippet.includes('form-pair'), false);
    assert.ok(snippet.includes(component.js));
    const placeholders = [...component.html.matchAll(/data-ug-icon="([a-z-]+)"/g)];
    for (const [, name] of placeholders) assert.ok(snippet.includes(iconSVG(name)));
  }
});
test('copied feedback script creates its own live region and wires a persistent dismissible toast from a blank page', () => {
  const doc = documentMock(), scope = new Node(doc), button = new Node(doc), deliveries = [];
  scope.className = 'ug-ui'; scope.append(button); doc.nodes.set('toast-demo', button);
  assert.equal(doc.getElementById('notifications'), undefined);
  const feedback = components.find((component) => component.id === 'feedback');
  // Supply the real imported controller, then execute the rest of the copied module unchanged.
  const script = feedback.js.replace(/^import \{ showToast \} from '@uyghurcommunity\/ui';\n/, '');
  runInNewContext(script, { document: doc, showToast(...args) { deliveries.push(args); return showToast(...args); } });
  const region = scope.children.find((node) => node.className === 'ug-toast-region');
  assert.ok(region);
  assert.equal(region.getAttribute('role'), 'status');
  assert.equal(region.getAttribute('aria-live'), 'polite');
  assert.equal(region.getAttribute('aria-relevant'), 'additions text');
  assert.equal(region.children.length, 0); assert.equal(deliveries.length, 0);
  button.emit('click');
  assert.equal(deliveries.length, 1); assert.equal(deliveries[0][0], region);
  assert.equal(deliveries[0][2].duration, 0);
  assert.equal(region.children.length, 1);
  assert.equal(region.children[0].children[0].textContent, 'مىسال ئۇقتۇرۇش.');
  assert.equal(region.children[0].children[1].getAttribute('aria-label'), 'ئۇقتۇرۇشنى تاقاش');
  region.children[0].children[1].emit('click'); assert.equal(region.children.length, 0);
  button.emit('click'); assert.equal(region.children.length, 1);
});
test('native dialog binding opens, restores focus, delegates close and cleans up', () => {
  const doc = documentMock(), trigger = new Node(doc), input = new Node(doc), dialog = new Node(doc), closeButton = new Node(doc);
  trigger.focus(); dialog.setAttribute('aria-labelledby', 'title'); dialog.append(input, closeButton); closeButton.setAttribute('data-ug-close', 'cancel');
  dialog.showModal = () => { dialog.open = true; }; dialog.close = (value) => { dialog.open = false; dialog.returnValue = value; dialog.emit('close'); };
  const ui = bindDialog(dialog, { trigger, initialFocus: input });
  trigger.emit('click'); assert.equal(dialog.open, true); assert.equal(doc.activeElement, input); assert.equal(trigger.getAttribute('aria-expanded'), 'true');
  dialog.emit('click', { target: closeButton }); assert.equal(dialog.open, false); assert.equal(dialog.returnValue, 'cancel'); assert.equal(doc.activeElement, trigger);
  ui.destroy(); ui.destroy(); assert.equal(trigger.getAttribute('aria-expanded'), null); trigger.emit('click'); assert.equal(dialog.open, false);
  assert.throws(() => ui.open(), /destroyed/);
});
test('dialog rejects unsupported and unnamed elements and ignores repeated open', () => {
  assert.throws(() => bindDialog({}), TypeError);
  const dialog = new Node(documentMock()); dialog.showModal = () => {}; dialog.close = () => {};
  assert.throws(() => bindDialog(dialog), /label/);
  dialog.setAttribute('aria-label', 'Settings'); let opened = 0; dialog.showModal = () => { dialog.open = true; opened++; };
  const ui = bindDialog(dialog); ui.open(); ui.open(); assert.equal(opened, 1);
});
test('queued native close events cannot steal focus from a reopened dialog, and destroy restores focus', () => {
  const doc = documentMock(), trigger = new Node(doc), input = new Node(doc), dialog = new Node(doc);
  trigger.focus(); dialog.setAttribute('aria-label', 'Settings'); dialog.append(input);
  dialog.showModal = () => { dialog.open = true; };
  // Native close dispatches its close event later, unlike the synchronous mock above.
  dialog.close = () => { dialog.open = false; trigger.focus(); };
  const ui = bindDialog(dialog, { trigger, initialFocus: input });
  ui.open(); ui.close(); ui.open(); dialog.emit('close');
  assert.equal(doc.activeElement, input);
  assert.equal(trigger.getAttribute('aria-expanded'), 'true');
  ui.destroy();
  assert.equal(dialog.open, false);
  assert.equal(doc.activeElement, trigger);
  assert.equal(trigger.getAttribute('aria-expanded'), null);
  dialog.emit('close');
  assert.equal(trigger.getAttribute('aria-expanded'), null);
});
test('disclosure toggles and Escape closes while destroy restores the consumer state', () => {
  const doc = documentMock(), button = new Node(doc), panel = new Node(doc); panel.hidden = true;
  const ui = bindDisclosure(button, panel); button.emit('click'); assert.equal(panel.hidden, false);
  panel.emit('keydown', { key: 'Escape' }); assert.equal(panel.hidden, true); assert.equal(doc.activeElement, button);
  ui.destroy(); assert.equal(button.getAttribute('aria-expanded'), null); assert.equal(panel.hidden, true);
});
test('nested disclosure Escape closes only the inner panel, and programmatic collapse returns hidden focus', () => {
  const doc = documentMock(), outerButton = new Node(doc), outer = new Node(doc), innerButton = new Node(doc), inner = new Node(doc), link = new Node(doc);
  outer.append(innerButton, inner); inner.append(link);
  const first = bindDisclosure(outerButton, outer), second = bindDisclosure(innerButton, inner);
  link.focus(); const event = inner.emit('keydown', { key: 'Escape', target: link });
  outer.emit('keydown', { key: 'Escape', target: link, defaultPrevented: event.defaultPrevented });
  assert.equal(inner.hidden, true); assert.equal(outer.hidden, false); assert.equal(doc.activeElement, innerButton);
  second.setOpen(true); link.focus(); second.setOpen(false); assert.equal(doc.activeElement, innerButton);
  assert.equal(innerButton.emit('click').prevented, true);
  first.destroy(); second.destroy();
});
function tabFixture(dir) {
  const doc = documentMock(dir), root = new Node(doc), list = new Node(doc);
  list.setAttribute('role', 'tablist'); root.append(list);
  const tabs = [0, 1, 2].map((i) => { const t = new Node(doc), p = new Node(doc); t.setAttribute('role', 'tab'); t.setAttribute('aria-controls', `panel-${i}`); doc.nodes.set(`panel-${i}`, p); list.append(t); root.append(p); return t; });
  list.querySelectorAll = () => tabs;
  root.querySelectorAll = () => tabs; root.querySelector = () => list;
  return { doc, root, list, tabs, panels: [...doc.nodes.values()] };
}
test('tabs reverse horizontal arrows in RTL, wrap enabled tabs and restore originals', () => {
  const { doc, root, tabs, panels } = tabFixture('rtl'); tabs[1].disabled = true;
  const ui = bindTabs(root); assert.equal(panels[0].hidden, false); assert.equal(panels[2].hidden, true);
  const event = root.emit('keydown', { target: tabs[0], key: 'ArrowLeft' }); assert.equal(event.prevented, true); assert.equal(doc.activeElement, tabs[2]); assert.equal(panels[2].hidden, false);
  root.emit('keydown', { target: tabs[2], key: 'ArrowLeft' }); assert.equal(doc.activeElement, tabs[0]);
  root.emit('keydown', { target: tabs[0], key: 'End' }); assert.equal(doc.activeElement, tabs[2]);
  assert.throws(() => ui.select(tabs[1]), RangeError);
  ui.destroy(); assert.equal(tabs[0].getAttribute('tabindex'), null); assert.equal(panels[2].hidden, false);
});
test('tabs support LTR, vertical navigation and reject foreign panels', () => {
  const { doc, root, tabs, list } = tabFixture('ltr'); const ui = bindTabs(root);
  root.emit('keydown', { target: tabs[0], key: 'ArrowRight' }); assert.equal(doc.activeElement, tabs[1]);
  list.setAttribute('aria-orientation', 'vertical'); root.emit('keydown', { target: tabs[1], key: 'ArrowDown' }); assert.equal(doc.activeElement, tabs[2]);
  ui.destroy(); tabs[0].setAttribute('aria-controls', 'missing'); assert.throws(() => bindTabs(root), TypeError);
});
test('tabs use current disabled states and the tablist direction, and reject duplicate panels', () => {
  const { doc, root, tabs, list } = tabFixture('rtl'); list.dir = 'ltr';
  const ui = bindTabs(root);
  tabs[1].setAttribute('aria-disabled', 'true');
  root.emit('keydown', { target: tabs[0], key: 'ArrowRight' }); assert.equal(doc.activeElement, tabs[2]);
  assert.throws(() => ui.select(tabs[1]), RangeError);
  tabs[1].removeAttribute('aria-disabled'); tabs[2].disabled = true;
  root.emit('keydown', { target: tabs[0], key: 'ArrowRight' }); assert.equal(doc.activeElement, tabs[1]);
  ui.destroy(); tabs[1].setAttribute('aria-controls', 'panel-0');
  assert.throws(() => bindTabs(root), /distinct panel/);
});
test('an outer tab group does not mutate or intercept a nested tablist', () => {
  const { root, tabs, list, panels, doc } = tabFixture('rtl');
  const nestedList = new Node(doc), nestedTab = new Node(doc); nestedList.setAttribute('role', 'tablist'); nestedTab.setAttribute('role', 'tab'); nestedTab.setAttribute('aria-selected', 'true'); nestedList.append(nestedTab); panels[0].append(nestedList);
  list.querySelectorAll = () => [...tabs, nestedTab];
  const ui = bindTabs(root);
  assert.equal(nestedTab.getAttribute('aria-selected'), 'true');
  assert.equal(nestedTab.getAttribute('tabindex'), null);
  assert.equal(root.emit('keydown', { target: nestedTab, key: 'ArrowLeft' }).prevented, false);
  ui.select(tabs[1]); assert.equal(nestedTab.getAttribute('aria-selected'), 'true');
  ui.destroy();
});
test('form validation reports actual constraints, focuses first error and clears stale messages', () => {
  const doc = documentMock(), form = new Node(doc), field = new Node(doc), error = new Node(doc); field.name = 'email'; field.setAttribute('data-ug-error', 'error'); doc.nodes.set('error', error); form.elements = [field];
  field.validity = { valueMissing: true }; field.checkValidity = () => !field.validity.valueMissing;
  let called = 0; const ui = bindForm(form, { onValid: () => called++ });
  let event = form.emit('submit'); assert.equal(event.prevented, true); assert.equal(called, 0); assert.equal(field.getAttribute('aria-invalid'), 'true'); assert.equal(doc.activeElement, field); assert.match(error.textContent, /رامكىنى/);
  field.validity.valueMissing = false; event = form.emit('submit'); assert.equal(event.prevented, true); assert.equal(called, 1); assert.equal(error.textContent, '');
  ui.destroy(); form.emit('submit'); assert.equal(called, 1);
  field.willValidate = false; assert.deepEqual(validateForm(form), []);
});
test('form binding owns novalidate and restores consumer validation attributes/messages on destroy', () => {
  const doc = documentMock(), form = new Node(doc), field = new Node(doc), error = new Node(doc);
  field.name = 'name'; field.setAttribute('data-ug-error', 'name-error'); field.setAttribute('aria-invalid', 'grammar');
  field.validity = { valueMissing: true }; field.checkValidity = () => false; form.elements = [field];
  error.textContent = 'Original helper'; doc.nodes.set('name-error', error);
  const ui = bindForm(form);
  assert.equal(form.getAttribute('novalidate'), '');
  assert.equal(form.emit('submit').prevented, true);
  assert.equal(field.getAttribute('aria-invalid'), 'true'); assert.notEqual(error.textContent, 'Original helper');
  ui.destroy(); ui.destroy();
  assert.equal(form.getAttribute('novalidate'), null);
  assert.equal(field.getAttribute('aria-invalid'), 'grammar'); assert.equal(error.textContent, 'Original helper');
  assert.throws(() => ui.validate(), /destroyed/);
  form.setAttribute('novalidate', 'novalidate');
  const second = bindForm(form); second.destroy(); assert.equal(form.getAttribute('novalidate'), 'novalidate');
});
test('form messages do not inherit prototype keys, and disabled fields clear obsolete errors', () => {
  const doc = documentMock(), form = new Node(doc), field = new Node(doc), error = new Node(doc);
  field.name = 'constructor'; field.setAttribute('data-ug-error', 'error'); doc.nodes.set('error', error);
  field.validity = { valueMissing: true }; field.checkValidity = () => false; form.elements = [field];
  assert.equal(typeof validateForm(form)[0].message, 'string'); assert.match(error.textContent, /رامكىنى/);
  assert.equal(validateForm(form, { messages: { constructor: 'Own message' } })[0].message, 'Own message');
  field.willValidate = false;
  assert.deepEqual(validateForm(form), []); assert.equal(error.textContent, ''); assert.equal(field.getAttribute('aria-invalid'), 'false');
});
test('toasts treat messages as text and can remain until explicitly dismissed', () => {
  const doc = documentMock(), region = new Node(doc), message = '<img src=x onerror=alert(1)>';
  const toast = showToast(region, message, { duration: 0 }); assert.equal(region.children.length, 1); assert.equal(toast.element.children[0].textContent, message);
  toast.element.children[1].emit('click'); assert.equal(region.children.length, 0); toast.dismiss();
  assert.throws(() => showToast(region, 'x', { duration: -1 }), TypeError);
});
test('dismissing a keyboard-focused toast restores focus without moving focus for unrelated dismissals', () => {
  const doc = documentMock(), region = new Node(doc), trigger = new Node(doc), elsewhere = new Node(doc); trigger.focus();
  const first = showToast(region, 'message', { duration: 0 }); first.element.children[1].focus(); first.dismiss();
  assert.equal(doc.activeElement, trigger);
  const second = showToast(region, 'message', { duration: 0 }); elsewhere.focus(); second.dismiss();
  assert.equal(doc.activeElement, elsewhere);
});
