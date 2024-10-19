const Gerente = require('../models/gerenteModel');

// Crear Gerente
const crearGerente = async (req, res) => {
  const nuevoGerente = new Gerente(req.body);
  try {
    const gerenteGuardado = await nuevoGerente.save();
    res.status(201).json(gerenteGuardado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear gerente', error });
  }
};

// Obtener todos los gerentes
const getGerente = async (req, res) => {
  try {
    const gerentes = await Gerente.find();
    res.status(200).json(gerentes);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener gerentes', error });
  }
};

// Obtener un gerente por ID
const getGerenteById = async (req, res) => {
  try {
    const gerente = await Gerente.findById(req.params.id);
    res.status(200).json(gerente);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener gerente', error });
  }
};

// Actualizar gerente
const actualizarGerente = async (req, res) => {
  try {
    const gerenteActualizado = await Gerente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(gerenteActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar gerente', error });
  }
};

// Eliminar gerente
const eliminarGerente = async (req, res) => {
  try {
    await Gerente.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Gerente eliminado' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar gerente', error });
  }
};

module.exports = {
  crearGerente,
  getGerente,
  getGerenteById,
  actualizarGerente,
  eliminarGerente,
};
