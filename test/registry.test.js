import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { applicationExamples } from '../docs/application-examples.js';

const root = new URL('../', import.meta.url);
const registry = JSON.parse(await readFile(new URL('registry/index.json', root), 'utf8'));
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const expected = ['writing-field', 'dialog', 'combobox', 'dropdown', 'drawer', 'data-table'];
const hash = (content) => createHash('sha256').update(content).digest('hex');
const read = (filename) => readFile(new URL(filename, root), 'utf8');

test('the six public registry blocks have matching standalone payloads, versioned metadata, and no package installation', async () => {
  assert.equal(registry.$schema, 'https://ui.shadcn.com/schema/registry.json');
  assert.equal(registry.name, 'uyghur-ui');
  assert.deepEqual(registry.items.map(({ name }) => name), expected);
  assert.deepEqual(applicationExamples.map(({ id }) => id), expected);
  for (const item of registry.items) {
    assert.deepEqual(item, JSON.parse(await read(`registry/${item.name}.json`)));
    assert.equal(item.$schema, 'https://ui.shadcn.com/schema/registry-item.json');
    assert.equal(item.type, 'registry:block'); assert.equal(item.meta.version, manifest.version);
    assert.equal(item.meta.language, 'ug'); assert.equal(item.meta.direction, 'rtl');
    assert.deepEqual(item.dependencies, []); assert.deepEqual(item.devDependencies, []); assert.deepEqual(item.registryDependencies, []);
    assert.ok(item.files.some(({ path }) => path === 'index.html'));
    assert.ok(item.files.some(({ path }) => path === 'server.mjs'));
    const localPackage = JSON.parse(item.files.find(({ path }) => path === 'package.json').content);
    assert.equal(localPackage.private, true); assert.equal(localPackage.dependencies, undefined);
    assert.equal(localPackage.scripts.start, 'node server.mjs');
  }
});

test('every embedded UTF-8 file has a verified hash, safe target, and no case or parent/file collisions', () => {
  for (const item of registry.items) {
    const names = item.files.map(({ path }) => path.toLowerCase());
    assert.equal(new Set(names).size, names.length);
    for (const file of item.files) {
      assert.equal(file.target, file.path); assert.equal(file.type, 'registry:file');
      assert.ok(file.path.split('/').every((part) => /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(part)));
      assert.doesNotMatch(file.path, /\\|:/); assert.equal(file.sha256, hash(file.content));
      const parts = file.path.toLowerCase().split('/');
      for (let i = 1; i < parts.length; i++) assert.ok(!names.includes(parts.slice(0, i).join('/')));
    }
  }
});

test('registry snapshots retain all current runtime JS/CSS and notices byte for byte', async () => {
  const runtime = [];
  async function walk(dir = 'src/') {
    for (const entry of await readdir(new URL(dir, root), { withFileTypes: true })) {
      if (entry.isDirectory()) await walk(`${dir}${entry.name}/`);
      else if (/\.(?:js|css|md)$/.test(entry.name) || entry.name === 'LICENSE') runtime.push(`${dir}${entry.name}`);
    }
  }
  await walk();
  const required = [...runtime, 'LICENSE', 'THIRD_PARTY_NOTICES.md'];
  assert.ok(required.includes('src/vendor/keyboard/LICENSE'));
  assert.ok(required.includes('src/vendor/text/LICENSE'));
  assert.ok(required.includes('src/vendor/README.md'));
  for (const item of registry.items) {
    const files = new Map(item.files.map((file) => [file.path, file]));
    for (const filename of required) {
      const embedded = files.get(`vendor/uyghur-ui/${filename}`);
      assert.ok(embedded, `${item.name}: includes ${filename}`);
      assert.equal(embedded.content, await read(filename), `${item.name}: fresh ${filename}`);
    }
    assert.equal(item.files.filter(({ path }) => path.startsWith('vendor/')).length, required.length);
  }
});

test('installed module/style imports resolve inside each payload and all six HTML examples are actual executable source', () => {
  for (const item of registry.items) {
    const files = new Map(item.files.map((file) => [file.path, file.content]));
    const html = files.get('index.html');
    assert.match(html, /<html lang="ug" dir="rtl">/); assert.match(html, /<body class="ug-ui">/);
    assert.ok(html.includes(applicationExamples.find(({ id }) => id === item.name).html));
    assert.doesNotMatch(html, /from ['"]@uyghurcommunity\/|<script[^>]+src="https?:/);
    assert.match(html, /from '\.\/vendor\/uyghur-ui\/src\/index\.js'/);
    const code = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
    const checked = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: code, encoding: 'utf8' });
    assert.equal(checked.status, 0, `${item.name}: ${checked.stderr}`);
    for (const [filename, content] of files) {
      if (!/\.js$/.test(filename)) continue;
      for (const [, reference] of content.matchAll(/(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g)) {
        assert.ok(reference.startsWith('.'), `${filename}: no external module ${reference}`);
        assert.ok(files.has(path.posix.normalize(path.posix.join(path.posix.dirname(filename), reference))), `${filename}: resolves ${reference}`);
      }
    }
    const styles = files.get('vendor/uyghur-ui/src/styles.css');
    for (const [, reference] of styles.matchAll(/@import\s+url\(['"]([^'"]+)['"]\)/g)) assert.ok(files.has(`vendor/uyghur-ui/src/${reference.replace(/^\.\//, '')}`));
    assert.match(files.get('vendor/uyghur-ui/src/font.css'), /font-family:"ALKATIP Basma"/);
    assert.ok(![...files.keys()].some((filename) => /\.(?:woff2?|ttf|otf)$/.test(filename)));
    const server = spawnSync(process.execPath, ['--input-type=module', '--check'], { input: files.get('server.mjs'), encoding: 'utf8' });
    assert.equal(server.status, 0, server.stderr);
  }
});
