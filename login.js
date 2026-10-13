let mode = "login"; // "login" or "signup"
const passwordLabel = document.getElementById("password-label");
const forgotRow = document.getElementById("forgot-row");
const forgotLink = document.getElementById("forgot-link");
const title = document.getElementById("form-title");
const form = document.getElementById("auth-form");
const nameRow = document.getElementById("name-row");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submit-btn");
const switchText = document.getElementById("switch-text");
const switchLink = document.getElementById("switch-link");

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function showMessage(text, isError = true) {
  message.textContent = text;
  message.style.color = isError ? "crimson" : "green";
}

function updateUI() {
  const signup = mode === "signup";
  const reset = mode === "reset";
  title.textContent = signup ? "Create account" : reset ? "Reset password" : "Log in";
  submitBtn.textContent = title.textContent;
  passwordLabel.textContent = reset ? "New password" : "Password";
  switchText.textContent = signup ? "Already have an account?" : reset ? "Remembered it?" : "No account yet?";
  switchLink.textContent = signup || reset ? "Log in" : "Create account";
  forgotRow.hidden = mode !== "login";
  nameRow.hidden = !signup;
  nameInput.required = signup;
  message.textContent = "";
}

forgotLink.addEventListener("click", (e) => {
  e.preventDefault();
  mode = "reset";
  updateUI();
});


switchLink.addEventListener("click", (e) => {
  e.preventDefault();
  mode = mode === "login" ? "signup" : "login";
  updateUI();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;
  const users = getUsers();
if (mode === "reset") {
  const found = users.find((u) => u.email === email);
  if (!found) {
    showMessage("No account with that email.");
    return;
  }
  found.password = password;
  localStorage.setItem("users", JSON.stringify(users));
  mode = "login";
  updateUI();
  passwordInput.value = "";
  showMessage("Password updated. You can log in now.", false);
  return;
}
  if (mode === "signup") {
    if (users.some((u) => u.email === email)) {
      showMessage("That email is already registered.");
      return;
    }
    const name = nameInput.value.trim();
    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify({ name, email }));
    window.location.href = "index.html";
  } else {
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      showMessage("Wrong email or password.");
      return;
    }
    localStorage.setItem("currentUser", JSON.stringify({ name: user.name, email }));
    window.location.href = "index.html";
  }
});