export interface CleanupOptions {
  normalization?: 'none' | 'NFC' | 'NFKC'; lineEndings?: 'preserve' | 'lf'; trim?: boolean;
  removeDirectionalControls?: boolean; removeZeroWidthSpace?: boolean; removeByteOrderMark?: boolean;
  removeSoftHyphen?: boolean; removeJoiningControls?: boolean;
}
export interface CleanupPreview {
  readonly original: string; readonly text: string; readonly changed: boolean;
  readonly options: Readonly<Required<CleanupOptions>>;
  readonly changes: readonly { readonly operation: string; readonly count: number | null }[];
  readonly diff: { readonly changed: boolean; readonly prefix: string; readonly removed: string; readonly added: string; readonly suffix: string };
}
export interface WritingValidation { valid: boolean; message: string; length: number; maxLength: number }
export interface UyghurInputController {
  getValue(): string; setValue(value: string): boolean; previewCleanup(options?: CleanupOptions): CleanupPreview | null;
  applyCleanup(): boolean; undoCleanup(): boolean; validate(): WritingValidation; destroy(): void;
}
export declare function bindUyghurInput(root: HTMLElement, options?: { onChange?: (value: string) => void; maxLength?: number }): UyghurInputController;
