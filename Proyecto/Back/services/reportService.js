const xl = require('excel4node');

/**
 * Genera un reporte Excel basado en los datos de progreso por tarea.
 * @param {Array} progresoPorTarea - Datos agregados por tarea.
 * @param {string} area - Nombre del área.
 * @returns {Workbook} - Archivo Excel generado.
 */
const generarReportePorArea = (progresoPorTarea, area) => {
  const workbook = new xl.Workbook();
  const worksheet = workbook.addWorksheet(`Reporte ${area}`);

  const headerStyle = workbook.createStyle({
    font: { bold: true, color: '#FFFFFF' },
    fill: { type: 'pattern', patternType: 'solid', fgColor: '#4F81BD' },
    alignment: { horizontal: 'center' }
  });

  worksheet.cell(1, 1).string('Tarea').style(headerStyle);
  worksheet.cell(1, 2).string('Puntos Totales').style(headerStyle);

  let row = 2;
  progresoPorTarea.forEach((tarea) => {
    worksheet.cell(row, 1).string(tarea._id);
    worksheet.cell(row, 2).number(tarea.totalPuntos);
    row++;
  });

  return workbook;
};

module.exports = { generarReportePorArea };
