const express = require('express');
const app = express();
const db = require('./models/db'); // conecta a MongoDB
const companyRoutes = require('./routes/companies');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/api/companies', companyRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
