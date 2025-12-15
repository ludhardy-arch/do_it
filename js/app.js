import { state, save } from "./state.js";
import { renderGame } from "./renderGame.js";

export function renderApp() {
  const root = document.getElementById("home");
  const app = document.getElementById("app");

  root.classList.add("hidden");
  app.classList.remove("hidden");

  app.innerHTML = `
    <div id="editBar" class="card"></div>
    <div id="content"></div>
  `;

  renderGame();
}
