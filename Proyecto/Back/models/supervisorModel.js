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
});

module.exports = mongoose.model('supervisors', supervisorSchema);
