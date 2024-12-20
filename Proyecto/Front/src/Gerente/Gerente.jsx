import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// Componente para mostrar una lista de tareas con progreso


const Gerente = () => {
  const [areas, setAreas] = useState({ Electrica: [], Mecanica: [], Operaciones: []});
  const [progresos, setProgresos] = useState({ Electrica: [], Mecanica: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nombreGerente] = useState('Mauricio Aguilera');

  const fetchData = async () => {
    try {
      const [areasResponse, electricaUsuarios, mecanicaUsuarios, operacionesUsuarios] = await Promise.all([
        axios.get('http://localhost:5000/api/areas'),
        axios.get('http://localhost:5000/api/users-area-electrica'),
        axios.get('http://localhost:5000/api/users-area-mecanica'),
        axios.get('http://localhost:5000/api/users-area-operaciones'),
      ]);

      // Filtrar áreas y establecer tareas
      const areasData = areasResponse.data;
      const areaElectrica = areasData.find((area) => area.nombre === 'Eléctrica');
      const areaMecanica = areasData.find((area) => area.nombre === 'Mecánica');
      const areaOperaciones = areasData.find((area) => area.nombre === 'Operaciones');
      

      setAreas({
        Electrica: areaElectrica ? areaElectrica.tareas : [],
        Mecanica: areaMecanica ? areaMecanica.tareas : [],
        Operaciones: areaOperaciones ? areaOperaciones.tareas : [],
      });

      // Procesar progreso de usuarios
      const procesarProgreso = (usuarios) => {
        const sumaPuntosPorTarea = {};
        usuarios.forEach((usuario) => {
          usuario.progreso.forEach(({ tarea, puntos }) => {
            sumaPuntosPorTarea[tarea] = (sumaPuntosPorTarea[tarea] || 0) + puntos;
          });
        });
        return Object.entries(sumaPuntosPorTarea).map(([tarea, puntos]) => ({
          tarea,
          puntos: Math.min(puntos, 200),
        }));
      };

      setProgresos({
        Electrica: procesarProgreso(electricaUsuarios.data),
        Mecanica: procesarProgreso(mecanicaUsuarios.data),
        Operaciones: procesarProgreso(operacionesUsuarios.data)
      });
    } catch (error) {
      setError('Error al cargar los datos');
      console.error('Error al obtener los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  const TareasArea = ({ areaNombre, tareas, tareasConProgreso }) => {
    return (
      <div className="col-md-6">
      <h3>Tareas del área {areaNombre}</h3>
      <ul>
        {tareas.map((task, index) => {
          const progreso = tareasConProgreso.find((t) => t.tarea === task);
          const progresoPuntos = progreso ? progreso.puntos : 0; // Si no hay progreso, usar 0 puntos
          return (
            <li key={index}>
              <div className="d-flex justify-content-between align-items-center">
                <span>Tarea {index + 1}: {task}</span>
                <div className="progress" style={{ width: '50%' }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${(progresoPuntos / 200) * 100}%` }}
                    aria-valuenow={progresoPuntos}
                    aria-valuemin="0"
                    aria-valuemax="200"
                  >
                    {progresoPuntos}/200
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
    );
  };
  
  return (
    <div className="container mt-5">
      {/* Tarjeta de bienvenida */}
      <div className="card text-center mb-4 shadow-lg p-3 bg-body rounded">
        <div className="card-body">
          <h1 className="card-title">Bienvenido</h1>
          <h2 className="card-subtitle mb-2 text-muted">{nombreGerente}</h2>
          <p className="card-text text-primary">Gerente</p>
        </div>
      </div>

      {/* Tareas por área */}
      <TareasArea areaNombre="Eléctrica" tareas={areas.Electrica} tareasConProgreso={progresos.Electrica} />
      <TareasArea areaNombre="Mecánica" tareas={areas.Mecanica} tareasConProgreso={progresos.Mecanica} />
      <TareasArea areaNombre="Operaciones" tareas={areas.Operaciones} tareasConProgreso={progresos.Operaciones} />
    </div>
  );
};

export default Gerente;
