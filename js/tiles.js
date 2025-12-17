import { saveImage, getImage, deleteImage } from "./imageStore.js";
import { state, save, uid } from "./state.js";
import { t } from "./i18n.js";

/* ===== COULEURS CATÉGORIES ===== */
const CATEGORY_COLORS = [
  "rgba(120,90,140,.35)",
  "rgba(90,120,110,.35)",
  "rgba(140,110,90,.35)",
  "rgba(90,100,130,.35)",
  "rgba(130,90,100,.35)",
  "rgba(110,110,110,.35)"
];

let currentCatId = null;
let tileType = "text";
let imageData = null;

const imageUrlCache = Object.create(null);

/* ================= RENDER ================= */
export async function renderTiles() {
  const editBar = document.getElementById("editBar");
  const content = document.getElementById("content");
  if (!editBar || !content) return;

  /* ===== BARRE ===== */
  if (state.mode === "edit") {
    editBar.innerHTML = `
      <div class="row">
        <button class="btn" id="newCatBtn">➕ ${t("newCategory")}</button>
      </div>
    `;
    document.getElementById("newCatBtn").onclick = openCategoryModal;
  } else {
    editBar.innerHTML = "";
  }

  content.innerHTML = "";

  /* ===== CATÉGORIES ===== */
  state.categories.forEach((cat, ci) => {

    // 🔥 ASSIGNE COULEUR SI ABSENTE
    if (!cat.color) {
      cat.color = CATEGORY_COLORS[ci % CATEGORY_COLORS.length];
      save();
    }

    const card = document.createElement("div");
    card.className = "card";

    // 🔥 HALO
    card.style.setProperty("--cat-halo", cat.color);

    const head = document.createElement("b");
    head.textContent = cat.name;
    card.appendChild(head);

    const grid = document.createElement("div");
    grid.className = "grid";

    cat.tiles.forEach(tile => {
      const d = document.createElement("div");
      d.className = "tile green";

      if (tile.type === "image" && tile.imageId) {
        const img = document.createElement("img");
        if (!imageUrlCache[tile.imageId]) {
          getImage(tile.imageId).then(blob => {
            imageUrlCache[tile.imageId] = URL.createObjectURL(blob);
            img.src = imageUrlCache[tile.imageId];
          });
        } else {
          img.src = imageUrlCache[tile.imageId];
        }
        d.appendChild(img);
      } else {
        const txt = document.createElement("div");
        txt.textContent = tile.data;
        d.appendChild(txt);
      }

      grid.appendChild(d);
    });

    card.appendChild(grid);
    content.appendChild(card);
  });
}

/* ================= CATÉGORIES ================= */

function openCategoryModal() {
  const root = document.getElementById("modal-root");
  root.innerHTML = `
    <div class="modal">
      <div class="card">
        <h3>${t("newCategory")}</h3>
        <input id="catInput">
        <button class="btn" id="createCatBtn">${t("create")}</button>
      </div>
    </div>
  `;
  document.getElementById("createCatBtn").onclick = createCategory;
}

function createCategory() {
  const name = document.getElementById("catInput").value.trim();
  if (!name) return;

  state.categories.push({
    id: uid(),
    name,
    color: CATEGORY_COLORS[state.categories.length % CATEGORY_COLORS.length],
    tiles: []
  });

  save();
  document.getElementById("modal-root").innerHTML = "";
  renderTiles();
}