import { supabase } from "./supabase.js";

const loginBox = document.getElementById("login");
const adminBox = document.getElementById("admin");
const errorEl = document.getElementById("error");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

document.getElementById("loginBtn").onclick = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: emailInput.value,
    password: passwordInput.value,
  });

  if (error) errorEl.textContent = error.message;
};

document.getElementById("logoutBtn").onclick = async () => {
  await supabase.auth.signOut();
  location.reload();
};

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    loginBox.style.display = "block";
    adminBox.style.display = "none";
  } else {
    loginBox.style.display = "none";
    adminBox.style.display = "block";

    // ✅ Add the PDF upload code here
    // ✅ PDF Upload (Admin-only)
const uploadBtn = document.getElementById("uploadBtn");
const pdfInput = document.getElementById("pdfFile");
const statusEl = document.getElementById("uploadStatus");

uploadBtn.onclick = async () => {
  const file = pdfInput.files[0];
  if (!file) {
    statusEl.textContent = "Please select a PDF file.";
    return;
  }

  const filePath = `${Date.now()}_${file.name}`;

  // Upload file to Supabase
  const { data, error } = await supabase.storage
    .from("pdfs") // exact bucket name
    .upload(filePath, file);

  if (error) {
    console.error("Upload failed:", error);
    statusEl.textContent = "Upload failed: " + error.message;
    return;
  }

  // Get public URL safely
  const { data: publicData, error: urlError } = supabase.storage
    .from("pdfs")
    .getPublicUrl(filePath);

  if (urlError) {
    console.error("Failed to get public URL:", urlError);
    statusEl.textContent = "Upload succeeded but URL failed: " + urlError.message;
    return;
  }

  console.log("Upload succeeded:", publicData.publicUrl);
  statusEl.textContent = `Uploaded: ${publicData.publicUrl}`;
};


  }
}


checkAuth();



