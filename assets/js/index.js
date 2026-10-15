const root = document.documentElement;
const themeButton = document.querySelector("#theme-toggle");
function updateThemeButton() {
  const isLight = root.dataset.theme === "light";
  themeButton.setAttribute(
    "aria-label",
    isLight ? "Cambiar a tema oscuro" : "Cambiar a tema claro",
  );
  themeButton.setAttribute("aria-pressed", String(isLight));
  themeButton.firstElementChild.textContent = isLight ? "☾" : "☼";
}
updateThemeButton();
themeButton.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  try {
    localStorage.setItem("portfolio-theme", root.dataset.theme);
  } catch {}
  updateThemeButton();
});
const filters = document.querySelector(".filters");
const projects = [...document.querySelectorAll(".project")];
filters.hidden = false;
const projectGrid = document.querySelector(".project-grid");
let filterVersion = 0;
const filterAnimations = new Set();
filters.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-filter]");
  if (!button || button.getAttribute("aria-pressed") === "true") return;
  const version = ++filterVersion;
  filterAnimations.forEach((animation) => animation.cancel());
  filterAnimations.clear();
  filters
    .querySelectorAll("button")
    .forEach((item) =>
      item.setAttribute("aria-pressed", String(item === button)),
    );
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animate = (element, frames, options) => {
    const animation = element.animate(frames, options);
    filterAnimations.add(animation);
    animation.finished
      .finally(() => filterAnimations.delete(animation))
      .catch(() => {});
    return animation;
  };
  if (!reduced) {
    const exit = animate(
      projectGrid,
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: "translateY(10px)" },
      ],
      { duration: 140, easing: "ease-in", fill: "forwards" },
    );
    await exit.finished.catch(() => {});
    if (version !== filterVersion) return;
    exit.cancel();
  }
  projects.forEach((project) => {
    project.hidden =
      button.dataset.filter !== "all" &&
      project.dataset.category !== button.dataset.filter;
    if (!project.hidden) project.classList.add("is-visible");
  });
  const visible = projects.filter((project) => !project.hidden);
  document.querySelector("#filter-status").textContent =
    `${visible.length} ${visible.length === 1 ? "proyecto" : "proyectos"}`;
  if (!reduced)
    visible.forEach((project, index) =>
      animate(
        project,
        [
          { opacity: 0, translate: "0 24px" },
          { opacity: 1, translate: "0 0" },
        ],
        {
          duration: 420,
          delay: index * 65,
          easing: "cubic-bezier(.2,.7,.3,1)",
          fill: "backwards",
        },
      ),
    );
});
let copyTimer;
document.querySelector("#copy-email").addEventListener("click", async () => {
  const status = document.querySelector("#copy-status");
  clearTimeout(copyTimer);
  try {
    await navigator.clipboard.writeText("contacto@tecnobros.es");
    status.textContent = "Correo copiado. ¡Hablamos pronto!";
  } catch {
    status.textContent =
      "No se pudo copiar. Puedes seleccionar el correo o pulsarlo para escribir.";
  }
  copyTimer = setTimeout(() => {
    status.textContent = "";
  }, 5000);
});
if ("IntersectionObserver" in window) {
  const navLinks = [...document.querySelectorAll(".header nav a")];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          if (link.hash === `#${entry.target.id}`)
            link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    },
    { rootMargin: "-15% 0px -55% 0px" },
  );
  document
    .querySelectorAll("main section[id]")
    .forEach((section) => observer.observe(section));
}

// Reveal each piece once; keep content readable when motion is disabled.
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && !motionPreference.matches) {
  const targets = document.querySelectorAll(
    ".about-grid, .section-title, .project, .other-projects, .workbench, .social-links a, .module, .contact .wrap",
  );
  targets.forEach((element, index) => {
    element.dataset.reveal = "";
    element.style.setProperty("--reveal-delay", `${(index % 2) * 70}ms`);
  });
  root.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.05 },
  );
  targets.forEach((element) => revealObserver.observe(element));
  motionPreference.addEventListener("change", (event) => {
    if (event.matches) root.classList.remove("motion-ready");
  });
}
// A small perspective response on pointer devices, with no scroll listeners.
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".project-image").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (motionPreference.matches) return;
      const bounds = card.getBoundingClientRect();
      card.style.setProperty(
        "--tilt-x",
        `${(0.5 - (event.clientY - bounds.top) / bounds.height) * 4}deg`,
      );
      card.style.setProperty(
        "--tilt-y",
        `${((event.clientX - bounds.left) / bounds.width - 0.5) * 4}deg`,
      );
    });
    card.addEventListener("pointerleave", () => {
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
  });
}

// Animate the native details height in both directions, including rapid toggles.
document.querySelectorAll(".capabilities details").forEach((details) => {
  const summary = details.querySelector("summary");
  let transition;
  let expanded = details.open;
  summary.addEventListener("click", (event) => {
    if (motionPreference.matches) return;
    event.preventDefault();
    const startHeight = details.getBoundingClientRect().height;
    transition?.cancel();
    expanded = !expanded;
    details.open = true;
    details.style.overflow = "hidden";
    details.style.height = "auto";
    const endHeight = expanded
      ? details.getBoundingClientRect().height
      : summary.getBoundingClientRect().height;
    details.classList.toggle("is-closing", !expanded);
    transition = details.animate(
      [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
      { duration: 360, easing: "cubic-bezier(.22,.75,.25,1)" },
    );
    transition.onfinish = () => {
      details.open = expanded;
      details.style.removeProperty("height");
      details.style.removeProperty("overflow");
      details.classList.remove("is-closing");
      transition = undefined;
    };
  });
});
