const fs = require('fs');
const path = require('path');
const db = require('./db');
const Company = require('./company'); // Modelo correcto

async function importarDatos() {
  const archivoJSON = path.join(__dirname, 'companies_data.json'); 
  const empresas = JSON.parse(fs.readFileSync(archivoJSON, 'utf-8'));

  let actualizadas = 0;
  let nuevas = 0;

  for (const empresa of empresas) {
    // Evitar empresas sin razón social o sin rut
    if (!empresa.razon_social || !empresa.rut) continue;

    try {
      const resultado = await Company.findOneAndUpdate(
        { razon_social: empresa.razon_social },
        empresa,
        { upsert: true, new: true }
      );

      if (resultado.createdAt.getTime() === resultado.updatedAt.getTime()) {
        nuevas++;
      } else {
        actualizadas++;
      }
    } catch (error) {
      console.error(`❌ Error al procesar empresa ${empresa.razon_social}:`, error.message);
    }
  }

  console.log(`✅ ${nuevas} nuevas insertadas`);
  console.log(`🔁 ${actualizadas} actualizadas`);
  process.exit();
}

importarDatos();
