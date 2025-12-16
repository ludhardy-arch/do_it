import { state, save } from "./state.js";
import { render } from "./router.js";
import { t } from "./i18n.js";

/* ================= RENDER HOME ================= */
export function renderHome() {
  const header = document.getElementById("header");
  const home   = document.getElementById("home");
  const game   = document.getElementById("game");

  if (!header || !home || !game) return;

  /* ===== VISIBILITÉ ===== */
  header.classList.add("hidden");
  game.classList.add("hidden");
  home.classList.remove("hidden");

  /* ===== CONTENU ===== */
  home.innerHTML = `
    <div class="card">
      <h2>${t("homeTitle")}</h2>

      <input
        id="nameSou"
        placeholder="${t("sou")}"
        value="${state.names.sou}"
      >

      <input
        id="nameDom"
        placeholder="${t("dom")}"
        value="${state.names.dom}"
      >

      <button class="btn" id="start">
        ${t("start")}
      </button>
    </div>
  `;

  /* ===== ACTION ===== */
  document.getElementById("start").onclick = () => {
    const s = document.getElementById("nameSou").value.trim();
    const d = document.getElementById("nameDom").value.trim();

    if (!s || !d) return;

    state.names.sou = s;
    state.names.dom = d;
    state.mode = "sou";
    state.screen = "game";

    save();
    render();
  };
}