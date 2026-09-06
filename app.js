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
    musicStarted: false,
    musicNodes: null, // { osc1, osc2, noise, gain, lfo, filter }
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

  // ---------- Audio system ----------
  function ensureAudio() {
    if (!state.audioCtx) {
      state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
    return state.audioCtx;
  }

  // Soft ambient cyber drone (background music)
  function startBackgroundMusic() {
    if (state.musicStarted || state.muted) return;
    const ctx = ensureAudio();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Main drone oscillators (slightly detuned for thickness)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = 55; // A1

    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 55.3;

    const osc3 = ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.value = 110; // octave

    // Slow LFO for movement
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 8;
    lfo.connect(lfoGain);
    lfoGain.connect(osc1.frequency);
    lfoGain.connect(osc2.frequency);

    // Soft noise bed
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.value = 400;
    noiseFilter.Q.value = 0.5;

    // Master music gain (very quiet)
    const musicGain = ctx.createGain();
    musicGain.gain.value = 0.035;

    // Gentle high shelf to keep it dark
    const shelf = ctx.createBiquadFilter();
    shelf.type = 'lowshelf';
    shelf.frequency.value = 200;
    shelf.gain.value = 4;

    osc1.connect(shelf);
    osc2.connect(shelf);
    osc3.connect(shelf);
    noise.connect(noiseFilter);
    noiseFilter.connect(shelf);
    shelf.connect(musicGain);
    musicGain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    noise.start(now);
    lfo.start(now);

    state.musicNodes = { osc1, osc2, osc3, noise, lfo, musicGain, lfoGain };
    state.musicStarted = true;
  }

  function stopBackgroundMusic() {
    if (!state.musicNodes) return;
    const { osc1, osc2, osc3, noise, lfo, musicGain } = state.musicNodes;
    const ctx = state.audioCtx;
    const now = ctx.currentTime;
    musicGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
    setTimeout(() => {
      try {
        osc1.stop();
        osc2.stop();
        osc3.stop();
        noise.stop();
        lfo.stop();
      } catch (_) {}
      state.musicNodes = null;
      state.musicStarted = false;
    }, 900);
  }

  function setMusicMuted(muted) {
    if (!state.musicNodes) return;
    const now = state.audioCtx.currentTime;
    state.musicNodes.musicGain.gain.exponentialRampToValueAtTime(
      muted ? 0.0001 : 0.035,
      now + 0.4
    );
  }

  // Generic short sound helpers
  function playTone({ freq = 440, type = 'sine', duration = 0.12, volume = 0.08, slideTo = null }) {
    if (state.muted) return;
    const ctx = ensureAudio();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration * 0.9);
    }
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  function playNoiseBurst({ duration = 0.25, volume = 0.1, filterFreq = 800, filterType = 'bandpass' }) {
    if (state.muted) return;
    const ctx = ensureAudio();
    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(filterFreq, now);
    filter.frequency.exponentialRampToValueAtTime(filterFreq * 0.3, now + duration);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(now);
    src.stop(now + duration + 0.05);
  }

  // Specific SFX
  function playWhoosh() {
    playNoiseBurst({ duration: 0.38, volume: 0.11, filterFreq: 900 });
    playTone({ freq: 380, type: 'sine', duration: 0.12, volume: 0.07, slideTo: 160 });
  }

  function playClick() {
    playTone({ freq: 720, type: 'triangle', duration: 0.06, volume: 0.06, slideTo: 420 });
  }

  function playSoftHover() {
    playTone({ freq: 880, type: 'sine', duration: 0.05, volume: 0.025 });
  }

  function playToggle() {
    playTone({ freq: 520, type: 'square', duration: 0.07, volume: 0.04, slideTo: 340 });
  }

  function playDrawer() {
    playNoiseBurst({ duration: 0.22, volume: 0.07, filterFreq: 350, filterType: 'lowpass' });
    playTone({ freq: 220, type: 'sine', duration: 0.18, volume: 0.05, slideTo: 140 });
  }

  function playFilterChip() {
    playTone({ freq: 640 + Math.random() * 120, type: 'triangle', duration: 0.08, volume: 0.045 });
  }

  // Digital glitch for the logo
  function playGlitch() {
    if (state.muted) return;
    const ctx = ensureAudio();
    const now = ctx.currentTime;

    // Rapid random pitch blips
    for (let i = 0; i < 6; i++) {
      const t = now + i * 0.035;
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'square' : 'sawtooth';
      const f = 200 + Math.random() * 1800;
      osc.frequency.setValueAtTime(f, t);
      osc.frequency.exponentialRampToValueAtTime(f * (0.4 + Math.random() * 0.8), t + 0.04);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.06, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    }

    // Harsh noise burst
    playNoiseBurst({ duration: 0.18, volume: 0.09, filterFreq: 2400, filterType: 'highpass' });
  }

  // First user gesture unlocks audio + starts music
  function unlockAudio() {
    ensureAudio();
    if (!state.musicStarted && !state.muted) {
      startBackgroundMusic();
    }
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
        playFilterChip();
        state.activeCategory = btn.dataset.cat;
        renderFilters();
      });
      btn.addEventListener('mouseenter', () => playSoftHover());
    });
  }

  // ---------- Event listeners ----------
  function bindEvents() {
    // Unlock audio on any first interaction
    const unlockOnce = () => {
      unlockAudio();
      document.removeEventListener('pointerdown', unlockOnce);
      document.removeEventListener('keydown', unlockOnce);
    };
    document.addEventListener('pointerdown', unlockOnce, { once: true });
    document.addEventListener('keydown', unlockOnce, { once: true });

    getLostBtn.addEventListener('click', () => {
      unlockAudio();
      getLost();
    });
    getLostBtn.addEventListener('mouseenter', () => playSoftHover());

    // keyboard
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        unlockAudio();
        getLost();
      }
      if (e.code === 'Escape') {
        closeAll();
        playClick();
      }
    });

    // history
    historyBtn.addEventListener('click', () => {
      unlockAudio();
      playDrawer();
      historyDrawer.classList.add('open');
      historyDrawer.setAttribute('aria-hidden', 'false');
      drawerBackdrop.classList.add('visible');
    });
    historyBtn.addEventListener('mouseenter', () => playSoftHover());

    closeHistory.addEventListener('click', () => {
      playClick();
      closeAll();
    });
    drawerBackdrop.addEventListener('click', () => {
      playClick();
      closeAll();
    });

    // mute
    muteBtn.addEventListener('click', () => {
      unlockAudio();
      state.muted = !state.muted;
      setMusicMuted(state.muted);
      if (!state.muted && !state.musicStarted) {
        startBackgroundMusic();
      }
      playClick();
      updateUI();
      saveState();
    });
    muteBtn.addEventListener('mouseenter', () => playSoftHover());

    // settings
    settingsBtn.addEventListener('click', () => {
      unlockAudio();
      playClick();
      settingsModal.classList.add('open');
      settingsModal.setAttribute('aria-hidden', 'false');
    });
    settingsBtn.addEventListener('mouseenter', () => playSoftHover());

    closeSettings.addEventListener('click', () => {
      playClick();
      closeAll();
    });
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        playClick();
        closeAll();
      }
    });

    newTabToggle.addEventListener('change', () => {
      playToggle();
      state.newTab = newTabToggle.checked;
      saveState();
    });
    soundToggle.addEventListener('change', () => {
      state.muted = !soundToggle.checked;
      setMusicMuted(state.muted);
      if (!state.muted && !state.musicStarted) {
        startBackgroundMusic();
      }
      playToggle();
      updateUI();
      saveState();
    });
    deeperToggle.addEventListener('change', () => {
      if (state.lostCount < 10) return;
      playToggle();
      state.deeperMode = deeperToggle.checked;
      updateUI();
      saveState();
    });

    // Logo — glitch sound + visual
    logo.addEventListener('click', () => {
      unlockAudio();
      playGlitch();
      const glitchEl = logo.querySelector('.logo-glitch');
      if (glitchEl) {
        glitchEl.style.opacity = '0.85';
        logo.classList.add('glitching');
        setTimeout(() => {
          glitchEl.style.opacity = '';
          logo.classList.remove('glitching');
        }, 450);
      }
    });
    logo.addEventListener('mouseenter', () => {
      playSoftHover();
    });

    // Filter chips get sound after they are rendered
    // (handled inside renderFilters)
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
