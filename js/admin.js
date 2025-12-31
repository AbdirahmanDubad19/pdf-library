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

// admin.js

// Logout button
document.getElementById("logoutBtn").onclick = async () => {
  await supabase.auth.signOut();
  location.reload();
};

// Check auth and show admin panel
async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  const loginBox = document.getElementById("loginBox");
  const adminBox = document.getElementById("adminBox");

  if (!session) {
    loginBox.style.display = "block";
    adminBox.style.display = "none";
  } else {
    loginBox.style.display = "none";
    adminBox.style.display = "block";

    // ✅ PDF Upload
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
        .from("pdfs") // lowercase bucket name
        .upload(filePath, file);

      if (error) {
        console.error("Upload failed:", error);
        statusEl.textContent = "Upload failed: " + error.message;
        return;
      }

      // Get public URL
      const { data: publicData, error: urlError } = supabase.storage
        .from("pdfs") // lowercase bucket name
        .getPublicUrl(filePath);

      if (urlError) {
        console.error("Failed to get public URL:", urlError);
        statusEl.textContent = "Upload succeeded but URL failed: " + urlError.message;
        return;
      }

      console.log("Upload succeeded:", publicData.publicUrl);
      statusEl.textContent = `Uploaded: ${publicData.publicUrl}`;
    };

      // -------------------------
    // Display uploaded PDFs
    // -------------------------
    async function loadPdfList() {
      const pdfListEl = document.getElementById("pdfList");

      // Get list of all objects in "pdfs" bucket
      const { data: files, error } = await supabase.storage
        .from("pdfs")
        .list(""); // list root folder

      if (error) {
        console.error("Failed to list PDFs:", error);
        pdfListEl.textContent = "Failed to load PDF list: " + error.message;
        return;
      }

      // Clear existing list
      pdfListEl.innerHTML = "";

      files.forEach(file => {
        const { name } = file;
        const { data: publicData } = supabase.storage
          .from("pdfs")
          .getPublicUrl(name);

        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = publicData.publicUrl;
        link.textContent = name;
        link.target = "_blank"; // open in new tab
        li.appendChild(link);
        pdfListEl.appendChild(li);
      });
    }

    // Call this after auth check
    if (session) {
      loadPdfList();
    }

    // -------------------------
    // Display uploaded PDFs with delete buttons
    // -------------------------
    async function loadPdfList() {
      const pdfListEl = document.getElementById("pdfList");

      const { data: files, error } = await supabase.storage
        .from("pdfs")
        .list("");

      if (error) {
        console.error("Failed to list PDFs:", error);
        pdfListEl.textContent = "Failed to load PDF list: " + error.message;
        return;
      }

      pdfListEl.innerHTML = "";

      files.forEach(file => {
        const { name } = file;
        const { data: publicData } = supabase.storage
          .from("pdfs")
          .getPublicUrl(name);

        const li = document.createElement("li");

        const link = document.createElement("a");
        link.href = publicData.publicUrl;
        link.textContent = name;
        link.target = "_blank";
        li.appendChild(link);

        // Create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.onclick = async () => {
          const { error: delError } = await supabase.storage
            .from("pdfs")
            .remove([name]);
          if (delError) {
            alert("Delete failed: " + delError.message);
            return;
          }
          li.remove(); // remove from list after deletion
          alert("Deleted: " + name);
        };

        li.appendChild(deleteBtn);
        pdfListEl.appendChild(li);
      });
    }


  }
}

// Run auth check on page load
checkAuth();




