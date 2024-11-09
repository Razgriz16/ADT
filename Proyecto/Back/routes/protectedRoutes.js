const express = require('express');
const router = express.Router();
const authenticateRole = require('../middleware/authenticateRole');

// Ruta solo para Terreno
router.get('/terreno', authenticateRole(['Terreno']), (req, res) => {
  res.json({ mensaje: "Bienvenido a la vista de Terreno" });
});

// Ruta solo para Supervisor
router.get('/supervisor', authenticateRole(['Supervisor']), (req, res) => {
  res.json({ mensaje: "Bienvenido a la vista de Supervisor" });
});

// Ruta solo para SubGerente
router.get('/subgerente', authenticateRole(['SubGerente']), (req, res) => {
  res.json({ mensaje: "Bienvenido a la vista de SubGerente" });
});

// Ruta solo para Gerente
router.get('/gerente', authenticateRole(['Gerente']), (req, res) => {
  res.json({ mensaje: "Bienvenido a la vista de Gerente" });
});

module.exports = router;
