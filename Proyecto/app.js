const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());


// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Manejo de errores de conexión después de la conexión inicial
mongoose.connection.on('error', (error) => {
  console.error('Error de conexión a MongoDB:', error);
});

// Rutas
const userRoutes = require('./Back/routes/userRoutes');
app.use('/api', userRoutes);

const supervisorRoutes = require('./Back/routes/supervisorRoutes');
app.use('/api', supervisorRoutes);

const subgerenteRoutes = require('./Back/routes/subgerenteRoutes');
app.use('/api', subgerenteRoutes);

const gerenteRoutes = require('./Back/routes/gerenteRoutes');
app.use('/api', gerenteRoutes);

const tareaRoutes = require('./Back/routes/tareaRoutes');
app.use('/api', tareaRoutes);

const areaRoutes = require('./Back/routes/areaRoutes');
app.use('/api', areaRoutes);


// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Manejo de cierre 
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Conexión a MongoDB cerrada');
    process.exit(0);
  });
});



