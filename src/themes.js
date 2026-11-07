const freeze = (value) => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
export const themePresets = freeze([
  { id: 'doppa', name: { ug: 'دوپپا', en: 'Doppa' }, accent: '#27654b', bg: '#f5f2e9', surface: '#fffdf6', soft: '#e7eee4' },
  { id: 'atlas', name: { ug: 'ئەتلەس', en: 'Atlas' }, accent: '#9a3f49', bg: '#fbf3ef', surface: '#fffaf7', soft: '#f3e3e0' },
  { id: 'desert', name: { ug: 'قۇملۇق', en: 'Desert' }, accent: '#855b22', bg: '#f7efde', surface: '#fffcf5', soft: '#efe1c7' },
  { id: 'ceramic', name: { ug: 'ساپال', en: 'Ceramic' }, accent: '#176487', bg: '#eff5f6', surface: '#fbffff', soft: '#deedf1' },
]);
const hex = (value) => typeof value === 'string' && /^#[\da-f]{6}$/i.test(value);
function luminance(color) { const values = color.slice(1).match(/../g).map((c) => parseInt(c, 16) / 255).map((c) => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4); return values[0] * .2126 + values[1] * .7152 + values[2] * .0722; }
export function contrastRatio(a, b) { if (!hex(a) || !hex(b)) throw new TypeError('Use six-digit hex colors'); const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
export function createTheme(preset = 'doppa', options = {}) {
  const selected = themePresets.find(({ id }) => id === preset);
  if (!selected) throw new RangeError('Unknown cultural theme');
  if (!options || typeof options !== 'object' || Array.isArray(options)) throw new TypeError('Theme options must be an object');
  for (const key of Object.keys(options)) if (!['accent','radius','fontSize','lineHeight','mode'].includes(key)) throw new TypeError('Unknown theme option');
  const { accent = selected.accent, radius = 10, fontSize = 17, lineHeight = 2.2, mode = 'light' } = options;
  if (!hex(accent)) throw new TypeError('Accent must be a six-digit hex color');
  for (const [key, value, min, max] of [['radius',radius,0,24],['fontSize',fontSize,14,24],['lineHeight',lineHeight,1.6,2.6]]) if (!Number.isFinite(value) || value < min || value > max) throw new RangeError(`Invalid ${key}`);
  if (!['light','dark'].includes(mode)) throw new RangeError('Mode must be light or dark');
  const dark = mode === 'dark', surface = dark ? '#172d3b' : selected.surface;
  // Button foreground and surface are separate tokens so every chosen accent remains legible.
  const foreground = contrastRatio(accent, '#ffffff') >= contrastRatio(accent, '#000000') ? '#ffffff' : '#000000';
  const link = dark ? '#a6d7fc' : (Math.min(contrastRatio(accent, selected.bg), contrastRatio(accent, selected.soft)) >= 4.5 ? accent : '#17364b');
  return freeze({ id: selected.id, name: { ...selected.name }, mode, tokens: {
    '--ug-bg': dark ? '#10212d' : selected.bg, '--ug-surface': surface,
    '--ug-soft': dark ? '#233f53' : selected.soft, '--ug-text': dark ? '#edf6fa' : '#17364b',
    '--ug-muted': dark ? '#b6cbd5' : '#526673', '--ug-line': dark ? '#536e7d' : '#b7c7cc',
    '--ug-blue': accent.toLowerCase(), '--ug-blue-hover': accent.toLowerCase(), '--ug-accent': accent.toLowerCase(),
    '--ug-button-text': foreground, '--ug-link': link, '--ug-focus': dark ? '#a6d7fc' : '#176487',
    '--ug-danger': dark ? '#ffb9b0' : '#a62833', '--ug-radius': `${radius}px`,
    '--ug-font-size': `${fontSize}px`, '--ug-line-height': String(lineHeight), '--ug-font': '"ALKATIP Basma",Tahoma,serif',
  }, contrast: { button: contrastRatio(accent, foreground), text: contrastRatio(dark ? '#edf6fa' : '#17364b', surface), link: contrastRatio(link, dark ? '#10212d' : selected.bg) } });
}
function verify(theme) { if (!theme || !theme.tokens || !themePresets.some(({ id }) => theme.id === id)) throw new TypeError('Use a generated theme'); for (const [key,value] of Object.entries(theme.tokens)) if (!/^--ug-[a-z-]+$/.test(key) || typeof value !== 'string' || /[{};<>\n\r]/.test(value)) throw new TypeError('Unsafe theme token'); }
export function exportThemeCSS(theme, { selector = '.ug-ui' } = {}) { verify(theme); if (typeof selector !== 'string' || !/^(?:\.[a-zA-Z][\w-]*|:root|\[data-ug-theme="(?:light|dark)"\])$/.test(selector)) throw new TypeError('Use a single class, :root, or theme selector'); return `${selector}{\n${Object.entries(theme.tokens).map(([key,value]) => `  ${key}: ${value};`).join('\n')}\n  font-size:var(--ug-font-size);\n  line-height:var(--ug-line-height);\n}\n${selector} .ug-button:not(.ug-button--secondary):not(.ug-button--ghost):not(.ug-button--danger){color:var(--ug-button-text)}\n${selector} a:not(.ug-button){color:var(--ug-link)}\n`; }
export function exportThemeJSON(theme) { verify(theme); return JSON.stringify({ schemaVersion: 1, ...theme }, null, 2) + '\n'; }
