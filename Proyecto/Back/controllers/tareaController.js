const Tarea = require('../models/tareaModel');

// Crear Tarea
const crearTarea = async (req, res) => {
  const nuevaTarea = new Tarea(req.body);
  try {
    const tareaGuardada = await nuevaTarea.save();
    res.status(201).json(tareaGuardada);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear tarea', error });
  }
};

// Obtener todas las tareas
const getTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find();
    res.status(200).json(tareas);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener tareas', error });
  }
};

// Obtener una tarea por ID
const getTareaById = async (req, res) => {
  try {
    const tarea = await Tarea.findById(req.params.id);
    res.status(200).json(tarea);
  } catch (error) {
    res.status(400).json({ message: 'Error al obtener tarea', error });
  }
};

// Actualizar tarea
const actualizarTarea = async (req, res) => {
  try {
    const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(tareaActualizada);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar tarea', error });
  }
};

// Eliminar tarea
const eliminarTarea = async (req, res) => {
  try {
    await Tarea.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Tarea eliminada' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar tarea', error });
  }
};

module.exports = {
  crearTarea,
  getTareas,
  getTareaById,
  actualizarTarea,
  eliminarTarea,
};
