/** Reveal filtered gallery targets on first visit, hash changes and repeated search links. */
export function bindGalleryLinks(win, doc, reveal) {
  let frame, destroyed = false;
  function changed() { if (!destroyed) { if (frame) win.cancelAnimationFrame(frame); frame = null; reveal(); } }
  function clicked(event) {
    if (destroyed || event.defaultPrevented || event.button > 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
    const anchor = event.target.closest?.('a[href]');
    if (!anchor || anchor.hasAttribute('download') || anchor.target && anchor.target !== '_self') return;
    let target, current;
    try { current = new URL(win.location.href); target = new URL(anchor.href, current); } catch { return; }
    if (target.origin !== current.origin || target.pathname !== current.pathname || target.search !== current.search || target.hash !== current.hash || !/^#(?:icon|component)-[a-z0-9-]+$/.test(target.hash)) return;
    if (frame) win.cancelAnimationFrame(frame);
    // Let the search dialog close and native link navigation finish before returning focus.
    frame = win.requestAnimationFrame(() => { frame = null; if (!destroyed) reveal(); });
  }
  win.addEventListener('hashchange', changed); doc.addEventListener('click', clicked);
  return { destroy() { if (destroyed) return; destroyed = true; if (frame) win.cancelAnimationFrame(frame); win.removeEventListener('hashchange', changed); doc.removeEventListener('click', clicked); } };
}
