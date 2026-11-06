export { iconSVG, flagSVG, iconNames, directionalIcons, iconCatalog, iconCategories, findIcons } from './icons.js';
export type { IconCategory, IconFilter, IconEntry } from './icons.js';
export interface Controller { destroy(): void }
export declare function bindDialog(dialog: HTMLDialogElement, options?: { trigger?: HTMLElement; initialFocus?: HTMLElement }): Controller & { open(): void; close(value?: string): void };
export declare function bindDisclosure(button: HTMLElement, panel: HTMLElement): Controller & { setOpen(value: boolean): void; toggle(): void };
export declare function bindTabs(container: HTMLElement): Controller & { select(tab: HTMLElement, focus?: boolean): void };
export interface FormError { field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement; message: string }
export declare function validateForm(form: HTMLFormElement, options?: { messages?: Record<string, string> }): FormError[];
export declare function bindForm(form: HTMLFormElement, options?: { messages?: Record<string, string>; onValid?: (form: HTMLFormElement, event: SubmitEvent) => void }): Controller & { validate(): FormError[] };
export declare function showToast(region: HTMLElement, message: string, options?: { duration?: number; dismissLabel?: string }): Controller & { element: HTMLElement; dismiss(): void };
