// js/public.js
import { supabaseClient } from "./supabase.js";

const pdfList = document.getElementById("pdfList");
const readerCard = document.getElementById("readerCard");
const pdfReader = document.getElementById("pdfReader");
const readerTitle = document.getElementById("readerTitle");

async function loadPDFs() {
  const { data, error } = await supabaseClient
    .storage
    .from("pdfs")
    .list("");

  if (error) {
    console.error(error);
    pdfList.innerHTML = "<li>failed to load pdfs</li>";
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
      <button data-url="${url}" data-name="${file.name}">
        📖 read in page
      </button>
      &nbsp;
      <a href="${url}" download>⬇ download</a>
    `;

    // handle read click
    li.querySelector("button").addEventListener("click", (e) => {
      const pdfUrl = e.target.dataset.url;
      const pdfName = e.target.dataset.name;

      readerTitle.textContent = pdfName;
      pdfReader.src = pdfUrl;
      readerCard.style.display = "block";

      readerCard.scrollIntoView({ behavior: "smooth" });
    });

    pdfList.appendChild(li);
  });
}

loadPDFs();

