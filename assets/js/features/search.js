import { state } from "../core/state.js";
import { $, show, escapeHtml } from "../core/dom.js";
import { selectChapter } from "./navigation.js";
export function initSearch() {
  $("#search-toggle").addEventListener("click",()=>{show($("#search-panel"),true);$("#search-input").focus();});
  $("#search-close").addEventListener("click",()=>show($("#search-panel"),false));
  $("#search-input").addEventListener("input",search);
}
function search() {
  const q=$("#search-input").value.trim().toLocaleLowerCase(), out=$("#search-results"); out.replaceChildren();
  if(q.length<2){$("#search-hint").textContent="Enter at least two characters. Searches the selected book.";return;}
  if(!state.currentBookData){$("#search-hint").textContent="Select a book before searching.";return;}
  const matches=[];
  for(const ch of state.currentBookData.chapters){for(const v of ch.verses){if(v.text.toLocaleLowerCase().includes(q)){matches.push({chapter:ch.number,verse:v.number,text:v.text});if(matches.length>=80)break;}}if(matches.length>=80)break;}
  $("#search-hint").textContent=`${matches.length}${matches.length===80?"+":""} result(s) in ${state.currentBook.display_name}.`;
  for(const m of matches){const b=document.createElement("button");b.className="search-result";b.innerHTML=`<strong>${escapeHtml(state.currentBook.display_name)} ${m.chapter}:${m.verse}</strong><span>${escapeHtml(m.text)}</span>`;
    b.addEventListener("click",()=>{selectChapter(m.chapter);setTimeout(()=>document.querySelector(`[data-reference="${state.currentBook.id}:${m.chapter}:${m.verse}"]`)?.scrollIntoView({behavior:"smooth",block:"center"}),60);show($("#search-panel"),false);});out.append(b);}
  if(!matches.length)out.innerHTML='<p class="empty-note">No matching verses found in this book.</p>';
}
