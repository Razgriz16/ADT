import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Supervisor = () => {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener las áreas y filtrar las tareas del área eléctrica
  const fetchTareasElectricas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/areas');
      if (!response.ok) {
        throw new Error('Error al obtener las áreas');
      }
      const areas = await response.json();

      // Filtrando el área eléctrica y extrayendo las tareas
      const areaElectrica = areas.find(area => area.nombre === 'Eléctrica');
      if (areaElectrica) {
        setTareas(areaElectrica.tareas || []);
      } else {
        setError('No se encontró el área eléctrica');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareasElectricas();
  }, []);

  if (loading) return <div className="text-center mt-5"><p>Cargando...</p></div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="jumbotron text-center bg-primary text-white">
        <h1>Bienvenido, David Perez</h1>
        <p>Tareas del Área Eléctrica</p>
      </div>

      <ul className="list-group">
        {tareas.map((tarea, index) => (
          <li
            key={index}
            className={`list-group-item ${index < 2 ? 'font-weight-bold text-success' : ''}`}
          >
            {tarea}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Supervisor;
