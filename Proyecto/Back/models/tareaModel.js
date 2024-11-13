const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  id_tarea: {
    type: String,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  id_area: {
    type: String,
    required: true,
  },
  puntostotales: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('tareas', tareaSchema);
