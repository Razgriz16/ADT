const mongoose = require('mongoose');

const subgerenteSchema = new mongoose.Schema({
    id_subgerente: {
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
      }
    });

module.exports = mongoose.model('subgerentes', subgerenteSchema);


