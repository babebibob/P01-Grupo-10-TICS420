const mongoose = require('mongoose');

const empresaSchema = new mongoose.Schema({
  archivo: String,
  tipo_evento: String,
  razon_social: String,
  nombre_fantasia: String,
  capital: String,
  objeto: String,
  socios: [String],
  rut: { type: String, unique: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Empresa', empresaSchema);
