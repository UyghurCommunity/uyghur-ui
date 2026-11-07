import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { applicationExamples } from '../docs/application-examples.js';
import { escapeHTML } from '../docs/site-shell.js';

const root = new URL('../', import.meta.url), output = new URL('registry/', root);
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const digest = (content) => createHash('sha256').update(content).digest('hex');
const files = [];
async function collect(directory, prefix = '') {
  for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) await collect(new URL(`${entry.name}/`, directory), `${relative}/`);
    else if (entry.isFile() && (/\.(?:js|css|md)$/.test(entry.name) || entry.name === 'LICENSE')) files.push({ path: `vendor/uyghur-ui/src/${relative}`, content: await readFile(new URL(entry.name, directory), 'utf8') });
    else if (!entry.isFile()) throw new Error('Registry source must contain ordinary files and directories.');
  }
}
await collect(new URL('src/', root));
for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) files.push({ path: `vendor/uyghur-ui/${name}`, content: await readFile(new URL(name, root), 'utf8') });

const server = `import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = await realpath(fileURLToPath(new URL('.', import.meta.url)));
const port = Number(process.env.PORT ?? 4173);
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('Choose a valid PORT.');
const types = {'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.mjs':'text/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.json':'application/json;charset=utf-8','.svg':'image/svg+xml','.md':'text/plain;charset=utf-8'};
const server = createServer(async (request, response) => {
  if (!['GET','HEAD'].includes(request.method)) { response.writeHead(405); response.end(); return; }
  try {
    let name = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (name.includes('\\\\') || name.includes('\\0')) throw new Error('Invalid path');
    if (name.endsWith('/')) name += 'index.html';
    const filename = await realpath(path.resolve(root, '.' + name));
    if (!filename.startsWith(root + path.sep) || !(await stat(filename)).isFile()) throw new Error('Invalid path');
    const content = await readFile(filename);
    response.writeHead(200, {'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-store'});
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch { response.writeHead(404); response.end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:' + server.address().port));
`;
const asFile = ({ path, content }) => ({ path, target: path, type: 'registry:file', content, sha256: digest(content) });
const items = applicationExamples.map((example) => {
  const script = example.js.replaceAll("'@uyghurcommunity/ui'", "'./vendor/uyghur-ui/src/index.js'").replaceAll('"@uyghurcommunity/ui"', '"./vendor/uyghur-ui/src/index.js"');
  const html = `<!doctype html>\n<html lang="ug" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHTML(example.title)} · Uyghur UI</title><link rel="stylesheet" href="vendor/uyghur-ui/src/styles.css"><style>body{margin:0;padding:clamp(18px,5vw,50px);background:var(--ug-bg);color:var(--ug-text)}main{max-width:860px;margin:auto}h1{font-weight:normal;font-size:30px;line-height:1.8}.intro{color:var(--ug-muted);margin-block:12px 28px}button,input,textarea,select{font:inherit}</style></head><body class="ug-ui"><main><h1>${escapeHTML(example.title)}</h1><p class="intro">${escapeHTML(example.description)}</p>${example.html}<noscript><p>ئۆزئارا تەسىرلىك كونتروللار ئۈچۈن JavaScript نى ئېچىڭ.</p></noscript></main><script type="module">\n${script}\n</script></body></html>\n`;
  const readme = `# ${example.en} · ${example.title}\n\nA standalone source example from Uyghur UI v${manifest.version}.\n\nRun \`node server.mjs\` and open the printed localhost address. The installer only copied files; it did not execute this server or install dependencies.\n\nEdit index.html directly. All runtime modules are local under vendor/uyghur-ui/src. The ALKATIP Basma font stylesheet uses the supplied external URLs; no font binary is included. The writing and action examples are local; no submission API is connected. Keep labels, lang/dir attributes, focus behavior and vendor license notices when adapting the example.\n\nCore source: https://github.com/UyghurCommunity/uyghur-ui\nLicense: MIT; see vendor/uyghur-ui/THIRD_PARTY_NOTICES.md for source and asset notices.\n`;
  return {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json', name: example.id, type: 'registry:block',
    title: example.title, description: example.description, author: 'UyghurCommunity',
    dependencies: [], devDependencies: [], registryDependencies: [],
    meta: { version: manifest.version, language: 'ug', direction: 'rtl', framework: 'html', integrity: 'SHA256 of each UTF-8 file content' },
    files: [
      { path: 'index.html', content: html }, { path: 'server.mjs', content: server },
      { path: 'package.json', content: JSON.stringify({ name: `uyghur-ui-${example.id}-example`, version: '0.0.0', private: true, type: 'module', scripts: { start: 'node server.mjs' } }, null, 2) + '\n' },
      { path: 'README.md', content: readme }, ...files,
    ].map(asFile),
  };
});
const expected = ['writing-field', 'dialog', 'combobox', 'dropdown', 'drawer', 'data-table'];
if (items.map(({ name }) => name).join() !== expected.join()) throw new Error('Unexpected application registry collection.');
await mkdir(output, { recursive: true });
for (const item of items) await writeFile(new URL(`${item.name}.json`, output), JSON.stringify(item, null, 2) + '\n');
await writeFile(new URL('index.json', output), JSON.stringify({ $schema: 'https://ui.shadcn.com/schema/registry.json', name: 'uyghur-ui', homepage: 'https://uyghurcommunity.github.io/uyghur-ui/', items }, null, 2) + '\n');
await writeFile(new URL('README.md', output), '# Uyghur UI source registry\n\nSix original registry:block items generated from the application examples and the local core source. Each file includes content, a relative target, and an additional SHA256 integrity field. These are framework-independent HTML blocks; they do not install React, Tailwind, or npm dependencies.\n\nUse the Uyghur Starters offline installer: `create-uyghur --ui writing-field --dir ./my-ui`. Source snapshots are bundled with that CLI. Remote shadcn installation is not required or promised.\n\nRun `npm run build:registry` after changing source/examples, and keep all generated JSON committed. The CLI snapshot must be refreshed for the same release. No font binaries are included; the supplied ALKATIP Basma stylesheet registers external URLs.\n');
console.log(`Built ${items.length} offline UI blocks for v${manifest.version}, ${items[0].files.length} files each.`);
