import React from 'react';
import { render, screen } from '@testing-library/react';
import Supervisor from '../Supervisor/Supervisor';
import { expect } from '@jest/globals';
import '@testing-library/jest-dom';
import axios from 'axios';

// Mock de axios
jest.mock('axios');

describe('Supervisor Component', () => {
  const mockSupervisor = { nombre: 'Supervisor Test', area: 'Área de Prueba', tareas: ['Tarea 1', 'Tarea 2'] };
  const mockTareasArea = ['Tarea 1', 'Tarea 2', 'Tarea 3'];
  const mockUsuariosArea = [
    { _id: '1', nombre: 'Usuario 1', tareas: ['Tarea 1'], progreso: [{ tarea: 'Tarea 1', puntos: 100 }] },
    { _id: '2', nombre: 'Usuario 2', tareas: ['Tarea 2'], progreso: [{ tarea: 'Tarea 2', puntos: 50 }] }
  ];
  const mockProgresoTareas = {
    'Tarea 1': { puntosTotales: 100, usuarios: [{ nombre: 'Usuario 1', puntos: 100 }], usuariosCompletados: 1 },
    'Tarea 2': { puntosTotales: 50, usuarios: [{ nombre: 'Usuario 2', puntos: 50 }], usuariosCompletados: 0 }
  };

  beforeEach(() => {
    localStorage.setItem('nombreSupervisor', mockSupervisor.nombre);

    // Mock secuencial de las respuestas para que cada llamada retorne la data correcta
    axios.get.mockImplementation((url) => {
      if (url === 'http://localhost:5000/api/supervisors') {
        return Promise.resolve({ data: [mockSupervisor] });
      } else if (url.startsWith('http://localhost:5000/api/areas')) {
        return Promise.resolve({ data: [{ nombre: mockSupervisor.area, tareas: mockTareasArea }] });
      } else if (url.startsWith('http://localhost:5000/api/users-area')) {
        return Promise.resolve({ data: mockUsuariosArea });
      } else if (url === `http://localhost:5000/api/users`) { // Asegúrate de tener un mock para fetchUsuariosConTareas
          return Promise.resolve({ data: mockUsuariosArea }); 
      } else {
        return Promise.reject("URL no mockeada: " + url) ; // Importante para detectar URLs no manejadas
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('muestra las tareas correctamente', async () => {
    render(<Supervisor />);
    // Usa un regex o query más robusta. Prueba también con debug() para ver el HTML del componente
    // y verificar cómo se renderizan las tareas
    mockTareasArea.forEach(async (tarea) => { // Ajusta según cómo se renderiza en tu JSX
        const tareaElement = await screen.findByText(new RegExp(tarea));
        expect(tareaElement).toBeInTheDocument();
    });    
  });

  test('muestra el equipo de trabajo correctamente', async () => {
    render(<Supervisor />);
    mockUsuariosArea.forEach(async (usuario) => {
        const usuarioElement = await screen.findByText(new RegExp(usuario.nombre));
        expect(usuarioElement).toBeInTheDocument();
    })
  });
});