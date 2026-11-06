import { bindDialog, bindTabs, bindDisclosure, bindForm, showToast, iconNames, iconSVG, flagSVG, iconCatalog, iconCategories, findIcons } from '../src/index.js';
import { components } from './components.js';
import { componentSnippet } from './snippets.js';
const $ = (id) => document.getElementById(id), bindings = [];
function notify(text) {
  // Outside live regions are inert while a modal is open; put its feedback inside the modal.
  const dialog = document.querySelector('dialog[open]');
  if (dialog) {
    let status = dialog.querySelector('[data-copy-status]');
    if (!status) { status = document.createElement('p'); status.className = 'ug-hint'; status.dataset.copyStatus = ''; status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); dialog.append(status); }
    status.textContent = text;
  } else showToast($('notifications'), text);
}
function manualCopy(text) {
  const previous = document.activeElement;
  const parent = previous?.closest('dialog, article, section') || $('install');
  let panel = parent.querySelector('.manual-copy');
  if (panel) panel.remove();
  panel = document.createElement('div'); panel.className = 'manual-copy ug-field';
  const label = document.createElement('label'), textarea = document.createElement('textarea'), close = document.createElement('button');
  label.textContent = 'قولدا كۆچۈرۈش · Ctrl+C / Command+C'; textarea.className = 'ug-textarea'; textarea.readOnly = true; textarea.dir = 'ltr'; textarea.value = text; label.append(textarea);
  close.type = 'button'; close.className = 'ug-button ug-button--secondary ug-button--small'; close.textContent = 'تاقاش';
  close.addEventListener('click', () => { panel.remove(); if (previous?.isConnected) previous.focus(); });
  panel.append(label, close); parent.append(panel); textarea.focus(); textarea.select();
}
async function copy(text) {
  try { await navigator.clipboard.writeText(text); notify('كود كۆچۈرۈلدى.'); }
  catch { manualCopy(text); notify('كۆچۈرەلمىدى؛ تاللانغان كودنى قولدا كۆچۈرۈڭ.'); }
}
function drawIcons(root) {
  root.querySelectorAll('[data-ug-icon]').forEach((node) => { node.innerHTML = iconSVG(node.dataset.ugIcon); });
}
const cards = [];
for (const component of components) {
  const card = document.createElement('article'); card.className = 'component'; card.id = `component-${component.id}`;
  const head = document.createElement('div'); head.className = 'component-head';
  const h = document.createElement('h3'), description = document.createElement('p'); h.textContent = component.title; description.textContent = component.description; head.append(h, description);
  const preview = document.createElement('div'); preview.className = 'component-preview'; preview.innerHTML = component.html; // Fixed local component markup, never user input.
  const details = document.createElement('details'); details.className = 'component-code';
  const summary = document.createElement('summary'); summary.textContent = 'كودىنى كۆرۈش';
  const body = document.createElement('div'), pre = document.createElement('pre'), code = document.createElement('code'), button = document.createElement('button');
  const snippet = componentSnippet(component);
  code.textContent = snippet; pre.dir = 'ltr'; pre.append(code); button.type = 'button'; button.className = 'copy-code'; button.textContent = 'كۆچۈرۈش'; button.addEventListener('click', () => copy(snippet)); body.append(button, pre); details.append(summary, body); card.append(head, preview, details); $('component-list').append(card); cards.push({ component, card });
}
drawIcons(document);
let category = 'all';
function filterComponents() {
  const query = $('component-search').value.trim().toLowerCase(); let count = 0;
  for (const { component, card } of cards) { const show = (category === 'all' || category === component.category) && `${component.id} ${component.title} ${component.description}`.toLowerCase().includes(query); card.hidden = !show; if (show) count++; }
  $('component-empty').hidden = count > 0; $('component-status').textContent = `${components.length} بۆلەكتىن ${count} سى كۆرسىتىلدى`;
}
$('component-search').addEventListener('input', filterComponents);
document.querySelectorAll('[data-category]').forEach((button) => button.addEventListener('click', () => { category = button.dataset.category; document.querySelectorAll('[data-category]').forEach((item) => item.setAttribute('aria-pressed', String(item === button))); filterComponents(); }));
bindings.push(bindDialog($('demo-dialog'), { trigger: $('dialog-open'), initialFocus: $('dialog-title') }));
bindings.push(bindTabs($('demo-tabs')));
bindings.push(bindDisclosure($('nav-open'), $('nav-panel')));
bindings.push(bindForm($('example-form'), { onValid() { $('form-status').textContent = 'فورما توغرا. بۇ يەرلىك سىناق؛ مەزمۇن ئەۋەتىلمىدى.'; } }));
$('example-form').addEventListener('input', () => { $('form-status').textContent = 'مەزمۇن ئۆزگەردى؛ فورمىنى قايتا تەكشۈرۈڭ.'; });
$('example-form').addEventListener('submit', () => { if ($('example-form').querySelector('[aria-invalid="true"]')) $('form-status').textContent = 'خاتالىق ئۇچۇرلىرىنى كۆرۈپ، رامكىلارنى تۈزىتىڭ.'; });
$('like-button').addEventListener('click', (event) => { const button = event.currentTarget; button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true')); });
$('toast-demo').addEventListener('click', () => showToast($('notifications'), 'بۇ مىسال ئۇقتۇرۇش. تاقاش كۇنۇپكىسى بىلەن تاقاڭ.', { duration: 0 }));
$('copy-install').addEventListener('click', () => copy($('install-command').textContent));
$('copy-flag').addEventListener('click', () => copy(flagSVG({ width: 900 })));
let theme = 'light';
$('theme').addEventListener('click', () => { theme = theme === 'light' ? 'dark' : 'light'; document.documentElement.dataset.ugTheme = theme; $('theme').setAttribute('aria-pressed', String(theme === 'dark')); $('theme').innerHTML = iconSVG(theme === 'dark' ? 'sun' : 'moon'); });
let selectedIcon = 'flower';
let iconCategory = 'traditional';
const iconDetails = Object.fromEntries(iconCatalog.map((entry) => [entry.name, entry]));
const categoryDetails = Object.fromEntries(iconCategories.map((entry) => [entry.id, entry]));
const iconDialog = bindDialog($('icon-dialog'), { initialFocus: $('icon-dialog-title') }); bindings.push(iconDialog);
function renderIcons() {
  const size = Number($('icon-size').value), names = findIcons($('icon-search').value, { category: iconCategory });
  $('size-label').textContent = `${size}px`; $('icon-count').textContent = iconNames.length;
  $('traditional-count').textContent = findIcons('', { category: 'traditional' }).length;
  $('icon-status').textContent = `${categoryDetails[iconCategory].ug} · ${names.length} سىنبەلگە كۆرسىتىلدى`;
  $('icon-empty').hidden = names.length > 0;
  const fragment = document.createDocumentFragment();
  for (const name of names) {
    const entry = iconDetails[name], button = document.createElement('button'); button.type = 'button'; button.className = 'icon-tile'; button.setAttribute('aria-label', `${entry.ug} سىنبەلگىسىنى كۆرۈش`); button.innerHTML = iconSVG(name, { size });
    const label = document.createElement('span'), slug = document.createElement('span'); label.className = 'icon-label'; label.lang = 'ug'; label.dir = 'rtl'; label.textContent = entry.ug; slug.className = 'icon-name'; slug.lang = 'en'; slug.dir = 'ltr'; slug.textContent = name; button.append(label, slug);
    button.addEventListener('click', () => { selectedIcon = name; $('icon-large').innerHTML = iconSVG(name, { size: 80, label: entry.ug }); $('icon-dialog-title').textContent = entry.ug; $('icon-dialog-name').textContent = `${entry.en} / ${name}`; $('icon-dialog-category').textContent = categoryDetails[entry.category].ug; $('icon-download').href = `assets/icons/${name}.svg`; $('icon-download').download = `${name}.svg`; iconDialog.open(); }); fragment.append(button);
  }
  $('icon-grid').replaceChildren(fragment);
}
document.querySelectorAll('[data-icon-total]').forEach((node) => { node.textContent = findIcons('', { category: node.dataset.iconTotal }).length; });
document.querySelectorAll('[data-icon-category]').forEach((button) => button.addEventListener('click', () => { iconCategory = button.dataset.iconCategory; document.querySelectorAll('[data-icon-category]').forEach((item) => item.setAttribute('aria-pressed', String(item === button))); renderIcons(); }));
$('icon-reset').addEventListener('click', () => { iconCategory = 'all'; $('icon-search').value = ''; document.querySelectorAll('[data-icon-category]').forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.iconCategory === 'all'))); renderIcons(); $('icon-search').focus(); });
$('icon-search').addEventListener('input', renderIcons); $('icon-size').addEventListener('input', renderIcons);
$('icon-copy').addEventListener('click', () => copy(iconSVG(selectedIcon, { size: Number($('icon-size').value), label: iconDetails[selectedIcon].ug })));
const motion = matchMedia('(prefers-reduced-motion: reduce)'); let paused = false, inView = true;
function syncMotion() { const stopped = paused || motion.matches; document.documentElement.dataset.motion = stopped || document.hidden || !inView ? 'paused' : 'running'; $('motion').disabled = motion.matches; $('motion').setAttribute('aria-pressed', String(stopped)); $('motion').textContent = motion.matches ? 'ھەرىكەت ئازايتىلغان' : paused ? 'داۋاملاشتۇرۇش ▷' : 'توختىتىش Ⅱ'; }
$('motion').hidden = false; $('motion').addEventListener('click', () => { paused = !paused; syncMotion(); }); motion.addEventListener('change', syncMotion); document.addEventListener('visibilitychange', syncMotion);
let visibility;
if ('IntersectionObserver' in window) { visibility = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; syncMotion(); }); visibility.observe($('hero-board')); }
else {
  visibility = () => { const box = $('hero-board').getBoundingClientRect(); inView = box.bottom > 0 && box.top < innerHeight; syncMotion(); };
  addEventListener('scroll', visibility, { passive: true }); addEventListener('resize', visibility, { passive: true }); visibility();
}
window.addEventListener('pagehide', (event) => { if (!event.persisted) { bindings.forEach((binding) => binding.destroy()); if (typeof visibility === 'function') { removeEventListener('scroll', visibility); removeEventListener('resize', visibility); } else visibility?.disconnect(); } });
filterComponents(); renderIcons(); syncMotion();
