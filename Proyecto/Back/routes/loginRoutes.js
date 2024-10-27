const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Supervisor = require('../models/supervisorModel');
const Subgerente = require('../models/subgerenteModel');
const Gerente = require('../models/gerenteModel');

// Ruta de Login para todos los tipos de usuarios
router.post('/api/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    // Buscar el usuario en todas las colecciones posibles
    let user = await User.findOne({ correo }) ||
               await Supervisor.findOne({ correo }) ||
               await Subgerente.findOne({ correo }) ||
               await Gerente.findOne({ correo });

    if (!user) {
      return res.status(404).json("Usuario no encontrado");
    }

    // Verificar la contraseña
    if (user.contraseña === contraseña) {
      return res.json("Sesión iniciada correctamente");
    } else {
      return res.status(400).json("Contraseña incorrecta");
    }

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json("Error en el servidor");
  }
});

module.exports = router;
