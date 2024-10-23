const mongoose = require('mongoose');

const gerenteSchema = new mongoose.Schema({
  id_gerente: {
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
  correo: {
    type: String,
    required: true,
    unique: true,
  },
  contraseña: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('gerentes', gerenteSchema);
