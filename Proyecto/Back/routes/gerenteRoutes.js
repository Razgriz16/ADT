const express = require('express');
const {
  crearGerente,
  getGerente,
  getGerenteById,
  actualizarGerente,
  eliminarGerente,
} = require('../controllers/gerenteController');

const router = express.Router();

router.post('/gerentes', crearGerente);
router.get('/gerentes', getGerente);
router.get('/gerentes/:id', getGerenteById);
router.put('/gerentes/:id', actualizarGerente);
router.delete('/gerentes/:id', eliminarGerente);

module.exports = router;
