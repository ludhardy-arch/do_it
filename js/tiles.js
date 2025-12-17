import { saveImage, getImage, deleteImage } from "./imageStore.js";
import { state, save, uid } from "./state.js";
import { t } from "./i18n.js";

/* ================= COULEURS CATÉGORIES ================= */

const CATEGORY_COLORS = [
  "rgba(120, 90, 140, 0.25)",
  "rgba(90, 120, 110, 0.25)",
  "rgba(140, 110, 90, 0.25)",
  "rgba(90, 100, 130, 0.25)",
  "rgba(130, 90, 100, 0.25)",
  "rgba(110, 110, 110, 0.25)"
];

/* ================= MODAL STATE ================= */

let currentCatId = null;
let tileType = "text";
let imageData = null;

/* ================= IMAGE CACHE ================= */

const imageUrlCache = Object.create(null);

/* ================= RENDER ================= */

export async function renderTiles() {
  const editBar = document.getElementById("editBar");
  const content = document.getElementById("content");
  if (!editBar || !content) return;

  const scrollY = window.scrollY;

  /* ===== BARRE HAUTE ===== */

  if (state.mode === "edit") {
    editBar.classList.remove("hidden");
    editBar.innerHTML = `
      <div class="row">
        <button class="btn" id="newCatBtn">➕ ${t("newCategory")}</button>
        <button class="btn" id="resetAllBtn">${t("resetAll")}</button>
      </div>
    `;
    document.getElementById("newCatBtn").onclick = openCategoryModal;
    document.getElementById("resetAllBtn").onclick = resetAll;
  }

  else if (state.mode === "sou") {
    editBar.classList.remove("hidden");
    editBar.innerHTML = `
      <div class="row">
        <button class="btn" id="selectAllBtn">😈 give me your worst!</button>
        <button class="btn" id="resetColorsBtn">${t("resetSelection")}</button>
      </div>
    `;

    document.getElementById("selectAllBtn").onclick = async () => {
      selectAllTiles();
      await renderTiles();
    };

    document.getElementById("resetColorsBtn").onclick = async () => {
      resetSelections();
      await renderTiles();
    };
  }

  else {
    editBar.classList.add("hidden");
    editBar.innerHTML = "";
  }

  content.innerHTML = "";

  /* ===== CATEGORIES ===== */

  for (let ci = 0; ci < state.categories.length; ci++) {
    const cat = state.categories[ci];

    const tiles =
      state.mode === "dom"
        ? cat.tiles.filter(tl => state.selected[tl.id])
        : cat.tiles;

    if (!tiles.length && state.mode !== "edit") continue;

    const card = document.createElement("div");
    card.className = "card";

    /* 🌫️ HALO DOUX DE CATÉGORIE */
    if (cat.color) {
      card.style.boxShadow = `
        0 0 30px ${cat.color},
        inset 0 0 40px rgba(0,0,0,0.6)
      `;
    }

    const head = document.createElement("div");
    head.className = "row";
    head.innerHTML = `<b>${cat.name}</b>`;

    if (state.mode === "edit") {
      head.append(
        btn("⬆️", async () => { moveCategory(ci, -1); await renderTiles(); }),
        btn("⬇️", async () => { moveCategory(ci, 1); await renderTiles(); }),
        btn(`➕ ${t("newTile")}`, () => openTileModal(cat.id)),
        btn(`🗑️ ${t("deleteCategory")}`, async () => {
          deleteCategory(cat.id);
          await renderTiles();
        })
      );
    }

    const grid = document.createElement("div");
    grid.className = "grid";

    for (let ti = 0; ti < tiles.length; ti++) {
      const tile = tiles[ti];

      const d = document.createElement("div");
      d.className =
        "tile " +
        (state.mode === "sou"
          ? (state.selected[tile.id] ? "green" : "red")
          : state.mode === "dom"
          ? (state.validated[tile.id] ? "blue done" : "green")
          : "");

      if (state.mode === "edit") {
        const row = document.createElement("div");
        row.className = "row";
        row.append(
          btn("⬆️", async e => { e.stopPropagation(); moveTile(cat.id, ti, -1); await renderTiles(); }),
          btn("⬇️", async e => { e.stopPropagation(); moveTile(cat.id, ti, 1); await renderTiles(); }),
          btn("🗑️", async e => {
            e.stopPropagation();
            await deleteTile(cat.id, ti);
            await renderTiles();
          })
        );
        d.appendChild(row);
      }

      d.onclick = async () => {
        if (state.mode === "sou") {
          state.selected[tile.id] = !state.selected[tile.id];
          if (!state.selected[tile.id]) delete state.validated[tile.id];
        }
        else if (state.mode === "dom") {
          if (state.validated[tile.id]) delete state.validated[tile.id];
          else state.validated[tile.id] = true;
        }
        save();
        await renderTiles();
      };

      /* ===== CONTENU ===== */

      if (tile.type === "image" && tile.imageId) {
        const img = document.createElement("img");

        if (!imageUrlCache[tile.imageId]) {
          const blob = await getImage(tile.imageId);
          if (blob) imageUrlCache[tile.imageId] = URL.createObjectURL(blob);
        }

        img.src = imageUrlCache[tile.imageId];
        d.appendChild(img);
      } else {
        const txt = document.createElement("div");
        txt.textContent = tile.data || "";
        d.appendChild(txt);
      }

      grid.appendChild(d);
    }

    card.append(head, grid);
    content.appendChild(card);
  }

  window.scrollTo(0, scrollY);
}

/* ================= ACTIONS ================= */

function selectAllTiles() {
  state.selected = {};
  for (const cat of state.categories) {
    for (const tile of cat.tiles) {
      state.selected[tile.id] = true;
    }
  }
  save();
}

function resetSelections() {
  state.selected = {};
  state.validated = {};
  save();
}

function resetAll() {
  if (!confirm(t("confirmResetAll"))) return;

  for (const k of Object.keys(imageUrlCache)) {
    URL.revokeObjectURL(imageUrlCache[k]);
    delete imageUrlCache[k];
  }

  localStorage.clear();
  indexedDB.deleteDatabase("tile_images_db");
  location.reload();
}

/* ================= CATÉGORIES ================= */

function openCategoryModal() {
  const root = document.getElementById("modal-root");
  root.innerHTML = `
    <div class="modal">
      <div class="card">
        <h3>${t("newCategory")}</h3>
        <input id="catInput" placeholder="${t("categoryName")}">
        <div class="row">
          <button class="btn" id="createCatBtn">${t("create")}</button>
          <button class="btn" id="cancelCatBtn">${t("cancel")}</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("createCatBtn").onclick = async () => {
    createCategoryFromModal();
    await renderTiles();
  };
  document.getElementById("cancelCatBtn").onclick = closeModal;
}

function createCategoryFromModal() {
  const input = document.getElementById("catInput");
  const name = input.value.trim();
  if (!name) return alert(t("missingCategoryName"));

  state.categories.push({
    id: uid(),
    name,
    color: CATEGORY_COLORS[state.categories.length % CATEGORY_COLORS.length],
    tiles: []
  });

  save();
  closeModal();
}

function moveCategory(i, d) {
  const a = state.categories;
  if (i + d < 0 || i + d >= a.length) return;
  a.splice(i + d, 0, a.splice(i, 1)[0]);
  save();
}

function moveTile(catId, i, d) {
  const c = state.categories.find(x => x.id === catId);
  if (!c || i + d < 0 || i + d >= c.tiles.length) return;
  c.tiles.splice(i + d, 0, c.tiles.splice(i, 1)[0]);
  save();
}

async function deleteTile(catId, index) {
  if (!confirm(t("confirmDeleteTile"))) return;

  const c = state.categories.find(x => x.id === catId);
  const tile = c.tiles[index];

  if (tile?.type === "image" && tile.imageId) {
    await deleteImage(tile.imageId);
    if (imageUrlCache[tile.imageId]) {
      URL.revokeObjectURL(imageUrlCache[tile.imageId]);
      delete imageUrlCache[tile.imageId];
    }
  }

  c.tiles.splice(index, 1);
  save();
}

function deleteCategory(catId) {
  if (!confirm(t("confirmDeleteCategory"))) return;
  state.categories = state.categories.filter(c => c.id !== catId);
  save();
}

/* ================= MODALE VIGNETTE ================= */

function openTileModal(catId) {
  currentCatId = catId;
  tileType = "text";
  imageData = null;

  const root = document.getElementById("modal-root");
  root.innerHTML = `
    <div class="modal">
      <div class="card">
        <h3>${t("newTile")}</h3>
        <div class="row">
          <button class="btn" id="typeText">📝 ${t("text")}</button>
          <button class="btn" id="typeImage">🖼️ ${t("image")}</button>
        </div>
        <div id="textZone">
          <textarea id="tileText" placeholder="${t("tileText")}"></textarea>
        </div>
        <div id="imageZone" class="hidden">
          <button class="btn" id="pickImage">📱 ${t("pickImage")}</button>
        </div>
        <div class="row">
          <button class="btn" id="createTile">${t("create")}</button>
          <button class="btn" id="cancelTile">${t("cancel")}</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("typeText").onclick = () => {
    tileType = "text"; show("textZone"); hide("imageZone");
  };
  document.getElementById("typeImage").onclick = () => {
    tileType = "image"; show("imageZone"); hide("textZone");
  };
  document.getElementById("pickImage").onclick = pickImage;

  document.getElementById("createTile").onclick = async () => {
    await createTile();
    await renderTiles();
  };

  document.getElementById("cancelTile").onclick = closeModal;
}

function pickImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = () => imageData = input.files[0] || null;
  input.click();
}

async function createTile() {
  const cat = state.categories.find(c => c.id === currentCatId);
  if (!cat) return;

  if (tileType === "text") {
    const text = document.getElementById("tileText").value.trim();
    if (!text) return alert(t("missingText"));
    cat.tiles.push({ id: uid(), type: "text", data: text });
  } else {
    if (!imageData) return alert(t("missingImage"));
    const imageId = await saveImage(imageData);
    cat.tiles.push({ id: uid(), type: "image", imageId });
  }

  save();
  closeModal();
}

/* ================= HELPERS ================= */

function closeModal() {
  document.getElementById("modal-root").innerHTML = "";
}

function btn(label, fn) {
  const b = document.createElement("button");
  b.className = "btn";
  b.textContent = label;
  b.onclick = fn;
  return b;
}

function show(id) {
  document.getElementById(id).classList.remove("hidden");
}
function hide(id) {
  document.getElementById(id).classList.add("hidden");
}