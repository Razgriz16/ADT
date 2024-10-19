const mongoose = require('mongoose');

const areaSchema = new mongoose.Schema({
  id_area: {
    type: String,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  id_supervisor: {
    type: [String],
    required: true,
  },
  tareas: {
    type: [String],
    required: true,
  }
});

module.exports = mongoose.model('areas', areaSchema);
