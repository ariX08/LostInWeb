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

    // Open immediately when new-tab is on (avoids popup blockers from delayed calls)
    if (state.newTab) {
      const win = window.open(site.url, '_blank', 'noopener,noreferrer');
      // brief loading feedback even for new tab
      setTimeout(() => {
        loadingOverlay.classList.remove('active');
        loadingOverlay.setAttribute('aria-hidden', 'true');
      }, 700);
      if (!win) {
        // fallback if blocked
        loadingOverlay.classList.remove('active');
        window.location.href = site.url;
      }
    } else {
      const delay = 900 + Math.random() * 300;
      setTimeout(() => {
        loadingOverlay.classList.remove('active');
        loadingOverlay.setAttribute('aria-hidden', 'true');
        window.location.href = site.url;
      }, delay);
    }
  }

  // ---------- UI updates ----------
  function updateUI() {
    lostCountEl.textContent = state.lostCount;
    siteCountEl.textContent = SITES.length + (state.deeperMode ? DEEPER_SITES.length : 0);
    footerCount.textContent = SITES.length + (state.deeperMode ? ` + ${DEEPER_SITES.length}` : '');

    // mute icon
    muteBtn.classList.toggle('active', state.muted);
    const icon = $('#muteIcon');
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
      unlockAudio();
      playGlitch();
      const glitchEl = logo.querySelector('.logo-glitch');
      if (glitchEl) {
        glitchEl.style.opacity = '0.7';
        logo.classList.add('glitching');
        setTimeout(() => {
          glitchEl.style.opacity = '';
          logo.classList.remove('glitching');
        }, 350);
      }
    });

    // Filter chips get sound after they are rendered
    // (handled inside renderFilters)

    // Legal modals
    const legalContent = {
      security: {
        title: 'Security',
        body: `<h3>How we protect you</h3>
          <p>LostInWeb is a static frontend application. No user accounts, no server-side storage of personal data, and no tracking pixels.</p>
          <p>All preferences (history, counter, settings) are stored only in your browser’s localStorage and never leave your device.</p>
          <p>External sites opened by “Get Lost” are third-party. We recommend using a modern browser with up-to-date security features and considering a content blocker for extra protection.</p>
          <h3>Reporting issues</h3>
          <p>If you discover a security concern, please contact the creator via the MADE BY ARITRA.DESIGN link in the footer.</p>`
      },
      privacy: {
        title: 'Privacy Policy',
        body: `<h3>What we collect</h3>
          <p>LostInWeb does not collect, transmit, or sell personal data. There are no analytics, no cookies for tracking, and no third-party advertising scripts.</p>
          <h3>Local storage</h3>
          <p>We store only the following on your device: visit counter, recent history of sites you chose to open, and UI preferences (mute, new-tab toggle, deeper mode). You can clear this at any time by clearing site data in your browser.</p>
          <h3>Third-party sites</h3>
          <p>When you click “Get Lost”, you leave LostInWeb and enter a different website governed by that site’s own privacy policy.</p>
          <p>Last updated: September 2026</p>`
      },
      terms: {
        title: 'Terms & Conditions',
        body: `<h3>Use of the service</h3>
          <p>LostInWeb is provided free of charge for personal, non-commercial curiosity and discovery. You may use it as long as you do not attempt to disrupt the experience for others or scrape the curated list at scale for commercial purposes.</p>
          <h3>Disclaimer</h3>
          <p>The curated links are selected for interest and availability at the time of compilation. We do not control third-party websites and are not responsible for their content, availability, or any harm that may result from visiting them. Use at your own risk.</p>
          <h3>Intellectual property</h3>
          <p>The LostInWeb interface, design, and original code are © 2026 Aritra / ARITRA.DESIGN. The linked third-party sites remain the property of their respective owners.</p>
          <p>Last updated: September 2026</p>`
      },
      cookies: {
        title: 'Cookies',
        body: `<h3>Do we use cookies?</h3>
          <p>LostInWeb itself does not set any cookies. Preferences and history are stored exclusively in localStorage.</p>
          <h3>Third-party cookies</h3>
          <p>When you open an external website via “Get Lost”, that site may set its own cookies according to its own policies. We have no control over those.</p>
          <p>You can manage or block cookies through your browser settings at any time.</p>
          <p>Last updated: September 2026</p>`
      }
    };

    const legalModal = $('#legalModal');
    const legalTitle = $('#legalTitle');
    const legalBody = $('#legalBody');
    const closeLegal = $('#closeLegal');

    document.querySelectorAll('[data-modal]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const key = link.dataset.modal;
        if (!legalContent[key]) return;
        playClick();
        legalTitle.textContent = legalContent[key].title;
        legalBody.innerHTML = legalContent[key].body;
        legalModal.classList.add('open');
        legalModal.setAttribute('aria-hidden', 'false');
      });
    });

    if (closeLegal) {
      closeLegal.addEventListener('click', () => {
        playClick();
        legalModal.classList.remove('open');
        legalModal.setAttribute('aria-hidden', 'true');
      });
    }
    if (legalModal) {
      legalModal.addEventListener('click', (e) => {
        if (e.target === legalModal) {
          playClick();
          legalModal.classList.remove('open');
          legalModal.setAttribute('aria-hidden', 'true');
        }
      });
    }
  }

  function closeAll() {
    historyDrawer.classList.remove('open');
    historyDrawer.setAttribute('aria-hidden', 'true');
    drawerBackdrop.classList.remove('visible');
    settingsModal.classList.remove('open');
    settingsModal.setAttribute('aria-hidden', 'true');
    const legalModal = $('#legalModal');
    if (legalModal) {
      legalModal.classList.remove('open');
      legalModal.setAttribute('aria-hidden', 'true');
    }
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
