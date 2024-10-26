import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// Componente principal
const Supervisor = () => {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeTerreno, setMensajeTerreno] = useState(null);

  const fetchTareasElectricas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/areas');
      if (!response.ok) {
        throw new Error('Error al obtener las áreas');
      }
      const areas = await response.json();
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


  const handleNuevoMensaje = () => {
  const mensaje = localStorage.getItem('mensajeTerreno');
  if (mensaje) {
    setMensajeTerreno(mensaje);
    localStorage.removeItem('mensajeTerreno'); // Limpia el mensaje después de leerlo
    console.log(mensaje)
  }
  };


  const fetchUsuariosConTareas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const usuarios = await response.json();
      const usuariosFiltrados = usuarios.filter(usuario =>
        usuario.tareas.includes('Ajuste Protecciones') &&
        usuario.tareas.includes('Revisión Puesta Tierra')
      );
      setUsuarios(usuariosFiltrados);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareasElectricas();
    fetchUsuariosConTareas();
    handleNuevoMensaje();
  }, []);

  if (loading) return <div className="text-center mt-5"><p>Cargando...</p></div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

// Componente para mostrar las tareas asignadas con tareas 1 y 2 destacadas
  const TareasAsignadas = ({ tareas }) => {
    return (
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Tareas Área Eléctrica</h5>
          {tareas.map((tarea, index) => (
            <div 
              key={index} 
              className={`mb-3 p-3 ${index < 2 ? 'bg-info text-white font-weight-bold' : ''}`}
              style={{ borderRadius: '8px' }}
            >
              <label>{`Tarea ${index + 1}`}</label>
              <p>{tarea}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  // Componente para mostrar el equipo de trabajo
  const EquipoDeTrabajo = ({ usuarios }) => {
    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Equipo de Trabajo</h5>
          {usuarios.map((usuario, index) => (
            <div key={index} className="d-flex align-items-center mb-3">
              <div className="avatar me-3" style={{ width: '50px', height: '50px', backgroundColor: '#ccc', borderRadius: '50%' }}></div>
              <div>
                <h6>{usuario.nombre}</h6>
                <p>Área: {usuario.area}</p>
                <ul>
                  {usuario.tareas.map((tarea, tareaIndex) => (
                    <li key={tareaIndex}>{tarea}</li>
                  ))}
                </ul>
              </div>
              <button className="btn btn-primary ms-auto">Detalles</button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div className="container mt-5">
      {/* Bienvenida */}
      <div className="alert alert-info mt-3">
        {mensajeTerreno ? `Nuevo mensaje: ${mensajeTerreno}` : 'No hay mensajes nuevos'}
      </div>
      <div className="card text-center mb-4 shadow-lg p-3 bg-body rounded">
        <div className="card-body">
          <h1 className="card-title">Bienvenido</h1>
          <h2 className="card-subtitle mb-2 text-muted">David Pérez</h2>
          <p className="card-text text-primary">Supervisor área Eléctrica</p>
          
        </div>
      </div>
      <TareasAsignadas tareas={tareas} />
      <EquipoDeTrabajo usuarios={usuarios} />
      </div>
)};

export default Supervisor;
