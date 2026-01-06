// js/public.js
import { supabase } from "./supabase.js";

const pdfList = document.getElementById("pdfList");

async function loadPDFs() {
  // List files in the bucket
  const { data: files, error } = await supabase
    .storage
    .from("pdfs")
    .list("", { limit: 100 });

  if (error) {
    console.error("Error fetching PDFs:", error);
    pdfList.innerHTML = "<li>Failed to load PDFs</li>";
    return;
  }

  if (!files || files.length === 0) {
    pdfList.innerHTML = "<li>No PDFs found</li>";
    return;
  }

  pdfList.innerHTML = "";

  for (const file of files) {
    if (!file.name.endsWith(".pdf")) continue;

    // Get public URL
    const { data: urlData, error: urlError } = supabase
      .storage
      .from("pdfs")
      .getPublicUrl(file.name);

    if (urlError) {
      console.error("Error getting public URL:", urlError);
      continue;
    }

    const url = urlData.publicUrl;
    if (!url) continue;

    // Add to page
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${file.name}</strong><br>
      <a href="${url}" target="_blank">📖 Read</a>
      &nbsp;|&nbsp;
      <a href="${url}" download>⬇ Download</a>
    `;
    pdfList.appendChild(li);
  }
}

loadPDFs();

