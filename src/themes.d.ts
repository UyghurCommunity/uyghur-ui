export type ThemePreset = 'doppa' | 'atlas' | 'desert' | 'ceramic';
export interface CulturalTheme { readonly id: ThemePreset; readonly name: { readonly ug:string; readonly en:string }; readonly mode:'light'|'dark'; readonly tokens: Readonly<Record<string,string>>; readonly contrast: { readonly button:number; readonly text:number; readonly link:number } }
export declare const themePresets: readonly { readonly id:ThemePreset; readonly name:{readonly ug:string;readonly en:string};readonly accent:string;readonly bg:string;readonly surface:string;readonly soft:string }[];
export declare function createTheme(preset?:ThemePreset, options?:{accent?:string;radius?:number;fontSize?:number;lineHeight?:number;mode?:'light'|'dark'}):CulturalTheme;
export declare function contrastRatio(a:string,b:string):number;
export declare function exportThemeCSS(theme:CulturalTheme, options?:{selector?:string}):string;
export declare function exportThemeJSON(theme:CulturalTheme):string;
