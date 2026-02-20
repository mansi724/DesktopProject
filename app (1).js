// -------------------- NAVIGATION --------------------
const navButtons = document.querySelectorAll(".nav-btn");
const pages = {    
  dashboard: document.getElementById("page-dashboard"),
  gestures: document.getElementById("page-gestures"),
  retrain: document.getElementById("page-retrain"),
  settings: document.getElementById("page-settings"),
};
  
function showPage(key){2
  Object.values(pages).forEach(p => p.classList.remove("show"));
  pages[key].classList.add("show");

  navButtons.forEach(b => b.classList.remove("active"));
  document.querySelector(`.nav-btn[data-page="${key}"]`).classList.add("active");
}

navButtons.forEach(btn => {
  btn.addEventListener("click", () => showPage(btn.dataset.page));
});

// -------------------- TOAST --------------------
const toast = document.getElementById("toast");
let toastTimer = null;

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1600);
}

// -------------------- DASHBOARD MOCKS --------------------
const sysStatus = document.getElementById("sysStatus");
const sysDot = document.getElementById("sysDot");
const detectedGesture = document.getElementById("detectedGesture");
const mappedAction = document.getElementById("mappedAction");
const confBar = document.getElementById("confBar");
const confText = document.getElementById("confText");
const lastSeen = document.getElementById("lastSeen");
const gestureCard = document.getElementById("gestureCard");
const actionCard = document.getElementById("actionCard");

const cameraBadge = document.getElementById("cameraBadge");
const cameraText = document.getElementById("cameraText");
const mockCameraBtn = document.getElementById("mockCameraBtn");

const cameraVideo = document.getElementById("cameraVideo");
const cameraPlaceholder = document.getElementById("cameraPlaceholder");

const modalVideo = document.getElementById("modalVideo");
const modalOverlay = document.getElementById("modalOverlay");

let running = false;
document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("cameraBadge").textContent = "Connected";
  document.getElementById("cameraText").textContent = "Camera: Active (Backend)";
});

function pulseCard(el){
  el.animate(
    [{ transform:"scale(1)", filter:"brightness(1)" },
     { transform:"scale(1.01)", filter:"brightness(1.15)" },
     { transform:"scale(1)", filter:"brightness(1)" }],
    { duration: 300 }
  );
}

const mockGestures = [
  { name:"Open Palm", action:"Play" },
  { name:"Fist", action:"Pause" },
  { name:"V", action:"Undo" },
  { name:"Inverted V", action:"Redo" },
  { name:"Thumbs Up", action:"Volume Up" },
  { name:"Thumbs Down", action:"Volume Down" },
  { name:"Three fingers", action:"Screenshot" },
  { name:"Finger to the left", action:"Tab Left" },
  { name:"Finger to the right", action:"Tab Right" },
  { name:"Finger Upwards", action:"Scroll Up" },
  { name:"Finger Downwards", action:"Scroll Down" },
  { name:"Finger moves in a circle", action:"Refresh" },
  { name:"Pinch two fingers", action:"Zoom In" },
  { name:"Spread two fingers", action:"Zoom Out" },
  
];

document.getElementById("mockGestureBtn").addEventListener("click", () => {
  if(!running){
    showToast("Start system first");
    return;
  }
  const g = mockGestures[Math.floor(Math.random()*mockGestures.length)];
  const conf = Math.floor(55 + Math.random()*45); // 55–100

  detectedGesture.textContent = g.name;
  mappedAction.textContent = g.action;
  confBar.style.width = conf + "%";
  confText.textContent = conf + "%";
  lastSeen.textContent = "Last gesture detected: just now";

  pulseCard(gestureCard);
  pulseCard(actionCard);
});

// -------------------- GESTURE LIBRARY (CRUD) --------------------
const gestureGrid = document.getElementById("gestureGrid");

let gestures = [
  { id: crypto.randomUUID(), name:"Open Palm", action:"Play" },
  { id: crypto.randomUUID(), name:"Fist", action:"Pause" },
  { id: crypto.randomUUID(), name:"V", action:"Undo" },
  { id: crypto.randomUUID(), name:"Inverted V", action:"Redo" },
  { id: crypto.randomUUID(), name:"Thumbs Up", action:"Volume Up" },
  { id: crypto.randomUUID(), name:"Thumbs Down", action:"Volume Down" },
  { id: crypto.randomUUID(), name:"Three fingers", action:"Screenshot" },
  { id: crypto.randomUUID(), name:"Finger to the left", action:"Tab Left" },
  { id: crypto.randomUUID(), name:"Finger to the right", action:"Tab Right" },
  { id: crypto.randomUUID(), name:"Finger Upwards", action:"Scroll Up" },
  { id: crypto.randomUUID(), name:"Finger Downwards", action:"Scroll Down" },
  { id: crypto.randomUUID(), name:"Finger moves in a circle", action:"Refresh" },
  { id: crypto.randomUUID(), name:"Pinch two fingers", action:"Zoom In" },
  { id: crypto.randomUUID(), name:"Spread two fingers", action:"Zoom Out" },
];

const gestureEmojis = {
  "Open Palm": "✋",
  "Fist": "✊",
  "V": "✌️",
  "Inverted V": "🙃",
  "Thumbs Up": "👍",
  "Thumbs Down": "👎",
  "Three fingers": "🤟",
  "Finger to the left": "👈",
  "Finger to the right": "👉",
  "Finger Upwards": "☝️",
  "Finger Downwards": "👇",
  "Finger moves in a circle": "🔄",
  "Pinch two fingers": "🤏",
  "Spread two fingers": "🖐️",
};

function renderGestures(){
  gestureGrid.innerHTML = "";

  if(gestures.length === 0){
    const empty = document.createElement("div");
    empty.className = "card";
    empty.innerHTML = `
      <h2>No gestures yet</h2>
      <div class="muted">Add your first gesture to start controlling your desktop.</div>
    `;
    gestureGrid.appendChild(empty);
    return;
  }

  gestures.forEach(g => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div class="gesture-preview">
    ${gestureEmojis[g.name] || "🤚"}
    </div>

    <h2>${escapeHtml(g.name)}</h2>
    <div class="mapped-label">
        <strong>Mapped Action:</strong> ${escapeHtml(g.action)}
    </div>
    <div class="gesture-actions">
      <button class="btn btn-ghost" data-del="${g.id}">Delete</button>
      <button class="btn" data-test="${g.id}">Test</button>
    </div>
  `;
  gestureGrid.appendChild(card);
});



  // Delete
  gestureGrid.querySelectorAll("[data-del]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-del");
      const g = gestures.find(x => x.id === id);
      if(!g) return;

      const ok = confirm(`Delete gesture "${g.name}"?`);
      if(!ok) return;

      gestures = gestures.filter(x => x.id !== id);
      renderGestures();
      showToast("Gesture deleted");
    });
  });

  // Test (shows toast)
  gestureGrid.querySelectorAll("[data-test]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-test");
      const g = gestures.find(x => x.id === id);
      if(!g) return;
      showToast(`Test: ${g.name} → ${g.action}`);
    });
  });
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

renderGestures();

// -------------------- ADD GESTURE MODAL --------------------
const modalBackdrop = document.getElementById("modalBackdrop");
const addGestureBtn = document.getElementById("addGestureBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const saveGestureBtn = document.getElementById("saveGestureBtn");
const gestureNameInput = document.getElementById("gestureNameInput");
const gestureActionSelect = document.getElementById("gestureActionSelect");
const mockCaptureBtn = document.getElementById("mockCaptureBtn");
const captureHint = document.getElementById("captureHint");

let captured = false;

function openModal(){
  modalBackdrop.classList.add("show");
  gestureNameInput.value = "";
  gestureActionSelect.value = "Play";
  captured = false;
  captureHint.textContent = "No capture yet.";

  if(cameraStream){
  modalVideo.srcObject = cameraStream;
}

modalOverlay.textContent = "Ready";
}

function closeModal(){
  modalBackdrop.classList.remove("show");
}

addGestureBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => {
  if(e.target === modalBackdrop) closeModal();
});

mockCaptureBtn.addEventListener("click", () => {
  if(!cameraStream){
    showToast("Connect camera first");
    return;
  }

  let count = 3;
  modalOverlay.textContent = count;

  const timer = setInterval(() => {
    count--;

    if(count > 0){
      modalOverlay.textContent = count;
    } else {
      clearInterval(timer);
      modalOverlay.textContent = "Captured ✅";
      captured = true;
      captureHint.textContent = "Gesture captured successfully.";
      showToast("Gesture captured");
    }
  }, 1000);
});

saveGestureBtn.addEventListener("click", () => {
  const name = gestureNameInput.value.trim();
  const action = gestureActionSelect.value;

  if(!name){
    showToast("Enter a gesture name");
    gestureNameInput.focus();
    return;
  }
  if(!captured){
    showToast("Capture gesture first");
    return;
  }

  gestures.unshift({ id: crypto.randomUUID(), name, action });
  renderGestures();
  closeModal();
  showToast("Gesture added");
});

// -------------------- RETRAIN (MOCK) --------------------
const retrainBtn = document.getElementById("retrainBtn");
const resetTrainBtn = document.getElementById("resetTrainBtn");
const trainArea = document.getElementById("trainArea");
const trainBar = document.getElementById("trainBar");
const trainPct = document.getElementById("trainPct");
const trainText = document.getElementById("trainText");
const trainStatusBadge = document.getElementById("trainStatusBadge");

let trainTimer = null;
let training = false;

retrainBtn.addEventListener("click", () => {
  if(training) return;

  training = true;
  trainArea.style.display = "block";
  trainStatusBadge.textContent = "Training";
  showToast("Retraining started");

  let p = 0;
  trainText.textContent = "Training model…";
  trainBar.style.width = "0%";
  trainPct.textContent = "0%";

  clearInterval(trainTimer);
  trainTimer = setInterval(() => {
    p += Math.floor(6 + Math.random()*10);
    if(p >= 100){
      p = 100;
      clearInterval(trainTimer);
      training = false;
      trainStatusBadge.textContent = "Ready";
      trainText.textContent = "Model ready ✅";
      showToast("Retraining complete");
    }
    trainBar.style.width = p + "%";
    trainPct.textContent = p + "%";
  }, 250);
});

resetTrainBtn.addEventListener("click", () => {
  clearInterval(trainTimer);
  training = false;
  trainArea.style.display = "none";
  trainStatusBadge.textContent = "Idle";
  showToast("Training reset");
});

// -------------------- SETTINGS (ACCESSIBILITY) --------------------
const darkModeToggle = document.getElementById("darkModeToggle");
const contrastToggle = document.getElementById("contrastToggle");
const largeTextToggle = document.getElementById("largeTextToggle");
const reducedMotionToggle = document.getElementById("reducedMotionToggle");
const lexendToggle = document.getElementById("lexendToggle");

// default: dark
darkModeToggle.checked = false;

darkModeToggle.addEventListener("change", () => {
  document.body.classList.toggle("light", darkModeToggle.checked);
});

contrastToggle.addEventListener("change", () => {
  document.body.classList.toggle("high-contrast", contrastToggle.checked);
});

largeTextToggle.addEventListener("change", () => {
  document.body.classList.toggle("large-text", largeTextToggle.checked);
});

reducedMotionToggle.addEventListener("change", () => {
  document.body.classList.toggle("reduced-motion", reducedMotionToggle.checked);
});

lexendToggle.addEventListener("change", async () => {
  if(lexendToggle.checked){
    // inject google font link
    if(!document.getElementById("lexendFont")){
      const link = document.createElement("link");
      link.id = "lexendFont";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;600;700&display=swap";
      document.head.appendChild(link);
    }
    document.documentElement.style.setProperty("--font", "Lexend, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif");
    showToast("Lexend enabled");
  }else{
    document.documentElement.style.setProperty("--font", "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif");
    showToast("Lexend disabled");
  }
});

function updateGesture() {
    fetch("/gesture_status")
        .then(response => response.json())
        .then(data => {
            document.getElementById("detectedGesture").innerText = data.gesture;
            document.getElementById("confText").innerText = Math.round(data.confidence * 100) + "%";
            document.getElementById("confBar").style.width = Math.round(data.confidence * 100) + "%";
        });
}

setInterval(updateGesture, 500);

document.getElementById("startBtn").addEventListener("click", () => {
    fetch("/start", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            showToast("Gesture engine started");
        });
});

document.getElementById("stopBtn").addEventListener("click", () => {
    fetch("/stop", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            showToast("Gesture engine stopped");
        });
});

