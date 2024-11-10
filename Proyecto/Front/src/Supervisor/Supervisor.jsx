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
  const [tareasArea, setTareasArea] = useState([]); // Todas las tareas del área
  const [progresoTareas, setProgresoTareas] = useState({}); // Progreso por tarea
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
          console.error('Supervisor no encontrado');
          setError('Supervisor no encontrado'); // Mostrar error en la UI
        }
      })
      .catch((error) => {
        console.error('Error al obtener supervisor:', error);
        setError('Error al obtener supervisor'); // Mostrar error en la UI
      });
  };

  const fetchTareas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/areas');
      const areaSeleccionada = response.data.find(area => area.nombre === areaCorrespondiente);
      if (areaSeleccionada) setTareasArea(areaSeleccionada.tareas || []);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      setError('Error al obtener tareas'); // Mostrar error en la UI
    }
  };

  const fetchProgresoPorArea = () => {
    if (!areaCorrespondiente) {
      return;
    }
  
    const areaCorrespondienteMinuscula = normalizarTexto(areaCorrespondiente);
  
    axios
      .get(`http://localhost:5000/api/users-area-${areaCorrespondienteMinuscula}`)
      .then((response) => {
        const usuarios = response.data;
        setUsuarios(usuarios);
  
        const nuevoProgresoTareas = {};
        const usuariosPorTarea = {}; // Objeto para contar usuarios por tarea
  
        usuarios.forEach((usuario) => {
          usuario.progreso.forEach(({ tarea, puntos }) => {
            nuevoProgresoTareas[tarea] = (nuevoProgresoTareas[tarea] || 0) + puntos;
            usuariosPorTarea[tarea] = (usuariosPorTarea[tarea] || 0) + 1;
          });
        });
  
        // Agregar la cantidad de usuarios a nuevoProgresoTareas
        Object.keys(nuevoProgresoTareas).forEach(tarea => {
          nuevoProgresoTareas[tarea] = {
            puntos: nuevoProgresoTareas[tarea],
            usuarios: usuariosPorTarea[tarea] || 0 // Si no hay usuarios, se pone 0
          }
        });
  
        setProgresoTareas(nuevoProgresoTareas);
      })
      .catch((error) => {
        console.error('Error al obtener progreso:', error);
        setError('Error al obtener el progreso de las tareas');
      })
      .finally(() => setLoading(false));
  };
  

  useEffect(() => {
    fetchSupervisor();
  }, []);

  useEffect(() => {
    if (areaCorrespondiente) {
      fetchTareas(); // Obtener tareas del área
      fetchProgresoPorArea();
      fetchUsuariosConTareas();// Obtener usuarios y su progreso
    }
  }, [areaCorrespondiente]);

  const fetchUsuariosConTareas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const usuarios = await response.json();
      const usuariosFiltrados = usuarios.filter(usuario => usuario.area === areaCorrespondiente);
      setUsuarios(usuariosFiltrados);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center mt-5"><p>Cargando...</p></div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  // Componente para mostrar las tareas asignadas con barra de progreso
// Modifica el componente TareasAsignadas
const TareasAsignadas = ({ tareas, progresoTareas }) => {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Progreso de Tareas Área {areaCorrespondiente}</h5>
        {tareas.map((tarea, index) => {
          const progreso = progresoTareas[tarea] || { puntos: 0, usuarios: 0 }; // Obtener progreso o valores por defecto
          const puntos = progreso.puntos;
          const maximo = progreso.usuarios * 100; // Calcular el máximo
          const porcentaje = maximo > 0 ? Math.min((puntos / maximo) * 100, 100) : 0; // Calcular porcentaje, manejar el caso maximo=0
          const esTareaAsignada = tareasSupervisor.includes(tarea);

          return (
            <div key={index} className="mb-3 p-3" style={{ borderRadius: '8px' }}>
              <div className="d-flex align-items-center">
                <label>{tarea}</label>
                {esTareaAsignada && <span className="ms-2 text-warning">★</span>}
              </div>
              <div className="progress">
                <div
                  className="progress-bar bg-info"
                  role="progressbar"
                  style={{ width: `${porcentaje}%` }}
                  aria-valuenow={puntos}
                  aria-valuemin="0"
                  aria-valuemax={maximo} // Usar el máximo calculado
                >
                  {puntos} / {maximo} {/* Mostrar puntos / máximo */}
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
      <TareasAsignadas tareas={tareasArea} progresoTareas={progresoTareas} /> {/* Pasar progresoTareas */}
      <EquipoDeTrabajo usuarios={usuarios} />
      
    </div>
  );
};

export default Supervisor;
