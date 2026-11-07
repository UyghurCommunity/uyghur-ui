import test from 'node:test';
import assert from 'node:assert/strict';
import { iconCatalog, iconCategories, iconNames, findIcons, iconSVG } from '../src/index.js';

test('bilingual catalog covers every public icon and cannot be mutated by consumers', () => {
  assert.equal(iconNames.length, 110);
  assert.deepEqual(iconCatalog.map((entry) => entry.name).sort(), [...iconNames]);
  for (const entry of iconCatalog) {
    assert.match(entry.ug, /\p{Script=Arabic}/u); assert.ok(entry.en.length);
    assert.ok(iconCategories.some((group) => group.id === entry.category));
    assert.ok(Object.isFrozen(entry)); assert.ok(Object.isFrozen(entry.keywords));
  }
  assert.throws(() => { iconCatalog[0].ug = 'changed'; }, TypeError);
  assert.throws(() => iconCatalog[0].keywords.push('changed'), TypeError);
});
test('traditional collection keeps all interface icons available through disjoint categories', () => {
  const traditional = findIcons('', { category: 'traditional' }), general = findIcons('', { category: 'general' });
  assert.equal(traditional.length, 63); assert.equal(general.length, 47);
  assert.deepEqual([...traditional, ...general].sort(), [...iconNames]);
  assert.ok(traditional.includes('doppa')); assert.ok(general.includes('search'));
  assert.equal(findIcons('', { category: 'music' }).length, 7);
  assert.equal(findIcons('', { category: 'textiles' }).length, 9);
  assert.equal(findIcons('', { category: 'architecture' }).length, 12);
  assert.equal(findIcons('', { category: 'table' }).length, 10);
  assert.equal(findIcons('', { category: 'garden' }).length, 6);
  assert.equal(findIcons('', { category: 'clothing' }).length, 8);
  assert.equal(findIcons('', { category: 'crafts' }).length, 3);
  assert.equal(findIcons('', { category: 'motifs' }).length, 8);
});
test('Uyghur labels, variant spellings and English aliases find the same real icon', () => {
  for (const query of ['راۋاپ', 'راۋاب', 'RAWAB', '  rawap  ']) assert.deepEqual(findIcons(query), ['rawap']);
  for (const query of ['ئەتلەس', 'ikat', 'atlas silk']) assert.deepEqual(findIcons(query), ['atlas']);
  assert.deepEqual(findIcons('تەمبۇر'), ['tambur']); assert.deepEqual(findIcons('غىجەك'), ['ghijek']);
  assert.deepEqual(findIcons('two-string'), ['dutar']);
  assert.deepEqual(findIcons('دۇتار'.replace('د', '\uFEA9')), ['dutar']);
});
test('category and token search combine without changing names, labels or caller data', () => {
  const snapshot = JSON.stringify(iconCatalog);
  assert.deepEqual(findIcons('rawab', { category: 'table' }), []);
  assert.deepEqual(findIcons('tea bowl', { category: 'table' }), ['tea-bowl']);
  assert.deepEqual(findIcons('search', { category: 'traditional' }), []);
  assert.deepEqual(findIcons('no such motif'), []);
  const results = findIcons(); results.pop(); assert.equal(findIcons().length, 110);
  assert.equal(JSON.stringify(iconCatalog), snapshot);
});
test('search rejects invalid categories and types and treats markup as plain query text', () => {
  assert.throws(() => findIcons(null), TypeError);
  assert.throws(() => findIcons('', { category: 'constructor' }), RangeError);
  assert.deepEqual(findIcons('<svg onload=alert(1)>'), []);
});
test('new cultural icons render original distinct safe geometry and escaped accessible names', () => {
  const names = findIcons('', { category: 'traditional' }).filter((name) => !['almond', 'flower', 'doppa'].includes(name));
  const drawings = names.map((name) => iconSVG(name)); assert.equal(names.length, 60);
  assert.equal(new Set(drawings).size, names.length);
  for (const name of names) {
    const svg = iconSVG(name, { size: 48, label: '<مەدەنىيەت>' });
    assert.match(svg, /viewBox="0 0 24 24"/); assert.match(svg, /aria-label="&lt;مەدەنىيەت&gt;"/);
    assert.doesNotMatch(svg, /<script|<image|foreignObject|onload=|href=|url\(|<text|<animate/i);
  }
});
