import { state } from "./state.js";
import { renderHome } from "./home.js";
import { renderGame } from "./game.js";

/* ================= ROUTER ================= */

export function render() {
  if (state.screen === "home") {
    renderHome();
  } else {
    renderGame();
  }
}

/* ================= FORCE RE-RENDER ================= */
/* utile pour i18n (changement de langue) */
export function rerender() {
  render();
}
