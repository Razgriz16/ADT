const express = require('express');
const {
  crearArea,
  getAreas,
  getAreaById,
  actualizarArea,
  eliminarArea,
} = require('../controllers/areaController');

const router = express.Router();

router.post('/areas', crearArea);
router.get('/areas', getAreas);
router.get('/areas/:id', getAreaById);
router.put('/areas/:id', actualizarArea);
router.delete('/areas/:id', eliminarArea);

module.exports = router;
