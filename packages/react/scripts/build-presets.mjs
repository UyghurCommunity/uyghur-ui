import { writeFile } from 'node:fs/promises';
import { interactionExamples, portableMarkup } from '../../../docs/interactions-data.js';
const presets = Object.fromEntries(interactionExamples.map((example) => [example.id, portableMarkup(example)]));
await writeFile(new URL('../src/presets.js', import.meta.url), '// Generated from the original core interaction examples. No DOM access.\nexport const interactionPresets = Object.freeze(' + JSON.stringify(presets, null, 2) + ');\n');
console.log('Built six portable React interaction presets.');
