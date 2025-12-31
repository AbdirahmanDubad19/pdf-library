// admin.js
import { supabase } from './supabase.js';

// -------------------------
// Logout button
// -------------------------
document.getElementById("logoutBtn").onclick = async () => {
  await supabase.auth.signOut();
  location.reload();
};

// -------------------------
// Sanitize filenames
// -------------------------
function sanitizeFileName(name) {
  return name.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
}

// -------------------------
// Check authentication and show admin panel
// -------------------------
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
    setupUploadAndList();
  }
}

// -------------------------
// Setup PDF upload and list
// -------------------------
async function setupUploadAndList() {
  const uploadBtn = document.getElementById("uploadBtn");
  const pdfInput = document.getElementById("pdfFile");
  const statusEl = document.getElementById("uploadStatus");

  uploadBtn.onclick = async () => {
    const file = pdfInput.files[0];
    if (!file) { statusEl.textContent = "Please select a PDF file."; return; }

    const filePath = `${Date.now()}_${sanitizeFileName(file.name)}`;

    // Upload file
    const { error } = await supabase.storage.from("pdfs").upload(filePath, file);
    if (error) { statusEl.textContent = "Upload failed: " + error.message; return; }

    // Get public URL
    const { data: { publicUrl }, error: urlError } = supabase.storage.from("pdfs").getPublicUrl(filePath);
    if (urlError) { statusEl.textContent = "Upload succeeded but URL failed: " + urlError.message; return; }

    statusEl.textContent = `Uploaded: ${publicUrl}`;
    loadPdfList();
  };

  loadPdfList();
}

// -------------------------
// Load PDFs dynamically
// -------------------------
async function loadPdfList() {
  const pdfListEl = document.getElementById("pdfList");
  const { data: files, error } = await supabase.storage.from("pdfs").list("", { limit: 100, offset: 0 });
  if (error) { pdfListEl.textContent = "Failed to load PDF list: " + error.message; return; }

  pdfListEl.innerHTML = "";
  files.forEach(file => {
    const { data: { publicUrl }, error: urlError } = supabase.storage.from("pdfs").getPublicUrl(file.name);
    if (urlError) return;

    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = publicUrl;
    link.textContent = file.name;
    link.target = "_blank";
    li.appendChild(link);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.onclick = async () => {
      const { error: delError } = await supabase.storage.from("pdfs").remove([file.name]);
      if (delError) { alert("Delete failed: " + delError.message); return; }
      li.remove();
    };
    li.appendChild(deleteBtn);

    pdfListEl.appendChild(li);
  });
}

// -------------------------
// Run auth check on page load
// -------------------------
checkAuth();
