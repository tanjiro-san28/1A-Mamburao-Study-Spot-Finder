/* Replace these samples with real places. power: Generator, Inverter, Solar, or None. open/close: 24-hour time. */
const spots = [
  { name:"Sample Spot A (public library)", area:"Poblacion", power:"Generator", open:8, close:17, wifi:true,  free:true,  notes:"Quiet reading room. Replace with a real place." },
  { name:"Sample Spot B (cafe)",           area:"Poblacion", power:"Inverter",  open:9, close:22, wifi:true,  free:false, notes:"Order a drink to stay. Replace with a real place." },
  { name:"Sample Spot C (school hall)",    area:"Payompon",  power:"Generator", open:7, close:20, wifi:false, free:true,  notes:"Open to students only. Replace with a real place." },
  { name:"Sample Spot D (church hall)",    area:"Tayamaan",  power:"None",      open:8, close:18, wifi:false, free:true,  notes:"Bright by day, no power at night. Replace with a real place." },
  { name:"Sample Spot E (barangay hall)",  area:"Fatima",    power:"Solar",     open:8, close:21, wifi:true,  free:true,  notes:"Small room with a few tables. Replace with a real place." }
];

const $ = id => document.getElementById(id);
const active = { openNow:false, backupPower:false, openLate:false, wifi:false, free:false };
const nowHour = () => new Date().getHours();
const isOpen = s => nowHour() >= s.open && nowHour() < s.close;

// Login state (demo, saved by Login.html)
const user = localStorage.getItem("msfUser");
if (user) {
  $("auth").innerHTML = `<span class="user">${user}</span><button id="logout">Log out</button>`;
  $("logout").onclick = () => { localStorage.removeItem("msfUser"); location.reload(); };
}

$("stat").textContent = spots.filter(s => s.power !== "None").length + " of " + spots.length + " listed spots have backup power";
[...new Set(spots.map(s => s.area))].sort().forEach(a => $("area").add(new Option(a, a)));

const hour = h => (((h + 11) % 12) + 1) + (h % 24 >= 12 ? " pm" : " am");

function matches(s) {
  const q = $("search").value.trim().toLowerCase();
  if (q && !(s.name + " " + s.notes).toLowerCase().includes(q)) return false;
  if ($("area").value && s.area !== $("area").value) return false;
  if (active.openNow && !isOpen(s)) return false;
  if (active.backupPower && s.power === "None") return false;
  if (active.openLate && s.close < 21) return false;
  if (active.wifi && !s.wifi) return false;
  if (active.free && !s.free) return false;
  return true;
}

function card(s) {
  const p = s.power !== "None", o = isOpen(s);
  return `<article class="spot ${p ? "has-power" : ""}">
    <div class="top"><div><h2>${s.name}</h2><p class="area">${s.area}</p></div>
      <span class="status ${o ? "open" : ""}">${o ? "Open now" : "Closed now"}</span></div>
    <div class="power"><span class="lamp"></span>${p ? "Backup power: " + s.power : "No backup power"}</div>
    <ul class="facts"><li>${hour(s.open)} to ${hour(s.close)}</li>
      <li class="${s.wifi ? "yes" : ""}">${s.wifi ? "Wi-Fi" : "No Wi-Fi"}</li>
      <li class="${s.free ? "yes" : ""}">${s.free ? "Free" : "Paid"}</li></ul>
    <p class="notes">${s.notes}</p></article>`;
}

function render() {
  const list = spots.filter(matches);
  $("count").textContent = list.length + (list.length === 1 ? " spot" : " spots") + " found";
  $("grid").innerHTML = list.length ? list.map(card).join("") : `<p class="empty">No spots match these filters. Turn off a filter to see more.</p>`;
}

document.querySelectorAll(".chip").forEach(b => b.addEventListener("click", () => {
  active[b.dataset.filter] = !active[b.dataset.filter];
  b.setAttribute("aria-pressed", active[b.dataset.filter]);
  render();
}));
$("search").addEventListener("input", render);
$("area").addEventListener("change", render);
render();
