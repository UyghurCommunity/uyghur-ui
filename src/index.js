export { iconSVG, flagSVG, iconNames, coloredIconNames, directionalIcons, iconCatalog, iconCategories, findIcons } from './icons.js';
export { mapSVG, mapMetadata } from './maps.js';

function restoreAttribute(node, key, value) { value === null ? node.removeAttribute(key) : node.setAttribute(key, value); }

/** Native modal behavior provides focus containment and background inertness. */
export function bindDialog(dialog, { trigger, initialFocus } = {}) {
  if (!dialog || typeof dialog.showModal !== 'function' || typeof dialog.close !== 'function') throw new TypeError('A supported native <dialog> is required');
  const doc = dialog.ownerDocument;
  if (!dialog.getAttribute('aria-label') && !dialog.getAttribute('aria-labelledby')) throw new TypeError('Give the dialog an accessible label');
  let previous, destroyed = false;
  const expanded = trigger?.getAttribute('aria-expanded') ?? null;
  function afterClose() {
    // Native close events are queued. A previous close must not affect a reopened dialog.
    if (destroyed || dialog.open) return;
    trigger?.setAttribute('aria-expanded', 'false');
    if (previous?.isConnected && typeof previous.focus === 'function') previous.focus();
    previous = null;
  }
  function open() {
    if (destroyed) throw new Error('Dialog binding has been destroyed');
    if (dialog.open) return;
    previous = doc.activeElement;
    dialog.showModal();
    trigger?.setAttribute('aria-expanded', 'true');
    if (initialFocus && dialog.contains(initialFocus)) initialFocus.focus();
  }
  function close(value = '') { if (!destroyed && dialog.open) dialog.close(value); }
  function onTrigger(event) { event.preventDefault(); open(); }
  function onClick(event) {
    const button = event.target.closest?.('[data-ug-close]');
    if (button && dialog.contains(button)) { event.preventDefault(); close(button.getAttribute('data-ug-close') || ''); }
  }
  trigger?.setAttribute('aria-expanded', String(dialog.open));
  trigger?.addEventListener('click', onTrigger);
  dialog.addEventListener('click', onClick);
  dialog.addEventListener('close', afterClose);
  return {
    open, close,
    destroy() {
      if (destroyed) return;
      close(); destroyed = true;
      if (previous?.isConnected && typeof previous.focus === 'function') previous.focus();
      previous = null;
      trigger?.removeEventListener('click', onTrigger);
      dialog.removeEventListener('click', onClick);
      dialog.removeEventListener('close', afterClose);
      if (trigger) restoreAttribute(trigger, 'aria-expanded', expanded);
    },
  };
}

/** Bind a native disclosure button without changing content or document direction. */
export function bindDisclosure(button, panel) {
  if (!button || !panel) throw new TypeError('A button and panel are required');
  const oldExpanded = button.getAttribute('aria-expanded'), oldHidden = panel.hidden;
  let destroyed = false;
  function setOpen(value) {
    if (destroyed) throw new Error('Disclosure binding has been destroyed');
    panel.hidden = !value; button.setAttribute('aria-expanded', String(!!value));
    if (!value && panel.contains(panel.ownerDocument.activeElement)) button.focus();
  }
  function toggle() { setOpen(panel.hidden); }
  function onClick(event) { event.preventDefault(); toggle(); }
  function onKey(event) { if (!event.defaultPrevented && event.key === 'Escape' && !panel.hidden) { event.preventDefault(); setOpen(false); button.focus(); } }
  button.addEventListener('click', onClick); panel.addEventListener('keydown', onKey);
  setOpen(!panel.hidden);
  return { setOpen, toggle, destroy() { if (destroyed) return; destroyed = true; button.removeEventListener('click', onClick); panel.removeEventListener('keydown', onKey); panel.hidden = oldHidden; if (oldHidden && panel.contains(panel.ownerDocument.activeElement)) button.focus(); restoreAttribute(button, 'aria-expanded', oldExpanded); } };
}

/** Automatic-activation tabs, including RTL horizontal arrow navigation. */
export function bindTabs(container) {
  if (!container?.querySelectorAll) throw new TypeError('A tab container is required');
  const list = container.querySelector('[role="tablist"]');
  if (!list) throw new TypeError('A tablist is required');
  const tabs = [...list.querySelectorAll('[role="tab"]')].filter((tab) => tab.closest('[role="tablist"]') === list);
  const enabledTabs = () => tabs.filter((tab) => !tab.disabled && tab.getAttribute('aria-disabled') !== 'true');
  if (!enabledTabs().length) throw new TypeError('At least one enabled tab is required');
  const doc = container.ownerDocument;
  const panels = tabs.map((tab) => doc.getElementById(tab.getAttribute('aria-controls')));
  if (panels.some((panel) => !panel || !container.contains(panel))) throw new TypeError('Each tab must control a panel inside the container');
  if (new Set(panels).size !== panels.length) throw new TypeError('Each tab must control a distinct panel');
  const originals = tabs.map((tab, i) => ({ selected: tab.getAttribute('aria-selected'), tabindex: tab.getAttribute('tabindex'), hidden: panels[i].hidden }));
  let destroyed = false;
  function select(tab, focus = false) {
    if (destroyed) throw new Error('Tab binding has been destroyed');
    if (!enabledTabs().includes(tab)) throw new RangeError('Select an enabled tab from this container');
    tabs.forEach((item, i) => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.setAttribute('tabindex', active ? '0' : '-1'); panels[i].hidden = !active; });
    if (focus) tab.focus();
  }
  function clicked(event) { const tab = event.target.closest?.('[role="tab"]'); if (!event.defaultPrevented && enabledTabs().includes(tab)) { event.preventDefault(); select(tab); } }
  function keyed(event) {
    if (event.defaultPrevented) return;
    const enabled = enabledTabs();
    const tab = event.target.closest?.('[role="tab"]'); if (!enabled.includes(tab)) return;
    const vertical = list.getAttribute('aria-orientation') === 'vertical';
    const rtl = (doc.defaultView?.getComputedStyle?.(list).direction || list.dir || doc.documentElement.dir) === 'rtl';
    let step = 0, index = enabled.indexOf(tab);
    if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = enabled.length - 1;
    else if (vertical && event.key === 'ArrowDown' || !vertical && event.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) step = 1;
    else if (vertical && event.key === 'ArrowUp' || !vertical && event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) step = -1;
    else return;
    event.preventDefault(); if (step) index = (index + step + enabled.length) % enabled.length;
    select(enabled[index], true);
  }
  container.addEventListener('click', clicked); container.addEventListener('keydown', keyed);
  select(enabledTabs().find((tab) => tab.getAttribute('aria-selected') === 'true') || enabledTabs()[0]);
  return { select, destroy() { if (destroyed) return; destroyed = true; container.removeEventListener('click', clicked); container.removeEventListener('keydown', keyed); tabs.forEach((tab, i) => { restoreAttribute(tab, 'aria-selected', originals[i].selected); restoreAttribute(tab, 'tabindex', originals[i].tabindex); panels[i].hidden = originals[i].hidden; }); } };
}

const defaultMessages = {
  valueMissing: 'بۇ رامكىنى تولدۇرۇڭ.', typeMismatch: 'مۇۋاپىق قىممەت كىرگۈزۈڭ.', patternMismatch: 'كۆرسىتىلگەن شەكىلدە كىرگۈزۈڭ.',
  tooShort: 'تېكىست بەك قىسقا.', tooLong: 'تېكىست بەك ئۇزۇن.', rangeUnderflow: 'قېنى تېخىمۇ چوڭ قىممەت كىرگۈزۈڭ.', rangeOverflow: 'كىچىكرەك قىممەت كىرگۈزۈڭ.',
};
export function validateForm(form, { messages = {} } = {}) {
  if (!form?.elements) throw new TypeError('A form is required');
  if (!messages || typeof messages !== 'object' || Array.isArray(messages)) throw new TypeError('messages must be a name-to-message object');
  const errors = [];
  for (const field of form.elements) {
    if (typeof field.checkValidity !== 'function') continue;
    const valid = field.willValidate === false || field.checkValidity();
    field.setAttribute('aria-invalid', String(!valid));
    const targetId = field.getAttribute('data-ug-error');
    const target = targetId ? form.ownerDocument.getElementById(targetId) : null;
    let message = '';
    if (!valid) {
      const key = Object.keys(defaultMessages).find((name) => field.validity[name]);
      message = Object.hasOwn(messages, field.name) && typeof messages[field.name] === 'string' ? messages[field.name] : defaultMessages[key] || field.validationMessage || 'قىممەتنى تەكشۈرۈڭ.';
      errors.push({ field, message });
    }
    if (target) target.textContent = message;
  }
  return errors;
}
export function bindForm(form, { onValid, messages = {} } = {}) {
  if (!form?.elements || typeof form.addEventListener !== 'function') throw new TypeError('A form is required');
  const oldNoValidate = form.getAttribute('novalidate');
  const fieldStates = new Map(), errorStates = new Map();
  let destroyed = false;
  function validate() {
    if (destroyed) throw new Error('Form binding has been destroyed');
    for (const field of form.elements) {
      if (typeof field.checkValidity !== 'function') continue;
      if (!fieldStates.has(field)) fieldStates.set(field, field.getAttribute('aria-invalid'));
      const id = field.getAttribute('data-ug-error');
      const target = id ? form.ownerDocument.getElementById(id) : null;
      if (target && !errorStates.has(target)) errorStates.set(target, target.textContent);
    }
    return validateForm(form, { messages });
  }
  const submit = (event) => {
    const errors = validate();
    if (errors.length) { event.preventDefault(); errors[0].field.focus(); }
    else if (onValid) { event.preventDefault(); onValid(form, event); }
  };
  // Invalid native forms do not dispatch submit. Handle constraints ourselves so localized errors run.
  form.setAttribute('novalidate', '');
  form.addEventListener('submit', submit);
  return { validate, destroy() {
    if (destroyed) return;
    destroyed = true; form.removeEventListener('submit', submit);
    restoreAttribute(form, 'novalidate', oldNoValidate);
    for (const [field, original] of fieldStates) restoreAttribute(field, 'aria-invalid', original);
    for (const [target, original] of errorStates) target.textContent = original;
  } };
}

/** A plain-text notification. duration:0 keeps it visible until dismissed. */
export function showToast(region, message, { duration = 8000, dismissLabel = 'ئۇقتۇرۇشنى تاقاش' } = {}) {
  if (!region?.ownerDocument || typeof message !== 'string' || !Number.isFinite(duration) || duration < 0) throw new TypeError('Supply a region, text message, and nonnegative duration');
  const doc = region.ownerDocument, toast = doc.createElement('div'), text = doc.createElement('span'), button = doc.createElement('button');
  const previous = doc.activeElement;
  toast.className = 'ug-toast'; text.textContent = message; button.type = 'button'; button.textContent = '×'; button.setAttribute('aria-label', dismissLabel);
  toast.append(text, button); region.append(toast);
  let timer, dismissed = false;
  function dismiss() { if (dismissed) return; dismissed = true; if (timer) clearTimeout(timer); const restoreFocus = toast.contains(doc.activeElement); button.removeEventListener('click', dismiss); toast.remove(); if (restoreFocus && previous?.isConnected && typeof previous.focus === 'function') previous.focus(); }
  button.addEventListener('click', dismiss);
  if (duration) timer = setTimeout(dismiss, duration);
  return { element: toast, dismiss, destroy: dismiss };
}
