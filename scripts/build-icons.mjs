import { mkdir, writeFile } from 'node:fs/promises';
import { iconSVG, iconNames, flagSVG } from '../src/icons.js';
const base = new URL('../', import.meta.url);
await mkdir(new URL('assets/icons/', base), { recursive: true });
await mkdir(new URL('assets/flags/', base), { recursive: true });
for (const name of iconNames) await writeFile(new URL(`assets/icons/${name}.svg`, base), iconSVG(name, { label: name }));
await writeFile(new URL('assets/flags/east-turkistan.svg', base), flagSVG({ width: 900 }));
console.log(`Generated ${iconNames.length} icons and the East Turkistan flag.`);
