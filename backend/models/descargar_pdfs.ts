const pageUrl = "https://www.diariooficial.interior.gob.cl/edicionelectronica/empresas_cooperativas.php?date=02-04-2025&edition=44115"; // Ajusta la URL si es necesario

const response = await fetch(pageUrl);
if (!response.ok) {
  console.error("Error al obtener la página:", response.statusText);
  Deno.exit(1);
}

const html = await response.text();
const pdfUrls = [...html.matchAll(/href="([^"]+\.pdf)"/g)].map(match => match[1]);

if (pdfUrls.length === 0) {
  console.log("No se encontraron PDFs.");
  Deno.exit(1);
}

console.log(`Se encontraron ${pdfUrls.length} PDFs. Descargando...`);

for (const url of pdfUrls) {
  const pdfResponse = await fetch(url);
  if (!pdfResponse.ok) {
    console.error(`Error al descargar ${url}:`, pdfResponse.statusText);
    continue;
  }

  const pdfData = new Uint8Array(await pdfResponse.arrayBuffer());
  const fileName = url.split("/").pop() || "documento.pdf";

  await Deno.writeFile(fileName, pdfData);
  console.log(`Descargado: ${fileName}`);
}

console.log("Descarga finalizada.");
