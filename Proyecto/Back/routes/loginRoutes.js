/*const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Supervisor = require('../models/supervisorModel');
const Subgerente = require('../models/subgerenteModel');
const Gerente = require('../models/gerenteModel');
const jwt = require('jsonwebtoken');



// Ruta de Login
router.post('/api/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    // Buscar al usuario en todas las colecciones
    const user = await User.findOne({ correo }) ||
                 await Supervisor.findOne({ correo }) ||
                 await Subgerente.findOne({ correo }) ||
                 await Gerente.findOne({ correo });

    if (!user || user.contraseña !== contraseña) {
      return res.status(400).json("Correo o contraseña incorrectos");
    }

    // Determinar rol basado en la colección en la que se encontró el usuario
    let rol;
    if (await User.findOne({ correo })) rol = 'Terreno';
    else if (await Supervisor.findOne({ correo })) rol = 'Supervisor';
    else if (await Subgerente.findOne({ correo })) rol = 'SubGerente';
    else if (await Gerente.findOne({ correo })) rol = 'Gerente';

    // Generar token
   // const token = jwt.sign({ userId: user._id, rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Generar token
const token = jwt.sign({ userId: user._id, role: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

    
    res.json({ mensaje: "Sesión iniciada correctamente", token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json("Error en el servidor");
  }
});

module.exports = router;
*/

const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Supervisor = require('../models/supervisorModel');
const Subgerente = require('../models/subgerenteModel');
const Gerente = require('../models/gerenteModel');
const jwt = require('jsonwebtoken');

// Ruta de Login
router.post('/api/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    // Buscar al usuario en todas las colecciones
    const user = await User.findOne({ correo }) ||
                 await Supervisor.findOne({ correo }) ||
                 await Subgerente.findOne({ correo }) ||
                 await Gerente.findOne({ correo });

    if (!user || user.contraseña !== contraseña) {
      return res.status(400).json("Correo o contraseña incorrectos");
    }

    // Determinar rol basado en la colección en la que se encontró el usuario
    let rol;
    if (await User.findOne({ correo })) rol = 'Terreno';
    else if (await Supervisor.findOne({ correo })) rol = 'Supervisor';
    else if (await Subgerente.findOne({ correo })) rol = 'SubGerente';
    else if (await Gerente.findOne({ correo })) rol = 'Gerente';

    // Generar token
    const token = jwt.sign({ userId: user._id, rol}, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ mensaje: "Sesión iniciada correctamente", token });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json("Error en el servidor");
  }
});

module.exports = router;



