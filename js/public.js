import { supabaseClient } from "./supabase.js";

const pdfList = document.getElementById("pdfList");
const readerCard = document.getElementById("readerCard");
const pdfReader = document.getElementById("pdfReader");
const readerTitle = document.getElementById("readerTitle");

const btnAll = document.getElementById("btnAll");
const btnArabic = document.getElementById("btnArabic");
const btnEnglish = document.getElementById("btnEnglish");

// Load PDFs from optional folder
async function loadPDFs(folder = "") {
  pdfList.innerHTML = "<li>Loading PDFs...</li>";

  const { data, error } = await supabaseClient
    .storage
    .from("pdfs")
    .list(folder);

  if (error) {
    console.error(error);
    pdfList.innerHTML = "<li>Failed to load PDFs</li>";
    return;
  }

  if (!data || data.length === 0) {
    pdfList.innerHTML = "<li>No PDFs found.</li>";
    return;
  }

  pdfList.innerHTML = "";

  data.forEach(file => {
    if (!file.name.endsWith(".pdf")) return;

    const { data: urlData } = supabaseClient
      .storage
      .from("pdfs")
      .getPublicUrl(folder ? `${folder}/${file.name}` : file.name);

    const url = urlData.publicUrl;

    const li = document.createElement("li");
    li.className = "pdf-item";
    li.innerHTML = `
      <span class="pdf-title">${file.name}</span>
      <div class="pdf-actions">
        <button class="btn-read" data-url="${url}" data-name="${file.name}">
          📖 Read in page
        </button>
        <a class="btn-download" href="${url}" download>⬇ Download</a>
      </div>
    `;

    // Read button
    li.querySelector(".btn-read").addEventListener("click", (e) => {
      readerTitle.textContent = e.target.dataset.name;
      pdfReader.src = e.target.dataset.url;
      readerCard.style.display = "block";
      readerCard.scrollIntoView({ behavior: "smooth" });
    });

    pdfList.appendChild(li);
  });
}

// Close reader
document.getElementById("closeReader").onclick = () => {
  pdfReader.src = "";
  readerCard.style.display = "none";
};

// Filter buttons
btnAll.onclick = () => loadPDFs("");
btnArabic.onclick = () => loadPDFs("arabic");
btnEnglish.onclick = () => loadPDFs("english");

// Default: show all
loadPDFs();



