// backend/server.js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para poder leer JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Hola desde el backend con Node.js y Express ');
});

// Levanta el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});