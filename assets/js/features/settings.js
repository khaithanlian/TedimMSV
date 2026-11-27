import { APP_CONFIG } from "../core/config.js";
import { state } from "../core/state.js";
import { readStored, writeStored } from "../core/storage.js";
import { $, showToast } from "../core/dom.js";
export function initSettings() {
  state.settings = { ...state.settings, ...readStored("settings", {}) };
  apply();
  $("#font-decrease").addEventListener("click", () => changeFont(-1));
  $("#font-increase").addEventListener("click", () => changeFont(1));
  $("#theme-select").addEventListener("change", e => { state.settings.theme = e.target.value; save(); apply(); });
  $("#settings-toggle").addEventListener("click", () => $("#settings-dialog").showModal());
  $("#mobile-settings").addEventListener("click", () => $("#settings-dialog").showModal());
}
function changeFont(delta) {
  state.settings.fontSize = Math.max(APP_CONFIG.minFontSize, Math.min(APP_CONFIG.maxFontSize, state.settings.fontSize + delta));
  save(); apply();
}
function save() { writeStored("settings", state.settings); }
function apply() {
  document.documentElement.style.setProperty("--reader-font-size", `${state.settings.fontSize}px`);
  document.documentElement.dataset.theme = state.settings.theme;
  $("#font-size-value").textContent = `${state.settings.fontSize} px`;
  $("#theme-select").value = state.settings.theme;
}
