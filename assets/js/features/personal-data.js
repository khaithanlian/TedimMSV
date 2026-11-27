import { state } from "../core/state.js";
import { $, showToast } from "../core/dom.js";
import { readStored, writeStored } from "../core/storage.js";
import { renderChapter } from "./reader.js";
export function initPersonalData() {
  state.bookmarks=readStored("bookmarks",[]); state.notes=readStored("notes",{}); state.highlights=readStored("highlights",[]);
  $("#bookmarks-toggle").addEventListener("click",openBookmarks);
  document.addEventListener("bible:edit-note",e=>{
    $("#note-dialog").dataset.reference=e.detail.key; $("#note-reference").textContent=e.detail.reference;
    $("#note-text").value=e.detail.note; $("#note-dialog").showModal(); $("#note-text").focus();
  });
  $("#note-form").addEventListener("submit",e=>{
    if(e.submitter?.id!=="note-save")return; e.preventDefault();
    const key=$("#note-dialog").dataset.reference, value=$("#note-text").value.trim();
    if(value)state.notes[key]=value;else delete state.notes[key];
    writeStored("notes",state.notes); $("#note-dialog").close(); renderChapter(); showToast(value?"Note saved on this device":"Note removed");
  });
  document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>document.getElementById(b.dataset.close).close()));
}
function openBookmarks() {
  const list=$("#saved-list"); list.replaceChildren();
  if(!state.bookmarks.length){list.innerHTML='<p class="empty-note">No saved verses yet. Use “Save” beside a verse while reading.</p>';}
  for(const entry of state.bookmarks){
    const b=document.createElement("button");b.className="saved-item";
    const strong=document.createElement("strong");strong.textContent=entry.reference;
    const span=document.createElement("span");span.textContent=entry.text;b.append(strong,span);
    b.addEventListener("click",async()=>{
      const book=state.catalog.books.find(x=>x.id===entry.bookId);if(!book)return;
      const {selectBook}=await import("./navigation.js");await selectBook(book.id,entry.chapter);
      $("#bookmarks-dialog").close();setTimeout(()=>document.querySelector(`[data-reference="${entry.key}"]`)?.scrollIntoView({behavior:"smooth",block:"center"}),80);
    });list.append(b);
  }
  $("#bookmarks-dialog").showModal();
}
