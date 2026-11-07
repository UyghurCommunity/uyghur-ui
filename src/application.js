import { bindDialog } from './index.js';
let generatedID = 0;
const remember = (node, attributes) => attributes.map((name) => [node, name, node.getAttribute(name)]);
const restore = (attributes) => attributes.forEach(([node, name, value]) => value === null ? node.removeAttribute(name) : node.setAttribute(name, value));
function identify(node, prefix) { if (!node.id) { do { node.id = `${prefix}-${++generatedID}`; } while (node.ownerDocument.getElementById(node.id) && node.ownerDocument.getElementById(node.id) !== node); } return node.id; }
const normalize = (text) => text.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
const enabled = (node) => !node.disabled && node.getAttribute('aria-disabled') !== 'true';

/** A local, editable filter with listbox selection. Labels are always plain text. */
export function bindCombobox(root, { onChange } = {}) {
  if (onChange !== undefined && typeof onChange !== 'function') throw new TypeError('onChange must be a function');
  const input = root?.querySelector?.('[data-ug-combobox-input]'), list = root?.querySelector?.('[data-ug-combobox-list]');
  const options = list ? [...list.querySelectorAll('button[data-ug-option]')] : [];
  if (!input || !list || !options.length || options.some((option) => typeof option.dataset.value !== 'string')) throw new TypeError('Combobox needs an input, list and valued options');
  const doc = root.ownerDocument, status = root.querySelector('[data-ug-combobox-status]');
  const saved = [...remember(input, ['role', 'aria-expanded', 'aria-controls', 'aria-haspopup', 'aria-autocomplete', 'aria-activedescendant']), ...remember(list, ['id', 'role', 'aria-label']), ...options.flatMap((option) => remember(option, ['id', 'role', 'aria-selected', 'tabindex', 'data-ug-active']))];
  const hidden = options.map((option) => option.hidden), originalListHidden = list.hidden;
  input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list'); input.setAttribute('aria-haspopup', 'listbox'); input.setAttribute('aria-controls', identify(list, 'ug-combobox')); list.setAttribute('role', 'listbox'); if (!list.getAttribute('aria-label') && !list.getAttribute('aria-labelledby')) list.setAttribute('aria-label', 'تاللاشلار');
  options.forEach((option) => { identify(option, 'ug-option'); option.setAttribute('role', 'option'); option.setAttribute('tabindex', '-1'); });
  let destroyed = false, expanded = false, composing = false, active = -1, matches = [];
  let selected = options.find((option) => option.dataset.value === input.value || option.textContent.trim() === input.value) ?? null;
  const alive = () => { if (destroyed) throw new Error('Combobox has been destroyed'); };
  function activeOption(index) { active = matches.length ? (index + matches.length) % matches.length : -1; options.forEach((option) => option.setAttribute('data-ug-active', String(expanded && matches[active] === option))); if (expanded && active >= 0) input.setAttribute('aria-activedescendant', matches[active].id); else input.removeAttribute('aria-activedescendant'); }
  function render() {
    const query = selected && input.value === selected.textContent.trim() ? '' : normalize(input.value); matches = [];
    options.forEach((option, index) => { option.hidden = hidden[index] || !normalize(`${option.textContent} ${option.dataset.value}`).includes(query); option.setAttribute('aria-selected', String(option === selected)); if (!option.hidden && enabled(option)) matches.push(option); });
    list.hidden = !expanded; input.setAttribute('aria-expanded', String(expanded)); activeOption(matches.indexOf(selected) >= 0 ? matches.indexOf(selected) : 0);
    if (status) status.textContent = matches.length ? `${matches.length} تاللاش` : 'ماس تاللاش تېپىلمىدى.';
  }
  function open() { alive(); expanded = true; render(); }
  function close() { if (destroyed) return; expanded = false; list.hidden = true; input.setAttribute('aria-expanded', 'false'); input.removeAttribute('aria-activedescendant'); active = -1; options.forEach((option) => option.setAttribute('data-ug-active', 'false')); }
  function choose(option, focus = false) { if (!enabled(option)) return false; const previous = selected; selected = option; input.value = option.textContent.trim(); options.forEach((item) => item.setAttribute('aria-selected', String(item === option))); close(); if (focus) input.focus(); if (previous !== option) onChange?.(option.dataset.value); return true; }
  function changed() { if (composing) return; const previous = selected; selected = null; open(); if (previous) onChange?.(''); }
  function keyed(event) {
    if (destroyed || composing || event.isComposing || event.defaultPrevented) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); if (!expanded) { open(); if (event.key === 'ArrowUp') activeOption(matches.length - 1); } else activeOption(active + (event.key === 'ArrowDown' ? 1 : -1)); }
    else if (event.key === 'Enter' && expanded) { event.preventDefault(); if (active >= 0) choose(matches[active], true); else close(); }
    else if (event.key === 'Escape' && expanded) { event.preventDefault(); close(); }
  }
  const clickedInput = () => open(), begin = () => { composing = true; }, end = () => { composing = false; changed(); };
  const clicked = (event) => { const option = options.find((item) => item === event.target || item.contains(event.target)); if (option) { event.preventDefault(); choose(option, true); } };
  const outside = (event) => { if (!root.contains(event.target)) close(); }, focusout = (event) => { if (!root.contains(event.relatedTarget)) close(); };
  input.addEventListener('input', changed); input.addEventListener('keydown', keyed); input.addEventListener('click', clickedInput); input.addEventListener('compositionstart', begin); input.addEventListener('compositionend', end); list.addEventListener('click', clicked); doc.addEventListener('pointerdown', outside); root.addEventListener('focusout', focusout);
  render();
  return { open, close, getValue() { alive(); return selected?.dataset.value ?? ''; }, select(value) { alive(); const option = options.find((item) => item.dataset.value === value); if (!option) throw new RangeError('Unknown combobox value'); return choose(option); }, destroy() { if (destroyed) return; close(); destroyed = true; input.removeEventListener('input', changed); input.removeEventListener('keydown', keyed); input.removeEventListener('click', clickedInput); input.removeEventListener('compositionstart', begin); input.removeEventListener('compositionend', end); list.removeEventListener('click', clicked); doc.removeEventListener('pointerdown', outside); root.removeEventListener('focusout', focusout); restore(saved); options.forEach((option, index) => { option.hidden = hidden[index]; }); list.hidden = originalListHidden; } };
}

/** A native-button action menu with roving keyboard focus and outside dismissal. */
export function bindDropdown(root) {
  const trigger = root?.querySelector?.('[data-ug-menu-trigger]'), panel = root?.querySelector?.('[data-ug-menu]');
  const items = panel ? [...new Set(panel.querySelectorAll('button, [data-ug-menu-item]'))] : [];
  if (!trigger || !panel || !items.length) throw new TypeError('Dropdown needs a trigger, menu and items');
  const doc = root.ownerDocument, hidden = panel.hidden;
  const saved = [...remember(trigger, ['aria-haspopup', 'aria-expanded', 'aria-controls']), ...remember(panel, ['role', 'id']), ...items.flatMap((item) => remember(item, ['role', 'tabindex']))];
  trigger.setAttribute('aria-haspopup', 'menu'); trigger.setAttribute('aria-controls', identify(panel, 'ug-menu')); panel.setAttribute('role', 'menu'); items.forEach((item) => { item.setAttribute('role', 'menuitem'); item.setAttribute('tabindex', '-1'); });
  let destroyed = false, expanded = false;
  const choices = () => items.filter((item) => enabled(item) && !item.hidden);
  function close(focus = panel.contains(doc.activeElement)) { if (destroyed) return; panel.hidden = true; expanded = false; trigger.setAttribute('aria-expanded', 'false'); if (focus) trigger.focus(); }
  function open(last = false) { if (destroyed) throw new Error('Dropdown has been destroyed'); panel.hidden = false; expanded = true; trigger.setAttribute('aria-expanded', 'true'); const available = choices(); (last ? available.at(-1) : available[0])?.focus(); }
  function toggle() { if (expanded) close(true); else open(); }
  function triggerClick(event) { event.preventDefault(); toggle(); }
  function triggerKey(event) { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); open(event.key === 'ArrowUp'); } else if (event.key === 'Escape' && expanded) { event.preventDefault(); close(true); } }
  function panelKey(event) {
    if (event.defaultPrevented || event.isComposing) return;
    if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const available = choices(); if (!available.length) return; event.preventDefault();
    const current = available.findIndex((item) => item === event.target || item.contains(event.target));
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? available.length - 1 : (current + (event.key === 'ArrowDown' ? 1 : -1) + available.length) % available.length;
    available[next].focus();
  }
  function action(event) { const item = items.find((node) => node === event.target || node.contains(event.target)); if (!item) return; if (!enabled(item)) { event.preventDefault(); return; } close(true); }
  const outside = (event) => { if (!root.contains(event.target)) close(panel.contains(doc.activeElement)); }, focusout = (event) => { if (!root.contains(event.relatedTarget)) close(false); };
  trigger.addEventListener('click', triggerClick); trigger.addEventListener('keydown', triggerKey); panel.addEventListener('keydown', panelKey); panel.addEventListener('click', action); doc.addEventListener('pointerdown', outside); root.addEventListener('focusout', focusout); close();
  return { open, close, toggle, destroy() { if (destroyed) return; if (panel.contains(doc.activeElement)) trigger.focus(); close(); destroyed = true; trigger.removeEventListener('click', triggerClick); trigger.removeEventListener('keydown', triggerKey); panel.removeEventListener('keydown', panelKey); panel.removeEventListener('click', action); doc.removeEventListener('pointerdown', outside); root.removeEventListener('focusout', focusout); restore(saved); panel.hidden = hidden; } };
}

/** Use the package's native dialog behavior for a labelled drawer. */
export function bindDrawer(root, { initialFocus, dismissOutside = true } = {}) {
  const trigger = root?.querySelector?.('[data-ug-drawer-trigger]'), dialog = root?.querySelector?.('[data-ug-drawer]');
  if (!trigger || !dialog) throw new TypeError('Drawer needs a trigger and a native dialog');
  return bindDialog(dialog, { trigger, initialFocus: initialFocus ?? dialog.querySelector('[autofocus]'), dismissOutside });
}

/** Sort, filter and paginate existing local table rows without recreating their markup. */
export function bindDataTable(root, { pageSize = 5 } = {}) {
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) throw new RangeError('pageSize must be an integer from 1 to 100');
  const table = root?.querySelector?.('table'), body = table?.querySelector('tbody'), search = root?.querySelector?.('[data-ug-table-search]');
  const previous = root?.querySelector?.('[data-ug-table-prev]'), next = root?.querySelector?.('[data-ug-table-next]'), status = root?.querySelector?.('[data-ug-table-status]');
  if (!table || !body || !search || !previous || !next || !status) throw new TypeError('Data table controls are incomplete');
  const rows = [...body.querySelectorAll('tr')], sortButtons = [...table.querySelectorAll('button[data-ug-sort]')];
  const columns = Math.max(0, ...rows.map((row) => row.cells.length));
  if (sortButtons.some((button) => !/^\d+$/.test(button.dataset.ugSort) || Number(button.dataset.ugSort) >= columns && rows.length)) throw new TypeError('Sort columns must refer to table cells');
  const originalHidden = rows.map((row) => row.hidden), oldPrevious = previous.disabled, oldNext = next.disabled;
  const headings = [...new Set(sortButtons.map((button) => button.closest('th')).filter(Boolean))], saved = headings.flatMap((heading) => remember(heading, ['aria-sort']));
  const collator = new Intl.Collator('ug', { numeric: true, sensitivity: 'base' });
  let destroyed = false, composing = false, page = 1, filtered = [], pageCount = 1, sort = null;
  const alive = () => { if (destroyed) throw new Error('Data table has been destroyed'); };
  function number(text) { const raw = text.trim().replace(/[٠-٩۰-۹]/g, (digit) => String(digit.charCodeAt(0) - (digit >= '۰' ? 1776 : 1632))).replace(/[,٬]/g, '').replace(/٫/g, '.'); return raw && Number.isFinite(Number(raw)) ? Number(raw) : null; }
  function render() {
    if (destroyed) return;
    const ordered = rows.map((row, index) => ({ row, index }));
    if (sort) ordered.sort((a, b) => { const left = a.row.cells[sort.column]?.textContent.trim() ?? '', right = b.row.cells[sort.column]?.textContent.trim() ?? '', x = number(left), y = number(right); const comparison = x !== null && y !== null ? x - y : collator.compare(left, right); return comparison * (sort.direction === 'ascending' ? 1 : -1) || a.index - b.index; });
    const terms = normalize(search.value).split(' ').filter(Boolean);
    filtered = ordered.filter(({ row, index }) => !originalHidden[index] && terms.every((term) => normalize(row.textContent).includes(term))).map(({ row }) => row);
    pageCount = Math.max(1, Math.ceil(filtered.length / pageSize)); page = Math.min(Math.max(1, page), pageCount);
    const visible = new Set(filtered.slice((page - 1) * pageSize, page * pageSize));
    ordered.forEach(({ row }) => { row.hidden = !visible.has(row); body.appendChild(row); });
    previous.disabled = page <= 1; next.disabled = page >= pageCount;
    headings.forEach((heading) => heading.setAttribute('aria-sort', 'none'));
    if (sort) sortButtons.find((button) => Number(button.dataset.ugSort) === sort.column)?.closest('th')?.setAttribute('aria-sort', sort.direction);
    status.textContent = filtered.length ? `${filtered.length} نەتىجە · ${page} / ${pageCount} بەت` : 'ماس نەتىجە تېپىلمىدى.';
  }
  function changed() { if (composing) return; page = 1; render(); }
  const begin = () => { composing = true; }, end = () => { composing = false; changed(); };
  const prevClick = () => { if (!previous.disabled) { page--; render(); } }, nextClick = () => { if (!next.disabled) { page++; render(); } };
  const handlers = sortButtons.map((button) => { const callback = () => { const column = Number(button.dataset.ugSort); sort = { column, direction: sort?.column === column && sort.direction === 'ascending' ? 'descending' : 'ascending' }; page = 1; render(); }; button.addEventListener('click', callback); return [button, callback]; });
  search.addEventListener('input', changed); search.addEventListener('compositionstart', begin); search.addEventListener('compositionend', end); previous.addEventListener('click', prevClick); next.addEventListener('click', nextClick); render();
  return { getState() { alive(); return Object.freeze({ page, pageCount, pageSize, total: rows.length, filtered: filtered.length, sort: sort ? Object.freeze({ ...sort }) : null }); }, setPage(value) { alive(); if (!Number.isInteger(value) || value < 1) throw new RangeError('Page must be a positive integer'); page = Math.min(value, pageCount); render(); }, refresh() { alive(); render(); }, destroy() { if (destroyed) return; destroyed = true; search.removeEventListener('input', changed); search.removeEventListener('compositionstart', begin); search.removeEventListener('compositionend', end); previous.removeEventListener('click', prevClick); next.removeEventListener('click', nextClick); handlers.forEach(([button, callback]) => button.removeEventListener('click', callback)); rows.forEach((row, index) => { row.hidden = originalHidden[index]; body.appendChild(row); }); previous.disabled = oldPrevious; next.disabled = oldNext; restore(saved); } };
}
