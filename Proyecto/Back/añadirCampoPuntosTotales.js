const mongoose = require('mongoose');
const Tarea = require('./models/tareaModel'); // Asegúrate de tener el modelo de tarea importado

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/prueba', { 

});

async function agregarCampoPuntosTotales() {
  try {
    // Actualizar todas las tareas para agregar el campo puntostotales con valor inicial de 0
    await Tarea.updateMany({}, { $set: { puntostotales: 0 } });

    console.log("Campo 'puntostotales' añadido a todas las tareas.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error al añadir el campo 'puntostotales':", error);
    mongoose.connection.close();
  }
}

// Ejecutar la función
agregarCampoPuntosTotales();
