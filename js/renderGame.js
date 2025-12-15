import { state, save, uid } from "./state.js";

export function renderGame() {
  const editBar = document.getElementById("editBar");
  const content = document.getElementById("content");

  editBar.innerHTML = `
    <input id="catName" placeholder="Nom catégorie">
    <button class="btn" id="addCat">Ajouter</button>
  `;

  document.getElementById("addCat").onclick = () => {
    const name = document.getElementById("catName").value.trim();
    if (!name) return;
    state.categories.push({ id: uid(), name, tiles: [] });
    save();
    renderGame();
  };

  content.innerHTML = "";

  state.categories.forEach(cat => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<b>${cat.name}</b>`;
    content.appendChild(card);
  });
}
