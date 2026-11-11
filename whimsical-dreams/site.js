/* Shared header, menu, footer and shop grid. */
const PHONE = "6617035900";
const PHONE_PRETTY = "661-703-5900";
const FACEBOOK = "https://www.facebook.com/Whimsicaldreamsshop";
// Fill these in when you have them (leave "" to hide the icon):
const INSTAGRAM = "";
const TIKTOK = "";
const EMAIL = "";

const PAGES = [
  ["index.html", "Home"],
  ["about.html", "About"],
  ["clothing.html", "Clothing and Wares"],
  ["decor.html", "Home Decor, Crafts, and Treasures"],
  ["plants.html", "Plants"],
  ["contact.html", "Contact us"],
];

const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12Z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 5l14 14M19 5 5 19"/></svg>',
  text: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="11" height="16" rx="2"/><path d="M13 3h4a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1l-2 2v-2"/><circle cx="9.5" cy="17" r=".6" fill="currentColor"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v8h4v-8H17l.5-4h-4V8.8c0-.5.3-.8.5-.8Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17" cy="7" r=".8" fill="currentColor"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 3c.3 2.3 1.7 3.9 4 4.1v3.1a7 7 0 0 1-4-1.3v6.3a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v3.2a2.5 2.5 0 1 0 1.7 2.3V3h3Z"/></svg>',
};

function smsLink(message) {
  // "?&body=" works on both iPhone and Android
  return "sms:" + PHONE + (message ? "?&body=" + encodeURIComponent(message) : "");
}

function buildChrome() {
  const here = location.pathname.split("/").pop() || "index.html";
  const nav = PAGES.map(([href, label]) =>
    `<a href="${href}"${href === here ? ' aria-current="page"' : ""}>${label === "Home Decor, Crafts, and Treasures" ? "Home Decor &amp; Treasures" : label}</a>`).join("");

  document.body.insertAdjacentHTML("afterbegin", `
    <header class="site-header">
      <div class="wrap">
        <a class="logo" href="index.html" aria-label="Whimsical Dreams home"><img src="images/logo.png" alt="Whimsical Dreams moon and mushroom logo"></a>
        <nav class="desktop-nav" aria-label="Main">${nav}</nav>
        <div class="header-icons">
          <a class="icon-btn" href="plants.html#shop" aria-label="Browse the shop">${ICONS.search}</a>
          <a class="icon-btn" href="${FACEBOOK}" target="_blank" rel="noopener" aria-label="Message us on Facebook">${ICONS.chat}</a>
          <button class="icon-btn menu-toggle" aria-label="Open menu" aria-expanded="false">${ICONS.menu}</button>
        </div>
      </div>
    </header>
    <div class="menu" id="menu" aria-hidden="true">
      <div class="menu-top"><button class="icon-btn menu-close" aria-label="Close menu">${ICONS.close}</button></div>
      <ul>${PAGES.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul>
    </div>`);

  const socials = [
    EMAIL && `<a href="mailto:${EMAIL}" aria-label="Email">${ICONS.mail}</a>`,
    `<a href="${FACEBOOK}" target="_blank" rel="noopener" aria-label="Facebook">${ICONS.facebook}</a>`,
    INSTAGRAM && `<a href="${INSTAGRAM}" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.instagram}</a>`,
    TIKTOK && `<a href="${TIKTOK}" target="_blank" rel="noopener" aria-label="TikTok">${ICONS.tiktok}</a>`,
  ].filter(Boolean).join("");

  document.body.insertAdjacentHTML("beforeend", `
    <footer class="site-footer">
      <div class="wrap">
        <a class="logo" href="index.html" aria-label="Whimsical Dreams home"><img src="images/logo.png" alt=""></a>
        <div class="socials">${socials}</div>
        <hr>
        <p class="small legal-links"><a href="terms.html">Terms &amp; Conditions</a> &middot; <a href="privacy.html">Privacy Policy</a></p>
        <p class="small">&copy; ${new Date().getFullYear()} Whimsical Dreams &middot; Botanics &amp; Treasures &middot; Auburn, Maine</p>
      </div>
    </footer>
    <a class="text-us" href="${smsLink("Hi Whimsical Dreams! ")}">${ICONS.text}<span>Text us</span></a>`);

  const menu = document.getElementById("menu");
  const toggle = document.querySelector(".menu-toggle");
  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setOpen(true));
  menu.querySelector(".menu-close").addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function renderShop() {
  const grid = document.querySelector("[data-category]");
  if (!grid) return;
  const select = document.querySelector(".categories");
  const count = document.querySelector(".count");

  function draw(cat) {
    const items = PRODUCTS.filter((p) => cat === "all" || p.category === cat);
    count.textContent = items.length + (items.length === 1 ? " result" : " results");
    grid.innerHTML = items.length ? items.map((p) => `
      <article class="card">
        <div class="photo">${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy">` : "Photo coming soon"}</div>
        <h3>${escapeHtml(p.name)}</h3>
        ${p.price != null ? `<p class="price">US$${Number(p.price).toFixed(2)}</p>` : ""}
        ${p.lowStock ? '<p class="stock">Low stock</p>' : ""}
        <a class="order" href="${smsLink(`Hi! I'd like to order: ${p.name}`)}">Text to order</a>
      </article>`).join("") : '<p class="empty">New treasures coming soon — check back!</p>';
  }

  if (select) {
    select.value = grid.dataset.category;
    select.addEventListener("change", () => draw(select.value));
  }
  draw(grid.dataset.category);
}

buildChrome();
renderShop();
