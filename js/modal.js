import { saveState } from "./state.js";
import { uid, move } from "./utils.js";

export function addCategory(state, name){
  state.categories.push({ id: uid(), name, tiles: [] });
  saveState(state);
}

export function moveCat(state, i, d){
  move(state.categories, i, i + d);
  saveState(state);
}

export function moveTile(state, cid, i, d){
  const c = state.categories.find(x => x.id === cid);
  if(!c) return;
  move(c.tiles, i, i + d);
  saveState(state);
}

export function toggleSelect(state, tileId){
  state.selected[tileId] = !state.selected[tileId];
  if(!state.selected[tileId]) delete state.validated[tileId];
  saveState(state);
}

export function validateTile(state, tileId){
  state.validated[tileId] = true;
  saveState(state);
}

export function addTile(state, catId, tile){
  const c = state.categories.find(x => x.id === catId);
  if(!c) return;
  c.tiles.push(tile);
  saveState(state);
}

export function setNamesAndStart(state, souName, domName){
  state.names.sou = souName;
  state.names.dom = domName;
  state.mode = "sou";
  state.screen = "app";
  saveState(state);
}
