import { APP_CONFIG } from "../core/config.js";
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  return response.json();
}
export async function loadCatalog() {
  const catalog = await fetchJson(APP_CONFIG.catalogUrl);
  if (!Array.isArray(catalog.books)) throw new Error("Invalid book catalogue.");
  return catalog;
}
export async function loadBook(book) {
  if (!book?.path) throw new Error("This book's JSON data has not been added yet.");
  const data = await fetchJson(new URL(book.path, document.baseURI).href);
  if (!data || !Array.isArray(data.chapters)) throw new Error(`Invalid JSON structure: ${book.filename}`);
  for (const chapter of data.chapters) {
    if (!Number.isInteger(chapter.number) || !Array.isArray(chapter.verses)) throw new Error(`Invalid chapter in ${book.filename}`);
    if (chapter.verses.some(v => !Number.isInteger(v.number) || typeof v.text !== "string")) throw new Error(`Invalid verse in ${book.filename}`);
  }
  return data;
}
