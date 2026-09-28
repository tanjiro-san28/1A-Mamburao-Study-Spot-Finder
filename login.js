const email = document.getElementById("email"), password = document.getElementById("password"), error = document.getElementById("error");
document.getElementById("showPassword").addEventListener("change", e => { password.type = e.target.checked ? "text" : "password"; });
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();
  if (!email.value.includes("@")) { error.textContent = "Enter a valid email address."; email.focus(); return; }
  if (password.value.length < 6) { error.textContent = "Password must be at least 6 characters."; password.focus(); return; }
  // Demo only: no real account check. A real login needs a backend (Firebase or Supabase).
  localStorage.setItem("msfUser", email.value.trim());
  window.location.href = "index.html";
});
