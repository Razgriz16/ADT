const User = require('../models/userModel');

/**
 * Calcula el total de puntos por tarea para un área específica.
 * @param {string} area - Área de los usuarios a considerar (e.g., 'Eléctrica').
 * @returns {Promise<Array>} - Lista de tareas con sus puntos totales.
 */
const calcularPuntosPorTarea = async (area) => {
  return User.aggregate([
    { $match: { rol: 'Terreno', area } },
    { $unwind: "$progreso" },
    {
      $group: {
        _id: "$progreso.tarea",
        totalPuntos: { $sum: "$progreso.puntos" },
        trabajadores: { $push: "$nombre" }
      }
    }
  ]);
};

module.exports = { calcularPuntosPorTarea };
