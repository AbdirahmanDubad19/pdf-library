import { supabase } from "./supabase";

/* Elements */
const loginBox = document.getElementById("loginBox");
const adminBox = document.getElementById("adminBox");
const errorEl = document.getElementById("error");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const uploadBtn = document.getElementById("uploadBtn");
const pdfInput = document.getElementById("pdfFile");
const statusEl = document.getElementById("uploadStatus");

/* Login */
document.getElementById("loginBtn").onclick = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value,
  });

  if (error) {
    errorEl.textContent = error.message;
  } else {
    errorEl.textContent = "";
    checkAuth();
  }
};

/* Logout */
document.getElementById("logoutBtn").onclick = async () => {
  await supabase.auth.signOut();
  checkAuth();
};

/* Auth check */
async function checkAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    loginBox.style.display = "block";
    adminBox.style.display = "none";
  } else {
    loginBox.style.display = "none";
    adminBox.style.display = "block";
  }
}

/* Upload PDF */
uploadBtn.onclick = async () => {
  const file = pdfInput.files[0];
  if (!file) {
    statusEl.textContent = "Select a PDF first";
    return;
  }

  const filePath = `${Date.now()}_${file.name}`;

  const { error } = await supabase.storage
    .from("pdfs") // ⚠️ lowercase – must match bucket exactly
    .upload(filePath, file);

  if (error) {
    statusEl.textContent = "Upload failed: " + error.message;
    return;
  }

  const { data } = supabase.storage
    .from("pdfs")
    .getPublicUrl(filePath);

  statusEl.textContent = "Uploaded: " + data.publicUrl;
};

/* Run on load */
checkAuth();
