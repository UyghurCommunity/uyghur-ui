import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { iconSVG, iconNames, flagSVG, iconCatalog, iconCategories } from '../src/icons.js';
import { zipFiles } from './zip.mjs';
const base = new URL('../', import.meta.url);
const { version } = JSON.parse(await readFile(new URL('package.json', base), 'utf8'));
await mkdir(new URL('assets/icons/', base), { recursive: true });
await mkdir(new URL('assets/flags/', base), { recursive: true });
await mkdir(new URL('downloads/', base), { recursive: true });
const labels = Object.fromEntries(iconCatalog.map((entry) => [entry.name, entry.ug]));
for (const name of iconNames) await writeFile(new URL(`assets/icons/${name}.svg`, base), iconSVG(name, { label: labels[name] }));
await writeFile(new URL('assets/flags/east-turkistan.svg', base), flagSVG({ width: 900 }));
function metadata(icons) { return JSON.stringify({ version, categories: iconCategories, icons }, null, 2) + '\n'; }
await writeFile(new URL('assets/icon-catalog.json', base), metadata(iconCatalog));
for (const [filename, icons] of [['uyghur-ui-icons.zip', iconCatalog], ['uyghur-traditional-icons.zip', iconCatalog.filter((entry) => entry.category !== 'general')]]) {
  const files = [];
  for (const entry of icons) files.push([`assets/icons/${entry.name}.svg`, await readFile(new URL(`assets/icons/${entry.name}.svg`, base))]);
  for (const path of ['assets/flags/east-turkistan.svg', 'LICENSE', 'THIRD_PARTY_NOTICES.md']) files.push([path, await readFile(new URL(path, base))]);
  files.push(['assets/icon-catalog.json', metadata(icons)]);
  await writeFile(new URL(`downloads/${filename}`, base), zipFiles(files));
}
console.log(`Generated ${iconNames.length} icons, the East Turkistan flag, bilingual metadata and two ZIP collections.`);
