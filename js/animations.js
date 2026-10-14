/**
 * BRANDX — IMMERSIVE CINEMATIC SCROLL FILM ENGINE
 * Inspired by luxury-level cinematic storytelling & scroll-controlled presentation (Cartier Roadster Universe)
 * Pinned 900vh native scroll timeline controlling 3D camera transforms, 8 chapter screen morphs,
 * 3D outward-expanding holograms, dynamic volumetric atmospheric lighting, narrative panels, and HUD scrubber.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Cinematic Scroll Film Engine
  window.brandxFilm = new ScrollFilmEngine();

  // 2. Initialize Features Grid Pointer Glow & Interactive Tilts
  initCardPointerSpotlights();

  // 3. Initialize IntersectionObserver Scroll Reveals
  initScrollReveals();

  // 4. Initialize 3D Typography & Heading Reveals
  initCinematic3DTypography();

  // 5. Initialize Continuous Capabilities Scroll Spy for Constellation
  initConstellationScrollSpy();
});

// ==========================================================================
// SCROLL FILM ENGINE CLASS (60fps Damped Lerp + 3D Camera Waypoints)
// ==========================================================================
class ScrollFilmEngine {
  constructor() {
    this.track = document.getElementById('filmTrack');
    this.viewport = document.getElementById('filmStickyViewport');
    this.canvas = document.getElementById('filmCanvas');
    this.atmosphere = document.getElementById('filmAtmosphere');
    this.heroOverlay = document.getElementById('filmHeroOverlay');
    this.phoneRig = document.getElementById('filmPhoneRig');
    this.phoneModel = document.getElementById('filmPhoneModel');
    this.phoneGlow = document.getElementById('phoneDynamicGlow');
    this.glassSheen = document.querySelector('.phone-glass-sheen');

    this.screenViews = [
      document.getElementById('view-hero'),
      document.getElementById('view-billing'),
      document.getElementById('view-khata'),
      document.getElementById('view-items'),
      document.getElementById('view-dukaan'),
      document.getElementById('view-nfc'),
      document.getElementById('view-posters'),
      document.getElementById('view-standee'),
      document.getElementById('view-copilot')
    ];

    this.holoElements = {
      1: [document.getElementById('holoReceipt')],
      2: [document.getElementById('holoLedgerRed'), document.getElementById('holoLedgerGreen')],
      4: [document.getElementById('holoStoreCard')],
      5: [document.getElementById('holoNfcCard')],
      8: [document.getElementById('holoAiCluster')]
    };

    this.chapterPanels = [
      document.getElementById('chap-1'),
      document.getElementById('chap-2'),
      document.getElementById('chap-3'),
      document.getElementById('chap-4'),
      document.getElementById('chap-5'),
      document.getElementById('chap-6'),
      document.getElementById('chap-7'),
      document.getElementById('chap-8')
    ];

    this.hudProgressFill = document.getElementById('hudProgressFill');
    this.hudDots = document.querySelectorAll('.hud-dot');
    this.hudLabelNum = document.querySelector('.hud-label-num');
    this.hudLabelText = document.querySelector('.hud-label-text');

    // Interpolation state
    this.targetProgress = 0;
    this.currentProgress = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.currentMouseX = 0;
    this.currentMouseY = 0;
    this.activeChapter = 0;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isMobile = window.innerWidth <= 768;

    // Atmospheric lighting gradients mapped per chapter
    this.atmosphereColors = [
      'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.3) 0%, rgba(6, 182, 212, 0.16) 35%, rgba(124, 58, 237, 0.1) 60%, transparent 80%)', // Intro
      'radial-gradient(circle at 65% 50%, rgba(37, 99, 235, 0.42) 0%, rgba(6, 182, 212, 0.22) 40%, rgba(10, 17, 40, 0) 75%)', // 1: Billing
      'radial-gradient(circle at 35% 50%, rgba(16, 185, 129, 0.32) 0%, rgba(239, 68, 68, 0.18) 40%, rgba(10, 17, 40, 0) 75%)', // 2: Khata
      'radial-gradient(circle at 65% 50%, rgba(59, 130, 246, 0.38) 0%, rgba(14, 165, 233, 0.22) 40%, rgba(10, 17, 40, 0) 75%)', // 3: Items
      'radial-gradient(circle at 35% 50%, rgba(16, 185, 129, 0.38) 0%, rgba(6, 182, 212, 0.22) 45%, rgba(10, 17, 40, 0) 75%)', // 4: Dukaan
      'radial-gradient(circle at 65% 50%, rgba(139, 92, 246, 0.42) 0%, rgba(236, 72, 153, 0.18) 40%, rgba(10, 17, 40, 0) 75%)', // 5: NFC
      'radial-gradient(circle at 35% 50%, rgba(244, 63, 94, 0.38) 0%, rgba(245, 158, 11, 0.28) 45%, rgba(10, 17, 40, 0) 75%)', // 6: Posters
      'radial-gradient(circle at 65% 50%, rgba(6, 182, 212, 0.42) 0%, rgba(37, 99, 235, 0.28) 40%, rgba(10, 17, 40, 0) 75%)', // 7: Standee
      'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.58) 0%, rgba(6, 182, 212, 0.38) 40%, rgba(236, 72, 153, 0.18) 65%, transparent 85%)'  // 8: AI Copilot
    ];

    this.phoneGlowColors = [
      'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.45) 0%, rgba(6, 182, 212, 0.25) 45%, transparent 75%)',
      'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.5) 0%, rgba(6, 182, 212, 0.3) 45%, transparent 75%)',
      'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.45) 0%, rgba(245, 158, 11, 0.25) 45%, transparent 75%)',
      'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.5) 0%, rgba(96, 165, 250, 0.3) 45%, transparent 75%)',
      'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.5) 0%, rgba(34, 211, 238, 0.3) 45%, transparent 75%)',
      'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.55) 0%, rgba(192, 132, 252, 0.3) 45%, transparent 75%)',
      'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.5) 0%, rgba(251, 191, 36, 0.3) 45%, transparent 75%)',
      'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.55) 0%, rgba(37, 99, 235, 0.3) 45%, transparent 75%)',
      'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.7) 0%, rgba(34, 211, 238, 0.45) 45%, transparent 80%)'
    ];

    this.chapterLabels = [
      { num: '00', text: 'OVERVIEW' },
      { num: '01', text: 'GST BILLING & POS' },
      { num: '02', text: 'CUSTOMER KHATA' },
      { num: '03', text: 'ITEM MANAGEMENT' },
      { num: '04', text: 'DIGITAL DUKAAN' },
      { num: '05', text: 'NFC VISITING CARD' },
      { num: '06', text: 'FESTIVAL POSTERS' },
      { num: '07', text: 'UPI QR STANDEE' },
      { num: '08', text: 'AI BUSINESS COPILOT' }
    ];

    // 3D Camera choreography waypoints:
    // [progress, x, y, z, rx, ry, rz, scale]
    this.waypointsDesktop = [
      { p: 0.00, x: 0,   y: 20,  z: 0,   rx: 12,  ry: -4,  rz: 0,  s: 0.94 }, // Scene 0 Intro
      { p: 0.08, x: 0,   y: 10,  z: 15,  rx: 8,   ry: -2,  rz: 0,  s: 0.98 },
      { p: 0.16, x: 220, y: 0,   z: 50,  rx: 4,   ry: -15, rz: -2, s: 1.05 }, // Chapter 1 (Billing)
      { p: 0.28, x: -220,y: -10, z: 45,  rx: -3,  ry: 16,  rz: 2,  s: 1.04 }, // Chapter 2 (Khata)
      { p: 0.40, x: 210, y: 15,  z: 40,  rx: 8,   ry: -12, rz: -1, s: 1.03 }, // Chapter 3 (Items)
      { p: 0.52, x: -220,y: 0,   z: 45,  rx: 0,   ry: 16,  rz: 1,  s: 1.05 }, // Chapter 4 (Dukaan)
      { p: 0.64, x: 210, y: -15, z: 55,  rx: -7,  ry: -16, rz: -2, s: 1.04 }, // Chapter 5 (NFC)
      { p: 0.76, x: -210,y: 10,  z: 35,  rx: 5,   ry: 14,  rz: 2,  s: 1.03 }, // Chapter 6 (Posters)
      { p: 0.88, x: 200, y: 0,   z: 40,  rx: 3,   ry: -10, rz: 0,  s: 1.03 }, // Chapter 7 (UPI Standee)
      { p: 1.00, x: 0,   y: 25,  z: 80,  rx: 8,   ry: 0,   rz: 0,  s: 1.08 }  // Chapter 8 (AI Copilot)
    ];

    // Mobile / Tablet waypoints: centered phone, smaller scale, subtle tilts
    this.waypointsMobile = [
      { p: 0.00, x: 0, y: 0,   z: 0,  rx: 8,  ry: -2, rz: 0, s: 0.88 },
      { p: 0.08, x: 0, y: 0,   z: 0,  rx: 4,  ry: -1, rz: 0, s: 0.90 },
      { p: 0.16, x: 0, y: -45, z: 15, rx: 2,  ry: -8, rz: 0, s: 0.90 },
      { p: 0.28, x: 0, y: -45, z: 15, rx: -2, ry: 8,  rz: 0, s: 0.90 },
      { p: 0.40, x: 0, y: -45, z: 15, rx: 4,  ry: -6, rz: 0, s: 0.90 },
      { p: 0.52, x: 0, y: -45, z: 15, rx: 0,  ry: 7,  rz: 0, s: 0.90 },
      { p: 0.64, x: 0, y: -45, z: 15, rx: -4, ry: -8, rz: 0, s: 0.90 },
      { p: 0.76, x: 0, y: -45, z: 15, rx: 3,  ry: 6,  rz: 0, s: 0.90 },
      { p: 0.88, x: 0, y: -45, z: 15, rx: 1,  ry: -5, rz: 0, s: 0.90 },
      { p: 1.00, x: 0, y: -35, z: 25, rx: 4,  ry: 0,  rz: 0, s: 0.92 }
    ];

    if (!this.track || !this.viewport) return;
    this.init();
  }

  init() {
    this.initParticleCanvas();
    this.bindEvents();
    this.updateTargetProgress();
    this.rafLoop();
  }

  bindEvents() {
    // Scroll progress tracker
    window.addEventListener('scroll', () => {
      this.updateTargetProgress();
    }, { passive: true });

    // Window Resize
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
      this.resizeCanvas();
      this.updateTargetProgress();
    });

    // Mouse pointer subtle 3D parallax
    if (!this.isReducedMotion && window.matchMedia('(pointer: fine)').matches) {
      window.addEventListener('mousemove', (e) => {
        const xPct = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const yPct = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
        this.mouseX = xPct * 4; // degrees
        this.mouseY = -yPct * 4;
      });
    }

    // HUD Dot click jump handlers
    const waypointsProgress = [0.00, 0.16, 0.28, 0.40, 0.52, 0.64, 0.76, 0.88, 1.00];
    this.hudDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const jumpIndex = parseInt(dot.getAttribute('data-jump'), 10);
        if (isNaN(jumpIndex)) return;
        const targetFrac = waypointsProgress[jumpIndex] || 0;
        this.scrollToProgress(targetFrac);
      });
    });
  }

  scrollToProgress(frac) {
    if (!this.track) return;
    const trackRect = this.track.getBoundingClientRect();
    const trackTop = trackRect.top + window.scrollY;
    const maxScroll = this.track.offsetHeight - window.innerHeight;
    const dest = trackTop + (frac * maxScroll);
    window.scrollTo({ top: dest, behavior: 'smooth' });
  }

  updateTargetProgress() {
    if (!this.track) return;
    const trackRect = this.track.getBoundingClientRect();
    const maxScroll = this.track.offsetHeight - window.innerHeight;
    if (maxScroll <= 0) {
      this.targetProgress = 0;
      return;
    }
    const scrollY = -trackRect.top;
    this.targetProgress = Math.max(0, Math.min(1, scrollY / maxScroll));
  }

  // 60fps Continuous Lerp Animation Loop
  rafLoop() {
    // Damped exponential lerp for smooth momentum
    const lerpSpeed = this.isMobile ? 0.12 : 0.085;
    this.currentProgress += (this.targetProgress - this.currentProgress) * lerpSpeed;

    // Mouse parallax lerp
    this.currentMouseX += (this.mouseX - this.currentMouseX) * 0.06;
    this.currentMouseY += (this.mouseY - this.currentMouseY) * 0.06;

    if (!this.isReducedMotion) {
      this.renderFrame(this.currentProgress);
      this.renderParticles();
      if (window.brandx3DUniverse && typeof window.brandx3DUniverse.setScrollProgress === 'function') {
        window.brandx3DUniverse.setScrollProgress(this.currentProgress);
      }
    }

    requestAnimationFrame(() => this.rafLoop());
  }

  renderFrame(p) {
    // 1. Scene 0 Hero Overlay Fade
    if (this.heroOverlay) {
      if (p < 0.08) {
        const opacity = Math.max(0, 1 - (p / 0.075));
        const translateY = -p * 350;
        const scale = 1 - (p * 0.4);
        this.heroOverlay.style.opacity = opacity.toFixed(3);
        this.heroOverlay.style.transform = `translateY(${translateY}px) scale(${scale})`;
        this.heroOverlay.style.pointerEvents = opacity > 0.4 ? 'auto' : 'none';
        this.heroOverlay.classList.remove('faded-out');
      } else {
        this.heroOverlay.style.opacity = '0';
        this.heroOverlay.style.pointerEvents = 'none';
        this.heroOverlay.classList.add('faded-out');
      }
    }

    // 2. Interpolate 3D Phone Rig Transforms
    const waypoints = this.isMobile ? this.waypointsMobile : this.waypointsDesktop;
    const t = this.interpolateWaypoints(p, waypoints);

    if (this.phoneRig) {
      const rx = t.rx + this.currentMouseY;
      const ry = t.ry + this.currentMouseX;
      this.phoneRig.style.transform = `translate3d(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px, ${t.z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${t.rz.toFixed(2)}deg) scale(${t.s.toFixed(3)})`;
    }

    // 3. Determine Active Chapter based on Progress
    // Chapter thresholds:
    // 0: 0.00 -> 0.10 (Intro)
    // 1: 0.10 -> 0.22 (Billing)
    // 2: 0.22 -> 0.34 (Khata)
    // 3: 0.34 -> 0.46 (Items)
    // 4: 0.46 -> 0.58 (Dukaan)
    // 5: 0.58 -> 0.70 (NFC)
    // 6: 0.70 -> 0.82 (Posters)
    // 7: 0.82 -> 0.92 (Standee)
    // 8: 0.92 -> 1.00 (Copilot)
    let newChapter = 0;
    if (p < 0.10) newChapter = 0;
    else if (p < 0.22) newChapter = 1;
    else if (p < 0.34) newChapter = 2;
    else if (p < 0.46) newChapter = 3;
    else if (p < 0.58) newChapter = 4;
    else if (p < 0.70) newChapter = 5;
    else if (p < 0.82) newChapter = 6;
    else if (p < 0.92) newChapter = 7;
    else newChapter = 8;

    if (newChapter !== this.activeChapter) {
      this.setActiveChapter(newChapter);
    }

    // 4. Update HUD Progress Fill
    if (this.hudProgressFill) {
      this.hudProgressFill.style.height = `${(p * 100).toFixed(1)}%`;
    }

    // 5. Light Sheen Reflection dynamic shift
    if (this.glassSheen) {
      const sheenAngle = -18 + (t.ry * 0.8);
      const sheenOffset = (p * 80) - 40;
      this.glassSheen.style.transform = `rotate(${sheenAngle.toFixed(1)}deg) translateX(${sheenOffset.toFixed(1)}px)`;
    }
  }

  setActiveChapter(chapterIndex) {
    this.activeChapter = chapterIndex;

    // 1. Update Screen Views inside Phone
    this.screenViews.forEach((view, idx) => {
      if (!view) return;
      if (idx === chapterIndex) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    // 2. Update Outward 3D Holographic Objects
    Object.keys(this.holoElements).forEach(chKey => {
      const chNum = parseInt(chKey, 10);
      const elements = this.holoElements[chNum];
      if (!elements) return;
      const shouldActivate = (chNum === chapterIndex);
      elements.forEach(el => {
        if (!el) return;
        if (shouldActivate) el.classList.add('active');
        else el.classList.remove('active');
      });
    });

    // 3. Update Story Chapter Panels
    this.chapterPanels.forEach((panel, idx) => {
      if (!panel) return;
      const panelChapter = idx + 1; // Chapters are 1..8
      if (panelChapter === chapterIndex) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // 4. Update HUD Dots & Indicator
    this.hudDots.forEach((dot, idx) => {
      if (idx === chapterIndex) dot.classList.add('active');
      else dot.classList.remove('active');
    });

    const info = this.chapterLabels[chapterIndex] || this.chapterLabels[0];
    if (this.hudLabelNum) this.hudLabelNum.textContent = info.num;
    if (this.hudLabelText) this.hudLabelText.textContent = info.text;

    // 5. Shift Dynamic Atmosphere & Phone Glow
    if (this.atmosphere && this.atmosphereColors[chapterIndex]) {
      this.atmosphere.style.background = this.atmosphereColors[chapterIndex];
    }
    if (this.phoneGlow && this.phoneGlowColors[chapterIndex]) {
      this.phoneGlow.style.background = this.phoneGlowColors[chapterIndex];
    }
  }

  interpolateWaypoints(p, waypoints) {
    if (p <= waypoints[0].p) return waypoints[0];
    if (p >= waypoints[waypoints.length - 1].p) return waypoints[waypoints.length - 1];

    for (let i = 0; i < waypoints.length - 1; i++) {
      const w1 = waypoints[i];
      const w2 = waypoints[i + 1];
      if (p >= w1.p && p <= w2.p) {
        const segmentProgress = (p - w1.p) / (w2.p - w1.p);
        // Smooth Hermite / Cosine easing for segment transitions
        const ease = (1 - Math.cos(segmentProgress * Math.PI)) / 2;

        return {
          x:  w1.x  + (w2.x  - w1.x)  * ease,
          y:  w1.y  + (w2.y  - w1.y)  * ease,
          z:  w1.z  + (w2.z  - w1.z)  * ease,
          rx: w1.rx + (w2.rx - w1.rx) * ease,
          ry: w1.ry + (w2.ry - w1.ry) * ease,
          rz: w1.rz + (w2.rz - w1.rz) * ease,
          s:  w1.s  + (w2.s  - w1.s)  * ease
        };
      }
    }
    return waypoints[0];
  }

  // ========================================================================
  // Ambient Particle & Light Dust System (Canvas 2D)
  // ========================================================================
  initParticleCanvas() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.resizeCanvas();

    const count = this.isMobile ? 28 : 55;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvasWidth,
        y: Math.random() * this.canvasHeight,
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.45 + 0.15,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35 - 0.1,
        color: Math.random() > 0.4 ? 'rgba(56, 189, 248,' : 'rgba(192, 132, 252,'
      });
    }
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
  }

  renderParticles() {
    if (!this.ctx || !this.particles.length) return;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    for (let i = 0; i < this.particles.length; i++) {
      const pt = this.particles[i];
      pt.x += pt.speedX;
      pt.y += pt.speedY;

      // Wrap around bounds
      if (pt.x < 0) pt.x = this.canvasWidth;
      else if (pt.x > this.canvasWidth) pt.x = 0;
      if (pt.y < 0) pt.y = this.canvasHeight;
      else if (pt.y > this.canvasHeight) pt.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${pt.color}${pt.alpha.toFixed(2)})`;
      this.ctx.fill();
    }
  }
}

// ==========================================================================
// INTERACTIVE CARDS POINTER SPOTLIGHT (Capabilities & Pricing)
// ==========================================================================
function initCardPointerSpotlights() {
  const cards = document.querySelectorAll('.interactive-card');
  if (!cards.length) return;

  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      if (card.hasAttribute('data-tilt')) {
        const xPct = (x / rect.width - 0.5) * 2;
        const yPct = (y / rect.height - 0.5) * 2;
        card.style.transform = `perspective(1000px) rotateX(${-yPct * 4}deg) rotateY(${xPct * 4}deg) translateY(-4px)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      if (card.hasAttribute('data-tilt')) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      }
    });
  });
}

// ==========================================================================
// SCROLL REVEALS VIA INTERSECTIONOBSERVER
// ==========================================================================
function initScrollReveals() {
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale'
  );

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));
}

// ==========================================================================
// CINEMATIC 3D TYPOGRAPHY ENGINE (Major Headings Reveals)
// Words emerge sequentially with dimensional depth, controlled perspective,
// and electric-blue light sweeps. Supports reverse playback on scroll up.
// ==========================================================================
function initCinematic3DTypography() {
  const headings = document.querySelectorAll('.cinematic-heading-3d');
  if (!headings.length) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion) {
    headings.forEach(h => h.classList.add('heading-revealed'));
    return;
  }

  const headingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const heading = entry.target;
      if (entry.isIntersecting) {
        heading.classList.add('heading-revealed');
      } else {
        // Reverse playback when scrolled completely out of view above or below
        const rect = heading.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) {
          heading.classList.remove('heading-revealed');
        }
      }
    });
  }, { threshold: 0.2 });

  headings.forEach(h => headingObserver.observe(h));
}

// ==========================================================================
// CONSTELLATION SCROLL SPY
// Highlight active 3D constellation node as user scrolls through capabilities
// ==========================================================================
function initConstellationScrollSpy() {
  const cards = document.querySelectorAll('.features-grid .feature-card');
  if (!cards.length) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.brandxWebsiteScenes && typeof window.brandxWebsiteScenes.highlightConstellationNode === 'function') {
          const midY = window.innerHeight * 0.55;
          let closestIdx = -1;
          let closestDist = Infinity;

          cards.forEach((card, idx) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const dist = Math.abs(cardCenter - midY);
            if (dist < closestDist && rect.bottom > 0 && rect.top < window.innerHeight) {
              closestDist = dist;
              closestIdx = idx;
            }
          });

          if (closestIdx !== -1 && closestDist < 320) {
            window.brandxWebsiteScenes.highlightConstellationNode(closestIdx);
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
