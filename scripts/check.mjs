import { readFile, access, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { iconSVG, iconNames, flagSVG, iconCatalog } from '../src/icons.js';
import { components } from '../docs/components.js';
const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(resolve(root, 'index.html'), 'utf8');
const galleryHTML = html + '\n' + components.map((component) => component.html).join('\n');
const ids = [...galleryHTML.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
if (ids.length !== new Set(ids).size) throw new Error('Duplicate HTML ID');
for (const [, references] of galleryHTML.matchAll(/\b(?:for|aria-controls|aria-labelledby|aria-describedby)="([^"]+)"/g)) {
  for (const ref of references.split(/\s+/)) if (!ids.includes(ref)) throw new Error(`Missing label/ARIA target ${ref}`);
}
for (const [, ref] of galleryHTML.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  if (/^(https?:|data:|mailto:)/.test(ref)) continue;
  if (ref.startsWith('#')) { if (!ids.includes(ref.slice(1))) throw new Error(`Missing anchor ${ref}`); }
  else await access(resolve(root, ref));
}
for (const file of ['src/index.js', 'src/icons.js', 'src/icon-labels.js', 'src/traditional-drawings.js', 'scripts/build-icons.mjs', 'scripts/zip.mjs', 'docs/app.js', 'docs/components.js', 'docs/snippets.js']) execFileSync(process.execPath, ['--check', resolve(root, file)]);
const galleryScript = await readFile(resolve(root, 'docs/app.js'), 'utf8');
for (const [, ref] of galleryScript.matchAll(/\$\('([^']+)'\)/g)) if (!ids.includes(ref)) throw new Error(`Missing gallery JS target ${ref}`);
for (const file of ['src/styles.css','src/font.css','docs/site.css']) {
  const css = await readFile(resolve(root, file), 'utf8');
  if ((css.match(/\{/g)||[]).length !== (css.match(/\}/g)||[]).length) throw new Error(`CSS blocks: ${file}`);
}
for (const { name, ug } of iconCatalog) if (await readFile(resolve(root, `assets/icons/${name}.svg`), 'utf8') !== iconSVG(name, { label: ug })) throw new Error(`Stale icon ${name}`);
const catalog = JSON.parse(await readFile(resolve(root, 'assets/icon-catalog.json'), 'utf8'));
if (JSON.stringify(catalog.icons) !== JSON.stringify(iconCatalog)) throw new Error('Stale icon metadata');
const stored = (await readdir(resolve(root, 'assets/icons'))).filter((name) => name.endsWith('.svg')).sort();
if (JSON.stringify(stored) !== JSON.stringify(iconNames.map((name) => `${name}.svg`).sort())) throw new Error('SVG files do not match the public catalog');
if (await readFile(resolve(root,'assets/flags/east-turkistan.svg'),'utf8') !== flagSVG({width:900})) throw new Error('Stale flag asset');
console.log(`Checked documentation assets, ${ids.length} IDs, CSS, JavaScript and ${iconNames.length} SVG icons.`);
