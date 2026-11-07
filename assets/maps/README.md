# East Turkistan map assets

- `east-turkistan-outline.svg`: transparent outline, navy stroke.
- `east-turkistan-filled.svg`: sky-blue fill, navy stroke.
- `east-turkistan.source.geojson`: the original extracted feature, with its original properties and all coordinates.
- `east-turkistan.metadata.json`: source, checksums, projection, extent, and boundary basis.

The map is named **East Turkistan / شەرقىي تۈركىستان** for this collection. Its geometry is the **Xinjiang admin-1 polygon (`CHN-1756`, `CN-XJ`)** in Natural Earth’s 1:10,000,000 Admin 1 – States, Provinces layer, version **5.1.1**, retrieved from the pinned Natural Earth repository release **v5.1.2**, commit `f1890d9f152c896d250a77557a5751a93d494776`. This is a documented modern administrative outline; it is not a reconstruction of historical boundaries.

Sources:

- [Dataset description and layer version](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/)
- [Pinned source GeoJSON](https://github.com/nvkelso/natural-earth-vector/blob/f1890d9f152c896d250a77557a5751a93d494776/geojson/ne_10m_admin_1_states_provinces.geojson)
- [Layer version file](https://github.com/nvkelso/natural-earth-vector/blob/f1890d9f152c896d250a77557a5751a93d494776/10m_cultural/ne_10m_admin_1_states_provinces.VERSION.txt)
- [Natural Earth terms: public domain](https://www.naturalearthdata.com/about/terms-of-use/)

**Made with Natural Earth.** All source map data is public domain. The project’s MIT license applies to its code; it does not impose a new license on Natural Earth’s map data.

Both SVG variants use the same `0 0 1024 906` viewBox and an equirectangular projection with a standard parallel of 42°N. They preserve all 1,835 source vertices (one polygon, one ring); no simplification or geographic clipping was applied. Projected coordinates are rounded to 0.01 SVG unit. Coordinates remain north up and east right, including within right-to-left pages. Do not mirror these maps with CSS transforms.

Rebuild these assets and `src/map-data.js` offline:

```sh
node scripts/build-map.mjs
```

The standalone SVGs contain accessible Uyghur and English titles/descriptions, no visible text, and no external references, scripts, or font dependencies.
