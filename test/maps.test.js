import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { mapSVG, mapMetadata } from '@uyghurcommunity/ui/maps';
import { mapSVG as rootMapSVG, mapMetadata as rootMapMetadata } from '@uyghurcommunity/ui';

const readExport = (specifier) => readFile(new URL(import.meta.resolve(specifier)));
const sourceBytes = await readExport('@uyghurcommunity/ui/maps/source.geojson');
const source = JSON.parse(sourceBytes.toString('utf8'));
const assetMetadata = JSON.parse((await readExport('@uyghurcommunity/ui/maps/metadata.json')).toString('utf8'));
const assets = Object.fromEntries(await Promise.all(['outline', 'filled'].map(async (variant) => [
  variant, (await readExport(`@uyghurcommunity/ui/maps/east-turkistan-${variant}.svg`)).toString('utf8'),
])));
const pathOf = (svg) => {
  const paths = [...svg.matchAll(/<path\b([^>]*)\/>/g)];
  assert.equal(paths.length, 1, 'the regional map contains exactly one path');
  const geometry = paths[0][1].match(/\bd="([^"]+)"/);
  assert.ok(geometry, 'path geometry is present');
  return geometry[1];
};
const attributeOf = (markup, attribute) => markup.match(new RegExp(`\\b${attribute}="([^"]*)"`))?.[1];
const pathTagOf = (svg) => svg.match(/<path\b[^>]*\/>/)?.[0];

test('the public map entry points expose the same deterministic accessible north-up map', () => {
  assert.equal(rootMapSVG, mapSVG);
  assert.equal(rootMapMetadata, mapMetadata);
  const svg = mapSVG();
  assert.equal(svg, mapSVG({ variant: 'outline' }));
  assert.equal(svg, mapSVG({ width: undefined, variant: undefined, label: undefined, color: undefined, strokeWidth: undefined }));
  assert.equal(attributeOf(svg, 'width'), '640');
  assert.equal(attributeOf(svg, 'height'), '566.25');
  assert.equal(attributeOf(svg, 'viewBox'), '0 0 1024 906');
  assert.match(svg, /preserveAspectRatio="xMidYMid meet" focusable="false" role="img"/);
  assert.match(svg, /aria-label="شەرقىي تۈركىستان خەرىتىسى \/ East Turkistan map"/);
  assert.equal(attributeOf(pathTagOf(svg), 'fill'), 'none');
  assert.equal(attributeOf(pathTagOf(svg), 'stroke'), 'currentColor');
  assert.equal(attributeOf(pathTagOf(svg), 'stroke-width'), '4');
  assert.match(svg, /<desc>[^<]*modern administrative outline[^<]*not a reconstruction of historical boundaries[^<]*Made with Natural Earth\. Public domain\.<\/desc>/);
  assert.doesNotMatch(svg, /<script|<image|<use\b|foreignObject|href=|transform=|scale\(-1|url\(/i);
});

test('both map styles preserve geometry and aspect ratio at supported size and stroke bounds', () => {
  const baseline = pathOf(mapSVG());
  for (const variant of ['outline', 'filled']) {
    for (const [width, strokeWidth] of [[64, .5], [1024, 4], [2048, 12]]) {
      for (const color of ['currentColor', '#abc', '#559EE2', '#aB12fF']) {
        const svg = mapSVG({ variant, width, strokeWidth, color, label: 'خەرىتە' });
        const path = pathTagOf(svg);
        assert.equal(pathOf(svg), baseline, `${variant}/${width}: same full regional boundary`);
        assert.equal(Number(attributeOf(svg, 'width')), width);
        assert.equal(Number(attributeOf(svg, 'height')), width * 906 / 1024);
        assert.equal(attributeOf(path, 'fill'), variant === 'filled' ? color : 'none');
        assert.equal(attributeOf(path, 'stroke'), color);
        assert.equal(Number(attributeOf(path, 'stroke-width')), strokeWidth);
        assert.equal(attributeOf(path, 'fill-rule'), 'evenodd');
      }
    }
  }
});

test('map options reject out-of-range values and untrusted SVG/CSS interpolation without coercion', () => {
  let coerced = false;
  const untrusted = { toString() { coerced = true; throw new Error('Unexpected coercion'); } };
  for (const width of [0, 63, 2049, 640.5, NaN, Infinity, null, '640', 640n, untrusted]) {
    assert.throws(() => mapSVG({ width }), RangeError);
  }
  for (const strokeWidth of [0, .49, 12.01, NaN, Infinity, null, '4', untrusted]) {
    assert.throws(() => mapSVG({ strokeWidth }), RangeError);
  }
  for (const variant of ['', 'color', 'FILLED', null, 0, ['filled'], 'outline" onload="alert(1)', untrusted]) {
    assert.throws(() => mapSVG({ variant }), RangeError);
  }
  for (const label of [null, 1, {}, untrusted, 'x'.repeat(161)]) {
    assert.throws(() => mapSVG({ label }), TypeError);
  }
  for (const color of [null, 1, untrusted, '', 'red', '#12', '#1234', '#12345678', ' currentColor', 'CURRENTCOLOR', '#abc\n', 'url(https://example.test/a)', 'var(--paint)', 'none', '#fff" onload="alert(1)', '<script>']) {
    assert.throws(() => mapSVG({ color }), TypeError);
  }
  assert.equal(coerced, false);
});

test('accessible labels escape all markup delimiters and permit an explicitly decorative map', () => {
  const svg = mapSVG({ label: '<خەرىتە & "Map" \'>' });
  assert.equal(attributeOf(svg, 'aria-label'), '&lt;خەرىتە &amp; &quot;Map&quot; &#39;&gt;');
  assert.match(svg, /role="img"/);
  assert.doesNotMatch(svg, /<خەرىتە/);
  assert.equal(attributeOf(mapSVG({ label: 'x'.repeat(160) }), 'aria-label'), 'x'.repeat(160));
  const decorative = mapSVG({ label: '' });
  assert.match(decorative, /aria-hidden="true"/);
  assert.doesNotMatch(decorative, /aria-label=|role="img"/);
  assert.equal(pathOf(decorative), pathOf(svg));
});

test('all nested map metadata is frozen and matches the downloadable provenance record', () => {
  const verifyFrozen = (value) => {
    if (!value || typeof value !== 'object') return;
    assert.ok(Object.isFrozen(value), 'every object and array is frozen');
    Object.values(value).forEach(verifyFrozen);
  };
  verifyFrozen(mapMetadata);
  assert.deepEqual(mapMetadata, assetMetadata);
  assert.throws(() => { mapMetadata.name.en = 'changed'; }, TypeError);
  assert.throws(() => { mapMetadata.source.sourceFeature.adm1_code = 'changed'; }, TypeError);
  assert.throws(() => mapMetadata.geometry.bbox.reverse(), TypeError);
  assert.throws(() => { mapMetadata.projection.orientation = 'mirrored'; }, TypeError);
  assert.throws(() => { mapMetadata.assets.outline = 'other.svg'; }, TypeError);
});

test('the retained source is the pinned single modern admin-1 polygon, with a verified checksum', () => {
  assert.equal(source.type, 'FeatureCollection');
  assert.equal(source.features.length, 1);
  const feature = source.features[0];
  assert.equal(feature.type, 'Feature');
  assert.equal(feature.geometry.type, 'Polygon');
  assert.equal(feature.geometry.coordinates.length, 1);
  assert.deepEqual(mapMetadata.source.sourceFeature, {
    name: 'Xinjiang', adm1_code: 'CHN-1756', iso_3166_2: 'CN-XJ', ne_id: 1159312657,
  });
  for (const [key, value] of Object.entries(mapMetadata.source.sourceFeature)) {
    assert.equal(feature.properties[key], value, `original source property ${key}`);
  }
  const digest = createHash('sha256').update(sourceBytes).digest('hex');
  assert.equal(digest, 'bffad16acb24e384c0f2c431cec4710f111b54ed3b027c636b31fbe6500e2713');
  assert.equal(mapMetadata.source.extractedGeoJSONSHA256, digest);
  assert.equal(mapMetadata.source.globalGeoJSONSHA256, '22d0e3ad85eb3e27f17cabf8ba2d50e554fbc27a87796ff891d958185da62fb5');
  assert.equal(mapMetadata.source.provider, 'Natural Earth');
  assert.equal(mapMetadata.source.layerVersion, '5.1.1');
  assert.equal(mapMetadata.source.repositoryRelease, 'v5.1.2');
  assert.equal(mapMetadata.source.repositoryCommit, 'f1890d9f152c896d250a77557a5751a93d494776');
  assert.ok(mapMetadata.source.url.includes(`/blob/${mapMetadata.source.repositoryCommit}/geojson/`));
  assert.ok(mapMetadata.source.rawUrl.includes(`/${mapMetadata.source.repositoryCommit}/geojson/`));
  assert.equal(mapMetadata.source.license, 'Public domain');
  assert.equal(mapMetadata.source.licenseUrl, 'https://www.naturalearthdata.com/about/terms-of-use/');
  assert.match(mapMetadata.boundaryBasis.en, /Xinjiang admin-1 polygon \(CHN-1756 \/ CN-XJ\)/);
  assert.match(mapMetadata.boundaryBasis.en, /modern administrative outline, not a reconstruction of historical boundaries/);
  assert.match(mapMetadata.boundaryBasis.ug, /\p{Script=Arabic}/u);
});

test('every source vertex survives projection in order, with north up, east right, and no clipping', () => {
  const ring = source.features[0].geometry.coordinates[0];
  assert.equal(ring.length, 1835);
  assert.deepEqual(ring[0], ring.at(-1), 'the retained source ring is closed');
  assert.ok(ring.every((point) => point.length === 2 && point.every(Number.isFinite)));
  const bbox = [
    Math.min(...ring.map(([lon]) => lon)), Math.min(...ring.map(([, lat]) => lat)),
    Math.max(...ring.map(([lon]) => lon)), Math.max(...ring.map(([, lat]) => lat)),
  ];
  assert.deepEqual(bbox, [73.602256, 34.339961, 96.36634, 49.165837]);
  assert.deepEqual(mapMetadata.geometry.bbox, bbox);
  assert.equal(mapMetadata.geometry.polygonCount, 1);
  assert.equal(mapMetadata.geometry.ringCount, 1);
  assert.equal(mapMetadata.geometry.sourceVertexCount, 1835);
  assert.equal(mapMetadata.geometry.renderedVertexCount, 1835);
  assert.match(mapMetadata.geometry.simplification, /^None\. All source vertices/);
  assert.match(mapMetadata.geometry.coordinateReferenceSystem, /longitude, latitude/);
  assert.equal(mapMetadata.projection.name, 'Equirectangular');
  assert.equal(mapMetadata.projection.standardParallel, 42);
  assert.match(mapMetadata.projection.orientation, /North up; east right\. Never mirror/);
  const path = pathOf(mapSVG());
  const vertices = [...path.matchAll(/([ML])(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)];
  assert.equal(vertices.map((match) => match[0]).join('') + 'Z', path, 'only one closed linear ring is present');
  assert.equal(vertices.length, ring.length);
  assert.equal(vertices[0][1], 'M');
  assert.ok(vertices.slice(1).every((match) => match[1] === 'L'));
  const coordinates = vertices.map(([, , x, y]) => [Number(x), Number(y)]);
  assert.deepEqual(coordinates[0], coordinates.at(-1));
  const { width, height, padding } = mapMetadata.projection;
  const [west, south, east, north] = bbox;
  const longitudeScale = (width - 2 * padding) / (east - west);
  const latitudeScale = longitudeScale / Math.cos(42 * Math.PI / 180);
  for (let i = 0; i < ring.length; i++) {
    const [lon, lat] = ring[i], [x, y] = coordinates[i];
    const expectedX = padding + (lon - west) * longitudeScale;
    const expectedY = height / 2 + ((north + south) / 2 - lat) * latitudeScale;
    assert.ok(Math.abs(x - expectedX) <= .005001, `vertex ${i}: retained east-right longitude`);
    assert.ok(Math.abs(y - expectedY) <= .005001, `vertex ${i}: retained north-up latitude`);
    assert.ok(x >= padding - .005001 && x <= width - padding + .005001, `vertex ${i}: horizontal padding`);
    assert.ok(y >= padding - .005001 && y <= height - padding + .005001, `vertex ${i}: vertical padding`);
  }
  const northIndex = ring.findIndex(([, lat]) => lat === north);
  const southIndex = ring.findIndex(([, lat]) => lat === south);
  const westIndex = ring.findIndex(([lon]) => lon === west);
  const eastIndex = ring.findIndex(([lon]) => lon === east);
  assert.ok(coordinates[northIndex][1] < coordinates[southIndex][1]);
  assert.ok(coordinates[westIndex][0] < coordinates[eastIndex][0]);
});

test('both downloadable assets and the runtime API share the complete map geometry and provenance', () => {
  const runtimePath = pathOf(mapSVG());
  for (const [variant, svg] of Object.entries(assets)) {
    assert.equal(pathOf(svg), runtimePath, `${variant}: same unsimplified boundary`);
    assert.equal(attributeOf(svg, 'viewBox'), mapMetadata.projection.viewBox);
    assert.equal(Number(attributeOf(svg, 'width')), mapMetadata.projection.width);
    assert.equal(Number(attributeOf(svg, 'height')), mapMetadata.projection.height);
    assert.equal(attributeOf(pathTagOf(svg), 'fill'), variant === 'filled' ? '#559EE2' : 'none');
    assert.equal(attributeOf(pathTagOf(svg), 'stroke'), '#17364b');
    assert.equal(attributeOf(pathTagOf(svg), 'fill-rule'), 'evenodd');
    assert.match(svg, /<title>[^<]*East Turkistan/);
    assert.match(svg, /<desc>[^<]*modern administrative outline[^<]*Made with Natural Earth\. Public domain\.<\/desc>/);
    assert.doesNotMatch(svg, /<script|<image|<use\b|foreignObject|href=|transform=|url\(/i);
    assert.equal(mapMetadata.assets[variant], `east-turkistan-${variant}.svg`);
  }
});
