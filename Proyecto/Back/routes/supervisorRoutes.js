const express = require('express');
const { 
  crearSupervisor, 
  obtenerSupervisores, 
  obtenerSupervisorPorId, 
  actualizarSupervisor, 
  eliminarSupervisor 
} = require('../controllers/supervisorController');

const router = express.Router();


router.post('/supervisors', crearSupervisor); // Crear un supervisor
router.get('/supervisors', obtenerSupervisores); // Obtener todos los supervisore
router.get('/supervisors/:id', obtenerSupervisorPorId); // Obtener un supervisor por ID
router.put('/supervisors/:id', actualizarSupervisor); // Actualizar un supervisor por ID
router.delete('/supervisors/:id', eliminarSupervisor); // Eliminar un supervisor por ID

module.exports = router;
