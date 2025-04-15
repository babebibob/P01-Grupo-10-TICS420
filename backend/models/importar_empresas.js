const fs = require('fs');
const path = require('path');
const db = require('./db');
const Empresa = require('./empresa');

async function importarDatos() {
  const archivoJSON = path.join(__dirname, 'resultados_empresas.json');
  const empresas = JSON.parse(fs.readFileSync(archivoJSON, 'utf-8'));

  let actualizadas = 0;
  let nuevas = 0;

  for (const empresa of empresas) {
    if (!empresa.rut) continue; // Saltar empresas sin RUT

    const resultado = await Empresa.findOneAndUpdate(
      { rut: empresa.rut },
      empresa,
      { upsert: true, new: true }
    );

    if (resultado.createdAt.getTime() === resultado.updatedAt.getTime()) {
      nuevas++;
    } else {
      actualizadas++;
    }
  }

  console.log(`✅ ${nuevas} nuevas insertadas`);
  console.log(`🔁 ${actualizadas} actualizadas`);
  process.exit();
}

importarDatos();
