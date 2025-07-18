window.addEventListener('DOMContentLoaded', () => {
  const navbarEl = document.querySelector('.navbar');
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);

  const waIcon  = document.getElementById('wa-icon');
  const waModal = document.getElementById('waFormModal');
  const waClose = document.querySelector('.wa-close');
  const waSend  = document.getElementById('wa-send-btn');
  const yearEl  = document.getElementById('current-year');
  const backBtn = document.getElementById('back-to-top');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const heroEls  = document.querySelectorAll('.hero-content h1, .hero-content p, .hero-content .btn');
  const scrollDown = document.querySelector('.scroll-down');
  const jelajahBtn = document.querySelector('.hero-content .btn');
  const bannerImg = document.querySelector('#about-banner img');

  // — SCROLL HANDLER (throttled via requestAnimationFrame)
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const scrollY   = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct       = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      // Navbar background toggle
      if (navbarEl) {
        navbarEl.classList.toggle('navbar-scrolled', scrollY > 0);
      }

      // Progress bar
      progressBar.style.width = `${pct}%`;

      // Parallax banner
      if (bannerImg) {
        bannerImg.style.transform = `translateY(${scrollY * 0.2}px)`;
      }

      // Back-to-top visibility
      if (backBtn) {
        if (scrollY > 200) {
          backBtn.style.display = 'block';
          backBtn.style.opacity = '1';
        } else {
          backBtn.style.opacity = '0';
          backBtn.style.display = 'none';
        }
      }

      ticking = false;
    }, { passive: true });
  }, { passive: true });

  // — NAV-LINK ACTIVE STATE
  const path = window.location.pathname;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (
      (href !== 'index.html' && path.endsWith(href)) ||
      (href === 'index.html' && (path === '/' || path.endsWith('/index.html')))
    ) {
      link.classList.add('active', 'fw-bold');
    }
  });

  // — HERO TEXT REVEAL
  heroEls.forEach((el, i) => {
    el.style.opacity   = 0;
    el.style.transform = 'translateY(20px)';
    setTimeout(() => {
      el.style.transition = 'opacity .6s ease, transform .6s ease';
      el.style.opacity    = 1;
      el.style.transform  = 'translateY(0)';
    }, 300 + i * 200);
  });

  // — SMOOTH SCROLL HELPERS
  function smoothScrollTo(selector) {
    const tgt = document.querySelector(selector);
    tgt && tgt.scrollIntoView({ behavior: 'smooth' });
  }
  if (jelajahBtn) jelajahBtn.addEventListener('click', e => {
    e.preventDefault();
    smoothScrollTo('#produk, #produk-unggulan');
  });
  if (scrollDown) scrollDown.addEventListener('click', () => {
    smoothScrollTo('#produk, #produk-unggulan');
  });

  // — WHATSAPP FORM MODAL
  if (waIcon && waModal && waClose && waSend) {
    const openWa = () => {
      waModal.style.display = 'block';
      waModal.setAttribute('aria-hidden', 'false');
    };
    const closeWa = () => {
      waModal.style.display = 'none';
      waModal.setAttribute('aria-hidden', 'true');
    };

    waIcon.addEventListener('click', openWa);
    waClose.addEventListener('click', closeWa);
    document.addEventListener('click', e => {
      if (waModal.style.display === 'block' && !waModal.contains(e.target) && e.target !== waIcon) {
        closeWa();
      }
    });
    waSend.addEventListener('click', () => {
      const nama   = document.getElementById('nama')?.value.trim();
      const asalpt = document.getElementById('asalpt')?.value.trim();
      const email  = document.getElementById('email')?.value.trim();
      const tujuan = document.getElementById('tujuan')?.value.trim();
      if (!nama || !asalpt || !email || !tujuan) {
        alert('Lengkapi semua field!');
        return;
      }
      const msg = encodeURIComponent(`Halo, saya *${nama}* dari *${asalpt}*.\nEmail: ${email}\nTujuan: ${tujuan}`);
      window.open(`https://wa.me/6281313089239?text=${msg}`, '_blank');
    });
  }

  // — FOOTER: Dynamic Year & Tooltips
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
  if (window.bootstrap) {
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
      .forEach(el => new bootstrap.Tooltip(el));
  }

  // — BACK-TO-TOP CLICK
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
