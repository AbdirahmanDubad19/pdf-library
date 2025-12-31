// admin.js
import { supabase } from './supabase.js';

// -------------------------
// Logout
// -------------------------
document.getElementById("logoutBtn").onclick = async () => {
  await supabase.auth.signOut();
  location.reload();
};

// -------------------------
// Sanitize filename
// -------------------------
function sanitizeFileName(name) {
  return name.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
}

// -------------------------
// Check authentication and show admin panel
// -------------------------


// -------------------------
// Upload and list PDFs
// -------------------------
async function setupUploadAndList() {
  const uploadBtn = document.getElementById("uploadBtn");
  const pdfInput = document.getElementById("pdfFile");
  const statusEl = document.getElementById("uploadStatus");

  uploadBtn.onclick = async () => {
    const file = pdfInput.files[0];
    if (!file) { statusEl.textContent = "Please select a PDF file."; return; }

    const sanitizedName = sanitizeFileName(file.name);
    const filePath = `${Date.now()}_${sanitizedName}`;

    const { data, error } = await supabase.storage.from("pdfs").upload(filePath, file);
async function checkAuth() {
  const { session } = await supabase.auth.getSession();

  const loginBox = document.getElementById("loginBox");
  const adminBox = document.getElementById("adminBox");

  if (!session) {
    loginBox.style.display = "block";
    adminBox.style.display = "none";
  } else {
    loginBox.style.display = "none";
    adminBox.style.display = "block";

    setupUploadAndList(); // initialize upload/list
  }
}
    if (error) { statusEl.textContent = "Upload failed: " + error.message; return; }

    const { data: publicData, error: urlError } = supabase.storage.from("pdfs").getPublicUrl(filePath);
    if (urlError) { statusEl.textContent = "Upload succeeded but URL failed: " + urlError.message; return; }

    statusEl.textContent = `Uploaded: ${publicData.publicUrl}`;
    loadPdfList(); // refresh list after upload
  };

  loadPdfList(); // load on page load
}

// Run auth check
// -------------------------
checkAuth();
