import { state, save } from "./state.js";
import { renderTiles } from "./tiles.js";
import { t } from "./i18n.js";

/* ================= RENDER GAME ================= */
export function renderGame() {
  const header = document.getElementById("header");
  const home   = document.getElementById("home");
  const game   = document.getElementById("game");

  if (!header || !home || !game) return;

  /* ===== VISIBILITÉ ===== */
  header.classList.remove("hidden");
  home.classList.add("hidden");
  game.classList.remove("hidden");

  /* ===== TITRE (NON TRADUIT) ===== */
  const title = document.getElementById("appTitle");
  if (title) title.textContent = "DO IT";

  /* ===== BOUTONS HEADER ===== */
  const btnEdit = document.querySelector('[data-mode="edit"]');
  const btnSou  = document.querySelector('[data-mode="sou"]');
  const btnDom  = document.querySelector('[data-mode="dom"]');

  if (!btnEdit || !btnSou || !btnDom) return;

  btnEdit.textContent = t("edit");
  btnSou.textContent  = state.names.sou || t("sou");
  btnDom.textContent  = state.names.dom || t("dom");

  [btnEdit, btnSou, btnDom].forEach(btn => {
    btn.onclick = async () => {
      state.mode = btn.dataset.mode;
      save();
      updateModeButtons();
      await renderTiles();
    };
  });

  updateModeButtons();

  /* ===== STRUCTURE JEU ===== */
  game.innerHTML = `
    <div id="editBar" class="card"></div>
    <div id="content"></div>
  `;

  /* ===== LANGUE (CE QUI MANQUAIT) ===== */
  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    langSelect.value = state.lang;

    langSelect.onchange = () => {
      state.lang = langSelect.value;
      save();
      renderGame(); // 🔁 RE-RENDER OBLIGATOIRE
    };
  }

  /* ===== RENDU ===== */
  renderTiles();
}

/* ================= UI HELPERS ================= */

function updateModeButtons() {
  document.querySelectorAll("[data-mode]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mode === state.mode);
  });
}
