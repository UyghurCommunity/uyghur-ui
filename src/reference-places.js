/**
 * Original 24×24 cultural pictograms drawn for Uyghur UI.
 * These are simplified contemporary interpretations, not monument surveys,
 * historical reconstructions, or copies of the supplied painted references.
 * The camel has two humps; the surnai is a flared wind instrument.
 */
export const referencePlacesOutline = Object.freeze({
  surnai: '<path d="M11 3h2v4l1 7c.5 2.5 2 4.2 4 6H6c2-1.8 3.5-3.5 4-6l1-7ZM10.8 7h2.4M8 18h8M6 21h12"/><path d="M12 9.5h.01M12 12h.01M12 14.5h.01"/>',
  mosque: '<path d="M3 21V9h2v12m14 0V9h2v12M2.5 9h3L4 5ZM18.5 9h3L20 5ZM6.5 21v-9.5h11V21M7.5 11.5c0-3 2-3.7 4.5-6 2.5 2.3 4.5 3 4.5 6M12 5.5V3m-1.5 0h3M9.5 21v-4c0-1.4 1.2-2.4 2.5-3.5 1.3 1.1 2.5 2.1 2.5 3.5v4M2.5 21h19"/>',
  mausoleum: '<path d="M4 21V8l2-2h12l2 2v13M8 6c0-2 2-3.5 4-4 2 1 4 2 4 4M7 21v-9c0-3 3-5 5-7 2 2 5 4 5 7v9M9.5 21v-8c0-1.7 1.1-2.8 2.5-4.3 1.4 1.5 2.5 2.6 2.5 4.3v8M5.5 10v8m13-8v8M3 21h18"/>',
  minaret: '<path d="M8.5 21 10 8h4l1.5 13M8.5 6h7v2h-7ZM9 6V4.5L12 2l3 2.5V6M7 21h10M9.7 11h4.6M9.3 15h5.4M9 18h6M12 8v3m-1.5 0v4m3 0v3m-3 0v3"/>',
  madrasa: '<path d="M3 21V9h4V4h10v5h4v12M7 9v12m10-12v12M9.5 21v-8c0-1.8 1.1-3 2.5-4.5 1.4 1.5 2.5 2.7 2.5 4.5v8M10 6.5h4M4.8 12v3m0 3v1m14.4-7v3m0 3v1M2.5 21h19"/>',
  'traditional-house': '<path d="M3 21V10h7V4h8v7h3v10M10 10h5v11M3 13h7m5-2h3M12.5 7h3v3h-3ZM5 15h2v2H5ZM17.5 14h1v3h-1ZM9 21v-3a2 2 0 0 1 4 0v3M2.5 21h19"/>',
  yurt: '<path d="m3 11 9-7 9 7v10H3ZM3 11h18M7 10l5-6 5 6M10 21v-7h4v7M3 14h7m4 0h7M3 18h7m4 0h7M4 16l1.5-1 1.5 2 1.5-1m7 0 1.5-1 1.5 2 1.5-1M10.5 3h3"/>',
  'city-gate': '<path d="M3 21V4h2v2h1V4h2v4h8V4h2v2h1V4h2v17M8 8v13m8-13v13M8 21v-7c0-2.5 2.3-4.4 4-6 1.7 1.6 4 3.5 4 6v7M5.5 11v3m13-3v3M3 18h5m8 0h5M2.5 21h19"/>',
  'ancient-ruins': '<path d="M3 21v-8l2-1 2 2V8l3 1V5l3-1 2 1v7l3-1 1-5h2v15M7 14v7m8-9v9M10 14v3m7-1h1M5 18h2M3 21h18"/><path d="m4 9 1-1m12-5h1"/>',
  landscape: '<circle cx="5" cy="4.5" r="1.5"/><path d="m2.7 16 5.8-8 3 4 4.2-7 5.6 11M6.7 10.5l1.8 1.8 1.2-1.3m3.9-2.3 2.1 2.2 1.3-1.4M2.5 17c4-2 7 2 11 0s5-1 8-.5M3 21c3-1.8 6 .8 9-.2s5-1.5 9-.3M10 14l-2 2m9-3 2 3"/>',
  'tea-set': '<path d="M6 9h8l1.2 4.5c.8 3-1.2 5.5-5.2 5.5s-6-2.5-5.2-5.5ZM5 11 2.5 8.5v5L5 16m9.5-6c4-1 5 4 1 5.5M6 6.5h8M10 4v2.5M7 21h6m-3-9 2 2-2 2-2-2ZM16 17c.2 3 1 4 2.8 4s2.6-1 2.7-4"/><ellipse cx="18.8" cy="17" rx="2.7" ry=".8"/>',
  cotton: '<path d="M5.5 12c-3-1-2.5-5.5.5-5.5C5 2.5 10 2 12 5c2-3 7-2.5 6 1.5 3 0 3.5 4.5 1 5.5-.5 3-4.5 3-7 0-2 3-6 3-6.5 0ZM12 12v9m0-9V5m0 13c-3-5-6-3-7-3 1 3 3 4 7 3Zm0 1c3-5 6-3 7-3-1 3-3 4-7 3Z"/>',
  melon: '<ellipse cx="12" cy="8" rx="8" ry="5"/><path d="M5 5c1 3 1 5 0 6m7-8v9m7-7c-1 3-1 5 0 6M3 10h18c0 6-3.5 11-9 11S3 16 3 10Zm1 4c3 5 13 5 16 0M8.5 12.5l.5 1m3-.5v1m3-.5.5-1"/>',
  horse: '<path d="M6 10c2-2 6-2 8 0l2-5 3-1 2 3-2 2-1 4-3 1-1 7h-2l-.7-7H9l-1 7H6l.6-8-2.1 2L3 13l2-3ZM6 10C3 7 3 8 3 13M18 4l.5-1.5L20 5M8 9v4h5l1-3M9.5 15l.5 5m6-6 1 6M18.5 6.5h.01"/>',
  camel: '<path d="m5 12 1.5-6c.4-1.8 2.5-1.8 3 0l1.5 4 1.5-4c.6-1.8 2.6-1.8 3 0l1 6h1l1-6c.2-2 1.5-3 3.5-2.5L22 5v2l-2 .5-.5 6-3 2L16 21h-2l-.5-6H9l-1 6H6l.5-8-2 3H3ZM5 12c-2 0-2 2-2 4m6-6v3h5v-3M9.5 15l.5 5m6-5 1 5M20.5 5.5h.01"/>',
  'nan-stack': '<ellipse cx="13" cy="16" rx="8.5" ry="4"/><path d="M4.5 16v1c0 2.2 3.8 4 8.5 4s8.5-1.8 8.5-4v-1M2.5 10v2c0 3 3.6 5.5 8 5.5s8-2.5 8-5.5v-2"/><ellipse cx="10.5" cy="10" rx="8" ry="5.5"/><path d="M7 8.5h.01m3.5-1h.01m3.5 1h.01m-7 3h.01m3.5 1h.01m3.5-1h.01m-3.5-1.5h.01"/>',
});

export const referencePlacesColor = Object.freeze({
  surnai: '<g stroke="#17364b"><path fill="#bc8d43" d="M11 3h2v4l1 7c.5 2.5 2 4.2 4 6H6c2-1.8 3.5-3.5 4-6l1-7Z"/><path fill="#b54c3b" d="M8 18h8l2 2H6Z"/><path d="M10.8 7h2.4M6 21h12M12 9.5h.01M12 12h.01M12 14.5h.01"/></g>',
  mosque: '<g stroke="#17364b"><path fill="#f4e4c8" d="M3 9h2v12H3ZM19 9h2v12h-2ZM6.5 11.5h11V21h-11Z"/><path fill="#3f7d6a" d="m2.5 9 1.5-4 1.5 4ZM18.5 9 20 5l1.5 4ZM7.5 11.5c0-3 2-3.7 4.5-6 2.5 2.3 4.5 3 4.5 6Z"/><path fill="#bc8d43" d="M9.5 21v-4c0-1.4 1.2-2.4 2.5-3.5 1.3 1.1 2.5 2.1 2.5 3.5v4Z"/><path d="M12 5.5V3m-1.5 0h3M2.5 21h19"/></g>',
  mausoleum: '<g stroke="#17364b"><path fill="#3f7d6a" d="M8 6c0-2 2-3.5 4-4 2 1 4 2 4 4Z"/><path fill="#bc8d43" d="M4 21V8l2-2h12l2 2v13Z"/><path fill="#3f7d6a" d="M7 21v-9c0-3 3-5 5-7 2 2 5 4 5 7v9Z"/><path fill="#f4e4c8" d="M9.5 21v-8c0-1.7 1.1-2.8 2.5-4.3 1.4 1.5 2.5 2.6 2.5 4.3v8Z"/><path stroke="#f4e4c8" d="M5.5 10v8m13-8v8"/><path d="M3 21h18"/></g>',
  minaret: '<g stroke="#17364b"><path fill="#bc8d43" d="M8.5 21 10 8h4l1.5 13Z"/><path fill="#3f7d6a" d="M8.5 6h7v2h-7ZM9 6V4.5L12 2l3 2.5V6Z"/><path d="M7 21h10M9.7 11h4.6M9.3 15h5.4M9 18h6M12 8v3m-1.5 0v4m3 0v3m-3 0v3"/></g>',
  madrasa: '<g stroke="#17364b"><path fill="#bc8d43" d="M3 21V9h4V4h10v5h4v12Z"/><path fill="#3f7d6a" d="M7 4h10v17H7Z"/><path fill="#f4e4c8" d="M9.5 21v-8c0-1.8 1.1-3 2.5-4.5 1.4 1.5 2.5 2.7 2.5 4.5v8Z"/><path stroke="#f4e4c8" d="M10 6.5h4"/><path d="M4.8 12v3m0 3v1m14.4-7v3m0 3v1M2.5 21h19"/></g>',
  'traditional-house': '<g stroke="#17364b"><path fill="#bc8d43" d="M3 21V10h7V4h8v7h3v10Z"/><path fill="#f4e4c8" d="M3 10h12v11H3Z"/><path fill="#3f7d6a" d="M12.5 7h3v3h-3ZM5 15h2v2H5ZM17.5 14h1v3h-1Z"/><path fill="#b54c3b" d="M9 21v-3a2 2 0 0 1 4 0v3Z"/><path d="M3 13h7m5-2h3M2.5 21h19"/></g>',
  yurt: '<g stroke="#17364b"><path fill="#f4e4c8" d="M3 11h18v10H3Z"/><path fill="#bc8d43" d="m3 11 9-7 9 7Z"/><path fill="#3f7d6a" d="M3 14h18v4H3Z"/><path fill="#b54c3b" d="M10 14h4v7h-4Z"/><path d="M7 10l5-6 5 6M10.5 3h3"/><path stroke="#f4e4c8" d="m4 16 1.5-1 1.5 2 1.5-1m7 0 1.5-1 1.5 2 1.5-1"/></g>',
  'city-gate': '<g stroke="#17364b"><path fill="#bc8d43" d="M3 21V4h2v2h1V4h2v4h8V4h2v2h1V4h2v17Z"/><path fill="#f4e4c8" d="M8 21v-7c0-2.5 2.3-4.4 4-6 1.7 1.6 4 3.5 4 6v7Z"/><path d="M8 8v5m8-5v5M5.5 11v3m13-3v3M3 18h5m8 0h5M2.5 21h19"/></g>',
  'ancient-ruins': '<g stroke="#17364b"><path fill="#bc8d43" d="M3 21v-8l2-1 2 2V8l3 1V5l3-1 2 1v7l3-1 1-5h2v15Z"/><path fill="#f4e4c8" d="M3 21v-8l2-1 2 2v7Zm12 0v-9l3-1 1-5h2v15Z"/><path d="M10 14v3m7-1h1M5 18h2M3 21h18m-17-12 1-1m12-5h1"/></g>',
  landscape: '<g stroke="#17364b"><circle cx="5" cy="4.5" r="1.5" fill="#bc8d43"/><path fill="#bc8d43" d="m2.7 16 5.8-8 3 4 4.2-7 5.6 11Z"/><path fill="#f4e4c8" d="m6.7 10.5 1.8-2.5 1.2 3-1.2 1.3Zm6.9-1.8 2.1-3.7 1.3 4.5-1.3 1.4Z"/><path fill="#3f7d6a" d="M2.5 17c4-2 7 2 11 0s5-1 8-.5V22h-19Z"/><path stroke="#f4e4c8" d="M3.5 20c3-1.8 5.5.8 8.5-.2s4.5-1.5 8-.3"/></g>',
  'tea-set': '<g stroke="#17364b"><path fill="#3f7d6a" d="M6 9h8l1.2 4.5c.8 3-1.2 5.5-5.2 5.5s-6-2.5-5.2-5.5Z"/><path fill="#bc8d43" d="M5 11 2.5 8.5v5L5 16Z"/><path d="M14.5 10c4-1 5 4 1 5.5M6 6.5h8M10 4v2.5M7 21h6"/><path fill="#f4e4c8" d="m10 12 2 2-2 2-2-2ZM16 17h5.5c-.1 3-.9 4-2.7 4s-2.6-1-2.8-4Z"/><ellipse cx="18.8" cy="17" rx="2.7" ry=".8" fill="#bc8d43"/></g>',
  cotton: '<g stroke="#17364b"><path fill="#f4e4c8" d="M5.5 12c-3-1-2.5-5.5.5-5.5C5 2.5 10 2 12 5c2-3 7-2.5 6 1.5 3 0 3.5 4.5 1 5.5-.5 3-4.5 3-7 0-2 3-6 3-6.5 0Z"/><path d="M12 12v9m0-9V5"/><path fill="#3f7d6a" d="M12 18c-3-5-6-3-7-3 1 3 3 4 7 3Zm0 1c3-5 6-3 7-3-1 3-3 4-7 3Z"/></g>',
  melon: '<g stroke="#17364b"><ellipse cx="12" cy="8" rx="8" ry="5" fill="#3f7d6a"/><path stroke="#f4e4c8" d="M5 5c1 3 1 5 0 6m7-8v9m7-7c-1 3-1 5 0 6"/><path fill="#3f7d6a" d="M3 10h18c0 6-3.5 11-9 11S3 16 3 10Z"/><path fill="#bc8d43" d="M3 10h18l-1 4c-3 5-13 5-16 0Z"/><path stroke="#f4e4c8" d="m8.5 12.5.5 1m3-.5v1m3-.5.5-1"/></g>',
  horse: '<g stroke="#17364b"><path fill="#bc8d43" d="M6 10c2-2 6-2 8 0l2-5 3-1 2 3-2 2-1 4-3 1-1 7h-2l-.7-7H9l-1 7H6l.6-8-2.1 2L3 13l2-3Z"/><path d="M6 10C3 7 3 8 3 13M18 4l.5-1.5L20 5M9.5 15l.5 5m6-6 1 6M18.5 6.5h.01"/><path fill="#b54c3b" d="M8 9v4h5l1-3-3-1Z"/><path stroke="#f4e4c8" d="M9.5 10.5h2"/></g>',
  camel: '<g stroke="#17364b"><path fill="#bc8d43" d="m5 12 1.5-6c.4-1.8 2.5-1.8 3 0l1.5 4 1.5-4c.6-1.8 2.6-1.8 3 0l1 6h1l1-6c.2-2 1.5-3 3.5-2.5L22 5v2l-2 .5-.5 6-3 2L16 21h-2l-.5-6H9l-1 6H6l.5-8-2 3H3Z"/><path d="M5 12c-2 0-2 2-2 4m6.5-1 .5 5m6-5 1 5M20.5 5.5h.01"/><path fill="#b54c3b" d="M9 10h5v3H9Z"/><path stroke="#f4e4c8" d="M10.5 11.5h2"/></g>',
  'nan-stack': '<g stroke="#17364b"><path fill="#bc8d43" d="M4.5 16v1c0 2.2 3.8 4 8.5 4s8.5-1.8 8.5-4v-1Z"/><ellipse cx="13" cy="16" rx="8.5" ry="4" fill="#f4e4c8"/><path fill="#bc8d43" d="M2.5 10v2c0 3 3.6 5.5 8 5.5s8-2.5 8-5.5v-2Z"/><ellipse cx="10.5" cy="10" rx="8" ry="5.5" fill="#f4e4c8"/><path stroke="#b54c3b" d="M7 8.5h.01m3.5-1h.01m3.5 1h.01m-7 3h.01m3.5 1h.01m3.5-1h.01m-3.5-1.5h.01"/></g>',
});
