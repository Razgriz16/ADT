const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id_empleados: {
    type: String,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  tareas: {
    type: [String],
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
    type: [
      {
        tarea: {
          type: String,
          required: true,
        },
        puntos: {
          type: Number,
          required: true,
        }
      }
    ],
    required: true,
  }
});

module.exports = mongoose.model('users', userSchema);
