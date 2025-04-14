const fs = require("fs");
const path = require("path");
const axios = require("axios");

const carpetaDestino = path.join(__dirname, "pdfs");

function formatearFecha(fecha) {
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  return `${dia}-${mes}-${anio}`;
}

function contarDiasSinDomingos(desde, hasta) {
  let count = 0;
  let actual = new Date(desde);
  while (actual <= hasta) {
    if (actual.getDay() !== 0) count++; // no contar domingos
    actual.setDate(actual.getDate() + 1);
  }
  return count;
}

function generarURLDelDia() {//Actualización
  const fechaHoy = new Date();
  const fechaBase = new Date("2025-04-02");
  const edicionBase = 44115;

  const dias = contarDiasSinDomingos(fechaBase, fechaHoy);
  const edicion = edicionBase + (dias - 1); // se incluye el día base
  const fechaFormateada = formatearFecha(fechaHoy);

  return `https://www.diariooficial.interior.gob.cl/edicionelectronica/empresas_cooperativas.php?date=${fechaFormateada}&edition=${edicion}`;
}

const pageUrl = generarURLDelDia();

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
  const dobleProtocolo = url.match(/https:\/\/.*http:\/\/.*/);
  if (dobleProtocolo) {
    const cortado = url.split("http://").pop();
    return "http://" + cortado;
  }

  const malSeparado = url.match(/https:\/\/.*http\/\/.*/);
  if (malSeparado) {
    const cortado = url.split("http//").pop();
    return "http://" + cortado;
  }

  if (url.startsWith("/publicaciones")) {
    return "https://www.diariooficial.interior.gob.cl" + url;
  }

  if (url.startsWith("//")) {
    return "https:" + url;
  }

  return url;
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
