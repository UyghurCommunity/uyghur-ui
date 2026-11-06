import { iconSVG } from '../src/icons.js';

/** Produce reusable source from fixed local samples; no gallery-only icon renderer is needed. */
export function componentSnippet(component) {
  const markup = component.html.replace(/<span data-ug-icon="([a-z-]+)"><\/span>/g, (_, name) => iconSVG(name));
  return `<!-- Load the package stylesheet in your app entry:
     import '@uyghurcommunity/ui/styles.css';
     Or, when serving this checkout without a bundler:
     <link rel="stylesheet" href="./src/styles.css">
     Bare package imports below need a bundler or an import map. -->
<div class="ug-ui" lang="ug" dir="rtl">
${markup}
</div>

<script type="module">
${component.js}
</script>`;
}
