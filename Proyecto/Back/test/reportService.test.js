const { generarReportePorArea } = require('../services/reportService');

describe('generarReportePorArea', () => {
  it('debería generar un archivo Excel con los datos correctos', () => {
    const mockData = [
      { _id: 'Tarea1', totalPuntos: 10 },
      { _id: 'Tarea2', totalPuntos: 20 }
    ];
    const workbook = generarReportePorArea(mockData, 'Eléctrica');

    expect(workbook).toBeDefined();
    expect(workbook.sheets).toHaveLength(1); // Una hoja por área
  });
});


/*
Esta prueba verifica que la función generarReportePorArea crea un archivo Excel 
(o una representación del mismo) con al menos una hoja, lo que sugiere que la función está generando un reporte
 básico. No se verifican detalles específicos del contenido del Excel (por ejemplo, si los datos se han escrito 
 correctamente, si el formato es el esperado, etc.).
*/