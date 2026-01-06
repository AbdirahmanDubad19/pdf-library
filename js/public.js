// js/public.js
import { supabase } from "./supabase.js";

const pdfList = document.getElementById("pdfList");

async function loadPDFs() {
  const { data, error } = await supabase
    .storage
    .from("pdfs")
    .list("", {
      limit: 100,
      sortBy: { column: "name", order: "asc" }
    });

  if (error) {
    console.error("Error loading PDFs:", error);
    pdfList.innerHTML = "<li>Failed to load PDFs</li>";
    return;
  }

  if (!data || data.length === 0) {
    pdfList.innerHTML = "<li>No PDFs available</li>";
    return;
  }

  pdfList.innerHTML = "";

  data.forEach(file => {
    if (!file.name.endsWith(".pdf")) return;

    const { data: urlData } = supabase
      .storage
      .from("pdfs")
      .getPublicUrl(file.name);

    const url = urlData.publicUrl;

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

