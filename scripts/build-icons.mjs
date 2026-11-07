import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { iconSVG, iconNames, coloredIconNames, flagSVG, iconCatalog, iconCategories } from '../src/icons.js';
import { zipFiles } from './zip.mjs';
const base = new URL('../', import.meta.url);
const { version } = JSON.parse(await readFile(new URL('package.json', base), 'utf8'));
await mkdir(new URL('assets/icons/', base), { recursive: true });
await mkdir(new URL('assets/icons/color/', base), { recursive: true });
await mkdir(new URL('assets/flags/', base), { recursive: true });
await mkdir(new URL('downloads/', base), { recursive: true });
const labels = Object.fromEntries(iconCatalog.map((entry) => [entry.name, entry.ug]));
for (const name of iconNames) await writeFile(new URL(`assets/icons/${name}.svg`, base), iconSVG(name, { label: labels[name] }));
for (const name of coloredIconNames) await writeFile(new URL(`assets/icons/color/${name}.svg`, base), iconSVG(name, { variant: 'color', label: labels[name] }));
await writeFile(new URL('assets/flags/east-turkistan.svg', base), flagSVG({ width: 900 }));
function metadata(icons) { return JSON.stringify({ version, categories: iconCategories, icons }, null, 2) + '\n'; }
await writeFile(new URL('assets/icon-catalog.json', base), metadata(iconCatalog));
for (const [filename, icons] of [['uyghur-ui-icons.zip', iconCatalog], ['uyghur-traditional-icons.zip', iconCatalog.filter((entry) => entry.category !== 'general')]]) {
  const files = [];
  for (const entry of icons) files.push([`assets/icons/${entry.name}.svg`, await readFile(new URL(`assets/icons/${entry.name}.svg`, base))]);
  for (const entry of icons.filter((item) => item.variants.includes('color'))) files.push([`assets/icons/color/${entry.name}.svg`, await readFile(new URL(`assets/icons/color/${entry.name}.svg`, base))]);
  for (const path of ['assets/flags/east-turkistan.svg', 'LICENSE', 'THIRD_PARTY_NOTICES.md']) files.push([path, await readFile(new URL(path, base))]);
  for (const name of ['east-turkistan-outline.svg', 'east-turkistan-filled.svg', 'east-turkistan.source.geojson', 'east-turkistan.metadata.json', 'README.md']) files.push([`assets/maps/${name}`, await readFile(new URL(`assets/maps/${name}`, base))]);
  files.push(['assets/icon-catalog.json', metadata(icons)]);
  await writeFile(new URL(`downloads/${filename}`, base), zipFiles(files));
}
const mapFiles = [];
for (const name of ['east-turkistan-outline.svg', 'east-turkistan-filled.svg', 'east-turkistan.source.geojson', 'east-turkistan.metadata.json', 'README.md']) mapFiles.push([name, await readFile(new URL(`assets/maps/${name}`, base))]);
for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) mapFiles.push([name, await readFile(new URL(name, base))]);
await writeFile(new URL('downloads/east-turkistan-map.zip', base), zipFiles(mapFiles));
console.log(`Generated ${iconNames.length} outline icons, ${coloredIconNames.length} color variants, flag, maps and three ZIP collections.`);
