// js/public.js
import { supabaseClient } from "./supabase.js";

const pdfList = document.getElementById("pdfList");

async function loadPDFs() {
  // ✅ THIS IS THE LINE YOU SAID WAS MISSING
  const { data, error } = await supabaseClient
    .storage
    .from("pdfs")
    .list("");

  if (error) {
    console.error("Error listing PDFs:", error);
    pdfList.innerHTML = "<li>failed to load pdfs</li>";
    return;
  }

  if (!data || data.length === 0) {
    pdfList.innerHTML = "<li>no pdfs available</li>";
    return;
  }

  pdfList.innerHTML = "";

  data.forEach(file => {
    if (!file.name.endsWith(".pdf")) return;

    const { data: urlData } =
      supabaseClient.storage.from("pdfs").getPublicUrl(file.name);

    const url = urlData.publicUrl;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${file.name}</strong><br>
      <a href="${url}" target="_blank">📖 read</a>
      &nbsp;|&nbsp;
      <a href="${url}" download>⬇ download</a>
    `;

    pdfList.appendChild(li);
  });
}

loadPDFs();
