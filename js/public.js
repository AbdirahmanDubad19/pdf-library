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
    pdfList.innerHTML = "<li>failed to load PDFs</li>";
    return;
  }

  pdfList.innerHTML = "";

  data.forEach(file => {
    if (!file.name.endsWith(".pdf")) return;

    const { data: urlData } = supabaseClient.storage.from("pdfs").getPublicUrl(file.name);
    const url = urlData.publicUrl;

    // Create list item
    const li = document.createElement("li");
    li.className = "pdf-item";

    // Title
    const title = document.createElement("span");
    title.className = "pdf-title";
    title.textContent = file.name;

    // Button container
    const actions = document.createElement("div");
    actions.className = "pdf-actions";

    // Read button
    const readBtn = document.createElement("button");
    readBtn.className = "btn-read";
    readBtn.textContent = "📖 Read in page";
    readBtn.addEventListener("click", () => {
      readerTitle.textContent = file.name;
      pdfReader.src = url;
      readerCard.style.display = "block";
      readerCard.scrollIntoView({ behavior: "smooth" });
    });

    // Download link
    const downloadBtn = document.createElement("a");
    downloadBtn.className = "btn-download";
    downloadBtn.href = url;
    downloadBtn.download = file.name;
    downloadBtn.textContent = "⬇ Download";

    // Append buttons to container
    actions.append(readBtn, downloadBtn);

    // Append title + actions to list item
    li.append(title, actions);

    // Append to list
    pdfList.appendChild(li);
  });

  // Close reader
  document.getElementById("closeReader").onclick = () => {
    readerCard.style.display = "none";
    pdfReader.src = "";
  };
}

loadPDFs();


