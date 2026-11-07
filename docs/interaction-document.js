import { interactionExamples, portableMarkup } from './interactions-data.js';
import { escapeHTML } from './site-shell.js';
/** Build an actual standalone example from the same controller and markup as the preview. */
export function standaloneDocument(example, css, mount) {
  if (!example || !interactionExamples.some(({ id }) => id === example.id) || !['title', 'description', 'hint', 'html'].every((key) => typeof example[key] === 'string') || typeof css !== 'string' || typeof mount !== 'function') throw new TypeError('A demo, CSS source and controller are required.');
  const source = mount.toString().replace(/<\/script/gi, '<\\/script');
  return `<!doctype html>
<html lang="ug" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(example.title)} · ئۇيغۇرچە UI</title><style>
body{margin:0;padding:32px 20px;background:#f4f7f9;color:#17364b;font:16px/2.2 "ALKATIP Basma",Tahoma,serif}main{max-width:560px;margin:auto}h1{font-weight:normal;font-size:28px;margin:0 0 8px}p.intro{font-size:14px;color:#566b78;margin:0 0 22px}.example-pause{margin-block:22px}.example-source{font-size:12px}button:focus-visible,a:focus-visible{outline:3px solid #086aa7;outline-offset:4px}
${css.replace(/<\/style/gi, '<\\/style')}
</style></head><body><main><h1>${escapeHTML(example.title)}</h1><p class="intro">${escapeHTML(example.description)} ${escapeHTML(example.hint)}</p><div class="ugx-demo" lang="ug" dir="rtl" data-interaction="${example.id}" data-motion="paused" data-phase="ready">${portableMarkup(example)}</div><button class="ugx-button example-pause" type="button" id="pause" aria-pressed="false">ھەرىكەتنى توختىتىش Ⅱ</button><p class="example-source"><a href="https://uyghurcommunity.github.io/uyghur-ui/interactions.html#interaction-${example.id}">ئۇيغۇرچە UI · ئەسلى مىسال ↗</a> · MIT</p></main>
<script type="module">
const mount = ${source};
const root = document.querySelector('[data-interaction]');
const pause = document.getElementById('pause');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let paused = false, visible = true;
const allowed = () => !paused && !reduced.matches && !document.hidden && visible;
const binding = mount(root, { motionAllowed: allowed });
root.dataset.enhanced = 'true';
function sync() {
  root.dataset.motion = allowed() ? 'running' : 'paused';
  binding.syncMotion();
  pause.disabled = reduced.matches;
  pause.setAttribute('aria-pressed', String(paused || reduced.matches));
  pause.textContent = reduced.matches ? 'ھەرىكەت ئازايتىلغان' : paused ? 'ھەرىكەتنى داۋاملاشتۇرۇش ▷' : 'ھەرىكەتنى توختىتىش Ⅱ';
}
function toggle() { paused = !paused; sync(); }
pause.addEventListener('click', toggle);
reduced.addEventListener('change', sync);
document.addEventListener('visibilitychange', sync);
let observer;
if ('IntersectionObserver' in window) {
  observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(root);
}
window.addEventListener('pagehide', (event) => {
  if (event.persisted) return;
  binding.destroy(); observer?.disconnect(); pause.removeEventListener('click', toggle);
  reduced.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync);
}, { once: false });
sync();
</script></body></html>`;
}
