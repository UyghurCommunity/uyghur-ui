import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {guidePages} from '../docs/guide-content.js';
import {guidePagesEn} from '../docs/guide-content-en.js';
import {languageHref,siteVersion,siteSearchEntries} from '../docs/site-shell.js';
import {renderCommunityPage,communityProjects} from '../docs/community-page.js';
const root = new URL('../',import.meta.url);
const read = file => readFile(new URL(file,root),'utf8');
const attributes = text => Object.fromEntries([...text.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([,name,value])=>[name,value]));
const normalizeMarkers = html => html.replace(/(<!-- DOCS:(HEADER|SIDEBAR|DIALOGS) START -->)\s*([\s\S]*?)\s*(<!-- DOCS:\2 END -->)/g,(_,start,name,content,end)=>start+content.trim()+end);

test('English documentation is an authored complete counterpart of all eleven Uyghur guides',()=>{
 assert.equal(guidePages.length,11);assert.equal(guidePagesEn.length,11);
 assert.deepEqual(guidePagesEn.map(p=>p.slug),guidePages.map(p=>p.slug));
 for(const page of guidePagesEn){
  assert.ok(page.description.length>30);
  assert.ok(page.body.replace(/<[^>]*>/g,' ').length>500,`${page.slug}: substantive English body`);
  const sections=[...page.body.matchAll(/<h2\b[^>]*id="([^"]+)"[^>]*>(.*?)<\/h2>/g)];
  assert.ok(sections.length>=3);assert.equal(new Set(sections.map(m=>m[1])).size,sections.length);
  assert.ok(sections.every(m=>!/[\u0600-\u06ff]/.test(m[2])),`${page.slug}: translated English headings`);
 }
 for(const api of ['bindUyghurInput','bindCombobox','bindDropdown','bindDrawer','bindDataTable','createTheme','exportThemeCSS','exportThemeJSON','ui-react','create-uyghur']){
  assert.ok(guidePagesEn.some(p=>p.body.includes(api)),`English coverage for ${api}`);
  assert.ok(guidePages.some(p=>p.body.includes(api)),`Uyghur coverage for ${api}`);
 }
});

test('all generated guides have correct direction, source parity and a page-preserving language switch',async()=>{
 for(const [lang,pages,folder,prefix] of [['ug',guidePages,'guide','../'],['en',guidePagesEn,'guide/en','../../']]){
  for(const page of pages){
   const file=`${folder}/${page.slug}.html`,html=await read(file);
   assert.match(html,new RegExp(`<html lang="${lang}" dir="${lang==='en'?'ltr':'rtl'}">`));
   assert.ok(html.includes(page.body),`${file}: generated content matches authored source`);
   assert.ok(html.includes(`${prefix}src/styles.css`));
   const switchTag=[...html.matchAll(/<a\b([^>]*)>/g)].find(([,source])=>/\bdata-language-switch\b/.test(source));
   assert.ok(switchTag,`${file}: language switch exists`);
   const values=attributes(switchTag[1]),target=new URL(values.href,new URL(file,root));
   const counterpart=new URL(`guide/${lang==='en'?'':'en/'}${page.slug}.html`,root);
   assert.equal(target.href,counterpart.href);
   assert.equal(values.hreflang,lang==='en'?'ug':'en');
   assert.equal(values.href,languageHref(prefix,page.slug,lang));
   assert.ok(html.includes(`hreflang="en" href="https://uyghurcommunity.github.io/uyghur-ui/guide/en/${page.slug}.html"`));
   assert.ok(html.includes(`hreflang="ug" href="https://uyghurcommunity.github.io/uyghur-ui/guide/${page.slug}.html"`));
  }
  const redirect=await read(`${folder}/index.html`);assert.match(redirect,/content="0;url=introduction.html"/);
 }
 assert.match(await read('src/font.css'),/ALKATIP Basma/);
});

test('bilingual search and Lab/community destinations correspond to generated documents',async()=>{
 const data=JSON.parse(await read('assets/docs-search.json'));assert.equal(data.version,siteVersion);
 for(const [pages,folder] of [[guidePages,'guide'],[guidePagesEn,'guide/en']])for(const page of pages){
  const entry=data.entries.find(entry=>entry.href===`${folder}/${page.slug}.html`);
  assert.ok(entry);assert.equal(entry.title,page.title);assert.equal(entry.description,page.description);
 }
 for(const source of siteSearchEntries){
  const entry=data.entries.find(entry=>entry.href===source.href);assert.ok(entry,source.href);
  const [file,hash]=source.href.split('#');const html=await read(file);
  if(hash)assert.ok(html.includes(`id="${hash}"`),`${source.href}: real static target`);
 }
});

test('community page is generated from real issue templates and labels its showcase as community examples',async()=>{
 const html=await read('community.html');assert.equal(normalizeMarkers(html),normalizeMarkers(renderCommunityPage()));
 for(const template of ['bug','component','translation']){
  assert.ok(html.includes(`https://github.com/UyghurCommunity/uyghur-ui/issues/new?template=${template}.yml`));
  const form=await read(`.github/ISSUE_TEMPLATE/${template}.yml`);
  assert.match(form,/^name: .+/m);assert.match(form,/^description: .+/m);assert.match(form,/^body:/m);
  const ids=[...form.matchAll(/^    id: ([a-z0-9-]+)$/gm)].map(m=>m[1]);assert.ok(ids.length>=3);assert.equal(new Set(ids).size,ids.length);
  assert.match(form,/required: true/);
 }
 assert.ok(communityProjects.length>=3);
 for(const project of communityProjects)assert.equal(new URL(project.href).hostname,'uyghurcommunity.github.io');
 assert.ok(html.includes('not a list of external adopters or endorsements'));
 for(const file of ['CONTRIBUTING.md','CODE_OF_CONDUCT.md'])assert.ok((await read(file)).length>500);
});

test('0.4 documentation preserves the facts of earlier releases and uses pinned archive installs',async()=>{
 for(const pages of [guidePages,guidePagesEn]){
  const changes=pages.find(p=>p.slug==='changelog').body;
  for(const id of ['changes-040','changes-030','changes-020','changes-010'])assert.ok(changes.includes(`id="${id}"`));
  const old020=changes.split('id="changes-020"')[1].split('id="changes-010"')[0];for(const count of ['24','74','27'])assert.ok(old020.includes(count));
  assert.ok(changes.split('id="changes-010"')[1].includes('50'));
  const install=pages.find(p=>p.slug==='installation').body;
  for(const file of ['uyghurcommunity-ui-0.4.0.tgz','uyghurcommunity-ui-react-0.4.0.tgz','uyghurcommunity-create-0.2.0.tgz'])assert.ok(install.includes(file));
 }
 const readme=await read('README.md');assert.ok(readme.includes('registry publication remains deferred')||readme.includes('registry publishing is deferred'));
 assert.ok(readme.includes('guide/en/introduction.html'));assert.ok(readme.includes('CONTRIBUTING.md'));
});
