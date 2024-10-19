const Subgerente = require('../models/subgerenteModel');

// Crear Subgerente
const crearSubgerente = async (req, res) => {
  const nuevoSubgerente = new Subgerente(req.body);
  try {
    const subgerenteGuardado = await nuevoSubgerente.save();
    res.status(201).json(subgerenteGuardado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear subgerente', error });
  }
};

// Obtener todos los subgerentes
const getSubgerente = async (req, res) => {
  try {
    const subgerente = await Subgerente.find();
    res.status(200).json(subgerente);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener subgerente', error });
  }
};

// Obtener un subgerente por ID
const getSubgerenteById = async (req, res) => {
  try {
    const subgerente = await Subgerente.findById(req.params.id);
    res.status(200).json(subgerente);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener subgerente', error });
  }
};

// Actualizar subgerente
const actualizarSubgerente = async (req, res) => {
  try {
    const subgerenteActualizado = await Subgerente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(subgerenteActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar subgerente', error });
  }
};

// Eliminar subgerente
const eliminarSubgerente = async (req, res) => {
  try {
    await Subgerente.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Subgerente eliminado' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar subgerente', error });
  }
};

module.exports = {
  crearSubgerente,
  getSubgerente,
  getSubgerenteById,
  actualizarSubgerente,
  eliminarSubgerente,
};
