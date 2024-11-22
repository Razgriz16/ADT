const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Tarea = require('../models/tareaModel');

// Ruta de reporte y actualización de puntostotales en la colección tareas para el área Eléctrica
router.get('/puntostotales/electrica', async (req, res) => {
  try {
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

    for (const tareaProgreso of progresoPorTarea) {
      const { _id: nombreTarea, totalPuntos } = tareaProgreso;
      await Tarea.findOneAndUpdate(
        { nombre: nombreTarea },
        { puntostotales: totalPuntos },
      );
    }

    res.json({ mensaje: "Reporte y actualización completados exitosamente para el área Eléctrica" });
  } catch (error) {
    console.error("Error en área Eléctrica:", error);
    res.status(500).json({ error: "Error generando el reporte o actualizando la colección tareas para el área Eléctrica" });
  }
});

// Ruta de reporte y actualización de puntostotales en la colección tareas para el área Mecánica
router.get('/puntostotales/mecanica', async (req, res) => {
  try {
    const progresoPorTarea = await User.aggregate([
      { $match: { rol: 'Terreno', area: 'Mecánica' } },
      { $unwind: "$progreso" },
      {
        $group: {
          _id: "$progreso.tarea",
          totalPuntos: { $sum: "$progreso.puntos" }
        }
      }
    ]);

    for (const tareaProgreso of progresoPorTarea) {
      const { _id: nombreTarea, totalPuntos } = tareaProgreso;
      await Tarea.findOneAndUpdate(
        { nombre: nombreTarea },
        { puntostotales: totalPuntos },
      );
    }

    res.json({ mensaje: "Reporte y actualización completados exitosamente para el área Mecánica" });
  } catch (error) {
    console.error("Error en área Mecánica:", error);
    res.status(500).json({ error: "Error generando el reporte o actualizando la colección tareas para el área Mecánica" });
  }
});

// Ruta de reporte y actualización de puntostotales en la colección tareas para el área Operaciones
router.get('/puntostotales/operaciones', async (req, res) => {
  try {
    const progresoPorTarea = await User.aggregate([
      { $match: { rol: 'Terreno', area: 'Operaciones' } },
      { $unwind: "$progreso" },
      {
        $group: {
          _id: "$progreso.tarea",
          totalPuntos: { $sum: "$progreso.puntos" }
        }
      }
    ]);

    for (const tareaProgreso of progresoPorTarea) {
      const { _id: nombreTarea, totalPuntos } = tareaProgreso;
      await Tarea.findOneAndUpdate(
        { nombre: nombreTarea },
        { puntostotales: totalPuntos },
      );
    }

    res.json({ mensaje: "Reporte y actualización completados exitosamente para el área Operaciones" });
  } catch (error) {
    console.error("Error en área Operaciones:", error);
    res.status(500).json({ error: "Error generando el reporte o actualizando la colección tareas para el área Operaciones" });
  }
});


module.exports = router;





