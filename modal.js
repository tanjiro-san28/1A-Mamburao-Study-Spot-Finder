(function () {
  console.log("modal.js v2 loaded");

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <button class="modal-close" aria-label="Close">&times;</button>
      <div class="modal-body"></div>
    </div>`;
  document.body.appendChild(overlay);
  const modalBody = overlay.querySelector(".modal-body");

  document.addEventListener("click", (e) => {
    if (overlay.contains(e.target)) {
      if (e.target === overlay || e.target.classList.contains("modal-close")) {
        overlay.hidden = true;
      }
      return;
    }
    const card = e.target.closest(".spot");
    if (card) {
      modalBody.innerHTML = card.innerHTML;
      overlay.hidden = false;
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") overlay.hidden = true;
  });
})();