import { state, currentChapter } from "../core/state.js";
import { $, show, escapeHtml, showToast } from "../core/dom.js";
import { writeStored } from "../core/storage.js";

export const refKey = (bookId, chapter, verse) => `${bookId}:${chapter}:${verse}`;

export function renderChapter() {
  const chapter = currentChapter(); if (!chapter || !state.currentBook) return;
  show($("#welcome-state"), false); show($("#loading-state"), false);
  show($("#error-state"), false); show($("#chapter-view"), true);
  const title = state.currentBook.display_name || state.currentBook.canonical_name;
  $("#chapter-kicker").textContent = "LAISIANGTHO · TEDIM";
  $("#chapter-title").textContent = `${title} ${chapter.number}`;
  $("#chapter-subtitle").textContent = `${chapter.verses.length} verses`;
  $("#breadcrumb").innerHTML = `${escapeHtml(title)} <span>/</span> Chapter ${chapter.number}`;
  $("#reading-position").textContent = `${title} · Chapter ${chapter.number}`;
  const container = $("#verses-container"); container.replaceChildren();
  const headings = Array.isArray(chapter.headings) ? chapter.headings : [];
  const headingMap = new Map();
  headings.forEach(h => { const n = Number(h.before_verse || 1); if (!headingMap.has(n)) headingMap.set(n, []); headingMap.get(n).push(h); });
  for (const verse of chapter.verses) {
    for (const h of headingMap.get(verse.number) || []) addHeading(container, h);
    container.append(createVerse(verse, chapter.number));
  }
  for (const [n, list] of headingMap) if (n > chapter.verses.length) list.forEach(h => addHeading(container, h));
  updateNavigation();
}
function addHeading(container, heading) {
  const h = document.createElement("h2");
  h.className = `scripture-heading level-${Math.min(2, Math.max(1, Number(heading.level) || 1))}`;
  h.textContent = heading.text || ""; container.append(h);
}
function createVerse(verse, chapterNumber) {
  const key = refKey(state.currentBook.id, chapterNumber, verse.number);
  const saved = state.bookmarks.some(x => x.key === key);
  const marked = state.highlights.includes(key);
  const note = state.notes[key];
  const p = document.createElement("p"); p.className = "verse"; p.dataset.reference = key;
  if (saved) p.classList.add("is-bookmarked");
  if (marked) p.classList.add("is-highlighted");
  if (note) p.classList.add("has-note");
  const sup = document.createElement("sup"); sup.className = "verse-number"; sup.textContent = verse.number;
  const text = document.createElement("span"); text.className = "verse-text"; text.textContent = verse.text;
  p.append(sup, text);
  const actions = document.createElement("span"); actions.className = "verse-actions";
  actions.innerHTML = `<button class="verse-action ${saved?"active":""}" data-action="bookmark" aria-label="Bookmark verse">${saved?"Saved":"Save"}</button>
    <button class="verse-action ${note?"active":""}" data-action="note" aria-label="Add note">Note</button>
    <button class="verse-action ${marked?"active":""}" data-action="highlight" aria-label="Highlight verse">Mark</button>
    <button class="verse-action" data-action="copy" aria-label="Copy verse">Copy</button>
    <button class="verse-action" data-action="share" aria-label="Share verse">Share</button>`;
  p.append(actions);
  if (note) { const n = document.createElement("span"); n.className = "verse-note-preview"; n.textContent = `Note: ${note}`; p.append(n); }
  return p;
}
export function updateNavigation() {
  const chapters = state.currentBookData?.chapters || [], i = state.currentChapterIndex;
  $("#previous-chapter").disabled = $("#mobile-prev").disabled = !chapters.length || i <= 0;
  $("#next-chapter").disabled = $("#mobile-next").disabled = !chapters.length || i >= chapters.length - 1;
  $("#chapter-select").disabled = !chapters.length;
  if (chapters.length) $("#chapter-select").value = String(chapters[i].number);
}
export function handleVerseAction(event) {
  const button = event.target.closest("[data-action]"); if (!button) return;
  const el = button.closest(".verse"), key = el?.dataset.reference; if (!key) return;
  const [, ch, vn] = key.split(":");
  const verse = currentChapter().verses.find(v => v.number === Number(vn));
  const reference = `${state.currentBook.display_name} ${ch}:${vn}`;
  const shareText = `${reference} — ${verse.text}`;
  switch (button.dataset.action) {
    case "bookmark": {
      const i = state.bookmarks.findIndex(x => x.key === key);
      if (i >= 0) state.bookmarks.splice(i, 1);
      else state.bookmarks.unshift({ key, bookId: state.currentBook.id, chapter: Number(ch), verse: Number(vn), reference, text: verse.text });
      writeStored("bookmarks", state.bookmarks); renderChapter(); showToast(i >= 0 ? "Bookmark removed" : "Verse bookmarked"); break;
    }
    case "highlight": {
      const i = state.highlights.indexOf(key);
      if (i >= 0) state.highlights.splice(i, 1); else state.highlights.push(key);
      writeStored("highlights", state.highlights); renderChapter(); showToast(i >= 0 ? "Highlight removed" : "Verse highlighted"); break;
    }
    case "note": document.dispatchEvent(new CustomEvent("bible:edit-note", { detail: { key, reference, note: state.notes[key] || "" } })); break;
    case "copy":
      if (navigator.clipboard?.writeText) navigator.clipboard.writeText(shareText).then(() => showToast("Verse copied")).catch(() => showToast("Copy unavailable"));
      else showToast("Copy requires a secure browser connection");
      break;
    case "share":
      if (navigator.share) navigator.share({ title: reference, text: shareText }).catch(() => {});
      else if (navigator.clipboard?.writeText) navigator.clipboard.writeText(shareText).then(() => showToast("Verse copied for sharing"));
      else showToast("Sharing unavailable");
  }
}
