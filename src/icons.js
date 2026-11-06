/** Original 24×24 stroke drawings. The flag is a separate public-domain asset. */
const drawings = {
  'arrow-left': '<path d="M19 12H5m6-6-6 6 6 6"/>',
  'arrow-right': '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  'arrow-up': '<path d="M12 19V5m-6 6 6-6 6 6"/>',
  'arrow-down': '<path d="M12 5v14m-6-6 6 6 6-6"/>',
  'chevron-left': '<path d="m15 5-7 7 7 7"/>',
  'chevron-right': '<path d="m9 5 7 7-7 7"/>',
  'chevron-down': '<path d="m5 9 7 7 7-7"/>',
  'chevron-up': '<path d="m5 15 7-7 7 7"/>',
  'check': '<path d="m5 12 4 4L19 6"/>',
  'check-circle': '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  'close': '<path d="m6 6 12 12M18 6 6 18"/>',
  'plus': '<path d="M12 4v16M4 12h16"/>',
  'minus': '<path d="M4 12h16"/>',
  'search': '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  'menu': '<path d="M4 6h16M4 12h16M4 18h16"/>',
  'home': '<path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7"/>',
  'copy': '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M15 4H5a2 2 0 0 0-2 2v10"/>',
  'download': '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  'upload': '<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',
  'external-link': '<path d="M14 3h7v7m0-7L10 14M10 5H4v16h16v-6"/>',
  'link': '<path d="m9 15 6-6M8 13l-2 2a3.5 3.5 0 0 0 5 5l3-3M10 7l3-3a3.5 3.5 0 0 1 5 5l-2 2"/>',
  'code': '<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
  'settings': '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="8" cy="6" r="2" fill="var(--ug-surface,white)"/><circle cx="16" cy="12" r="2" fill="var(--ug-surface,white)"/><circle cx="10" cy="18" r="2" fill="var(--ug-surface,white)"/>',
  'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  'moon': '<path d="M20 15.5A9 9 0 0 1 8.5 4 9 9 0 1 0 20 15.5Z"/>',
  'heart': '<path d="M12 21 3.5 12a5 5 0 0 1 8.5-5 5 5 0 0 1 8.5 5Z"/>',
  'star': '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
  'user': '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  'users': '<circle cx="9" cy="7" r="3.5"/><path d="M2 21v-2a7 7 0 0 1 14 0v2M17 4a3.5 3.5 0 0 1 0 7m1 4a6 6 0 0 1 4 6"/>',
  'mail': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  'calendar': '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18M7 14h2m6 0h2m-10 4h2"/>',
  'book': '<path d="M12 5c-4-3-7-3-10-1v15c3-2 6-2 10 1 4-3 7-3 10-1V4c-3-2-6-2-10 1Zm0 0v15"/>',
  'keyboard': '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h1m4 0h1m4 0h1M6 13h1m4 0h1m4 0h1M7 16h10"/>',
  'globe': '<circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><path d="M2 12h20M4 6h16M4 18h16"/>',
  'language': '<path d="M3 5h11M8 2v3m3 0c0 6-3 10-8 13m1-9c1 3 4 6 8 8m1 4 4-11 4 11m-6-4h4"/>',
  'direction-rtl': '<path d="M20 5H8m5-3L8 5l5 3M20 12H4m0 7h12m-5-3 5 3-5 3"/>',
  'direction-ltr': '<path d="M4 5h12m-5-3 5 3-5 3M4 12h16M20 19H8m5-3-5 3 5 3"/>',
  'image': '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="2"/><path d="m3 17 5-5 4 4 4-7 5 8"/>',
  'palette': '<path d="M20 13c2-5-2-10-8-10a9 9 0 1 0 0 18c2 0 2-2 1-3s-1-3 1-3h3c1 0 2-1 3-2Z"/><path d="M7 8h.01M12 6h.01M17 9h.01M6 13h.01"/>',
  'edit': '<path d="m4 16 12-12 4 4L8 20H4Zm9-9 4 4"/>',
  'trash': '<path d="M3 6h18M9 3h6l1 3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  'undo': '<path d="M8 4 3 9l5 5M3 9h11a6 6 0 1 1 0 12"/>',
  'redo': '<path d="m16 4 5 5-5 5m5-5H10a6 6 0 1 0 0 12"/>',
  'info': '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.01"/>',
  'warning': '<path d="m12 3 10 18H2ZM12 9v5m0 3v.01"/>',
  'play': '<path d="m7 3 14 9-14 9Z"/>',
  'pause': '<path d="M7 4h3v16H7Zm7 0h3v16h-3Z"/>',
  'flower': '<path d="M12 11C5 8 7 2 12 4c5-2 7 4 0 7Zm1 1c3-7 9-5 7 0 2 5-4 7-7 0Zm-1 1c7 3 5 9 0 7-5 2-7-4 0-7Zm-1-1c-3 7-9 5-7 0-2-5 4-7 7 0Z"/>',
  'almond': '<path d="M12 2C3 8 4 18 12 22c8-4 9-14 0-20Zm0 5c-4 4-4 8 0 11m0-5 4-4m-4 7-4-3"/>',
  'doppa': '<path d="m3 10 9-6 9 6-2 9-7 3-7-3Zm0 0 9 3 9-3m-9 3v9M7 11l5-4 5 4"/>',
};
export const iconNames = Object.freeze(Object.keys(drawings).sort());
export const directionalIcons = Object.freeze(['arrow-left', 'arrow-right', 'chevron-left', 'chevron-right']);
export function escapeMarkup(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
export function iconSVG(name, options = {}) {
  if (!Object.hasOwn(drawings, name)) throw new RangeError(`Unknown icon: ${name}`);
  const { size = 24, strokeWidth = 1.7, label = '' } = options;
  if (!Number.isInteger(size) || size < 12 || size > 256) throw new RangeError('Icon size must be an integer from 12 to 256');
  if (!Number.isFinite(strokeWidth) || strokeWidth < .5 || strokeWidth > 4) throw new RangeError('Stroke width must be between 0.5 and 4');
  if (typeof label !== 'string' || label.length > 160) throw new TypeError('Use a label of at most 160 characters');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" focusable="false" ${label ? `role="img" aria-label="${escapeMarkup(label)}"` : 'aria-hidden="true"'}>${drawings[name]}</svg>`;
}
// Geometry from the public-domain Kokbayraq flag; see THIRD_PARTY_NOTICES.md.
export function flagSVG(options = {}) {
  const { width = 90, label = 'شەرقىي تۈركىستان بايرىقى / East Turkistan flag' } = options;
  if (!Number.isInteger(width) || width < 24 || width > 1800) throw new RangeError('Flag width must be an integer from 24 to 1800');
  if (typeof label !== 'string' || label.length > 160) throw new TypeError('Use a label of at most 160 characters');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width * 2 / 3}" viewBox="0 -30000 90000 60000" focusable="false" ${label ? `role="img" aria-label="${escapeMarkup(label)}"` : 'aria-hidden="true"'}><path fill="#559EE2" d="m0-30000h90000v60000H0"/><path fill="#fff" d="m41750 0 13568-4408-8386 11541V-7133l8386 11541zm925 8021a15000 15000 0 1 1 0-16042 12000 12000 0 1 0 0 16042"/></svg>`;
}
