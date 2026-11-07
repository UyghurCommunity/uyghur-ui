import {applicationExamples} from './application-examples.js';
const writer=applicationExamples.find(x=>x.id==='writing-field').html.replaceAll('writer-','editor-writer-').replace('data-writing-example','data-editor-writing');
const table=applicationExamples.find(x=>x.id==='data-table').html.replaceAll('app-table-','dashboard-table-');
export const applicationBlocks=Object.freeze([
 Object.freeze({id:'dashboard-block',title:'باشقۇرۇش تاختىسى قۇرۇلمىسى',en:'Dashboard layout',description:'ماسلىشىدىغان يان يولباشلاش، توپلام كۆرسەتكۈچى ۋە ئىزدەشچان جەدۋەل.',html:`<section class="ug-dashboard-block" data-dashboard-block><aside class="ug-dashboard-sidebar"><strong>مىراس باشقۇرۇش</strong><nav aria-label="باشقۇرۇش مىسالى"><a href="#dashboard-overview">ئومۇمىي كۆرۈنۈش</a><a href="#dashboard-collections">توپلاملار</a><a href="https://uyghurcommunity.github.io/uyghur-ui/guide/installation.html">قاچىلاش ↗</a></nav><small>بۇ يەرلىك كۆرۈنۈش مىسالى.</small></aside><div class="ug-dashboard-content"><header id="dashboard-overview"><span class="ug-badge">يەرلىك مىسال</span><h4>بىر يەردىن باشقۇرۇڭ.</h4><p>بۇ كۆرسەتكۈچلەر تۈر توپلاملىرىنى كۆرسىتىدۇ.</p></header><div class="ug-dashboard-stats"><div><bdi>110</bdi><span>سىنبەلگە</span></div><div><bdi>6</bdi><span>جانلىق مىسال</span></div><div><bdi>4</bdi><span>مەدەنىيەت رەڭلىرى</span></div></div><div id="dashboard-collections">${table}</div></div></section>`,js:`import { bindDataTable } from '@uyghurcommunity/ui';
const dashboard = bindDataTable(document.querySelector('[data-dashboard-block]'), { pageSize: 3 });
// dashboard.destroy();`}),
 Object.freeze({id:'editor-block',title:'ماقالە تەھرىرلىگۈچ قۇرۇلمىسى',en:'Article editor layout',description:'ماۋزۇ، ئۇيغۇرچە يېزىش، keyboard، جەزملەشتۈرۈلىدىغان تازىلاش ۋە يەرلىك تېكىست ئېكسپورتى.',html:`<section class="ug-editor-block" data-editor-block><header><span class="ug-badge">تورغا ئەۋەتىلمەيدۇ</span><h4>ھېكايىڭىزنى يېزىڭ.</h4><p>ماقالە يېزىش قۇرۇلمىسى. چۈشۈرۈشنى ئۆزىڭىز بېكىتىسىز.</p></header><label class="ug-field">ماقالە ماۋزۇسى <input class="ug-input" data-editor-title maxlength="160" dir="auto" placeholder="بۈگۈنكى ھېكايەم"></label>${writer}<div class="ug-row"><button class="ug-button" type="button" data-editor-export>تېكىست چۈشۈرۈش ↓</button><p class="ug-hint" data-editor-export-status role="status" aria-live="polite"></p></div></section>`,js:`import { bindUyghurInput } from '@uyghurcommunity/ui';
const editor = document.querySelector('[data-editor-block]');
const writing = bindUyghurInput(editor);
let url;
editor.querySelector('[data-editor-export]').addEventListener('click', () => {
  if (url) URL.revokeObjectURL(url);
  const text = editor.querySelector('[data-editor-title]').value + '\\n\\n' + writing.getValue();
  url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = 'uyghur-article.txt';
  document.body.append(link); link.click(); link.remove();
  editor.querySelector('[data-editor-export-status]').textContent = 'چۈشۈرۈش باشلاندى.';
});
window.addEventListener('pagehide', (event) => { if (!event.persisted) { writing.destroy(); if (url) URL.revokeObjectURL(url); } });`}),
]);
