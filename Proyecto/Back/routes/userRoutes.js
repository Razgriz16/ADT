
const express = require('express');
const {
  crearUser,
  obtenerUsers,
  obtenerUserPorId,
  actualizarUser,
  eliminarUser,
  obtenerUsuariosConTareasYArea,
  obtenerTrabajadoresAreaElectrica,
  obtenerTrabajadoresAreaMecanica,
  obtenerTrabajadoresAreaOperaciones,
  obtenerTareasYUsuariosSimilares,
  registerUser,
  obtenerUserPorCorreo

  
} = require('../controllers/userController');


const router = express.Router();



router.post('/users', crearUser);// Crear un nuevo usuario
router.get('/users', obtenerUsers);// Obtener todos los usuarios
router.get('/users/:id', obtenerUserPorId);// Obtener un usuario por ID
router.put('/users/:id', actualizarUser);// Actualizar un usuario
router.delete('/users/:id', eliminarUser);// Eliminar un usuario

router.get('/users/email/:correo', obtenerUserPorCorreo);// Obtener un usuario por ID



router.get('/users-tareas-areas', obtenerUsuariosConTareasYArea);
router.get('/users-area-electrica',obtenerTrabajadoresAreaElectrica);
router.get('/users-area-mecanica',obtenerTrabajadoresAreaMecanica);
router.get('/users-area-operaciones',obtenerTrabajadoresAreaOperaciones);

router.get('/users/tareasSimilares/:nombre', obtenerTareasYUsuariosSimilares);//Tareas en comun que tienen los trabajadores


router.post('/users/register', registerUser); // Ruta para registrar un usuario





module.exports = router;

