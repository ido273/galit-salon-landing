/* ==========================================================================
   הסלון של גלית — Accessibility widget (18 tools)
   Vanilla JS, no external service/library. Standard 5568 / WCAG 2.0 AA.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', initA11yWidget);

function initA11yWidget() {
  const toggle = document.getElementById('a11yToggle');
  const panel = document.getElementById('a11yPanel');
  const resetAllBtn = document.getElementById('a11yResetAll');
  const statusEl = document.getElementById('a11yStatus');
  if (!toggle || !panel) return;

  const html = document.documentElement;
  const STORAGE_KEY = 'salon-a11y-widget-v2';

  /* Toggle-type tools that are implemented as a single class on <html> */
  const CSS_CLASS_TOOLS = {
    'cursor-large': 'a11y-cursor-large',
    'cursor-black': 'a11y-cursor-black',
    'kb-nav': 'a11y-kbnav',
    'stop-motion': 'a11y-stop-motion',
    'stop-animations': 'a11y-stop-animations',
    'monochrome': 'a11y-monochrome',
    'sepia': 'a11y-sepia',
    'contrast-high': 'a11y-contrast-high',
    'contrast-by': 'a11y-contrast-by',
    'invert': 'a11y-invert',
    'highlight-headings': 'a11y-highlight-headings',
    'highlight-links': 'a11y-highlight-links',
    'readable-font': 'a11y-readable-font',
  };

  /* Toggle-type tools handled with custom DOM logic (not a simple class) */
  const CUSTOM_TOGGLE_TOOLS = ['alt-hover', 'alt-persistent'];

  const ALL_TOGGLE_TOOLS = Object.keys(CSS_CLASS_TOOLS).concat(CUSTOM_TOGGLE_TOOLS);

  const CONFLICT_GROUPS = [
    ['monochrome', 'sepia', 'contrast-high', 'contrast-by', 'invert'],
    ['alt-hover', 'alt-persistent'],
  ];

  const FONT_MIN = -3;
  const FONT_MAX = 6;
  const ZOOM_MIN = -3;
  const ZOOM_MAX = 5;

  const state = {
    fontStep: 0,
    zoomStep: 0,
  };
  ALL_TOGGLE_TOOLS.forEach((tool) => { state[tool] = false; });

  const toolButtons = Array.from(panel.querySelectorAll('.a11y-tool[data-a11y-tool]'));
  const buttonByTool = {};
  toolButtons.forEach((btn) => { buttonByTool[btn.dataset.a11yTool] = btn; });

  /* ---------- Persistence ---------- */
  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved && typeof saved === 'object') return saved;
    } catch (e) { /* ignore malformed storage */ }
    return {};
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* localStorage unavailable — preferences just won't persist */ }
  }

  /* ---------- Alt-text tooltip (hover/focus) ---------- */
  let tooltipEl = null;
  function getTooltip() {
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.className = 'a11y-alt-tooltip';
      tooltipEl.setAttribute('role', 'tooltip');
      document.body.appendChild(tooltipEl);
    }
    return tooltipEl;
  }

  function altTargets() {
    return Array.from(document.querySelectorAll('main img[alt]:not([alt=""]):not(.hero-bg)'));
  }

  function showTooltipFor(img) {
    const tip = getTooltip();
    tip.textContent = img.getAttribute('alt');
    const rect = img.getBoundingClientRect();
    tip.style.left = Math.max(8, rect.left) + 'px';
    tip.style.top = Math.max(8, rect.top - 8) + 'px';
    tip.classList.add('is-visible');
  }

  function hideTooltip() {
    if (tooltipEl) tooltipEl.classList.remove('is-visible');
  }

  function handleAltHoverEnter(e) { showTooltipFor(e.currentTarget); }
  function handleAltHoverLeave() { hideTooltip(); }

  function setAltHover(isOn) {
    altTargets().forEach((img) => {
      if (isOn) {
        img.addEventListener('mouseenter', handleAltHoverEnter);
        img.addEventListener('mouseleave', handleAltHoverLeave);
        img.addEventListener('focus', handleAltHoverEnter);
        img.addEventListener('blur', handleAltHoverLeave);
      } else {
        img.removeEventListener('mouseenter', handleAltHoverEnter);
        img.removeEventListener('mouseleave', handleAltHoverLeave);
        img.removeEventListener('focus', handleAltHoverEnter);
        img.removeEventListener('blur', handleAltHoverLeave);
      }
    });
    if (!isOn) hideTooltip();
  }

  function setAltPersistent(isOn) {
    altTargets().forEach((img) => {
      const existing = img.nextElementSibling;
      if (isOn) {
        if (existing && existing.classList.contains('a11y-alt-caption')) return;
        const caption = document.createElement('span');
        caption.className = 'a11y-alt-caption';
        caption.textContent = img.getAttribute('alt');
        img.insertAdjacentElement('afterend', caption);
      } else if (existing && existing.classList.contains('a11y-alt-caption')) {
        existing.remove();
      }
    });
  }

  /* ---------- Apply a single tool's effect ---------- */
  function applyTool(tool, isOn) {
    if (CSS_CLASS_TOOLS[tool]) {
      html.classList.toggle(CSS_CLASS_TOOLS[tool], isOn);
      if ((tool === 'stop-motion' || tool === 'stop-animations') && isOn) {
        document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      }
    } else if (tool === 'alt-hover') {
      setAltHover(isOn);
    } else if (tool === 'alt-persistent') {
      setAltPersistent(isOn);
    }

    state[tool] = isOn;
    const btn = buttonByTool[tool];
    if (btn) btn.setAttribute('aria-pressed', String(isOn));
  }

  function setTool(tool, isOn) {
    if (isOn) {
      const group = CONFLICT_GROUPS.find((g) => g.includes(tool));
      if (group) {
        group.forEach((other) => {
          if (other !== tool && state[other]) applyTool(other, false);
        });
      }
    }
    applyTool(tool, isOn);
    saveState();
  }

  /* ---------- Font size / zoom (stepped, not simple toggles) ---------- */
  function applyFontStep() {
    html.style.fontSize = (100 + state.fontStep * 10) + '%';
    announce('גודל טקסט: ' + (100 + state.fontStep * 10) + '%');
  }

  function applyZoomStep() {
    html.style.zoom = (100 + state.zoomStep * 10) + '%';
    announce('הגדלת תצוגה: ' + (100 + state.zoomStep * 10) + '%');
  }

  function announce(text) {
    if (statusEl) statusEl.textContent = text;
  }

  function stepFont(delta) {
    state.fontStep = Math.max(FONT_MIN, Math.min(FONT_MAX, state.fontStep + delta));
    applyFontStep();
    saveState();
  }

  function stepZoom(delta) {
    state.zoomStep = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, state.zoomStep + delta));
    applyZoomStep();
    saveState();
  }

  /* ---------- Reset ---------- */
  function resetAll() {
    ALL_TOGGLE_TOOLS.forEach((tool) => {
      if (state[tool]) applyTool(tool, false);
    });
    state.fontStep = 0;
    state.zoomStep = 0;
    html.style.fontSize = '';
    html.style.zoom = '';
    announce('כל הגדרות הנגישות אופסו');
    saveState();
  }

  /* ---------- Restore saved preferences on load ---------- */
  (function restore() {
    const saved = loadState();
    ALL_TOGGLE_TOOLS.forEach((tool) => {
      if (saved[tool]) applyTool(tool, true);
    });
    if (typeof saved.fontStep === 'number') {
      state.fontStep = Math.max(FONT_MIN, Math.min(FONT_MAX, saved.fontStep));
      if (state.fontStep !== 0) html.style.fontSize = (100 + state.fontStep * 10) + '%';
    }
    if (typeof saved.zoomStep === 'number') {
      state.zoomStep = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, saved.zoomStep));
      if (state.zoomStep !== 0) html.style.zoom = (100 + state.zoomStep * 10) + '%';
    }
  }());

  /* ---------- Panel open/close + keyboard behavior ---------- */
  function openPanel() {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', handleOutsideClick);
  }

  function closePanel() {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('click', handleOutsideClick);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      resetAll();
      closePanel();
      toggle.focus();
    }
  }

  function handleOutsideClick(e) {
    if (!panel.contains(e.target) && !toggle.contains(e.target)) {
      closePanel();
    }
  }

  toggle.addEventListener('click', () => {
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  });

  const widget = toggle.closest('.a11y-widget');
  widget.addEventListener('focusout', () => {
    setTimeout(() => {
      if (!panel.hidden && !widget.contains(document.activeElement)) {
        closePanel();
      }
    }, 0);
  });

  /* ---------- Wire up tool buttons ---------- */
  toolButtons.forEach((btn) => {
    const tool = btn.dataset.a11yTool;

    if (tool === 'font-inc') {
      btn.addEventListener('click', () => stepFont(1));
    } else if (tool === 'font-dec') {
      btn.addEventListener('click', () => stepFont(-1));
    } else if (tool === 'zoom-in') {
      btn.addEventListener('click', () => stepZoom(1));
    } else if (tool === 'zoom-out') {
      btn.addEventListener('click', () => stepZoom(-1));
    } else {
      btn.addEventListener('click', () => {
        setTool(tool, btn.getAttribute('aria-pressed') !== 'true');
      });
    }
  });

  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', () => {
      resetAll();
      toggle.focus();
    });
  }
}
