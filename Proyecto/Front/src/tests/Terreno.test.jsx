import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios'
import Terreno from '../Terreno/Terreno';

jest.mock('axios');

// Mock más robusto para localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

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

  const mockHora = '2024-11-25T12:00:00.000Z';
  const mockDate = new Date(mockHora);

  beforeEach(() => {
    // Limpiamos todos los mocks
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('nombre', 'Empleado Prueba');

    // Mock más completo para Date
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
    global.Date.now = jest.fn(() => mockDate.getTime());

    // Mock de axios
    axios.get.mockResolvedValueOnce({
      data: {
        usuarioPrincipal: mockEmpleado,
        usuariosConMismasTareas: mockEmpleadosSimilares,
      },
    }).mockResolvedValueOnce({ data: { progreso: [] } });
    axios.put.mockResolvedValue({ data: 'Success' });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('updates slider value on change', async () => {
    render(<Terreno />);
    await waitFor(() => expect(screen.getByText('Bienvenido')).toBeInTheDocument());

    const sliders = screen.getAllByRole('slider');
    const numberInputs = screen.getAllByRole('spinbutton');

    fireEvent.change(sliders[0], { target: { value: '75' } });
    expect(numberInputs[0].value).toBe('75');

    fireEvent.change(sliders[1], { target: { value: '25' } });
    expect(numberInputs[1].value).toBe('25');
  });

  it('shows success alert on successful update', async () => {
    axios.put.mockResolvedValueOnce({ data: 'Success' });
    const alertMock = window.alert = jest.fn();

    render(<Terreno />);
    await waitFor(() => expect(screen.getByText('Bienvenido')).toBeInTheDocument());

    const sliders = screen.getAllByRole('slider');
    const submitButtons = screen.getAllByText('Enviar');

    fireEvent.change(sliders[0], { target: { value: '50' } });
    fireEvent.click(submitButtons[0]);

    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Actualización exitosa'));
  });

  it('renders employee information and tasks correctly', async () => {
    render(<Terreno />);
    await waitFor(() => expect(screen.getByText('Bienvenido')).toBeInTheDocument());

    expect(screen.getByRole('heading', { name: /Bienvenido/i })).toBeVisible();
    expect(screen.getByRole('heading', { level: 2, name: mockEmpleado.nombre })).toBeVisible();
    expect(screen.getByText(`Terreno área ${mockEmpleado.area}`)).toBeVisible();

    mockEmpleado.tareas.forEach((tarea, index) => {
      expect(screen.getByRole('heading', { name: `Tarea ${index + 1}: ${tarea}` })).toBeVisible();
    });
  });

  it('sends data to backend on submit', async () => {
    axios.put.mockResolvedValueOnce({ data: 'Success' });

    render(<Terreno />);
    await waitFor(() => expect(screen.getByText('Bienvenido')).toBeInTheDocument());

    const sliders = screen.getAllByRole('slider');
    const submitButtons = screen.getAllByText('Enviar');

    fireEvent.change(sliders[0], { target: { value: '75' } });
    fireEvent.click(submitButtons[0]);

    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
    expect(axios.put).toHaveBeenCalledWith(`http://localhost:5000/api/users/${mockEmpleado.id}`, {
      progreso: [
        { tarea: 'Tarea 1', puntos: 75, hora: mockHora },
        { tarea: 'Tarea 2', puntos: 0, hora: mockHora }
      ]
    });
  });

  it('sends a comment', async () => {
    render(<Terreno />);
    await waitFor(() => expect(screen.getByText('Bienvenido')).toBeInTheDocument());

    const addButton = screen.getByText('Añadir Comentario');
    fireEvent.click(addButton);

    const textarea = screen.getByPlaceholderText('Escribe tu comentario aquí...');
    const sendButton = screen.getByText('Enviar Comentario');
    const alertMock = window.alert = jest.fn();

    fireEvent.change(textarea, { target: { value: 'Este es un comentario de prueba.' } });
    fireEvent.click(sendButton);

    await waitFor(() => expect(alertMock).toHaveBeenCalledWith('Mensaje enviado: Este es un comentario de prueba.'));
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'mensajeTerreno',
        'Empleado Prueba: Este es un comentario de prueba.\n'
      );
    });
  });
});