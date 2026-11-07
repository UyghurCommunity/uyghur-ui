/** Original, website-only interaction controllers. Each function can be copied on its own. */
function spotlight(root, { motionAllowed = () => !root.ownerDocument.defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches } = {}) {
  const surface = root.querySelector('[data-surface]');
  const button = root.querySelector('button[data-action="spotlight"]');
  if (!surface || !button) throw new TypeError('Spotlight needs a surface and a button.');
  const status = root.querySelector('[data-demo-status]'), originalStatus = status?.textContent ?? '';
  const positions = [[20, 30], [80, 30], [70, 75], [30, 70]];
  let destroyed = false, step = -1;
  function center() { surface.style.setProperty('--pointer-x', '50%'); surface.style.setProperty('--pointer-y', '50%'); }
  function point(x, y) {
    if (destroyed) return;
    if (!motionAllowed()) { center(); return; }
    surface.style.setProperty('--pointer-x', `${Math.round(Math.max(0, Math.min(100, x)) * 100) / 100}%`);
    surface.style.setProperty('--pointer-y', `${Math.round(Math.max(0, Math.min(100, y)) * 100) / 100}%`);
  }
  function moved(event) {
    if (destroyed || event.pointerType === 'touch') return;
    const rect = surface.getBoundingClientRect();
    if (!rect.width || !rect.height || !Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) { center(); return; }
    point((event.clientX - rect.left) / rect.width * 100, (event.clientY - rect.top) / rect.height * 100);
  }
  function left() { if (!destroyed) center(); }
  function clicked() {
    if (destroyed) return;
    step = (step + 1) % positions.length; point(...positions[step]);
    if (status) status.textContent = motionAllowed() ? `يورۇقلۇق ئورنى ئۆزگەردى · ${step + 1}` : 'ھەرىكەت ئازايتىلدى؛ يورۇقلۇق مەركەزدە.';
  }
  function reset() { if (destroyed) return; step = -1; center(); if (status) status.textContent = originalStatus; }
  function syncMotion() { if (!destroyed) center(); }
  surface.addEventListener('pointermove', moved); surface.addEventListener('pointerleave', left); button.addEventListener('click', clicked);
  center();
  return { syncMotion, reset, destroy() { if (destroyed) return; reset(); destroyed = true; surface.removeEventListener('pointermove', moved); surface.removeEventListener('pointerleave', left); button.removeEventListener('click', clicked); } };
}

function tilt(root, { motionAllowed = () => !root.ownerDocument.defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches } = {}) {
  const card = root.querySelector('[data-tilt-card]'), button = root.querySelector('button[data-action="tilt"]');
  if (!card || !button) throw new TypeError('Tilt needs a card and a button.');
  const depth = root.querySelector('input[data-setting="depth"]');
  const status = root.querySelector('[data-demo-status]'), originalStatus = status?.textContent ?? '';
  const initialDepth = Math.max(8, Math.min(20, Number.isFinite(Number(depth?.value)) ? Number(depth.value) : 12));
  let destroyed = false, x = 0, y = 0, posed = false, pointer = null;
  const bounded = (value) => Math.round(Math.max(-12, Math.min(12, value)) * 100) / 100;
  function sensitivity() {
    const value = Number(depth?.value), result = Math.max(8, Math.min(20, Number.isFinite(value) ? value : initialDepth));
    if (depth) depth.value = String(result);
    return result;
  }
  function pose(nextX, nextY) {
    if (destroyed) return;
    const allowed = motionAllowed(); x = allowed ? bounded(nextX) : 0; y = allowed ? bounded(nextY) : 0;
    card.style.setProperty('--tilt-x', `${x}deg`); card.style.setProperty('--tilt-y', `${y}deg`);
  }
  function neutral() { if (!destroyed) { pointer = null; posed = false; pose(0, 0); } }
  function moved(event) {
    if (destroyed || event.pointerType === 'touch') return;
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height || !Number.isFinite(event.clientX) || !Number.isFinite(event.clientY)) { neutral(); return; }
    pointer = [Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))];
    const amount = sensitivity(); pose((.5 - pointer[1]) * amount * 2, (pointer[0] - .5) * amount * 2);
  }
  function keyed(event) {
    if (destroyed || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault(); pointer = null;
    pose(x + (event.key === 'ArrowUp' ? 2 : event.key === 'ArrowDown' ? -2 : 0), y + (event.key === 'ArrowRight' ? 2 : event.key === 'ArrowLeft' ? -2 : 0));
    if (status) status.textContent = motionAllowed() ? 'كارتىنىڭ يانتۇ ھالىتى ئۆزگەردى.' : 'ھەرىكەت ئازايتىلدى؛ كارتا تۈز ھالەتتە.';
  }
  function clicked() {
    if (destroyed) return;
    pointer = null; posed = !posed; const amount = sensitivity(); pose(posed ? -Math.min(8, amount) : 0, posed ? Math.min(10, amount) : 0);
    if (status) status.textContent = motionAllowed() ? (posed ? 'كارتا يانتۇ ھالەتتە.' : 'كارتا تۈز ھالەتتە.') : 'ھەرىكەت ئازايتىلدى؛ كارتا تۈز ھالەتتە.';
  }
  function depthChanged() {
    if (destroyed) return;
    const amount = sensitivity();
    if (pointer) pose((.5 - pointer[1]) * amount * 2, (pointer[0] - .5) * amount * 2);
    if (status) status.textContent = `چوڭقۇرلۇق: ${amount}`;
  }
  function reset() { if (destroyed) return; if (depth) depth.value = String(initialDepth); neutral(); if (status) status.textContent = originalStatus; }
  function syncMotion() { neutral(); }
  card.addEventListener('pointermove', moved); card.addEventListener('pointerleave', neutral); card.addEventListener('blur', neutral); card.addEventListener('keydown', keyed); button.addEventListener('click', clicked);
  if (button !== card) { button.addEventListener('blur', neutral); card.addEventListener('click', clicked); }
  depth?.addEventListener('input', depthChanged); reset();
  return { syncMotion, reset, destroy() { if (destroyed) return; reset(); destroyed = true; card.removeEventListener('pointermove', moved); card.removeEventListener('pointerleave', neutral); card.removeEventListener('blur', neutral); card.removeEventListener('keydown', keyed); button.removeEventListener('click', clicked); if (button !== card) { button.removeEventListener('blur', neutral); card.removeEventListener('click', clicked); } depth?.removeEventListener('input', depthChanged); } };
}

function selection(root, { motionAllowed = () => !root.ownerDocument.defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches } = {}) {
  const win = root.ownerDocument.defaultView, track = root.querySelector('[data-choice-track]');
  const choices = track ? [...track.querySelectorAll('button[data-choice]')] : [], indicator = root.querySelector('[data-selection-indicator]');
  if (!track || !choices.length || !indicator) throw new TypeError('Selection needs a track, choices and an indicator.');
  const status = root.querySelector('[data-demo-status]'), initial = Math.min(1, choices.length - 1);
  const transition = indicator.style.transition;
  let destroyed = false, active = initial, observer;
  function position() {
    if (destroyed) return;
    const bounds = track.getBoundingClientRect(), rect = choices[active].getBoundingClientRect();
    const left = rect.left - bounds.left - (track.clientLeft || 0) + (track.scrollLeft || 0);
    indicator.style.left = `${Number.isFinite(left) ? left : 0}px`;
    indicator.style.width = `${Number.isFinite(rect.width) ? Math.max(0, rect.width) : 0}px`;
  }
  function syncMotion() { if (destroyed) return; indicator.style.transition = motionAllowed() ? transition : 'none'; position(); }
  function choose(index, focus = false) {
    if (destroyed) return;
    active = (index + choices.length) % choices.length;
    choices.forEach((choice, i) => choice.setAttribute('aria-pressed', String(i === active)));
    syncMotion(); if (status) status.textContent = `تاللاندى: ${choices[active].textContent.trim()}`;
    if (focus) choices[active].focus();
  }
  const listeners = choices.map((choice, index) => {
    const click = () => choose(index);
    const keydown = (event) => {
      if (destroyed || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const direction = win.getComputedStyle?.(track)?.direction || track.dir || root.dir || root.ownerDocument.documentElement.dir;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? choices.length - 1 : index + (event.key === 'ArrowRight' ? 1 : -1) * (direction === 'rtl' ? -1 : 1);
      choose(next, true);
    };
    choice.addEventListener('click', click); choice.addEventListener('keydown', keydown);
    return { choice, click, keydown };
  });
  if (typeof win.ResizeObserver === 'function') { observer = new win.ResizeObserver(position); observer.observe(track); choices.forEach((choice) => observer.observe(choice)); }
  else win.addEventListener('resize', position);
  function reset() { choose(initial); }
  reset();
  return { syncMotion, reset, destroy() { if (destroyed) return; destroyed = true; observer?.disconnect(); if (!observer) win.removeEventListener('resize', position); listeners.forEach(({ choice, click, keydown }) => { choice.removeEventListener('click', click); choice.removeEventListener('keydown', keydown); }); indicator.style.transition = transition; } };
}

function send(root, { motionAllowed = () => !root.ownerDocument.defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches } = {}) {
  const win = root.ownerDocument.defaultView, button = root.querySelector('button[data-action="send"]'), resetButton = root.querySelector('button[data-action="reset"]');
  if (!button || !resetButton) throw new TypeError('Send needs send and reset buttons.');
  const status = root.querySelector('[data-demo-status]'), originalStatus = status?.textContent ?? '', originalDisabled = button.disabled;
  let destroyed = false, timer = null;
  function cancel() { if (timer !== null) { win.clearTimeout(timer); timer = null; } }
  function finish() { if (destroyed) return; cancel(); root.dataset.phase = 'sent'; button.disabled = true; if (status) status.textContent = 'مىسال تاماملاندى. تورغا ھېچقانداق ئۇچۇر ئەۋەتىلمىدى.'; }
  function clicked() {
    if (destroyed || button.disabled || root.dataset.phase !== 'ready') return;
    root.dataset.phase = 'sending'; button.disabled = true;
    if (status) status.textContent = 'يەرلىك ھەرىكەت كۆرسىتىلىۋاتىدۇ…';
    if (!motionAllowed()) finish(); else timer = win.setTimeout(finish, 900);
  }
  function reset() { if (destroyed) return; cancel(); root.dataset.phase = 'ready'; button.disabled = originalDisabled; if (status) status.textContent = originalStatus; }
  function syncMotion() { if (!destroyed && root.dataset.phase === 'sending' && !motionAllowed()) finish(); }
  button.addEventListener('click', clicked); resetButton.addEventListener('click', reset); reset();
  return { syncMotion, reset, destroy() { if (destroyed) return; reset(); destroyed = true; button.removeEventListener('click', clicked); resetButton.removeEventListener('click', reset); } };
}

function compare(root, { motionAllowed = () => !root.ownerDocument.defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches } = {}) {
  const input = root.querySelector('input[data-setting="compare"]');
  if (!input) throw new TypeError('Compare needs a native range input.');
  const status = root.querySelector('[data-demo-status]');
  const bounded = (value) => Math.round(Math.max(0, Math.min(100, Number.isFinite(Number(value)) ? Number(value) : 50)) * 100) / 100;
  const initial = bounded(input.value);
  let destroyed = false;
  function update() { if (destroyed) return; const value = bounded(input.value); input.value = String(value); root.style.setProperty('--split', `${value}%`); if (status) status.textContent = `سېلىشتۇرۇش: ${value}٪`; }
  function reset() { if (destroyed) return; input.value = String(initial); update(); }
  function syncMotion() { if (!destroyed) update(); }
  input.addEventListener('input', update); reset();
  return { syncMotion, reset, destroy() { if (destroyed) return; destroyed = true; input.removeEventListener('input', update); } };
}

function ripple(root, { motionAllowed = () => !root.ownerDocument.defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches } = {}) {
  const win = root.ownerDocument.defaultView, button = root.querySelector('button[data-action="ripple"]');
  if (!button) throw new TypeError('Ripple needs a button.');
  const status = root.querySelector('[data-demo-status]'), originalStatus = status?.textContent ?? '';
  let destroyed = false, timer = null, pulse = 'b', count = 0;
  function clear() { if (timer !== null) { win.clearTimeout(timer); timer = null; } root.dataset.phase = 'ready'; }
  function clicked() {
    if (destroyed) return;
    clear(); count++;
    pulse = pulse === 'a' ? 'b' : 'a'; root.dataset.pulse = pulse;
    if (!motionAllowed()) { if (status) status.textContent = `ھەرىكەت ئازايتىلدى؛ كۇنۇپكا ئىشلىدى · ${count}`; return; }
    root.dataset.phase = 'active';
    if (status) status.textContent = `تەسىر قوزغىتىلدى · ${count}`;
    timer = win.setTimeout(() => { if (!destroyed) clear(); }, 1400);
  }
  function reset() { if (destroyed) return; clear(); delete root.dataset.pulse; pulse = 'b'; count = 0; if (status) status.textContent = originalStatus; }
  function syncMotion() { if (!destroyed) clear(); }
  button.addEventListener('click', clicked); reset();
  return { syncMotion, reset, destroy() { if (destroyed) return; reset(); destroyed = true; button.removeEventListener('click', clicked); } };
}

export const interactionBindings = Object.freeze({ spotlight, tilt, selection, send, compare, ripple });
