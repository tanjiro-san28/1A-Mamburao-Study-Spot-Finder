(function () {
  if (window.__popupLoaded) return; // stops double popups
  window.__popupLoaded = true;
  console.log("popup.js loaded");

  // Remove any popup left over from older scripts
  document.querySelectorAll(".modal-overlay, .pop-overlay, .sg-overlay, .sg-open").forEach((el) => el.remove());

  const style = document.createElement("style");
  style.textContent = `
    .spot { cursor: pointer; }
    .spot:hover { box-shadow: 0 6px 18px rgba(0,0,0,.15); }
    .pop-overlay { position: fixed; inset: 0; z-index: 1000; display: flex;
      align-items: center; justify-content: center; background: rgba(0,0,0,.6); }
    .pop-overlay[hidden] { display: none; }
    .pop-box { position: relative; width: 92%; max-width: 480px; max-height: 90vh;
      overflow-y: auto; padding: 26px; background: #fff; border-radius: 16px; }
    .pop-close { position: absolute; top: 8px; right: 12px; font-size: 1.8rem;
      background: none; border: none; cursor: pointer; }
    .pop-title { margin: 0 0 12px; font-size: 1.4rem; font-weight: 700; }
    .pop-box label { display: block; margin-top: 10px; font-weight: 700; }
    .pop-box input, .pop-box select, .pop-box textarea { width: 100%; margin-top: 4px;
      padding: 8px 10px; font: inherit; border: 2px solid #cbd5e1; border-radius: 8px; }
    .pop-btn { width: 100%; margin-top: 16px; padding: 10px; font: inherit; font-weight: 700;
      color: #fff; background: #f59e0b; border: none; border-radius: 8px; cursor: pointer; }
    .pop-status { color: green; min-height: 1.2em; }
    .pop-fab { position: fixed; right: 20px; bottom: 20px; z-index: 900; padding: 12px 18px;
      font: inherit; font-weight: 700; color: #fff; background: #f59e0b; border: none;
      border-radius: 999px; box-shadow: 0 6px 18px rgba(0,0,0,.25); cursor: pointer; }
    .pop-view { width: 100%; margin-top: 8px; font-family: monospace; }
  `;
  document.head.appendChild(style);

  // One popup used for both the spot details and the suggestion form
  const overlay = document.createElement("div");
  overlay.className = "pop-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `<div class="pop-box" role="dialog" aria-modal="true">
    <button class="pop-close" aria-label="Close">&times;</button>
    <div class="pop-body"></div></div>`;
  document.body.appendChild(overlay);
  const body = overlay.querySelector(".pop-body");

  const KEY = "spotSuggestions";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };

  function showForm() {
    body.innerHTML = `
      <p class="pop-title">Suggest a study spot</p>
      <form id="pop-form">
        <label>Place name <input name="name" required></label>
        <label>Type <select name="type"><option>Library</option><option>Cafe</option>
          <option>School hall</option><option>Church hall</option><option>Barangay hall</option>
          <option>Other</option></select></label>
        <label>Barangay / area <input name="area" required></label>
        <label>Backup power <select name="power"><option>Generator</option><option>Inverter</option>
          <option>Solar</option><option>None</option><option>Not sure</option></select></label>
        <label>Opening hours <input name="hours" placeholder="e.g. 8 am to 5 pm"></label>
        <label>Wi-Fi <select name="wifi"><option>Yes</option><option>No</option><option>Not sure</option></select></label>
        <label>Cost <select name="cost"><option>Free</option><option>Paid</option><option>Not sure</option></select></label>
        <label>Note <textarea name="note" rows="2"></textarea></label>
        <button class="pop-btn" type="submit">Send suggestion</button>
        <p class="pop-status" id="pop-status"></p>
      </form>
      <textarea class="pop-view" id="pop-view" rows="6" readonly></textarea>`;
    const view = body.querySelector("#pop-view");
    view.value = JSON.stringify(load(), null, 2);
    body.querySelector("#pop-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target));
      data.submittedAt = new Date().toISOString();
      const list = load();
      list.push(data);
      localStorage.setItem(KEY, JSON.stringify(list));
      e.target.reset();
      body.querySelector("#pop-status").textContent = "Thanks! Saved (" + list.length + " total).";
      view.value = JSON.stringify(list, null, 2);
    });
  }

  const fab = document.createElement("button");
  fab.className = "pop-fab";
  fab.type = "button";
  fab.textContent = "+ Suggest a spot";
  document.body.appendChild(fab);

  fab.addEventListener("click", () => { showForm(); overlay.hidden = false; });

  document.addEventListener("click", (e) => {
    if (overlay.contains(e.target)) {
      if (e.target === overlay || e.target.classList.contains("pop-close")) overlay.hidden = true;
      return;
    }
    const card = e.target.closest(".spot");
    if (card) { body.innerHTML = card.innerHTML; overlay.hidden = false; }
  });

  document.addEventListener("keydown", (e) => { if (e.key === "Escape") overlay.hidden = true; });
})();