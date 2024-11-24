import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import mockAxios from '../__mocks__/axios'; // Importamos el mock
import Terreno from '../Terreno/Terreno';

jest.mock('../__mocks__/axios'); // Mockeamos usando la ruta al mock
// Mock para localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('Terreno Component', () => {
  const mockEmpleado = {
    id: 1,
    nombre: 'Empleado Prueba',
    area: 'Terreno',
    tareas: ['Tarea 1', 'Tarea 2'],
  };

  const mockEmpleadosSimilares = [
    { id: 2, nombre: 'Empleado 2', area: 'Terreno', tareas: ['Tarea 1'] },
    { id: 3, nombre: 'Empleado 3', area: 'Terreno', tareas: ['Tarea 2'] },
  ];

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('nombre', 'Empleado Prueba');
    mockAxios.get.mockResolvedValueOnce({
      data: {
        usuarioPrincipal: mockEmpleado,
        usuariosConMismasTareas: mockEmpleadosSimilares,
      },
    }).mockResolvedValueOnce({ data: { progreso: [] } });
  });

  it('updates slider value on change', async () => {
    // ... (código de la prueba del slider)
  });

  it('shows success alert on successful update', async () => {
    // ... (código de la prueba de la alerta)
  });

  it('renders employee information and tasks correctly', async () => {
    render(<Terreno />);

    // Espera a que la información del empleado se cargue
    await waitFor(() => expect(screen.getByText('Bienvenido')).toBeInTheDocument());

    // Verifica que la información del empleado se muestre correctamente
    expect(screen.getByRole('heading', { name: /Bienvenido/i })).toBeVisible();
    expect(screen.getByRole('heading', {  level: 2, name: mockEmpleado.nombre })).toBeVisible(); // level: 2 para h2
    expect(screen.getByText(`Terreno área ${mockEmpleado.area}`)).toBeVisible();

    // Verifica que las tareas se muestren correctamente
    mockEmpleado.tareas.forEach((tarea, index) => {
      expect(screen.getByRole('heading', { name: `Tarea ${index + 1}: ${tarea}` })).toBeVisible();
    });
  });
});