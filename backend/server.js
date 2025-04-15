const express = require('express');
const app = express();
const db = require('./models/db'); // conecta a MongoDB
const empresasRoute = require('./routes/empresas');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/api/empresas', empresasRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
