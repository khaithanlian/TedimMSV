import { $ } from "./core/dom.js";
import { state } from "./core/state.js";
import { loadCatalog } from "./data/repository.js";
import { initSettings } from "./features/settings.js";
import { initNavigation, populateBookSelect, selectBook } from "./features/navigation.js";
import { initSearch } from "./features/search.js";
import { initPersonalData } from "./features/personal-data.js";
import { handleVerseAction } from "./features/reader.js";

async function start() {
  initSettings(); initNavigation(); initSearch(); initPersonalData();
  $("#verses-container").addEventListener("click",handleVerseAction);
  try {
    state.catalog=await loadCatalog(); populateBookSelect(state.catalog);
    const count=state.catalog.books.filter(b=>b.available).length;
    $("#library-status").textContent=`${count} of 66 books have text`;
    const first=state.catalog.books.find(b=>b.available); if(first)await selectBook(first.id);
  } catch(error) {
    console.error("[Laisiangtho] Startup failed:",error);
    $("#library-status").textContent="Catalogue unavailable";
    $("#welcome-state").hidden=true;$("#error-state").hidden=false;
    $("#error-state").textContent=`Unable to load data/books.json. ${error.message}`;
  }
}
if("serviceWorker" in navigator && location.protocol!=="file:") {
  window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(e=>console.warn("Offline support unavailable:",e)));
}
start();
