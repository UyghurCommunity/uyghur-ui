import { readFile, access, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { iconSVG, iconNames, coloredIconNames, flagSVG, iconCatalog } from '../src/icons.js';
import { components } from '../docs/components.js';
const root = fileURLToPath(new URL('../', import.meta.url));
const documentIDs = new Map();
for (const filename of ['index.html', 'interactions.html', 'lab.html', 'community.html']) {
  const html = await readFile(resolve(root, filename), 'utf8');
  const markup = html + (filename === 'index.html' ? '\n' + components.map((component) => component.html).join('\n') : '');
  const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  if (ids.length !== new Set(ids).size) throw new Error(`${filename}: duplicate HTML ID`);
  for (const [, references] of markup.matchAll(/\b(?:for|aria-controls|aria-labelledby|aria-describedby)="([^"]+)"/g)) {
    for (const ref of references.split(/\s+/)) if (!ids.includes(ref)) throw new Error(`${filename}: missing label/ARIA target ${ref}`);
  }
  for (const [, ref] of markup.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    if (/^(https?:|data:|mailto:)/.test(ref)) continue;
    if (ref.startsWith('#')) { if (!ids.includes(ref.slice(1))) throw new Error(`${filename}: missing anchor ${ref}`); }
    else await access(resolve(root, ref.split(/[?#]/)[0]));
  }
  documentIDs.set(filename, ids);
}
const scriptFiles = [
  ...(await readdir(resolve(root, 'src'))).filter((name) => name.endsWith('.js')).map((name) => `src/${name}`),
  'scripts/build-map.mjs', 'scripts/build-icons.mjs', 'scripts/build-docs.mjs', 'scripts/check.mjs', 'scripts/check-docs.mjs', 'scripts/zip.mjs',
  ...(await readdir(resolve(root, 'docs'))).filter((name) => name.endsWith('.js')).map((name) => `docs/${name}`),
];
for (const file of scriptFiles) {
  const filename = resolve(root, file);
  execFileSync(process.execPath, ['--check', filename]);
}
for (const [page, script] of [['index.html', 'docs/app.js'], ['interactions.html', 'docs/interactions.js'], ['lab.html', 'docs/lab.js']]) {
  const ids = documentIDs.get(page), source = await readFile(resolve(root, script), 'utf8');
  const patterns = [
    /\$\(\s*['"]([a-zA-Z][\w:-]*)['"]\s*\)/g,
    /\bgetElementById\(\s*['"]([a-zA-Z][\w:-]*)['"]\s*\)/g,
    /\bquerySelector(?:All)?\(\s*['"]#([a-zA-Z][\w:-]*)['"]\s*\)/g,
  ];
  for (const pattern of patterns) for (const [, ref] of source.matchAll(pattern)) if (!ids.includes(ref)) throw new Error(`${script}: missing ${page} target ${ref}`);
}
for (const file of (await Promise.all(['src','docs'].map(async folder => (await readdir(resolve(root,folder))).filter(name=>name.endsWith('.css')).map(name=>`${folder}/${name}`)))).flat()) {
  const css = await readFile(resolve(root, file), 'utf8');
  if ((css.match(/\{/g)||[]).length !== (css.match(/\}/g)||[]).length) throw new Error(`CSS blocks: ${file}`);
}
for (const { name, ug } of iconCatalog) if (await readFile(resolve(root, `assets/icons/${name}.svg`), 'utf8') !== iconSVG(name, { label: ug })) throw new Error(`Stale icon ${name}`);
const labels = Object.fromEntries(iconCatalog.map(({ name, ug }) => [name, ug]));
for (const name of coloredIconNames) if (await readFile(resolve(root, `assets/icons/color/${name}.svg`), 'utf8') !== iconSVG(name, { variant: 'color', label: labels[name] })) throw new Error(`Stale color icon ${name}`);
const catalog = JSON.parse(await readFile(resolve(root, 'assets/icon-catalog.json'), 'utf8'));
if (JSON.stringify(catalog.icons) !== JSON.stringify(iconCatalog)) throw new Error('Stale icon metadata');
const stored = (await readdir(resolve(root, 'assets/icons'))).filter((name) => name !== 'color').sort();
if (JSON.stringify(stored) !== JSON.stringify(iconNames.map((name) => `${name}.svg`).sort())) throw new Error('SVG files do not match the public catalog');
const storedColor = (await readdir(resolve(root, 'assets/icons/color'))).sort();
if (JSON.stringify(storedColor) !== JSON.stringify(coloredIconNames.map((name) => `${name}.svg`).sort())) throw new Error('Color SVG files do not match the public catalog');
if (await readFile(resolve(root,'assets/flags/east-turkistan.svg'),'utf8') !== flagSVG({width:900})) throw new Error('Stale flag asset');
const idCount = [...documentIDs.values()].reduce((count, ids) => count + ids.length, 0);
console.log(`Checked documentation assets, gallery/interactions/Lab/community (${idCount} IDs), CSS, JavaScript, ${iconNames.length} outline SVG icons and ${coloredIconNames.length} color variants.`);
