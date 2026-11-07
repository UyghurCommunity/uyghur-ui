'use client';

import { createElement as h, forwardRef, useCallback, useEffect, useId, useRef, useState } from 'react';
import { bindDialog } from '@uyghurcommunity/ui';
import { iconSVG } from '@uyghurcommunity/ui/icons';
import { bindUyghurInput } from '@uyghurcommunity/ui/writing';
import { interactionBindings } from '@uyghurcommunity/ui/interactions';
import { interactionPresets } from './presets.js';

const classes = (...values) => values.filter(Boolean).join(' ');
function useNodeRef(forwardedRef) {
  const node = useRef(null);
  const ref = useCallback((value) => {
    node.current = value;
    if (typeof forwardedRef === 'function') forwardedRef(value);
    else if (forwardedRef) forwardedRef.current = value;
  }, [forwardedRef]);
  return [node, ref];
}
function useLatest(value) { const ref = useRef(value); ref.current = value; return ref; }

export const Button = forwardRef(function Button({ variant = 'primary', size, className, type = 'button', ...props }, ref) {
  if (!['primary', 'secondary', 'ghost', 'danger'].includes(variant)) throw new RangeError('Unknown button variant');
  if (size !== undefined && !['small', 'icon'].includes(size)) throw new RangeError('Unknown button size');
  return h('button', { ...props, ref, type, className: classes('ug-ui ug-button', variant !== 'primary' && `ug-button--${variant}`, size && `ug-button--${size}`, className) });
});

export const Icon = forwardRef(function Icon({ name, size = 24, variant = 'outline', strokeWidth = 1.7, label = '', className, children: _children, dangerouslySetInnerHTML: _html, ...props }, ref) {
  return h('span', { ...props, ref, className: classes('ug-react-icon', className), dangerouslySetInnerHTML: { __html: iconSVG(name, { size, variant, strokeWidth, label }) } });
});

export const Dialog = forwardRef(function Dialog({ open, onOpenChange, dismissOutside = true, initialFocusRef, className, children, onCancel, onClose, onPointerDown, onPointerUp, onPointerCancel, ...props }, forwardedRef) {
  if (typeof open !== 'boolean') throw new TypeError('Dialog open must be a controlled boolean');
  const [node, ref] = useNodeRef(forwardedRef), controller = useRef(null), pointer = useRef(null), alive = useRef(false);
  const latest = useLatest({ open, onOpenChange, initialFocusRef });
  useEffect(() => {
    alive.current = true;
    const binding = bindDialog(node.current, { initialFocus: latest.current.initialFocusRef?.current, dismissOutside: false });
    controller.current = binding;
    return () => { alive.current = false; controller.current = null; binding.destroy(); };
  }, [node, latest]);
  useEffect(() => { if (open) controller.current?.open(); else controller.current?.close(); }, [open]);
  const outside = (event) => {
    if (event.target !== node.current || !Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) return false;
    const box = node.current.getBoundingClientRect();
    return event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
  };
  const requestClose = () => { if (alive.current) latest.current.onOpenChange?.(false); };
  const label = props['aria-label'] || props['aria-labelledby'] ? {} : { 'aria-label': 'سۆزلىشىش كۆزنىكى' };
  return h('dialog', {
    ...label, ...props, ref, className: classes('ug-ui ug-dialog', className),
    onCancel(event) { onCancel?.(event); if (!event.defaultPrevented) { event.preventDefault(); requestClose(); } },
    onClose(event) { onClose?.(event); if (latest.current.open && !node.current?.open) requestClose(); },
    onPointerDown(event) { onPointerDown?.(event); pointer.current = !event.defaultPrevented && event.button === 0 && event.isPrimary !== false && dismissOutside && outside(event) ? event.pointerId : null; },
    onPointerUp(event) { onPointerUp?.(event); const close = !event.defaultPrevented && event.button === 0 && event.isPrimary !== false && dismissOutside && pointer.current !== null && pointer.current === event.pointerId && outside(event); pointer.current = null; if (close) requestClose(); },
    onPointerCancel(event) { pointer.current = null; onPointerCancel?.(event); },
  }, children);
});

export const Tabs = forwardRef(function Tabs({ items, value, defaultValue, onValueChange, label = 'مەزمۇن بەتكۈچلىرى', orientation = 'horizontal', className, dir = 'rtl', ...props }, ref) {
  if (!Array.isArray(items) || !items.length || items.some((item) => !item || typeof item.id !== 'string' || !item.id) || new Set(items.map((item) => item.id)).size !== items.length || !items.some((item) => !item.disabled)) throw new TypeError('Tabs need distinct item ids and an enabled item');
  if (!['horizontal', 'vertical'].includes(orientation)) throw new RangeError('Unknown tab orientation');
  const prefix = useId(), buttons = useRef([]), [internal, setInternal] = useState(() => defaultValue ?? items.find((item) => !item.disabled).id);
  const active = value ?? (items.some((item) => item.id === internal && !item.disabled) ? internal : items.find((item) => !item.disabled).id);
  if (!items.some((item) => item.id === active && !item.disabled)) throw new RangeError('Tabs value must identify an enabled item');
  const select = (item) => { if (value === undefined) setInternal(item.id); if (item.id !== active) onValueChange?.(item.id); };
  const keydown = (event, index) => {
    const enabled = items.map((item, i) => !item.disabled ? i : -1).filter((i) => i >= 0);
    let next = enabled.indexOf(index), step = 0;
    const direction = event.currentTarget.ownerDocument.defaultView?.getComputedStyle(event.currentTarget.parentElement).direction || dir;
    const rtl = direction === 'rtl';
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = enabled.length - 1;
    else if (orientation === 'vertical' && event.key === 'ArrowDown' || orientation === 'horizontal' && event.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) step = 1;
    else if (orientation === 'vertical' && event.key === 'ArrowUp' || orientation === 'horizontal' && event.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) step = -1;
    else return;
    event.preventDefault(); if (step) next = (next + step + enabled.length) % enabled.length;
    select(items[enabled[next]]); buttons.current[enabled[next]]?.focus();
  };
  return h('div', { ...props, ref, dir, className: classes('ug-ui ug-tabs', className) },
    h('div', { role: 'tablist', 'aria-label': label, 'aria-orientation': orientation }, items.map((item, i) => h('button', {
      key: item.id, ref: (node) => { buttons.current[i] = node; }, type: 'button', role: 'tab', id: `${prefix}-tab-${i}`, disabled: item.disabled,
      'aria-selected': active === item.id, 'aria-controls': `${prefix}-panel-${i}`, tabIndex: active === item.id ? 0 : -1,
      onClick: () => select(item), onKeyDown: (event) => keydown(event, i),
    }, item.label))),
    items.map((item, i) => h('div', { key: item.id, role: 'tabpanel', id: `${prefix}-panel-${i}`, 'aria-labelledby': `${prefix}-tab-${i}`, hidden: active !== item.id, tabIndex: 0 }, item.content)));
});

export const UyghurInput = forwardRef(function UyghurInput({ value, defaultValue = '', onChange, onInput, onReady, maxLength = 10000, label = 'مەزمۇنىڭىز', help = 'ئۇيغۇرچە ۋە English نى بىرلىكتە يېزىڭ. مەزمۇن پەقەت مۇشۇ بەتتە تۇرىدۇ.', className, containerClassName, id, rows = 5, ...props }, forwardedRef) {
  if (value !== undefined && typeof value !== 'string' || typeof defaultValue !== 'string') throw new TypeError('Writing values must be strings');
  if (!Number.isInteger(maxLength) || maxLength < 1 || maxLength > 100000) throw new RangeError('maxLength must be an integer from 1 to 100000');
  if ((value ?? defaultValue).length > maxLength) throw new RangeError('Writing value exceeds maxLength');
  const generated = useId(), inputId = id || `${generated}-writing`, root = useRef(null), [input, ref] = useNodeRef(forwardedRef);
  const initial = useRef(value ?? defaultValue), controller = useRef(null), syncing = useRef(false), alive = useRef(false);
  const latest = useLatest({ value, onChange, onReady });
  const synchronize = () => {
    if (!alive.current || latest.current.value === undefined || !controller.current || controller.current.getValue() === latest.current.value) return;
    syncing.current = true;
    try { controller.current.setValue(latest.current.value); } finally { syncing.current = false; }
  };
  useEffect(() => {
    alive.current = true;
    // A previous binding restores its captured attributes during cleanup.
    // Reapply the new React limit before the next controller reads native limits.
    input.current.setAttribute('maxlength', String(maxLength));
    const binding = bindUyghurInput(root.current, { maxLength, onChange(text) {
      if (syncing.current) return;
      latest.current.onChange?.(text);
      // Native keyboard/cleanup changes and IME completion share the same controlled contract.
      queueMicrotask(synchronize);
    } });
    controller.current = binding; latest.current.onReady?.(binding); synchronize();
    return () => { alive.current = false; controller.current = null; binding.destroy(); latest.current.onReady?.(null); };
  }, [maxLength]);
  useEffect(synchronize, [value, maxLength]);
  const describedBy = [props['aria-describedby'], `${inputId}-help`, `${inputId}-status`].filter(Boolean).join(' ');
  return h('section', { ref: root, lang: 'ug', dir: 'rtl', className: classes('ug-ui ug-writing', containerClassName) },
    h('div', { className: 'ug-field' }, h('label', { className: 'ug-label', htmlFor: inputId }, label),
      h('textarea', { ...props, ref, id: inputId, rows, maxLength, className: classes('ug-textarea', className), dir: 'auto', 'data-ug-writing-input': '', 'aria-describedby': describedBy, defaultValue: initial.current, onInput }),
      h('p', { className: 'ug-hint', id: `${inputId}-help` }, help)),
    h('div', { className: 'ug-row' }, h(Button, { variant: 'secondary', 'data-ug-keyboard-toggle': '', 'aria-expanded': false, 'aria-controls': `${inputId}-keys` }, 'ئۇيغۇرچە كۇنۇپكا تاختىسى'), h(Button, { variant: 'secondary', 'data-ug-cleanup-preview-button': '' }, 'تازىلاشنى ئالدىن كۆرۈش')),
    h('div', { id: `${inputId}-keys`, 'data-ug-keyboard': '', hidden: true }),
    h('div', { className: 'ug-field' }, h('span', { className: 'ug-label' }, 'جانلىق كۆرۈنۈش'), h('div', { className: 'ug-writing-preview', 'data-ug-writing-preview': '', dir: 'auto' })),
    h('details', { className: 'ug-cleanup-details', open: true }, h('summary', null, 'Unicode تازىلاش'), h('p', { className: 'ug-hint' }, 'ئۆزگىرىشنى ئالدىن كۆرۈڭ. «قوللىنىش» نى باسمىغۇچە تېكىست ئۆزگەرمەيدۇ.'),
      h('pre', { className: 'ug-cleanup-preview', 'data-ug-cleanup-preview': '', dir: 'auto' }),
      h('div', { className: 'ug-row' }, h(Button, { 'data-ug-cleanup-apply': '', disabled: true }, 'تازىلاشنى قوللىنىش'), h(Button, { variant: 'secondary', 'data-ug-cleanup-undo': '', disabled: true }, 'ئەسلىگە قايتۇرۇش'))),
    h('p', { id: `${inputId}-status`, 'data-ug-writing-status': '', className: 'ug-hint', role: 'status', 'aria-live': 'polite' }));
});

export const Interaction = forwardRef(function Interaction({ effect = 'spotlight', paused = false, onReady, resetKey, className, children, dangerouslySetInnerHTML: _html, ...props }, forwardedRef) {
  if (!Object.hasOwn(interactionBindings, effect)) throw new RangeError('Unknown interaction effect');
  const [node, ref] = useNodeRef(forwardedRef), controller = useRef(null), synchronize = useRef(null), latest = useLatest({ paused, onReady });
  useEffect(() => {
    const root = node.current, doc = root.ownerDocument, win = doc.defaultView;
    const media = win.matchMedia('(prefers-reduced-motion: reduce)'); let visible = true;
    const allowed = () => !latest.current.paused && !media.matches && !doc.hidden && visible;
    const binding = interactionBindings[effect](root, { motionAllowed: allowed }); controller.current = binding;
    const sync = () => { root.dataset.motion = allowed() ? 'running' : 'paused'; binding.syncMotion(); };
    synchronize.current = sync;
    root.dataset.enhanced = 'true';
    media.addEventListener('change', sync); doc.addEventListener('visibilitychange', sync);
    let observer;
    if (typeof win.IntersectionObserver === 'function') { observer = new win.IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }); observer.observe(root); }
    sync(); latest.current.onReady?.(binding);
    return () => { observer?.disconnect(); media.removeEventListener('change', sync); doc.removeEventListener('visibilitychange', sync); binding.destroy(); controller.current = null; synchronize.current = null; delete root.dataset.enhanced; root.dataset.motion = 'paused'; latest.current.onReady?.(null); };
  }, [effect, resetKey]);
  useEffect(() => { synchronize.current?.(); }, [paused]);
  const content = children === undefined ? { dangerouslySetInnerHTML: { __html: interactionPresets[effect] } } : { children };
  return h('div', { ...props, ...content, ref, lang: props.lang ?? 'ug', dir: props.dir ?? 'rtl', className: classes('ugx-demo', className), 'data-interaction': effect, 'data-phase': 'ready', 'data-motion': 'paused' });
});
