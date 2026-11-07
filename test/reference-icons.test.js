import test from 'node:test';
import assert from 'node:assert/strict';
import { iconSVG, iconNames, coloredIconNames, iconCatalog, iconCategories, findIcons } from '../src/index.js';

const referenceNames = [
  'fur-hat', 'womens-headdress', 'mens-coat', 'womens-dress', 'chapan', 'sash', 'boots', 'traditional-shoes',
  'ceramic-vase', 'jewelry', 'doppa-top', 'uyghur-medallion', 'floral-rosette', 'ornamental-border',
  'calligraphy', 'star-eight', 'crescent', 'tree-of-life', 'unity', 'dove',
  'surnai', 'mosque', 'mausoleum', 'minaret', 'madrasa', 'traditional-house', 'yurt', 'city-gate',
  'ancient-ruins', 'landscape', 'tea-set', 'cotton', 'melon', 'horse', 'camel', 'nan-stack',
];
const referencePalette = new Set(['none', 'currentColor', '#17364b', '#bc8d43', '#3f7d6a', '#b54c3b', '#f4e4c8']);
const geometryElements = new Set(['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon', 'g']);
const geometryAttributes = new Set([
  'd', 'cx', 'cy', 'r', 'rx', 'ry', 'x', 'y', 'width', 'height', 'x1', 'y1', 'x2', 'y2', 'points',
  'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin',
]);
const fragmentOf = (svg) => svg.replace(/^<svg\b[^>]*>/, '').replace(/<\/svg>$/, '');

// A deliberately narrow SVG grammar checks our fixed shape fragments without a DOM or external parser.
// It rejects text, malformed attributes, mismatched groups, URL paints and active SVG elements.
function checkGeometry(fragment, name, { palette } = {}) {
  const tags = fragment.match(/<[^>]+>/g) ?? [];
  assert.ok(tags.length, `${name}: contains geometry`);
  assert.equal(tags.join(''), fragment, `${name}: no text or unparsed markup`);
  const stack = [];
  for (const token of tags) {
    const tag = token.match(/^<(\/?)([a-z]+)([\s\S]*?)(\/?)>$/);
    assert.ok(tag, `${name}: well-formed tag`);
    const [, closing, element, attributes, selfClosing] = tag;
    assert.ok(geometryElements.has(element), `${name}: allowed element ${element}`);
    if (closing) {
      assert.equal(attributes, '', `${name}: closing tag has no attributes`);
      assert.equal(selfClosing, '', `${name}: closing tag is not self-closing`);
      assert.equal(stack.pop(), element, `${name}: balanced elements`);
      continue;
    }
    const entries = [...attributes.matchAll(/\s+([a-z][a-z0-9-]*)="([^"]*)"/g)];
    assert.equal(entries.map((entry) => entry[0]).join(''), attributes, `${name}: quoted attributes only`);
    const seen = new Set();
    for (const [, attribute, value] of entries) {
      assert.ok(geometryAttributes.has(attribute), `${name}: allowed attribute ${attribute}`);
      assert.ok(!seen.has(attribute), `${name}: no duplicate attributes`);
      seen.add(attribute);
      assert.doesNotMatch(value, /[<>&]|url\s*\(|(?:https?|data|javascript):/i, `${name}: inert attribute value`);
      if (attribute === 'fill' || attribute === 'stroke') {
        assert.match(value, /^(?:none|currentColor|#[0-9a-f]{6})$/, `${name}: fixed color value`);
        if (palette) assert.ok(palette.has(value), `${name}: reference palette`);
      }
    }
    if (!selfClosing) {
      assert.equal(element, 'g', `${name}: shapes are self-closing`);
      stack.push(element);
    }
  }
  assert.deepEqual(stack, [], `${name}: all groups closed`);
}

test('all 36 reference motifs are public, searchable, and have distinct geometry in both variants', () => {
  assert.equal(referenceNames.length, 36);
  assert.equal(new Set(referenceNames).size, 36);
  assert.equal(iconNames.length, 110);
  assert.equal(new Set(iconNames).size, 110);
  for (const name of referenceNames) {
    assert.ok(iconNames.includes(name), `${name}: public name`);
    assert.ok(coloredIconNames.includes(name), `${name}: color variant`);
    assert.ok(findIcons(name).includes(name), `${name}: discoverable by name`);
  }
  for (const variant of ['outline', 'color']) {
    const fragments = referenceNames.map((name) => fragmentOf(iconSVG(name, { variant })));
    assert.equal(new Set(fragments).size, 36, `${variant}: every new drawing is distinct`);
    for (let i = 0; i < fragments.length; i++) {
      checkGeometry(fragments[i], referenceNames[i], variant === 'color' ? { palette: referencePalette } : {});
    }
  }
});

test('all 63 cultural color variants have real fill data and safely escaped accessible names', () => {
  assert.equal(coloredIconNames.length, 63);
  assert.equal(new Set(coloredIconNames).size, 63);
  assert.deepEqual([...coloredIconNames], findIcons('', { category: 'traditional' }).sort());
  const label = "<مىراس & \"SVG\" '>";
  for (const name of coloredIconNames) {
    const svg = iconSVG(name, { variant: 'color', size: 64, strokeWidth: 1.25, label });
    assert.match(svg, /width="64" height="64" viewBox="0 0 24 24"/);
    assert.match(svg, /stroke="#17364b" stroke-width="1.25"/);
    assert.ok(svg.includes('role="img" aria-label="&lt;مىراس &amp; &quot;SVG&quot; &#39;&gt;"'));
    assert.doesNotMatch(svg, /aria-hidden="true"/);
    const fragment = fragmentOf(svg);
    assert.match(fragment, /fill="#[0-9a-f]{6}"/, `${name}: actual colored shape`);
    checkGeometry(fragment, name);
    assert.notEqual(fragment, fragmentOf(iconSVG(name)), `${name}: color changes the geometry markup`);
  }
});

test('general icons preserve outline markup when a caller requests a color fallback', () => {
  const general = findIcons('', { category: 'general' });
  assert.equal(general.length, 47);
  for (const name of general) {
    const options = { size: 48, strokeWidth: 2, label: 'كۆرۈنمە يۈز' };
    assert.ok(!coloredIconNames.includes(name));
    assert.equal(iconSVG(name, { ...options, variant: 'color' }), iconSVG(name, { ...options, variant: 'outline' }), name);
    assert.match(iconSVG(name, { variant: 'color' }), /stroke="currentColor"/);
  }
});

test('the existing default rendering stays identical to an explicit outline request', () => {
  for (const name of iconNames) {
    assert.equal(iconSVG(name), iconSVG(name, { variant: 'outline' }), name);
    assert.equal(iconSVG(name, { size: 96, strokeWidth: 1, label: 'مىراس' }), iconSVG(name, { size: 96, strokeWidth: 1, label: 'مىراس', variant: 'outline' }), name);
  }
  assert.match(iconSVG('search'), /stroke="currentColor"/);
  assert.match(iconSVG('search'), /aria-hidden="true"/);
});

test('invalid variants are rejected without string coercion or SVG interpolation', () => {
  let coerced = false;
  const untrusted = { toString() { coerced = true; throw new Error('Unexpected coercion'); } };
  for (const variant of ['', 'filled', 'COLOR', 'outline" onload="alert(1)', null, 0, ['color'], untrusted]) {
    assert.throws(() => iconSVG('doppa', { variant }), RangeError);
  }
  assert.equal(coerced, false);
  assert.equal(iconSVG('doppa', { variant: undefined }), iconSVG('doppa'));
});

test('catalog variant lists and public collections remain immutable and describe actual availability', () => {
  assert.ok(Object.isFrozen(iconCatalog));
  assert.ok(Object.isFrozen(iconNames));
  assert.ok(Object.isFrozen(coloredIconNames));
  for (const entry of iconCatalog) {
    assert.ok(Object.isFrozen(entry), entry.name);
    assert.ok(Object.isFrozen(entry.keywords), entry.name);
    assert.ok(Object.isFrozen(entry.variants), entry.name);
    assert.deepEqual(entry.variants, coloredIconNames.includes(entry.name) ? ['outline', 'color'] : ['outline']);
    assert.throws(() => entry.variants.push('changed'), TypeError);
  }
  assert.throws(() => { iconCatalog[0].variants = []; }, TypeError);
  assert.throws(() => coloredIconNames.pop(), TypeError);
});

test('the clothing, crafts, and motifs categories expose bilingual reference collections', () => {
  for (const id of ['clothing', 'crafts', 'motifs']) {
    const category = iconCategories.find((entry) => entry.id === id);
    assert.ok(category, id);
    assert.match(category.ug, /\p{Script=Arabic}/u);
    assert.ok(category.en.length);
    const names = findIcons('', { category: id });
    assert.ok(names.length, id);
    assert.ok(names.every((name) => referenceNames.includes(name)), `${id}: contains reference collection`);
  }
  assert.ok(findIcons('veil', { category: 'clothing' }).includes('womens-headdress'));
  assert.ok(findIcons('reed pen', { category: 'crafts' }).includes('calligraphy'));
  assert.ok(findIcons('olive branch', { category: 'motifs' }).includes('dove'));
});

test('the round frame drum is Dap, while Tambur retains its distinct long-necked lute outline', () => {
  const dap = iconSVG('dap'), tambur = iconSVG('tambur');
  assert.match(dap, /<circle cx="12" cy="12" r="8\.5"/);
  assert.doesNotMatch(tambur, /<circle\b/);
  assert.notEqual(fragmentOf(dap), fragmentOf(tambur));
  assert.deepEqual(findIcons('frame drum'), ['dap']);
  assert.deepEqual(findIcons('tambur'), ['tambur']);
});
