import { APP_CONFIG } from "./config.js";
const key = (name) => `${APP_CONFIG.storagePrefix}.${name}`;
export function readStored(name, fallback) {
  try { const value = localStorage.getItem(key(name)); return value === null ? fallback : JSON.parse(value); }
  catch { return fallback; }
}
export function writeStored(name, value) {
  try { localStorage.setItem(key(name), JSON.stringify(value)); return true; }
  catch { return false; }
}
