const express = require('express');
const router = express.Router();
const Empresa = require('../models/company');

// Obtener todas las empresas
router.get('/', async (req, res) => {
  try {
    const empresas = await Empresa.find();
    res.json(empresas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener empresas' });
  }
});

// Obtener una empresa por RUT
router.get('/:rut', async (req, res) => {
  try {
    const empresa = await Empresa.findOne({ rut: req.params.rut });
    if (!empresa) return res.status(404).json({ error: 'Empresa no encontrada' });
    res.json(empresa);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar empresa' });
  }
});

module.exports = router;
