
const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Tarea = require('../models/tareaModel'); // Asumimos que tienes este modelo para la colección tareas

// Ruta de reporte y actualización de puntostotales en la colección tareas
router.get('/puntostotales/electrica', async (req, res) => {
  try {
    // Paso 1: Calcular total de puntos por tarea para trabajadores del área eléctrica
    const progresoPorTarea = await User.aggregate([
      { $match: { rol: 'Terreno', area: 'Eléctrica' } },
      { $unwind: "$progreso" },
      {
        $group: {
          _id: "$progreso.tarea",
          totalPuntos: { $sum: "$progreso.puntos" }
        }
      }
    ]);

    // Paso 2: Actualizar cada tarea en la colección tareas con el total de puntos correspondiente
    for (const tareaProgreso of progresoPorTarea) {
      const { _id: nombreTarea, totalPuntos } = tareaProgreso;

      // Buscar y actualizar la tarea en la colección tareas
      await Tarea.findOneAndUpdate(
        { nombre: nombreTarea }, // Condición de coincidencia
        { puntostotales: totalPuntos }, // Valor de actualización
        //{ new: true, upsert: true } // Crea la tarea si no existe
      );
    }

    res.json({ mensaje: "Reporte y actualización completados exitosamente" });
  } catch (error) {
    console.error("Error generando el reporte o actualizando la colección tareas:", error);
    res.status(500).json({ error: "Error generando el reporte o actualizando la colección tareas" });
  }
});

module.exports = router;





