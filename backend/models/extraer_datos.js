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

function buscarCampoMultiple(texto, patrones, nombreCampo) {
  for (const patron of patrones) {
    const match = texto.match(patron);
    if (match) return match[1].trim();
  }
  console.warn(`⚠️ ${nombreCampo} no encontrado.`);
  return null;
}

function detectarTipoEvento(texto) {
  if (/constituy[eo]n/i.test(texto)) return "Constitución";
  if (/disolver|disoluci[óo]n|terminar/i.test(texto)) return "Disolución";
  if (/modificaci[óo]n|modificar|refund/i.test(texto)) return "Modificación";
  if (/divisi[óo]n/i.test(texto)) return "División";
  if (/saneamiento|sanear/i.test(texto)) return "Saneamiento";
  return "Otro";
}

function esRutValido(rut) {
  return /^\d{7,8}-[\dkK]$/.test(rut);
}

function extraerDatos(texto) {
  const datos = {};
  const limpio = limpiarTexto(texto);

  datos.tipo_evento = detectarTipoEvento(limpio);

  datos.razon_social = buscarCampoMultiple(limpio, [
    /(?:sociedad|sociedad denominada|modifican la sociedad denominada|denominada|transforman la sociedad denominada)\s+“?([A-Z\s\-\.\&]+(?:SpA|LIMITADA|E\.I\.R\.L\.|LTDA|S\.A\.))”?/i,
    /nombre de la sociedad.*?es\s+“([^”]+)”/i
  ], "Razón Social");

  datos.nombre_fantasia = buscarCampoMultiple(limpio, [
    /nombre de fantas[ií]a[:\s]*“?([^”"]{3,60})”?/i,
    /pudiendo usar(?: como nombre de fantas[ií]a)?[:\s]*“?([^”"]{3,60})”?/i
  ], "Nombre Fantasía");

  datos.capital = buscarCampoMultiple(limpio, [
    /capital(?: social)?(?: es|:)\s*(?:la suma de\s*)?\$?\s*([\d\.]{3,})/i,
    /CAPITAL:\s*([\d\.]{3,})/i
  ], "Capital Social");

  datos.objeto = buscarCampoMultiple(limpio, [
    /(?:objeto social|objeto)[:\s]*(.*?)(?=domicilio|administraci[oó]n|capital|duraci[oó]n|vigencia|representaci[oó]n)/i
  ], "Objeto Social");

  const socios = [...limpio.matchAll(/(?:do[ñn]a|don)\s+([A-ZÁÉÍÓÚÑ\-]{2,}(?:\s+[A-ZÁÉÍÓÚÑ\-]{2,}){1,4})/g)]
    .map(m => m[1].trim())
    .filter((v, i, arr) => arr.indexOf(v) === i);
  datos.socios = socios;

  const rutEmpresarialMatch = limpio.match(/(?:RUT|Rol Único Tributario(?:\s*N[°º\.:])?)\s*[:\.]?\s*(\d{1,2}[\.\d]*\-?[\dkK])/i);
  const rutLimpio = rutEmpresarialMatch ? rutEmpresarialMatch[1].replace(/\./g, "") : null;

  datos.rut = esRutValido(rutLimpio) ? rutLimpio : null;

  if (!datos.rut) console.warn("⚠️ RUT válido no encontrado.");

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
