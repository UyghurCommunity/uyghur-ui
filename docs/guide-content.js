import { escapeMarkup } from '../src/icons.js';

const release = 'https://github.com/UyghurCommunity/uyghur-ui/releases/download/v0.2.0/uyghurcommunity-ui-0.2.0.tgz';
const code = (language, source) => `<pre data-language="${language}"><code>${escapeMarkup(source.trim())}</code></pre>`;
const note = (title, text) => `<aside class="doc-callout"><strong>${title}</strong><p>${text}</p></aside>`;
const table = (headings, rows) => `<div class="doc-table"><table><thead><tr>${headings.map((x) => `<th scope="col">${x}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

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
  ['74 SVG سىنبەلگە', '27 مەدەنىيەت سىنبەلگىسى، ئىككى تىللىق نام ۋە ئىزدەش يىپ ئۇچلىرى.'],
  ['ALKATIP Basma', 'سىرتقى ئادرېستىن يۈكلىنىدىغان خەت نۇسخىسى ۋە زاپاس خەتلەر.'],
])}
<h2 id="intro-path">قايسى يەردىن باشلايمەن؟</h2>
<ol><li><a href="installation.html">قاچىلاش</a> بۆلىكىدىن تۈرىڭىزگە ماس ئۇسۇلنى تاللاڭ.</li><li><a href="quick-start.html">تېز باشلاش</a> مىسالى بىلەن ھەقىقىي كۆزنەك ۋە فورما قۇرۇڭ.</li><li><a href="components.html">بۆلەكلەر</a> ۋە <a href="icons.html">سىنبەلگىلەر</a> قوللانمىسىدىن لازىملىقىنى تېپىڭ.</li><li><a href="theming.html">رەڭ ۋە خەتنى خاسلاشتۇرۇڭ</a>، ئاندىن <a href="accessibility.html">كۇنۇپكا تاختىسى بىلەن سىناڭ</a>.</li></ol>
${note('ھازىرقى نەشر · 0.2.0', 'قاچىلاش بوغچىسى GitHub Releases دا بار. npm تىزىملىكىگە ئېلان قىلىش ھازىرچە كېچىكتۈرۈلگەن؛ قوللانمىدىكى نەشرى بەلگىلەنگەن ئادرېسنى ئىشلىتىڭ.')}
<h2 id="intro-principles">تۈرىڭىزدە نېمىنى ئۆزىڭىز بېكىتىسىز؟</h2>
<p>كۈتۈپخانا تور مۇلازىمىتى، ئىشلەتكۈچى ھېسابى ياكى سانلىق مەلۇمات ساقلاشنى قوشمايدۇ. فورما نەتىجىسىنى قەيەرگە ئەۋەتىش، قايسى سانلىق مەلۇماتنى ساقلاش ۋە مەزمۇن ئىجازەتنامىسىنى قانداق كۆرسىتىشنى تۈرىڭىز بەلگىلەيدۇ. كۆرگەزمىدىكى فورما پەقەت يەرلىك سىناق.</p>
<p>كود ۋە ئەسلى SVG سىزىقلىرى MIT ئىجازەتنامىسىدە. خەت نۇسخىسى ۋە بايراقنىڭ مەنبە ئۇچۇرىنى <a href="../THIRD_PARTY_NOTICES.md">مەنبە خاتىرىسى</a>دىن كۆرۈڭ.</p>`,
  },
  {
    slug: 'installation', title: 'قاچىلاش', en: 'Installation', group: 'getting-started',
    description: 'GitHub نەشر بوغچىسىنى قاچىلاڭ ياكى رېپو مەنبەسىنى بىۋاسىتە HTTP ئارقىلىق ئىشلىتىڭ.',
    body: `
<h2 id="install-requirements">ئالدىن تەييارلىق</h2>
<p>بوغچا بىلەن ئىشلەش ئۈچۈن <bdi dir="ltr" lang="en">Node.js 20+</bdi> ۋە ئۆز تۈرىڭىزنىڭ بوغچا باشقۇرغۇچىسى لازىم. كۈتۈپخانىنىڭ ئىجرا ۋاقتىدا باشقا JavaScript بوغچىسىغا تايىنىشچانلىقى يوق. تۈرىڭىزدە بار قۇرۇلۇش قورالىنى داۋاملىق ئىشلىتەلەيسىز.</p>
${note('توغرا قاچىلاش ئادرېسى', 'ھازىرچە يالغۇز <code dir="ltr">npm install @uyghurcommunity/ui</code> نى ئىشلەتمەڭ. تۆۋەندىكى بۇيرۇقلار GitHub دىكى 0.2.0 نەشر ئارخىپىنى قاچىلايدۇ.')}
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
<p>0.2.0 نەشرىدە نەتىجە <bdi dir="ltr">74</bdi> بولىدۇ. بۇيرۇق بوغچا تۈرىڭىزنىڭ ئىچىدىن ئىجرا قىلىنسۇن. CSS import خاتالىقى چىقسا، ئۇنى ئاددىي Node ئىچىدە ئەمەس، CSS نى بىر تەرەپ قىلالايدىغان تور تۈرىڭىزنىڭ كىرىش ھۆججىتىدە ئىشلىتىڭ.</p>`,
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
  iconSVG, flagSVG, iconNames, directionalIcons,
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
  ['<code dir="ltr">iconSVG(name, { size, strokeWidth, label })</code>', 'SVG تېكىستى. سۈكۈتتىكى چوڭلۇق 24، strokeWidth بولسا 1.7.'],
  ['<code dir="ltr">flagSVG({ width, label })</code>', 'كەڭلىك/ئېگىزلىك نىسبىتى 3:2 بولغان بايراق SVG تېكىستى.'],
  ['<code dir="ltr">findIcons(query, { category })</code>', 'سۆز ۋە تۈرگە ماس سىنبەلگە ناملىرىدىن يېڭى تىزىملىك.'],
  ['<code dir="ltr">iconNames · directionalIcons</code>', 'سىنبەلگە ناملىرى ۋە قوش يۆنىلىشلىك ئوق تاللاشقا ياردەمچى ناملار.'],
  ['<code dir="ltr">iconCatalog · iconCategories</code>', 'ئۆزگەرتكىلى بولمايدىغان ئىككى تىللىق metadata.'],
])}
<p>بۇ SVG/ئىزدەش export لىرى يىلتىز import ۋە <code dir="ltr">@uyghurcommunity/ui/icons</code> دا بار. <code dir="ltr">escapeMarkup(value)</code> پەقەت icons تارماق import ىدا بار؛ ئۇ markup ئۈچۈن بەلگىلەرنى escape قىلىدۇ، URL ياكى CSS تەكشۈرگۈچ ئەمەس. تەپسىلاتنى <a href="icons.html">سىنبەلگە قوللانمىسى</a>دىن كۆرۈڭ.</p>
<h2 id="api-errors">پارامېتىر ۋە خاتالىق</h2>
<p>يوق ياكى ماس كەلمەيدىغان DOM ئېلېمېنتى ئۈچۈن <code dir="ltr">TypeError</code> چىقىشى مۇمكىن. سىنبەلگە نامى ۋە تۈر نامى allowlist بويىچە تەكشۈرۈلىدۇ. icon چوڭلۇقى پۈتۈن سان <bdi dir="ltr">12–256</bdi>، strokeWidth بولسا <bdi dir="ltr">0.5–4</bdi>؛ flag كەڭلىكى پۈتۈن سان <bdi dir="ltr">24–1800</bdi> بولسۇن. نام بەلگىسى 160 ھەرپتىن ئاشمىسۇن. ئۆچۈرۈلگەن binding نى قايتا open/select/validate/setOpen قىلىش ئورنىغا يېڭى binding قۇرۇڭ.</p>`,
  },
  {
    slug: 'icons', title: 'سىنبەلگىلەر ۋە مەدەنىيەت توپلىمى', en: 'Icons and cultural collection', group: 'components',
    description: '74 SVG سىنبەلگە، 27 مەدەنىيەت بەلگىسى، ئۇيغۇرچە ئىزدەش ۋە مۇستەقىل ھۆججەتلەر.',
    body: `
<h2 id="icons-collections">ئۆز لايىھەڭىزگە بىر مەنىلىك بەلگە</h2>
<p>0.2.0 نەشرىدە 74 ئەسلى SVG سىنبەلگە بار؛ بۇنىڭ 27 سى مەدەنىيەت توپلىمىغا كىرىدۇ. بۇ نەشر 24 يېڭى سىزىق قوشتى. دۇتار، راۋاپ، ساتار، ئەتلەس، توقۇش دەستگاھى، ئايۋان، نان ۋە چاي سايمانلىرىنى <a href="../index.html#icons">كۆرگەزمىدىن تاللاپ سىناڭ</a>.</p>
<p>بۇلار رەقەملىك كۆرۈنمە يۈز ئۈچۈن ئەسلىدىن سىزىلغان ئاددىي مەدەنىيەت پىكتوگراممىلىرى. رايونغا قاراپ شەكىل ۋە ئاتىلىش ئۆزگىرىدۇ؛ بىر تارىخىي بۇيۇمنىڭ قۇرۇلۇش سىزىقى دەپ ئىشلەتمەڭ. سۈرەت ۋە مەزمۇننىڭ پايدىلىنىش مەنبەلىرى <a href="../THIRD_PARTY_NOTICES.md">مەنبە خاتىرىسى</a>دە بار.</p>
<h2 id="icons-render">JavaScript بىلەن SVG ھاسىل قىلىش</h2>
${code('js', `import { iconSVG, flagSVG } from '@uyghurcommunity/ui';

const dutar = iconSVG('dutar', { size: 48, label: 'دۇتار' });
const decorative = iconSVG('flower', { size: 24 });
const flag = flagSVG({ width: 180, label: 'شەرقىي تۈركىستان بايرىقى' });

document.getElementById('instrument').innerHTML = dutar;`)}
<p>ئاخىرقى قۇردىكى قاچىڭىز <code dir="ltr">&lt;span id="instrument"&gt;&lt;/span&gt;</code> بولسۇن. كۈتۈپخانا مەلۇم سىنبەلگە نامىنىلا قوبۇل قىلىپ، label نى escape قىلىدۇ. باشقا مەنبەدىن كەلگەن خالىغان HTML نى بۇ ئۇسۇلدا كىرگۈزمەڭ.</p>
<p>مەنىسى بار يالغۇز سىنبەلگىگە ئۇيغۇرچە <code dir="ltr">label</code> بېرىڭ؛ ئۇنىڭغا <code dir="ltr">role="img"</code> قوشۇلىدۇ. بەلگە بوش بولسا سىنبەلگە بېزەك سۈپىتىدە <code dir="ltr">aria-hidden="true"</code> بولىدۇ. ئىچىدە سىنبەلگە بار كۇنۇپكىنىڭ ئۆزىگە نام بېرىشنىمۇ ئۇنتۇماڭ.</p>
<h2 id="icons-search">نام ۋە تۈر بويىچە ئىزدەش</h2>
${code('js', `import { findIcons, iconCatalog, iconCategories } from '@uyghurcommunity/ui';

findIcons('راۋاب'); // ['rawap']
findIcons('ikat'); // ['atlas']
findIcons('', { category: 'music' }); // six instrument names

const details = iconCatalog.find((icon) => icon.name === 'dutar');
console.log(details.ug, details.en, details.category);`)}
${table(['تۈر نامى', 'مەزمۇن'], [
  ['<code dir="ltr">all</code>', '74 سىنبەلگىنىڭ ھەممىسى.'],
  ['<code dir="ltr">traditional</code>', '27 مەدەنىيەت سىنبەلگىسى ۋە نەقىش.'],
  ['<code dir="ltr">music · textiles · architecture</code>', 'سازلار، توقۇمىچىلىق/نەقىش ۋە بىناكارلىق.'],
  ['<code dir="ltr">table · garden · general</code>', 'داستىخان، باغ ۋە ئادەتتىكى كۆرۈنمە يۈز سىنبەلگىلىرى.'],
])}
<p>ئىزدەش ئۇيغۇرچە نام، ئىنگلىزچە نام ۋە يىپ ئۇچلىرىنى ئۆز ئىچىگە ئالىدۇ. تۈر ۋە سوئال بىللە سۈزۈلىدۇ؛ مەسىلەن ساز نامىنى داستىخان تۈرىدە ئىزدىگەندە بوش نەتىجە چىقىشى نورمال.</p>
<h2 id="icons-files">مۇستەقىل SVG ۋە JSON</h2>
<ul><li><a href="../downloads/uyghur-traditional-icons.zip">مەدەنىيەت SVG توپلىمى</a> — 27 سىنبەلگە ۋە بايراق.</li><li><a href="../downloads/uyghur-ui-icons.zip">تولۇق SVG توپلىمى</a> — 74 سىنبەلگە ۋە بايراق.</li><li><a href="../assets/icon-catalog.json">ئىككى تىللىق JSON</a> — نام، تۈر ۋە ئىزدەش يىپ ئۇچلىرى.</li></ul>
<p>قاچىلانغان بوغچىدىكى ھۆججەت تارماق يوللىرى:</p>
${code('text', `@uyghurcommunity/ui/icons/dutar
@uyghurcommunity/ui/flags/east-turkistan.svg
@uyghurcommunity/ui/catalog.json`)}
<p>سىنبەلگە تارماق يولىغا <code dir="ltr">.svg</code> قوشۇلمايدۇ. رېپودىكى ھەقىقىي ھۆججەت يولى بولسا <code dir="ltr">assets/icons/dutar.svg</code>. بوغچا يولىنى static asset URL غا ئايلاندۇرۇش ئۇسۇلى تۈرىڭىزنىڭ قۇرۇلۇش قورالىغا باغلىق؛ ھۆججەتنى ئۆز public مۇندەرىجىڭىزگە كۆچۈرۈپ، ئادەتتىكى img بىلەنمۇ كۆرسىتەلەيسىز.</p>
<h2 id="icons-color">رەڭ ۋە يۆنىلىش</h2>
${code('html', `<span class="instrument" id="instrument"></span>
<style>
  .instrument { color: #086aa7; }
</style>`)}
<p>سىنبەلگە سىزىقى <code dir="ltr">currentColor</code> غا ئەگىشىدۇ؛ سىرتقى img ھۆججىتى ئىچىدىكى رەڭ بولسا بەتنىڭ color قىممىتىگە ئۆزلۈكىدىن ۋارىسلىق قىلمايدۇ. رەڭنى خاسلاشتۇرۇشقا inline SVG قولاي. SVG لار RTL دا ئۆزلۈكىدىن ئەينەككە ئايلاندۇرۇلمايدۇ؛ ھەرىكەت مەنىسىگە ماس ئوقنى تاللاڭ. بايراقنىڭ ئاي ۋە يۇلتۇز شەكلىمۇ ئەينەككە ئايلاندۇرۇلمايدۇ.</p>`,
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
<p>نەشر: <bdi dir="ltr">0.2.0</bdi></p>
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
<p>DOM غا كىرمەيدىغان import، <code dir="ltr">iconSVG</code> ۋە metadata نى مۇلازىمېتىردىمۇ ئىشلىتىشكە بولىدۇ. DOM كونتروللىرىنى client تەرەپتە ئېلېمېنت mount بولغاندىن كېيىن باغلاپ، unmount بولغاندا <code dir="ltr">destroy()</code> قىلىڭ. رامكىنىڭ ئۆزى باشقۇرۇۋاتقان ئوخشاش attribute ۋە event لارنى ئىككى قېتىم باشقۇرماڭ؛ تەييار React/Vue wrapper بۇ نەشرگە قوشۇلمىغان.</p>
<h2 id="faq-data">بۇ قورال مەزمۇننى تورغا ئەۋەتەمدۇ؟</h2>
<p>كۈتۈپخانا ئۆزى فورما مۇلازىمىتى، analytics ياكى ھېسابات API سىنى قوشمايدۇ. ئۇسلۇبنىڭ سىرتقى خەت تەلىپى بار؛ GitHub ئۇلانمىلىرىنى ئېچىش ياكى تۈرىڭىزگە ئۆزىڭىز قوشقان API ئايرىم ھەرىكەت. كۆرسىتىش مىساللىرىدا مەزمۇن يەرلىك بىر تەرەپ قىلىنىدۇ.</p>
<h2 id="faq-support">مەسىلە ياكى تۆھپە قانداق يوللىنىدۇ؟</h2>
<p><a href="https://github.com/UyghurCommunity/uyghur-ui/issues">GitHub Issues</a> دا قايتا سىناش قەدەملىرى، كۈتكەن ۋە كۆرۈلگەن نەتىجە، نەشر ۋە توركۆرگۈچ ئۇچۇرىنى يېزىڭ. مەدەنىيەت سىنبەلگىسىگە تۈزىتىش تەكلىپ قىلغاندا ئېنىق مەنبە ياكى رايونلۇق ئاتىلىشنى قوشۇڭ. پارول، token ياكى شەخسىي سانلىق مەلۇماتنى مىسالغا قوشماڭ.</p>`,
  },
  {
    slug: 'changelog', title: 'نەشر خاتىرىسى', en: 'Changelog', group: 'resources',
    description: 'ئېلان قىلىنغان بوغچا نەشرلىرى ۋە ھەر بىر نەشرگە كىرگەن ھەقىقىي ئۆزگىرىشلەر.',
    body: `
<h2 id="changes-020">0.2.0 · مەدەنىيەت سىنبەلگىلىرى</h2>
<p>24 يېڭى SVG سىنبەلگە قوشۇلدى. توپلام ھازىر 74 سىنبەلگىنى ئۆز ئىچىگە ئالىدۇ؛ مەدەنىيەت توپلىمىدا بۇرۇنقى دوپپا، بادام ۋە گۈل نەقىشلىرىنى قوشقاندا 27 سىنبەلگە بار.</p>
<ul><li>دۇتار، تەمبۈر، راۋاپ، غېجەك، ساتار ۋە داپ.</li><li>ئەتلەس، گىلەم، كەشتە، توقۇش دەستگاھى ۋە ئۇرچۇق.</li><li>ئايۋان، راۋاق، ئويما ئىشىك ۋە تورلۇق دېرىزە.</li><li>نان، سامسا، پولۇ، لەغمەن، چەينەك، پىيالە، ئانار، ئۈزۈم ۋە ئۆرۈك.</li><li>ئىككى تىللىق نام، تۈرلەر ۋە يىپ ئۇچلىرى؛ <code dir="ltr">iconCatalog</code>، <code dir="ltr">iconCategories</code>، <code dir="ltr">findIcons</code> export لىرى.</li><li>تولۇق ۋە مەدەنىيەت توپلىمى ئۈچۈن ئايرىم ZIP، JSON metadata ۋە قايتا ھاسىل قىلغىلى بولىدىغان asset قۇرۇلۇشى.</li></ul>
<p><a href="https://github.com/UyghurCommunity/uyghur-ui/releases/tag/v0.2.0">0.2.0 نەشر ۋە چۈشۈرۈش ھۆججەتلىرى</a>.</p>
<h2 id="changes-010">0.1.0 · تۇنجى UI توپلىمى</h2>
<p>CSS بۆلەكلىرى، يەرلىك كۆزنەك، RTL بەتكۈچ، فورما تەكشۈرۈش، disclosure ۋە ئاددىي تېكىست ئۇقتۇرۇشى ئېلان قىلىندى. تۇنجى توپلامدا 50 SVG سىنبەلگە، شەرقىي تۈركىستان بايرىقى، ALKATIP Basma خەت ئۇلانمىسى ۋە TypeScript ئېنىقلىمىلىرى بار ئىدى.</p>
<p><a href="https://github.com/UyghurCommunity/uyghur-ui/releases/tag/v0.1.0">0.1.0 نەشر ئارخىپى</a> ئۆز پېتى ساقلانغان. يېڭى تۈر ئۈچۈن <a href="installation.html">0.2.0 قاچىلاش ئۇسۇلى</a>نى تاللاڭ.</p>
<h2 id="changes-site">قوللانما ۋە بوغچا نەشرى</h2>
<p>بۇ قوللانما ھازىرقى 0.2.0 API نى چۈشەندۈرىدۇ. تور بېتىدىكى يېڭى قوللانما ياكى لايىھە ئۆزگىرىشى ھەمىشە يېڭى بوغچا نەشرى دېگەنلىك ئەمەس. قاچىلانغان بوغچا نەشرىنى ئۆز تۈرىڭىزنىڭ قۇلۇپ ھۆججىتى ۋە package ئۇچۇرى بىلەن سېلىشتۇرۇڭ.</p>
${note('نەشرنى يېڭىلاش', 'نەشرى بەلگىلەنگەن GitHub ئارخىپ يولىنى ئىشلىتىڭ. يېڭى بوغچا قاچىلاشتىن بۇرۇن ئۆز تۈرىڭىزدىكى فورما، كۆزنەك، بەتكۈچ ۋە سىنبەلگە import لىرىنى تەكشۈرۈڭ.')}`,
  },
].map((page) => Object.freeze(page)));
