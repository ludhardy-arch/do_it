import { state } from "./state.js";

export const I18N = {
  fr: {
    /* ===== GLOBAL ===== */
    edit: "créer tes punitions",
    sou: "Sub",
    dom: "DOM",

    /* ===== HOME ===== */
    homeTitle: "Accueil",
    nameSou: "sub",
    nameDom: "dom",
    start: "Commencer",

    /* ===== CATEGORIES ===== */
    newCategory: "Nouvelle catégorie",
    categoryName: "Nom de la catégorie",
    deleteCategory: "Supprimer catégorie",
    missingCategoryName: "Nom de catégorie requis",

    /* ===== TILES ===== */
    newTile: "Nouvelle punition",
    text: "Texte",
    image: "Image",
    tileText: "Texte",
    pickImage: "Choisir une image",

    /* ===== ACTIONS ===== */
    create: "Créer",
    cancel: "Annuler",
    resetAll: "RESET TOTAL",
    resetSelection: "Réinitialiser les sélections",

    /* ===== MESSAGES ===== */
    missingText: "Texte requis",
    missingImage: "Image requise",

    confirmDeleteTile: "Supprimer cette punition ?",
    confirmDeleteCategory: "Supprimer cette catégorie et toutes ses vignettes ?",
    confirmResetAll:
      "RESET TOTAL\n\nToutes les données seront supprimées.\n\nContinuer ?"
  },

  en: {
    /* ===== GLOBAL ===== */
    edit: "create your punishments",
    sou: "SUB",
    dom: "DOM",

    /* ===== HOME ===== */
    homeTitle: "Home",
    nameSou: "sub",
    nameDom: "dom",
    start: "Start",

    /* ===== CATEGORIES ===== */
    newCategory: "New category",
    categoryName: "Category name",
    deleteCategory: "Delete category",
    missingCategoryName: "Category name required",

    /* ===== TILES ===== */
    newTile: "New punishment",
    text: "Text",
    image: "Image",
    tileText: "Text",
    pickImage: "Choose image",

    /* ===== ACTIONS ===== */
    create: "Create",
    cancel: "Cancel",
    resetAll: "FULL RESET",
    resetSelection: "Reset selections",

    /* ===== MESSAGES ===== */
    missingText: "Text required",
    missingImage: "Image required",

    confirmDeleteTile: "Delete this punishment?",
    confirmDeleteCategory: "Delete this category and all its tiles?",
    confirmResetAll:
      "FULL RESET\n\nAll data will be deleted.\n\nContinue?"
  },

  de: {
    /* ===== GLOBAL ===== */
    edit: "erstelle deine strafen",
    sou: "SUB",
    dom: "DOM",

    /* ===== HOME ===== */
    homeTitle: "Start",
    nameSou: "Name 1",
    nameDom: "Name 2",
    start: "Starten",

    /* ===== CATEGORIES ===== */
    newCategory: "Neue Kategorie",
    categoryName: "Kategoriename",
    deleteCategory: "Kategorie löschen",
    missingCategoryName: "Kategoriename erforderlich",

    /* ===== TILES ===== */
    newTile: "Neue bestrafung",
    text: "Text",
    image: "Bild",
    tileText: "Text",
    pickImage: "Bild auswählen",

    /* ===== ACTIONS ===== */
    create: "Erstellen",
    cancel: "Abbrechen",
    resetAll: "Komplett zurückgesetzt",
    resetSelection: "Auswahl zurücksetzen",

    /* ===== MESSAGES ===== */
    missingText: "Text erforderlich",
    missingImage: "Bild erforderlich",

    confirmDeleteTile: "Diese strafe aufeheben?",
    confirmDeleteCategory:
      "Diese Kategorie und alle Kacheln löschen?",
    confirmResetAll:
      "TOTAL RESET\n\nAlle Daten werden gelöscht.\n\nFortfahren?"
  }
};

/* ================= TRANSLATE ================= */

export function t(key) {
  return I18N[state.lang]?.[key] || key;
}
