const mongoose = require('mongoose');

const supervisorSchema = new mongoose.Schema({
  id_supervisor: {
    type: String,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  contraseña: {
    type: String,
    required: true
  },
  comentarios: {
    type: String,
    required: true,
  },
  progreso: {
    type: Number,
    required: true,
  },
  tareas: {
    type: [String],
    required: true,
  }

});

module.exports = mongoose.model('supervisors', supervisorSchema);
