// Mock del modelo User
jest.mock('../models/userModel', () => {
  return jest.fn().mockImplementation((userData) => ({
    ...userData,
    save: jest.fn().mockResolvedValue({ ...userData, _id: '123456789' }),
  }));
});



const User = require('../models/userModel'); // Importa el modelo mockeado
const { crearUser } = require('../controllers/userController'); // Importa el controlador a probar

describe('crearUser', () => {
  // Datos de prueba
  const mockUserData = {
    id_empleados: "EMP001",
    nombre: "Test User",
    rol: "desarrollador",
    area: "IT",
    tareas: ["Desarrollo frontend", "Testing"],
    correo: "test@example.com",
    contraseña: "password123",
    comentarios: "Usuario de prueba",
    progreso: [
      { tarea: "Desarrollo frontend", puntos: 80 },
      { tarea: "Testing", puntos: 90 },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks(); // Limpia los mocks después de cada prueba
  });

  it('debería crear un usuario exitosamente', async () => {
    const req = { body: mockUserData };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await crearUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200); // Verifica que la respuesta tenga el estado 200
    expect(res.json).toHaveBeenCalledWith({
      ...mockUserData,
      _id: '123456789', // Verifica que la respuesta incluya el ID
    });
  });

  it('debería manejar error cuando faltan campos requeridos', async () => {
    const datosIncompletos = { ...mockUserData };
    delete datosIncompletos.nombre; // Falta un campo requerido

    const req = { body: datosIncompletos };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Simula un error de validación al guardar
    User.mockImplementation(() => ({
      ...datosIncompletos,
      save: jest.fn().mockRejectedValue(
        new Error('Validation failed: nombre is required')
      ),
    }));

    await crearUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error al crear usuario',
      error: expect.any(Error),
    });
  });

  it('debería manejar error de id_empleados duplicado', async () => {
    const req = { body: mockUserData };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Simula un error de clave duplicada
    User.mockImplementation(() => ({
      ...mockUserData,
      save: jest.fn().mockRejectedValue(
        Object.assign(new Error('Duplicate key error'), {
          code: 11000,
          keyPattern: { id_empleados: 1 },
        })
      ),
    }));

    await crearUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error al crear usuario',
      error: expect.any(Error),
    });
  });
});
