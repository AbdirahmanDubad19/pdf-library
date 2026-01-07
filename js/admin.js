import { supabaseClient} from "./supabase.js";

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
  const { error } = await supabaseClient.auth.signInWithPassword({
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
  await supabaseClient.auth.signOut();
  checkAuth();
};

/* Auth check */
async function checkAuth() {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session) {
    loginBox.style.display = "block";
    adminBox.style.display = "none";
  } else {
    loginBox.style.display = "none";
    adminBox.style.display = "block";
  }
}

/* Upload PDF */
const fileInput = document.getElementById("pdfFile");
const file = fileInput.files[0];

if (!file) {
  statusEl.textContent = "Please select a PDF first";
  return;
}

// sanitize filename
const safeName = file.name.replace(/\s+/g, "_");
const filePath = `${Date.now()}_${safeName}`;

const { data, error } = await supabaseClient
  .storage
  .from("pdfs")
  .upload(filePath, file, {
    contentType: "application/pdf",
    upsert: false
  });

if (error) {
  console.error(error);
  statusEl.textContent = "Upload failed: " + error.message;
} else {
  statusEl.textContent = "Upload successful ✅";
}


/* Run on load */
checkAuth();
