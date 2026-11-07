import { createKeyboard } from './vendor/keyboard/index.js';
import { previewCleanup as createCleanupPreview, visibleText } from './vendor/text/index.js';

/** Bind real Uyghur keyboard input and an explicit, reversible Unicode cleanup workflow. */
export function bindUyghurInput(root, { onChange, maxLength = 10000 } = {}) {
  if (!root?.querySelector || !root.ownerDocument) throw new TypeError('A writing container is required');
  if (onChange !== undefined && typeof onChange !== 'function') throw new TypeError('onChange must be a function');
  if (!Number.isInteger(maxLength) || maxLength < 1 || maxLength > 100000) throw new RangeError('maxLength must be an integer from 1 to 100000');
  const input = root.querySelector('[data-ug-writing-input]'), toggle = root.querySelector('[data-ug-keyboard-toggle]'), host = root.querySelector('[data-ug-keyboard]');
  const preview = root.querySelector('[data-ug-writing-preview]'), status = root.querySelector('[data-ug-writing-status]'), cleanup = root.querySelector('[data-ug-cleanup-preview]');
  const previewButton = root.querySelector('[data-ug-cleanup-preview-button]'), applyButton = root.querySelector('[data-ug-cleanup-apply]'), undoButton = root.querySelector('[data-ug-cleanup-undo]');
  if (input?.tagName !== 'TEXTAREA' || !toggle || !host || !preview || !status || !cleanup || !previewButton || !applyButton || !undoButton) throw new TypeError('Writing controls are incomplete');
  const doc = root.ownerDocument, win = doc.defaultView;
  const old = { maxLength: input.getAttribute('maxlength'), inputDir: input.getAttribute('dir'), invalid: input.getAttribute('aria-invalid'), previewDir: preview.getAttribute('dir'), expanded: toggle.getAttribute('aria-expanded'), hostHidden: host.hidden, applyDisabled: applyButton.disabled, undoDisabled: undoButton.disabled };
  const nativeLimit = old.maxLength !== null && /^\d+$/.test(old.maxLength) ? Number(old.maxLength) : Infinity;
  const limit = Math.min(maxLength, nativeLimit);
  input.setAttribute('maxlength', String(limit)); input.setAttribute('dir', 'auto'); preview.setAttribute('dir', 'auto'); toggle.setAttribute('aria-expanded', String(!host.hidden));
  const keyboard = createKeyboard(input, { container: host, direction: 'preserve', physical: false });
  let destroyed = false, composing = false, replacing = false, pending = null, undo = null, reported = input.value;
  const alive = () => { if (destroyed) throw new Error('Writing controller has been destroyed'); };
  const say = (message) => { status.textContent = message; };
  function validate() {
    alive();
    const length = input.value.length;
    const message = input.required && !input.value ? 'مەزمۇن كىرگۈزۈڭ.' : length > limit ? `مەزمۇن ئۇزۇنلۇقى ${limit} چەكتىن ئېشىپ كەتتى.` : '';
    input.setAttribute('aria-invalid', String(Boolean(message)));
    if (message) say(message);
    return { valid: !message, message, length, maxLength: limit };
  }
  function updateButtons() { applyButton.disabled = composing || !pending?.changed || pending.original !== input.value || input.disabled || input.readOnly; undoButton.disabled = composing || !undo || undo.after !== input.value || input.disabled || input.readOnly; }
  function refresh(notify = false) {
    preview.textContent = input.value;
    const result = validate(); if (result.valid) say(`${result.length} / ${limit}`);
    updateButtons();
    if (notify && reported !== input.value) { reported = input.value; onChange?.(input.value); }
  }
  function invalidate() { pending = null; cleanup.textContent = ''; if (undo?.after !== input.value) undo = null; }
  function changed(event) { if (destroyed || composing || event?.isComposing) return; invalidate(); refresh(true); }
  function beforeInput(event) {
    if (destroyed || replacing || composing || event.isComposing || event.defaultPrevented || !event.inputType?.startsWith('insert')) return;
    const text = typeof event.data === 'string' ? event.data : event.dataTransfer?.getData?.('text/plain');
    if (typeof text !== 'string') return; // The native textarea enforces its own maxLength for paste/IME.
    const start = input.selectionStart ?? input.value.length, end = input.selectionEnd ?? start;
    if (input.value.length - (end - start) + text.length > limit) { event.preventDefault(); say(`مەزمۇن ئۇزۇنلۇقى ${limit} چەكتىن ئېشىپ كەتتى.`); }
  }
  function makeInputEvent(name, text, cancelable) {
    if (typeof win.InputEvent === 'function') return new win.InputEvent(name, { bubbles: true, composed: true, cancelable, inputType: 'insertReplacementText', data: text });
    const event = new win.Event(name, { bubbles: true, composed: true, cancelable });
    Object.defineProperties(event, { inputType: { value: 'insertReplacementText' }, data: { value: text } }); return event;
  }
  function caret() { return { start: input.selectionStart ?? 0, end: input.selectionEnd ?? 0, direction: input.selectionDirection || 'none' }; }
  function commit(text, selection, { editable = true, restoreOriginal = false } = {}) {
    if (composing || editable && (input.disabled || input.readOnly)) return false;
    if (!restoreOriginal && text.length > limit) { say(`مەزمۇن ئۇزۇنلۇقى ${limit} چەكتىن ئېشىپ كەتتى.`); return false; }
    replacing = true;
    let accepted;
    try { accepted = input.dispatchEvent(makeInputEvent('beforeinput', text, true)); } finally { replacing = false; }
    if (!accepted) { say('ئۆزگەرتىش قوللىنىلمىدى.'); return false; }
    input.value = text;
    input.setSelectionRange(Math.min(selection.start, text.length), Math.min(selection.end, text.length), selection.direction);
    input.dispatchEvent(makeInputEvent('input', text, false)); return true;
  }
  function setValue(value) {
    alive(); if (typeof value !== 'string') throw new TypeError('Writing value must be a string');
    if (value.length > limit) throw new RangeError(`Writing value exceeds maxLength ${limit}`);
    if (value === input.value) return false;
    return commit(value, caret(), { editable: false });
  }
  function previewCleanup(options = {}) {
    alive(); if (composing) { say('يېزىش تاماملانغاندىن كېيىن ئالدىن كۆرۈڭ.'); return null; }
    const result = createCleanupPreview(input.value, options);
    pending = Object.freeze({ ...result, options: Object.freeze({ ...result.options }), changes: Object.freeze(result.changes.map((change) => Object.freeze({ ...change }))), diff: Object.freeze({ ...result.diff }) });
    cleanup.textContent = visibleText(result.text, { showSpaces: false }); updateButtons();
    say(result.changed ? 'ئالدىن كۆرۈنۈش تەييار. قوللىنىشتىن بۇرۇن ئۆزگىرىشنى تەكشۈرۈڭ.' : 'بۇ تاللاشلاردا ئۆزگىرىش يوق.'); return pending;
  }
  function applyCleanup() {
    alive();
    if (!pending?.changed || pending.original !== input.value || composing) { invalidate(); updateButtons(); say('ئاۋۋال يېڭى ئالدىن كۆرۈنۈش ھاسىل قىلىڭ.'); return false; }
    const candidate = pending, previous = caret(), before = input.value;
    const a = candidate.diff.prefix.length, b = a + candidate.diff.removed.length, inserted = candidate.diff.added.length;
    const mapped = (offset) => offset <= a ? offset : offset >= b ? offset + inserted - (b - a) : a + inserted;
    if (!commit(candidate.text, { start: mapped(previous.start), end: mapped(previous.end), direction: previous.direction })) return false;
    if (input.value === candidate.text) undo = { before, after: candidate.text, selection: previous };
    pending = null; updateButtons(); say('ئۆزگىرىش قوللىنىلدى؛ بىر قېتىم كەينىگە قايتۇرالايسىز.'); return true;
  }
  function undoCleanup() {
    alive(); if (!undo || undo.after !== input.value || composing) { updateButtons(); return false; }
    const record = undo;
    if (!commit(record.before, record.selection, { restoreOriginal: true })) return false;
    undo = null; pending = null; cleanup.textContent = ''; updateButtons(); say('ئەسلى مەزمۇن قايتۇرۇلدى.'); return true;
  }
  function toggleKeyboard() { if (destroyed) return; host.hidden = !host.hidden; toggle.setAttribute('aria-expanded', String(!host.hidden)); if (host.hidden && host.contains(doc.activeElement)) toggle.focus(); }
  function keyboardEscape(event) { if (event.key === 'Escape' && !host.hidden) { event.preventDefault(); host.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); } }
  function compositionStart() { composing = true; pending = null; cleanup.textContent = ''; updateButtons(); }
  function compositionEnd() { composing = false; invalidate(); refresh(true); }
  const previewClick = () => previewCleanup({ normalization: 'NFC', lineEndings: 'lf' });
  input.addEventListener('beforeinput', beforeInput); input.addEventListener('input', changed); input.addEventListener('compositionstart', compositionStart); input.addEventListener('compositionend', compositionEnd);
  toggle.addEventListener('click', toggleKeyboard); host.addEventListener('keydown', keyboardEscape); previewButton.addEventListener('click', previewClick); applyButton.addEventListener('click', applyCleanup); undoButton.addEventListener('click', undoCleanup);
  refresh();
  return {
    getValue() { alive(); return input.value; }, setValue, previewCleanup, applyCleanup, undoCleanup, validate,
    destroy() {
      if (destroyed) return; destroyed = true;
      input.removeEventListener('beforeinput', beforeInput); input.removeEventListener('input', changed); input.removeEventListener('compositionstart', compositionStart); input.removeEventListener('compositionend', compositionEnd);
      toggle.removeEventListener('click', toggleKeyboard); host.removeEventListener('keydown', keyboardEscape); previewButton.removeEventListener('click', previewClick); applyButton.removeEventListener('click', applyCleanup); undoButton.removeEventListener('click', undoCleanup);
      keyboard.destroy(); host.hidden = old.hostHidden; applyButton.disabled = old.applyDisabled; undoButton.disabled = old.undoDisabled;
      for (const [node, attribute, value] of [[input, 'maxlength', old.maxLength], [input, 'dir', old.inputDir], [input, 'aria-invalid', old.invalid], [preview, 'dir', old.previewDir], [toggle, 'aria-expanded', old.expanded]]) { if (value === null) node.removeAttribute(attribute); else node.setAttribute(attribute, value); }
      pending = null; undo = null;
    },
  };
}
