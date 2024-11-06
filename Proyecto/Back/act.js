const mongoose = require('mongoose');

// Conectar a MongoDB (asegúrate de cambiar la URL por la de tu base de datos)
mongoose.connect('mongodb://localhost:27017/prueba', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', () => {
  console.log('Conectado a MongoDB');
});

// Definir esquemas para las colecciones "supervisors" y "subgerentes"
const supervisorsSchema = new mongoose.Schema({
  nombre: String,
  rol: String,
  tareas: [String] // Campo nuevo que queremos añadir
});

const subgerentesSchema = new mongoose.Schema({
  nombre: String,
  rol: String,
  tareas: [String] // Campo nuevo que queremos añadir
});

const supervisors = mongoose.model('supervisors', supervisorsSchema);
const subgerentes = mongoose.model('subgerentes', subgerentesSchema);

// Función para actualizar ambas colecciones
async function actualizarTareas() {
  try {
    // Actualizar la colección "supervisors"
    const resultsupervisors = await supervisors.updateMany(
      { rol: "Supervisor" },
      { $set: { tareas: ["tarea1", "tarea2"] } }
    );
    console.log("Campo 'tareas' añadido a supervisores:", resultsupervisors.modifiedCount, "documentos actualizados.");

    // Actualizar la colección "subgerentes"
    const resultsubgerentes = await subgerentes.updateMany(
      { rol: "SubGerente" },
      { $set: { tareas: ["tarea1", "tarea2"] } }
    );
    console.log("Campo 'tareas' añadido a subgerentes:", resultsubgerentes.modifiedCount, "documentos actualizados.");
  } catch (error) {
    console.error("Error actualizando los documentos:", error);
  } finally {
    db.close();
  }
}

// Llamar a la función de actualización
actualizarTareas();
