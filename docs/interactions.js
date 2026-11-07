import { initDocsShell, normalizeDocsQuery } from './docs-shell.js';
import { bindGalleryLinks } from './gallery-links.js';
import { interactionExamples } from './interactions-data.js';
import { interactionBindings } from './interaction-controls.js';
import { standaloneDocument } from './interaction-document.js';
const $ = (id) => document.getElementById(id);
const shell = initDocsShell(document), reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = false, category = 'all', destroyed = false, cssPromise, observer;
const abort = new AbortController(), urls = new Map(), sources = new Map();
const cards = interactionExamples.map((example) => {
  const card = document.getElementById(`interaction-${example.id}`), root = card.querySelector('[data-interaction]');
  const entry = { example, card, root, visible: true };
  entry.allowed = () => !paused && !reduced.matches && !document.hidden && !card.hidden && entry.visible;
  entry.binding = interactionBindings[example.id](root, { motionAllowed: entry.allowed });
  root.dataset.enhanced = 'true'; return entry;
});
function syncEntry(entry) {
  entry.root.dataset.motion = entry.allowed() ? 'running' : 'paused';
  entry.binding.syncMotion();
}
function syncMotion() {
  cards.forEach(syncEntry);
  document.documentElement.dataset.motion = paused || reduced.matches || document.hidden ? 'paused' : 'running';
  $('interactions-pause').disabled = reduced.matches;
  $('interactions-pause').setAttribute('aria-pressed', String(paused || reduced.matches));
  $('interactions-pause').textContent = reduced.matches ? 'ھەرىكەت ئازايتىلغان' : paused ? 'ھەرىكەتنى داۋاملاشتۇرۇش ▷' : 'ھەرىكەتنى توختىتىش Ⅱ';
  $('interactions-motion-status').textContent = reduced.matches ? 'سىستېمىڭىز ھەرىكەتنى ئازايتىشنى تاللىغان؛ كونتروللار داۋاملىق ئىشلەيدۇ.' : paused ? 'جانلاندۇرۇش توختىتىلدى. كونتروللار داۋاملىق ئىشلەيدۇ.' : 'ھەرىكەت ئوچۇق. كۇنۇپكا تاختىسى ۋە چەكمە ئېكران بىلەن سىناڭ.';
}
function filter() {
  const terms = normalizeDocsQuery($('interactions-search').value).split(' ').filter(Boolean); let count = 0;
  for (const entry of cards) {
    const { example, card } = entry, haystack = normalizeDocsQuery([example.title, example.en, example.description, ...example.keywords].join(' '));
    card.hidden = !(category === 'all' || category === example.category) || !terms.every((term) => haystack.includes(term));
    if (!card.hidden) count++; syncEntry(entry);
  }
  $('interactions-results').textContent = `6 مىسالدىن ${count} سى كۆرسىتىلدى.`;
  $('interactions-empty').hidden = count > 0;
}
$('interactions-search').addEventListener('input', filter, { signal: abort.signal });
document.querySelectorAll('[data-interaction-category]').forEach((button) => button.addEventListener('click', () => {
  category = button.dataset.interactionCategory;
  document.querySelectorAll('[data-interaction-category]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  filter();
}, { signal: abort.signal }));
function reveal() {
  const entry = cards.find(({ example }) => location.hash === `#interaction-${example.id}`);
  if (!entry) return;
  category = 'all'; $('interactions-search').value = '';
  document.querySelectorAll('[data-interaction-category]').forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.interactionCategory === 'all')));
  filter(); entry.card.tabIndex = -1; entry.card.scrollIntoView({ block: 'start', behavior: 'instant' }); entry.card.focus({ preventScroll: true });
}
const links = bindGalleryLinks(window, document, reveal);
$('interactions-pause').hidden = false;
$('interactions-pause').addEventListener('click', () => { paused = !paused; syncMotion(); }, { signal: abort.signal });
reduced.addEventListener('change', syncMotion); document.addEventListener('visibilitychange', syncMotion);
if ('IntersectionObserver' in window) {
  observer = new IntersectionObserver((entries) => {
    for (const item of entries) { const entry = cards.find(({ root }) => root === item.target); if (entry) { entry.visible = item.isIntersecting; syncEntry(entry); } }
  }, { threshold: 0 });
  cards.forEach(({ root }) => observer.observe(root));
}
async function getCSS() {
  if (!cssPromise) cssPromise = fetch(new URL('./interaction-demo.css', import.meta.url), { signal: abort.signal }).then(async (response) => {
    if (!response.ok) throw new Error('Demo stylesheet unavailable');
    const css = await response.text(); if (!css.includes('.ugx-demo') || css.length > 100000) throw new Error('Unexpected demo stylesheet'); return css;
  }).catch((error) => { cssPromise = undefined; throw error; });
  return cssPromise;
}
function sourceFor(example) {
  if (!sources.has(example.id)) sources.set(example.id, getCSS().then((css) => standaloneDocument(example, css, interactionBindings[example.id])).catch((error) => { sources.delete(example.id); throw error; }));
  return sources.get(example.id);
}
function statusFor(card) { return card.querySelector('[data-example-status]'); }
function manualCopy(card, text) {
  let panel = card.querySelector('.ix-manual-copy'); panel?.remove();
  panel = document.createElement('label'); panel.className = 'ix-manual-copy'; panel.textContent = 'قولدا كۆچۈرۈش · Command+C / Ctrl+C';
  const textarea = document.createElement('textarea'); textarea.value = text; textarea.readOnly = true; textarea.dir = 'ltr'; panel.append(textarea);
  card.querySelector('.ix-code-body').append(panel); textarea.focus(); textarea.select();
}
for (const { example, card } of cards) {
  const details = card.querySelector('[data-code]'), code = card.querySelector('[data-example-source]');
  const load = async () => {
    try { const source = await sourceFor(example); if (!destroyed) code.textContent = source; return source; }
    catch (error) { if (!destroyed) { code.textContent = 'كود يۈكلەنمىدى. بۆلەكنى قايتا ئېچىپ ياكى كۆچۈرۈش كۇنۇپكىسىنى قايتا بېسىپ سىناڭ.'; statusFor(card).textContent = 'ئۇسلۇب ھۆججىتى يۈكلەنمىدى. قايتا سىناڭ.'; } return null; }
  };
  details.addEventListener('toggle', () => { if (details.open) load(); }, { signal: abort.signal });
  card.querySelector('[data-copy-example]').addEventListener('click', async () => {
    const source = await load(); if (!source || destroyed) return;
    try { await navigator.clipboard.writeText(source); if (!destroyed) statusFor(card).textContent = 'تولۇق HTML، CSS ۋە JavaScript كۆچۈرۈلدى.'; }
    catch { if (!destroyed) { manualCopy(card, source); statusFor(card).textContent = 'تاللانغان كودنى قولدا كۆچۈرۈڭ.'; } }
  }, { signal: abort.signal });
  card.querySelector('[data-download-example]').addEventListener('click', async () => {
    const source = await load(); if (!source || destroyed) return;
    let url = urls.get(example.id);
    if (!url) { url = URL.createObjectURL(new Blob([source], { type: 'text/html;charset=utf-8' })); urls.set(example.id, url); }
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `uyghur-ui-${example.id}.html`; document.body.append(anchor); anchor.click(); anchor.remove();
    // The browser consumes the download on a later task; retain URLs until teardown.
    statusFor(card).textContent = 'چۈشۈرۈش باشلاندى. HTML ھۆججىتىنى تور كۆرگۈدە ئاچالايسىز.';
  }, { signal: abort.signal });
}
window.addEventListener('pagehide', (event) => {
  if (event.persisted) return;
  destroyed = true; abort.abort(); observer?.disconnect(); links.destroy(); shell.destroy(); cards.forEach(({ binding }) => binding.destroy());
  reduced.removeEventListener('change', syncMotion); document.removeEventListener('visibilitychange', syncMotion);
  urls.forEach((url) => URL.revokeObjectURL(url)); urls.clear(); sources.clear();
});
filter(); syncMotion(); reveal();
