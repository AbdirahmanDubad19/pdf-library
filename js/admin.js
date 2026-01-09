import { supabaseClient } from "./supabase.js";

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

/* Auth check — SINGLE SOURCE OF TRUTH */
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
    loadPdfs();
  }
}

/* Upload PDF */
uploadBtn.onclick = async () => {
  const file = pdfInput.files[0];

  if (!file) {
    statusEl.textContent = "Please select a PDF first";
    return;
  }

  const filePath = `${Date.now()}_${file.name}`;

  const { error } = await supabaseClient
    .storage
    .from("pdfs")
    .upload(filePath, file);

  if (error) {
    statusEl.textContent = error.message;
  } else {
    statusEl.textContent = "Upload successful ✅";
    pdfInput.value = "";
    loadPdfs();
  }
};

/* Load PDFs */
async function loadPdfs() {
  const pdfListEl = document.getElementById("pdfList");
  pdfListEl.innerHTML = "Loading...";

  let files = [];

  const { data: arabic } = await supabaseClient
    .storage
    .from("pdfs")
    .list("arabic");

  const { data: english } = await supabaseClient
    .storage
    .from("pdfs")
    .list("english");

  if (arabic) {
    files.push(...arabic.map(f => ({ ...f, folder: "arabic" })));
  }
  if (english) {
    files.push(...english.map(f => ({ ...f, folder: "english" })));
  }

  files = files.filter(f => f.name.endsWith(".pdf"));

  if (files.length === 0) {
    pdfListEl.innerHTML = "No PDFs uploaded yet.";
    return;
  }

  pdfListEl.innerHTML = "";

  files.forEach(file => {
    const card = document.createElement("div");
    card.className = "pdf-card";

    card.innerHTML = `
      <strong>${file.name}</strong>
      <small>${file.folder}</small>
      <button>Remove</button>
    `;

    card.querySelector("button").onclick = () =>
      deletePdf(`${file.folder}/${file.name}`);

    pdfListEl.appendChild(card);
  });
}


/* Delete PDF */
async function deletePdf(fileName) {
  const ok = confirm(`Delete "${fileName}"?`);
  if (!ok) return;

  const { error } = await supabaseClient
    .storage
    .from("pdfs")
    .remove([fileName]);

  if (error) {
    alert(error.message);
  } else {
    loadPdfs();
  }
}

/* Run on load */
checkAuth();

