const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Supervisor = require('../models/supervisorModel');
const Tarea = require('../models/tareaModel'); 

// Ruta para obtener el reporte de progreso en el área eléctrica
router.get('/api/reporte-electrica', async (req, res) => {
  try {
    // Obtener supervisores del área eléctrica
    const supervisores = await Supervisor.find({ area: 'Eléctrica' });

    // Obtener las tareas del área eléctrica junto con el progreso de puntos totales
    const tareasConProgreso = await Tarea.aggregate([
      { $match: { id_area: "2" } }, // Filtra el área eléctrica (asegúrate de que "id_area" coincida con tu base de datos)
      {
        $lookup: {
          from: 'users', // Cambia a la colección de usuarios en plural si es necesario
          let: { tarea_nombre: "$nombre" },
          pipeline: [
            { $match: { $expr: { $eq: ["$area", "Eléctrica"] } } },
            { $unwind: "$progreso" },
            { $match: { $expr: { $eq: ["$progreso.tarea", "$$tarea_nombre"] } } },
            {
              $group: {
                _id: "$progreso.tarea",
                totalPuntos: { $sum: "$progreso.puntos" },
                trabajadores: { $push: "$nombre" }
              }
            }
          ],
          as: "progresoTarea"
        }
      }
    ]);

    // Formato de respuesta
    const reporte = {
      area: "Eléctrica",
      supervisores: supervisores.map(sup => sup.nombre), // Lista de nombres de supervisores
      progresoTareas: tareasConProgreso.map(tarea => ({
        nombre: tarea.nombre,
        puntostotales: tarea.progresoTarea.length > 0 ? tarea.progresoTarea[0].totalPuntos : 0,
        trabajadores: tarea.progresoTarea.length > 0 ? tarea.progresoTarea[0].trabajadores : []
      }))
    };

    res.json(reporte);
  } catch (error) {
    console.error("Error generando el reporte:", error);
    res.status(500).json({ error: "Error generando el reporte" });
  }
});

module.exports = router;
