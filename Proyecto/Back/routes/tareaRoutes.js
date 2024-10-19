const express = require('express');
const {
  crearTarea,
  getTareas,
  getTareaById,
  actualizarTarea,
  eliminarTarea,
} = require('../controllers/tareaController');

const router = express.Router();

router.post('/tareas', crearTarea);
router.get('/tareas', getTareas);
router.get('/tareas/:id', getTareaById);
router.put('/tareas/:id', actualizarTarea);
router.delete('/tareas/:id', eliminarTarea);

module.exports = router;
