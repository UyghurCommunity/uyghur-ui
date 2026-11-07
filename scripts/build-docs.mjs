import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { guidePages } from '../docs/guide-content.js';
import { guidePagesEn } from '../docs/guide-content-en.js';
import { header, sidebar, dialogs, navigation, tableOfContents, tocLinks, themeBootstrap, escapeHTML, siteVersion, interactionsMetadata, siteSearchEntries } from '../docs/site-shell.js';
import { iconCatalog } from '../src/icons.js';
import { components } from '../docs/components.js';
import { renderInteractionsPage } from '../docs/interactions-page.js';
import { renderLabPage } from '../docs/lab-page.js';
import { renderCommunityPage } from '../docs/community-page.js';
const root = fileURLToPath(new URL('../', import.meta.url));
function searchableText(body) {
  const plain = body.replace(/<[^>]*>/g,' ').replace(/&(amp|lt|gt|quot|#39);/g,(_,entity)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[entity])).replace(/\s+/g,' ').trim();
  const chunks=[];let chunk='';
  for(const word of plain.split(' ')){if(chunk.length+word.length>900){chunks.push(chunk);chunk='';}chunk+=`${chunk?' ':''}${word.slice(0,900)}`;}
  if(chunk)chunks.push(chunk);return chunks;
}
const locales=[{lang:'ug',dir:'rtl',pages:guidePages,folder:'guide',prefix:'../'},{lang:'en',dir:'ltr',pages:guidePagesEn,folder:'guide/en',prefix:'../../'}];
for(const {lang,dir,pages,folder,prefix} of locales){
 await mkdir(resolve(root,folder),{recursive:true});
 const en=lang==='en', labels=en?{docs:'Documentation',skip:'Skip to content',toc:'On this page',prev:'Previous',next:'Next',improve:'Improve this guide',together:'Build together.',help:'Found a problem or have a question?',brand:'Uyghur UI'}:{docs:'قوللانما',skip:'مەزمۇنغا ئاتلاش',toc:'بۇ بەتتە',prev:'ئالدىنقى بەت',next:'كېيىنكى بەت',improve:'بۇ قوللانمىنى ياخشىلاش',together:'بىرلىكتە ياخشىلايلى.',help:'سوئال ياكى خاتالىق بايقىدىڭىزمۇ؟',brand:'ئۇيغۇرچە UI'};
 for(let index=0;index<pages.length;index++){
  const page=pages[index],previous=pages[index-1],next=pages[index+1],headings=tableOfContents(page.body),options={prefix,active:page.slug,lang};
  const pager=`<nav class="docs-pager" aria-label="${labels.docs}">${previous?`<a href="${previous.slug}.html"><small>${labels.prev}</small><span>${escapeHTML(previous.title)}</span></a>`:'<span></span>'}${next?`<a href="${next.slug}.html"><small>${labels.next}</small><span>${escapeHTML(next.title)}</span></a>`:'<span></span>'}</nav>`;
  const canonical=`https://uyghurcommunity.github.io/uyghur-ui/${folder}/${page.slug}.html`;
  const html=`<!doctype html>
<html lang="${lang}" dir="${dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f4f7f9"><meta name="description" content="${escapeHTML(page.description)}"><title>${escapeHTML(page.title)} · ${labels.brand}</title><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="ug" href="https://uyghurcommunity.github.io/uyghur-ui/guide/${page.slug}.html"><link rel="alternate" hreflang="en" href="https://uyghurcommunity.github.io/uyghur-ui/guide/en/${page.slug}.html"><link rel="icon" href="${prefix}assets/icons/flower.svg" type="image/svg+xml">${themeBootstrap}<link rel="stylesheet" href="${prefix}src/styles.css"><link rel="stylesheet" href="${prefix}docs/documentation.css"></head>
<body class="ug-ui doc-site guide-page" data-search-index="${prefix}assets/docs-search.json"><a class="skip" href="#main">${labels.skip}</a>${header(prefix,page.slug,{lang})}<noscript><details class="docs-noscript"><summary>${labels.docs}</summary>${navigation(pages,options)}</details></noscript><div class="guide-layout">${sidebar(pages,options)}<main id="main" class="doc-article" tabindex="-1"><div class="docs-breadcrumb"><a href="introduction.html">${labels.docs}</a><span aria-hidden="true">/</span><span>${escapeHTML(page.title)}</span></div><div class="doc-heading"><p class="doc-eyebrow" lang="en" dir="ltr">${escapeHTML(page.en)}</p><h1>${escapeHTML(page.title)}</h1><p class="doc-description">${escapeHTML(page.description)}</p></div><details class="doc-mobile-toc"><summary>${labels.toc}</summary><div>${tocLinks(headings)}</div></details>${page.body}${pager}<footer class="doc-article-footer"><a href="https://github.com/UyghurCommunity/uyghur-ui/edit/main/docs/guide-content${en?'-en':''}.js">${labels.improve} ↗</a><span lang="en" dir="ltr">v${siteVersion} · MIT</span></footer></main><aside class="doc-toc" aria-label="${labels.toc}"><p>${labels.toc}</p>${tocLinks(headings)}<div class="doc-toc-help"><strong>${labels.together}</strong><p>${labels.help}</p><a href="https://github.com/UyghurCommunity/uyghur-ui/issues">GitHub Issues ↗</a></div></aside></div>${dialogs(pages,options)}<script type="module">import { initDocsShell } from '${prefix}docs/docs-shell.js'; initDocsShell(document);</script></body></html>\n`;
  await writeFile(resolve(root,folder,`${page.slug}.html`),html);
 }
 await writeFile(resolve(root,folder,'index.html'),`<!doctype html><html lang="${lang}" dir="${dir}"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=introduction.html"><title>${labels.brand} ${labels.docs}</title></head><body><a href="introduction.html">${labels.docs}</a></body></html>\n`);
}
await writeFile(resolve(root,'interactions.html'),renderInteractionsPage());
await writeFile(resolve(root,'lab.html'),renderLabPage());
await writeFile(resolve(root,'community.html'),renderCommunityPage());
for(const [filename,active] of [['index.html','gallery'],['interactions.html','interactions'],['community.html','community']]){
 const file=resolve(root,filename);let page=await readFile(file,'utf8');
 for(const [name,html] of [['HEADER',header('',active)],['SIDEBAR',sidebar(guidePages,{active})],['DIALOGS',dialogs(guidePages,{active})]]){
  const pattern=new RegExp(`<!-- DOCS:${name} START -->[\\s\\S]*?<!-- DOCS:${name} END -->`);
  if(!pattern.test(page))throw new Error(`Missing ${filename} marker ${name}`);
  page=page.replace(pattern,`<!-- DOCS:${name} START -->\n${html}\n<!-- DOCS:${name} END -->`);
 }
 await writeFile(file,page);
}
const entries=[
 ...locales.flatMap(({pages,folder,lang})=>pages.map(page=>({title:page.title,en:page.en,description:page.description,href:`${folder}/${page.slug}.html`,keywords:[page.slug,lang,...tableOfContents(page.body).map(entry=>entry.title),...searchableText(page.body)].slice(0,200)}))),
 ...components.map(component=>({title:component.title,en:component.id,description:component.description,href:`index.html#component-${component.id}`,keywords:['component','بۆلەك',component.category]})),
 ...interactionsMetadata.map(({id,title,en,description,keywords})=>({title,en,description,href:`interactions.html#interaction-${id}`,keywords:[...keywords,'interaction','interactions','جانلىق تەسىرلەر','ھەرىكەت']})),
 ...iconCatalog.map(entry=>({title:entry.ug,en:entry.en,description:`${entry.ug} · ${entry.name} · SVG`,href:`index.html#icon-${entry.name}`,keywords:[entry.name,entry.category,...entry.keywords,'icon','سىنبەلگە']})),
 {title:'شەرقىي تۈركىستان بايرىقى',en:'East Turkistan flag',description:'بايراق SVG ھۆججىتى ۋە ئىشلىتىش ئۇسۇلى.',href:'index.html#flag',keywords:['flag','SVG','بايراق']},
 {title:'شەرقىي تۈركىستان خەرىتىسى',en:'East Turkistan map',description:'سىزىقلىق ۋە تولدۇرۇلغان SVG خەرىتىسى، ئەسلى GeoJSON ۋە مەنبە ئۇچۇرى.',href:'index.html#map',keywords:['map','SVG','خەرىتە','East Turkistan','شەرقىي تۈركىستان','outline','filled','GeoJSON','Natural Earth','geography','شىنجاڭ','Xinjiang']},
 ...siteSearchEntries,
];
await writeFile(resolve(root,'assets/docs-search.json'),JSON.stringify({version:siteVersion,entries},null,2)+'\n');
console.log(`Generated ${guidePages.length+guidePagesEn.length} readable bilingual guide pages, Lab/community/shared navigation and ${entries.length} local search entries.`);
