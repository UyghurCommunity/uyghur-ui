import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { guidePages } from '../docs/guide-content.js';
import { header, sidebar, dialogs, navigation, tableOfContents, tocLinks, themeBootstrap, escapeHTML, siteVersion } from '../docs/site-shell.js';
import { iconCatalog } from '../src/icons.js';
import { components } from '../docs/components.js';
const root = fileURLToPath(new URL('../', import.meta.url));
function searchableText(body) {
  const plain = body.replace(/<[^>]*>/g, ' ').replace(/&(amp|lt|gt|quot|#39);/g, (_, entity) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[entity])).replace(/\s+/g, ' ').trim();
  const chunks = []; let chunk = '';
  for (const word of plain.split(' ')) { if (chunk.length + word.length > 900) { chunks.push(chunk); chunk = ''; } chunk += `${chunk ? ' ' : ''}${word.slice(0, 900)}`; }
  if (chunk) chunks.push(chunk); return chunks;
}
await mkdir(resolve(root, 'guide'), { recursive: true });
const breadcrumbs = '<a href="introduction.html">قوللانما</a><span aria-hidden="true">/</span>';
for (let index = 0; index < guidePages.length; index++) {
  const page = guidePages[index], previous = guidePages[index - 1], next = guidePages[index + 1], headings = tableOfContents(page.body);
  const pager = `<nav class="docs-pager" aria-label="قوللانما بەتلىرى">${previous ? `<a href="${previous.slug}.html"><small>ئالدىنقى بەت</small><span>→ ${escapeHTML(previous.title)}</span></a>` : '<span></span>'}${next ? `<a href="${next.slug}.html"><small>كېيىنكى بەت</small><span>${escapeHTML(next.title)} ←</span></a>` : '<span></span>'}</nav>`;
  const html = `<!doctype html>
<html lang="ug" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f4f7f9"><meta name="description" content="${escapeHTML(page.description)}"><title>${escapeHTML(page.title)} · ئۇيغۇرچە UI</title><link rel="canonical" href="https://uyghurcommunity.github.io/uyghur-ui/guide/${page.slug}.html"><link rel="icon" href="../assets/icons/flower.svg" type="image/svg+xml">${themeBootstrap}<link rel="stylesheet" href="../src/styles.css"><link rel="stylesheet" href="../docs/documentation.css"></head>
<body class="ug-ui doc-site guide-page" data-search-index="../assets/docs-search.json"><a class="skip" href="#main">مەزمۇنغا ئاتلاش</a>${header('../', page.slug)}<noscript><details class="docs-noscript"><summary>قوللانما بەتلىرى</summary>${navigation(guidePages, { prefix: '../', active: page.slug })}</details></noscript>
<div class="guide-layout">${sidebar(guidePages, { prefix: '../', active: page.slug })}<main id="main" class="doc-article" tabindex="-1"><div class="docs-breadcrumb">${breadcrumbs}<span>${escapeHTML(page.title)}</span></div><div class="doc-heading"><p class="doc-eyebrow" lang="en" dir="ltr">${escapeHTML(page.en)}</p><h1>${escapeHTML(page.title)}</h1><p class="doc-description">${escapeHTML(page.description)}</p></div><details class="doc-mobile-toc"><summary>بۇ بەتتە</summary><div>${tocLinks(headings)}</div></details>${page.body}${pager}<footer class="doc-article-footer"><a href="https://github.com/UyghurCommunity/uyghur-ui/edit/main/docs/guide-content.js">بۇ قوللانمىنى ياخشىلاش ↗</a><span lang="en" dir="ltr">v${siteVersion} · MIT</span></footer></main><aside class="doc-toc" aria-label="بۇ بەتتىكى مەزمۇن"><p>بۇ بەتتە</p>${tocLinks(headings)}<div class="doc-toc-help"><strong>بىرلىكتە ياخشىلايلى.</strong><p>سوئال ياكى خاتالىق بايقىدىڭىزمۇ؟</p><a href="https://github.com/UyghurCommunity/uyghur-ui/issues">GitHub Issues ↗</a></div></aside></div>${dialogs(guidePages, { prefix: '../', active: page.slug })}<script type="module">import { initDocsShell } from '../docs/docs-shell.js'; initDocsShell(document);</script></body></html>\n`;
  await writeFile(resolve(root, `guide/${page.slug}.html`), html);
}
const indexPath = resolve(root, 'index.html'); let homepage = await readFile(indexPath, 'utf8');
const replacements = [
  ['HEADER', header('', 'gallery')], ['SIDEBAR', sidebar(guidePages, { active: 'gallery' })],
  ['DIALOGS', dialogs(guidePages, { active: 'gallery' })],
];
for (const [name, html] of replacements) {
  const pattern = new RegExp(`<!-- DOCS:${name} START -->[\\s\\S]*?<!-- DOCS:${name} END -->`);
  if (!pattern.test(homepage)) throw new Error(`Missing homepage marker ${name}`);
  homepage = homepage.replace(pattern, `<!-- DOCS:${name} START -->\n${html}\n<!-- DOCS:${name} END -->`);
}
await writeFile(indexPath, homepage);
const entries = [
  ...guidePages.map((page) => ({ title: page.title, en: page.en, description: page.description, href: `guide/${page.slug}.html`, keywords: [page.slug, ...tableOfContents(page.body).map((entry) => entry.title), ...searchableText(page.body)].slice(0, 200) })),
  ...components.map((component) => ({ title: component.title, en: component.id, description: component.description, href: `index.html#component-${component.id}`, keywords: ['component', 'بۆلەك', component.category] })),
  ...iconCatalog.map((entry) => ({ title: entry.ug, en: entry.en, description: `${entry.ug} · ${entry.name} · SVG`, href: `index.html#icon-${entry.name}`, keywords: [entry.name, entry.category, ...entry.keywords, 'icon', 'سىنبەلگە'] })),
  { title: 'شەرقىي تۈركىستان بايرىقى', en: 'East Turkistan flag', description: 'بايراق SVG ھۆججىتى ۋە ئىشلىتىش ئۇسۇلى.', href: 'index.html#flag', keywords: ['flag', 'SVG', 'بايراق'] },
  { title: 'شەرقىي تۈركىستان خەرىتىسى', en: 'East Turkistan map', description: 'سىزىقلىق ۋە تولدۇرۇلغان SVG خەرىتىسى، ئەسلى GeoJSON ۋە مەنبە ئۇچۇرى.', href: 'index.html#map', keywords: ['map', 'SVG', 'خەرىتە', 'East Turkistan', 'شەرقىي تۈركىستان', 'outline', 'filled', 'GeoJSON', 'Natural Earth', 'geography', 'شىنجاڭ', 'Xinjiang'] },
];
await writeFile(resolve(root, 'assets/docs-search.json'), JSON.stringify({ version: siteVersion, entries }, null, 2) + '\n');
await writeFile(resolve(root, 'guide/index.html'), '<!doctype html><html lang="ug" dir="rtl"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=introduction.html"><title>ئۇيغۇرچە UI قوللانمىسى</title></head><body><a href="introduction.html">قوللانمىنى ئېچىش</a></body></html>\n');
console.log(`Generated ${guidePages.length} readable guide pages, shared navigation and ${entries.length} local search entries.`);
