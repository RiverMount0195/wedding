// Fallback page transition for browsers without cross-document view
// transitions (e.g. Firefox): fade the page out, then navigate. The new page
// fades in via the .vt-fallback styles. Supporting browsers use the native
// @view-transition instead, so this does nothing there.
(function () {
  if ("onpagereveal" in window) return;

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const LEAVE_MS = 300; // keep in sync with .vt-fallback.is-leaving in style.css

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link || e.defaultPrevented || reducedMotion.matches) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;

    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin) return;
    // Same-page anchors (#rsvp) scroll as normal
    if (url.pathname === location.pathname && url.search === location.search) return;

    e.preventDefault();
    root.classList.add("is-leaving");
    setTimeout(() => {
      location.href = url.href;
    }, LEAVE_MS);
  });

  // Coming back via the back button restores the faded page from cache
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) root.classList.remove("is-leaving");
  });
})();
