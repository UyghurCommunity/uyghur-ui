# Assets and references

The UI code and original 24×24 outline and color icon drawings are MIT licensed by UyghurCommunity. Version 0.3.0 contains 110 outline icons and 63 cultural color variants. Cultural motifs are original geometric interpretations, not reconstructions of particular museum objects.

The cultural collection uses factual visual references to distinguish instrument silhouettes and cultural forms. The SVG paths are newly drawn; reference photographs, collection illustrations and historic patterns are not redistributed:

- [Wende Museum: instruments from the Ian Price collection](https://wendemuseum.org/traditional-central-asian-musical-instruments-from-the-collection-of-ian-price/) — dutar, tambur, rawap, ghijek, satar and dap shapes.
- [National Music Museum: rawap](https://emuseum.nmmusd.org/objects/12426/34size-rawap) — bowl body and curved shoulders.
- [UNESCO: Uyghur Muqam](https://ich.unesco.org/en/RL/uyghur-muqam-of-xinjiang-00109) — cultural context for varied bowed and plucked instruments.
- [Yale eHRAF: Uyghur summary](https://ehrafworldcultures.yale.edu/cultures/ai04/summary) — craft and etles silk context.

Two owner-supplied reference boards—an outline cultural-object sheet and the illustrated “Uyghur Culture Icons” sheet—guided the added clothing, craft, architectural, landscape and ornament themes. The project provides newly drawn SVG interpretations; neither reference image, its decorative frames nor its illustrations is redistributed. The illustrated board labels a circular frame drum “Tambur”; the collection uses **Dap / داپ** for the frame drum and retains **Tambur / تەمبۈر** as a separate long-necked instrument, following the instrument references above.

Labels and aliases help people find the drawings; they are not a normative dictionary or catalog of regional variants. Food, garden and architectural objects can also be found in neighboring cultures.

The East Turkistan flag geometry is adapted from [Kokbayraq flag.svg](https://commons.wikimedia.org/wiki/File:Kokbayraq_flag.svg), current geometry by Wikimedia Commons contributor Colohisto (16 June 2024), following earlier contributors. Commons marks this simple geometric flag as public domain. Its blue field and white crescent/star are retained without mirroring in RTL layouts. The asset is a flag rendering, not an endorsement by or affiliation with a government or organization.

The East Turkistan map outline and filled assets use the **Xinjiang admin-1 feature (`CHN-1756`, `CN-XJ`, `ne_id: 1159312657`)** from [Natural Earth 1:10,000,000 Admin 1 – States, Provinces](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/). The layer is version **5.1.1**, obtained from repository release **v5.1.2**, pinned commit [`f1890d9f152c896d250a77557a5751a93d494776`](https://github.com/nvkelso/natural-earth-vector/tree/f1890d9f152c896d250a77557a5751a93d494776). [Original GeoJSON](https://github.com/nvkelso/natural-earth-vector/blob/f1890d9f152c896d250a77557a5751a93d494776/geojson/ne_10m_admin_1_states_provinces.geojson), [layer version record](https://github.com/nvkelso/natural-earth-vector/blob/f1890d9f152c896d250a77557a5751a93d494776/10m_cultural/ne_10m_admin_1_states_provinces.VERSION.txt).

**Made with Natural Earth.** Natural Earth states that all versions of its vector and raster map data are [public domain](https://www.naturalearthdata.com/about/terms-of-use/), including permission to modify and redistribute. The source feature and derived map geometry remain public domain; the code's MIT license does not impose a new license on that data. Both variants retain all 1,835 source vertices, using an equirectangular projection with standard parallel 42°N. Their north-up orientation is preserved in RTL layouts. The collection name is East Turkistan; the geometry follows the cited dataset's modern administrative outline, rather than a reconstruction of historical boundaries. `assets/maps/east-turkistan.metadata.json` and the extracted original GeoJSON record the exact source, checksums and geographic extent.

ALKATIP Basma is linked using the project owner's supplied OnlineWebFonts WOFF2/WOFF/TTF URLs. Font binaries are not bundled or covered by the MIT code license.

Accessibility references: [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/), [W3C form labels](https://www.w3.org/WAI/tutorials/forms/labels/), and [W3C form validation](https://www.w3.org/WAI/tutorials/forms/validation/). The library uses native HTML controls and does not claim independent assistive-technology certification.

## Reused UyghurCommunity modules

Uyghur UI 0.4.0 includes unchanged source copies from `@uyghurcommunity/keyboard` 0.1.1 and `@uyghurcommunity/text` 0.1.0 under `src/vendor/`. Their MIT licenses remain beside the source. `src/vendor/README.md` records the source repositories, versions and SHA-256 checksums. The writing controller composes these modules; normalization and cleanup require an explicit preview and apply action. Font binaries are not bundled. The optional React adapter is separately packaged under the same MIT license and uses React as a peer dependency.
