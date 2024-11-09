const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');

dotenv.config();

const app = express();
app.set('json spaces', 2);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Habilita CORS para todas las rutas

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
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

const supervisorRoutes = require('./routes/supervisorRoutes');
app.use('/api', supervisorRoutes);

const subgerenteRoutes = require('./routes/subgerenteRoutes');
app.use('/api', subgerenteRoutes);

const gerenteRoutes = require('./routes/gerenteRoutes');
app.use('/api', gerenteRoutes);

const tareaRoutes = require('./routes/tareaRoutes');
app.use('/api', tareaRoutes);

const areaRoutes = require('./routes/areaRoutes');
app.use('/api', areaRoutes);

const loginRoutes = require('./routes/loginRoutes');
app.use('/', loginRoutes);

const protectedRoutes = require('./routes/protectedRoutes');
app.use('/api/protected', protectedRoutes);



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
