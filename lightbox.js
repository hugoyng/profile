if (typeof PhotoSwipe === "function") {
  const galleries = document.querySelectorAll(".project, .case-page main");

  galleries.forEach((gallery) => {
    const links = [...gallery.querySelectorAll(".image-zoom")];
    const extraLinks = gallery.querySelector(".image-gallery-items")?.content.querySelectorAll("a") ?? [];
    const slides = [];
    const indices = new Map();

    for (const link of [...links, ...extraLinks]) {
      // The cover may also appear in the screenshots section.
      if (indices.has(link.href)) continue;
      const image = link.querySelector("img");
      indices.set(link.href, slides.length);
      slides.push({
        src: link.href,
        width: Number(image?.getAttribute("width") ?? link.dataset.width),
        height: Number(image?.getAttribute("height") ?? link.dataset.height),
        alt: image?.alt ?? link.textContent.trim()
      });
    }

    links.forEach((link) => {
      link.setAttribute("aria-haspopup", "dialog");
      link.addEventListener("click", (event) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

        event.preventDefault();
        link.focus({ preventScroll: true });
        const lightbox = new PhotoSwipe({
          dataSource: slides,
          index: indices.get(link.href),
          loop: false,
          bgOpacity: 0.95,
          showHideAnimationType: "fade",
          padding: { top: 52, bottom: 16, left: 12, right: 12 }
        });
        lightbox.init();
        lightbox.element.setAttribute("aria-label", "Project images");
        lightbox.element.setAttribute("aria-modal", "true");
      });
    });
  });
}
