/**
 * Original 24×24 cultural pictograms, drawn from the supplied motif references.
 * These are simplified contemporary symbols, not historical reproductions.
 * Markup fragments inherit the renderer's stroke, caps, joins and viewBox.
 */
export const referenceClothingOutline = Object.freeze({
  'fur-hat': '<path d="M6 10V8c0-5 12-5 12 0v2M3 12c0-2 2-3 4-2 1-2 3-2 5-1 2-1 4-1 5 1 2-1 4 0 4 2v4c0 2-2 3-4 2-1 2-3 2-5 1-2 1-4 1-5-1-2 1-4 0-4-2Z"/><path d="m6 13 1 1m3-3 1 1m4 0 1 1m2 2 1 1M6 17l1-1m5 2 1-1"/>',
  'womens-headdress': '<path d="M6 8 4 20l5 1 3-11 3 11 5-1-2-12M6 8c0-7 12-7 12 0ZM8 6l2-1 2 1 2-1 2 1M7 12l-1 6m11-6 1 6"/>',
  'mens-coat': '<path d="m9 3-5 2-1 9 4 1 1-5-1 11h10l-1-11 1 5 4-1-1-9-5-2-3 4ZM9 3l3 4v14M8 11h8M7 18h3m4 0h3"/>',
  'womens-dress': '<path d="M9 3h6l4 5-2 3-2-3-1 4 5 9H5l5-9-1-4-2 3-2-3Zm0 0 3 3 3-3M10 12h4M9 18l3 1 3-1M8 21l2-6m6 6-2-6"/>',
  chapan: '<path d="m9 3-5 3-1 10 4 1 1-7-1 11h10l-1-11 1 7 4-1-1-10-5-3-3 5ZM9 3l1 7 2 3 2-3 1-7M8 13h8m-4 0v8"/>',
  sash: '<path d="m10 7-7-2v7l7-2m4-3 7-2v7l-7-2M10 6h4v5h-4Zm0 5L7 20l4-2 2-7m1 0 3 8-3 2-3-8M5 8l3 1m8 0 3-1M8 17l3-1m3 0 2 1"/>',
  boots: '<path d="M5 3h5v12c0 3-4 5-6 5H2v-3l3-3Zm9 0h5v12c0 3-4 5-6 5h-2v-3l3-3ZM5 6h5m4 0h5M2 18h5m4 0h5M7.5 8v5m9-5v5"/>',
  'traditional-shoes': '<path d="m4 11 5-7 3 2-4 9c-1.5 2-5 3-6 1-.8-2 .5-4 2-5Zm10 2 5-7 3 2-4 9c-1.5 2-5 3-6 1-.8-2 .5-4 2-5ZM6 9l3-4 2 2-3 4Zm10 2 3-4 2 2-3 4ZM4 14h.01m2-1h.01m8 3h.01m2-1h.01"/>',
  'ceramic-vase': '<path d="M9 3h6l-1 5c0 2 5 4 5 8 0 3-3 5-7 5s-7-2-7-5c0-4 5-6 5-8ZM8 3h8M9 6h6M7 19h10"/><path d="M12 16c-4-1-3-5 0-3 3-2 4 2 0 3Zm0 0c-2 3-5 0-2-1m2 1c2 3 5 0 2-1"/>',
  jewelry: '<circle cx="12" cy="4" r="1.5"/><path d="M12 6c3 3 6 4 6 8a6 6 0 0 1-12 0c0-4 3-5 6-8Zm0 3c-4 4-4 7 0 9 4-2 4-5 0-9ZM8 19l-1 2m5-1v2m4-3 1 2"/>',
  'doppa-top': '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="7"/><path d="M12 10c-3-2-3-4 0-5 3 1 3 3 0 5Zm2 2c2-3 4-3 5 0-1 3-3 3-5 0Zm-2 2c3 2 3 4 0 5-3-1-3-3 0-5Zm-2-2c-2 3-4 3-5 0 1-3 3-3 5 0Z"/><circle cx="12" cy="12" r="1"/>',
  'uyghur-medallion': '<path d="M12 4c2-2 5 0 5 3 3 0 5 3 3 5 2 2 0 5-3 5 0 3-3 5-5 3-2 2-5 0-5-3-3 0-5-3-3-5-2-2 0-5 3-5 0-3 3-5 5-3Z"/><circle cx="12" cy="12" r="4"/><path d="m12 9 3 3-3 3-3-3ZM12 4v2m0 12v2M4 12h2m12 0h2"/>',
  'floral-rosette': '<path d="M12 10C7 6 10 2 12 4c2-2 5 2 0 6Zm2 2c4-5 8-2 6 0 2 2-2 5-6 0Zm-2 2c5 4 2 8 0 6-2 2-5-2 0-6Zm-2-2c-4 5-8 2-6 0-2-2 2-5 6 0ZM7 8C3 8 3 3 8 6Zm9-1c0-4 5-4 2 1Zm1 9c4 0 4 5-1 2Zm-9 1c0 4-5 4-2-1Z"/><circle cx="12" cy="12" r="2"/>',
  'ornamental-border': '<path d="M3 6h18v12H3ZM3 8h18M3 16h18M10 12c-2-3-5-3-6 0 1 3 4 3 6 0Zm4 0c2-3 5-3 6 0-1 3-4 3-6 0ZM12 10c-2-2-4 0-2 2-2 2 0 4 2 2 2 2 4 0 2-2 2-2 0-4-2-2Z"/>',
  calligraphy: '<path d="m14 3 4 2-8 13-5 3 1-6ZM7 18l3-5M12 6l4 2m-3 12c3 0 7-1 7-3m-5-3c2 1 5 0 5-2"/>',
  'star-eight': '<path d="m12 2 2.4 4.2L19 5l-1.2 4.6L22 12l-4.2 2.4L19 19l-4.6-1.2L12 22l-2.4-4.2L5 19l1.2-4.6L2 12l4.2-2.4L5 5l4.6 1.2Z"/><path d="m12 8 4 4-4 4-4-4Z"/>',
  crescent: '<path d="M13 3a9 9 0 1 0 7.5 14A8 8 0 0 1 13 3Z"/><path d="m18 3 1 2.3 2.5.2-2 1.6.7 2.4L18 8l-2.2 1.5.7-2.4-2-1.6 2.5-.2Z"/>',
  'tree-of-life': '<path d="M12 20V7m0 7-5-4m5 1 5-4m-5 10 5-4m-5 4-5-3m1 7 4-2 4 2M12 7c-4-2-3-5 0-5 3 0 4 3 0 5ZM7 10c-4 1-5-3-5-5 4 0 6 2 5 5Zm10-3c-1-4 2-5 5-5 0 4-2 6-5 5ZM7 15c-4 1-5-2-4-5 3 0 5 2 4 5Zm10-2c0-4 3-5 5-4 0 3-2 5-5 4Z"/>',
  unity: '<path d="m2 7 3-1 3 4-3 6-3-1Zm20 0-2-1-3 4 2 6 3-1ZM6 10l3-3h3l6 6-4 5c-.6.6-1.5.8-2 .4l-6-4m12-4-3-3h-3l-3 3a1.4 1.4 0 0 0 2 2l1-1 5 5 2-2M10 15l3 3m0-5 3 3"/>',
  dove: '<path d="M4 14c4 1 6 0 8-3l2-3c1-2 4-2 5 0l2 1-3 1c0 4-3 7-7 7H6l-3 3Zm7 0C6 12 3 8 3 4c5 0 9 4 10 8M17 8h.01m2 4 2 6m-1-3c-3 0-3-2-2-3 2 0 3 1 2 3Zm1 2c-1-3 1-4 2-3 0 2 0 3-2 3Z"/>',
});

/** Fixed heritage palette: navy, gold, jade, red and cream. */
export const referenceClothingColor = Object.freeze({
  'fur-hat': '<path fill="#b54c3b" d="M6 10V8c0-5 12-5 12 0v2Z"/><path fill="#bc8d43" d="M3 12c0-2 2-3 4-2 1-2 3-2 5-1 2-1 4-1 5 1 2-1 4 0 4 2v4c0 2-2 3-4 2-1 2-3 2-5 1-2 1-4 1-5-1-2 1-4 0-4-2Z"/><path d="m6 13 1 1m3-3 1 1m4 0 1 1m2 2 1 1M6 17l1-1m5 2 1-1"/>',
  'womens-headdress': '<path fill="#f4e4c8" d="m6 8 6 2-3 11-5-1Zm12 0-6 2 3 11 5-1Z"/><path fill="#3f7d6a" d="M6 8c0-7 12-7 12 0Z"/><path stroke="#bc8d43" d="m8 6 2-1 2 1 2-1 2 1"/><path d="m7 12-1 6m11-6 1 6"/>',
  'mens-coat': '<path fill="#3f7d6a" d="m9 3-5 2-1 9 4 1 1-5-1 11h10l-1-11 1 5 4-1-1-9-5-2-3 4Z"/><path fill="#f4e4c8" d="m9 3 3 4 3-4-3 11Z"/><path d="M12 14v7"/><path fill="#b54c3b" d="M8 10h8v3H8Z"/><path stroke="#bc8d43" d="M7 18h3m4 0h3"/>',
  'womens-dress': '<path fill="#b54c3b" d="M9 3h6l4 5-2 3-2-3-1 4 5 9H5l5-9-1-4-2 3-2-3Z"/><path fill="#f4e4c8" d="m9 3 3 3 3-3Z"/><path fill="#bc8d43" d="M10 11h4v2h-4Z"/><path stroke="#bc8d43" d="m9 18 3 1 3-1M8 21l2-6m6 6-2-6"/>',
  chapan: '<path fill="#bc8d43" d="m9 3-5 3-1 10 4 1 1-7-1 11h10l-1-11 1 7 4-1-1-10-5-3-3 5Z"/><path fill="#17364b" d="m9 3 1 7 2 3 2-3 1-7-3 5Z"/><path fill="#3f7d6a" d="M8 12h8v3H8Z"/><path d="M12 15v6"/>',
  sash: '<path fill="#b54c3b" d="m10 7-7-2v7l7-2Zm4 0 7-2v7l-7-2ZM10 11 7 20l4-2 2-7Zm4 0 3 8-3 2-3-8Z"/><path fill="#bc8d43" d="M10 6h4v5h-4Z"/><path stroke="#bc8d43" d="m5 8 3 1m8 0 3-1M8 17l3-1m3 0 2 1"/>',
  boots: '<path fill="#f4e4c8" d="M5 3h5v12c0 3-4 5-6 5H2v-3l3-3Zm9 0h5v12c0 3-4 5-6 5h-2v-3l3-3Z"/><path fill="#bc8d43" d="M5 3h5v3H5Zm9 0h5v3h-5Z"/><path d="M2 18h5m4 0h5M7.5 8v5m9-5v5"/>',
  'traditional-shoes': '<path fill="#b54c3b" d="m4 11 5-7 3 2-4 9c-1.5 2-5 3-6 1-.8-2 .5-4 2-5Zm10 2 5-7 3 2-4 9c-1.5 2-5 3-6 1-.8-2 .5-4 2-5Z"/><path fill="#f4e4c8" d="m6 9 3-4 2 2-3 4Zm10 2 3-4 2 2-3 4Z"/><path stroke="#bc8d43" d="M4 14h.01m2-1h.01m8 3h.01m2-1h.01"/>',
  'ceramic-vase': '<path fill="#f4e4c8" d="M9 3h6l-1 5c0 2 5 4 5 8 0 3-3 5-7 5s-7-2-7-5c0-4 5-6 5-8Z"/><path fill="#bc8d43" d="M9 3h6v3H9Z"/><path d="M8 3h8M7 19h10"/><path fill="#3f7d6a" d="M12 16c-4-1-3-5 0-3 3-2 4 2 0 3Zm0 0c-2 3-5 0-2-1m2 1c2 3 5 0 2-1"/>',
  jewelry: '<circle fill="#bc8d43" cx="12" cy="4" r="1.5"/><path fill="#bc8d43" d="M12 6c3 3 6 4 6 8a6 6 0 0 1-12 0c0-4 3-5 6-8Z"/><path fill="#b54c3b" d="M12 9c-4 4-4 7 0 9 4-2 4-5 0-9Z"/><path d="m8 19-1 2m5-1v2m4-3 1 2"/>',
  'doppa-top': '<circle fill="#17364b" cx="12" cy="12" r="9"/><circle fill="none" stroke="#bc8d43" cx="12" cy="12" r="7"/><path fill="#f4e4c8" d="M12 10c-3-2-3-4 0-5 3 1 3 3 0 5Zm2 2c2-3 4-3 5 0-1 3-3 3-5 0Zm-2 2c3 2 3 4 0 5-3-1-3-3 0-5Zm-2-2c-2 3-4 3-5 0 1-3 3-3 5 0Z"/><circle fill="#bc8d43" cx="12" cy="12" r="1"/>',
  'uyghur-medallion': '<path fill="#bc8d43" d="M12 4c2-2 5 0 5 3 3 0 5 3 3 5 2 2 0 5-3 5 0 3-3 5-5 3-2 2-5 0-5-3-3 0-5-3-3-5-2-2 0-5 3-5 0-3 3-5 5-3Z"/><circle fill="#17364b" cx="12" cy="12" r="4"/><path fill="#f4e4c8" d="m12 9 3 3-3 3-3-3Z"/><path d="M12 4v2m0 12v2M4 12h2m12 0h2"/>',
  'floral-rosette': '<path fill="#3f7d6a" d="M7 8C3 8 3 3 8 6Zm9-1c0-4 5-4 2 1Zm1 9c4 0 4 5-1 2Zm-9 1c0 4-5 4-2-1Z"/><path fill="#b54c3b" d="M12 10C7 6 10 2 12 4c2-2 5 2 0 6Zm2 2c4-5 8-2 6 0 2 2-2 5-6 0Zm-2 2c5 4 2 8 0 6-2 2-5-2 0-6Zm-2-2c-4 5-8 2-6 0-2-2 2-5 6 0Z"/><circle fill="#bc8d43" cx="12" cy="12" r="2"/>',
  'ornamental-border': '<path fill="#17364b" d="M3 6h18v12H3Z"/><path stroke="#bc8d43" d="M3 8h18M3 16h18"/><path fill="#3f7d6a" d="M10 12c-2-3-5-3-6 0 1 3 4 3 6 0Zm4 0c2-3 5-3 6 0-1 3-4 3-6 0Z"/><path fill="#bc8d43" d="M12 10c-2-2-4 0-2 2-2 2 0 4 2 2 2 2 4 0 2-2 2-2 0-4-2-2Z"/>',
  calligraphy: '<path fill="#bc8d43" d="m14 3 4 2-8 13-5 3 1-6Z"/><path fill="#17364b" d="m6 15 4 3-5 3Z"/><path d="m7 18 3-5M12 6l4 2"/><path stroke="#b54c3b" d="M13 20c3 0 7-1 7-3m-5-3c2 1 5 0 5-2"/>',
  'star-eight': '<path fill="#bc8d43" d="m12 2 2.4 4.2L19 5l-1.2 4.6L22 12l-4.2 2.4L19 19l-4.6-1.2L12 22l-2.4-4.2L5 19l1.2-4.6L2 12l4.2-2.4L5 5l4.6 1.2Z"/><path fill="#3f7d6a" d="m12 8 4 4-4 4-4-4Z"/>',
  crescent: '<path fill="#3f7d6a" d="M13 3a9 9 0 1 0 7.5 14A8 8 0 0 1 13 3Z"/><path fill="#bc8d43" d="m18 3 1 2.3 2.5.2-2 1.6.7 2.4L18 8l-2.2 1.5.7-2.4-2-1.6 2.5-.2Z"/>',
  'tree-of-life': '<path stroke="#bc8d43" d="M12 20V7m0 7-5-4m5 1 5-4m-5 10 5-4m-5 4-5-3m1 7 4-2 4 2"/><path fill="#b54c3b" d="M12 7c-4-2-3-5 0-5 3 0 4 3 0 5Z"/><path fill="#3f7d6a" d="M7 10c-4 1-5-3-5-5 4 0 6 2 5 5Zm10-3c-1-4 2-5 5-5 0 4-2 6-5 5ZM7 15c-4 1-5-2-4-5 3 0 5 2 4 5Zm10-2c0-4 3-5 5-4 0 3-2 5-5 4Z"/>',
  unity: '<path fill="#f4e4c8" d="m6 10 3-3h3l6 6-4 5c-.6.6-1.5.8-2 .4l-6-4Z"/><path fill="#f4e4c8" d="m18 10-3-3h-3l-3 3a1.4 1.4 0 0 0 2 2l1-1 5 5 2-2Z"/><path fill="#17364b" d="m2 7 3-1 3 4-3 6-3-1Z"/><path fill="#3f7d6a" d="m22 7-2-1-3 4 2 6 3-1Z"/><path d="m10 15 3 3m0-5 3 3"/>',
  dove: '<path fill="#f4e4c8" d="M4 14c4 1 6 0 8-3l2-3c1-2 4-2 5 0l2 1-3 1c0 4-3 7-7 7H6l-3 3Z"/><path fill="#f4e4c8" d="M11 14C6 12 3 8 3 4c5 0 9 4 10 8Z"/><circle fill="#17364b" cx="17" cy="8" r=".45" stroke="none"/><path d="m19 12 2 6"/><path fill="#3f7d6a" d="M20 15c-3 0-3-2-2-3 2 0 3 1 2 3Zm1 2c-1-3 1-4 2-3 0 2 0 3-2 3Z"/>',
});
