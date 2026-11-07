import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

// Rebuild offline from the unmodified feature extracted from the pinned release.
// The full global dataset is intentionally not needed by package consumers or CI.
const root = new URL('../', import.meta.url);
const sourcePath = 'assets/maps/east-turkistan.source.geojson';
const sourceBytes = await readFile(new URL(sourcePath, root));
const source = JSON.parse(sourceBytes.toString('utf8'));
if (source.type !== 'FeatureCollection' || source.features.length !== 1) {
  throw new Error('Expected exactly one source feature.');
}
const feature = source.features[0];
if (feature.properties.adm1_code !== 'CHN-1756' || feature.properties.iso_3166_2 !== 'CN-XJ') {
  throw new Error('Unexpected Natural Earth region.');
}
const { type, coordinates } = feature.geometry;
if (type !== 'Polygon' && type !== 'MultiPolygon') throw new Error('Expected a polygon geometry.');
const polygons = type === 'Polygon' ? [coordinates] : coordinates;
const rings = polygons.flat();
const points = rings.flat();
if (!points.every(point => point.length === 2 && point.every(Number.isFinite))) {
  throw new Error('The source contains invalid coordinates.');
}
for (const ring of rings) {
  if (ring.length < 4 || ring[0][0] !== ring.at(-1)[0] || ring[0][1] !== ring.at(-1)[1]) {
    throw new Error('The source contains an unclosed ring.');
  }
}
const longitude = points.map(point => point[0]);
const latitude = points.map(point => point[1]);
const bbox = [Math.min(...longitude), Math.min(...latitude), Math.max(...longitude), Math.max(...latitude)];
if (bbox[0] < 73 || bbox[1] < 34 || bbox[2] > 97 || bbox[3] > 50) {
  throw new Error('The region exceeds the expected geographic extent.');
}

// Equirectangular projection: standard parallel 42°N. Latitude always decreases
// down the page and longitude increases rightward, independently of page RTL.
const standardParallel = 42;
const cosine = Math.cos(standardParallel * Math.PI / 180);
const width = 1024;
const padding = 32;
const scale = (width - padding * 2) / ((bbox[2] - bbox[0]) * cosine);
const contentHeight = (bbox[3] - bbox[1]) * scale;
const height = Math.ceil(contentHeight + padding * 2);
const top = (height - contentHeight) / 2;
const project = ([lon, lat]) => [
  padding + (lon - bbox[0]) * cosine * scale,
  top + (bbox[3] - lat) * scale,
];
const format = value => Number(value.toFixed(2)).toString();
const path = rings.map(ring => ring.map((point, index) => {
  const projected = project(point);
  return `${index === 0 ? 'M' : 'L'}${format(projected[0])} ${format(projected[1])}`;
}).join('') + 'Z').join('');
const viewBox = `0 0 ${width} ${height}`;
const boundaryBasis = {
  en: 'Natural Earth’s Xinjiang admin-1 polygon (CHN-1756 / CN-XJ), layer 5.1.1. This is the dataset’s modern administrative outline, not a reconstruction of historical boundaries.',
  ug: 'Natural Earth نىڭ شىنجاڭ مەمۇرىي رايون پولىگونى (CHN-1756 / CN-XJ)، 5.1.1 نەشرى. بۇ سانلىق مەلۇماتتىكى ھازىرقى مەمۇرىي سىزىق؛ تارىخىي چېگرالارنى قايتا قۇرۇش ئەمەس.',
};
const metadata = {
  id: 'east-turkistan',
  name: { ug: 'شەرقىي تۈركىستان', en: 'East Turkistan' },
  source: {
    provider: 'Natural Earth',
    dataset: '10m Admin 1 – States, Provinces',
    scale: '1:10,000,000',
    layerVersion: '5.1.1',
    repositoryRelease: 'v5.1.2',
    repositoryCommit: 'f1890d9f152c896d250a77557a5751a93d494776',
    url: 'https://github.com/nvkelso/natural-earth-vector/blob/f1890d9f152c896d250a77557a5751a93d494776/geojson/ne_10m_admin_1_states_provinces.geojson',
    rawUrl: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/f1890d9f152c896d250a77557a5751a93d494776/geojson/ne_10m_admin_1_states_provinces.geojson',
    datasetPage: 'https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/',
    license: 'Public domain',
    licenseUrl: 'https://www.naturalearthdata.com/about/terms-of-use/',
    credit: 'Made with Natural Earth.',
    sourceFeature: { name: 'Xinjiang', adm1_code: 'CHN-1756', iso_3166_2: 'CN-XJ', ne_id: 1159312657 },
    globalGeoJSONSHA256: '22d0e3ad85eb3e27f17cabf8ba2d50e554fbc27a87796ff891d958185da62fb5',
    extractedGeoJSONSHA256: createHash('sha256').update(sourceBytes).digest('hex'),
    extractedGeoJSON: 'east-turkistan.source.geojson',
    accessed: '2026-11-07',
  },
  boundaryBasis,
  geometry: {
    type,
    coordinateReferenceSystem: 'OGC:CRS84 (WGS 84 longitude, latitude)',
    bbox,
    polygonCount: polygons.length,
    ringCount: rings.length,
    sourceVertexCount: points.length,
    renderedVertexCount: points.length,
    simplification: 'None. All source vertices, rings and polygon components retained. Projected SVG coordinates rounded to 0.01 viewBox unit (maximum coordinate rounding error 0.005 unit per axis).',
  },
  projection: {
    name: 'Equirectangular',
    standardParallel,
    units: 'degrees, then uniformly scaled to the SVG viewBox',
    orientation: 'North up; east right. Never mirror for right-to-left layouts.',
    viewBox,
    width,
    height,
    padding,
  },
  assets: {
    outline: 'east-turkistan-outline.svg',
    filled: 'east-turkistan-filled.svg',
  },
};
const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
})[character]);
const svg = variant => {
  const label = `شەرقىي تۈركىستان خەرىتىسى / East Turkistan — ${variant}`;
  const fill = variant === 'filled' ? '#559EE2' : 'none';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${escape(label)}" style="max-width:100%;height:auto"><title>${escape(label)}</title><desc>${escape(boundaryBasis.ug)} ${escape(boundaryBasis.en)} Made with Natural Earth. Public domain.</desc><path d="${path}" fill="${fill}" fill-rule="evenodd" stroke="#17364b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/></svg>\n`;
};
await writeFile(new URL('assets/maps/east-turkistan-outline.svg', root), svg('outline'));
await writeFile(new URL('assets/maps/east-turkistan-filled.svg', root), svg('filled'));
await writeFile(new URL('assets/maps/east-turkistan.metadata.json', root), JSON.stringify(metadata, null, 2) + '\n');
await writeFile(new URL('src/map-data.js', root),
  `// Generated by scripts/build-map.mjs from public-domain Natural Earth data.\n` +
  `// All source vertices retained; see assets/maps/east-turkistan.metadata.json.\n` +
  `export const MAP_VIEWBOX = ${JSON.stringify(viewBox)};\n` +
  `export const MAP_PATH = ${JSON.stringify(path)};\n` +
  `export const mapMetadata = Object.freeze(${JSON.stringify(metadata, null, 2)});\n`);
console.log(`Built two East Turkistan map SVGs: ${points.length} vertices, ${polygons.length} polygon, ${rings.length} ring, ${viewBox}.`);
