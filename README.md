# ئۇيغۇرچە UI · Uyghur UI

[Documentation](https://uyghurcommunity.github.io/uyghur-ui/guide/introduction.html) · [Installation](https://uyghurcommunity.github.io/uyghur-ui/guide/installation.html) · [Live component gallery](https://uyghurcommunity.github.io/uyghur-ui/) · [UyghurCommunity](https://github.com/UyghurCommunity)

ئۇيغۇرچە تور بەتلەر ئۈچۈن كۇنۇپكا، فورما، سۆزلىشىش كۆزنىكى، بەتكۈچ، تىزىملىك، ئۇقتۇرۇش، 110 SVG سىنبەلگە ۋە شەرقىي تۈركىستان خەرىتىسى. 63 مەدەنىيەت سىنبەلگىسىنىڭ سىزىقلىق ۋە رەڭلىك نۇسخىسى بار. ALKATIP Basma خەت نۇسخىسى، ئوڭدىن سولغا لايىھە ۋە كۇنۇپكا تاختىسى بىلەن ئىشلىتىشنى قوللايدۇ.

Framework-independent CSS components and small native JavaScript controllers for Uyghur interfaces. Buttons, fields, checkbox/radio/switch, select, textarea, range, cards, badges, avatar, navigation, native accordion, dialog, RTL-aware tabs and plain-text toasts are included. The collection provides 110 original outline icons, 63 cultural color variants, an East Turkistan flag, and sourced map assets as files and render functions.

## Install

npm registry publishing is deferred. Install the versioned GitHub release archive:

```sh
npm install https://github.com/UyghurCommunity/uyghur-ui/releases/download/v0.3.0/uyghurcommunity-ui-0.3.0.tgz
```

In a bundler-based application:

```js
import '@uyghurcommunity/ui/styles.css';
import { bindDialog, bindTabs, bindForm, showToast, iconSVG, flagSVG, mapSVG } from '@uyghurcommunity/ui';
```

Without a bundler, serve this checkout over HTTP, link `src/styles.css`, and import `./src/index.js` from a module script. There is no build step or runtime JavaScript dependency.

```html
<html lang="ug" dir="rtl">
<link rel="stylesheet" href="./src/styles.css">
<body class="ug-ui">
  <button class="ug-button" id="open">تەڭشەك</button>
  <dialog class="ug-dialog" id="settings" aria-labelledby="settings-title">
    <h2 id="settings-title" tabindex="-1">تەڭشەك</h2>
    <button class="ug-button" data-ug-close>تاقاش</button>
  </dialog>
  <script type="module">
    import { bindDialog } from './src/index.js';
    const ui = bindDialog(document.getElementById('settings'), {
      trigger: document.getElementById('open'),
      initialFocus: document.getElementById('settings-title'),
    });
    // ui.open(); ui.close(); ui.destroy();
  </script>
</body>
</html>
```

The native `<dialog>` supplies focus containment, Escape cancellation and background inertness. Supply an accessible name and visible close button. Controllers do not add a custom modal polyfill. Queued close events are ignored if a dialog has already reopened. `destroy()` removes listeners and restores attributes managed by the binding.

## API

- `bindDialog(dialog, { trigger?, initialFocus? })`: `open()`, `close(value?)`, `destroy()`.
- `bindDisclosure(button, panel)`: `toggle()`, `setOpen(boolean)`, `destroy()`. Connect `aria-controls` in your markup.
- `bindTabs(container)`: roving tab focus, Home/End, RTL horizontal arrows, vertical arrows and current disabled-tab skipping. The first tablist owns its tabs; nested groups stay independent. Each tab needs a distinct panel inside the container. Direction and orientation come from the tablist. `select(tab, focus?)`, `destroy()`.
- `validateForm(form, { messages? })`: actual native validity errors with Uyghur defaults; errors contain `field` and `message`. Associate labels, hint/error IDs and `aria-describedby` in markup. Set `data-ug-error="error-id"` to populate the inline error text.
- `bindForm(form, { onValid?, messages? })`: sets `novalidate` while bound so invalid submissions reach the localized validator, then focuses the first invalid control. An explicit `onValid` handles valid submissions locally. Without `onValid`, valid native form submission remains enabled. `destroy()` restores the original `novalidate`, managed `aria-invalid` attributes, and error text. Native validation does not replace server validation.
- `showToast(region, text, { duration=8000, dismissLabel? })`: renders text safely and returns `dismiss()`/`destroy()`. Use `duration:0` for important messages. Give the region `role="status" aria-live="polite"`.
- `iconSVG(name, { size=24, strokeWidth=1.7, label='', variant='outline' })`: escaped accessible name, or decorative `aria-hidden` when label is empty. The 63 cultural icons support `variant:'color'`; requesting color for a general UI icon falls back to its outline. Names are available in `iconNames`, and color availability in `coloredIconNames`.
- `iconCatalog`: immutable names, Uyghur/English labels, category, search aliases and available `variants` for all 110 icons.
- `iconCategories`: bilingual filter labels. `findIcons(query, { category='all' })` combines text and category matching and returns icon names. Categories: `all`, `traditional`, `music`, `textiles`, `architecture`, `table`, `garden` (Nature), `clothing`, `crafts`, `motifs`, `general`.
- `flagSVG({ width=90, label? })`: East Turkistan flag at a 3:2 width/height ratio. It is never automatically mirrored.
- `mapSVG({ width=640, variant='outline', label?, color='currentColor', strokeWidth=4 })`: north-up map SVG with an accessible Uyghur name by default. Variants are `outline` and `filled`; width must be an integer from 64–2048, stroke width 0.5–12, and color `currentColor`, `#RGB` or `#RRGGBB`. Labels are escaped and limited to 160 characters.
- `mapMetadata`: deeply frozen source, license, geometry, projection and boundary-basis metadata.

Components use native labels/controls and explicit RTL/LTR containers. `ug-row` supplies a wrapping flex row; `ug-columns` supplies two columns that collapse on smaller screens. Both layout helpers are scoped under `ug-ui` in the package stylesheet. Copied gallery fragments include that scope, `lang="ug"`, `dir="rtl"`, and fully rendered SVG icons. Load the package stylesheet as described in each snippet; bare JavaScript imports need a bundler or import map.

Icons do not mirror automatically: select a directional icon intentionally for the action. Use logical CSS properties in consumer layouts. Core imports have no document access and can be used during server rendering.

## Theme and assets

Override `--ug-blue`, `--ug-accent`, `--ug-radius`, `--ug-font` and other tokens in `src/styles.css`. Set `data-ug-theme="dark"` on a containing element for dark colors. The external ALKATIP Basma face uses `font-display:swap`; no font binary is redistributed. Consumers can supply their own approved font stylesheet/token.

SVG assets live in `assets/icons/`, `assets/icons/color/`, `assets/flags/east-turkistan.svg` and `assets/maps/`. Downloads are linked from the gallery. SVG render options are bounded and labels are escaped. Never pass untrusted markup directly to `innerHTML`; the gallery only inserts the library's fixed validated SVG output.

Installed-package asset subpaths include `@uyghurcommunity/ui/icons/flower`, `@uyghurcommunity/ui/icons/color/dutar` (icon names without an extension) and `@uyghurcommunity/ui/flags/east-turkistan.svg`. Icon and flag render functions are available from the root import or `@uyghurcommunity/ui/icons`; map functions and metadata are available from the root import or `@uyghurcommunity/ui/maps`.

## Uyghur cultural collection · مىراس سىنبەلگىلىرى

Version **0.3.0** adds 36 cultural themes and color variants for the full cultural collection. There are now **110 outline icons**, including **63 cultural pictograms and motifs with matching color variants**. The gallery supports Uyghur labels, English names, spelling aliases, category filters and variant selection.

| Collection | Icons |
| --- | --- |
| Instruments | dutar, tambur, rawap, ghijek, satar, dap, surnai |
| Clothing | doppa, fur-hat, womens-headdress, mens-coat, womens-dress, chapan, sash, boots, traditional-shoes |
| Textiles and crafts | atlas, carpet, embroidery, loom, spindle, ceramic-vase, jewelry |
| Architecture | aywan, archway, carved-door, lattice-window, mosque, mausoleum, minaret, madrasa, traditional-house, yurt, city-gate, ancient-ruins |
| Food and tea | nan, nan-stack, samsa, polo, laghman, teapot, tea-bowl, tea-set, pomegranate |
| Nature | grapes, apricot, cotton, melon, landscape, horse, camel |
| Motifs and symbols | almond, flower, doppa-top, uyghur-medallion, floral-rosette, ornamental-border, calligraphy, star-eight, crescent, tree-of-life, unity, dove |

```js
import { iconSVG, iconCatalog, coloredIconNames, findIcons } from '@uyghurcommunity/ui';
const dutar = iconSVG('dutar', { size: 48, label: 'دۇتار' });
const colorDutar = iconSVG('dutar', { size: 64, variant: 'color', label: 'دۇتار' });
console.log(coloredIconNames.length); // 63
console.log(iconCatalog.find(icon => icon.name === 'dutar').variants); // ['outline', 'color']
findIcons('راۋاب'); // ['rawap']
findIcons('', { category: 'music' }); // seven instrument names
```

[Download the cultural SVG collection](https://uyghurcommunity.github.io/uyghur-ui/downloads/uyghur-traditional-icons.zip) or [all SVGs](https://uyghurcommunity.github.io/uyghur-ui/downloads/uyghur-ui-icons.zip). Both ZIPs include outline and color variants, the East Turkistan flag, both map SVGs, map source GeoJSON and metadata, bilingual icon metadata, the license and source notices. The JSON catalog is also exported as `@uyghurcommunity/ui/catalog.json`.

These are original modern interface pictograms inspired by Uyghur cultural life and the owner's supplied reference boards. The reference images are not redistributed. The frame drum is labeled **Dap**; **Tambur** remains a separate long-necked instrument. Instrument forms and spellings vary; the collection includes search aliases and simplified silhouettes. Cultural context and visual references are recorded in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## East Turkistan map · شەرقىي تۈركىستان خەرىتىسى

[Preview the map](https://uyghurcommunity.github.io/uyghur-ui/#map), [download the map ZIP](https://uyghurcommunity.github.io/uyghur-ui/downloads/east-turkistan-map.zip), or use the separate [outline SVG](assets/maps/east-turkistan-outline.svg) and [filled SVG](assets/maps/east-turkistan-filled.svg).

```js
import { mapSVG, mapMetadata } from '@uyghurcommunity/ui/maps';

const outline = mapSVG({ width: 640, label: 'شەرقىي تۈركىستان خەرىتىسى' });
const filled = mapSVG({ width: 640, variant: 'filled', color: '#559EE2' });
console.log(mapMetadata.source.layerVersion); // '5.1.1'
console.log(mapMetadata.projection.viewBox); // '0 0 1024 906'
```

The asset is named East Turkistan for this collection. Its geometry follows **Natural Earth's Xinjiang admin-1 polygon (`CHN-1756` / `CN-XJ`)**, layer **5.1.1**, pinned to repository release **v5.1.2**, commit `f1890d9f152c896d250a77557a5751a93d494776`. It represents that dataset's modern administrative outline; it does not reconstruct historical boundaries. [Dataset description](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/), [pinned source](https://github.com/nvkelso/natural-earth-vector/blob/f1890d9f152c896d250a77557a5751a93d494776/geojson/ne_10m_admin_1_states_provinces.geojson).

Both styles retain all 1,835 source vertices without simplification, using an equirectangular projection with standard parallel 42°N and viewBox `0 0 1024 906`. They remain north up and east right in RTL pages. The standalone SVGs contain accessible Uyghur/English names and no external references, scripts or font dependencies. **Made with Natural Earth.** Source geometry is [public domain](https://www.naturalearthdata.com/about/terms-of-use/).

Package file exports:

```text
@uyghurcommunity/ui/maps/east-turkistan-outline.svg
@uyghurcommunity/ui/maps/east-turkistan-filled.svg
@uyghurcommunity/ui/maps/metadata.json
@uyghurcommunity/ui/maps/source.geojson
```

The [metadata](assets/maps/east-turkistan.metadata.json), [original extracted GeoJSON](assets/maps/east-turkistan.source.geojson) and [map notes](assets/maps/README.md) record source checksums, geographic extent and reproducible generation details.

## Interaction gallery

[Try the six original interactions](https://uyghurcommunity.github.io/uyghur-ui/interactions.html): embroidery spotlight, Doppa depth card, Atlas selection, local envelope animation, map comparison and ornament ripple. The presentation takes inspiration from [Aceternity’s interaction gallery](https://ui.aceternity.com/interactions); the implementations and cultural artwork are original, with no Aceternity source or runtime dependency.

Each demo has touch and keyboard controls, a shared pause control, reduced-motion support and a complete HTML/CSS/JavaScript example to copy or download. The comparison download embeds both map SVGs, and every standalone example registers the supplied ALKATIP Basma font URLs. Font binaries are not bundled. The envelope is a local visual demonstration and sends no message.

These are website examples, separate from the unchanged v0.3.0 package exports. Source: `docs/interactions-data.js`, `docs/interaction-controls.js`, `docs/interaction-demo.css` and `docs/interaction-document.js`. `build:docs` renders `interactions.html` from the same examples and shared documentation shell.

## Run and verify

```sh
python3 -m http.server 4173
npm test
npm run check
npm pack --dry-run
npm run build:map
npm run build:icons
npm run build:docs
```

The gallery has working previews and copyable HTML/JavaScript. Demo form values stay in the browser and no submission service is connected. Motion is optional and honors reduced-motion preferences. Browser and assistive-technology contributions are welcome.

`build:map` regenerates the map SVGs, metadata and JavaScript geometry module offline from the committed source GeoJSON. `build:icons` regenerates the outline/color icon files, catalog and deterministic ZIP downloads using Node only. CI checks that generated files match the committed assets.

`build:docs` produces eleven static Uyghur guide pages and the local full-text search index from `docs/guide-content.js`. The guides cover installation, a complete quick start, components, JavaScript APIs, icons, theming, RTL, accessibility, troubleshooting and release history. All guide prose is readable without JavaScript. Search, code-copy helpers, mobile navigation and theme preferences enhance the static pages in the browser. Keep generated `guide/`, `interactions.html`, `index.html` navigation and `assets/docs-search.json` committed for GitHub Pages.

Code and original icons: [MIT](LICENSE). Natural Earth map data: public domain. Flag, cultural references and external-font details: [third-party notices](THIRD_PARTY_NOTICES.md).
