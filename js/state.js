const STORAGE = "APP_STRUCTURED_OK";

export const state = JSON.parse(localStorage.getItem(STORAGE)) || {
  screen: "home",        // home | game
  mode: "edit",
  lang: "fr",            // fr | en | de   ✅ AJOUT
  names: { sou: "", dom: "" },
  categories: [],
  selected: {},
  validated: {}
};

export function save() {
  localStorage.setItem(STORAGE, JSON.stringify(state));
}

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}
