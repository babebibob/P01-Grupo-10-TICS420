const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://ignaciosubiabre10:iasc159753@cluster0.tw1gdvo.mongodb.net/empresas?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, '❌ Error de conexión a MongoDB Atlas:'));
db.once('open', () => {
  console.log('✅ Conectado a MongoDB Atlas');
});

module.exports = db;
