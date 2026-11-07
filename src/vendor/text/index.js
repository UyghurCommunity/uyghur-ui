/** Unicode labels here describe code points, not resolved Unicode bidi levels. */
export const DIRECTIONAL_CONTROLS = Object.freeze({
  '\u061c': 'ALM', '\u200e': 'LRM', '\u200f': 'RLM', '\u202a': 'LRE', '\u202b': 'RLE',
  '\u202c': 'PDF', '\u202d': 'LRO', '\u202e': 'RLO', '\u2066': 'LRI', '\u2067': 'RLI',
  '\u2068': 'FSI', '\u2069': 'PDI',
});

export const INVISIBLE_CHARACTERS = Object.freeze({
  '\u0000': 'NUL', '\t': 'TAB', '\n': 'LF', '\r': 'CR', ' ': 'SPACE', '\u00a0': 'NBSP',
  '\u00ad': 'SOFT HYPHEN', '\u034f': 'CGJ', '\u180e': 'MVS', '\u200b': 'ZWSP',
  '\u200c': 'ZWNJ', '\u200d': 'ZWJ', '\u2028': 'LINE SEPARATOR', '\u2029': 'PARAGRAPH SEPARATOR',
  '\u202f': 'NARROW NBSP', '\u2060': 'WORD JOINER', '\ufeff': 'BOM / ZWNBSP',
  ...DIRECTIONAL_CONTROLS,
});

const CLEANUP_DEFAULTS = Object.freeze({
  normalization: 'none', removeDirectionalControls: false, removeZeroWidthSpace: false,
  removeByteOrderMark: false, removeSoftHyphen: false, removeJoiningControls: false,
  trim: false, lineEndings: 'preserve',
});

function requireText(text, name = 'text') {
  if (typeof text !== 'string') throw new TypeError(`${name} must be a string`);
}
function readOptions(value, keys) {
  if (value === undefined) return {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError('options must be an object');
  for (const key of Object.keys(value)) if (!keys.includes(key)) throw new TypeError(`Unknown option: ${key}`);
  return value;
}
function readLimit(limit = 400) {
  if (!Number.isInteger(limit) || limit < 1 || limit > 10000) throw new RangeError('limit must be an integer from 1 to 10000');
  return limit;
}
function readDirection(direction = 'auto') {
  if (!['auto', 'rtl', 'ltr'].includes(direction)) throw new TypeError('direction must be auto, rtl, or ltr');
  return direction;
}
function readLocale(locale = 'ug') {
  if (typeof locale !== 'string' || !locale) throw new TypeError('locale must be a nonempty BCP 47 language tag');
  // Canonicalization also validates the tag even when Segmenter is unavailable.
  return Intl.getCanonicalLocales(locale)[0];
}
function codePointLabel(character) {
  return 'U+' + character.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
}
function isUnpairedSurrogate(character) {
  const value = character.codePointAt(0);
  return value >= 0xd800 && value <= 0xdfff;
}

/** UTF-16 indices match textarea selection offsets. Fallback is explicitly not grapheme segmentation. */
export function segmentGraphemes(text, options) {
  requireText(text);
  const { locale } = readOptions(options, ['locale']);
  const language = readLocale(locale);
  if (typeof Intl.Segmenter === 'function') {
    const segments = Array.from(new Intl.Segmenter(language, { granularity: 'grapheme' }).segment(text), (part) => ({
      segment: part.segment, index: part.index, end: part.index + part.segment.length,
    }));
    return { mode: 'grapheme', segments };
  }
  let index = 0;
  const segments = Array.from(text, (segment) => {
    const entry = { segment, index, end: index + segment.length };
    index = entry.end;
    return entry;
  });
  return { mode: 'code-point-fallback', segments };
}

function describeCharacter(character, index, offset) {
  const directionalControl = DIRECTIONAL_CONTROLS[character] || null;
  const joiningControl = character === '\u200c' || character === '\u200d';
  const defaultIgnorable = /\p{Default_Ignorable_Code_Point}/u.test(character);
  const whitespace = /\p{White_Space}/u.test(character);
  const control = /\p{Cc}/u.test(character);
  const combiningMark = /\p{Mark}/u.test(character);
  const unpairedSurrogate = isUnpairedSurrogate(character);
  const invisible = defaultIgnorable || whitespace || control;
  const category = unpairedSurrogate ? 'Unpaired surrogate' : directionalControl ? 'Directional control'
    : joiningControl ? 'Joining control' : control ? 'Control character' : whitespace ? 'Whitespace'
    : defaultIgnorable ? 'Default ignorable' : combiningMark ? 'Combining mark'
    : /\p{Script=Arabic}/u.test(character) ? 'Arabic script' : /\p{Script=Latin}/u.test(character) ? 'Latin script'
    : /\p{Number}/u.test(character) ? 'Number' : /\p{Punctuation}/u.test(character) ? 'Punctuation' : 'Symbol / other';
  const label = INVISIBLE_CHARACTERS[character] || (unpairedSurrogate ? 'UNPAIRED SURROGATE' : invisible ? codePointLabel(character) : null);
  return {
    index, offset, end: offset + character.length, character,
    codePoint: codePointLabel(character), escape: character.length === 2
      ? `\\u{${character.codePointAt(0).toString(16).toUpperCase()}}`
      : `\\u${character.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}`,
    category, label, display: label ? `[${label}]` : character,
    invisible, directionalControl, joiningControl, defaultIgnorable, combiningMark, unpairedSurrogate,
  };
}

export function inspectUnicode(text, options) {
  requireText(text);
  const { limit: requestedLimit, locale } = readOptions(options, ['limit', 'locale']);
  const limit = readLimit(requestedLimit);
  const segmentation = segmentGraphemes(text, { locale });
  const counts = { utf16Units: text.length, codePoints: 0, graphemes: segmentation.mode === 'grapheme' ? segmentation.segments.length : null,
    invisible: 0, directionalControls: 0, joiningControls: 0, defaultIgnorables: 0, combiningMarks: 0, unpairedSurrogates: 0 };
  const rows = [];
  let offset = 0;
  for (const character of text) {
    const row = describeCharacter(character, counts.codePoints, offset);
    if (rows.length < limit) rows.push(row);
    counts.codePoints++;
    counts.invisible += Number(row.invisible);
    counts.directionalControls += Number(Boolean(row.directionalControl));
    counts.joiningControls += Number(row.joiningControl);
    counts.defaultIgnorables += Number(row.defaultIgnorable);
    counts.combiningMarks += Number(row.combiningMark);
    counts.unpairedSurrogates += Number(row.unpairedSurrogate);
    offset = row.end;
  }
  return {
    counts, rows, truncated: counts.codePoints > limit, limit,
    segmentation: segmentation.mode,
    graphemes: segmentation.segments.slice(0, limit),
    graphemesTruncated: segmentation.segments.length > limit,
    normalized: { NFC: text === text.normalize('NFC'), NFKC: text === text.normalize('NFKC') },
  };
}

/** Make invisible code points explicit; this output is a display aid, not a round-trip encoding. */
export function visibleText(text, options) {
  requireText(text);
  const { showSpaces = true } = readOptions(options, ['showSpaces']);
  if (typeof showSpaces !== 'boolean') throw new TypeError('showSpaces must be a boolean');
  return Array.from(text, (character) => {
    if (character === ' ' && !showSpaces) return ' ';
    const row = describeCharacter(character, 0, 0);
    if (!row.invisible && !row.unpairedSurrogate) return character;
    return row.display + (character === '\n' || character === '\r' || character === '\u2028' || character === '\u2029' ? '\n' : '');
  }).join('');
}

/** A compact contiguous replacement with boundaries at graphemes (code points on fallback). */
export function diffText(before, after) {
  requireText(before, 'before'); requireText(after, 'after');
  const a = segmentGraphemes(before).segments.map((part) => part.segment);
  const b = segmentGraphemes(after).segments.map((part) => part.segment);
  let prefixLength = 0;
  while (prefixLength < a.length && prefixLength < b.length && a[prefixLength] === b[prefixLength]) prefixLength++;
  let suffixLength = 0;
  while (suffixLength < a.length - prefixLength && suffixLength < b.length - prefixLength
    && a[a.length - 1 - suffixLength] === b[b.length - 1 - suffixLength]) suffixLength++;
  return { changed: before !== after, prefix: a.slice(0, prefixLength).join(''),
    removed: a.slice(prefixLength, a.length - suffixLength).join(''),
    added: b.slice(prefixLength, b.length - suffixLength).join(''),
    suffix: suffixLength ? a.slice(a.length - suffixLength).join('') : '' };
}

function cleanupOptions(value) {
  const requested = readOptions(value, Object.keys(CLEANUP_DEFAULTS));
  const options = { ...CLEANUP_DEFAULTS, ...requested };
  if (!['none', 'NFC', 'NFKC'].includes(options.normalization)) throw new TypeError('normalization must be none, NFC, or NFKC');
  if (!['preserve', 'lf'].includes(options.lineEndings)) throw new TypeError('lineEndings must be preserve or lf');
  for (const key of Object.keys(CLEANUP_DEFAULTS).filter((key) => !['normalization', 'lineEndings'].includes(key))) {
    if (typeof options[key] !== 'boolean') throw new TypeError(`${key} must be a boolean`);
  }
  return options;
}

/** No-op by default. Does not strip Arabic marks or letters, or guess a spelling/transliteration. */
export function previewCleanup(text, requestedOptions) {
  requireText(text);
  const options = cleanupOptions(requestedOptions);
  const changes = [];
  let result = text;
  const removals = [
    ['removeDirectionalControls', (char) => Boolean(DIRECTIONAL_CONTROLS[char])],
    ['removeZeroWidthSpace', (char) => char === '\u200b'],
    ['removeByteOrderMark', (char) => char === '\ufeff'],
    ['removeSoftHyphen', (char) => char === '\u00ad'],
    ['removeJoiningControls', (char) => char === '\u200c' || char === '\u200d'],
  ];
  for (const [operation, matches] of removals) {
    if (!options[operation]) continue;
    let count = 0;
    result = Array.from(result, (char) => { if (matches(char)) { count++; return ''; } return char; }).join('');
    if (count) changes.push({ operation, count });
  }
  if (options.lineEndings === 'lf') {
    const matches = result.match(/\r\n|\r/g);
    if (matches) { result = result.replace(/\r\n|\r/g, '\n'); changes.push({ operation: 'lineEndings', count: matches.length }); }
  }
  if (options.trim) {
    // String.trim also removes BOM and NBSP at the edges; this is explicit and documented.
    const trimmed = result.trim();
    if (trimmed !== result) {
      changes.push({ operation: 'trim', count: Array.from(result).length - Array.from(trimmed).length });
      result = trimmed;
    }
  }
  if (options.normalization !== 'none') {
    const normalized = result.normalize(options.normalization);
    if (normalized !== result) changes.push({ operation: options.normalization, count: null });
    result = normalized;
  }
  return { original: text, text: result, changed: text !== result, options, changes, diff: diffText(text, result) };
}

export function escapeHTML(text) {
  requireText(text);
  return text.replace(/[&<>"'\r]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '\r': '&#13;' })[character]);
}

export const FONT_FACE_CSS = `@font-face {
  font-family: "ALKATIP Basma";
  src: url("https://db.onlinewebfonts.com/t/3c16518f40da2fc2901f37666c0556a7.woff2") format("woff2"),
       url("https://db.onlinewebfonts.com/t/3c16518f40da2fc2901f37666c0556a7.woff") format("woff"),
       url("https://db.onlinewebfonts.com/t/3c16518f40da2fc2901f37666c0556a7.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}`;

export function createRTLFixture(text, options) {
  requireText(text);
  const { direction: requestedDirection, lang = 'ug', title = 'Uyghur text fixture', includeFontFace = false } = readOptions(options, ['direction', 'lang', 'title', 'includeFontFace']);
  const direction = readDirection(requestedDirection);
  if (typeof lang !== 'string' || !/^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/.test(lang)) throw new TypeError('lang must be a BCP 47 language tag');
  requireText(title, 'title');
  if (typeof includeFontFace !== 'boolean') throw new TypeError('includeFontFace must be a boolean');
  const warnings = [];
  let renderedText = '';
  for (const character of text) {
    if (character === '\0' || isUnpairedSurrogate(character)) renderedText += '\ufffd';
    else renderedText += character;
  }
  if (renderedText !== text) warnings.push('HTML cannot round-trip NUL or unpaired surrogates. Those values render as U+FFFD; use the JSON report to preserve the original JavaScript string.');
  const css = (includeFontFace ? FONT_FACE_CSS + '\n' : '') + `.text-fixture {
  max-inline-size: 52rem;
  margin-inline: auto;
  padding: 1.5rem;
  border: 1px solid #b9d5e8;
  border-radius: 1rem;
  color: #132a3c;
  background: #fff;
  font-family: "ALKATIP Basma", Tahoma, Arial, sans-serif;
  line-height: 2.2;
}
.text-fixture__input {
  margin: 0 0 1rem;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  unicode-bidi: isolate;
  text-align: start;
  font: inherit;
}
.text-fixture bdi { unicode-bidi: isolate; }
.text-fixture code { font-family: ui-monospace, "ALKATIP Basma", monospace; }
`;
  // A div with pre-wrap preserves an initial LF; HTML's <pre> start-tag newline rule would discard it.
  const html = `<section class="text-fixture" lang="${escapeHTML(lang)}" dir="${direction}">\n  <div class="text-fixture__input" dir="${direction}">${escapeHTML(renderedText)}</div>\n  <p>ئۇلىنىش: <bdi dir="ltr"><code>https://example.com/ug?q=123</code></bdi> · سان: <bdi dir="ltr">2026 / 123.45</bdi></p>\n</section>`;
  const document = `<!doctype html>\n<html lang="${escapeHTML(lang)}" dir="${direction}">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1">\n  <title>${escapeHTML(title)}</title>\n  <style>\n${css}  </style>\n</head>\n<body>\n${html}\n</body>\n</html>\n`;
  return { direction, lang, html, css, document, warnings };
}

/** A deterministic report; exported JSON intentionally includes the user's original text. */
export function createTextReport(text, options) {
  requireText(text);
  const { direction: requestedDirection, cleanup, limit } = readOptions(options, ['direction', 'cleanup', 'limit']);
  return {
    schemaVersion: 1,
    generator: { name: '@uyghurcommunity/text', version: '0.1.0' },
    direction: readDirection(requestedDirection),
    text,
    inspection: inspectUnicode(text, { limit }),
    cleanupPreview: previewCleanup(text, cleanup),
  };
}
