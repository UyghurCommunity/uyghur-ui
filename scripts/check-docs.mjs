import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, relative, resolve, sep } from 'node:path';
import { guidePages } from '../docs/guide-content.js';
import { components } from '../docs/components.js';
import { iconCatalog } from '../src/icons.js';
import { prepareSearchIndex, searchDocumentation } from '../docs/docs-shell.js';
import { siteVersion, themeBootstrap } from '../docs/site-shell.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const rootHTML = resolve(root, 'index.html'), cache = new Map();
const dynamicGalleryIDs = new Set([
  ...components.map(({ id }) => `component-${id}`),
  ...iconCatalog.map(({ name }) => `icon-${name}`),
]);
const fail = (file, message) => { throw new Error(`${relative(root, file)}: ${message}`); };
const decode = (text) => text.replace(/&(?:amp|quot|apos|lt|gt|#39|#\d+|#x[\da-f]+);/gi, (value) => {
  const names = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&#39;': "'" };
  if (Object.hasOwn(names, value)) return names[value];
  const hex = /^&#x/i.test(value), number = parseInt(value.slice(hex ? 3 : 2, -1), hex ? 16 : 10);
  return Number.isInteger(number) && number >= 0 && number <= 0x10ffff ? String.fromCodePoint(number) : value;
});
const text = (markup) => decode(markup.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

function attributes(source) {
  const result = new Map();
  for (const match of source.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    result.set(match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4] ?? ''));
  }
  return result;
}
function tags(markup) {
  const clean = markup.replace(/<!--[\s\S]*?-->/g, '').replace(/(<script\b[^>]*>)[\s\S]*?<\/script>/gi, '$1</script>').replace(/(<style\b[^>]*>)[\s\S]*?<\/style>/gi, '$1</style>');
  return [...clean.matchAll(/<([a-z][\w:-]*)(?=[\s/>])([^<>]*?)\/?\s*>/gi)].map((match) => ({ name: match[1].toLowerCase(), attrs: attributes(match[2]) }));
}
async function document(file) {
  if (!cache.has(file)) {
    const html = await readFile(file, 'utf8');
    // Samples are generated on the gallery at runtime; include their actual authored
    // markup for label/ID checking, while recognizing only allowlisted outer anchors.
    const nodes = tags(html + (file === rootHTML ? '\n' + components.map(({ html }) => html).join('\n') : ''));
    const ids = new Map();
    for (const node of nodes) {
      const id = node.attrs.get('id');
      if (!id) continue;
      if (ids.has(id)) fail(file, `duplicate real ID ${id}`);
      ids.set(id, node);
    }
    cache.set(file, { html, nodes, ids });
  }
  return cache.get(file);
}

let localReferences = 0;
async function localTarget(file, reference) {
  if (!reference) return;
  if (/^(?:https?:|mailto:|tel:|data:)/i.test(reference)) return;
  if (/^[a-z][a-z\d+.-]*:/i.test(reference) || reference.startsWith('//')) fail(file, `unexpected link protocol: ${reference}`);
  const url = new URL(reference, pathToFileURL(file));
  let target = fileURLToPath(url);
  const within = relative(root, target);
  if (within === '..' || within.startsWith(`..${sep}`) || resolve(root, within) !== target) fail(file, `local reference escapes the project: ${reference}`);
  let info;
  try { info = await stat(target); } catch { fail(file, `missing local asset: ${reference}`); }
  if (info.isDirectory()) { target = resolve(target, 'index.html'); try { await stat(target); } catch { fail(file, `directory has no index: ${reference}`); } }
  if (url.hash) {
    let id;
    try { id = decodeURIComponent(url.hash.slice(1)); } catch { fail(file, `invalid fragment encoding: ${reference}`); }
    if (target.endsWith('.html')) {
      const destination = await document(target);
      if (!destination.ids.has(id) && !(target === rootHTML && dynamicGalleryIDs.has(id))) fail(file, `missing fragment ${id} in ${relative(root, target)}`);
    }
  }
  localReferences++;
}

function checkShell(file, doc, active) {
  const { html, nodes, ids } = doc;
  for (const id of ['docs-search-open', 'docs-search-dialog', 'docs-search-input', 'docs-search-status', 'docs-search-results', 'docs-menu-open', 'docs-menu-dialog', 'docs-search-title', 'docs-menu-title', 'docs-copy-status', 'theme']) {
    if (!ids.has(id)) fail(file, `missing documentation shell control ${id}`);
  }
  for (const id of ['docs-search-dialog', 'docs-menu-dialog']) {
    const dialog = ids.get(id);
    if (dialog.name !== 'dialog' || dialog.attrs.has('open') || !dialog.attrs.has('aria-labelledby')) fail(file, `${id} must be a named, initially closed native dialog`);
  }
  if (ids.get('docs-search-input').name !== 'input' || ids.get('docs-search-input').attrs.get('type') !== 'search') fail(file, 'documentation search input must be a native search field');
  if (!nodes.some(({ name, attrs }) => name === 'label' && attrs.get('for') === 'docs-search-input')) fail(file, 'documentation search has no associated label');
  for (const id of ['docs-search-open', 'docs-menu-open']) if (ids.get(id).name !== 'button' || ids.get(id).attrs.get('type') !== 'button') fail(file, `${id} must be a button`);
  const body = nodes.find(({ name }) => name === 'body');
  if (!body?.attrs.get('data-search-index')) fail(file, 'missing local search-index declaration');
  const expectedIndex = resolve(dirname(file), body.attrs.get('data-search-index'));
  if (expectedIndex !== resolve(root, 'assets/docs-search.json')) fail(file, 'search-index declaration points to the wrong file');
  const navigation = [...html.matchAll(/<nav\b[^>]*\bdata-docs-nav\b[^>]*>([\s\S]*?)<\/nav>/g)];
  if (navigation.length < 2) fail(file, 'desktop and mobile documentation navigation are required');
  for (const [, markup] of navigation) {
    const anchors = tags(markup).filter(({ name }) => name === 'a');
    const current = anchors.filter(({ attrs }) => attrs.get('aria-current') === 'page');
    if (current.length !== 1) fail(file, 'each documentation navigation needs exactly one current page');
    const destination = new URL(current[0].attrs.get('href'), pathToFileURL(file));
    const expected = active === 'gallery' ? pathToFileURL(rootHTML).href + '#components' : pathToFileURL(resolve(root, `guide/${active}.html`)).href;
    if (destination.href !== expected) fail(file, 'documentation navigation marks the wrong current page');
    for (const page of guidePages) if (!anchors.some(({ attrs }) => fileURLToPath(new URL(attrs.get('href'), pathToFileURL(file))) === resolve(root, `guide/${page.slug}.html`))) fail(file, `navigation omits ${page.slug}`);
  }
}

const expectedGuideNames = [...guidePages.map(({ slug }) => `${slug}.html`), 'index.html'].sort();
assert.deepEqual((await readdir(resolve(root, 'guide'))).filter((name) => name.endsWith('.html')).sort(), expectedGuideNames, 'generated guide page set is stale');
for (const file of [rootHTML, ...expectedGuideNames.map((name) => resolve(root, 'guide', name))]) {
  const doc = await document(file), { html, nodes, ids } = doc;
  const htmlNode = nodes.find(({ name }) => name === 'html');
  if (htmlNode?.attrs.get('lang') !== 'ug' || htmlNode.attrs.get('dir') !== 'rtl') fail(file, 'document must declare lang="ug" dir="rtl"');
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(file, 'missing document title');
  for (const { name, attrs } of nodes) {
    for (const attribute of ['for', 'aria-controls', 'aria-labelledby', 'aria-describedby']) {
      const references = attrs.get(attribute);
      if (!references) continue;
      for (const id of references.split(/\s+/)) if (!ids.has(id)) fail(file, `${attribute} points to missing ${id}`);
    }
    if (name === 'label' && attrs.has('for') && !['input', 'select', 'textarea', 'button', 'meter', 'output', 'progress'].includes(ids.get(attrs.get('for'))?.name)) fail(file, `label points to a non-labelable element: ${attrs.get('for')}`);
    for (const attribute of ['href', 'src']) if (attrs.has(attribute)) await localTarget(file, attrs.get(attribute));
  }
  if (file === resolve(root, 'guide/index.html')) {
    if (!nodes.some(({ name, attrs }) => name === 'meta' && attrs.get('http-equiv')?.toLowerCase() === 'refresh' && attrs.get('content') === '0;url=introduction.html')) fail(file, 'guide directory redirect must target introduction.html');
    continue;
  }
  if (!nodes.some(({ name, attrs }) => name === 'meta' && attrs.get('name') === 'description' && attrs.get('content'))) fail(file, 'missing description');
  const page = guidePages.find(({ slug }) => file === resolve(root, `guide/${slug}.html`));
  checkShell(file, doc, page?.slug || 'gallery');
  if (!page) continue;
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1];
  const description = nodes.find(({ name, attrs }) => name === 'meta' && attrs.get('name') === 'description')?.attrs.get('content');
  if (decode(title || '') !== `${page.title} · ئۇيغۇرچە UI` || description !== page.description) fail(file, 'guide title or description differs from its source');
  const main = html.match(/<main\b([^>]*)>([\s\S]*?)<\/main>/i);
  if (!main || attributes(main[1]).has('hidden') || !main[2].includes(page.body)) fail(file, 'guide body is missing, hidden, or stale');
  if (text(main[2]).length < 500 || !text(main[2]).includes(page.title) || !text(main[2]).includes(page.description)) fail(file, 'guide needs readable static content');
  const articleNodes = tags(main[2]);
  if (articleNodes.some(({ name }) => ['script', 'form', 'input', 'textarea', 'select', 'button', 'iframe'].includes(name))) fail(file, 'guide code examples became live controls or scripts');
  const headings = [...page.body.matchAll(/<h2\b[^>]*id="([^"]+)"[^>]*>/g)].map((match) => match[1]);
  if (headings.length < 3 || new Set(headings).size !== headings.length) fail(file, 'guide section IDs are missing or duplicated');
  for (const id of headings) if (!html.includes(`data-docs-toc href="#${id}"`)) fail(file, `table of contents omits ${id}`);
  for (const match of main[2].matchAll(/<pre\b[^>]*><code>([\s\S]*?)<\/code><\/pre>/g)) if (/<\/?[a-z][^>]*>/i.test(match[1])) fail(file, 'copyable code must contain escaped markup');
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  if (scripts.length !== 2 || scripts[0][0] !== themeBootstrap || attributes(scripts[1][1]).get('type') !== 'module' || scripts[1][2].trim() !== "import { initDocsShell } from '../docs/docs-shell.js'; initDocsShell(document);") fail(file, 'guide scripts differ from the constant theme bootstrap and module entry');
}

const payload = JSON.parse(await readFile(resolve(root, 'assets/docs-search.json'), 'utf8'));
assert.equal(payload.version, siteVersion, 'documentation search version is stale');
const expectedHrefs = new Set([
  ...guidePages.map(({ slug }) => `guide/${slug}.html`),
  ...components.map(({ id }) => `index.html#component-${id}`),
  ...iconCatalog.map(({ name }) => `index.html#icon-${name}`),
  'index.html#flag',
  'index.html#map',
]);
const expectedEntryCount = guidePages.length + components.length + iconCatalog.length + 2;
assert.equal(expectedHrefs.size, expectedEntryCount, 'documentation source inventory has duplicate destinations');
assert.equal(payload.entries.length, expectedEntryCount, 'documentation index is incomplete');
assert.deepEqual(new Set(payload.entries.map(({ href }) => href)), expectedHrefs, 'documentation index destinations differ from its real sources');
const indexURL = 'https://documentation.invalid/uyghur-ui/assets/docs-search.json';
const prepared = prepareSearchIndex(payload, indexURL);
assert.equal(prepared.length, expectedEntryCount, 'search validation dropped documentation entries');
for (const page of guidePages) {
  const entry = payload.entries.find(({ href }) => href === `guide/${page.slug}.html`);
  assert.ok(entry && entry.title === page.title && entry.en === page.en && entry.description === page.description, `search metadata is stale for ${page.slug}`);
}
for (const icon of iconCatalog) {
  const entry = payload.entries.find(({ href }) => href === `index.html#icon-${icon.name}`);
  assert.ok(entry && entry.title === icon.ug && entry.en === icon.en && icon.keywords.every((word) => entry.keywords.includes(word)), `search metadata is stale for ${icon.name}`);
}
for (const entry of payload.entries) await localTarget(rootHTML, entry.href);
for (const [query, expected] of [['قاچىلاش', 'guide/installation.html'], ['installation', 'guide/installation.html'], ['راۋاپ', 'index.html#icon-rawap'], ['rawab', 'index.html#icon-rawap'], ['dialog', 'index.html#component-dialog'], ['كۇنۇپكىلار', 'index.html#component-buttons']]) {
  assert.ok(searchDocumentation(prepared, query, { limit: 50 }).some(({ href }) => href === new URL(expected, 'https://documentation.invalid/uyghur-ui/').href), `documentation search lost destination for ${query}`);
}
const mapQueries = ['خەرىتە', 'East Turkistan map', 'GeoJSON', 'Natural Earth'];
const mapDestination = new URL('index.html#map', 'https://documentation.invalid/uyghur-ui/').href;
for (const query of mapQueries) {
  assert.ok(searchDocumentation(prepared, query, { limit: 50 }).some(({ href }) => href === mapDestination), `documentation search lost the map for ${query}`);
}
console.log(`Checked ${guidePages.length} static guide pages, gallery/redirect, labels/ARIA, ${localReferences} local references, and all ${expectedEntryCount} searchable destinations.`);
