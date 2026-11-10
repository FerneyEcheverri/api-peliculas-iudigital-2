require('dotenv').config();

const express = require('express');
const { getConnection } = require('./config/db');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const app = express();
const port = process.env.PORT || 3000;

// Conectar a la Base de Datos
getConnection();

// Middleware para leer datos JSON en las peticiones HTTP
app.use(express.json());

// Declaración de Rutas de la API (con el prefijo /api)
app.use('/api/genero', require('./routes/generoRoute'));
app.use('/api/director', require('./routes/directorRoute'));
app.use('/api/productora', require('./routes/productoraRoute'));
app.use('/api/tipo', require('./routes/tipoRoute'));
app.use('/api/media', require('./routes/mediaRoute'));

// Servidor escuchando
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});