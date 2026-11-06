import test from 'node:test';
import assert from 'node:assert/strict';
import { bindGalleryLinks } from '../docs/gallery-links.js';
function fixture(hash = '#component-buttons') {
  const events = () => ({ handlers: new Map(), addEventListener(name, fn) { this.handlers.set(name, fn); }, removeEventListener(name) { this.handlers.delete(name); }, emit(name, event = {}) { this.handlers.get(name)?.(event); } });
  const win = events(), doc = events(), frames = new Map(); let next = 1, calls = 0;
  win.location = { href: `https://uyghurcommunity.github.io/uyghur-ui/index.html${hash}` };
  win.requestAnimationFrame = (fn) => { const id = next++; frames.set(id, fn); return id; }; win.cancelAnimationFrame = (id) => frames.delete(id);
  const ui = bindGalleryLinks(win, doc, () => calls++);
  return { win, doc, ui, calls: () => calls, flush() { const pending = [...frames.values()]; frames.clear(); pending.forEach((fn) => fn()); }, click(href, extra = {}, attrs = {}) { const anchor = { href, target: attrs.target || '', hasAttribute: (name) => Boolean(attrs[name]) }; doc.emit('click', { button: 0, target: { closest: () => anchor }, ...extra }); } };
}
test('reselecting a filtered component or closed icon at the current hash reveals it after native dialog close', () => {
  for (const hash of ['#component-buttons', '#icon-search']) {
    const f = fixture(hash); f.click(`index.html${hash}`); assert.equal(f.calls(), 0); f.flush(); assert.equal(f.calls(), 1);
    f.click(`index.html${hash}`); f.flush(); assert.equal(f.calls(), 2);
  }
});
test('changed fragments use native hash navigation and a real hashchange event', () => {
  const f = fixture(); f.click('index.html#component-forms'); f.flush(); assert.equal(f.calls(), 0);
  f.win.location.href = 'https://uyghurcommunity.github.io/uyghur-ui/index.html#component-forms'; f.win.emit('hashchange'); assert.equal(f.calls(), 1);
});
test('new-tab, download, external, malformed and modified clicks preserve normal navigation', () => {
  const f = fixture();
  for (const extra of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { defaultPrevented: true }]) f.click('index.html#component-buttons', extra);
  f.click('index.html#component-buttons', {}, { target: '_blank' }); f.click('index.html#component-buttons', {}, { download: true });
  for (const href of ['https://other.example/index.html#component-buttons', 'guide/components.html#component-buttons', 'index.html?mode=other#component-buttons', 'http://[invalid']) f.click(href);
  f.flush(); assert.equal(f.calls(), 0);
});
test('pending navigation is cancelled on teardown and listener cleanup is idempotent', () => {
  const f = fixture(); f.click('index.html#component-buttons'); f.ui.destroy(); f.ui.destroy(); f.flush(); f.win.emit('hashchange'); assert.equal(f.calls(), 0); assert.equal(f.doc.handlers.size, 0); assert.equal(f.win.handlers.size, 0);
});
