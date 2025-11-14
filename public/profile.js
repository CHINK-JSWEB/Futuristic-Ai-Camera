// Check login status on page load
const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
const userName = localStorage.getItem("userName") || "Guest";

// Update login status display
const statusEl = document.getElementById("login-status");
if (statusEl) {
  statusEl.textContent = isLoggedIn 
    ? `✅ Logged in as: ${userName}` 
    : "❌ Not logged in";
}

// Dark Mode Toggle
const darkmodeSwitch = document.getElementById("darkmode-switch");

darkmodeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("darkMode", darkmodeSwitch.checked ? "dark" : "light");
});

// Load saved dark mode preference
const savedMode = localStorage.getItem("darkMode");
if (savedMode === "light") {
  document.body.classList.add("light-mode");
  darkmodeSwitch.checked = false;
}

// Social Login Functions
function loginWithFacebook() {
  window.location.href = "facebook-login.html";
}

function loginWithGoogle() {
  window.location.href = "google-login.html";
}

function loginWithTwitter() {
  window.location.href = "twitter-login.html";
}

// Fake Login for Testing
function fakeLogin() {
  localStorage.setItem("userLoggedIn", "true");
  localStorage.setItem("userName", "Jonnel Soriano");
  alert("✅ Logged in successfully!\n\nYou can now:\n✅ Remove watermark\n✅ Use up to 4K quality\n✅ Enable background music");
  window.location.href = "index.html";
}

// Logout Function
function logout() {
  localStorage.removeItem("userLoggedIn");
  localStorage.removeItem("userName");
  alert("❌ Logged out successfully!");
  location.reload();
}