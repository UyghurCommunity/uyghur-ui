import type * as React from 'react';
import type { UyghurInputController } from '@uyghurcommunity/ui/writing';
import type { InteractionController, InteractionEffect } from '@uyghurcommunity/ui/interactions';
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'small' | 'icon' }
export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;
export interface IconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children' | 'dangerouslySetInnerHTML'> { name: string; size?: number; variant?: 'outline' | 'color'; strokeWidth?: number; label?: string }
export declare const Icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<HTMLSpanElement>>;
export interface DialogProps extends Omit<React.DialogHTMLAttributes<HTMLDialogElement>, 'open'> { open: boolean; onOpenChange?: (open: boolean) => void; dismissOutside?: boolean; initialFocusRef?: React.RefObject<HTMLElement | null> }
export declare const Dialog: React.ForwardRefExoticComponent<DialogProps & React.RefAttributes<HTMLDialogElement>>;
export interface TabItem { id: string; label: React.ReactNode; content: React.ReactNode; disabled?: boolean }
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> { items: readonly TabItem[]; value?: string; defaultValue?: string; onValueChange?: (value: string) => void; label?: string; orientation?: 'horizontal' | 'vertical' }
export declare const Tabs: React.ForwardRefExoticComponent<TabsProps & React.RefAttributes<HTMLDivElement>>;
export interface UyghurInputProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value' | 'defaultValue'> { value?: string; defaultValue?: string; onChange?: (value: string) => void; onReady?: (controller: UyghurInputController | null) => void; label?: React.ReactNode; help?: React.ReactNode; containerClassName?: string }
export declare const UyghurInput: React.ForwardRefExoticComponent<UyghurInputProps & React.RefAttributes<HTMLTextAreaElement>>;
export interface InteractionProps extends React.HTMLAttributes<HTMLDivElement> { effect?: InteractionEffect; paused?: boolean; resetKey?: string | number; onReady?: (controller: InteractionController | null) => void }
export declare const Interaction: React.ForwardRefExoticComponent<InteractionProps & React.RefAttributes<HTMLDivElement>>;
