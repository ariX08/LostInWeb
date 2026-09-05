/**
 * LostInWeb — Main application logic
 * Pure vanilla JS, localStorage, Web Audio, particles
 */

(function () {
  'use strict';

  // ---------- State ----------
  const state = {
    lostCount: 0,
    history: [],
    muted: false,
    newTab: true,
    deeperMode: false,
    activeCategory: 'all',
    lastIndex: -1,
    audioCtx: null,
  };

  // ---------- DOM ----------
  const $ = (sel) => document.querySelector(sel);
  const getLostBtn = $('#getLostBtn');
  const lostCountEl = $('#lostCount');
  const siteCountEl = $('#siteCount');
  const footerCount = $('#footerCount');
  const loadingOverlay = $('#loadingOverlay');
  const loadingPhrase = $('#loadingPhrase');
  const historyBtn = $('#historyBtn');
  const historyDrawer = $('#historyDrawer');
  const drawerBackdrop = $('#drawerBackdrop');
  const closeHistory = $('#closeHistory');
  const historyList = $('#historyList');
  const muteBtn = $('#muteBtn');
  const settingsBtn = $('#settingsBtn');
  const settingsModal = $('#settingsModal');
  const closeSettings = $('#closeSettings');
  const newTabToggle = $('#newTabToggle');
  const soundToggle = $('#soundToggle');
  const deeperToggle = $('#deeperToggle');
  const deeperHint = $('#deeperHint');
  const deeperBadge = $('#deeperBadge');
  const categoryFilters = $('#categoryFilters');
  const logo = $('#logo');
  const canvas = $('#particles');

  // ---------- Persistence ----------
  function loadState() {
    try {
      const raw = localStorage.getItem('lostinweb');
      if (raw) {
        const saved = JSON.parse(raw);
        state.lostCount = saved.lostCount || 0;
        state.history = saved.history || [];
        state.muted = saved.muted || false;
        state.newTab = saved.newTab !== false;
        state.deeperMode = saved.deeperMode || false;
      }
    } catch (e) {
      console.warn('Could not load state', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem('lostinweb', JSON.stringify({
        lostCount: state.lostCount,
        history: state.history.slice(0, 40),
        muted: state.muted,
        newTab: state.newTab,
        deeperMode: state.deeperMode,
      }));
    } catch (e) {
      console.warn('Could not save state', e);
    }
  }

  // ---------- Audio (subtle whoosh + click) ----------
  function ensureAudio() {
    if (!state.audioCtx) {
      state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
  }

  function playWhoosh() {
    if (state.muted) return;
    ensureAudio();
    const ctx = state.audioCtx;
    const now = ctx.currentTime;

    // soft noise burst
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.35);
    filter.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.4);

    // soft click
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.08, now);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(g2);
    g2.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // ---------- Particles ----------
  function initParticles() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const COUNT = 48;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function create() {
      particles = [];
      for (let i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.6 + 0.4,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          a: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.a})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    create();
    draw();
    window.addEventListener('resize', () => {
      resize();
      create();
    });
  }

  // ---------- Site selection ----------
  function getPool() {
    let pool = state.deeperMode ? [...SITES, ...DEEPER_SITES] : SITES;
    if (state.activeCategory !== 'all') {
      pool = pool.filter((s) => s.cat === state.activeCategory);
    }
    if (pool.length === 0) pool = SITES;
    return pool;
  }

  function pickRandom() {
    const pool = getPool();
    if (pool.length === 1) return pool[0];

    let idx;
    do {
      idx = Math.floor(Math.random() * pool.length);
    } while (idx === state.lastIndex && pool.length > 1);

    state.lastIndex = idx;
    return pool[idx];
  }

  // ---------- Core action ----------
  function getLost() {
    const site = pickRandom();
    playWhoosh();

    // loading
    const phrase = LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)];
    loadingPhrase.textContent = phrase;
    loadingOverlay.classList.add('active');
    loadingOverlay.setAttribute('aria-hidden', 'false');

    // update counter & history
    state.lostCount += 1;
    state.history.unshift({
      ...site,
      ts: Date.now(),
    });
    if (state.history.length > 40) state.history.pop();

    // unlock deeper after 10
    if (state.lostCount >= 10 && !state.deeperMode) {
      deeperToggle.disabled = false;
      deeperHint.textContent = 'Available — enable for weirder gems';
    }

    updateUI();
    saveState();

    // open after short delay for the moment of anticipation
    const delay = 900 + Math.random() * 400;
    setTimeout(() => {
      loadingOverlay.classList.remove('active');
      loadingOverlay.setAttribute('aria-hidden', 'true');

      if (state.newTab) {
        window.open(site.url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = site.url;
      }
    }, delay);
  }

  // ---------- UI updates ----------
  function updateUI() {
    lostCountEl.textContent = state.lostCount;
    siteCountEl.textContent = SITES.length + (state.deeperMode ? DEEPER_SITES.length : 0);
    footerCount.textContent = SITES.length + (state.deeperMode ? ` + ${DEEPER_SITES.length}` : '');

    // mute icon
    muteBtn.classList.toggle('active', state.muted);
    const icon = $('#muteIcon');
    if (icon) {
      if (state.muted) {
        icon.innerHTML = `
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" stroke-width="1.8"/>
          <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" stroke-width="1.8"/>
        `;
      } else {
        icon.innerHTML = `
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
        `;
      }
    }

    // toggles
    newTabToggle.checked = state.newTab;
    soundToggle.checked = !state.muted;
    deeperToggle.checked = state.deeperMode;
    deeperToggle.disabled = state.lostCount < 10;

    if (state.lostCount >= 10) {
      deeperHint.textContent = state.deeperMode
        ? 'Deeper Web is active'
        : 'Available — enable for weirder gems';
    }

    deeperBadge.hidden = !state.deeperMode;

    renderHistory();
  }

  function renderHistory() {
    if (state.history.length === 0) {
      historyList.innerHTML = '<p class="empty-history">No journeys yet. Get lost.</p>';
      return;
    }

    historyList.innerHTML = state.history
      .map(
        (item) => `
      <a class="history-item" href="${item.url}" target="_blank" rel="noopener noreferrer" title="${item.desc || ''}">
        <span class="history-item-title">${escapeHtml(item.title)}</span>
        <span class="history-item-desc">${escapeHtml(item.desc || '')}</span>
        <span class="history-item-meta">${item.cat} · ${timeAgo(item.ts)}</span>
      </a>
    `
      )
      .join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function timeAgo(ts) {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  }

  // ---------- Filters ----------
  function renderFilters() {
    categoryFilters.innerHTML = CATEGORIES.map(
      (c) => `
      <button class="filter-chip ${c === state.activeCategory ? 'active' : ''}" data-cat="${c}" aria-pressed="${c === state.activeCategory}">
        ${c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
      </button>
    `
    ).join('');

    categoryFilters.querySelectorAll('.filter-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.dataset.cat;
        renderFilters();
      });
    });
  }

  // ---------- Event listeners ----------
  function bindEvents() {
    getLostBtn.addEventListener('click', getLost);

    // keyboard
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        getLost();
      }
      if (e.code === 'Escape') {
        closeAll();
      }
    });

    // history
    historyBtn.addEventListener('click', () => {
      historyDrawer.classList.add('open');
      historyDrawer.setAttribute('aria-hidden', 'false');
      drawerBackdrop.classList.add('visible');
    });
    closeHistory.addEventListener('click', closeAll);
    drawerBackdrop.addEventListener('click', closeAll);

    // mute
    muteBtn.addEventListener('click', () => {
      state.muted = !state.muted;
      updateUI();
      saveState();
    });

    // settings
    settingsBtn.addEventListener('click', () => {
      settingsModal.classList.add('open');
      settingsModal.setAttribute('aria-hidden', 'false');
    });
    closeSettings.addEventListener('click', closeAll);
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) closeAll();
    });

    newTabToggle.addEventListener('change', () => {
      state.newTab = newTabToggle.checked;
      saveState();
    });
    soundToggle.addEventListener('change', () => {
      state.muted = !soundToggle.checked;
      updateUI();
      saveState();
    });
    deeperToggle.addEventListener('change', () => {
      if (state.lostCount < 10) return;
      state.deeperMode = deeperToggle.checked;
      updateUI();
      saveState();
    });

    // logo click = mild easter
    logo.addEventListener('click', () => {
      logo.querySelector('.logo-glitch').style.opacity = '0.8';
      setTimeout(() => {
        logo.querySelector('.logo-glitch').style.opacity = '';
      }, 400);
    });
  }

  function closeAll() {
    historyDrawer.classList.remove('open');
    historyDrawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.classList.remove('visible');
    settingsModal.classList.remove('open');
    settingsModal.setAttribute('aria-hidden', 'true');
  }

  // ---------- Init ----------
  function init() {
    loadState();
    renderFilters();
    updateUI();
    bindEvents();
    initParticles();

    // subtle entrance
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.6s ease';
      document.body.style.opacity = '1';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
