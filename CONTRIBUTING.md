# Contributing · تۆھپە قوشۇش

كود، ئۇيغۇرچە/ئىنگلىزچە تەرجىمە، مەدەنىيەت ئاتىلىشى ۋە قولاي ئىشلىتىش سىنىقى بىلەن تۆھپە قوشالايسىز. مەسىلىنى قايتا سىناش قەدەملىرى ۋە ئۆزگەرتىش سەۋەبىنى ئېنىق يېزىڭ؛ مەنبە ۋە ئىجازەتنامە خاتىرىسىنى ساقلاڭ.

Start with a small reproducible problem or a concrete use case. Use the repository's bug, component or translation issue form when discussion is useful; a focused correction can be submitted directly as a pull request. No account secrets or private user data should be included.

## Local workflow

```sh
python3 -m http.server 4173 --bind 127.0.0.1
npm run check
npm test
npm run build:map
npm run build:icons
npm run build:docs
```

Use Node.js 20+. Review generated changes in `guide/`, root pages, `assets/` and `downloads/`. Core is framework-independent; React wrappers live in their separate package. Install or test wrapper dependencies inside that package according to its README.

## Reviewable changes

Explain the trigger, expected behavior and resulting change. Add a regression test for meaningful state, lifecycle or validation behavior. For visible changes, check narrow screens, RTL and LTR, real Uyghur labels, keyboard focus and reduced motion. Avoid splitting joined Uyghur letters into decorative spans. Keep ALKATIP Basma and the documented fallback stack.

The source of documentation is `docs/guide-content.js` and `docs/guide-content-en.js`; regenerate both languages. Language links must retain the same guide slug. Navigation and search metadata are generated: update their sources rather than patching only emitted HTML. Keep prior release facts intact when adding a changelog entry.

New components need an explicit semantic purpose, labeled controls, keyboard behavior, teardown and a working example. Include source and permission information for cultural artwork. Do not copy reference images into the package unless their redistribution rights are documented. Geographic assets must retain their documented dataset basis, orientation and provenance.

## Pull requests

Keep scope focused and describe tests actually run. Mention any compatibility changes. Preserve existing license and third-party notices; new original contributions are submitted under this repository's MIT license, while separately licensed geographic/font assets retain their own terms. Follow [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

Publishing packages, tags and deployments is handled by maintainers. npm registry publishing is currently deferred; public GitHub release archives are the supported installation route. A contribution does not need to publish a package or contact other users.
