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

      const { error } = await supabase.storage
        .from("pdfs")
        .upload(filePath, file);

      if (error) {
        statusEl.textContent = error.message;
        return;
      }

      const { data } = supabase.storage
        .from("pdfs")
        .getPublicUrl(filePath);

      statusEl.textContent = `Uploaded: ${data.publicUrl}`;
    };
  }
}


checkAuth();



