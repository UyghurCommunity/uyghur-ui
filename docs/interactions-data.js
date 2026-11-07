import { iconSVG } from '../src/icons.js';
import { mapSVG } from '../src/maps.js';
import { interactionsMetadata } from './site-shell.js';
const motif = (name, size = 32) => iconSVG(name, { size, strokeWidth: 1.3 });
const plane = '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="m3 10 18-7-7 18-3-8-8-3Zm8 3L21 3"/></svg>';
const examples = {
  spotlight: {
    category: 'pointer', hint: 'نۇرنى سۈرۈڭ ياكى كۇنۇپكىنى بېسىڭ.',
    html: `<div class="ugx-spotlight" data-surface><div class="ugx-stitch-grid" aria-hidden="true"></div><span class="ugx-stage-note" lang="en" dir="ltr">HANDCRAFTED / 001</span><div class="ugx-embroidery" aria-hidden="true"><span class="ugx-diamond diamond-one"></span><span class="ugx-diamond diamond-two"></span>${motif('floral-rosette', 112)}</div><div class="ugx-art-caption"><span>ھەر بىر نەقىشتە، بىر ھېكايە.</span><bdi lang="en">01 / KESHTE</bdi></div></div><div class="ugx-demo-controls"><button class="ugx-button" type="button" data-action="spotlight">نۇرنى يۆتكەش ↗</button><p class="ugx-status" data-demo-status role="status" aria-live="polite">كەشتە نۇرىنى سىناڭ.</p></div>`,
  },
  tilt: {
    category: 'pointer', hint: 'كارتىنى سۈرۈڭ؛ فوكۇستا ئوق كۇنۇپكىلىرىنى سىناڭ.',
    html: `<div class="ugx-depth-scene"><span class="ugx-stage-note" lang="en" dir="ltr">CULTURE HAS DIMENSION</span><button class="ugx-doppa-card" data-tilt-card type="button" aria-label="دوپپا كارتىسى؛ چوڭقۇرلۇقنى ئوق كۇنۇپكىلىرى بىلەن ئۆزگەرتىڭ"><span class="ugx-card-corner" aria-hidden="true">✦</span><span class="ugx-doppa-mark" aria-hidden="true">${motif('doppa-top', 98)}</span><span class="ugx-doppa-word">دوپپا</span><span class="ugx-card-edition" lang="en" dir="ltr">A LITTLE PIECE OF HOME.</span></button></div><div class="ugx-demo-controls ugx-depth-controls"><button class="ugx-button" type="button" data-action="tilt">يېڭى بۇلۇڭ ↗</button><label class="ugx-setting">چوڭقۇرلۇق <input type="range" data-setting="depth" min="8" max="20" value="12" dir="ltr"></label><p class="ugx-status" data-demo-status role="status" aria-live="polite">دوپپا كارتىسى تەييار.</p></div>`,
  },
  selection: {
    category: 'actions', hint: 'تېمىنى تاللاڭ؛ رامكا سىز بىلەن يۆتكىلىدۇ.',
    html: `<div class="ugx-selection-scene"><span class="ugx-stage-note" lang="en" dir="ltr">A THREAD THAT FOLLOWS YOU</span><p class="ugx-stage-title">بۈگۈن قايسى نەقىش؟</p><div class="ugx-choice-track" data-choice-track role="group" aria-label="مىراس تېمىسىنى تاللاش"><span class="ugx-selection-indicator" data-selection-indicator aria-hidden="true"></span><button type="button" data-choice="atlas" aria-pressed="false">${motif('atlas', 34)}<span>ئەتلەس</span></button><button type="button" data-choice="doppa" aria-pressed="true">${motif('doppa-top', 34)}<span>دوپپا</span></button><button type="button" data-choice="flower" aria-pressed="false">${motif('flower', 34)}<span>گۈل</span></button></div><p class="ugx-status" data-demo-status role="status" aria-live="polite">دوپپا تاللاندى.</p><span class="ugx-selection-stitch" aria-hidden="true">✦ ────── ✦ ────── ✦</span></div>`,
  },
  send: {
    category: 'actions', hint: 'پەقەت يەرلىك جانلاندۇرۇش مىسالى؛ خەت ئەۋەتىلمەيدۇ.',
    html: `<div class="ugx-envelope-scene"><span class="ugx-stage-note" lang="en" dir="ltr">A SMALL HELLO, A LONG WAY</span><div class="ugx-envelope" aria-hidden="true"><div class="ugx-letter"><span>ئەسسالامۇئەلەيكۇم!</span><i></i><i></i><i></i></div><div class="ugx-envelope-front"></div><span class="ugx-envelope-seal">${motif('flower', 25)}</span></div><span class="ugx-plane" aria-hidden="true">${plane}</span><span class="ugx-send-receipt" aria-hidden="true">${motif('check-circle', 42)}</span></div><div class="ugx-demo-controls"><button class="ugx-button ugx-button--solid" type="button" data-action="send">خەتنى ئۇچۇرۇش ${plane}</button><button class="ugx-button" type="button" data-action="reset">قايتا سىناش ↺</button><p class="ugx-status" data-demo-status role="status" aria-live="polite">يەرلىك سىناق. ھېچقانداق ئۇچۇر ئەۋەتىلمەيدۇ.</p></div>`,
  },
  compare: {
    category: 'data', hint: 'سىزىق بىلەن رەڭنى سېلىشتۇرۇڭ. خەرىتە يۆنىلىشى ساقلىنىدۇ.',
    html: `<div class="ugx-compare-scene" aria-hidden="true"><div class="ugx-map-layer ugx-map-outline"><img src="assets/maps/east-turkistan-outline.svg" width="1024" height="906" alt=""></div><div class="ugx-map-layer ugx-map-filled"><img src="assets/maps/east-turkistan-filled.svg" width="1024" height="906" alt=""></div><span class="ugx-compare-line"></span><span class="ugx-map-north" lang="en" dir="ltr">N ↑</span><span class="ugx-map-tag">شەرقىي تۈركىستان</span></div><div class="ugx-demo-controls ugx-compare-controls"><label class="ugx-setting">رەڭلىك خەرىتىنىڭ نىسبىتى <input type="range" data-setting="compare" min="0" max="100" value="50" dir="ltr"></label><div class="ugx-range-labels" dir="ltr"><span lang="ug" dir="rtl">0% · سىزىق</span><span lang="ug" dir="rtl">100% · رەڭ</span></div><p class="ugx-status" data-demo-status role="status" aria-live="polite">50% رەڭلىك خەرىتە.</p><a class="ugx-map-source" href="guide/icons.html#icons-map">خەرىتە مەنبەسى ۋە SVG ھۆججەتلىرى ↗</a></div>`,
  },
  ripple: {
    category: 'actions', hint: 'بېسىڭ، نەقىشتىن تارقالغان دولقۇننى كۆرۈڭ.',
    html: `<div class="ugx-ripple-scene"><span class="ugx-stage-note" lang="en" dir="ltr">FROM ONE MOTIF, MANY POSSIBILITIES</span><div class="ugx-ripple-art" aria-hidden="true"><span class="ugx-ripple-ring ring-one"></span><span class="ugx-ripple-ring ring-two"></span><span class="ugx-ripple-ring ring-three"></span><span class="ugx-ripple-motif">${motif('uyghur-medallion', 98)}</span></div></div><div class="ugx-demo-controls"><button class="ugx-button ugx-button--solid" type="button" data-action="ripple">نەقىشنى جانلاندۇرۇش ✦</button><p class="ugx-status" data-demo-status role="status" aria-live="polite">بىر نەقىشتىن باشلاڭ.</p></div>`,
  },
};
export const interactionExamples = Object.freeze(interactionsMetadata.map((entry) => Object.freeze({ ...entry, ...examples[entry.id] })));

/** Make downloaded comparison examples portable; no map network request is needed. */
export function portableMarkup(example) {
  let html = example.html;
  if (example.id === 'compare') {
    for (const variant of ['outline', 'filled']) html = html.replace(`assets/maps/east-turkistan-${variant}.svg`, `data:image/svg+xml,${encodeURIComponent(mapSVG({ width: 1024, variant, color: variant === 'filled' ? '#559EE2' : '#17364b', label: '' }))}`);
    html = html.replace('href="guide/icons.html#icons-map"', 'href="https://uyghurcommunity.github.io/uyghur-ui/guide/icons.html#icons-map"');
  }
  return html;
}
