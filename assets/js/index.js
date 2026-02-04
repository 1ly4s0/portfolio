const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");
const copyBtn = document.getElementById("copy-email");
const emailValue = document.getElementById("email-value");
const copyTooltip = document.getElementById("copy-email-tooltip");

const setTheme = (theme) => {
  root.classList.remove("dark", "light");
  root.classList.add(theme);
  localStorage.setItem("theme", theme);
  if (toggle) {
    const isDark = theme === "dark";
    toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
    );
  }
};

const storedTheme = localStorage.getItem("theme");
if (storedTheme === "dark" || storedTheme === "light") {
  setTheme(storedTheme);
} else {
  setTheme(root.classList.contains("dark") ? "dark" : "light");
}

if (toggle) {
  toggle.addEventListener("click", () => {
    const isDark = root.classList.contains("dark");
    setTheme(isDark ? "light" : "dark");
  });
}

if (copyBtn && emailValue && copyTooltip) {
  copyBtn.addEventListener("click", async () => {
    const email = emailValue.dataset.email || emailValue.textContent.trim();
    try {
      await navigator.clipboard.writeText(email);
      copyTooltip.textContent = "¡Copiado!";
    } catch (error) {
      copyTooltip.textContent = "No se pudo copiar";
    }

    setTimeout(() => {
      copyTooltip.textContent = "Copiar correo";
    }, 1200);
  });
}
