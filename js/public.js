import { supabase } from "./supabase.js";

const list = document.getElementById("pdfList");

async function loadPDFs() {
  const { data, error } = await supabase.storage
    .from("pdfs")
    .list("", { limit: 100 });

  if (error) {
    list.innerHTML = "<li>Error loading PDFs</li>";
    return;
  }

  list.innerHTML = "";

  data.forEach((file) => {
    const { data: urlData } = supabase.storage
      .from("pdfs")
      .getPublicUrl(file.name);

    const li = document.createElement("li");
    li.innerHTML = `<a href="${urlData.publicUrl}" target="_blank">${file.name}</a>`;
    list.appendChild(li);
  });
}

loadPDFs();
