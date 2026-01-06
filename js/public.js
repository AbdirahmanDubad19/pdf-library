// js/public.js
import { supabase } from "./supabase.js";

const pdfList = document.getElementById("pdfList");

async function loadPDFs() {
  const { data: files, error } = await supabase.storage.from("pdfs").list("");
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

  files.forEach(file => {
    if (!file.name.endsWith(".pdf")) return;

    const { data: urlData } = supabase.storage.from("pdfs").getPublicUrl(file.name);
    const url = urlData?.publicUrl;
    if (!url) return;

    // Add PDF item with inline viewer link and download
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${file.name}</strong><br>
      <a href="${url}" target="_blank">📖 Read</a>
      &nbsp;|&nbsp;
      <a href="${url}" download>⬇ Download</a>
    `;
    pdfList.appendChild(li);
  });
}

loadPDFs();

