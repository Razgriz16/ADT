import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Gerente from '../Gerente/Gerente';
import axios from 'axios';

// Mock para los datos (mantener los mismos datos que tenías)
const mockAreasData = [
  {
    nombre: 'Eléctrica',
    tareas: ['Mantenimiento Eléctrico', 'Inspección de Cables']
  },
  {
    nombre: 'Mecánica',
    tareas: ['Cambio Rodamientos', 'Cambio Aceite']
  },
  {
    nombre: 'Operaciones',
    tareas: ['Cambio Correas Transportadoras', 'Inspección de Seguridad']
  }
];

const mockUsuariosData = [
  {
    nombre: 'Usuario1',
    progreso: [
      { tarea: 'Mantenimiento Eléctrico', puntos: 150 }
    ]
  },
  {
    nombre: 'Usuario2',
    progreso: [
      { tarea: 'Mantenimiento Eléctrico', puntos: 50 }
    ]
  }
];

const mockGraficoData = {
  labels: ['Enero', 'Febrero', 'Marzo'],
  datasets: [{
    label: 'Progreso',
    data: [65, 75, 85]
  }]
};

// Mock para axios
jest.mock('axios');

// Mock para ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

describe('Gerente Component', () => {
  beforeEach(() => {
    // Limpiar todos los mocks
    jest.clearAllMocks();
    
    // Configurar el DOM para el test
    document.body.innerHTML = '<div id="root"></div>';
    
    // Configurar respuestas mock para axios.get
    axios.get.mockImplementation((url) => {
      if (url === 'http://localhost:5000/api/areas') {
        return Promise.resolve({ data: mockAreasData });
      } else if (url.includes('users-area-electrica')) {
        return Promise.resolve({ data: mockUsuariosData });
      } else if (url.includes('users-area-mecanica')) {
        return Promise.resolve({ data: mockUsuariosData });
      } else if (url.includes('users-area-operaciones')) {
        return Promise.resolve({ data: mockUsuariosData });
      } else if (url.includes('/api/grafico/')) {
        return Promise.resolve({ data: mockGraficoData });
      } else if (url === 'http://localhost:5000/api/reporte-completo') {
        return Promise.resolve({
          data: new Blob(['mock data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
        });
      } else if (url.includes('/api/puntostotales/')) {
        return Promise.resolve({ data: {} });
      }
      return Promise.resolve({ data: {} });
    });
  });

  test('muestra correctamente las áreas y tareas', async () => {
    render(<Gerente />);

    // Esperar a que se carguen los datos y desaparezca el loading
    await waitFor(() => {
      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    });

    // Usar getAllByText para verificar la presencia del texto, independientemente de cuántas veces aparezca
    expect(screen.getAllByText(/Mantenimiento Eléctrico/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Cambio Rodamientos/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Cambio Correas Transportadoras/)[0]).toBeInTheDocument();

    // Verificar las áreas usando regex para hacer la búsqueda más flexible
    expect(screen.getByText(/Tareas del área Eléctrica/i)).toBeInTheDocument();
    expect(screen.getByText(/Tareas del área Mecánica/i)).toBeInTheDocument();
    expect(screen.getByText(/Tareas del área Operaciones/i)).toBeInTheDocument();
  });

  test('muestra correctamente los progresos de las tareas', async () => {
    render(<Gerente />);

    await waitFor(() => {
      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      const progressElements = screen.getAllByText(/puntos/, { exact: false });
      expect(progressElements.length).toBeGreaterThan(0);
      
      const userElements = screen.getAllByText(/usuarios completados/, { exact: false });
      expect(userElements.length).toBeGreaterThan(0);
    });

    expect(axios.get).toHaveBeenCalledWith(expect.stringMatching(/users-area-electrica/));
    expect(axios.get).toHaveBeenCalledWith(expect.stringMatching(/users-area-mecanica/));
    expect(axios.get).toHaveBeenCalledWith(expect.stringMatching(/users-area-operaciones/));
  });

  test('genera reporte correctamente', async () => {
    // Mock para URL.createObjectURL y URL.revokeObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    global.URL.revokeObjectURL = jest.fn();

    render(<Gerente />);

    // Esperar a que se cargue el componente
    await waitFor(() => {
      expect(screen.queryByText('Cargando...')).not.toBeInTheDocument();
    });

    // Hacer clic en el botón de generar reporte
    const generarReporteButton = screen.getByText('Generar Reporte');
    fireEvent.click(generarReporteButton);

    // Verificar que se realizaron las llamadas correctas
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/puntostotales/operaciones');
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/puntostotales/mecanica');
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/puntostotales/electrica');
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/reporte-completo', {
        responseType: 'blob'
      });
    });

    // Verificar que se creó el enlace de descarga
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });
});