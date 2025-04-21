const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Registrar nuevo usuario
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const newUser = new User({ email, password }); // En producción deberías hashear la contraseña
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('❌ Error en registro:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Simulación de token
    res.json({ token: 'fake-jwt-token' });
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
