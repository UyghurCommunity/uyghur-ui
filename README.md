# ئۇيغۇرچە UI · Uyghur UI

[Live component gallery](https://uyghurcommunity.github.io/uyghur-ui/) · [UyghurCommunity](https://github.com/UyghurCommunity)

ئۇيغۇرچە تور بەتلەر ئۈچۈن كۇنۇپكا، فورما، سۆزلىشىش كۆزنىكى، بەتكۈچ، تىزىملىك، ئۇقتۇرۇش ۋە SVG سىنبەلگىلەر. ALKATIP Basma خەت نۇسخىسى، ئوڭدىن سولغا لايىھە ۋە كۇنۇپكا تاختىسى بىلەن ئىشلىتىشنى قوللايدۇ.

Framework-independent CSS components and small native JavaScript controllers for Uyghur interfaces. Buttons, fields, checkbox/radio/switch, select, textarea, range, cards, badges, avatar, navigation, native accordion, dialog, RTL-aware tabs and plain-text toasts are included. Original SVG icons and a downloadable East Turkistan flag are available as files and render functions.

## Install

npm registry publishing is deferred. Install the versioned GitHub release archive:

```sh
npm install https://github.com/UyghurCommunity/uyghur-ui/releases/download/v0.2.0/uyghurcommunity-ui-0.2.0.tgz
```

In a bundler-based application:

```js
import '@uyghurcommunity/ui/styles.css';
import { bindDialog, bindTabs, bindForm, showToast, iconSVG, flagSVG } from '@uyghurcommunity/ui';
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
- `iconSVG(name, { size=24, strokeWidth=1.7, label='' })`: escaped accessible name, or decorative `aria-hidden` when label is empty. Names are available in `iconNames`.
- `iconCatalog`: immutable names, Uyghur/English labels, category and search aliases for all 74 icons.
- `iconCategories`: bilingual filter labels. `findIcons(query, { category='all' })` combines text and category matching and returns icon names. Categories: `all`, `traditional`, `music`, `textiles`, `architecture`, `table`, `garden`, `general`.
- `flagSVG({ width=90, label? })`: East Turkistan flag at a 3:2 width/height ratio. It is never automatically mirrored.

Components use native labels/controls and explicit RTL/LTR containers. `ug-row` supplies a wrapping flex row; `ug-columns` supplies two columns that collapse on smaller screens. Both layout helpers are scoped under `ug-ui` in the package stylesheet. Copied gallery fragments include that scope, `lang="ug"`, `dir="rtl"`, and fully rendered SVG icons. Load the package stylesheet as described in each snippet; bare JavaScript imports need a bundler or import map.

Icons do not mirror automatically: select a directional icon intentionally for the action. Use logical CSS properties in consumer layouts. Core imports have no document access and can be used during server rendering.

## Theme and assets

Override `--ug-blue`, `--ug-accent`, `--ug-radius`, `--ug-font` and other tokens in `src/styles.css`. Set `data-ug-theme="dark"` on a containing element for dark colors. The external ALKATIP Basma face uses `font-display:swap`; no font binary is redistributed. Consumers can supply their own approved font stylesheet/token.

SVG assets live in `assets/icons/` and `assets/flags/east-turkistan.svg`. A complete download is linked from the gallery. SVG render options are bounded and labels are escaped. Never pass untrusted markup directly to `innerHTML`; the gallery only inserts the library's fixed validated SVG output.

Installed-package asset subpaths are `@uyghurcommunity/ui/icons/flower` (icon name without an extension) and `@uyghurcommunity/ui/flags/east-turkistan.svg`. The JavaScript render functions are available from the root import or `@uyghurcommunity/ui/icons`.

## Uyghur cultural collection · مىراس سىنبەلگىلىرى

Version 0.2.0 adds 24 original drawings. There are now **74 icons**, including **27 cultural pictograms and motifs**. The gallery opens on this collection and supports Uyghur labels, English names, spelling aliases and category filters.

| Collection | Icons |
| --- | --- |
| Instruments | dutar, tambur, rawap, ghijek, satar, dap |
| Textiles and motifs | doppa, almond, flower, atlas, carpet, embroidery, loom, spindle |
| Architecture | aywan, archway, carved-door, lattice-window |
| Food and tea | nan, samsa, polo, laghman, teapot, tea-bowl, pomegranate |
| Garden | grapes, apricot |

```js
import { iconSVG, iconCatalog, findIcons } from '@uyghurcommunity/ui';
const dutar = iconSVG('dutar', { size: 48, label: 'دۇتار' });
findIcons('راۋاب'); // ['rawap']
findIcons('', { category: 'music' }); // six instrument names
```

[Download the cultural SVG collection](https://uyghurcommunity.github.io/uyghur-ui/downloads/uyghur-traditional-icons.zip) or [all SVGs](https://uyghurcommunity.github.io/uyghur-ui/downloads/uyghur-ui-icons.zip). Both ZIPs include the East Turkistan flag, bilingual JSON metadata, the license and source notices. The JSON catalog is also exported as `@uyghurcommunity/ui/catalog.json`.

These are original modern interface pictograms inspired by Uyghur cultural life. Instrument forms and spellings vary; the collection includes search aliases and simplified silhouettes. Cultural context and visual references are recorded in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Run and verify

```sh
python3 -m http.server 4173
npm test
npm run check
npm pack --dry-run
npm run build:icons
```

The gallery has working previews and copyable HTML/JavaScript. Demo form values stay in the browser and no submission service is connected. Motion is optional and honors reduced-motion preferences. Browser and assistive-technology contributions are welcome.

`build:icons` regenerates the SVG files, catalog and deterministic ZIP downloads using Node only. CI checks that generated files match the committed assets.

Code and original icons: [MIT](LICENSE). Flag and external-font details: [third-party notices](THIRD_PARTY_NOTICES.md).
