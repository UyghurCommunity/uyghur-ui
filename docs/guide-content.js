import { escapeMarkup } from '../src/icons.js';

const release = 'https://github.com/UyghurCommunity/uyghur-ui/releases/download/v0.4.0/uyghurcommunity-ui-0.4.0.tgz';
const code = (language, source) => `<pre data-language="${language}"><code>${escapeMarkup(source.trim())}</code></pre>`;
const note = (title, text) => `<aside class="doc-callout"><strong>${title}</strong><p>${text}</p></aside>`;
const table = (headings, rows) => `<div class="doc-table"><table><thead><tr>${headings.map((x) => `<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;


const release040 = 'https://github.com/UyghurCommunity/uyghur-ui/releases/download/v0.4.0/';
const starterRelease = 'https://github.com/UyghurCommunity/uyghur-starters/releases/download/v0.2.0/uyghurcommunity-create-0.2.0.tgz';
const additions040 = {
  introduction: `<h2 id="intro-040">يېزىق، قوللىنىشچان بۆلەك ۋە ئىككى تىللىق قوللانما</h2><p>0.4.0 دە ئۇيغۇرچە يېزىق كونتروللىغۇچى، ئىزدەپ تاللاش، ئېچىلما تىزىملىك، يان كۆزنەك، سانلىق مەلۇمات جەدۋىلى، تۆت ئۇسلۇب ۋە React بوغچىسى قوشۇلدى. <a href="../lab.html">تەجرىبەخانا</a>دا سىناڭ، <a href="en/introduction.html" lang="en">English documentation</a> نى ئوقۇڭ ياكى <a href="../community.html">ھەمكارلىق قوللانمىسى</a>دىن تۆھپە يولىنى تاللاڭ.</p>`,
  installation: `<h2 id="install-react">React بوغچىسى</h2>${code('sh',`npm install ${release040}uyghurcommunity-ui-0.4.0.tgz ${release040}uyghurcommunity-ui-react-0.4.0.tgz`)}${code('jsx',`import '@uyghurcommunity/ui/styles.css';
import { Button, Icon, Dialog, Tabs, UyghurInput, Interaction } from '@uyghurcommunity/ui-react';
export function Hello() {
  return <main className="ug-ui" lang="ug" dir="rtl"><Button>باشلاڭ</Button><Icon name="dutar" /></main>;
}`)}<p>React نى قوللىنىشچان تۈرىڭىز تەمىنلەيدۇ. تەركىبلەرنىڭ props ۋە ھايات دەۋرى ئۈچۈن React بوغچىسىنىڭ README سىنى كۆرۈڭ؛ بىر ئېلېمېنتقا ئىككى كونترولنى بىرگە باغلىماڭ. npm تىزىملىكىگە ئېلان قىلىش ھازىرچە كېچىكتۈرۈلگەن.</p><h2 id="install-cli">تورسىز بۆلەك قاچىلاش</h2>${code('sh',`npm install --save-dev ${starterRelease}
npx create-uyghur --ui-list
npx create-uyghur --ui combobox --dir examples/new-combobox`)}<p>CLI 0.2.0 نىڭ تاللاشلىرى: writing-field، dialog، combobox، dropdown، drawer، data-table. <code dir="ltr">--dir</code> ئۈچۈن يېڭى نىسپىي مۇندەرىجە تاللاڭ؛ بۇ قورال يەرلىك قېلىپ ئىشلىتىدۇ، تورغا ئېلان قىلمايدۇ.</p>`,
  components: `<h2 id="components-application">قوللىنىشچان بۆلەكلەر ۋە React</h2><p><a href="../lab.html#lab-components">تەجرىبەخانىدا</a> ئىزدەپ تاللاش، ئېچىلما تىزىملىك، يان كۆزنەك ۋە جەدۋەلنىڭ ھەقىقىي HTML مىساللىرى بار. كونتروللارنى بىرلەشتۈرگەن باشقۇرۇش تاختىسى (يان تىزىملىك ۋە جەدۋەل) ۋە ماقالە تەھرىرلىگۈچ (يېزىق، ئالدىن كۆرۈش ۋە يەرلىك چىقىرىش) نىمۇ كۆچۈرۈپ ئىشلەتكىلى بولىدۇ. ئۇسلۇب يولى <code dir="ltr">@uyghurcommunity/ui/blocks.css</code>، ئاساسىي CSS ئىچىدىنمۇ يۈكلىنىدۇ. جەدۋەل يەرلىك قۇرلارنى سۈزۈپ، رەتلەپ ۋە بەتلەيدۇ؛ سانلىق مەلۇماتنى ئېلىش ياكى ساقلاشنى تۈرىڭىز باشقۇرىدۇ. ھەر كونترولنىڭ <code dir="ltr">destroy()</code> نى ھەقىقىي unmount ۋاقتىدا چاقىرىڭ.</p><p><code dir="ltr">@uyghurcommunity/ui-react</code> بولسا ئايرىم بوغچا؛ Button، Icon، Dialog، Tabs، UyghurInput ۋە Interaction نى export قىلىدۇ. <a href="installation.html#install-react">نەشر ئارخىپىدىن قاچىلاڭ</a>.</p>`,
  javascript: `<h2 id="api-writing">ئۇيغۇرچە يېزىق كونتروللىغۇچى</h2>${code('js',`import { bindUyghurInput } from '@uyghurcommunity/ui/writing';
const writing = bindUyghurInput(root, { maxLength: 10000, onChange(value) { console.log(value); } });
const preview = writing.previewCleanup();
console.log(preview, writing.validate());
// writing.applyCleanup(); writing.undoCleanup(); writing.destroy();`)}<p>كونترول getValue، setValue، previewCleanup(options?)، applyCleanup، undoCleanup، validate ۋە destroy نى تەمىنلەيدۇ. validate نەتىجىسى <code dir="ltr">{valid,message,length,maxLength}</code>؛ setValue، applyCleanup ۋە undoCleanup boolean قايتۇرىدۇ. ئالدى بىلەن ئۆزگەرتىشنى كۆرۈپ، ئاندىن قوللىنىڭ؛ ئەسلى تېكىستنى قايتۇرۇش ئىمكانىيىتىنى ساقلاڭ. <a href="../lab.html#lab-writing">يېزىق مىسالى</a>نى سىناڭ.</p><h2 id="api-application">قوللىنىشچان كونترول API</h2>${table(['نام','تاللاش ۋە قايتىدىغان ئۇسۇل'],[['bindCombobox(root,{onChange?})','open، close، getValue، select(value)، destroy.'],['bindDropdown(root)','open، close، toggle، destroy.'],['bindDrawer(root,{initialFocus?,dismissOutside?})','open، close، destroy.'],['bindDataTable(root,{pageSize:5})','getState، setPage(oneBasedPage)، refresh، destroy.']])}<p>كىرگۈزۈش يولى <code dir="ltr">@uyghurcommunity/ui/application</code>. لازىملىق markup نى <a href="../lab.html#lab-components">تەجرىبەخانا</a>دىن ئېلىڭ. bindDialog نىڭ يېڭى dismissOutside تاللىشى سۈكۈتتە true؛ سىرتنى باسقاندا تاقاشنى خالىمىسىڭىز false قىلىڭ. ناملىق تاقاش كۇنۇپكىسى يەنىلا بولسۇن.</p><h2 id="api-interactions">جانلاندۇرۇشنى بوغچا سۈپىتىدە ئىشلىتىش</h2>${code('js',`import '@uyghurcommunity/ui/interactions.css';
import { interactionBindings, bindSpotlight, bindTilt, bindSelection, bindSend, bindCompare, bindRipple } from '@uyghurcommunity/ui/interactions';`)}<p>كونتروللار syncMotion، reset ۋە destroy قايتۇرىدۇ. motionAllowed تاللىشى بىلەن توختىتىش، كۆرۈنۈش ۋە ھەرىكەتنى ئازايتىش تەڭشىكىنى تۈرىڭىزگە باغلاڭ. send پەقەت يەرلىك جانلاندۇرۇش؛ خەت ئەۋەتمەيدۇ.</p>`,
  theming: `<h2 id="theme-presets">تۆت ئۇسلۇب ۋە CSS/JSON چىقىرىش</h2>${code('js',`import { createTheme, exportThemeCSS, exportThemeJSON } from '@uyghurcommunity/ui/themes';
const theme = createTheme('doppa');
const css = exportThemeCSS(theme, { selector: '.my-product' });
const json = exportThemeJSON(theme);`)}<p>ئۇسلۇب ناملىرى doppa، atlas، desert، ceramic. createTheme نىڭ ئىككىنچى پارامېتىرى accent، radius، fontSize، lineHeight ۋە mode نى خاسلاشتۇرىدۇ؛ نەتىجە چوڭقۇر توڭلىتىلغان <code dir="ltr">{id,name,tokens}</code>. CSS نىڭ سۈكۈتتىكى selector ى .ug-ui. <a href="../lab.html#lab-themes">ئۇسلۇب خىزمەت ئۈستىلى</a>دە ئالدىن كۆرۈپ، چىقىرىش ھۆججىتىنى ئاساسىي ئۇسلۇبتىن كېيىن يۈكلەڭ. JSON ئۆزى ئۇسلۇب قوللانمايدۇ.</p>`,
  changelog: `<h2 id="changes-040">0.4.0 · يېزىق ۋە قوللىنىشچان UI</h2><p>ئۇيغۇرچە يېزىق، combobox، dropdown، drawer ۋە data table كونتروللىرى قوشۇلدى. جانلاندۇرۇش كونتروللىرى core بوغچىغا كىرگۈزۈلۈپ، interactions.css ئايرىم export قىلىندى؛ تۆت theme، CSS/JSON چىقىرىش، React 0.4.0، CLI 0.2.0، تەجرىبەخانا، ئىككى تىللىق 22 قوللانما ۋە ھەمكارلىق قېلىپلىرى قوشۇلدى.</p><p>يېڭى تارماق يوللار writing، application، interactions ۋە themes. bindDialog نىڭ dismissOutside تاللىشى سۈكۈتتە true. سىنبەلگە سانى 110 سىزىقلىق ۋە 63 رەڭلىك بولۇپ ساقلاندى؛ خەرىتە مەنبەسى ئۆز پېتىدە. <a href="https://github.com/UyghurCommunity/uyghur-ui/releases/tag/v0.4.0">0.4.0 نەشرى</a>.</p>`,
};

/** Authored documentation; generator escapes code before emitting static HTML. */
export const guidePages = Object.freeze([
  {
    slug: 'introduction', title: 'ئۇيغۇرچە قۇرۇشنى باشلاڭ', en: 'Introduction', group: 'getting-started',
    description: 'ئۇيغۇرچە كۆرۈنمە يۈز، مەدەنىيەتتىن ئىلھام ئالغان سىنبەلگىلەر ۋە ئاددىي تور تېخنىكىسى بىر يەردە.',
    body: `
<h2 id="intro-purpose">بىر بۆلەكتىن پۈتۈن بىر كۆرۈنمە يۈزگىچە</h2>
<p>ئۇيغۇرچە UI بولسا ئۇيغۇرچە تور بەت قۇرۇشقا ئىشلىتىدىغان CSS بۆلەكلىرى، كىچىك JavaScript كونتروللىرى ۋە SVG سىنبەلگىلەر توپلىمى. بەتنىڭ تىلى ۋە يۆنىلىشىنى ئۆزىڭىز بەلگىلەپ، لازىملىق بۆلەكنى تۈرىڭىزگە قوشىسىز.</p>
<p>كۇنۇپكا، رامكا، كارتا ۋە يىغىلىدىغان مەزمۇن يەرلىك HTML ئۈستىگە قۇرۇلغان. كۆزنەك، بەتكۈچ، تىزىملىك ۋە ئۇقتۇرۇشقا ئايرىم كونترول بار. بۇ شەكىل ئاددىي تور بەتتىمۇ، رامكا ئىشلىتىدىغان تۈردىمۇ بىرلا بۆلەك ئۇسلۇبىنى ساقلايدۇ.</p>
<h2 id="intro-included">توپلام ئىچىدە نېمىلەر بار؟</h2>
${table(['بۆلەك', 'ئىشلىتىش ئورنى'], [
  ['كۇنۇپكا ۋە فورما', 'كونترول، ئېنىق بەلگە، ئۇيغۇرچە خاتالىق ئۇچۇرى ۋە ياردەم تېكىستى.'],
  ['كۆزنەك ۋە بەتكۈچ', 'يەرلىك modal كۆزنەك، فوكۇس قايتۇرۇش ۋە RTL ئوق كۇنۇپكىلىرى.'],
  ['كارتا، بەلگە ۋە تىزىملىك', 'مەزمۇننى گۇرۇپپىلاش، ھالەتنى كۆرسىتىش ۋە يولباشلاش.'],
  ['110 SVG سىنبەلگە', '63 مەدەنىيەت سىنبەلگىسىنىڭ سىزىقلىق ۋە رەڭلىك نۇسخىسى، ئىككى تىللىق نام ۋە ئىزدەش يىپ ئۇچلىرى.'],
  ['بايراق ۋە خەرىتە', 'شەرقىي تۈركىستان بايرىقى، سىزىقلىق ۋە تولدۇرۇلغان خەرىتە، ئېنىق سانلىق مەلۇمات مەنبەسى.'],
  ['6 جانلىق مىسال', 'كەشتە نۇرى، دوپپا چوڭقۇرلۇقى، ئەتلەس تاللاش، خەت جانلاندۇرۇش، خەرىتە سېلىشتۇرۇش ۋە نەقىش دولقۇنى.'],
  ['ALKATIP Basma', 'سىرتقى ئادرېستىن يۈكلىنىدىغان خەت نۇسخىسى ۋە زاپاس خەتلەر.'],
])}
<h2 id="intro-path">قايسى يەردىن باشلايمەن؟</h2>
<ol><li><a href="installation.html">قاچىلاش</a> بۆلىكىدىن تۈرىڭىزگە ماس ئۇسۇلنى تاللاڭ.</li><li><a href="quick-start.html">تېز باشلاش</a> مىسالى بىلەن ھەقىقىي كۆزنەك ۋە فورما قۇرۇڭ.</li><li><a href="components.html">بۆلەكلەر</a> ۋە <a href="icons.html">سىنبەلگىلەر</a> قوللانمىسىدىن لازىملىقىنى تېپىڭ.</li><li><a href="theming.html">رەڭ ۋە خەتنى خاسلاشتۇرۇڭ</a>، ئاندىن <a href="accessibility.html">كۇنۇپكا تاختىسى بىلەن سىناڭ</a>.</li></ol>
${note('ھازىرقى نەشر · 0.4.0', 'قاچىلاش بوغچىسى GitHub Releases دا بار. npm تىزىملىكىگە ئېلان قىلىش ھازىرچە كېچىكتۈرۈلگەن؛ قوللانمىدىكى نەشرى بەلگىلەنگەن ئادرېسنى ئىشلىتىڭ.')}
<h2 id="intro-interactions">جانلىق UI نى سىناڭ</h2>
<p><a href="../interactions.html">جانلىق تەسىرلەر كۆرگەزمىسى</a>دىن 6 ئەسلى مىسالنى سىناڭ. ھەر مىسالدا HTML، CSS ۋە JavaScript نى تولۇق كۆچۈرۈش ياكى بىر HTML ھۆججىتى قىلىپ چۈشۈرۈش بار. كۆرگەزمىنىڭ ئۈستىدىكى كۇنۇپكا ھەرىكەتنى توختىتىدۇ؛ سىستېمىنىڭ ھەرىكەتنى ئازايتىش تەڭشىكىگە ئەمەل قىلىنىدۇ. تاللاش، كۇنۇپكا ۋە سۈرگۈچلەر كۇنۇپكا تاختىسى بىلەنمۇ ئىشلەيدۇ.</p>
<p>0.4.0 نەشرىدە بۇ مىساللارنىڭ كونتروللىرى <code dir="ltr">@uyghurcommunity/ui/interactions</code> ۋە ئايرىم CSS يولىدا بار. «كودىنى كۆرۈش ۋە ئىشلىتىش» نى ئېچىپ، تولۇق HTML نى كۆچۈرۈپ <code dir="ltr">demo.html</code> نامىدا ساقلاڭ ياكى بىۋاسىتە چۈشۈرۈڭ. خەت جانلاندۇرۇش مىسالى پەقەت يەرلىك سىناق، ئۇچۇر ئەۋەتمەيدۇ. خەرىتە مىسالى چۈشۈرۈلگەن HTML غا ھەر ئىككى SVG نى ئۆز ئىچىگە ئالىدۇ.</p>
<h2 id="intro-principles">تۈرىڭىزدە نېمىنى ئۆزىڭىز بېكىتىسىز؟</h2>
<p>كۈتۈپخانا تور مۇلازىمىتى، ئىشلەتكۈچى ھېسابى ياكى سانلىق مەلۇمات ساقلاشنى قوشمايدۇ. فورما نەتىجىسىنى قەيەرگە ئەۋەتىش، قايسى سانلىق مەلۇماتنى ساقلاش ۋە مەزمۇن ئىجازەتنامىسىنى قانداق كۆرسىتىشنى تۈرىڭىز بەلگىلەيدۇ. كۆرگەزمىدىكى فورما پەقەت يەرلىك سىناق.</p>
<p>كود ۋە ئەسلى سىنبەلگە سىزىقلىرى MIT ئىجازەتنامىسىدە. Natural Earth خەرىتە سانلىق مەلۇماتى ئاممىۋى مۈلۈك. خەت، بايراق، خەرىتە ۋە كۆرۈنۈش پايدىلىنىش مەنبەلىرىنى <a href="../THIRD_PARTY_NOTICES.md">مەنبە خاتىرىسى</a>دىن كۆرۈڭ.</p>`,
  },
  {
    slug: 'installation', title: 'قاچىلاش', en: 'Installation', group: 'getting-started',
    description: 'GitHub نەشر بوغچىسىنى قاچىلاڭ ياكى رېپو مەنبەسىنى بىۋاسىتە HTTP ئارقىلىق ئىشلىتىڭ.',
    body: `
<h2 id="install-requirements">ئالدىن تەييارلىق</h2>
<p>بوغچا بىلەن ئىشلەش ئۈچۈن <bdi dir="ltr" lang="en">Node.js 20+</bdi> ۋە ئۆز تۈرىڭىزنىڭ بوغچا باشقۇرغۇچىسى لازىم. كۈتۈپخانىنىڭ ئىجرا ۋاقتىدا باشقا JavaScript بوغچىسىغا تايىنىشچانلىقى يوق. تۈرىڭىزدە بار قۇرۇلۇش قورالىنى داۋاملىق ئىشلىتەلەيسىز.</p>
${note('توغرا قاچىلاش ئادرېسى', 'ھازىرچە يالغۇز <code dir="ltr">npm install @uyghurcommunity/ui</code> نى ئىشلەتمەڭ. تۆۋەندىكى بۇيرۇقلار GitHub دىكى 0.4.0 نەشر ئارخىپىنى قاچىلايدۇ.')}
<h2 id="install-package">نەشر بوغچىسىنى قاچىلاش</h2>
<h3>npm</h3>${code('sh', `npm install ${release}`)}
<h3>pnpm</h3>${code('sh', `pnpm add ${release}`)}
<h3>Yarn</h3>${code('sh', `yarn add ${release}`)}
<p>بۇ ئۈچ ئۇسۇلدىن تۈرىڭىزدە ئىشلىتىۋاتقان بىرىنى تاللاڭ. تۈرىڭىزنىڭ قۇلۇپ ھۆججىتىنى ساقلاڭ؛ شۇنداقتا كوماندىدىكى باشقىلارمۇ ئوخشاش بوغچا مەزمۇنىنى قاچىلايدۇ.</p>
<h2 id="install-bundler">قۇرۇلۇش قورالى بار تۈر</h2>
<p>تۈرىڭىزنىڭ JavaScript كىرىش ھۆججىتىگە ئۇسلۇب ۋە لازىملىق كونترولنى كىرگۈزۈڭ. CSS نىڭ ئىچىدىكى خەت ھۆججىتىمۇ بىللە يۈكلىنىدۇ.</p>
${code('js', `import '@uyghurcommunity/ui/styles.css';
import { bindDialog, iconSVG } from '@uyghurcommunity/ui';`)}
<p>HTML ياكى رامكا تەركىبىدىكى سىرتقى قاچىغا <code dir="ltr">ug-ui</code> نى قوشۇڭ. ئۇيغۇرچە مەزمۇنغا <code dir="ltr">lang="ug" dir="rtl"</code> بەلگىلەڭ.</p>
${code('html', `<main class="ug-ui" lang="ug" dir="rtl">
  <button class="ug-button" type="button">باشلاڭ</button>
</main>`)}
<h2 id="install-plain">قۇرۇلۇش قورالى يوق ئاددىي HTML</h2>
<p>رېپونى چۈشۈرۈپ، مىسال بېتىڭىزنى ئۇنىڭ تۈپ مۇندەرىجىسىگە قويۇڭ. تۆۋەندىكى يوللار شۇ ئورۇنغا ماس كېلىدۇ؛ بېتىڭىزنى باشقا مۇندەرىجىگە يۆتكىسىڭىز، نىسپىي يوللارنىمۇ تەڭشەڭ.</p>
${code('sh', `git clone https://github.com/UyghurCommunity/uyghur-ui.git
cd uyghur-ui
python3 -m http.server 4173 --bind 127.0.0.1`)}
${code('html', `<link rel="stylesheet" href="./src/styles.css">
<script type="module">
  import { iconSVG } from './src/index.js';
  document.getElementById('mark').innerHTML = iconSVG('dutar');
</script>`)}
<p>بۇ قىسقا مىسال ئۈچۈن بېتىڭىزدە <code dir="ltr">&lt;span id="mark"&gt;&lt;/span&gt;</code> بولۇشى كېرەك. تولۇق ھۆججەتنى <a href="quick-start.html">تېز باشلاش</a> بۆلىكىدىن كۆچۈرۈڭ. ES module ھۆججەتلىرىنى HTTP ئارقىلىق ئېچىڭ؛ <code dir="ltr">file://</code> ئارقىلىق ئېچىشقا تايانماڭ.</p>
<h2 id="install-check">قاچىلاشنى تەكشۈرۈش</h2>
${code('sh', `node --input-type=module -e "import { iconNames } from '@uyghurcommunity/ui'; console.log(iconNames.length)"`)}
<p>0.4.0 نەشرىدە نەتىجە <bdi dir="ltr">110</bdi> بولىدۇ. بۇيرۇق بوغچا تۈرىڭىزنىڭ ئىچىدىن ئىجرا قىلىنسۇن. CSS import خاتالىقى چىقسا، ئۇنى ئاددىي Node ئىچىدە ئەمەس، CSS نى بىر تەرەپ قىلالايدىغان تور تۈرىڭىزنىڭ كىرىش ھۆججىتىدە ئىشلىتىڭ.</p>`,
  },
  {
    slug: 'quick-start', title: 'تېز باشلاش', en: 'Quick start', group: 'getting-started',
    description: 'بىر تولۇق HTML ھۆججىتى بىلەن بەلگىلىك فورما ۋە فوكۇسنى قايتۇرىدىغان كۆزنەك قۇرۇڭ.',
    body: `
<h2 id="quick-file">تۇنجى بېتىڭىز</h2>
<p>بۇ مىسالنى رېپونىڭ تۈپ مۇندەرىجىسىگە <code dir="ltr">starter.html</code> نامىدا ساقلاڭ. <a href="installation.html#install-plain">يەرلىك HTTP مۇلازىمېتىرىنى</a> قوزغىتىپ، <code dir="ltr">http://127.0.0.1:4173/starter.html</code> نى ئېچىڭ. بۇ يولدا قۇرۇلۇش قورالى ياكى npm قاچىلاش قەدىمى لازىم ئەمەس.</p>
${code('html', `<!doctype html>
<html lang="ug" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>مېنىڭ تۇنجى ئۇيغۇرچە بېتىم</title>
  <link rel="stylesheet" href="./src/styles.css">
  <style>main { max-inline-size: 38rem; margin-inline: auto; padding: 2rem; }</style>
</head>
<body class="ug-ui">
  <main>
    <h1>بىرلىكتە قۇرايلى.</h1>
    <form id="hello-form">
      <div class="ug-field">
        <label class="ug-label" for="name">ئىسمىڭىز</label>
        <input class="ug-input" id="name" name="name" required
          minlength="2" maxlength="80" dir="auto"
          aria-describedby="name-help name-error" data-ug-error="name-error">
        <span class="ug-hint" id="name-help">كەم دېگەندە ئىككى ھەرپ كىرگۈزۈڭ.</span>
        <span class="ug-error" id="name-error"></span>
      </div>
      <button class="ug-button" type="submit">تەكشۈرۈش</button>
      <p id="form-result" role="status"></p>
    </form>
    <button class="ug-button ug-button--secondary" id="open-settings"
      type="button">تەڭشەكنى ئېچىش</button>
    <dialog class="ug-dialog" id="settings" aria-labelledby="settings-title">
      <h2 id="settings-title" tabindex="-1">كۆرۈنۈش تەڭشىكى</h2>
      <p>Escape ياكى تاقاش كۇنۇپكىسى بىلەن قايتىڭ.</p>
      <button class="ug-button" type="button" data-ug-close>تاقاش</button>
    </dialog>
  </main>
  <script type="module">
    import { bindDialog, bindForm } from './src/index.js';
    const dialog = bindDialog(document.getElementById('settings'), {
      trigger: document.getElementById('open-settings'),
      initialFocus: document.getElementById('settings-title'),
    });
    const form = bindForm(document.getElementById('hello-form'), {
      onValid() {
        document.getElementById('form-result').textContent =
          'فورما توغرا. بۇ يەرلىك سىناق؛ مەزمۇن ئەۋەتىلمىدى.';
      },
    });
    window.addEventListener('pagehide', (event) => {
      if (!event.persisted) { dialog.destroy(); form.destroy(); }
    });
  </script>
</body>
</html>`)}
<h2 id="quick-test">مىسالنى قانداق سىنايمەن؟</h2>
<ol><li>فورمىنى بوش قالدۇرۇپ تەكشۈرۈڭ؛ خاتالىق تېكىستى كۆرۈنىدۇ ۋە فوكۇس بىرىنچى خاتا رامكىغا بارىدۇ.</li><li>ئىككى ياكى ئۇنىڭدىن كۆپ ھەرپ كىرگۈزۈڭ؛ يەرلىك نەتىجە ئۇچۇرى چىقىدۇ.</li><li>كۆزنەكنى ئېچىڭ، <bdi dir="ltr" lang="en">Tab</bdi> بىلەن يۆتكىلىڭ ۋە <bdi dir="ltr" lang="en">Escape</bdi> بىلەن تاقاڭ. فوكۇس ئېچىش كۇنۇپكىسىغا قايتسۇن.</li></ol>
<h2 id="quick-package">قاچىلانغان بوغچىغا ماسلاشتۇرۇش</h2>
<p>قۇرۇلۇش قورالى بار تۈرگە كۆچۈرگەندە نىسپىي CSS ئۇلانمىسىنىڭ ئورنىغا تۈرىڭىزنىڭ كىرىش ھۆججىتىدە بوغچا CSS نى import قىلىڭ؛ كونترول import يولىنىمۇ بوغچا نامىغا ئالماشتۇرۇڭ.</p>
${code('js', `import '@uyghurcommunity/ui/styles.css';
import { bindDialog, bindForm } from '@uyghurcommunity/ui';`)}
${note('فورما نەتىجىسى', 'مىسالدىكى onValid پەقەت ئېكراندىكى يەرلىك ئۇچۇرنى يېڭىلايدۇ. ھەقىقىي ساقلاش ياكى ئەۋەتىش ئۈچۈن ئۆز مۇلازىمېتىرىڭىز ۋە مۇلازىمېتىر تەرەپ تەكشۈرۈشى لازىم.')}
<h2 id="quick-next">كېيىنكى قەدەم</h2><p><a href="components.html">كارتا ۋە يولباشلاش بۆلەكلىرى</a>نى قوشۇڭ، <a href="theming.html">رەڭنى خاسلاشتۇرۇڭ</a> ياكى <a href="icons.html">مەدەنىيەت سىنبەلگىسى</a>نى تاللاڭ.</p>`,
  },
  {
    slug: 'components', title: 'بۆلەكلەر', en: 'Components', group: 'components',
    description: 'ھەر بىر بۆلەكنىڭ HTML ئۇسلۇبى، JavaScript تەلىپى ۋە بىۋاسىتە سىناق مىسالى.',
    body: `
<h2 id="components-choose">لازىملىق بۆلەكنى تاللاڭ</h2>
<p>ئۇسلۇب ھۆججىتىنى بىر قېتىم يۈكلەپ، مەزمۇننى <code dir="ltr">ug-ui</code> قاچىسىغا قويۇڭ. كۆرگەزمىدىكى كود كۆچۈرۈش كۇنۇپكىسى HTML، لازىملىق كونترول ۋە تەييار SVG نى بىللە بېرىدۇ.</p>
${table(['بۆلەك', 'ئاساسىي سىنىپ ياكى كونترول', 'مىسال'], [
  ['كۇنۇپكا', '<code dir="ltr">ug-button</code>', '<a href="../index.html#component-buttons">سىناش</a>'],
  ['فورما', '<code dir="ltr">ug-field · ug-input · bindForm</code>', '<a href="../index.html#component-forms">سىناش</a>'],
  ['سۆزلىشىش كۆزنىكى', '<code dir="ltr">ug-dialog · bindDialog</code>', '<a href="../index.html#component-dialog">سىناش</a>'],
  ['بەتكۈچ', '<code dir="ltr">ug-tabs · bindTabs</code>', '<a href="../index.html#component-tabs">سىناش</a>'],
  ['يولباشلاش', '<code dir="ltr">ug-nav · bindDisclosure</code>', '<a href="../index.html#component-navigation">سىناش</a>'],
  ['كارتا ۋە بەلگە', '<code dir="ltr">ug-card · ug-badge · ug-avatar</code>', '<a href="../index.html#component-cards">سىناش</a>'],
  ['يىغىلىدىغان مەزمۇن', '<code dir="ltr">ug-accordion · details</code>', '<a href="../index.html#component-accordion">سىناش</a>'],
  ['ئۇقتۇرۇش ۋە جەريان', '<code dir="ltr">ug-alert · ug-progress · showToast</code>', '<a href="../index.html#component-feedback">سىناش</a>'],
])}
<h2 id="components-buttons">كۇنۇپكا ۋە ئۇلانما</h2>
<p>بەت ئىچىدە ھەرىكەت ئىجرا قىلغاندا <code dir="ltr">button</code>، باشقا ئادرېسقا بارغاندا <code dir="ltr">a</code> ئىشلىتىڭ. شەكىل سىنىپى ئېلېمېنتنىڭ ئەسلى مەنىسىنى ئالماشتۇرمايدۇ.</p>
${code('html', `<div class="ug-row">
  <button class="ug-button" type="button">ساقلاش</button>
  <button class="ug-button ug-button--secondary" type="button">بىكار قىلىش</button>
  <button class="ug-button ug-button--danger" type="button">ئۆچۈرۈش</button>
  <a class="ug-button ug-button--ghost" href="./installation.html">قاچىلاش</a>
</div>`)}
<p><code dir="ltr">ug-button--small</code> كىچىك كۆرۈنۈش ئۈچۈن، <code dir="ltr">ug-button--icon</code> پەقەت سىنبەلگىلىك كۇنۇپكا ئۈچۈن. كېيىنكىسىگە چوقۇم <code dir="ltr">aria-label</code> ياكى كۆرۈنىدىغان نام بېرىڭ.</p>
<h2 id="components-fields">رامكا، تاللاش ۋە گۇرۇپپا</h2>
<p>رامكىنىڭ بەلگىسىنى <code dir="ltr">label for</code> بىلەن باغلاڭ. رادىئو تاللاشلىرى ئۈچۈن <code dir="ltr">fieldset</code> ۋە <code dir="ltr">legend</code> نى ئىشلىتىڭ. خاتالىقنى رەڭدىن باشقا تېكىست بىلەنمۇ كۆرسىتىڭ.</p>
${code('html', `<div class="ug-field">
  <label class="ug-label" for="email">ئېلخەت</label>
  <input class="ug-input" id="email" name="email" type="email" required
    dir="ltr" aria-describedby="email-error" data-ug-error="email-error">
  <span class="ug-error" id="email-error"></span>
</div>`)}
<p>تاللاش ۋە ئۇزۇن تېكىست ئۈچۈن <code dir="ltr">ug-select</code>، <code dir="ltr">ug-textarea</code> بار. تاللاش بەلگىسى ۋە ئالماشتۇرغۇچقا <code dir="ltr">ug-check</code>، <code dir="ltr">ug-switch</code> ئىشلىتىڭ. ئۇلارنىڭ ئىچىدە ھەقىقىي input بولىدۇ.</p>
<h2 id="components-layout">بۆلەكلەرنى بىرلەشتۈرۈش</h2>
${code('html', `<div class="ug-columns">
  <article class="ug-card">
    <span class="ug-badge">ئوچۇق مەنبە</span>
    <h2>بىر ئىدىيە، كۆپ ئىمكانىيەت.</h2>
    <p>تۈرىڭىزنىڭ ھەقىقىي مەزمۇنىنى بۇ يەرگە قويۇڭ.</p>
  </article>
  <aside class="ug-alert"><p>داۋاملاشتۇرۇشتىن بۇرۇن مەزمۇننى تەكشۈرۈڭ.</p></aside>
</div>`)}
<p><code dir="ltr">ug-row</code> بۆلەكلەرنى بىر قۇرغا تىزىپ، تار ئېكراندا كېيىنكى قۇرغا يۆتكەيدۇ. <code dir="ltr">ug-columns</code> ئىككى ستوننى كىچىك ئېكراندا بىر ستونغا ئايلاندۇرىدۇ. كۆپرەك كونترول لازىم بولسا <a href="javascript.html">JavaScript API</a> نى كۆرۈڭ.</p>`,
  },
  {
    slug: 'javascript', title: 'JavaScript API', en: 'JavaScript API', group: 'components',
    description: 'كونترولنى باغلاش، ئىشلىتىش ۋە تازىلاش؛ SVG ھاسىل قىلىش ۋە سىنبەلگە ئىزدەش كۆرۈنمە يۈزى.',
    body: `
<h2 id="api-imports">كىرگۈزۈش ۋە ھايات دەۋرى</h2>
${code('js', `import {
  bindDialog, bindDisclosure, bindTabs, bindForm, validateForm, showToast,
  iconSVG, flagSVG, mapSVG, mapMetadata, iconNames, coloredIconNames, directionalIcons,
  iconCatalog, iconCategories, findIcons,
} from '@uyghurcommunity/ui';`)}
<p>يىلتىز import ھۆججىتى يۈكلەنگەندە DOM غا كىرمەيدۇ. كونترولنى باغلاشنى ئېلېمېنت قۇرۇلغاندىن كېيىن قىلىڭ. رامكا تەركىبى ياكى بەت پارچىسى ئۆچۈرۈلگەندە ئۇنىڭ <code dir="ltr">destroy()</code> نى چاقىرىڭ؛ يېڭى DOM غا يېڭى كونترول باغلاڭ.</p>
<h2 id="api-dialog">bindDialog</h2>
${code('js', `const dialog = bindDialog(document.getElementById('settings'), {
  trigger: document.getElementById('open-settings'),
  initialFocus: document.getElementById('settings-title'),
});
dialog.open();
dialog.close('saved');
// When the owning view is removed:
dialog.destroy();`)}
<p>بىرىنچى پارامېتىر <code dir="ltr">showModal()</code> ۋە <code dir="ltr">close()</code> نى قوللايدىغان يەرلىك dialog بولۇشى كېرەك. ئۇنىڭغا <code dir="ltr">aria-label</code> ياكى <code dir="ltr">aria-labelledby</code> بېرىڭ. ئىچىدىكى <code dir="ltr">data-ug-close</code> كۇنۇپكىسى تاقايدۇ؛ قىممىتى native close نەتىجىسىگە ئۆتىدۇ. تاقىغاندا ئالدىنقى فوكۇس ئەگەر ھېلىمۇ بەتتە بولسا قايتۇرۇلىدۇ. بۇ كونترول يەرلىك dialog قوللىشىنىڭ ئورنىنى باسىدىغان polyfill ئەمەس.</p>
<h2 id="api-disclosure-tabs">bindDisclosure ۋە bindTabs</h2>
${code('js', `const menu = bindDisclosure(button, panel);
menu.setOpen(true);
menu.toggle();
menu.destroy();

const tabs = bindTabs(document.getElementById('tabs'));
tabs.select(document.getElementById('tab-two'), true);
tabs.destroy();`)}
<p>Disclosure غا button ۋە panel بېرىڭ، HTML دا <code dir="ltr">aria-controls</code> نى توغرا باغلاڭ. ئۇ expanded ۋە hidden ھالىتىنى باشقۇرىدۇ؛ ئىچكى مەزمۇندا Escape بېسىلسا يېپىلىدۇ.</p>
<p>Tabs قاچىسى ئىچىدىكى بىرىنچى <code dir="ltr">role="tablist"</code> غا باغلىنىدۇ. ھەر بىر tab نىڭ <code dir="ltr">aria-controls</code> قىممىتى شۇ قاچىدىكى ئۆزگىچە panel غا باغلانسۇن. <code dir="ltr">aria-labelledby</code> بىلەن panel نامىنى كۆرسىتىڭ. كەم دېگەندە بىر ئىشلەتكىلى بولىدىغان tab لازىم؛ تاللانغان tab بەلگىلەنمىگەن بولسا، بىرىنچى ئىشلەتكىلى بولىدىغان tab تاللىنىدۇ. <code dir="ltr">select(tab, true)</code> تاللىغاندىن كېيىن فوكۇسنىمۇ يۆتكەيدۇ؛ چەكلەنگەن ياكى باشقا گۇرۇپپىدىكى tab تاللانسا <code dir="ltr">RangeError</code> چىقىدۇ.</p>
<h2 id="api-forms">validateForm ۋە bindForm</h2>
${code('js', `const errors = validateForm(form, {
  messages: { email: 'ئېلخەت ئادرېسىنى قايتا تەكشۈرۈڭ.' },
});
// errors: [{ field, message }]

const controller = bindForm(form, {
  messages: { name: 'ئىسمىڭىزنى تولدۇرۇڭ.' },
  onValid(form, event) {
    // Your application handles this valid submission.
  },
});
controller.validate();
controller.destroy();`)}
<p><code dir="ltr">messages</code> رامكىنىڭ <code dir="ltr">name</code> قىممىتىدىن خاتالىق تېكىستىگە بارىدىغان خەرىتە. ئۆز ئۇچۇرىڭىز بولمىسا ئادەتتىكى validity خاتالىقلىرىغا ماس ئۇيغۇرچە سۈكۈتتىكى ئۇچۇر ئىشلىتىلىدۇ. ئايرىم <code dir="ltr">customError</code> ياكى <code dir="ltr">stepMismatch</code> ھالىتىدە native خاتالىق تېكىستى توركۆرگۈچ تىلىدا قايتىشى مۇمكىن؛ تولۇق يەرلىكلەشتۈرۈش ئۈچۈن شۇ رامكىغا ئۆز ئۇچۇرىڭىزنى بېرىڭ. <code dir="ltr">data-ug-error</code> خاتالىق span نىڭ ID سىغا، <code dir="ltr">aria-describedby</code> ياردەم ۋە خاتالىق ID لىرىغا باغلانسۇن.</p>
<p><code dir="ltr">validateForm</code> نەتىجە تىزىملىكىنى قايتۇرىدۇ ۋە رامكىلارنىڭ خاتالىق ھالىتىنى يېڭىلايدۇ. <code dir="ltr">bindForm</code> باغلانغان ۋاقىتتا <code dir="ltr">novalidate</code> نى باشقۇرۇپ، خاتا فورمىنىڭ بىرىنچى رامكىسىغا فوكۇس يۆتكەيدۇ. <code dir="ltr">onValid</code> بولسا توغرا يوللاشنى يەرلىك callback تا بىر تەرەپ قىلىدۇ؛ بولمىسا توغرا native يوللاش داۋاملىشىدۇ. <code dir="ltr">destroy()</code> ئەسلى novalidate، باشقۇرۇلغان aria-invalid ۋە خاتالىق تېكىستىنى ئەسلىگە قايتۇرىدۇ.</p>
<h2 id="api-toast">showToast</h2>
${code('html', `<div id="notifications" class="ug-toast-region"
  role="status" aria-live="polite" aria-relevant="additions text"></div>`)}
${code('js', `const toast = showToast(
  document.getElementById('notifications'),
  'مەزمۇن ساقلىنىشقا تەييار.',
  { duration: 0, dismissLabel: 'ئۇقتۇرۇشنى تاقاش' },
);
// toast.element is the created element.
// toast.dismiss() and toast.destroy() both remove it.`)}
<p>ئۇقتۇرۇش مەزمۇنى HTML ئەمەس، ئاددىي تېكىست سۈپىتىدە قويۇلىدۇ. سۈكۈتتىكى ۋاقىت <bdi dir="ltr">8000 ms</bdi>؛ <code dir="ltr">duration: 0</code> بولسا ئادەم تاقىغۇچە قالىدۇ. مۇھىم نەتىجە ياكى خاتالىق ئۈچۈن ۋاقىت چەكلىمىسىز ئۇچۇرنى تاللاڭ.</p>
<h2 id="api-icons">SVG ۋە ئىزدەش API</h2>
${table(['نام', 'نەتىجە'], [
  ['<code dir="ltr">iconSVG(name, { size, strokeWidth, label, variant })</code>', 'SVG تېكىستى. چوڭلۇق 24، strokeWidth بولسا 1.7؛ سۈكۈتتىكى variant بولسا outline.'],
  ['<code dir="ltr">flagSVG({ width, label })</code>', 'كەڭلىك/ئېگىزلىك نىسبىتى 3:2 بولغان بايراق SVG تېكىستى.'],
  ['<code dir="ltr">mapSVG({ width, variant, label, color, strokeWidth })</code>', 'شەرقىي تۈركىستان خەرىتىسى؛ outline ياكى filled. كەڭلىك 640، رەڭ currentColor، سىزىق قېلىنلىقى 4.'],
  ['<code dir="ltr">mapMetadata</code>', 'مەنبە، ئىجازەتنامە، جۇغراپىيەلىك دائىرە ۋە projection ئۇچۇرى؛ چوڭقۇر توڭلىتىلغان.'],
  ['<code dir="ltr">findIcons(query, { category })</code>', 'سۆز ۋە تۈرگە ماس سىنبەلگە ناملىرىدىن يېڭى تىزىملىك.'],
  ['<code dir="ltr">iconNames · coloredIconNames · directionalIcons</code>', '110 سىنبەلگە نامى، رەڭلىك نۇسخىسى بار 63 نام ۋە ئوق تاللاشقا ياردەمچى ناملار.'],
  ['<code dir="ltr">iconCatalog · iconCategories</code>', 'ئىككى تىللىق metadata؛ ھەر سىنبەلگىنىڭ variants مەيدانى بار نۇسخىلارنى كۆرسىتىدۇ.'],
])}
<p>سىنبەلگە، بايراق ۋە ئىزدەش export لىرى يىلتىز import ۋە <code dir="ltr">@uyghurcommunity/ui/icons</code> دا بار. خەرىتە API سى يىلتىز import ۋە <code dir="ltr">@uyghurcommunity/ui/maps</code> دا بار. <code dir="ltr">escapeMarkup(value)</code> پەقەت icons تارماق import ىدا بار؛ ئۇ markup ئۈچۈن بەلگىلەرنى escape قىلىدۇ، URL ياكى CSS تەكشۈرگۈچ ئەمەس. تەپسىلاتنى <a href="icons.html">سىنبەلگە ۋە خەرىتە قوللانمىسى</a>دىن كۆرۈڭ.</p>
<h2 id="api-errors">پارامېتىر ۋە خاتالىق</h2>
<p>يوق ياكى ماس كەلمەيدىغان DOM ئېلېمېنتى ئۈچۈن <code dir="ltr">TypeError</code> چىقىشى مۇمكىن. سىنبەلگە نامى، نۇسخا ۋە تۈر نامى allowlist بويىچە تەكشۈرۈلىدۇ. icon چوڭلۇقى پۈتۈن سان <bdi dir="ltr">12–256</bdi>، strokeWidth بولسا <bdi dir="ltr">0.5–4</bdi>؛ flag كەڭلىكى پۈتۈن سان <bdi dir="ltr">24–1800</bdi> بولسۇن. خەرىتە كەڭلىكى پۈتۈن سان <bdi dir="ltr">64–2048</bdi>، strokeWidth بولسا <bdi dir="ltr">0.5–12</bdi>؛ color پەقەت <code dir="ltr">currentColor</code>، <code dir="ltr">#RGB</code> ياكى <code dir="ltr">#RRGGBB</code> بولسۇن. نام بەلگىسى 160 ھەرپتىن ئاشمىسۇن. ئۆچۈرۈلگەن binding نى قايتا open/select/validate/setOpen قىلىش ئورنىغا يېڭى binding قۇرۇڭ.</p>`,
  },
  {
    slug: 'icons', title: 'سىنبەلگىلەر ۋە مەدەنىيەت توپلىمى', en: 'Icons and cultural collection', group: 'components',
    description: '110 SVG سىنبەلگە، 63 مەدەنىيەت بەلگىسىنىڭ رەڭلىك نۇسخىسى، بايراق ۋە مەنبەسى ئېنىق خەرىتە.',
    body: `
<h2 id="icons-collections">ئۆز لايىھەڭىزگە بىر مەنىلىك بەلگە</h2>
<p>0.4.0 نەشرىدە 110 ئەسلى SVG سىنبەلگە بار؛ بۇنىڭ 63 ى مەدەنىيەت توپلىمىغا كىرىدۇ ۋە سىزىقلىق، رەڭلىك ئىككى نۇسخىنى تەمىنلەيدۇ. 0.3.0 دە 36 يېڭى تېما قوشۇلغان: دوپپا، ئەنئەنىۋى كىيىم، ساز، ساپال، بىناكارلىق، مەنزىرە ۋە گۈل نەقىشلىرىنى <a href="../index.html#icons">كۆرگەزمىدىن تاللاپ سىناڭ</a>.</p>
<p>بۇلار رەقەملىك كۆرۈنمە يۈز ئۈچۈن ئەسلىدىن سىزىلغان ئاددىي مەدەنىيەت پىكتوگراممىلىرى. رايونغا قاراپ شەكىل ۋە ئاتىلىش ئۆزگىرىدۇ. ئىشلەتكۈچى تەمىنلىگەن ئىككى مەدەنىيەت تاختىسى تېما تاللاشقا ئىلھام بولدى؛ ئۇلاردىكى سۈرەتلەر بوغچىغا كۆچۈرۈلمىدى. چەمبەر شەكىللىك ئۇرما ساز <b>داپ</b> دەپ ئاتالدى؛ <b>تەمبۈر</b> بولسا ئايرىم ئۇزۇن بويۇنلۇق چالغۇ سۈپىتىدە ساقلانغان. مەنبە ۋە ئاتىلىش خاتىرىلىرى <a href="../THIRD_PARTY_NOTICES.md">مەنبە خاتىرىسى</a>دە بار.</p>
<h2 id="icons-render">JavaScript بىلەن SVG ھاسىل قىلىش</h2>
${code('js', `import { iconSVG, flagSVG } from '@uyghurcommunity/ui';

const dutar = iconSVG('dutar', { size: 48, label: 'دۇتار' });
const colorfulDutar = iconSVG('dutar', { size: 64, variant: 'color', label: 'دۇتار' });
const decorative = iconSVG('flower', { size: 24 });
const flag = flagSVG({ width: 180, label: 'شەرقىي تۈركىستان بايرىقى' });

document.getElementById('instrument').innerHTML = dutar;`)}
<p>ئاخىرقى قۇردىكى قاچىڭىز <code dir="ltr">&lt;span id="instrument"&gt;&lt;/span&gt;</code> بولسۇن. كۈتۈپخانا مەلۇم سىنبەلگە نامىنىلا قوبۇل قىلىپ، label نى escape قىلىدۇ. باشقا مەنبەدىن كەلگەن خالىغان HTML نى بۇ ئۇسۇلدا كىرگۈزمەڭ.</p>
<p>مەنىسى بار يالغۇز سىنبەلگىگە ئۇيغۇرچە <code dir="ltr">label</code> بېرىڭ؛ ئۇنىڭغا <code dir="ltr">role="img"</code> قوشۇلىدۇ. بەلگە بوش بولسا سىنبەلگە بېزەك سۈپىتىدە <code dir="ltr">aria-hidden="true"</code> بولىدۇ. ئىچىدە سىنبەلگە بار كۇنۇپكىنىڭ ئۆزىگە نام بېرىشنىمۇ ئۇنتۇماڭ.</p>
<h2 id="icons-search">نام ۋە تۈر بويىچە ئىزدەش</h2>
${code('js', `import { findIcons, iconCatalog, iconCategories, coloredIconNames } from '@uyghurcommunity/ui';

findIcons('راۋاب'); // ['rawap']
findIcons('ikat'); // matching cultural names
findIcons('', { category: 'music' }); // seven instrument names

const details = iconCatalog.find((icon) => icon.name === 'dutar');
console.log(details.ug, details.en, details.category, details.variants);
console.log(coloredIconNames.includes('dutar')); // true`)}
${table(['تۈر نامى', 'مەزمۇن'], [
  ['<code dir="ltr">all</code>', '110 سىنبەلگىنىڭ ھەممىسى.'],
  ['<code dir="ltr">traditional</code>', '63 مەدەنىيەت سىنبەلگىسى ۋە نەقىش.'],
  ['<code dir="ltr">music · textiles · architecture</code>', 'سازلار، توقۇمىچىلىق/نەقىش ۋە بىناكارلىق.'],
  ['<code dir="ltr">clothing · crafts · motifs</code>', 'ئەنئەنىۋى كىيىم، قول ھۈنەرۋەنچىلىك ۋە بېزەك نەقىشلىرى.'],
  ['<code dir="ltr">table · garden · general</code>', 'داستىخان، تەبىئەت/مەنزىرە/جانلىقلار ۋە ئادەتتىكى كۆرۈنمە يۈز سىنبەلگىلىرى.'],
])}
<p>ئىزدەش ئۇيغۇرچە نام، ئىنگلىزچە نام ۋە يىپ ئۇچلىرىنى ئۆز ئىچىگە ئالىدۇ. تۈر ۋە سوئال بىللە سۈزۈلىدۇ؛ مەسىلەن ساز نامىنى داستىخان تۈرىدە ئىزدىگەندە بوش نەتىجە چىقىشى نورمال.</p>
<h2 id="icons-files">مۇستەقىل SVG ۋە JSON</h2>
<ul><li><a href="../downloads/uyghur-traditional-icons.zip">مەدەنىيەت SVG توپلىمى</a> — 63 سىزىقلىق ۋە 63 رەڭلىك سىنبەلگە.</li><li><a href="../downloads/uyghur-ui-icons.zip">تولۇق SVG توپلىمى</a> — 110 سىزىقلىق ۋە 63 رەڭلىك سىنبەلگە.</li><li><a href="../assets/icon-catalog.json">ئىككى تىللىق JSON</a> — نام، تۈر، نۇسخا ۋە ئىزدەش يىپ ئۇچلىرى.</li></ul>
<p>ئىككى SVG ئارخىپىغا بايراق، ئىككى خەرىتە، خەرىتە مەنبەسى ۋە metadata، ئىجازەتنامە ۋە مەنبە خاتىرىسىمۇ قوشۇلغان.</p>
<p>قاچىلانغان بوغچىدىكى ھۆججەت تارماق يوللىرى:</p>
${code('text', `@uyghurcommunity/ui/icons/dutar
@uyghurcommunity/ui/icons/color/dutar
@uyghurcommunity/ui/flags/east-turkistan.svg
@uyghurcommunity/ui/catalog.json`)}
<p>سىنبەلگە تارماق يولىغا <code dir="ltr">.svg</code> قوشۇلمايدۇ. رېپودىكى ھەقىقىي ھۆججەت يولى بولسا <code dir="ltr">assets/icons/dutar.svg</code>. بوغچا يولىنى static asset URL غا ئايلاندۇرۇش ئۇسۇلى تۈرىڭىزنىڭ قۇرۇلۇش قورالىغا باغلىق؛ ھۆججەتنى ئۆز public مۇندەرىجىڭىزگە كۆچۈرۈپ، ئادەتتىكى img بىلەنمۇ كۆرسىتەلەيسىز.</p>
<h2 id="icons-color">سىزىقلىق ۋە رەڭلىك نۇسخا</h2>
${code('js', `import { iconSVG, coloredIconNames } from '@uyghurcommunity/ui/icons';

iconSVG('ceramic-vase', { variant: 'outline', size: 64 });
iconSVG('ceramic-vase', { variant: 'color', size: 64 });
iconSVG('search', { variant: 'color' }); // outline fallback
console.log(coloredIconNames.length); // 63`)}
<p>سۈكۈتتىكى نۇسخا <code dir="ltr">outline</code>. 63 مەدەنىيەت سىنبەلگىسىدە <code dir="ltr">color</code> نۇسخىسى بار؛ قالغان 47 ئادەتتىكى UI سىنبەلگىسىدە رەڭلىك نۇسخا سورالسا سىزىقلىق نۇسخىسى قايتىدۇ. <code dir="ltr">iconCatalog</code> نىڭ <code dir="ltr">variants</code> مەيدانى ياكى <code dir="ltr">coloredIconNames</code> بىلەن قوللاشنى تەكشۈرەلەيسىز.</p>
${code('html', `<span class="instrument" id="instrument"></span>
<style>
  .instrument { color: #086aa7; }
</style>`)}
<p>سىزىقلىق سىنبەلگە <code dir="ltr">currentColor</code> غا ئەگىشىدۇ؛ رەڭلىك نۇسخا ئۆزىنىڭ بېكىتىلگەن رەڭ تاختىسىنى ئىشلىتىدۇ. سىرتقى img ھۆججىتى ئىچىدىكى رەڭ بەتنىڭ color قىممىتىگە ئۆزلۈكىدىن ۋارىسلىق قىلمايدۇ. SVG لار RTL دا ئۆزلۈكىدىن ئەينەككە ئايلاندۇرۇلمايدۇ؛ ھەرىكەت مەنىسىگە ماس ئوقنى تاللاڭ. بايراقنىڭ ئاي ۋە يۇلتۇز شەكلىمۇ ئەينەككە ئايلاندۇرۇلمايدۇ.</p>
<h2 id="icons-map">شەرقىي تۈركىستان خەرىتىسى</h2>
<p><a href="../index.html#map">خەرىتە كۆرگەزمىسى</a>دە سىزىقلىق ۋە تولدۇرۇلغان ئىككى نۇسخا بار. بۇ توپلامدىكى «شەرقىي تۈركىستان» خەرىتىسى <bdi dir="ltr" lang="en">Natural Earth 1:10,000,000 Admin 1</bdi> سانلىق مەلۇماتىدىكى شىنجاڭ مەمۇرىي رايون پولىگونىنى ئىشلىتىدۇ: <code dir="ltr">CHN-1756 / CN-XJ</code>، layer <code dir="ltr">5.1.1</code>، repository release <code dir="ltr">v5.1.2</code>. بۇ مەنبەدىكى زامانىۋى مەمۇرىي سىزىق؛ تارىخىي چېگرالارنى قايتا قۇرغان خەرىتە ئەمەس.</p>
${code('js', `import { mapSVG, mapMetadata } from '@uyghurcommunity/ui/maps';

const outline = mapSVG({ width: 640, variant: 'outline',
  label: 'شەرقىي تۈركىستان خەرىتىسى' });
const filled = mapSVG({ width: 640, variant: 'filled', color: '#559EE2',
  strokeWidth: 4, label: 'شەرقىي تۈركىستان خەرىتىسى' });
console.log(mapMetadata.source.layerVersion); // '5.1.1'
console.log(mapMetadata.projection.viewBox); // '0 0 1024 906'`)}
<p><code dir="ltr">mapSVG()</code> نىڭ سۈكۈتتىكى كەڭلىكى 640، نۇسخىسى outline، رەڭگى currentColor، سىزىق قېلىنلىقى 4؛ ئۇيغۇرچە خەرىتە نامى بار. كەڭلىك پۈتۈن سان <bdi dir="ltr">64–2048</bdi>، سىزىق قېلىنلىقى <bdi dir="ltr">0.5–12</bdi> بولسۇن. رەڭ قىممىتى <code dir="ltr">currentColor</code>، <code dir="ltr">#RGB</code> ياكى <code dir="ltr">#RRGGBB</code>؛ label ئەڭ كۆپ 160 ھەرپ. خەرىتە ھاسىل قىلىش DOM، خەت ھۆججىتى ياكى تور تەلىپىگە تايانمايدۇ.</p>
<p>ھەر ئىككى نۇسخا <code dir="ltr">0 0 1024 906</code> viewBox ۋە <bdi dir="ltr">42°N</bdi> ئۆلچەملىك پاراللېللىق equirectangular projection نى ئىشلىتىدۇ. ئەسلىدىكى 1,835 نۇقتىنىڭ ھەممىسى ساقلانغان؛ ئاددىيلاشتۇرۇش قوللىنىلمىغان. شىمال يۇقىرىدا، شەرق ئوڭدا تۇرىدۇ؛ RTL ئۈچۈن خەرىتىنى ئەينەككە ئايلاندۇرماڭ.</p>
<ul><li><a href="../assets/maps/east-turkistan-outline.svg" download>سىزىقلىق SVG</a> ۋە <a href="../assets/maps/east-turkistan-filled.svg" download>تولدۇرۇلغان SVG</a>.</li><li><a href="../downloads/east-turkistan-map.zip">خەرىتە ZIP توپلىمى</a>.</li><li><a href="../assets/maps/east-turkistan.source.geojson">ئەسلى GeoJSON</a>، <a href="../assets/maps/east-turkistan.metadata.json">metadata ۋە مەنبە</a>.</li></ul>
${code('text', `@uyghurcommunity/ui/maps
@uyghurcommunity/ui/maps/east-turkistan-outline.svg
@uyghurcommunity/ui/maps/east-turkistan-filled.svg
@uyghurcommunity/ui/maps/metadata.json
@uyghurcommunity/ui/maps/source.geojson`)}
<p>خەرىتە سانلىق مەلۇماتى <a href="https://www.naturalearthdata.com/about/terms-of-use/">ئاممىۋى مۈلۈك</a>. <bdi dir="ltr" lang="en">Made with Natural Earth.</bdi> <a href="https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-1-states-provinces/">سانلىق مەلۇمات چۈشەندۈرۈشى</a> ۋە <a href="../assets/maps/README.md">قايتا ھاسىل قىلىش خاتىرىسى</a> سانلىق مەلۇمات نەشرى، projection ۋە دائىرىنى ئېنىق كۆرسىتىدۇ.</p>`,
  },
  {
    slug: 'theming', title: 'رەڭ، خەت ۋە خاسلاشتۇرۇش', en: 'Theming', group: 'guides',
    description: 'CSS ئۆزگەرگۈچىلىرى بىلەن بۆلەكلەرنى مەھسۇلاتىڭىزنىڭ رەڭ ۋە خەت تىلىغا ماسلاشتۇرۇڭ.',
    body: `
<h2 id="theme-tokens">ئاساسىي CSS ئۆزگەرگۈچىلىرى</h2>
<p>توپلام CSS ئۆزگەرگۈچىلىرىنى ئىشلىتىدۇ. ئۆز CSS ھۆججىتىڭىزنى كۈتۈپخانا ئۇسلۇبىدىن كېيىن يۈكلەپ، ئۆزگەرتىشنى بىر قاچىنىڭ دائىرىسىگە بەلگىلەڭ.</p>
${table(['ئۆزگەرگۈچى', 'مەنىسى', 'سۈكۈتتىكى قىممەت'], [
  ['<code dir="ltr">--ug-blue</code>', 'ئاساسىي ھەرىكەت رەڭگى', '<code dir="ltr">#086aa7</code>'],
  ['<code dir="ltr">--ug-blue-hover</code>', 'ئاساسىي كۇنۇپكا hover رەڭگى', '<code dir="ltr">#075687</code>'],
  ['<code dir="ltr">--ug-accent</code>', 'تەكىتلەش رەڭگى', '<code dir="ltr">#559ee2</code>'],
  ['<code dir="ltr">--ug-surface · --ug-bg</code>', 'كارتا ۋە بەت تەگلىكى', '<code dir="ltr">#fff · #f4f7f9</code>'],
  ['<code dir="ltr">--ug-text · --ug-muted</code>', 'ئاساسىي ۋە ياردەم تېكىست رەڭگى', '<code dir="ltr">#152d3d · #566b78</code>'],
  ['<code dir="ltr">--ug-line · --ug-soft</code>', 'سىزىق ۋە يېنىك تەگلىك', '<code dir="ltr">#c9d7df · #e8f3fc</code>'],
  ['<code dir="ltr">--ug-radius</code>', 'كونترول يۇمىلاق بۇلۇڭى', '<code dir="ltr">10px</code>'],
  ['<code dir="ltr">--ug-focus · --ug-danger</code>', 'فوكۇس ۋە خاتالىق رەڭگى', '<code dir="ltr">#126ca4 · #b43137</code>'],
])}
${code('css', `.my-product {
  --ug-blue: #146650;
  --ug-blue-hover: #0c503e;
  --ug-accent: #2b8a6b;
  --ug-focus: #146650;
  --ug-radius: 14px;
}`)}
<h2 id="theme-dark">قاراڭغۇ كۆرۈنۈش</h2>
<p>كۆرۈنمە يۈز قاچىسى ياكى html ئېلېمېنتىغا <code dir="ltr">data-ug-theme="dark"</code> قوشۇڭ. بۇ attribute نى ئېلىۋەتسىڭىز سۈكۈتتىكى رەڭلەرگە قايتىدۇ. تاللاشنى ساقلاشنى تۈرىڭىز باشقۇرىدۇ.</p>
${code('html', `<main class="ug-ui" data-ug-theme="dark" lang="ug" dir="rtl">
  <button class="ug-button" type="button">داۋاملاشتۇرۇش</button>
</main>`)}
${code('js', `document.documentElement.dataset.ugTheme = 'dark';
// Return to the default light palette:
delete document.documentElement.dataset.ugTheme;`)}
<h2 id="theme-font">ALKATIP Basma ۋە زاپاس خەت</h2>
<p><code dir="ltr">styles.css</code> نىڭ ئىچىدىن <code dir="ltr">font.css</code> يۈكلىنىدۇ. ئۇ ALKATIP Basma نى خوجايىن تەمىنلىگەن OnlineWebFonts ئادرېسلىرىدىن WOFF2، WOFF، TTF تەرتىپىدە سورايدۇ. <code dir="ltr">font-display: swap</code> ئارقىلىق خەت كېلىشتىن بۇرۇن زاپاس خەتتە مەزمۇن كۆرۈنىدۇ؛ خەت binary ھۆججىتى بوغچىغا قوشۇلمىغان.</p>
${code('css', `.my-product {
  --ug-font: "ALKATIP Basma", Tahoma, serif;
}
.my-product .technical-value {
  font-family: ui-monospace, "ALKATIP Basma", monospace;
}`)}
<p>باشقا خەتنى ئىشلىتىش ئۈچۈن ئۇنىڭ توردا ئىشلىتىش ھوقۇقى ۋە يۈكلەش ئۇسۇلىنى تەكشۈرۈپ، ئۆز خەت ئۇسلۇبىڭىزنى تەمىنلەڭ. قاتتىق CSP ياكى سىرتقى تەلەپسىز ئورۇنلاشتۇرۇش ئۈچۈن خەت import تەلىپىنىمۇ ئۆزىڭىزگە ماسلاشتۇرۇشىڭىز كېرەك؛ يالغۇز token نى ئالماشتۇرۇش بار بولغان font import نى ئېلىۋەتمەيدۇ.</p>
<h2 id="theme-spacing">بوشلۇق ۋە چوڭلۇق</h2>
<p>بارلىق نەرسىگە بىر line-height بەرمەڭ. ئۇيغۇرچە ئوقۇش مەزمۇنىغا يېتەرلىك قۇر ئارىلىقى قالدۇرۇپ، كود ۋە قىسقا تېخنىكىلىق قىممەتنى ئايرىم LTR قاچىدا ساقلاڭ. ئۆزگەرتكەن رەڭلىرىڭىزنى ئادەتتىكى، hover، چەكلەنگەن، خاتا ۋە فوكۇسلانغان ھالەتلەردە قايتا تەكشۈرۈڭ.</p>`,
  },
  {
    slug: 'rtl', title: 'RTL ۋە ئارىلاش يېزىق', en: 'RTL and mixed text', group: 'guides',
    description: 'ئۇيغۇرچە يۆنىلىش، ئىنگلىزچە تېخنىكىلىق قىممەت ۋە سانلارنى بىر بەتتە ئېنىق ساقلاش.',
    body: `
<h2 id="rtl-document">بەت تىلى ۋە ئاساسىي يۆنىلىش</h2>
${code('html', `<html lang="ug" dir="rtl">
  <body class="ug-ui">...</body>
</html>`)}
<p><code dir="ltr">lang</code> تىلنى، <code dir="ltr">dir</code> يېزىق يۆنىلىشىنى بەلگىلەيدۇ. مەزمۇن تىلى ئۆزگەرگەن پارچىدا شۇ پارچىنىڭ تىلى ۋە يۆنىلىشىنى ئايرىم بەلگىلەڭ. خەتنى راستقا توغرىلاش يالغۇز ئۆزى RTL مەنىسىنى بەلگىلىمەيدۇ.</p>
<h2 id="rtl-isolation">سان، ئادرېس ۋە بوغچا نامى</h2>
<p>تېخنىكىلىق قىممەتلەرنى ئايرىۋېتىش تىنىش بەلگىلىرىنىڭ ئەتراپتىكى جۈملىگە ئارىلىشىپ كېتىشىنى ئازايتىدۇ. مەزمۇننى ئۆزگەرتىشنىڭ ئورنىغا <code dir="ltr">bdi</code> ۋە توغرا <code dir="ltr">dir</code> ئارقىلىق كۆرسىتىڭ.</p>
${code('html', `<p>بوغچا: <bdi dir="ltr" lang="en">@uyghurcommunity/ui</bdi></p>
<p>نەشر: <bdi dir="ltr">0.4.0</bdi></p>
<p>ئۇلانما: <bdi dir="ltr">https://example.com/ug?q=123</bdi></p>
<label for="email">ئېلخەت</label>
<input id="email" type="email" dir="ltr">
<textarea aria-label="مەزمۇن" dir="auto"></textarea>`)}
<p><code dir="ltr">dir="auto"</code> يۆنىلىشى ئالدىن بەلگىلىك بولمىغان ئىشلەتكۈچى تېكىستىگە قولاي. بوغچا نامى، كود ۋە ئېلخەت دېگەندەك يۆنىلىشى ئېنىق قىممەتلەرگە <code dir="ltr">ltr</code> ئىشلىتىڭ.</p>
<h2 id="rtl-layout">يۆنىلىشكە ئەگىشىدىغان CSS</h2>
${code('css', `.panel {
  padding-inline: 1.25rem;
  margin-inline: auto;
  border-inline-start: 3px solid var(--ug-blue);
  text-align: start;
  max-inline-size: 48rem;
}`)}
<p>بوشلۇق ۋە ئورۇن ئۈچۈن logical property ئىشلىتىش بىر بۆلەكنى RTL ۋە LTR قاچىلاردا قايتا ئىشلىتىشكە ياردەم بېرىدۇ. فورما رامكىسىغا ماۋزۇ نامى ۋە label باغلاش بولسا ئىككى يۆنىلىشتە ئوخشاشلا لازىم.</p>
<h2 id="rtl-controls">بەتكۈچ ۋە ئوق مەنىسى</h2>
<p><code dir="ltr">bindTabs</code> tablist نىڭ كۆرۈنۈش يۆنىلىشىگە قاراپ سول/ئوڭ كۇنۇپكا ھەرىكىتىنى ماسلاشتۇرىدۇ. تىك tablist ئۈچۈن <code dir="ltr">aria-orientation="vertical"</code> بەلگىلەڭ؛ ئۇنىڭدا يۇقىرى/تۆۋەن كۇنۇپكىلىرى ئىشلىتىلىدۇ. SVG ئوقلار ئاپتوماتىك ئەينەككە ئايلاندۇرۇلمايدۇ، شۇڭا «كېيىنكى» ھەرىكەتنىڭ مەنىسىگە ماس بەلگىنى تاللاڭ.</p>
<h2 id="rtl-unicode">تېكىستنى ساقلاشتا ئېھتىياتچان بولۇڭ</h2>
<p>كۆرۈنۈشتىكى بىر مەسىلىنى ھەل قىلىش ئۈچۈن بارلىق يۆنىلىش ياكى ئۇلاش بەلگىلىرىنى ئومۇميۈزلۈك ئۆچۈرمەڭ. ئۇلار مەزمۇننىڭ شەكلى ۋە مەنىسىگە تەسىر قىلىشى مۇمكىن. ئالدى بىلەن HTML قاچا يۆنىلىشىنى تەكشۈرۈڭ؛ Unicode تەكشۈرۈشى لازىم بولسا <a href="https://uyghurcommunity.github.io/uyghur-text/">Uyghur Text</a> تا ئەسلى تېكىستنى ساقلاپ، ئۆزگىرىشنى ئالدىن كۆرۈڭ.</p>`,
  },
  {
    slug: 'accessibility', title: 'قولاي ئىشلىتىش', en: 'Accessibility', group: 'guides',
    description: 'كۇنۇپكا تاختىسى، ئېنىق نام، فورما ئۇچۇرى ۋە ھەرىكەت تەڭشىكى بىلەن ھەقىقىي ئىشلىتىشنى تەكشۈرۈڭ.',
    body: `
<h2 id="access-native">يەرلىك ئېلېمېنتتىن باشلاڭ</h2>
<p>كۇنۇپكىغا button، ئۇلانمىغا a، رامكىغا input ۋە label، يىغىلىدىغان مەزمۇنغا details/summary ئىشلىتىڭ. توغرا ئېلېمېنتنى تاللاش ئۇنىڭ كۇنۇپكا تاختىسى ۋە ياردەمچى تېخنىكا ھەرىكىتىنى ساقلايدۇ. مەنىسىز div غا role قوشۇشتىن بۇرۇن ماس يەرلىك ئېلېمېنت بار-يوقلۇقىنى تەكشۈرۈڭ.</p>
<h2 id="access-keyboard">كۇنۇپكا تاختىسى بىلەن سىناش</h2>
${table(['ئورۇن', 'سىناق'], [
  ['ئادەتتىكى بەت', 'Tab ۋە Shift+Tab بىلەن ھەممە كونترولغا يېتىپ بېرىڭ؛ فوكۇس سىزىقى كۆرۈنسۇن.'],
  ['يەرلىك dialog', 'فوكۇس كۆزنەك ئىچىدە قالسۇن، Escape تاقىسۇن، تاقىغاندا قوزغاتقۇچقا قايتسۇن.'],
  ['Tabs', 'RTL سول/ئوڭ ياكى تىك يۇقىرى/تۆۋەن، Home ۋە End نى سىناڭ. چەكلەنگەن tab ئۆتۈپ كېتىلسۇن.'],
  ['Disclosure', 'كۇنۇپكا بىلەن ئېچىپ، ئىچكى مەزمۇندا Escape ئارقىلىق يېپىڭ.'],
  ['ئۇقتۇرۇش', 'مۇھىم ئۇچۇرنى ئوقۇشقا ۋاقىت يېتىپ، تاقاش كۇنۇپكىسىغا يەتكىلى بولسۇن.'],
])}
<h2 id="access-labels">كونترولنىڭ ئېنىق نامى</h2>
<p>بەلگە ۋە ياردەم تېكىستى كۆرۈنۈپ تۇرسۇن. placeholder نى label نىڭ ئورنىغا ئىشلەتمەڭ. پەقەت سىنبەلگىلىك كۇنۇپكىغا قىسقا، ھەرىكەتنى چۈشەندۈرىدىغان نام بېرىڭ.</p>
${code('html', `<button class="ug-button ug-button--icon" type="button" aria-label="ئىزدەش">
  <!-- Decorative search SVG goes here. -->
</button>
<label class="ug-label" for="full-name">ئىسمىڭىز</label>
<input class="ug-input" id="full-name" name="name" required
  aria-describedby="full-name-help full-name-error" data-ug-error="full-name-error">
<span class="ug-hint" id="full-name-help">تولۇق ئىسمىڭىزنى كىرگۈزۈڭ.</span>
<span class="ug-error" id="full-name-error"></span>`)}
<h2 id="access-feedback">خاتالىق ۋە نەتىجە</h2>
<p>خاتالىقنى رەڭ بىلەنلا ئەمەس، رامكا يېنىدىكى تېكىست بىلەنمۇ چۈشەندۈرۈڭ. <code dir="ltr">bindForm</code> بۇ تېكىستنى تولدۇرۇپ، <code dir="ltr">aria-invalid</code> ھالىتىنى يېڭىلايدۇ. مۇلازىمېتىردىن كەلگەن خاتالىقنىمۇ يوقىتىپ قويماي، شۇنداق ئېنىق كۆرسىتىڭ.</p>
<p>ئادەتتىكى نەتىجە ئۇچۇرىغا <code dir="ltr">role="status" aria-live="polite"</code> ئىشلىتىڭ. مۇھىم ئۇچۇرنى قىسقا ۋاقىتتىن كېيىن ئاپتوماتىك يوقاتماڭ؛ <code dir="ltr">showToast(..., { duration: 0 })</code> ئادەم تاقىغۇچە قالىدۇ. فوكۇسنى زۆرۈرسىز يۆتكىمەڭ.</p>
<h2 id="access-motion">ھەرىكەت ۋە كۆرىنىش</h2>
<p>كۈتۈپخانا ئۇسلۇبى <code dir="ltr">prefers-reduced-motion</code> تاللىشىنى ھۆرمەت قىلىدۇ. ئۆزىڭىز قوشقان چوڭ ھەرىكەتكە توختىتىش كونترولىنى تەمىنلەڭ؛ مەزمۇننى پەقەت ھەرىكەتتىن كېيىنلا كۆرۈنىدىغان قىلىپ قويمىغايسىز. رەڭنى ئۆزگەرتكەندە تېكىست/تەگلىك پەرقىنى، چوڭايتىش ۋە تار ئېكراندا ئوقۇشنى قايتا تەكشۈرۈڭ.</p>
<h2 id="access-review">تۈرىڭىزدە قايتا تەكشۈرۈڭ</h2>
<p>توپلام native HTML ۋە ئېنىق ARIA مۇناسىۋەتلىرىنى ئىشلىتىدۇ، ئەمما بۇ تۈرىڭىزگە مۇستەقىل گۇۋاھنامە بەرمەيدۇ. ھەقىقىي مەزمۇن، ھەقىقىي توركۆرگۈچ ۋە ئېكران ئوقۇغۇچتا سىناڭ. مەسىلە يوللىغاندا توركۆرگۈچ نامى، باسقان كۇنۇپكىلار ۋە ئەڭ كىچىك قايتا سىناش مىسالىنى قوشۇڭ.</p>`,
  },
  {
    slug: 'faq', title: 'كۆپ سورىلىدىغان سوئاللار', en: 'FAQ and troubleshooting', group: 'resources',
    description: 'قاچىلاش، خەت يۈكلىنىشى، copy، SSR ۋە بۆلەكلەرنىڭ ئادەتتىكى مەسىلىلىرىگە جاۋاب.',
    body: `
<h2 id="faq-install">npm بوغچىنى تاپالمىدى، نېمە قىلىمەن؟</h2>
<p>npm تىزىملىكىگە ئېلان قىلىش ھازىرچە كېچىكتۈرۈلگەن. <a href="installation.html#install-package">GitHub ئارخىپىنىڭ تولۇق ئادرېسى بار بۇيرۇق</a>نى ئىشلىتىڭ. Node نىڭ 20 ياكى ئۇنىڭدىن يۇقىرى نەشرىنى تاللاپ، بۇيرۇقنى تۈرىڭىزنىڭ ئىچىدە ئىجرا قىلىڭ.</p>
<h2 id="faq-style">كۇنۇپكا ئاددىي HTML غا ئوخشايدۇ</h2>
<p><code dir="ltr">styles.css</code> نىڭ يۈكلەنگەنلىكىنى ۋە توغرا نىسپىي يولنى تەكشۈرۈڭ. قىسمىڭىزنى <code dir="ltr">ug-ui</code> قاچىسىغا قويۇڭ. قۇرۇلۇش قورالى يوق بەتتە bare package import ئىشلىتىش ئۈچۈن import map ياكى باشقا ھەل قىلىش لازىم؛ ئاددىي مىسالدا <code dir="ltr">./src/index.js</code> نى ئىشلىتىڭ.</p>
<h2 id="faq-font">خەت ALKATIP Basma دا كۆرۈنمىدى</h2>
<p>خەت سىرتقى OnlineWebFonts ساھىبىدىن يۈكلىنىدۇ. تور ئۇلىنىشى، CSP ۋە خەت تەلىپىنىڭ نەتىجىسىنى تەكشۈرۈڭ. ئۇ يەتمىسە زاپاس خەتتە مەزمۇن يەنىلا كۆرۈنىدۇ. بوغچا خەت binary سىنى ساقلىمايدۇ؛ خەت تاللىشىڭىزنى <a href="theming.html#theme-font">خەت قوللانمىسى</a>دىكىدەك باشقۇرۇڭ.</p>
<h2 id="faq-dialog">كۆزنەك ياكى بەتكۈچ ئىشلىمىدى</h2>
<p>DOM ياسالغاندىن كېيىن binding قۇرغانلىقىڭىزنى، dialog نىڭ accessible نامى بارلىقىنى، tab/panel ID باغلىنىشىنىڭ توغرىلىقىنى تەكشۈرۈڭ. ھەر بىر panel قاچا ئىچىدە بولسۇن. Native dialog، ES module ۋە زامانىۋى CSS نى قوللايدىغان توركۆرگۈچ ئىشلىتىڭ؛ كونا توركۆرگۈچكە polyfill بۇ توپلامدا قوشۇلمىغان.</p>
<h2 id="faq-copy">كۆچۈرۈش كۇنۇپكىسى ئىشلىمىدى</h2>
<p>توركۆرگۈچ clipboard ھوقۇقىنى چەكلىشى مۇمكىن. كۆرگەزمە ۋە قوللانمىدا ئاددىي تاللاپ كۆچۈرۈش ئۇسۇلىدىن پايدىلىنىڭ؛ SVG نى ھۆججەت قىلىپ چۈشۈرۈشمۇ بار. ئۆز تۈرىڭىزدە clipboard ئەمەلگە ئاشمىسا قولدا كۆچۈرگىلى بولىدىغان تېكىست تەمىنلەڭ.</p>
<h2 id="faq-ssr">SSR ياكى React/Vue دا ئىشلىتەمدۇ؟</h2>
<p>DOM غا كىرمەيدىغان import، <code dir="ltr">iconSVG</code>، <code dir="ltr">mapSVG</code> ۋە metadata نى مۇلازىمېتىردىمۇ ئىشلىتىشكە بولىدۇ. DOM كونتروللىرىنى client تەرەپتە ئېلېمېنت mount بولغاندىن كېيىن باغلاپ، unmount بولغاندا <code dir="ltr">destroy()</code> قىلىڭ. رامكىنىڭ ئۆزى باشقۇرۇۋاتقان ئوخشاش attribute ۋە event لارنى ئىككى قېتىم باشقۇرماڭ؛ React wrapper لىرى ئايرىم <code dir="ltr">@uyghurcommunity/ui-react</code> بوغچىسىدا بار؛ باشقا رامكىلاردا DOM كونتروللىرىنى mount/unmount ھايات دەۋرىگە باغلاڭ.</p>
<h2 id="faq-data">بۇ قورال مەزمۇننى تورغا ئەۋەتەمدۇ؟</h2>
<p>كۈتۈپخانا ئۆزى فورما مۇلازىمىتى، analytics ياكى ھېسابات API سىنى قوشمايدۇ. ئۇسلۇبنىڭ سىرتقى خەت تەلىپى بار؛ GitHub ئۇلانمىلىرىنى ئېچىش ياكى تۈرىڭىزگە ئۆزىڭىز قوشقان API ئايرىم ھەرىكەت. كۆرسىتىش مىساللىرىدا مەزمۇن يەرلىك بىر تەرەپ قىلىنىدۇ.</p>
<h2 id="faq-support">مەسىلە ياكى تۆھپە قانداق يوللىنىدۇ؟</h2>
<p><a href="https://github.com/UyghurCommunity/uyghur-ui/issues">GitHub Issues</a> دا قايتا سىناش قەدەملىرى، كۈتكەن ۋە كۆرۈلگەن نەتىجە، نەشر ۋە توركۆرگۈچ ئۇچۇرىنى يېزىڭ. مەدەنىيەت سىنبەلگىسىگە تۈزىتىش تەكلىپ قىلغاندا ئېنىق مەنبە ياكى رايونلۇق ئاتىلىشنى قوشۇڭ. پارول، token ياكى شەخسىي سانلىق مەلۇماتنى مىسالغا قوشماڭ.</p>`,
  },
  {
    slug: 'changelog', title: 'نەشر خاتىرىسى', en: 'Changelog', group: 'resources',
    description: 'ئېلان قىلىنغان بوغچا نەشرلىرى ۋە ھەر بىر نەشرگە كىرگەن ھەقىقىي ئۆزگىرىشلەر.',
    body: `
<h2 id="changes-030">0.3.0 · ئىككى نۇسخىلىق مىراس توپلىمى ۋە خەرىتە</h2>
<p>36 يېڭى مەدەنىيەت تېمىسى قوشۇلۇپ، توپلام 110 سىنبەلگىگە يەتتى. 63 مەدەنىيەت سىنبەلگىسىنىڭ ھەممىسىگە رەڭلىك نۇسخا قوشۇلدى؛ بۇرۇنقى سىزىقلىق سۈكۈتتىكى كۆرۈنۈش ۋە import يوللىرى ساقلانغان.</p>
<ul><li>ئەنئەنىۋى كىيىم، ساپال، زىبۇزىننەت، سۇرناي، بىناكارلىق، مەنزىرە، چاي سايمانلىرى، ھايۋان ۋە بېزەك نەقىشلىرى.</li><li><code dir="ltr">iconSVG(name, { variant })</code> تاللىشى، <code dir="ltr">coloredIconNames</code> ۋە ھەر سىنبەلگىنىڭ <code dir="ltr">variants</code> metadata سى.</li><li>مۇستەقىل رەڭلىك SVG ھۆججەتلىرى ۋە ئىككى نۇسخىنى ئۆز ئىچىگە ئالغان ZIP ئارخىپلىرى.</li><li>شەرقىي تۈركىستاننىڭ سىزىقلىق ۋە تولدۇرۇلغان SVG خەرىتىسى، <code dir="ltr">mapSVG</code>، <code dir="ltr">mapMetadata</code>، ئەسلى GeoJSON ۋە مەنبە خاتىرىسى.</li><li>Natural Earth نىڭ نەشرى بەلگىلەنگەن شىنجاڭ admin-1 پولىگونى، ئاممىۋى مۈلۈك ئىجازەتنامىسى ۋە projection ئۇچۇرى.</li></ul>
<p><a href="https://github.com/UyghurCommunity/uyghur-ui/releases/tag/v0.3.0">0.3.0 نەشر ۋە چۈشۈرۈش ھۆججەتلىرى</a>.</p>
<h2 id="changes-020">0.2.0 · مەدەنىيەت سىنبەلگىلىرى</h2>
<p>24 يېڭى SVG سىنبەلگە قوشۇلدى. بۇ نەشر 74 سىنبەلگىنى ئۆز ئىچىگە ئالاتتى؛ مەدەنىيەت توپلىمىدا بۇرۇنقى دوپپا، بادام ۋە گۈل نەقىشلىرىنى قوشقاندا 27 سىنبەلگە بار ئىدى.</p>
<ul><li>دۇتار، تەمبۈر، راۋاپ، غېجەك، ساتار ۋە داپ.</li><li>ئەتلەس، گىلەم، كەشتە، توقۇش دەستگاھى ۋە ئۇرچۇق.</li><li>ئايۋان، راۋاق، ئويما ئىشىك ۋە تورلۇق دېرىزە.</li><li>نان، سامسا، پولۇ، لەغمەن، چەينەك، پىيالە، ئانار، ئۈزۈم ۋە ئۆرۈك.</li><li>ئىككى تىللىق نام، تۈرلەر ۋە يىپ ئۇچلىرى؛ <code dir="ltr">iconCatalog</code>، <code dir="ltr">iconCategories</code>، <code dir="ltr">findIcons</code> export لىرى.</li><li>تولۇق ۋە مەدەنىيەت توپلىمى ئۈچۈن ئايرىم ZIP، JSON metadata ۋە قايتا ھاسىل قىلغىلى بولىدىغان asset قۇرۇلۇشى.</li></ul>
<p><a href="https://github.com/UyghurCommunity/uyghur-ui/releases/tag/v0.2.0">0.2.0 نەشر ۋە چۈشۈرۈش ھۆججەتلىرى</a>.</p>
<h2 id="changes-010">0.1.0 · تۇنجى UI توپلىمى</h2>
<p>CSS بۆلەكلىرى، يەرلىك كۆزنەك، RTL بەتكۈچ، فورما تەكشۈرۈش، disclosure ۋە ئاددىي تېكىست ئۇقتۇرۇشى ئېلان قىلىندى. تۇنجى توپلامدا 50 SVG سىنبەلگە، شەرقىي تۈركىستان بايرىقى، ALKATIP Basma خەت ئۇلانمىسى ۋە TypeScript ئېنىقلىمىلىرى بار ئىدى.</p>
<p><a href="https://github.com/UyghurCommunity/uyghur-ui/releases/tag/v0.1.0">0.1.0 نەشر ئارخىپى</a> ئۆز پېتى ساقلانغان. يېڭى تۈر ئۈچۈن <a href="installation.html">0.4.0 قاچىلاش ئۇسۇلى</a>نى تاللاڭ.</p>
<h2 id="changes-site">قوللانما ۋە بوغچا نەشرى</h2>
<p>بۇ قوللانما ھازىرقى 0.4.0 API نى چۈشەندۈرىدۇ. تور بېتىدىكى يېڭى قوللانما ياكى لايىھە ئۆزگىرىشى ھەمىشە يېڭى بوغچا نەشرى دېگەنلىك ئەمەس. قاچىلانغان بوغچا نەشرىنى ئۆز تۈرىڭىزنىڭ قۇلۇپ ھۆججىتى ۋە package ئۇچۇرى بىلەن سېلىشتۇرۇڭ.</p>
${note('نەشرنى يېڭىلاش', 'نەشرى بەلگىلەنگەن GitHub ئارخىپ يولىنى ئىشلىتىڭ. يېڭى بوغچا قاچىلاشتىن بۇرۇن ئۆز تۈرىڭىزدىكى فورما، كۆزنەك، بەتكۈچ ۋە سىنبەلگە import لىرىنى تەكشۈرۈڭ.')}`,
  },
].map((page) => Object.freeze({ ...page, body: page.slug === 'changelog' ? additions040.changelog + page.body : page.body + (additions040[page.slug] || '') })));
