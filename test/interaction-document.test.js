import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
import { standaloneDocument } from '../docs/interaction-document.js';
import { interactionBindings } from '../docs/interaction-controls.js';
import { interactionExamples } from '../docs/interactions-data.js';
import { renderInteractionsPage } from '../docs/interactions-page.js';
import { MAP_PATH, MAP_VIEWBOX } from '../src/map-data.js';

const css = await readFile(new URL('../docs/interaction-demo.css', import.meta.url), 'utf8');
const fontBase = 'https://db.onlinewebfonts.com/t/3c16518f40da2fc2901f37666c0556a7';
const examples = new Map(interactionExamples.map(example => [example.id, example]));
const text = markup => markup.replace(/<[^>]*>/g, '').trim();
const attrs = markup => Object.fromEntries([...markup.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value]));

function moduleSource(html) {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  assert.equal(scripts.length, 1, 'a portable example has exactly one embedded controller module');
  assert.equal(attrs(scripts[0][1]).type, 'module');
  assert.ok(!Object.hasOwn(attrs(scripts[0][1]), 'src'));
  return scripts[0][2];
}

for (const example of interactionExamples) {
  test(`${example.id}: copied HTML contains the real controller, styles and usable native controls`, () => {
    const mount = interactionBindings[example.id];
    const html = standaloneDocument(example, css, mount);
    assert.match(html, /^<!doctype html>\s*<html lang="ug" dir="rtl">/);
    assert.ok(html.includes(`<h1>${example.title}</h1>`));
    assert.ok(html.includes(example.description));
    assert.ok(html.includes(example.hint));
    assert.ok(html.includes(css), 'the actual complete demo stylesheet is embedded');
    assert.ok(html.includes(`data-interaction="${example.id}"`));
    const source = moduleSource(html);
    assert.ok(source.includes(`const mount = ${mount.toString()};`), 'download uses the tested controller rather than a placeholder');
    assert.doesNotThrow(() => new Script(source, { filename: `portable-${example.id}.js` }));
    assert.doesNotMatch(source, /\b(?:import|export)\s|\b(?:fetch|XMLHttpRequest|WebSocket|EventSource)\b|sendBeacon\s*\(/);
    assert.doesNotMatch(html, /<iframe\b|<script\b[^>]*\bsrc=|<link\b[^>]*\brel="stylesheet"|@uyghurcommunity\/ui/);
    assert.doesNotMatch(html, /\bsrc="(?:\.\.?\/|assets\/|https?:)/, 'icons and maps do not need a runtime asset request');
    assert.match(html, /id="pause"[^>]*aria-pressed="false"/);
    assert.match(source, /prefers-reduced-motion: reduce/);
    assert.match(source, /visibilitychange/);
    assert.match(source, /binding\.destroy\(\)/);
    assert.match(html, /data-demo-status[^>]*role="status"[^>]*aria-live="polite"/);

    const buttons = [...html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)];
    assert.ok(buttons.length > 0);
    for (const [, attributes, content] of buttons) {
      const values = attrs(attributes);
      assert.equal(values.type, 'button', 'demos cannot accidentally submit a consumer form');
      assert.ok(values['aria-label'] || text(content), 'every native button has a name');
    }
    for (const [input] of html.matchAll(/<input\b[^>]*>/g)) {
      const values = attrs(input);
      assert.equal(values.type, 'range');
      assert.equal(values.dir, 'ltr');
      const label = [...html.matchAll(/<label\b[^>]*>([\s\S]*?)<\/label>/g)].find(([, content]) => content.includes(input));
      assert.ok(label && text(label[1]), 'range controls retain a visible associated label');
      assert.ok(Number(values.min) <= Number(values.value) && Number(values.value) <= Number(values.max));
    }
  });
}

test('portable examples retain the supplied font files and complete joined Uyghur text', () => {
  for (const example of interactionExamples) {
    const html = standaloneDocument(example, css, interactionBindings[example.id]);
    const face = html.match(/@font-face\s*\{([^}]*)\}/)?.[1];
    assert.ok(face, 'font face accompanies copied CSS');
    assert.match(face, /font-family:\s*"ALKATIP Basma"/);
    assert.match(face, /font-display:\s*swap/);
    for (const suffix of ['woff2', 'woff', 'ttf']) assert.ok(face.includes(`${fontBase}.${suffix}`));
    assert.ok(html.includes(`<h1>${example.title}</h1>`), 'headings remain whole joined text nodes');
    assert.doesNotMatch(moduleSource(html), /\.split\(\s*(?:""|'')\s*\)|\bSplitText\b/);
    assert.doesNotMatch(html, /(?:<span\b[^>]*>\p{Script=Arabic}<\/span>\s*){2}/u);
  }
});

test('comparison downloads embed both complete map geometries with the same north-up viewBox', () => {
  const html = standaloneDocument(examples.get('compare'), css, interactionBindings.compare);
  const images = [...html.matchAll(/<img\b[^>]*\bsrc="(data:image\/svg\+xml,[^"]+)"[^>]*>/g)];
  assert.equal(images.length, 2);
  const svgs = images.map(([, source]) => decodeURIComponent(source.slice('data:image/svg+xml,'.length)));
  for (const svg of svgs) {
    assert.equal(svg.match(/\bviewBox="([^"]+)"/)?.[1], MAP_VIEWBOX);
    assert.equal(svg.match(/<path\b[^>]*\bd="([^"]+)"/)?.[1], MAP_PATH);
    assert.equal((MAP_PATH.match(/[ML]/g) || []).length, 1835);
    assert.doesNotMatch(svg, /\btransform=|scaleX\s*\(\s*-1|<script\b|\b(?:href|src)=/);
    assert.match(svg, /Made with Natural Earth/);
  }
  assert.match(svgs[0], /fill="none"/);
  assert.match(svgs[1], /fill="#559EE2"/);
  assert.match(html, /N ↑/);
  assert.match(css, /\.ugx-compare-scene\{[^}]*direction:ltr/);
  assert.match(css, /\.ugx-map-layer img\{[^}]*transform:none/);
  assert.doesNotMatch(html, /src="assets\/maps\//);
});

test('portable document rejects invalid identities, required text fields and source argument types', () => {
  const example = examples.get('spotlight');
  const badExamples = [null, undefined, {}, [],
    { ...example, id: 'unknown' }, { ...example, id: '../spotlight' },
    { ...example, id: 'spotlight" onmouseover="alert(1)' },
    ...['html', 'title', 'description', 'hint'].flatMap(field => [
      { ...example, [field]: null }, { ...example, [field]: 42 },
    ]),
  ];
  for (const value of badExamples) assert.throws(() => standaloneDocument(value, css, interactionBindings.spotlight), TypeError);
  for (const value of [null, undefined, 42, {}, []]) assert.throws(() => standaloneDocument(example, value, interactionBindings.spotlight), TypeError);
  for (const value of [null, undefined, 'function () {}', {}, []]) assert.throws(() => standaloneDocument(example, css, value), TypeError);
});

test('portable title/text and embedded source cannot terminate their containing HTML elements', () => {
  const payload = '</title><img src=x onerror=alert(1)><script>wrong()</script>';
  const example = { ...examples.get('spotlight'), title: payload, description: payload, hint: payload };
  const html = standaloneDocument(example, css + '\n/* </style><img src=x onerror=alert(1)> */', function sourceProbe() {
    const literal = '</script><img src=x onerror=alert(1)>';
    return { syncMotion() { return literal; }, destroy() {} };
  });
  assert.ok(!html.includes(`<h1>${payload}</h1>`));
  assert.ok(html.includes('&lt;/title&gt;&lt;img src=x onerror=alert(1)&gt;'));
  assert.equal((html.match(/<\/style\s*>/gi) || []).length, 1);
  assert.equal((html.match(/<\/script\s*>/gi) || []).length, 1);
  assert.ok(html.includes('<\\/style><img'));
  assert.ok(moduleSource(html).includes('<\\/script><img'));
  assert.doesNotThrow(() => new Script(moduleSource(html), { filename: 'portable-escaped-source.js' }));
});

test('published interactions HTML matches its renderer and provides six real previews and code actions', async () => {
  const actual = await readFile(new URL('../interactions.html', import.meta.url), 'utf8');
  const normalizeMarkers = html => html.replace(/(<!-- DOCS:(HEADER|SIDEBAR|DIALOGS) START -->)\s*([\s\S]*?)\s*(<!-- DOCS:\2 END -->)/g, (_, start, name, content, end) => start + content.trim() + end);
  assert.equal(normalizeMarkers(actual), normalizeMarkers(renderInteractionsPage()));
  const cards = [...actual.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)];
  assert.equal(cards.length, 6);
  for (const example of interactionExamples) {
    const card = cards.find(([, attributes]) => attrs(attributes).id === `interaction-${example.id}`);
    assert.ok(card, `real static card for ${example.id}`);
    assert.ok(card[2].includes(example.html), 'static controls and cultural artwork are readable without runtime rendering');
    for (const attribute of ['data-code', 'data-copy-example', 'data-download-example', 'data-example-source', 'data-example-status']) {
      assert.ok(card[2].includes(`${attribute}="${example.id}"`), `${example.id}: ${attribute}`);
    }
    assert.match(card[2], /data-example-status[^>]*role="status"[^>]*aria-live="polite"/);
  }
  const send = cards.find(([, attributes]) => attrs(attributes).id === 'interaction-send')[2];
  assert.ok(send.includes('يەرلىك سىناق. ھېچقانداق ئۇچۇر ئەۋەتىلمەيدۇ.'));
  assert.ok(send.includes(examples.get('send').hint));
  assert.match(actual, /<script type="module" src="docs\/interactions\.js"><\/script>/);
  assert.doesNotMatch(actual, /<iframe\b/);
});
