const fs = require("fs");
const path = require("path");
const axios = require("axios");

const pageUrl = "https://www.diariooficial.interior.gob.cl/edicionelectronica/empresas_cooperativas.php?date=02-04-2025&edition=44115";
const carpetaDestino = path.join(__dirname, "pdfs");

const archivos = fs.readdirSync(carpetaDestino);
archivos.forEach((archivo) => {
  if (archivo.endsWith(".pdf")) {
    fs.unlinkSync(path.join(carpetaDestino, archivo));
  }
});

async function obtenerHTML(url) {
  const response = await axios.get(url);
  return response.data;
}

function limpiarURL(url) {
  // Detecta el patrón "https://...http://..." y lo corrige
  const dobleProtocolo = url.match(/https:\/\/.*http:\/\/.*/);
  if (dobleProtocolo) {
    const cortado = url.split("http://").pop(); // Solo nos interesa lo que sigue después del segundo protocolo
    return "http://" + cortado;
  }

  // Detecta "https://...http//..." (sin ':') y lo corrige
  const malSeparado = url.match(/https:\/\/.*http\/\/.*/);
  if (malSeparado) {
    const cortado = url.split("http//").pop();
    return "http://" + cortado;
  }

  // Si es una ruta relativa, la completamos
  if (url.startsWith("/publicaciones")) {
    return "https://www.diariooficial.interior.gob.cl" + url;
  }

  // Si empieza con // lo completamos con https
  if (url.startsWith("//")) {
    return "https:" + url;
  }

  return url; // Si ya está limpia, la dejamos
}

function extraerPDFs(html) {
  const matches = [...html.matchAll(/href="([^"]+\.pdf)"/g)];
  const urls = matches.map((match) => limpiarURL(match[1]));
  return urls;
}

async function descargarPDF(url) {
  const nombreArchivo = url.split("/").pop();
  const rutaArchivo = path.join(carpetaDestino, nombreArchivo);

  try {
    console.log("⬇️  Descargando:", url);
    const response = await axios({ url, responseType: "arraybuffer" });
    fs.writeFileSync(rutaArchivo, response.data);
    console.log("✅ Guardado como:", nombreArchivo);
  } catch (error) {
    console.error("❌ Error al descargar:", url, "\n", error.message);
  }
}

async function main() {
  console.log(`🌐 Obteniendo lista de PDFs desde: ${pageUrl}`);
  const html = await obtenerHTML(pageUrl);
  const pdfUrls = extraerPDFs(html);

  if (pdfUrls.length === 0) {
    console.log("❌ No se encontraron PDFs.");
    return;
  }

  console.log(`✅ Se encontraron ${pdfUrls.length} PDFs. Descargando...`);
  await Promise.all(pdfUrls.map((url) => descargarPDF(url)));
  console.log("🎉 Descarga finalizada.");
}

main();
