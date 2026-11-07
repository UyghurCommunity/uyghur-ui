export interface ComboboxController { open(): void; close(): void; getValue(): string; select(value: string): boolean; destroy(): void }
export declare function bindCombobox(root: HTMLElement, options?: { onChange?: (value: string) => void }): ComboboxController;
export interface DropdownController { open(last?: boolean): void; close(focus?: boolean): void; toggle(): void; destroy(): void }
export declare function bindDropdown(root: HTMLElement): DropdownController;
export declare function bindDrawer(root: HTMLElement, options?: { initialFocus?: HTMLElement; dismissOutside?: boolean }): { open(): void; close(value?: string): void; destroy(): void };
export interface DataTableState { readonly page: number; readonly pageCount: number; readonly pageSize: number; readonly total: number; readonly filtered: number; readonly sort: { readonly column: number; readonly direction: 'ascending' | 'descending' } | null }
export declare function bindDataTable(root: HTMLElement, options?: { pageSize?: number }): { getState(): DataTableState; setPage(page: number): void; refresh(): void; destroy(): void };
