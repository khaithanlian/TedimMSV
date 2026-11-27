import { state } from "../core/state.js";
import { $, show, escapeHtml, showToast } from "../core/dom.js";
import { loadBook } from "../data/repository.js";
import { renderChapter } from "./reader.js";

export function initNavigation() {
  $("#book-select").addEventListener("change", e => selectBook(e.target.value));
  $("#chapter-select").addEventListener("change", e => selectChapter(Number(e.target.value)));
  $("#previous-chapter").addEventListener("click", () => moveChapter(-1));
  $("#next-chapter").addEventListener("click", () => moveChapter(1));
  $("#mobile-prev").addEventListener("click", () => moveChapter(-1));
  $("#mobile-next").addEventListener("click", () => moveChapter(1));
  $("#mobile-books").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("mobile-open"));
  let sx=0, sy=0;
  $("#reader-content").addEventListener("touchstart", e => { sx=e.changedTouches[0].clientX; sy=e.changedTouches[0].clientY; }, {passive:true});
  $("#reader-content").addEventListener("touchend", e => {
    const dx=e.changedTouches[0].clientX-sx, dy=e.changedTouches[0].clientY-sy;
    if (Math.abs(dx)>75 && Math.abs(dx)>Math.abs(dy)*1.3) moveChapter(dx<0?1:-1);
  }, {passive:true});
}
export function populateBookSelect(catalog) {
  const select=$("#book-select"); select.replaceChildren();
  const old=document.createElement("optgroup"), neo=document.createElement("optgroup");
  old.label="Old Testament"; neo.label="New Testament";
  for (const book of catalog.books) {
    const option=document.createElement("option"); option.value=book.id;
    option.textContent=`${String(book.order).padStart(2,"0")} · ${book.display_name}${book.available?"":" — text not added"}`;
    option.disabled=!book.available; (book.order<=39?old:neo).append(option);
  }
  select.append(old,neo);
}
export async function selectBook(id, chapterNumber=1) {
  const book=state.catalog.books.find(b=>b.id===id); if (!book) return;
  if (!book.available) { showToast(`${book.display_name}: text has not been added`); return; }
  show($("#welcome-state"),false); show($("#chapter-view"),false); show($("#error-state"),false); show($("#loading-state"),true);
  $("#book-select").value=book.id;
  try {
    const data=await loadBook(book);
    state.currentBook=book; state.currentBookData=data;
    const idx=data.chapters.findIndex(c=>c.number===chapterNumber); state.currentChapterIndex=idx>=0?idx:0;
    $("#chapter-select").innerHTML=data.chapters.map(c=>`<option value="${c.number}">Chapter ${c.number}</option>`).join("");
    renderChapter();
    if (navigator.serviceWorker?.controller) navigator.serviceWorker.controller.postMessage({type:"CACHE_URL",url:book.path});
    if (innerWidth<=800) document.querySelector(".sidebar").classList.remove("mobile-open");
  } catch (error) {
    show($("#loading-state"),false); show($("#error-state"),true);
    $("#error-state").innerHTML=`<strong>Unable to load this book</strong>${escapeHtml(error.message)}<br><br>Check that the file exists at <code>${escapeHtml(book.path)}</code> and that its filename matches exactly.`;
    console.error("[Laisiangtho] Book load failed:",error);
  }
}
export function selectChapter(number) {
  const i=state.currentBookData?.chapters.findIndex(c=>c.number===number) ?? -1;
  if (i<0) return; state.currentChapterIndex=i; renderChapter(); window.scrollTo({top:0,behavior:"smooth"});
}
export function moveChapter(delta) {
  const i=state.currentChapterIndex+delta, chapters=state.currentBookData?.chapters||[];
  if (i<0||i>=chapters.length) return; state.currentChapterIndex=i; renderChapter(); window.scrollTo({top:0,behavior:"smooth"});
}
