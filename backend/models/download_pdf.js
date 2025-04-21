const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");

const carpetaDestino = path.join(__dirname, "pdfs");
if (!fs.existsSync(carpetaDestino)) fs.mkdirSync(carpetaDestino);

// 🔧 Formatea la fecha como DD-MM-YYYY
function formatearFecha(fecha) {
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  return `${dia}-${mes}-${anio}`;
}

// 🔍 Limpia URLs de PDF mal formadas
function limpiarURL(url) {
  if (url.startsWith("/publicaciones")) {
    return "https://www.diariooficial.interior.gob.cl" + url;
  }
  if (url.startsWith("//")) {
    return "https:" + url;
  }
  return url;
}

// 🧼 Limpia carpeta PDFs
function limpiarCarpetaPDFs() {
  const archivos = fs.readdirSync(carpetaDestino);
  archivos.forEach((archivo) => {
    if (archivo.endsWith(".pdf")) {
      fs.unlinkSync(path.join(carpetaDestino, archivo));
    }
  });
}

// 📥 Descarga PDF desde URL
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

// 🧠 Extrae los links de PDF desde el HTML
function extraerPDFs(html) {
  const matches = [...html.matchAll(/href="([^"]+\.pdf)"/g)];
  return matches.map((m) => limpiarURL(m[1]));
}

// 📄 Paso 1: Obtener edición desde portada sin saberla
async function obtenerEdicionActual(fecha) {
  const fechaFormateada = formatearFecha(fecha);
  const urlPortada = `https://www.diariooficial.interior.gob.cl/edicionelectronica/index.php?date=${fechaFormateada}`;

  try {
    const res = await axios.get(urlPortada);
    const $ = cheerio.load(res.data);

    const linkConEdicion = $("a[href*='edition=']").first().attr("href");
    const match = linkConEdicion?.match(/edition=(\d+)/);
    const edicion = match ? match[1] : null;

    if (!edicion) {
      console.log("❌ No se pudo extraer el número de edición.");
      return null;
    }

    console.log("📄 Edición detectada:", edicion);
    return edicion;

  } catch (err) {
    console.error("❌ Error accediendo a la portada:", err.message);
    return null;
  }
}

// 🚀 MAIN
async function main() {
  const fechaHoy = new Date();
  const fechaFormateada = formatearFecha(fechaHoy);

  console.log("📦 Limpiando carpeta de PDFs...");
  limpiarCarpetaPDFs();

  console.log("📅 Fecha actual:", fechaFormateada);
  const edicion = await obtenerEdicionActual(fechaHoy);
  if (!edicion) return;

  const urlEmpresas = `https://www.diariooficial.interior.gob.cl/edicionelectronica/empresas_cooperativas.php?date=${fechaFormateada}&edition=${edicion}`;
  console.log("🌐 Accediendo a sección empresas:", urlEmpresas);

  try {
    const html = await axios.get(urlEmpresas).then(res => res.data);
    const pdfUrls = extraerPDFs(html);

    if (pdfUrls.length === 0) {
      console.log("❌ No se encontraron PDFs en esta edición.");
      return;
    }

    console.log(`✅ Se encontraron ${pdfUrls.length} PDFs. Descargando...`);
    await Promise.all(pdfUrls.map((url) => descargarPDF(url)));
    console.log("🎉 Descarga finalizada.");

  } catch (err) {
    console.error("❌ Error al acceder a la sección de empresas:", err.message);
  }
}

main();
