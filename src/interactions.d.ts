export interface InteractionController { syncMotion(): void; reset(): void; destroy(): void }
export interface InteractionOptions { motionAllowed?: () => boolean }
export type InteractionEffect = 'spotlight' | 'tilt' | 'selection' | 'send' | 'compare' | 'ripple';
export declare function bindSpotlight(root: HTMLElement, options?: InteractionOptions): InteractionController;
export declare function bindTilt(root: HTMLElement, options?: InteractionOptions): InteractionController;
export declare function bindSelection(root: HTMLElement, options?: InteractionOptions): InteractionController;
export declare function bindSend(root: HTMLElement, options?: InteractionOptions): InteractionController;
export declare function bindCompare(root: HTMLElement, options?: InteractionOptions): InteractionController;
export declare function bindRipple(root: HTMLElement, options?: InteractionOptions): InteractionController;
export declare const interactionBindings: Readonly<Record<InteractionEffect, (root: HTMLElement, options?: InteractionOptions) => InteractionController>>;
