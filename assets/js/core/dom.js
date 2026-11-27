export const $ = (selector, scope = document) => scope.querySelector(selector);
export function show(element, visible = true) { if (element) element.hidden = !visible; }
export function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
export function showToast(message) {
  const el = $("#toast"); if (!el) return;
  el.textContent = message; el.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => el.classList.remove("show"), 2200);
}
