import { state, save } from "./state.js";
import { render } from "./router.js";

/* ================= INIT ================= */

function initLangSelector() {
  const langSelect = document.getElementById("langSelect");
  if (!langSelect) return;

  // valeur initiale
  langSelect.value = state.lang;

  langSelect.onchange = () => {
    state.lang = langSelect.value;
    save();
    render(); // 🔁 re-render HOME ou GAME
  };
}

/* ================= START ================= */

initLangSelector();
render();
