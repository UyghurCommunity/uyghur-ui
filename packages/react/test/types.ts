import * as React from 'react';
import { Button, Dialog, Icon, Tabs, UyghurInput, Interaction, type TabItem } from '@uyghurcommunity/ui-react';
const button = React.createRef<HTMLButtonElement>();
const textarea = React.createRef<HTMLTextAreaElement>();
const items: readonly TabItem[] = [{ id: 'a', label: 'ئۇيغۇرچە', content: React.createElement('p', null, 'سالام') }];
React.createElement(Button, { ref: button, variant: 'secondary', type: 'submit', onClick(event) { event.currentTarget.focus(); } }, 'باشلاڭ');
React.createElement(Icon, { name: 'dutar', variant: 'color', label: 'دۇتار' });
React.createElement(Dialog, { open: true, dismissOutside: true, onOpenChange(open) { const accepted: boolean = open; void accepted; } }, 'مەزمۇن');
React.createElement(Tabs, { items, value: 'a', onValueChange(value) { value.toUpperCase(); } });
React.createElement(UyghurInput, { ref: textarea, value: 'سالام', onChange(value) { value.toUpperCase(); }, onInput(event) { event.currentTarget.selectionStart; }, onReady(controller) { controller?.previewCleanup({ normalization: 'NFC' }); } });
React.createElement(Interaction, { effect: 'ripple', paused: false, onReady(controller) { controller?.reset(); } });
// @ts-expect-error A controlled dialog needs an explicit open prop.
React.createElement(Dialog, {});
// @ts-expect-error Writing onChange receives the string, not a synthetic event.
React.createElement(UyghurInput, { onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => event.currentTarget.value });
// @ts-expect-error An unsupported effect is rejected by the public union.
React.createElement(Interaction, { effect: 'untrusted' });
