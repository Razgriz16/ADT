import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Supervisor.css';

// Función para convertir una cadena a minúsculas y eliminar tildes
const normalizarTexto = (texto) => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Elimina las tildes
};

const Supervisor = () => {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajesTerreno, setMensajesTerreno] = useState([]);
  const [areaCorrespondiente, setAreaCorrespondiente] = useState('');
  const [tareasSupervisor, setTareasSupervisor] = useState([]);

  const nombreSupervisor = localStorage.getItem("nombreSupervisor");

  const fetchSupervisor = () => {
    axios
      .get(`http://localhost:5000/api/supervisors`)
      .then((response) => {
        const supervisors = response.data;
        const supervisorEncontrado = supervisors.find(
          (supervisor) => supervisor.nombre === nombreSupervisor
        );

        if (supervisorEncontrado) {
          setAreaCorrespondiente(supervisorEncontrado.area);
          setTareasSupervisor(supervisorEncontrado.tareas || []);
        } else {
          console.log('Supervisor no encontrado');
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const fetchProgresoPorArea = () => {
    if (!areaCorrespondiente) {
      console.log(`Área ${areaCorrespondiente} no disponible`);
      return;
    }

    const areaCorrespondienteMinuscula = normalizarTexto(areaCorrespondiente);

    axios
      .get(`http://localhost:5000/api/users-area-${areaCorrespondienteMinuscula}`)
      .then((response) => {
        const usuarios = response.data;
        setUsuarios(usuarios);

        // Crear un objeto para sumar los puntos por tarea
        const sumaPuntosPorTarea = {};
        usuarios.forEach((usuario) => {
          usuario.progreso.forEach(({ tarea, puntos }) => {
            if (sumaPuntosPorTarea[tarea]) {
              sumaPuntosPorTarea[tarea] += puntos;
            } else {
              sumaPuntosPorTarea[tarea] = puntos;
            }
          });
        });

        // Formatear las tareas y los puntos para usarlas en el componente
        const tareasConProgreso = Object.entries(sumaPuntosPorTarea).map(([tarea, puntos]) => ({
          tarea,
          puntos: Math.min(puntos, 200), // Limitar a un máximo de 200
        }));
        setTareas(tareasConProgreso);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
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
    fetchSupervisor();
    fetchUsuariosConTareas();
  }, []);

  useEffect(() => {
    if (areaCorrespondiente) {
      fetchProgresoPorArea();
    }
  }, [areaCorrespondiente]);

  if (loading) return <div className="text-center mt-5"><p>Cargando...</p></div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  // Componente para mostrar las tareas asignadas con barra de progreso
// Modifica el componente TareasAsignadas
const TareasAsignadas = ({ tareas }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Progreso de Tareas Área {areaCorrespondiente}</h5>
        {tareas.map((tarea, index) => {
          const esTareaAsignada = tareasSupervisor.includes(tarea.tarea);
          return (
            <div
              key={index}
              className={`mb-3 p-3 ${esTareaAsignada ? 'resaltado' : ''}`}
              style={{ borderRadius: '8px' }}
            >
              <label>{tarea.tarea}</label>
              <div className="progress">
                <div
                  className={`progress-bar ${esTareaAsignada ? 'bg-warning' : 'bg-info'}`}
                  role="progressbar"
                  style={{ width: `${(tarea.puntos / 200) * 100}%` }}
                  aria-valuenow={tarea.puntos}
                  aria-valuemin="0"
                  aria-valuemax="200"
                >
                  {tarea.puntos} / 200
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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
      <div className="card text-center mb-4 shadow-lg p-3 bg-body rounded">
        <div className="card-body">
          <h1 className="card-title">Bienvenido</h1>
          <h2 className="card-subtitle mb-2 text-muted">{nombreSupervisor}</h2>
          <p className="card-text text-primary">Supervisor {areaCorrespondiente}</p>
        </div>
      </div>
      <div className="alert alert-info mt-3">
        {mensajesTerreno.length > 0
          ? mensajesTerreno.map((mensaje, index) => <p key={index}>{mensaje}</p>)
          : 'No hay mensajes nuevos'}
      </div>
      <TareasAsignadas tareas={tareas} />
      <EquipoDeTrabajo usuarios={usuarios} />
      
    </div>
  );
};

export default Supervisor;
