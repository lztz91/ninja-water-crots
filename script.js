const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

// ── Toujours démarrer en haut de page au chargement/rafraîchissement ──
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual"
}
window.addEventListener("load", () => window.scrollTo(0, 0))

// ── Splash Screen ──
const splashScreen = document.getElementById("splashScreen")
if (splashScreen) {
  setTimeout(() => {
    splashScreen.classList.add("hidden")
    setTimeout(() => splashScreen.remove(), 700)
  }, reduced ? 250 : 900)
}

// ── Mobile Menu ──
const menuBtn = document.getElementById("menuBtn")
const navSidebar = document.getElementById("mainNav")
const navClose = document.getElementById("navClose")
const navOverlay = document.getElementById("navOverlay")

const closeNav = () => {
  navSidebar?.classList.remove("open")
  navOverlay?.classList.remove("open")
  menuBtn?.setAttribute("aria-expanded", "false")
}

const openNav = () => {
  navSidebar?.classList.add("open")
  navOverlay?.classList.add("open")
  menuBtn?.setAttribute("aria-expanded", "true")
}

if (menuBtn && navSidebar) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navSidebar.classList.contains("open")
    isOpen ? closeNav() : openNav()
  })

  navClose?.addEventListener("click", closeNav)
  navOverlay?.addEventListener("click", closeNav)

  navSidebar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeNav)
  })
}

// ── Topbar scroll shadow ──
const topbar = document.querySelector(".topbar")
if (topbar) {
  window.addEventListener("scroll", () => {
    topbar.style.boxShadow = window.scrollY > 20
      ? "0 4px 24px rgba(14, 165, 233, 0.14)"
      : "none"
  }, { passive: true })
}

// ── Scroll reveal (IntersectionObserver) ──
if (!reduced) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("reveal"), i * 90)
        obs.unobserve(entry.target)
      }
    })
  }, { threshold: 0.15 })

  document.querySelectorAll(".js-reveal").forEach(el => observer.observe(el))
} else {
  document.querySelectorAll(".js-reveal").forEach(el => el.classList.add("reveal"))
}

// ── Tarif Data ──
const tarifData = {
  simple: {
    title: "Journée Simple — 18€",
    description: "La formule pour venir relever le défi sur une journée, à partir de 7 ans.",
    points: [
      "Accès au parcours Ninja (12 obstacles, 300 m²)",
      "Gilet de sauvetage et casque fournis",
      "Une sortie définitive : on profite puis on quitte le parc",
      "Accessible même aux non-nageurs",
    ],
  },
  liberte: {
    title: "Pass Liberté — 22€",
    description: "La formule liberté : entrez et sortez du parc autant de fois que vous voulez dans la journée.",
    points: [
      "Entrées et sorties illimitées toute la journée",
      "Idéal pour alterner défis, baignade, pause repas et détente",
      "Gilet de sauvetage et casque fournis",
      "À partir de 7 ans / adulte",
    ],
  },
  enfants: {
    title: "Enfants -7 ans — 8€",
    description: "Un espace aquatique ludique pensé pour les plus petits, pour qu'ils s'amusent en toute sécurité.",
    points: [
      "Accès 2h à l'espace aquatique ludique",
      "Réservé aux enfants de moins de 7 ans",
      "Équipement de sécurité fourni",
      "Sous la surveillance d'un adulte accompagnant",
    ],
  },
}

const tarifButtons   = Array.from(document.querySelectorAll(".tarif-card"))
const tarifDetailsEl = document.getElementById("tarif-details-content")

const renderTarifDetails = (plan) => {
  const content = tarifData[plan]
  if (!content || !tarifDetailsEl) return

  tarifDetailsEl.innerHTML = `
    <h3>${content.title}</h3>
    <p>${content.description}</p>
    <ul class="detail-list">
      ${content.points.map(p => `<li>${p}</li>`).join("")}
    </ul>
  `
  tarifDetailsEl.classList.remove("reveal")
  requestAnimationFrame(() => tarifDetailsEl.classList.add("reveal"))
}

tarifButtons.forEach(button => {
  button.addEventListener("click", () => {
    tarifButtons.forEach(item => {
      item.classList.toggle("is-active", item === button)
      item.setAttribute("aria-selected", String(item === button))
    })
    renderTarifDetails(button.dataset.plan)
  })
})

// ── Footer Year ──
const yearEl = document.getElementById("year")
if (yearEl) yearEl.textContent = new Date().getFullYear()
