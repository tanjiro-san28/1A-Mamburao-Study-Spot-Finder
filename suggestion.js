(function () {
  const KEY = "spotSuggestions";

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }

  const openBtn = document.createElement("button");
  openBtn.type = "button";
  openBtn.className = "sg-open";
  openBtn.textContent = "+ Suggest a spot";

  const overlay = document.createElement("div");
  overlay.className = "sg-overlay";
  overlay.hidden = true;
  overlay.innerHTML = `
    <div class="sg-modal" role="dialog" aria-modal="true" aria-label="Suggest a study spot">
      <button type="button" class="sg-close" aria-label="Close">&times;</button>
      <p class="sg-title">Suggest a study spot</p>
      <form id="sg-form">
        <label>Place name
          <input name="name" required>
        </label>
        <label>Type
          <select name="type">
            <option>Library</option><option>Cafe</option><option>School hall</option>
            <option>Church hall</option><option>Barangay hall</option><option>Other</option>
          </select>
        </label>
        <label>Barangay / area
          <input name="area" required>
        </label>
        <label>Backup power
          <select name="power">
            <option>Generator</option><option>Inverter</option><option>Solar</option>
            <option>None</option><option>Not sure</option>
          </select>
        </label>
        <label>Opening hours
          <input name="hours" placeholder="e.g. 8 am to 5 pm">
        </label>
        <label>Wi-Fi
          <select name="wifi"><option>Yes</option><option>No</option><option>Not sure</option></select>
        </label>
        <label>Cost
          <select name="cost"><option>Free</option><option>Paid</option><option>Not sure</option></select>
        </label>
        <label>Note
          <textarea name="note" rows="2" placeholder="e.g. students only"></textarea>
        </label>
        <button type="submit" class="sg-submit">Send suggestion</button>
        <p class="sg-status" aria-live="polite"></p>
      </form>
      <button type="button" class="sg-view-btn"></button>
      <textarea class="sg-view" readonly hidden rows="8"></textarea>
    </div>`;

  document.body.append(openBtn, overlay);

  const form = overlay.querySelector("#sg-form");
  const status = overlay.querySelector(".sg-status");
  const viewBtn = overlay.querySelector(".sg-view-btn");
  const viewBox = overlay.querySelector(".sg-view");

  function refreshView() {
    const list = load();
    viewBtn.textContent = "View saved suggestions (" + list.length + ")";
    viewBox.value = JSON.stringify(list, null, 2);
  }

  openBtn.addEventListener("click", () => {
    status.textContent = "";
    refreshView();
    overlay.hidden = false;
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.classList.contains("sg-close")) {
      overlay.hidden = true;
    }
    e.stopPropagation(); // keeps modal.js from reacting to clicks in this form
  });

  viewBtn.addEventListener("click", () => {
    viewBox.hidden = !viewBox.hidden;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    data.submittedAt = new Date().toISOString();
    const list = load();
    list.push(data);
    localStorage.setItem(KEY, JSON.stringify(list));
    form.reset();
    status.textContent = "Thanks! Your suggestion was saved.";
    refreshView();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") overlay.hidden = true;
  });
})();