import { bindDialog, iconSVG } from '../src/index.js';

const instances = new WeakMap();
const THEME_KEY = 'uyghur-ui-theme';
const DEFAULT_ROUTES = ['guide/installation.html', 'guide/quick-start.html', 'guide/components.html', 'guide/icons.html'];

export function normalizeDocsQuery(value) {
  if (typeof value !== 'string') throw new TypeError('Search query must be a string');
  return value.normalize('NFKC').toLowerCase().replace(/[’'ʻʼ]/g, '').replace(/[-_\s]+/g, ' ').trim();
}

/** Search results can only navigate to an HTML page in this documentation site. */
export function resolveSearchHref(href, indexURL) {
  if (typeof href !== 'string' || !/^(?:guide\/[a-z0-9-]+\.html|index\.html|interactions\.html)(?:#[a-z0-9-]+)?$/.test(href)) return null;
  let index;
  try { index = new URL(indexURL); } catch { return null; }
  if (!['http:', 'https:'].includes(index.protocol) || !index.pathname.endsWith('/assets/docs-search.json')) return null;
  const base = new URL('../', index), target = new URL(href, base);
  return target.origin === base.origin && target.pathname.startsWith(base.pathname) ? target.href : null;
}

export function prepareSearchIndex(payload, indexURL) {
  if (!payload || typeof payload !== 'object' || typeof payload.version !== 'string' || !Array.isArray(payload.entries) || payload.entries.length > 500) throw new TypeError('Invalid documentation index');
  const result = [], seen = new Set();
  for (const entry of payload.entries) {
    if (!entry || typeof entry !== 'object' || typeof entry.title !== 'string' || !entry.title.trim() || entry.title.length > 240 || typeof entry.en !== 'string' || entry.en.length > 240 || typeof entry.description !== 'string' || entry.description.length > 2000) continue;
    const href = resolveSearchHref(entry.href, indexURL);
    if (!href || !Array.isArray(entry.keywords) || entry.keywords.length > 200 || entry.keywords.some((word) => typeof word !== 'string' || word.length > 1000)) continue;
    const identity = `${href}\n${entry.title}`;
    if (seen.has(identity)) continue;
    seen.add(identity);
    result.push(Object.freeze({ title: entry.title, en: entry.en, description: entry.description, href, keywords: Object.freeze([...entry.keywords]) }));
  }
  if (!result.length) throw new TypeError('Documentation index contains no usable pages');
  return Object.freeze(result);
}

export function searchDocumentation(entries, query = '', { limit = 12 } = {}) {
  if (!Array.isArray(entries)) throw new TypeError('Search entries must be an array');
  if (!Number.isInteger(limit) || limit < 1 || limit > 50) throw new RangeError('Search limit must be from 1 to 50');
  const normalized = normalizeDocsQuery(query), terms = normalized.split(' ').filter(Boolean);
  if (!terms.length) {
    return [...entries].sort((a, b) => {
      const priority = (entry) => { const i = DEFAULT_ROUTES.findIndex((route) => new URL(entry.href).pathname.endsWith(`/${route}`)); return i < 0 ? DEFAULT_ROUTES.length : i; };
      return priority(a) - priority(b);
    }).slice(0, Math.min(limit, 6));
  }
  return entries.map((entry, position) => {
    const title = normalizeDocsQuery(`${entry.title} ${entry.en}`), keywords = normalizeDocsQuery(entry.keywords.join(' '));
    const haystack = normalizeDocsQuery(`${entry.title} ${entry.en} ${entry.description} ${entry.keywords.join(' ')}`);
    if (!terms.every((term) => haystack.includes(term))) return null;
    const score = (title === normalized ? 100 : title.includes(normalized) ? 30 : 0) + terms.reduce((sum, term) => sum + (title.includes(term) ? 5 : keywords.includes(term) ? 2 : 1), 0);
    return { entry, score, position };
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.position - b.position).slice(0, limit).map(({ entry }) => entry);
}

function editable(target) {
  return !!(target?.isContentEditable || target?.closest?.('input, textarea, select, [contenteditable=""], [contenteditable="true"]'));
}

/** Progressive enhancement for both the gallery and static guide pages. */
export function initDocsShell(doc = document) {
  if (!doc?.getElementById || !doc.defaultView) throw new TypeError('A browser document is required');
  if (instances.has(doc)) return instances.get(doc);
  const win = doc.defaultView, $ = (id) => doc.getElementById(id), cleanup = [], controllers = [], timers = new Set();
  let destroyed = false, requestAbort, tocObserver, frame;
  const on = (node, name, callback, options) => { if (!node?.addEventListener) return; node.addEventListener(name, callback, options); cleanup.push(() => node.removeEventListener(name, callback, options)); };
  const delay = (callback, ms) => { const handle = win.setTimeout(() => { timers.delete(handle); if (!destroyed) callback(); }, ms); timers.add(handle); return handle; };

  // Theme has no effect on user text or the selected guide page.
  const theme = $('theme'), media = win.matchMedia?.('(prefers-color-scheme: dark)');
  let preference;
  try { const stored = win.localStorage.getItem(THEME_KEY); if (['light', 'dark'].includes(stored)) preference = stored; } catch { /* A blocked store does not block appearance controls. */ }
  const initial = doc.documentElement.dataset.ugTheme;
  function applyTheme(value) {
    doc.documentElement.dataset.ugTheme = value;
    if (theme) { theme.setAttribute('aria-pressed', String(value === 'dark')); theme.innerHTML = iconSVG(value === 'dark' ? 'sun' : 'moon'); }
  }
  applyTheme(preference || (['light', 'dark'].includes(initial) ? initial : media?.matches ? 'dark' : 'light'));
  if (theme) {
    theme.hidden = false;
    on(theme, 'click', () => { preference = doc.documentElement.dataset.ugTheme === 'dark' ? 'light' : 'dark'; applyTheme(preference); try { win.localStorage.setItem(THEME_KEY, preference); } catch { /* Keep the current page usable. */ } });
  }
  on(media, 'change', () => { if (!preference) applyTheme(media.matches ? 'dark' : 'light'); });

  // Local search loads lazily and always renders the query currently in the input.
  const searchTrigger = $('docs-search-open'), searchDialog = $('docs-search-dialog'), input = $('docs-search-input'), results = $('docs-search-results'), searchStatus = $('docs-search-status');
  let searchController, searchState = 'idle', entries = [], links = [], loading;
  if (searchTrigger && searchDialog && input && results && searchStatus && typeof searchDialog.showModal === 'function') {
    searchController = bindDialog(searchDialog, { trigger: searchTrigger, initialFocus: input }); controllers.push(searchController); searchTrigger.hidden = false;
    function renderSearch() {
      if (destroyed) return;
      results.replaceChildren(); links = [];
      if (searchState === 'loading') { searchStatus.textContent = 'قوللانما ئىزدەش تەييارلىنىۋاتىدۇ…'; return; }
      if (searchState === 'error') {
        searchStatus.textContent = 'ئىزدەش تىزىملىكىنى يۈكلىيەلمىدى. ياندىكى قوللانما ئۇلانمىلىرىنى ئىشلىتىڭ ياكى قايتا سىناڭ.';
        const retry = doc.createElement('button'); retry.type = 'button'; retry.className = 'ug-button ug-button--secondary docs-search-retry'; retry.textContent = 'قايتا سىناش'; retry.addEventListener('click', () => loadIndex(true)); results.append(retry); return;
      }
      if (searchState !== 'ready') { searchStatus.textContent = 'قوللانمىدىن ئىزدەڭ.'; return; }
      const matches = searchDocumentation(entries, input.value);
      searchStatus.textContent = normalizeDocsQuery(input.value) ? `${matches.length} نەتىجە كۆرسىتىلدى.` : 'باشلاش ئۈچۈن تېزلەتمىلەر';
      if (!matches.length) { const message = doc.createElement('p'); message.className = 'docs-search-empty'; message.textContent = 'ماس قوللانما تېپىلمىدى. باشقا سۆزنى سىناڭ.'; results.append(message); return; }
      for (const entry of matches) {
        const anchor = doc.createElement('a'), title = doc.createElement('span'), meta = doc.createElement('span'), description = doc.createElement('span');
        anchor.className = 'docs-search-result'; anchor.href = entry.href;
        title.className = 'docs-search-result-title'; title.textContent = entry.title;
        meta.className = 'docs-search-result-meta'; meta.lang = 'en'; meta.dir = 'ltr'; meta.textContent = entry.en;
        description.className = 'docs-search-result-description'; description.textContent = entry.description;
        anchor.append(title, meta, description); anchor.addEventListener('click', () => searchController.close()); results.append(anchor); links.push(anchor);
      }
    }
    async function loadIndex(retry = false) {
      if (destroyed || searchState === 'ready') return entries;
      if (searchState === 'loading') return loading;
      if (searchState === 'error' && !retry) return entries;
      searchState = 'loading'; renderSearch();
      loading = (async () => {
        try {
          const url = new URL(doc.body.dataset.searchIndex || '', doc.baseURI || doc.location.href);
          const page = new URL(doc.location.href);
          if (!doc.body.dataset.searchIndex || url.origin !== page.origin || !['http:', 'https:'].includes(url.protocol) || !url.pathname.endsWith('/assets/docs-search.json')) throw new TypeError('Search index must be a local documentation asset');
          requestAbort = new (win.AbortController || globalThis.AbortController)();
          const response = await win.fetch(url.href, { signal: requestAbort.signal, credentials: 'omit', mode: 'same-origin' });
          if (!response.ok) throw new Error('Search index request failed');
          const data = prepareSearchIndex(await response.json(), url.href);
          if (!destroyed) { entries = data; searchState = 'ready'; renderSearch(); }
        } catch (error) { if (!destroyed) { searchState = 'error'; renderSearch(); } }
        return entries;
      })();
      return loading;
    }
    const openSearch = () => { if (destroyed) return Promise.resolve([]); searchController.open(); input.focus(); return loadIndex(searchState === 'error'); };
    on(searchTrigger, 'click', () => { input.focus(); loadIndex(searchState === 'error'); });
    on(input, 'input', renderSearch);
    on(input, 'keydown', (event) => {
      if (event.isComposing || !links.length) return;
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); links[event.key === 'ArrowDown' ? 0 : links.length - 1].focus(); }
      else if (event.key === 'Enter') { event.preventDefault(); links[0].click(); }
    });
    on(results, 'keydown', (event) => {
      if (event.isComposing) return;
      const position = links.indexOf(event.target.closest?.('a[href]')); if (position < 0) return;
      let next;
      if (event.key === 'ArrowDown') next = (position + 1) % links.length;
      else if (event.key === 'ArrowUp') next = (position - 1 + links.length) % links.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = links.length - 1;
      else return;
      event.preventDefault(); links[next].focus();
    });
    on(doc, 'keydown', (event) => {
      if (event.defaultPrevented || event.isComposing || editable(event.target)) return;
      const shortcut = (event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'k' || !event.ctrlKey && !event.metaKey && !event.altKey && event.key === '/';
      const modal = doc.querySelector('dialog[open]');
      if (!shortcut || modal && modal !== searchDialog) return;
      event.preventDefault(); openSearch();
    });
    searchController.openSearch = openSearch;
    renderSearch();
  }

  const menuTrigger = $('docs-menu-open'), menu = $('docs-menu-dialog');
  if (menuTrigger && menu && typeof menu.showModal === 'function') {
    const controller = bindDialog(menu, { trigger: menuTrigger }); controllers.push(controller); menuTrigger.hidden = false;
    on(menu, 'click', (event) => { const anchor = event.target.closest?.('a[href]'); if (anchor && menu.contains(anchor)) controller.close(); });
  }

  // Code blocks keep their exact text. A denied clipboard leaves a selectable fallback.
  const copyStatus = $('docs-copy-status'), generated = [], fallbackPanels = new Set();
  const announce = (message) => { if (copyStatus) copyStatus.textContent = message; };
  function manualCopy(wrapper, text, trigger) {
    for (const panel of fallbackPanels) panel.remove(); fallbackPanels.clear();
    const panel = doc.createElement('div'), label = doc.createElement('label'), textarea = doc.createElement('textarea'), close = doc.createElement('button');
    panel.className = 'doc-copy-fallback'; label.textContent = 'قولدا كۆچۈرۈش · Ctrl+C / Command+C';
    textarea.className = 'ug-textarea'; textarea.dir = 'ltr'; textarea.readOnly = true; textarea.spellcheck = false; textarea.rows = Math.max(4, Math.min(12, text.split('\n').length)); textarea.value = text;
    close.type = 'button'; close.className = 'ug-button ug-button--secondary ug-button--small'; close.textContent = 'تاقاش';
    close.addEventListener('click', () => { panel.remove(); fallbackPanels.delete(panel); if (trigger.isConnected) trigger.focus(); });
    label.append(textarea); panel.append(label, close); wrapper.append(panel); fallbackPanels.add(panel); textarea.focus(); textarea.select();
  }
  for (const pre of new Set(doc.querySelectorAll('main.doc-article pre, main .doc-article pre, pre[data-copy-code]'))) {
    const existing = pre.parentElement?.classList.contains('doc-code-shell'), wrapper = existing ? pre.parentElement : doc.createElement('div');
    if (!existing) { wrapper.className = 'doc-code-shell'; pre.parentNode.insertBefore(wrapper, pre); wrapper.append(pre); }
    const button = doc.createElement('button'); button.className = 'doc-copy'; button.type = 'button'; button.textContent = 'كۆچۈرۈش'; button.setAttribute('aria-label', 'كودنى كۆچۈرۈش'); wrapper.append(button);
    generated.push({ pre, wrapper, button, existing });
    on(button, 'click', async () => {
      if (button.disabled || destroyed) return;
      button.disabled = true; button.setAttribute('aria-busy', 'true');
      const text = pre.querySelector('code')?.textContent ?? pre.textContent;
      try {
        if (!win.navigator.clipboard?.writeText) throw new Error('Clipboard is unavailable');
        await win.navigator.clipboard.writeText(text);
        if (!destroyed) { button.textContent = 'كۆچۈرۈلدى'; announce('كود كۆچۈرۈلدى.'); delay(() => { button.textContent = 'كۆچۈرۈش'; }, 2500); }
      } catch {
        if (!destroyed) { manualCopy(wrapper, text, button); announce('ئاپتوماتىك كۆچۈرۈلمىدى؛ تاللانغان كودنى قولدا كۆچۈرۈڭ.'); }
      } finally { if (!destroyed) { button.disabled = false; button.removeAttribute('aria-busy'); } }
    });
  }

  // Section navigation never moves focus while the reader scrolls.
  const tocLinks = [...doc.querySelectorAll('[data-docs-toc] a[href^="#"], a[data-docs-toc][href^="#"]')], tocOriginals = tocLinks.map((link) => link.getAttribute('aria-current'));
  const sections = tocLinks.map((link) => { try { return doc.getElementById(decodeURIComponent(link.getAttribute('href').slice(1))); } catch { return null; } });
  const uniqueSections = [...new Set(sections.filter(Boolean))];
  function updateToc(hash = false) {
    if (destroyed || !tocLinks.length) return;
    let active;
    if (hash && doc.location.hash) { try { active = uniqueSections.find((section) => section.id === decodeURIComponent(doc.location.hash.slice(1))); } catch { /* Bad fragments have no selected heading. */ } }
    if (!active) {
      uniqueSections.forEach((section) => { if (section.getBoundingClientRect().top <= 135) active = section; });
      active ||= uniqueSections[0];
    }
    tocLinks.forEach((link, i) => { if (active && sections[i] === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  }
  if (tocLinks.length) {
    if (typeof win.IntersectionObserver === 'function') {
      tocObserver = new win.IntersectionObserver(() => updateToc(), { rootMargin: '-100px 0px -60% 0px', threshold: 0 }); uniqueSections.forEach((section) => tocObserver.observe(section));
    }
    // A fast jump can move a heading from below to above the observer zone in one
    // frame without an intersection transition. Keep that case accurate too.
    on(win, 'scroll', () => { if (!frame) frame = win.requestAnimationFrame(() => { frame = null; updateToc(); }); }, { passive: true });
    on(win, 'resize', () => updateToc()); on(win, 'hashchange', () => updateToc(true)); updateToc(true);
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true; requestAbort?.abort(); cleanup.forEach((fn) => fn()); controllers.forEach((controller) => controller.destroy()); tocObserver?.disconnect();
    if (frame) win.cancelAnimationFrame(frame);
    for (const timer of timers) win.clearTimeout(timer); timers.clear();
    for (const panel of fallbackPanels) panel.remove(); fallbackPanels.clear();
    for (const { pre, wrapper, button, existing } of generated) { button.remove(); if (!existing && wrapper.parentNode) { wrapper.parentNode.insertBefore(pre, wrapper); wrapper.remove(); } }
    tocLinks.forEach((link, i) => { if (tocOriginals[i] === null) link.removeAttribute('aria-current'); else link.setAttribute('aria-current', tocOriginals[i]); });
    instances.delete(doc);
  }
  on(win, 'pagehide', (event) => { if (!event.persisted) destroy(); });
  const api = { destroy, openSearch: () => searchController?.openSearch?.() ?? Promise.resolve([]) };
  instances.set(doc, api);
  return api;
}
