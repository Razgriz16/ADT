const Supervisor = require('../models/supervisorModel');

// Crear un supervisor
const crearSupervisor = async (req, res) => {
  const nuevoSupervisor = new Supervisor(req.body);
  try {
    const supervisorGuardado = await nuevoSupervisor.save();
    res.status(201).json(supervisorGuardado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear supervisor', error });
  }
};

// Obtener todos los supervisores
const obtenerSupervisores = async (req, res) => {
  try {
    const supervisores = await Supervisor.find();
    res.json(supervisores);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener supervisores', error });
  }
};

// Obtener un supervisor por ID
const obtenerSupervisorPorId = async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.params.id);
    if (!supervisor) return res.status(404).json({ message: 'Supervisor no encontrado' });
    res.json(supervisor);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener supervisor', error });
  }
};

// Actualizar un supervisor por ID
const actualizarSupervisor = async (req, res) => {
  try {
    const supervisorActualizado = await Supervisor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!supervisorActualizado) return res.status(404).json({ message: 'Supervisor no encontrado' });
    res.json(supervisorActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar supervisor', error });
  }
};

// Eliminar un supervisor por ID
const eliminarSupervisor = async (req, res) => {
  try {
    const supervisorEliminado = await Supervisor.findByIdAndDelete(req.params.id);
    if (!supervisorEliminado) return res.status(404).json({ message: 'Supervisor no encontrado' });
    res.json({ message: 'Supervisor eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar supervisor', error });
  }
};

module.exports = {
  crearSupervisor,
  obtenerSupervisores,
  obtenerSupervisorPorId,
  actualizarSupervisor,
  eliminarSupervisor
};
