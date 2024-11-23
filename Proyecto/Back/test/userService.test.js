const { calcularPuntosPorTarea } = require('../services/userService');
const User = require('../models/userModel');

jest.mock('../models/userModel');

describe('calcularPuntosPorTarea', () => {
  it('debería devolver puntos totales agrupados por tarea', async () => {
    const mockData = [
      { _id: 'Tarea1', totalPuntos: 10, trabajadores: ['Juan'] },
      { _id: 'Tarea2', totalPuntos: 20, trabajadores: ['Pedro'] }
    ];

    User.aggregate.mockResolvedValue(mockData);

    const resultado = await calcularPuntosPorTarea('Eléctrica');
    expect(resultado).toEqual(mockData);
    expect(User.aggregate).toHaveBeenCalledWith([
      { $match: { rol: 'Terreno', area: 'Eléctrica' } },
      { $unwind: "$progreso" },
      {
        $group: {
          _id: "$progreso.tarea",
          totalPuntos: { $sum: "$progreso.puntos" },
          trabajadores: { $push: "$nombre" }
        }
      }
    ]);
  });
});

module.exports = {
  calcularPuntosPorTarea
};


/*
Esta prueba asegura que la función calcularPuntosPorTarea realiza correctamente una consulta a la base de datos
para obtener los puntos totales por tarea en un área específica y que devuelve los resultados esperados.
*/