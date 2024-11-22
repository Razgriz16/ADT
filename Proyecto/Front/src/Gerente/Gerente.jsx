import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import GraficoTarea from './GraficoTarea';

const normalizarTexto = (texto) => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const Gerente = () => {
  const [areas, setAreas] = useState({ Electrica: [], Mecanica: [], Operaciones: [] });
  const [progresos, setProgresos] = useState({ Electrica: [], Mecanica: [], Operaciones: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nombreGerente] = useState('Mauricio Aguilera');

  const fetchProgresoPorArea = async (areaNombre) => {
    try {
      const areaCorrespondienteMinuscula = normalizarTexto(areaNombre);
      const response = await axios.get(`http://localhost:5000/api/users-area-${areaCorrespondienteMinuscula}`);
      const usuarios = response.data;

      // Objeto para almacenar el progreso y usuarios por tarea
      const progresosPorTarea = {};

      // Procesar cada usuario y sus tareas
      usuarios.forEach(usuario => {
        usuario.progreso.forEach(({ tarea, puntos }) => {
          if (!progresosPorTarea[tarea]) {
            progresosPorTarea[tarea] = {
              puntosTotales: 0,
              cantidadUsuarios: 0,
              usuariosCompletados: 0
            };
          }

          progresosPorTarea[tarea].puntosTotales += puntos;
          progresosPorTarea[tarea].cantidadUsuarios += 1;
          
          // Contar usuarios que han completado la tarea (200 puntos)
          if (puntos >= 100) {
            progresosPorTarea[tarea].usuariosCompletados += 1;
          }
        });
      });

      // Convertir el objeto a un array con el formato deseado
      const progresoFinal = Object.entries(progresosPorTarea).map(([tarea, datos]) => ({
        tarea,
        puntos: datos.puntosTotales, // Ahora guardamos el total real sin promediar
        cantidadUsuarios: datos.cantidadUsuarios,
        usuariosCompletados: datos.usuariosCompletados,
        puntosPosibles: datos.cantidadUsuarios * 100 // Máximo posible para todos los usuarios
      }));

      setProgresos(prevProgresos => ({
        ...prevProgresos,
        [areaNombre]: progresoFinal
      }));
    } catch (error) {
      setError(`Error al cargar el progreso para el área ${areaNombre}`);
      console.error(`Error al obtener el progreso del área ${areaNombre}:`, error);
    }
  };

  const fetchData = async () => {
    try {
      const [areasResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/areas'),
      ]);

      const areasData = areasResponse.data;
      const areaElectrica = areasData.find((area) => area.nombre === 'Eléctrica');
      const areaMecanica = areasData.find((area) => area.nombre === 'Mecánica');
      const areaOperaciones = areasData.find((area) => area.nombre === 'Operaciones');

      setAreas({
        Electrica: areaElectrica ? areaElectrica.tareas : [],
        Mecanica: areaMecanica ? areaMecanica.tareas : [],
        Operaciones: areaOperaciones ? areaOperaciones.tareas : [],
      });

      await Promise.all([
        fetchProgresoPorArea('Electrica'),
        fetchProgresoPorArea('Mecanica'),
        fetchProgresoPorArea('Operaciones')
      ]);
    } catch (error) {
      setError('Error al cargar los datos');
      console.error('Error al obtener los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const generarReporte = async () => {
    const rutas = [
      'http://localhost:5000/api/puntostotales/operaciones',
      'http://localhost:5000/api/puntostotales/mecanica',
      'http://localhost:5000/api/puntostotales/electrica',
    ];
    try {
      await Promise.all(rutas.map(ruta => axios.get(ruta)));
      console.log("Llamadas a /puntostotales/* exitosas");

      const response = await axios.get('http://localhost:5000/api/reporte-completo', {
        responseType: 'blob', // Importante para archivos binarios
      });

      // Crear un URL temporal para el blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Crear un enlace de descarga
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte_completo.xlsx'); // O el nombre de archivo que desees

      // Agregar el enlace al documento y simular un clic
      document.body.appendChild(link);
      link.click();

      // Limpiar el URL temporal
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      alert('Error al generar el reporte. Por favor, inténtalo de nuevo.');
    }
  };

useEffect(() => {
    fetchData(); // Llamada inicial

    const intervalId = setInterval(fetchData, 3000); // Polling cada 5 segundos

    return () => clearInterval(intervalId); // Limpieza del intervalo
  }, []); // Sin dependencias, se ejecuta solo una vez al montar

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  const TareasArea = ({ areaNombre, tareas, tareasConProgreso }) => {
    return (
      <div className="col-md-6 mb-4">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">Tareas del área {areaNombre}</h3>
          </div>
          <div className="card-body">
            <ul className="list-unstyled">
              {tareas.map((task, index) => {
                const progreso = tareasConProgreso.find((t) => t.tarea === task) || {
                  puntos: 0,
                  cantidadUsuarios: 0,
                  usuariosCompletados: 0,
                  puntosPosibles: 0
                };
                
                const porcentajeProgreso = (progreso.puntos / progreso.puntosPosibles) * 100;
                const colorProgreso = porcentajeProgreso >= 100 ? 'bg-success' :
                                    porcentajeProgreso >= 50 ? 'bg-info' : 'bg-warning';

                return (
                  <li key={index} className="mb-3">
                    <div className="mb-2">
                      <strong>Tarea {index + 1}: {task}</strong>
                      <div className="text-muted">
                        <small>
                          {progreso.usuariosCompletados}/{progreso.cantidadUsuarios} usuarios completados 
                          | Máximo posible: {progreso.puntosPosibles} puntos
                        </small>
                      </div>
                    </div>
                    <div className="progress" style={{ height: '25px' }}>
                      <div
                        className={`progress-bar ${colorProgreso}`}
                        role="progressbar"
                        style={{ width: `${Math.min(porcentajeProgreso, 100)}%` }}
                        aria-valuenow={progreso.puntos}
                        aria-valuemin="0"
                        aria-valuemax={progreso.puntosPosibles}
                      >
                        {progreso.puntos}/{progreso.puntosPosibles} puntos
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mt-5">
      <div className="card text-center mb-4 shadow-lg">
        <div className="card-body">
          <h1 className="card-title">Bienvenido</h1>
          <h2 className="card-subtitle mb-2 text-muted">{nombreGerente}</h2>
          <p className="card-text text-primary">Gerente</p>
        </div>
      </div>
      {/* Agrega un margen superior para separar el botón */}
      <div className="d-grid gap-2 mt-4"> 
      <button 
        className="btn btn-success" 
        onClick={generarReporte} 
      >
        Generar Reporte
      </button>
      </div>
      <div className="row">
        <TareasArea areaNombre="Eléctrica" tareas={areas.Electrica} tareasConProgreso={progresos.Electrica} />
        <TareasArea areaNombre="Mecánica" tareas={areas.Mecanica} tareasConProgreso={progresos.Mecanica} />
        <TareasArea areaNombre="Operaciones" tareas={areas.Operaciones} tareasConProgreso={progresos.Operaciones} />
      </div>
      <div>
      <GraficoTarea nombreTarea="Cambio Rodamientos" /> {/* Muestra el gráfico para Cambio Rodamientos */}
      <GraficoTarea nombreTarea="Cambio Aceite" /> {/* Muestra el gráfico para Cambio Aceite */}
      <GraficoTarea nombreTarea="Cambio Correas Transportadoras" /> {/* Muestra el gráfico para Cambio Correas */}
    </div>
    </div>

    
  );
};

export default Gerente;