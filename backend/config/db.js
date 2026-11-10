const mongoose = require('mongoose');

const getConnection = async () => {
  try {
    const url = process.env.MONGO_URI;
    await mongoose.connect(url);
    console.log('¡Conexión exitosa a MongoDB Atlas!');
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  }
};

module.exports = {
  getConnection
};