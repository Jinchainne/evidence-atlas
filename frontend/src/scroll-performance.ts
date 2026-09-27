let timer: number | undefined;
let scrolling = false;

function optimizeWhileScrolling() {
  if (!scrolling) {
    scrolling = true;
    document.documentElement.classList.add("is-scrolling");
    document.querySelectorAll<HTMLVideoElement>(".fluxora-media video").forEach((video) => video.pause());
  }
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    scrolling = false;
    document.documentElement.classList.remove("is-scrolling");
    document.querySelectorAll<HTMLVideoElement>(".fluxora-media video").forEach((video) => {
      video.play().catch(() => undefined);
    });
  }, 220);
}

window.addEventListener("scroll", optimizeWhileScrolling, { passive: true });
