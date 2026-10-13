const spots = [
  { name:"OMSU Mamburao Campus", area:"Tayamaan", power:"Generator", open:7, close:21,wifi:true, free:true,
    image:"images/omsu.jpg",
    notes:"Free DICT WiFi listed (2020). Check with the campus if students or visitors can study here and if they have a generator." },
  { name:"Provincial Capitol", area:"Mamburao", power:"Generator", open:8, close:17, wifi:true, free:true,
    image:"images/capitol.jpg",
    notes:"Free DICT WiFi listed (2020). Check if the public can stay and if there is backup power." },
  { name:"Evergarden Café", area:"Payompon", power:"Generator", open:9, close:21, wifi:true, free:false,
    image:"images/evergarden.jpg",
    notes:"Boning Avenue. Hours, WiFi and backup power not confirmed. Ask before you go." },
  { name:"Occidental Mindoro National High School", area:"Payompon", power:"Generator", open:7, close:17, wifi:true, free:true,
    image:"images/omnhs.jpg",
    notes:"National Road. Likely students only. Check with the school." }
];

const $ = id => document.getElementById(id);
const active = { openNow:false, backupPower:false, openLate:false, wifi:false, free:false };
   const nowHour = () =>
     Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: "Asia/Manila" }).format(new Date())) % 24;
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
  const p = s.power !== "None";
  const o = isOpen(s);

  return `
    <article class="spot">

      <div class="spot-image-box">
        <img src="${s.image}" alt="${s.name}" class="spot-image">
        
        <span class="status-badge ${o ? "open" : "closed"}">
          ${o ? "● Open now" : "● Closed now"}
        </span>
      </div>

      <div class="spot-content">

        <h2>${s.name}</h2>

        <p class="spot-location">📍 ${s.area}</p>

        <div class="spot-tags">
          <span class="tag">
            ⚡ ${p ? "Backup power: " + s.power : "No backup power"}
          </span>

          <span class="tag">
            ${s.wifi ? "📶 Wi-Fi" : "🚫 No Wi-Fi"}
          </span>

          <span class="tag">
            ${s.free ? "✓ Free" : "₱ Paid"}
          </span>
        </div>

        <div class="spot-hours">
          🕐 ${hour(s.open)} – ${hour(s.close)}
        </div>

        <p class="notes">${s.notes}</p>


      </div>

    </article>
  `;
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
const auth = document.getElementById("auth");
const current = JSON.parse(localStorage.getItem("currentUser"));

if (current) {
  auth.textContent = "";

  const hello = document.createElement("span");
  hello.textContent = "Hi, " + current.name + " ";

  const logout = document.createElement("a");
  logout.href = "#";
  logout.textContent = "Log out";
  logout.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    location.reload();
  });

  auth.append(hello, logout);
}// Change this to your card's class name (see note below)
const CARD_SELECTOR = "#spots article, #spots li, #spots .card, #spots .spot, #spots .spot-card";
function showDetails(name) {
  const spot = spots.find(s => s.name === name);

  if (!spot) return;

  alert(
    spot.name +
    "\n\n📍 " + spot.area +
    "\n⚡ Power: " + spot.power +
    "\n📶 Wi-Fi: " + (spot.wifi ? "Yes" : "No") +
    "\n💰 " + (spot.free ? "Free" : "Paid") +
    "\n🕐 " + hour(spot.open) + " – " + hour(spot.close) +
    "\n\n" + spot.notes
  );
}