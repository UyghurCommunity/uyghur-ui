import React, { createElement as h, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Icon, Dialog, Tabs, UyghurInput, Interaction } from '@uyghurcommunity/ui-react';
import '@uyghurcommunity/ui/styles.css';
import '@uyghurcommunity/ui/interactions.css';
import './style.css';

function App() {
  const [open, setOpen] = useState(false), [tab, setTab] = useState('writing');
  const [text, setText] = useState('ئەسسالامۇئەلەيكۇم! Hello, Uyghur UI.'), [paused, setPaused] = useState(false);
  const writing = h(UyghurInput, { value: text, onChange: setText, label: 'ئىككى تىل، بىر رامكا.', maxLength: 2000 });
  return h('main', { className: 'ug-ui example' },
    h('p', { lang: 'en', dir: 'ltr', className: 'eyebrow' }, 'UYGHUR UI / REACT EXAMPLE'),
    h('h1', null, 'ئۆز تىلىمىزدا قۇرايلى.'),
    h('p', null, 'ھەقىقىي كۇنۇپكا تاختىسى، جەزملەشتۈرۈلىدىغان Unicode تازىلاش ۋە مەدەنىيەتتىن ئىلھام ئالغان جانلىق كۆرۈنۈشلەر.'),
    h('div', { className: 'ug-row' }, h(Button, { onClick: () => setOpen(true) }, h(Icon, { name: 'doppa-top' }), 'مىسال كۆزنەك'), h(Button, { variant: 'secondary', onClick: () => setPaused((value) => !value), 'aria-pressed': paused }, paused ? 'ھەرىكەتنى داۋاملاشتۇرۇش' : 'ھەرىكەتنى توختىتىش')),
    h(Dialog, { open, onOpenChange: setOpen, 'aria-labelledby': 'example-dialog-title' }, h('h2', { id: 'example-dialog-title' }, 'بىرلىكتە قۇرايلى.'), h('p', null, 'سىرتىنى چەكسىڭىز ياكى Escape نى باسسىڭىز تاقىلىدۇ. ئىچىدىن سىرتىغا سۆرەش تاقىمايدۇ.'), h(Button, { onClick: () => setOpen(false) }, 'تاقاش')),
    h(Tabs, { value: tab, onValueChange: setTab, label: 'React مىساللىرى', items: [
      { id: 'writing', label: 'يېزىش', content: writing },
      { id: 'preview', label: 'ئارىلاش يېزىق', content: h('div', null, h('p', { dir: 'auto', className: 'ug-writing-preview' }, text), h('p', null, 'تور ئادرېسى: ', h('bdi', { dir: 'ltr' }, 'https://github.com/UyghurCommunity'), ' · ', h('bdi', { dir: 'ltr' }, '2026 / 110'))) },
    ] }),
    h('h2', null, 'جانلىق تەسىرلەر'), h('p', null, 'بۇ مىساللار يەرلىكتە ئىشلەيدۇ؛ خەت ياكى مەزمۇن تورغا ئەۋەتىلمەيدۇ.'),
    h('div', { className: 'interaction-grid' }, ['spotlight', 'tilt', 'selection', 'send', 'compare', 'ripple'].map((effect) => h('section', { key: effect, className: 'interaction-card' }, h('h3', { lang: 'en', dir: 'ltr' }, effect), h(Interaction, { effect, paused })))));
}
createRoot(document.getElementById('root')).render(h(React.StrictMode, null, h(App)));
