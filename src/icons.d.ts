export declare const iconNames: readonly string[];
export declare const coloredIconNames: readonly string[];
export declare const directionalIcons: readonly string[];
export type IconCategory = 'general' | 'music' | 'textiles' | 'architecture' | 'table' | 'garden' | 'clothing' | 'crafts' | 'motifs';
export type IconFilter = IconCategory | 'all' | 'traditional';
export type IconVariant = 'outline' | 'color';
export interface IconEntry { readonly name: string; readonly ug: string; readonly en: string; readonly category: IconCategory; readonly keywords: readonly string[]; readonly variants: readonly IconVariant[] }
export declare const iconCatalog: readonly IconEntry[];
export declare const iconCategories: readonly { readonly id: IconFilter; readonly ug: string; readonly en: string }[];
export declare function findIcons(query?: string, options?: { category?: IconFilter }): string[];
export declare function escapeMarkup(value: unknown): string;
export declare function iconSVG(name: string, options?: { size?: number; strokeWidth?: number; label?: string; variant?: IconVariant }): string;
export declare function flagSVG(options?: { width?: number; label?: string }): string;
