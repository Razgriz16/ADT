const express = require('express');
const router = express.Router();
const xl = require('excel4node');
const Supervisor = require('../models/supervisorModel');
const Tarea = require('../models/tareaModel');
const User = require('../models/userModel');

// Función para generar el reporte combinado y de cada área en hojas separadas
const generarReporteCompleto = async (res) => {
  try {
    const areas = ["Eléctrica", "Mecánica", "Operaciones"];
    const workbook = new xl.Workbook();

    // Hoja 1: Reporte combinado de todas las áreas
    const worksheetCombinado = workbook.addWorksheet('Reporte Áreas Combinado');

    // Estilos de encabezado y contenido
    const headerStyle = workbook.createStyle({
      font: { bold: true, color: '#FFFFFF' },
      fill: { type: 'pattern', patternType: 'solid', fgColor: '#4F81BD' },
      alignment: { horizontal: 'center' }
    });

    const defaultStyle = workbook.createStyle({
      alignment: { horizontal: 'left' }
    });

    // Encabezados para la hoja combinada
    worksheetCombinado.cell(1, 1).string('Área').style(headerStyle);
    worksheetCombinado.cell(1, 2).string('Nombre Tarea').style(headerStyle);
    worksheetCombinado.cell(1, 3).string('Puntos Totales').style(headerStyle);

    let rowCombinado = 2;

    for (const area of areas) {
      // Obtener supervisores del área
      const supervisores = await Supervisor.find({ area });

      // Calcular total de puntos por tarea para trabajadores del área específica
      const progresoPorTarea = await User.aggregate([
        { $match: { rol: 'Terreno', area: area } },
        { $unwind: "$progreso" },
        {
          $group: {
            _id: "$progreso.tarea",
            totalPuntos: { $sum: "$progreso.puntos" },
            trabajadores: { $push: "$nombre" }
          }
        }
      ]);

      // Agregar filas al reporte combinado
      progresoPorTarea.forEach(tarea => {
        worksheetCombinado.cell(rowCombinado, 1).string(area).style(defaultStyle);
        worksheetCombinado.cell(rowCombinado, 2).string(tarea._id).style(defaultStyle);
        worksheetCombinado.cell(rowCombinado, 3).number(tarea.totalPuntos).style(defaultStyle);
        rowCombinado++;
      });

      // Crear una hoja específica para cada área
      const worksheetArea = workbook.addWorksheet(`Reporte ${area}`);

      // Encabezados para cada hoja de área
      worksheetArea.cell(1, 1).string('Área').style(headerStyle);
      worksheetArea.cell(1, 2).string('Supervisores').style(headerStyle);
      worksheetArea.cell(1, 3).string('Nombre Tarea').style(headerStyle);
      worksheetArea.cell(1, 4).string('Puntos Totales').style(headerStyle);
      worksheetArea.cell(1, 5).string('Trabajadores').style(headerStyle);

      // Agregar datos generales del área
      worksheetArea.cell(2, 1).string(area).style(defaultStyle);
      worksheetArea.cell(2, 2).string(supervisores.map(sup => sup.nombre).join(', ')).style(defaultStyle);

      // Agregar filas de progreso de tareas en la hoja del área
      let rowArea = 3;
      progresoPorTarea.forEach(tarea => {
        worksheetArea.cell(rowArea, 1).string(''); // Vacío para evitar duplicación
        worksheetArea.cell(rowArea, 2).string(''); // Vacío para evitar duplicación
        worksheetArea.cell(rowArea, 3).string(tarea._id).style(defaultStyle);
        worksheetArea.cell(rowArea, 4).number(tarea.totalPuntos).style(defaultStyle);
        worksheetArea.cell(rowArea, 5).string(tarea.trabajadores.join(', ')).style(defaultStyle);
        rowArea++;
      });

      // Ajustar el ancho de las columnas para cada hoja específica del área
      worksheetArea.column(1).setWidth(20); // Área
      worksheetArea.column(2).setWidth(50); // Supervisores
      worksheetArea.column(3).setWidth(30); // Nombre Tarea
      worksheetArea.column(4).setWidth(25); // Puntos Totales
      worksheetArea.column(5).setWidth(40); // Trabajadores
    }

    // Ajustar el ancho de las columnas en la hoja combinada
    worksheetCombinado.column(1).setWidth(20); // Área
    worksheetCombinado.column(2).setWidth(30); // Nombre Tarea
    worksheetCombinado.column(3).setWidth(25); // Puntos Totales

    // Configuración de respuesta para descargar el archivo Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=reporte_completo.xlsx');

    // Escribir el archivo a la respuesta
    workbook.write('reporte_completo.xlsx', res);

  } catch (error) {
    console.error("Error generando el reporte completo:", error);
    res.status(500).json({ error: "Error generando el reporte completo" });
  }
};

// Ruta para obtener el reporte completo con todas las áreas en diferentes hojas
router.get('/api/reporte-completo', async (req, res) => {
  generarReporteCompleto(res);
});

module.exports = router;
