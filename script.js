/* ================================================
   WEDDING INVITATION — Jose & Abigail
   Interactive Script: Particles, GSAP, Countdown
   ================================================ */

(() => {
  'use strict';

  /* ----------------------------------------
     CONFIG
     ---------------------------------------- */
  const WEDDING_DATE = new Date('2026-03-20T11:00:00-06:00');
  const PARTICLE_COUNT = 60;
  const CONFETTI_COUNT = 120;

  /* ----------------------------------------
     DOM REFS
     ---------------------------------------- */
  const entrance = document.getElementById('entrance');
  const body = document.body;
  const particlesCanvas = document.getElementById('particles-canvas');
  const confettiCanvas = document.getElementById('confetti-canvas');
  const pCtx = particlesCanvas.getContext('2d');
  const cCtx = confettiCanvas.getContext('2d');

  /* ----------------------------------------
     UTILITIES
     ---------------------------------------- */
  function rand(min, max) { return Math.random() * (max - min) + min; }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function resizeCanvas(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    canvas.getContext('2d').scale(dpr, dpr);
  }

  /* ----------------------------------------
     GOLD PARTICLE SYSTEM
     ---------------------------------------- */
  let particles = [];
  let particlesActive = true;

  class Particle {
    constructor() { this.reset(); }

    reset() {
      this.x = rand(0, window.innerWidth);
      this.y = rand(0, window.innerHeight);
      this.size = rand(1, 2.5);
      this.speedX = rand(-0.15, 0.15);
      this.speedY = rand(-0.3, -0.05);
      this.opacity = rand(0.15, 0.6);
      this.fadeSpeed = rand(0.002, 0.008);
      this.growing = Math.random() > 0.5;
      // Gold color with slight variation
      const hue = rand(38, 48);
      const sat = rand(55, 75);
      const light = rand(45, 65);
      this.color = `hsla(${hue}, ${sat}%, ${light}%, `;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.growing) {
        this.opacity += this.fadeSpeed;
        if (this.opacity >= 0.7) this.growing = false;
      } else {
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0.05) this.reset();
      }

      if (this.y < -10 || this.x < -10 || this.x > window.innerWidth + 10) {
        this.reset();
        this.y = window.innerHeight + 10;
      }
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.opacity + ')';
      ctx.fill();
    }
  }

  function initParticles() {
    resizeCanvas(particlesCanvas);
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
    animateParticles();
  }

  function animateParticles() {
    if (!particlesActive) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    pCtx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(pCtx); });
    requestAnimationFrame(animateParticles);
  }

  /* ----------------------------------------
     CONFETTI SYSTEM
     ---------------------------------------- */
  let confettiPieces = [];
  let confettiActive = false;

  class ConfettiPiece {
    constructor() { this.reset(true); }

    reset(initial) {
      this.x = rand(0, window.innerWidth);
      this.y = initial ? rand(-window.innerHeight, 0) : rand(-50, -20);
      this.w = rand(4, 10);
      this.h = rand(6, 14);
      this.speedY = rand(1, 3);
      this.speedX = rand(-0.8, 0.8);
      this.rotation = rand(0, 360);
      this.rotSpeed = rand(-5, 5);
      this.opacity = rand(0.5, 1);
      const colors = ['#c9a84c', '#e8d5a3', '#a08735', '#c4918f', '#f5f0e8'];
      this.color = colors[Math.floor(rand(0, colors.length))];
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
      this.rotation += this.rotSpeed;
      if (this.y > window.innerHeight + 20) this.reset(false);
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      ctx.restore();
    }
  }

  function startConfetti() {
    if (confettiActive) return;
    confettiActive = true;
    confettiCanvas.classList.add('active');
    resizeCanvas(confettiCanvas);
    confettiPieces = Array.from({ length: CONFETTI_COUNT }, () => new ConfettiPiece());
    animateConfetti();
  }

  function stopConfetti() {
    confettiActive = false;
    confettiCanvas.classList.remove('active');
  }

  function animateConfetti() {
    if (!confettiActive) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    cCtx.clearRect(0, 0, w, h);
    confettiPieces.forEach(p => { p.update(); p.draw(cCtx); });
    requestAnimationFrame(animateConfetti);
  }

  /* ----------------------------------------
     ENTRANCE HANDLER
     ---------------------------------------- */
  function handleEntrance() {
    entrance.classList.add('exit');

    // Play Background music
    const bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
      bgMusic.play().catch(e => console.log('Audio autoplay prevented:', e));
    }

    setTimeout(() => {
      entrance.remove();
      body.classList.remove('locked');
      initScrollAnimations();
      initCountdown();
      initGalleryDots();
      initFloatingHearts();
    }, 1800);
  }

  entrance.addEventListener('click', handleEntrance);
  entrance.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleEntrance();
  }, { passive: false });

  /* ----------------------------------------
     SCROLL REVEAL (Intersection Observer)
     ---------------------------------------- */
  function initScrollAnimations() {
    // GSAP-enhanced section animations (primary)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      // Remove .reveal from GSAP-targeted elements so they don't conflict
      const gsapTargets = '#names .names-name, .names-ampersand, .names-preline, .names-date, .names-location, .names-divider, .timeline-item, .proposal-ring, .proposal-answer, .proposal-date-label, .proposal-date, .proposal-question, .std-title, .std-date-big, .std-date-month, .std-date-year, .countdown-item, .calendar, .detail-card, .details-title, #gratitude .gratitude-text p, .gratitude-title, .gratitude-cross, .gallery-item, .gallery-title, .finale-top-text, .finale-heading, .finale-subtext, .finale-names, .finale-date, .finale-hashtag, .section-divider';
      document.querySelectorAll(gsapTargets).forEach(el => {
        el.classList.remove('reveal');
        el.style.opacity = '';
        el.style.transform = '';
      });
      initGSAPAnimations();
    }

    // Fallback: CSS reveal for any remaining .reveal elements
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  /* ----------------------------------------
     GSAP SCROLL ANIMATIONS
     ---------------------------------------- */
  function initGSAPAnimations() {
    // ---- NAMES SECTION (already in viewport — direct timeline, no ScrollTrigger) ----
    const namesTL = gsap.timeline({ delay: 0.2 });
    namesTL
      .to('.names-bg img', { opacity: 0.6, scale: 1, duration: 2, ease: 'power2.out' })
      .from('.names-preline', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=1.2')
      .from('#names .names-name', { y: 60, opacity: 0, duration: 1.2, stagger: 0.25, ease: 'power3.out' }, '-=0.4')
      .from('.names-ampersand', { scale: 0, opacity: 0, duration: 1, ease: 'elastic.out(1, 0.5)' }, '-=0.8')
      .from('.names-date, .names-location', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }, '-=0.4')
      .from('.names-divider', { scaleX: 0, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3');

    // ---- Helper: create scroll-triggered from() with immediateRender:false ----
    function scrollFrom(targets, triggerEl, startPos, vars) {
      return gsap.from(targets, {
        ...vars,
        immediateRender: false,
        scrollTrigger: { trigger: triggerEl, start: startPos, toggleActions: 'play none none none' }
      });
    }

    // ---- STORY SECTION ----
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      scrollFrom(item, item, 'top 88%', {
        x: -30, opacity: 0, duration: 0.8, delay: i * 0.1, ease: 'power2.out'
      });
    });

    // ---- PROPOSAL SECTION ----
    scrollFrom('.proposal-date-label', '#proposal', 'top 85%', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' });
    scrollFrom('.proposal-date', '#proposal', 'top 82%', { scale: 2, opacity: 0, duration: 1, ease: 'power3.out' });
    scrollFrom('.proposal-ring', '#proposal', 'top 75%', { scale: 0, rotation: -180, duration: 1.2, ease: 'elastic.out(1, 0.4)' });
    scrollFrom('.proposal-question', '#proposal', 'top 65%', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' });
    scrollFrom('.proposal-answer', '#proposal', 'top 55%', { scale: 0.5, opacity: 0, duration: 1, ease: 'back.out(2)' });

    // ---- SAVE THE DATE SECTION ----
    scrollFrom('.std-title', '#save-the-date', 'top 88%', { y: 30, opacity: 0, duration: 1, ease: 'power2.out' });
    scrollFrom('.std-date-big', '#save-the-date', 'top 80%', { scale: 3, opacity: 0, duration: 1.5, ease: 'power3.out' });
    scrollFrom('.std-date-month, .std-date-year', '#save-the-date', 'top 75%', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' });
    scrollFrom('.countdown-item', '.countdown', 'top 88%', { y: 30, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'power2.out' });
    scrollFrom('.calendar', '.calendar', 'top 92%', { y: 40, opacity: 0, duration: 0.8, ease: 'power2.out' });

    // ---- DETAILS SECTION ----
    scrollFrom('.details-title', '#details', 'top 88%', { y: 30, opacity: 0, duration: 1, ease: 'power2.out' });
    scrollFrom('.detail-card', '#details', 'top 80%', { y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out' });

    // ---- GRATITUDE SECTION ----
    scrollFrom('.gratitude-cross', '#gratitude', 'top 88%', { scale: 0, opacity: 0, duration: 0.8, ease: 'back.out(2)' });
    scrollFrom('.gratitude-title', '#gratitude', 'top 85%', { y: 30, opacity: 0, duration: 1, ease: 'power2.out' });
    gsap.utils.toArray('#gratitude .gratitude-text p').forEach((p, i) => {
      scrollFrom(p, p, 'top 92%', { y: 25, opacity: 0, duration: 0.9, delay: i * 0.08, ease: 'power2.out' });
    });

    // ---- GALLERY SECTION ----
    scrollFrom('.gallery-title', '#gallery', 'top 88%', { y: 30, opacity: 0, duration: 1, ease: 'power2.out' });
    scrollFrom('.gallery-item', '#gallery', 'top 85%', { x: 60, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out' });

    // ---- FINALE SECTION ----
    ScrollTrigger.create({
      trigger: '#finale',
      start: 'top 60%',
      onEnter: () => startConfetti(),
      onLeaveBack: () => stopConfetti()
    });

    scrollFrom('.finale-top-text', '#finale', 'top 85%', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' });
    scrollFrom('.finale-heading', '#finale', 'top 75%', { y: 60, opacity: 0, duration: 1.2, ease: 'power3.out' });
    scrollFrom('.finale-subtext', '#finale', 'top 65%', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out' });
    scrollFrom('.finale-names', '#finale', 'top 60%', { scale: 0.6, opacity: 0, duration: 1.4, ease: 'elastic.out(1, 0.5)' });
    scrollFrom('.finale-date', '#finale', 'top 55%', { y: 15, opacity: 0, duration: 0.8, ease: 'power2.out' });
    scrollFrom('.finale-hashtag', '#finale', 'top 50%', { y: 15, opacity: 0, duration: 0.8, ease: 'power2.out' });

    // ---- SECTION DIVIDERS ----
    gsap.utils.toArray('.section-divider').forEach(div => {
      scrollFrom(div, div, 'top 92%', { scaleY: 0, duration: 0.8, ease: 'power2.out' });
    });
  }

  /* ----------------------------------------
     COUNTDOWN TIMER
     ---------------------------------------- */
  let countdownInterval;

  function initCountdown() {
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      document.getElementById('cd-days').textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent = '00';
      document.getElementById('cd-secs').textContent = '00';
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    document.getElementById('cd-days').textContent = pad(days);
    document.getElementById('cd-hours').textContent = pad(hours);
    document.getElementById('cd-mins').textContent = pad(mins);
    document.getElementById('cd-secs').textContent = pad(secs);
  }

  /* ----------------------------------------
     GALLERY DOTS
     ---------------------------------------- */
  function initGalleryDots() {
    const track = document.getElementById('gallery-track');
    const dots = document.querySelectorAll('.gallery-dot');
    if (!track || !dots.length) return;

    track.addEventListener('scroll', () => {
      const scrollLeft = track.scrollLeft;
      const itemWidth = track.querySelector('.gallery-item').offsetWidth + 16;
      const activeIndex = Math.round(scrollLeft / itemWidth);
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
      });
    }, { passive: true });
  }

  /* ----------------------------------------
     FLOATING HEARTS (Finale)
     ---------------------------------------- */
  function initFloatingHearts() {
    const container = document.getElementById('finale-hearts');
    if (!container) return;

    const hearts = ['♥', '♡', '❤'];
    for (let i = 0; i < 12; i++) {
      const heart = document.createElement('span');
      heart.classList.add('heart');
      heart.textContent = hearts[Math.floor(rand(0, hearts.length))];
      heart.style.left = rand(5, 95) + '%';
      heart.style.fontSize = rand(10, 22) + 'px';
      heart.style.animationDelay = rand(0, 6) + 's';
      heart.style.animationDuration = rand(4, 8) + 's';
      container.appendChild(heart);
    }
  }

  /* ----------------------------------------
     WINDOW RESIZE
     ---------------------------------------- */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas(particlesCanvas);
      if (confettiActive) resizeCanvas(confettiCanvas);
    }, 200);
  });

  /* ----------------------------------------
     INIT
     ---------------------------------------- */
  function init() {
    initParticles();
    resizeCanvas(confettiCanvas);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
