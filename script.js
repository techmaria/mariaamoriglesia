gsap.registerPlugin(ScrollTrigger);

// ── Nav stuck ──
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('stuck', window.scrollY > 40);
}, { passive: true });

// ── Mobile menu ──
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}
document.getElementById('hamburger').addEventListener('click', toggleMenu);
document.getElementById('mobileClose').addEventListener('click', toggleMenu);

// ── Hero animations (on load) ──
gsap.fromTo('.will-fade', { opacity:0, y:28 }, {
  opacity:1, y:0, duration:0.9, stagger:0.12, ease:'power3.out',
  delay:0.2
});
gsap.fromTo('#hero .will-right', { opacity:0, x:32 }, {
  opacity:1, x:0, duration:1, ease:'power3.out', delay:0.4
});

gsap.fromTo('.hero-photo',
  {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.1
  }
);

// ── Scroll reveals — generic ──
function reveal(sel, xFrom, yFrom, delayBase) {
  gsap.utils.toArray(sel).forEach((el, i) => {
    if (el.closest('#hero')) return;
    const d = parseFloat(el.style.transitionDelay) || 0;
    gsap.fromTo(el,
      { opacity:0, x: xFrom||0, y: yFrom||0, scale: sel.includes('scale') ? 0.96 : 1 },
      { opacity:1, x:0, y:0, scale:1,
        duration:0.85, delay: d,
        ease:'power3.out',
        scrollTrigger: { trigger:el, start:'top 86%', toggleActions:'play none none reverse' }
      }
    );
  });
}
reveal('.will-fade:not(#hero .will-fade)', 0, 28);
reveal('.will-left', -28, 0);
reveal('.will-right:not(#hero .will-right)', 28, 0);
reveal('.will-scale', 0, 0);

// ── Arch rows stagger ──
gsap.utils.toArray('.arch-row').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity:0, x:-20 },
    { opacity:1, x:0, duration:0.55, delay:i*0.07, ease:'power2.out',
      scrollTrigger:{ trigger:el, start:'top 88%' }
    }
  );
});

// ── Timeline steps stagger ──
gsap.utils.toArray('.tl-step').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity:0, x:-20 },
    { opacity:1, x:0, duration:0.65, delay:i*0.05, ease:'power2.out',
      scrollTrigger:{ trigger:el, start:'top 88%', toggleActions:'play none none reverse' }
    }
  );
});

// ── KPI bar animation ──
const barIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target.querySelector('.bar-fill');
      if (fill) {
        const t = Math.min(parseInt(fill.dataset.target), 100);
        setTimeout(() => { fill.style.width = t + '%'; }, 150);
      }
      barIO.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.stat-card, .kpi-bar-item, [class*="kpi"], [style*="bar-track"]').forEach(el => barIO.observe(el));

// Directly observe bar-track parents
document.querySelectorAll('.bar-fill').forEach(fill => {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const t = Math.min(parseInt(fill.dataset.target)||0, 100);
      setTimeout(() => { fill.style.width = t + '%'; }, 300);
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(fill.closest('div') || fill);
});

// ── Process steps stagger ──
gsap.utils.toArray('.proc-step').forEach((el, i) => {
  gsap.fromTo(el,
    { opacity:0, y:20 },
    { opacity:1, y:0, duration:0.6, delay:i*0.1, ease:'power2.out',
      scrollTrigger:{ trigger:'#process', start:'top 70%' }
    }
  );
});

// ── Click-to-play demo video (with real error handling) ──
const demoPreview = document.getElementById('demoPreview');
const demoPlayBtn = document.getElementById('demoPlayBtn');
let ytApiReady = false;
let pendingPlay = false;

window.onYouTubeIframeAPIReady = function () {
  ytApiReady = true;
  if (pendingPlay) startDemoPlayer();
};

function showDemoFallback() {
  const url = demoPreview.dataset.videoUrl;
  demoPreview.classList.add('demo-preview--fallback');
  demoPreview.innerHTML = `
    <div class="demo-fallback">
      <div class="demo-fallback-title">This preview can't play here</div>
      <div class="demo-fallback-body">The video owner has restricted embedding. Watch it directly on YouTube instead.</div>
      <a href="${url}" target="_blank" rel="noopener" class="demo-fallback-btn">Watch on YouTube →</a>
    </div>`;
}

function startDemoPlayer() {
  const videoId = demoPreview.dataset.videoId;
  demoPreview.innerHTML = '<div id="ytPlayerTarget" class="demo-preview-frame"></div>';
  new YT.Player('ytPlayerTarget', {
    videoId: videoId,
    playerVars: { autoplay: 1, rel: 0 },
    events: {
      onReady: e => e.target.playVideo(),
      onError: () => showDemoFallback()
    }
  });
}

if (demoPreview && demoPlayBtn) {
  demoPlayBtn.addEventListener('click', () => {
    if (ytApiReady) {
      startDemoPlayer();
    } else {
      pendingPlay = true;
      demoPreview.innerHTML = '<div class="demo-fallback"><div class="demo-fallback-title">Loading player…</div></div>';
    }
  });
}
// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href.length < 2) return;
    const target = document.querySelector(href);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });
});

// ── Subtle parallax on hero grid ──
gsap.to('.hero-rule', {
  yPercent: 15,
  scrollTrigger:{ trigger:'#hero', start:'top top', end:'bottom top', scrub:true }
});