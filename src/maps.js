import { MAP_VIEWBOX, MAP_PATH, mapMetadata as sourceMetadata } from './map-data.js';
import { escapeMarkup } from './icons.js';

function freeze(value) { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; }
export const mapMetadata = freeze(JSON.parse(JSON.stringify(sourceMetadata)));

/** A north-up regional outline from the documented Natural Earth polygon. */
export function mapSVG({ width = 640, variant = 'outline', label = 'شەرقىي تۈركىستان خەرىتىسى / East Turkistan map', color = 'currentColor', strokeWidth = 4 } = {}) {
  if (!Number.isInteger(width) || width < 64 || width > 2048) throw new RangeError('Map width must be an integer from 64 to 2048');
  if (!['outline', 'filled'].includes(variant)) throw new RangeError('Map variant must be outline or filled');
  if (typeof label !== 'string' || label.length > 160) throw new TypeError('Use a map label of at most 160 characters');
  if (typeof color !== 'string' || !/^(?:currentColor|#[\da-fA-F]{3}|#[\da-fA-F]{6})$/.test(color)) throw new TypeError('Map color must be currentColor or a three/six-digit hex color');
  if (!Number.isFinite(strokeWidth) || strokeWidth < .5 || strokeWidth > 12) throw new RangeError('Map stroke width must be from 0.5 to 12');
  const [, , boxWidth, boxHeight] = MAP_VIEWBOX.split(' ').map(Number), height = Math.round(width * boxHeight / boxWidth * 1000) / 1000;
  const description = `${mapMetadata.boundaryBasis.ug} ${mapMetadata.boundaryBasis.en} Made with Natural Earth. Public domain.`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${MAP_VIEWBOX}" preserveAspectRatio="xMidYMid meet" focusable="false" ${label ? `role="img" aria-label="${escapeMarkup(label)}"` : 'aria-hidden="true"'}><desc>${escapeMarkup(description)}</desc><path d="${MAP_PATH}" fill="${variant === 'filled' ? color : 'none'}" fill-rule="evenodd" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
