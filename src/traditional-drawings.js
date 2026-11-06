/**
 * Original 24×24 pictograms inspired by Uyghur music, craft and everyday life.
 * Simplified symbols, not historical reproductions or instrument diagrams.
 * Instrument silhouettes were checked against the Wende Museum collection:
 * https://wendemuseum.org/traditional-central-asian-musical-instruments-from-the-collection-of-ian-price/
 */
export const traditionalDrawings = Object.freeze({
  // Long-necked plucked lutes: paired strings, small tambur body, rawap horns.
  dutar: '<path d="M10.5 3h3v8.5c1.1 1.8 4 3.1 4 5.6a5.5 4 0 0 1-11 0c0-2.5 2.9-3.8 4-5.6ZM9 5h1.5m3-1H15m-4 8v6.5m2-6.5v6.5M9.5 19h5"/>',
  tambur: '<path d="M11 3h2v12c1.7.8 3 1.9 3 3.6a4 2.4 0 0 1-8 0c0-1.7 1.3-2.8 3-3.6ZM9 5h2m2 2h2M11 10h2m-2 3h2m-1 2v4"/>',
  rawap: '<path d="M11 11V5c0-1.7 3-2.5 3-1s-1 2-1 2v5M11 10C7 8 5 10 7 13l3-1m3-2c4-2 6 0 4 3l-3-1"/><circle cx="12" cy="17" r="4"/><path d="M12 7v12M10 18h4"/>',
  // Bowed instruments retain a separate bow; the ghijek also has an end spike.
  ghijek: '<path d="M9 3h2v8M7 5h2m2 2h2M10 11v8m0 0v2"/><circle cx="10" cy="15" r="4"/><path d="m17 4 3 15m-1-15c-1 5 0 10 2 14M8 16h4"/>',
  satar: '<path d="M8 3h2v9c1.6 1.9 3.5 3.4 3.5 5.8a4.5 3.2 0 0 1-9 0c0-2.4 1.9-3.9 3.5-5.8ZM6 5h2m2 3h2M9 5v13m-2 1h4m6-15 3 16m-1-16c-1 5 0 11 2 15"/>',
  dap: '<circle cx="12" cy="12" r="8.5"/><path d="M7 6.5a7 7 0 0 1 10 0M7 17.5a7 7 0 0 0 10 0"/><circle cx="6.5" cy="12" r="1"/><circle cx="17.5" cy="12" r="1"/><path d="M12 4v2m0 12v2"/>',

  // Cloth, weaving and needlework use their own silhouettes and repeat patterns.
  atlas: '<path d="M4 3h16v18H4ZM7 6l3 3-3 3 3 3-3 3m7-12 3 3-3 3 3 3-3 3M4 3l2 2m14 16-2-2"/>',
  carpet: '<path d="M5 5h14v14H5ZM7 3v2m5-2v2m5-2v2M7 19v2m5-2v2m5-2v2m-5-13 4 4-4 4-4-4Z"/>',
  embroidery: '<circle cx="11" cy="13" r="8"/><path d="M9 5V3h4v2m-6 9 3 3 5-7m1-1 4-4m-1 3c2 0 2 3 0 4"/><path d="m7 10 2 2m2-4 2 2"/>',
  loom: '<path d="M5 3v18m14-18v18M5 6h14M5 18h14M8 6v5m4-5v5m4-5v5M8 15v3m4-3v3m4-3v3M3 13l4-2h10l4 2-4 2H7Z"/>',
  spindle: '<path d="M12 3v18m-5-5c0-3 2-6 5-8 3 2 5 5 5 8Zm0 0c2 2 8 2 10 0M9 11l6 2m-8 2 10 2M12 8c0-4 6-4 8-1"/>',

  // A covered aywan/veranda is distinct from a pointed arch and carved joinery.
  aywan: '<path d="m3 7 3-3h12l3 3ZM5 7v14m14-14v14M3 21h18M5 10h14M9 10v11m6-11v11M7 7v3m10-3v3"/>',
  archway: '<path d="M4 21V11c0-4 5-6 8-8 3 2 8 4 8 8v10M8 21V12c0-2 2-3.7 4-5 2 1.3 4 3 4 5v9M3 21h18"/>',
  'carved-door': '<path d="M5 3h14v18H5Zm7 0v18M8.5 6l2 3-2 3-2-3Zm7 0 2 3-2 3-2-3ZM7 16h3m4 0h3"/>',
  'lattice-window': '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="m4 10 6-6M4 16 16 4M8 20 20 8m-6 12 6-6M4 8l12 12M4 14l6 6M8 4l12 12M14 4l6 6"/>',

  // Foods and serving objects are shared cultural forms, shown without text.
  nan: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/><path d="M12 6h.01M12 18h.01M6 12h.01M18 12h.01M7.8 7.8h.01m8.4 0h.01m-8.4 8.4h.01m8.4 0h.01"/>',
  samsa: '<path d="m12 4 8.5 15.5c.4.7 0 1.5-.8 1.5H4.3c-.8 0-1.2-.8-.8-1.5ZM8 17l2-3 2 3 2-3 2 3"/>',
  polo: '<ellipse cx="12" cy="16.5" rx="8.5" ry="4"/><path d="M5 14c1-4 4-5 7-4 3-1 6 0 7 4M7 13l2-1m6 0 2 1m-6 0 2 1m-5 3 2-1m5 1 2-1M9 9l1-3m4 3 1-3"/>',
  laghman: '<ellipse cx="12" cy="13" rx="8.5" ry="2.5"/><path d="M3.5 13c.5 5 3.5 7.5 8.5 7.5s8-2.5 8.5-7.5M9 9c-3-3 2-5 1-6m3 7c-2-3 3-4 2-6m2 7c3-1 1-3 3-4M8 21h8"/>',
  teapot: '<path d="M8 9h9l1.5 4a5.5 5.5 0 0 1-11 0ZM9 6h7m-3.5-3v3M7.5 13 3 9v6l4.5 3M18 10h1a3 3 0 0 1 0 6h-1M9 20h7"/>',
  'tea-bowl': '<ellipse cx="12" cy="10" rx="8.5" ry="2.5"/><path d="M3.5 10c.5 6 3.5 9 8.5 9s8-3 8.5-9M8 21h8M8 15l2 1m4 0 2-1M9 5c-2-1 1-1 0-2m6 2c-2-1 1-1 0-2"/>',
  pomegranate: '<path d="m9 7-2-3 5 2 5-2-2 3c3 1.3 4.5 3.7 4.5 6.5A7.5 7.5 0 0 1 12 21a7.5 7.5 0 0 1-7.5-7.5C4.5 10.7 6 8.3 9 7Z"/><path d="M9 12h.01m6 0h.01M12 15h.01m-3 3h.01m6 0h.01"/>',

  // Orchard produce often seen in Uyghur tables and ornament.
  grapes: '<circle cx="7.5" cy="9" r="2.2"/><circle cx="12" cy="9" r="2.2"/><circle cx="16.5" cy="9" r="2.2"/><circle cx="9.8" cy="13.5" r="2.2"/><circle cx="14.2" cy="13.5" r="2.2"/><circle cx="12" cy="18" r="2.2"/><path d="M12 6V3m0 3c1-3 4-3 7-2-1 2-3 3-7 2"/>',
  apricot: '<path d="M12 8C7 5 3.5 9 4 14c.4 4 3.6 7 8 7s7.6-3 8-7c.5-5-3-9-8-6Zm0 1c-1.5 3-1.5 7 0 10M12 7c0-3 3-4 7-3-1 3-3 4-7 3Zm-1 0-1-3"/>',
});
