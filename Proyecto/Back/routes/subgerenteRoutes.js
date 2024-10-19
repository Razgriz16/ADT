const express = require('express');
const {
  crearSubgerente,
  getSubgerente,
  getSubgerenteById,
  actualizarSubgerente,
  eliminarSubgerente,
} = require('../controllers/subgerenteController');

const router = express.Router();

router.post('/subgerentes', crearSubgerente);
router.get('/subgerentes', getSubgerente);
router.get('/subgerentes/:id', getSubgerenteById);
router.put('/subgerentes/:id', actualizarSubgerente);
router.delete('/subgerentes/:id', eliminarSubgerente);

module.exports = router;
