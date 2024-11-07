// importar mongoose y el modelo de usuario
const mongoose = require('mongoose');
const userModel = require('./models/userModel');

// conectar a la base de datos
mongoose.connect('mongodb://localhost:27017/prueba', {

});

// función para actualizar progreso
const actualizarProgreso = async () => {
  try {
    const resultado = await userModel.updateMany({}, {
      $set: {
        progreso: [
          { tarea: 'tarea1', puntos: 10 },
          { tarea: 'tarea2', puntos: 50 }
        ]
      }
    });
    console.log('Usuarios actualizados:', resultado);
  } catch (error) {
    console.error('Error al actualizar los usuarios:', error);
  } finally {
    mongoose.connection.close();
  }
};

// ejecutar la función
actualizarProgreso();
