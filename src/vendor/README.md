# Vendored UyghurCommunity modules

These MIT-licensed files are exact, unmodified copies of the sibling projects used by the writing controller. Local imports keep the UI package free of runtime package dependencies. Font URLs remain external; no font binaries are included.

| Project/version | Upstream file | Local file | SHA-256 |
| --- | --- | --- | --- |
| `uyghur-keyboard@0.1.1` | [src/index.js](https://github.com/UyghurCommunity/uyghur-keyboard/blob/v0.1.1/src/index.js) | `keyboard/index.js` | `775549e55727aaad3803a470eec67261ddf6c18b685d0959b134111a0fdb749c` |
| `uyghur-keyboard@0.1.1` | [src/style.js](https://github.com/UyghurCommunity/uyghur-keyboard/blob/v0.1.1/src/style.js) | `keyboard/style.js` | `c2e67c42c7506bb41b68070010c09b1d2d8744407cfb6603a161822dfb5556a4` |
| `uyghur-keyboard@0.1.1` | [LICENSE](https://github.com/UyghurCommunity/uyghur-keyboard/blob/v0.1.1/LICENSE) | `keyboard/LICENSE` | `20f65d63d0ebb714cf4ebe5fd0d541d8f25eff5662dba5bbca2fc2c3fa4cbcde` |
| `uyghur-text@0.1.0` | [src/index.js](https://github.com/UyghurCommunity/uyghur-text/blob/v0.1.0/src/index.js) | `text/index.js` | `b878905644a6d1bbbbca746e8bd5fc806dce9c3175ef554101bc56c6053df81c` |
| `uyghur-text@0.1.0` | [LICENSE](https://github.com/UyghurCommunity/uyghur-text/blob/v0.1.0/LICENSE) | `text/LICENSE` | `20f65d63d0ebb714cf4ebe5fd0d541d8f25eff5662dba5bbca2fc2c3fa4cbcde` |

Source versions: `@uyghurcommunity/keyboard` 0.1.1 and `@uyghurcommunity/text` 0.1.0. Copied on 2026-11-07. Each project’s complete MIT notice is preserved in its local `LICENSE`.

The keyboard supplies the actual alphabet layout, selection-aware editing, cancelable beforeinput events and composition handling. The text module supplies explicit cleanup previews and diffs. UI-specific limits, confirmation, preview, undo and lifecycle behavior live in `../writing.js`.

To update a vendor copy, review the upstream change, copy its corresponding license, record the new version and exact file hash here, and rerun the writing tests.
