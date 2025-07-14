// main.js
document.addEventListener("DOMContentLoaded", () => {
  // — AOS Init (scroll animations)
  if (window.AOS) {
    AOS.init({ duration: 700, once: true, easing: "ease-in-out" });
  }

  // — Helper: IntersectionObserver untuk fade-in .reveal
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("active");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    revealEls.forEach((el) => io.observe(el));
  }

  // — PRODUCT FILTER & ANIMATE-IN
  const filterSelect = document.getElementById("product-filter");
  const grid = document.getElementById("product-grid");
  const cards = document.querySelectorAll(".product-card");
  if (filterSelect && grid && cards.length) {
    // on-scroll reveal fallback
    const scrollObserver = new IntersectionObserver((ents, obs) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    cards.forEach((c) => scrollObserver.observe(c));

    // filter function with fade-out/in & stagger
    const applyFilter = (cat) => {
      grid.classList.add("hide");
      setTimeout(() => {
        cards.forEach((card, i) => {
          const show = cat === "all" || card.dataset.category === cat;
          card.style.display = show ? "" : "none";
          if (show) card.style.setProperty("--delay", `${i * 0.05}s`);
        });
        grid.classList.remove("hide");
      }, 300);
    };

    filterSelect.addEventListener("change", () => {
      filterSelect.classList.add("active");
      applyFilter(filterSelect.value);
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    filterSelect.addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.target.focus();
    });
  }

  // — NAVBAR SCROLL & PROGRESS BAR
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    // insert progress bar element
    const progress = document.createElement("div");
    progress.id = "scroll-progress";
    document.body.prepend(progress);

    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      // toggle background on any scroll
      navbar.classList.toggle("navbar-scrolled", y > 0);
      // update progress width
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (y / docH) * 100 : 0;
      progress.style.width = `${pct}%`;
    });
  }

  // — ACTIVE NAV-LINK HIGHLIGHT
  const page = window.location.pathname.split("/").pop();
  document.querySelectorAll(".navbar-nav .nav-link").forEach((a) => {
    const href = a.getAttribute("href");
    if (href === page) {
      a.classList.add("active", "fw-bold");
    }
  });

  // — WhatsApp form send
  const kirimWA = () => {
    const get = (id) => document.getElementById(id)?.value.trim();
    const [nama, asalPt, email, tujuan] = ["nama","asalpt","email","tujuan"].map(get);
    if (!nama || !asalPt || !email || !tujuan) {
      return alert("Semua kolom wajib diisi.");
    }
    const pesan = encodeURIComponent(
      `Halo, saya ${nama} dari ${asalPt}.\nEmail: ${email}\nTujuan: ${tujuan}`
    );
    window.open(`https://wa.me/6281310463069?text=${pesan}`, "_blank");
  };
  window.kirimWA = kirimWA;  // expose globally if dipanggil via onclick

  // — Mailchimp redirect
  const mcForm = document.getElementById("mc-embedded-subscribe-form");
  if (mcForm) {
    mcForm.addEventListener("submit", () => {
      setTimeout(() => {
        window.location.href = "thankyou.html";
      }, 2000);
    });
  }
});
// toggle teaser text icon
document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(btn => {
  btn.addEventListener('click', e => {
    const icon = e.currentTarget.querySelector('.bi');
    const target = document.querySelector(e.currentTarget.dataset.bsTarget);
    setTimeout(() => {
      e.currentTarget.setAttribute(
        'aria-expanded',
        target.classList.contains('show')
      );
    }, 200);
  });
});