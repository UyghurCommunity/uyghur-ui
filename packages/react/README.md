# Uyghur UI React · ئۇيغۇرچە React بۆلەكلىرى

Optional React 18/19 adapters for Uyghur UI v0.4.0. The core remains framework-independent. All imports are safe during server rendering; native controllers bind after mount and are destroyed on unmount, including React Strict Mode remounts.

The package is prepared as a GitHub release archive. npm registry publication remains deferred. Once the v0.4.0 assets are published:

```sh
npm install https://github.com/UyghurCommunity/uyghur-ui/releases/download/v0.4.0/uyghurcommunity-ui-0.4.0.tgz https://github.com/UyghurCommunity/uyghur-ui/releases/download/v0.4.0/uyghurcommunity-ui-react-0.4.0.tgz
```

React, React DOM, and the core UI package are peer dependencies. Install your application's supported React version separately. The command above installs both version-pinned community archives, so npm does not need an unpublished core package from the registry.

```js
import '@uyghurcommunity/ui/styles.css';
import '@uyghurcommunity/ui/interactions.css';
import { Button, Icon, Dialog, Tabs, UyghurInput, Interaction } from '@uyghurcommunity/ui-react';
```

- `Button`: native button props, `variant` (`primary`, `secondary`, `ghost`, `danger`), `size` (`small`, `icon`), and a forwarded button ref. The default type is `button`.
- `Icon`: `name`, `size`, `variant`, `strokeWidth`, and escaped accessible `label`. Empty labels make the fixed SVG decorative. Its ref targets the outer span.
- `Dialog`: controlled `open` and `onOpenChange(boolean)`, optional `initialFocusRef`, `dismissOutside` (default `true`), native dialog props, and a forwarded dialog ref. Backdrop dismissal requires both pointer down and up outside the dialog; inside-to-outside drags do not dismiss. Escape requests a controlled close. Set `open={false}` to accept it. Give dialogs a specific accessible label. A generic Uyghur fallback is supplied.
- `Tabs`: `items: [{ id, label, content, disabled? }]`, controlled `value`/`onValueChange`, or uncontrolled `defaultValue`. Automatic arrow activation, RTL direction, Home/End, and vertical orientation are supported. A ref targets the container.
- `UyghurInput`: full keyboard, safe live preview, explicit Unicode cleanup preview/apply/undo, and localized limits. `onChange(value)` receives a string, including virtual-keyboard and cleanup edits. `onInput(event)` remains available for native events. Use `value` for controlled state or `defaultValue` for initial uncontrolled text. Its ref targets the textarea; `onReady(controller)` exposes the core writing methods and receives `null` on cleanup. `maxLength` defaults to 10,000.
- `Interaction`: `effect` (`spotlight`, `tilt`, `selection`, `send`, `compare`, `ripple`), `paused`, optional `onReady(controller)`, and ordinary div events/attributes. Each effect has a complete default cultural demo; custom `children` must supply the core effect's data selectors. Keep their structure stable or change `resetKey` to rebind. Motion respects reduced-motion preferences, page visibility, viewport visibility, and `paused`. The ref targets the interaction root.

All components use native elements. The writing field uses an uncontrolled DOM textarea internally so IME composition remains intact, while its controller synchronizes the optional controlled `value`. Changes are never silently normalized: cleanup requires an explicit preview and Apply.

The `example/` directory in a **cloned source repository** is a runnable Vite application using every adapter, controlled dialog/tabs/input, the real virtual keyboard and cleanup workflow, and all six interactions. Its local `file:` dependencies intentionally refer to that checkout. After installing dependencies, run `npm run dev` there. No application backend is included; the envelope is a local animation.

For a portable application outside the checkout, [download the React example ZIP](https://uyghurcommunity.github.io/uyghur-ui/downloads/uyghur-ui-react-example.zip). Its manifest uses the pinned v0.4.0 core and React release archive URLs. Extract it, run `npm install`, then `npm run dev`. Those release assets must be published first; no unpublished npm package is required.

The ALKATIP Basma font is externally registered by the core stylesheet. No font binary is bundled. Code: MIT; preserve the core asset notices when copying cultural artwork or maps.
