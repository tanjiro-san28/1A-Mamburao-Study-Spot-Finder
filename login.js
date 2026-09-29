let mode = "login"; // "login" or "signup"

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
  title.textContent = signup ? "Create account" : "Log in";
  submitBtn.textContent = signup ? "Create account" : "Log in";
  switchText.textContent = signup ? "Already have an account?" : "No account yet?";
  switchLink.textContent = signup ? "Log in" : "Create account";
  nameRow.hidden = !signup;
  nameInput.required = signup;
  message.textContent = "";
}

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