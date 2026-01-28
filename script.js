// script.js
(function () {
  // ====== CONFIGS ======
  // Defina aqui a duração da oferta a partir do primeiro acesso (em minutos)
  const OFFER_MINUTES = 30;

  // ====== Menu mobile ======
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      const open = mobileNav.style.display === "block";
      mobileNav.style.display = open ? "none" : "block";
      hamburger.setAttribute("aria-expanded", String(!open));
    });

    mobileNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        mobileNav.style.display = "none";
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ====== Ano ======
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // ====== Countdown (persistente por navegador) ======
  const key = "offerEndTs_pack12000";
  let endTs = Number(localStorage.getItem(key) || 0);

  if (!endTs || endTs < Date.now()) {
    endTs = Date.now() + OFFER_MINUTES * 60 * 1000;
    localStorage.setItem(key, String(endTs));
  }

  const pad = (n) => String(n).padStart(2, "0");

  function setCountdown(h, m, s) {
    const el = (id) => document.getElementById(id);

    const h1 = el("cd_h"), m1 = el("cd_m"), s1 = el("cd_s");
    if (h1 && m1 && s1) { h1.textContent = h; m1.textContent = m; s1.textContent = s; }

    const h2 = el("cd2_h"), m2 = el("cd2_m"), s2 = el("cd2_s");
    if (h2 && m2 && s2) { h2.textContent = h; m2.textContent = m; s2.textContent = s; }
  }

  function tick() {
    const diff = Math.max(0, endTs - Date.now());
    const totalSeconds = Math.floor(diff / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setCountdown(pad(hours), pad(minutes), pad(seconds));

    // Quando acabar, você pode alterar a mensagem ou esconder o preço promocional (opcional)
    if (diff <= 0) {
      // reinicia automaticamente (opcional). Se não quiser, comente as 2 linhas abaixo:
      endTs = Date.now() + OFFER_MINUTES * 60 * 1000;
      localStorage.setItem(key, String(endTs));
    }
  }

  tick();
  setInterval(tick, 1000);

  // ====== Botões "comprar" rolam até oferta se não tiver link ======
  document.querySelectorAll(".js-buy").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const href = btn.getAttribute("href") || "";
      const isCheckout = href.startsWith("http") || href.includes("SEU_LINK_DO_CHECKOUT_AQUI");

      // Se estiver apontando para âncora, só rola normal
      if (!isCheckout && href.startsWith("#")) return;

      // Se ainda está com placeholder, leva para a seção oferta para você colar o link
      if (href.includes("SEU_LINK_DO_CHECKOUT_AQUI")) {
        e.preventDefault();
        document.querySelector("#oferta")?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
})();
