/* =========================================================================
   THE HUMAN KALEIDOSCOPE — shared behavior
   ========================================================================= */
(function(){

  document.addEventListener('DOMContentLoaded', () => {

    /* ---------- footer year ---------- */
    document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

    /* ---------- custom cursor (desktop only) ---------- */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const dot = document.createElement('div'); dot.className = 'cursor-dot';
      const ring = document.createElement('div'); ring.className = 'cursor-ring';
      document.body.append(dot, ring);
      let mx = 0, my = 0, rx = 0, ry = 0;
      window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px'; });
      (function loop(){ rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(loop); })();
      const hoverables = 'a, button, .chapter-tile, .element, .facet-pill, .stepper-dot-btn';
      document.querySelectorAll(hoverables).forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
      });
    }

    /* ---------- page-enter curtain ---------- */
    const curtain = document.getElementById('curtain');
    const preloader = document.getElementById('preloader');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (curtain) {
      if (preloader) {
        // home page: preloader owns the entry moment; curtain sits ready for exits only
        const minTime = reduced ? 0 : 1500;
        const start = Date.now();
        window.addEventListener('load', () => {
          const wait = Math.max(0, minTime - (Date.now() - start));
          setTimeout(() => preloader.classList.add('done'), wait);
        });
      } else if (!reduced) {
        requestAnimationFrame(() => requestAnimationFrame(() => curtain.classList.add('reveal')));
      } else {
        curtain.classList.add('reveal');
      }

      document.querySelectorAll('a[data-transition]').forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto')) return;
          e.preventDefault();
          if (reduced) { window.location.href = href; return; }
          const facet = link.dataset.facet || 'explorer';
          curtain.style.background = `var(--facet-${facet})`;
          curtain.classList.remove('reveal');
          curtain.classList.add('cover');
          setTimeout(() => { window.location.href = href; }, 560);
        });
      });
    }

    /* ---------- nav overlay ---------- */
    const menuBtn = document.getElementById('menuToggle');
    const navOverlay = document.getElementById('navOverlay');
    const navClose = document.getElementById('navClose');
    if (menuBtn && navOverlay) {
      const open = () => { navOverlay.classList.add('open'); document.body.classList.add('nav-open'); };
      const close = () => { navOverlay.classList.remove('open'); document.body.classList.remove('nav-open'); };
      menuBtn.addEventListener('click', open);
      navClose?.addEventListener('click', close);
      document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
    }

    /* ---------- scroll reveal ---------- */
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

    /* ---------- split heading word-stagger ---------- */
    document.querySelectorAll('.split-heading').forEach(heading => {
      const words = heading.textContent.trim().split(/\s+/);
      heading.innerHTML = '';
      words.forEach((w, i) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.style.transitionDelay = `${(i * 0.055).toFixed(2)}s`;
        span.textContent = w + '\u00A0';
        heading.appendChild(span);
      });
    });
    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.word').forEach(w => w.classList.add('is-visible'));
          headingObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('.split-heading').forEach(h => headingObserver.observe(h));

    /* ---------- journey stepper (journey.html only) ---------- */
    const stepperBtns = document.querySelectorAll('.stepper-dot-btn');
    if (stepperBtns.length) {
      stepperBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          document.getElementById(btn.dataset.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
      const stages = document.querySelectorAll('.phase-stage');
      const stageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            stepperBtns.forEach(b => b.classList.toggle('active', b.dataset.target === id));
            const pc = entry.target.dataset.pc;
            if (pc) document.documentElement.style.setProperty('--page-facet', `var(--facet-${pc})`);
          }
        });
      }, { threshold: 0.5 });
      stages.forEach(s => stageObserver.observe(s));
    }

    /* ---------- magnetic buttons (desktop) ---------- */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      document.querySelectorAll('.btn-primary, .logo-mark').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const r = btn.getBoundingClientRect();
          const x = (e.clientX - r.left - r.width / 2) * 0.25;
          const y = (e.clientY - r.top - r.height / 2) * 0.25;
          btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
      });
    }

  });
})();
