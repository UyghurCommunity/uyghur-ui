import {bindDialog,bindUyghurInput,bindCombobox,bindDropdown,bindDrawer,bindDataTable,createTheme,themePresets,exportThemeCSS,exportThemeJSON} from '../src/index.js';
import {initDocsShell} from './docs-shell.js';
import {applicationBlocks} from './application-blocks.js';
import {applicationExamples,applicationSnippet} from './application-examples.js';
const $=(id)=>document.getElementById(id), abort=new AbortController(), urls=new Map();
let destroyed=false,preset='doppa',theme;
const bindings=[initDocsShell(document),bindUyghurInput(document.querySelector('[data-writing-example]')),
 bindDialog($('app-dialog'),{trigger:$('app-dialog-open'),initialFocus:$('app-dialog-title')}),
 bindCombobox(document.querySelector('[data-combobox-example]')),
 bindDropdown(document.querySelector('[data-menu-example]')),
 bindDrawer(document.querySelector('[data-drawer-example]'),{initialFocus:$('app-drawer-title')}),
 bindDataTable(document.querySelector('[data-table-example]'),{pageSize:3}),
 bindDialog($('theme-dialog'),{trigger:$('theme-dialog-open'),initialFocus:$('theme-dialog-title')})];
const editorWriters=new Map();
document.querySelectorAll('[data-dashboard-block]').forEach(root=>bindings.push(bindDataTable(root,{pageSize:3})));
document.querySelectorAll('[data-editor-block]').forEach(root=>{const writer=bindUyghurInput(root);bindings.push(writer);editorWriters.set(root,writer);});
document.querySelectorAll('[data-editor-export]').forEach(button=>button.addEventListener('click',()=>{const editor=button.closest('[data-editor-block]');const writer=editorWriters.get(editor);const title=editor.querySelector('[data-editor-title]').value;const previous=urls.get('article');if(previous)URL.revokeObjectURL(previous);const url=URL.createObjectURL(new Blob([title+'\n\n'+writer.getValue()],{type:'text/plain;charset=utf-8'}));urls.set('article',url);const link=document.createElement('a');link.href=url;link.download='uyghur-article.txt';document.body.append(link);link.click();link.remove();editor.querySelector('[data-editor-export-status]').textContent='چۈشۈرۈش باشلاندى.';},{signal:abort.signal}));
document.querySelectorAll('[data-menu-example] [data-ug-menu-item]').forEach(button=>button.addEventListener('click',()=>{document.querySelector('[data-menu-result]').textContent=button.textContent;},{signal:abort.signal}));
function applyTheme(){
 theme=createTheme(preset,{accent:$('theme-accent').value,radius:Number($('theme-radius').value),fontSize:Number($('theme-font-size').value),lineHeight:Number($('theme-line-height').value),mode:$('theme-mode').value});
 for(const [key,value]of Object.entries(theme.tokens))$('theme-preview').style.setProperty(key,value);
 $('theme-preview').dataset.ugTheme=theme.mode;
 $('theme-radius-value').textContent=theme.tokens['--ug-radius'];$('theme-font-size-value').textContent=theme.tokens['--ug-font-size'];$('theme-line-height-value').textContent=theme.tokens['--ug-line-height'];
 $('theme-css-source').textContent=exportThemeCSS(theme);
 $('theme-contrast').textContent=`كۇنۇپكا سېلىشتۇرمىسى ${theme.contrast.button.toFixed(2)}:1 · تېكىست ${theme.contrast.text.toFixed(2)}:1`;
 document.querySelectorAll('[data-theme-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themePreset===preset)));
}
function selectPreset(id){preset=id;const entry=themePresets.find(x=>x.id===id);$('theme-accent').value=entry.accent;applyTheme();}
document.querySelectorAll('[data-theme-preset]').forEach(button=>button.addEventListener('click',()=>selectPreset(button.dataset.themePreset),{signal:abort.signal}));
$('theme-controls').addEventListener('input',applyTheme,{signal:abort.signal});$('theme-controls').addEventListener('submit',event=>event.preventDefault(),{signal:abort.signal});
$('theme-reset').addEventListener('click',()=>{$('theme-mode').value='light';$('theme-radius').value='10';$('theme-font-size').value='17';$('theme-line-height').value='2.2';selectPreset('doppa');},{signal:abort.signal});
$('theme-preview-action').addEventListener('click',()=>{$('theme-action-status').textContent='ھەرىكەت تەييار. بۇ مىسال پەقەت مۇشۇ كۆرۈنۈشتە.';},{signal:abort.signal});
function manual(text,parent){let label=parent.querySelector('.lab-manual-copy');label?.remove();label=document.createElement('label');label.className='lab-manual-copy';label.textContent='قولدا كۆچۈرۈش · Command+C / Ctrl+C';const input=document.createElement('textarea');input.readOnly=true;input.value=text;input.dir='ltr';label.append(input);parent.append(label);input.focus();input.select();}
async function copy(text,parent){try{await navigator.clipboard.writeText(text);if(!destroyed)$('lab-export-status').textContent='كود كۆچۈرۈلدى.';}catch{if(!destroyed){manual(text,parent);$('lab-export-status').textContent='تاللانغان كودنى قولدا كۆچۈرۈڭ.';}}}
$('theme-copy-css').addEventListener('click',()=>copy(exportThemeCSS(theme),$('theme-controls')),{signal:abort.signal});
function download(kind){const text=kind==='css'?exportThemeCSS(theme):exportThemeJSON(theme);const previous=urls.get(kind);if(previous)URL.revokeObjectURL(previous);const url=URL.createObjectURL(new Blob([text],{type:kind==='css'?'text/css;charset=utf-8':'application/json;charset=utf-8'}));urls.set(kind,url);const link=document.createElement('a');link.href=url;link.download=`uyghur-ui-${preset}.${kind}`;document.body.append(link);link.click();link.remove();$('lab-export-status').textContent=`${kind.toUpperCase()} چۈشۈرۈش باشلاندى.`;}
$('theme-download-css').addEventListener('click',()=>download('css'),{signal:abort.signal});$('theme-download-json').addEventListener('click',()=>download('json'),{signal:abort.signal});
document.querySelectorAll('[data-lab-copy]').forEach(button=>button.addEventListener('click',()=>{const example=[...applicationExamples,...applicationBlocks].find(x=>x.id===button.dataset.labCopy);copy(applicationSnippet(example),button.closest('article'));},{signal:abort.signal}));
window.addEventListener('pagehide',event=>{if(event.persisted)return;destroyed=true;abort.abort();bindings.forEach(b=>b.destroy());urls.forEach(url=>URL.revokeObjectURL(url));urls.clear();});
applyTheme();
