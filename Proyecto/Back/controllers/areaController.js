const Area = require('../models/areaModel');

// Crear Área
const crearArea = async (req, res) => {
  const nuevaArea = new Area(req.body);
  try {
    const areaGuardada = await nuevaArea.save();
    res.status(201).json(areaGuardada);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear área', error });
  }
};

// Obtener todas las áreas
const getAreas = async (req, res) => {
  try {
    const areas = await Area.find();
    res.status(200).json(areas);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener áreas', error });
  }
};

// Obtener un área por ID
const getAreaById = async (req, res) => {
  try {
    const area = await Area.findById(req.params.id);
    res.status(200).json(area);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener área', error });
  }
};

// Actualizar área
const actualizarArea = async (req, res) => {
  try {
    const areaActualizada = await Area.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(areaActualizada);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar área', error });
  }
};


// Eliminar área
const eliminarArea = async (req, res) => {
  try {
    await Area.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Área eliminada' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar área', error });
  }
};

module.exports = {
  crearArea,
  getAreas,
  getAreaById,
  actualizarArea,
  eliminarArea,
};

