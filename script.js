const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ---------- TEMA ---------- */

const root = document.documentElement;
const themeBtn = $("#themeBtn");
const storedTheme = localStorage.getItem("drg-theme");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

if (storedTheme) root.dataset.theme = storedTheme;
else if (prefersLight) root.dataset.theme = "light";

themeBtn.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem("drg-theme", next);
});

/* ---------- NAV: sticky, menú móvil, enlace activo ---------- */

const nav = $("#nav");
const burger = $("#burger");
const navLinks = $("#navLinks");

const onScroll = () => nav.classList.toggle("is-stuck", window.scrollY > 12);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
});

navLinks.addEventListener("click", e => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }
});

const sections = $$("main section[id]");
const linkFor = id => $(`.nav__links a[href="#${id}"]`);
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    $$(".nav__links a").forEach(a => a.classList.remove("is-current"));
    linkFor(entry.target.id)?.classList.add("is-current");
  });
}, { rootMargin: "-45% 0px -50% 0px" });

sections.forEach(s => spy.observe(s));

/* ---------- FILTROS Y BÚSQUEDA ---------- */

const cards = $$("#cards .card");
const chips = $$(".chip");
const search = $("#search");
const status = $("#status");
const empty = $("#empty");

let activeFilter = "all";

const normalize = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const cardHaystack = card => normalize([
  card.querySelector("h3").textContent,
  card.querySelector(".card__tag").textContent,
  card.dataset.jinete,
  card.dataset.color,
  card.dataset.casa,
  card.dataset.keywords,
  card.textContent,
].join(" "));

function applyFilters() {
  const term = normalize(search.value.trim());
  let visible = 0;

  cards.forEach(card => {
    const matchesFilter = activeFilter === "all" || card.dataset.era === activeFilter;
    const matchesTerm = !term || cardHaystack(card).includes(term);
    const show = matchesFilter && matchesTerm;
    card.classList.toggle("is-hidden", !show);
    if (show) visible++;
  });

  empty.hidden = visible > 0;
  status.textContent = visible === 1 ? "1 dragón" : `${visible} dragones`;
}

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    activeFilter = chip.dataset.filter;
    applyFilters();
  });
});

search.addEventListener("input", applyFilters);
applyFilters();

/* ---------- REVEAL AL HACER SCROLL ---------- */

const revealTargets = $$(".reveal, .card, .tl");

if ("IntersectionObserver" in window) {
  const revealer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  revealTargets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    revealer.observe(el);
  });
} else {
  revealTargets.forEach(el => el.classList.add("is-visible"));
}

/* ---------- CONTADORES ANIMADOS ---------- */

function animateCount(el) {
  const target = Number(el.dataset.to);
  if (!Number.isFinite(target)) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = String(target);
    return;
  }

  const duration = 1200;
  const start = performance.now();

  const step = now => {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

const nums = $$(".stat__num");

if ("IntersectionObserver" in window) {
  const counterObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => counterObs.observe(n));
} else {
  nums.forEach(n => (n.textContent = n.dataset.to));
}

/* ---------- LIGHTBOX ---------- */

const gallery = $("#gallery");
const lightbox = $("#lightbox");
const lbArt = $("#lbArt");
const lbCaption = $("#lbCaption");
const artworks = $$("#gallery .art");

let current = 0;
let lastFocused = null;

function render(index) {
  current = (index + artworks.length) % artworks.length;
  const item = artworks[current];
  lbArt.className = `art__scene art__scene--${item.dataset.scene}`;
  lbArt.innerHTML = item.querySelector("svg").outerHTML;
  lbCaption.textContent = `${item.querySelector(".art__title").textContent} — ${item.dataset.caption}`;
}

function openLightbox(index) {
  lastFocused = document.activeElement;
  render(index);
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  $("#lbClose").focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  lastFocused?.focus();
}

gallery.addEventListener("click", e => {
  const item = e.target.closest(".art");
  if (item) openLightbox(artworks.indexOf(item));
});

gallery.addEventListener("keydown", e => {
  const item = e.target.closest(".art");
  if (item && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    openLightbox(artworks.indexOf(item));
  }
});

$("#lbClose").addEventListener("click", closeLightbox);
$("#lbPrev").addEventListener("click", () => render(current - 1));
$("#lbNext").addEventListener("click", () => render(current + 1));

lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", e => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") render(current - 1);
  if (e.key === "ArrowRight") render(current + 1);
});