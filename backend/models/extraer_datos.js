// Requiere: npm install pdf-parse
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");

const carpetaPDFs = path.join(__dirname, "pdfs");
const carpetaLogs = path.join(__dirname, "logs");
if (!fs.existsSync(carpetaLogs)) fs.mkdirSync(carpetaLogs);

function limpiarTexto(texto) {
  return texto
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .replace(/[\uFFFD]/g, "")
    .trim();
}

function buscarCampo(texto, patron, nombreCampo) {
  const match = texto.match(patron);
  if (match) return match[1].trim();
  console.warn(`⚠️ ${nombreCampo} no encontrado.`);
  return null;
}

function extraerDatos(texto) {
  const datos = {};
  const limpio = limpiarTexto(texto);

  datos.razon_social = buscarCampo(limpio, /denominada\s+“([^”]+)”/, "Razón Social") ||
                      buscarCampo(limpio, /Nombre:\s*“([^”]+)”/, "Razón Social");

  datos.nombre_fantasia = buscarCampo(limpio, /nombre de fantas[ií]a\s+“([^”]+)”/, "Nombre Fantasía");

  datos.capital = buscarCampo(limpio, /Capital(?:\s+Social)?:?\s*\$?([\d\.\s]+)\s*(mill[oó]n|mil|pesos)/i, "Capital Social");

  datos.objeto = buscarCampo(limpio, /Objeto:\s*(.*?)\s*(?:Capital|Administraci[oó]n|Duraci[oó]n)/, "Objeto Social");

  const rutMatch = limpio.match(/RUT\s*N?[\.:]?\s*(\d{7,8}-[\dkK])/);
  if (rutMatch) datos.rut = rutMatch[1]; else console.warn("⚠️ RUT no encontrado.");

  const socios = [...limpio.matchAll(/(?:compareci[oó]|suscribe)[^\.,;:\n]*([A-Z\u00d1][A-Z\u00d1a-z\u00f1\s]+)[.,;]/g)]
    .map(m => m[1].trim())
    .filter((v, i, arr) => arr.indexOf(v) === i); // únicos

  datos.socios = socios;

  return datos;
}

async function procesarPDF(nombreArchivo) {
  const ruta = path.join(carpetaPDFs, nombreArchivo);
  const buffer = fs.readFileSync(ruta);
  const data = await pdfParse(buffer);

  const datos = extraerDatos(data.text);
  return { archivo: nombreArchivo, ...datos };
}

async function main() {
  const archivos = fs.readdirSync(carpetaPDFs).filter(f => f.endsWith(".pdf"));
  const resultados = [];

  for (const archivo of archivos) {
    console.log(`📄 Procesando: ${archivo}`);
    try {
      const datos = await procesarPDF(archivo);
      resultados.push(datos);
    } catch (err) {
      fs.appendFileSync(
        path.join(carpetaLogs, "errores.log"),
        `❌ Error en archivo ${archivo}: ${err.message}\n`
      );
    }
  }

  const jsonPath = path.join(__dirname, "resultados_empresas.json");
  fs.writeFileSync(jsonPath, JSON.stringify(resultados, null, 2), "utf-8");
  console.log(`✅ Extracción completa. Resultados guardados en: ${jsonPath}`);
}

main();
