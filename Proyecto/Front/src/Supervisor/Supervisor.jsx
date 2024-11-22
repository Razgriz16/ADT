import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Supervisor.css';

const normalizarTexto = (texto) => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const Supervisor = () => {
  const [tareasArea, setTareasArea] = useState([]);
  const [progresoTareas, setProgresoTareas] = useState({});
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajesTerreno, setMensajesTerreno] = useState([]);
  const [areaCorrespondiente, setAreaCorrespondiente] = useState('');
  const [tareasSupervisor, setTareasSupervisor] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [tareasSeleccionadas, setTareasSeleccionadas] = useState([]);
  const [mostrarMenuAsignar, setMostrarMenuAsignar] = useState(false);
  const [mostrarMenuEliminar, setMostrarMenuEliminar] = useState(false);
  const [usuariosArea, setUsuariosArea] = useState([]); // Nuevo estado para almacenar usuarios del área

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
          setError('Supervisor no encontrado');
        }
      })
      .catch((error) => {
        console.error('Error al obtener supervisor:', error);
        setError('Error al obtener supervisor');
      });
  };

  const fetchTareas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/areas');
      const areaSeleccionada = response.data.find(area => area.nombre === areaCorrespondiente);
      if (areaSeleccionada) setTareasArea(areaSeleccionada.tareas || []);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      setError('Error al obtener tareas');
    }
  };

  const fetchProgresoPorArea = () => {
    if (!areaCorrespondiente) return;
    
    const areaCorrespondienteMinuscula = normalizarTexto(areaCorrespondiente);
    
    axios
      .get(`http://localhost:5000/api/users-area-${areaCorrespondienteMinuscula}`)
      .then((response) => {
        const usuarios = response.data;
        setUsuarios(usuarios);

        const nuevoProgresoTareas = {};

        usuarios.forEach((usuario) => {
          usuario.progreso.forEach(({ tarea, puntos }) => {
            if (!nuevoProgresoTareas[tarea]) {
              nuevoProgresoTareas[tarea] = {
                puntosTotales: 0,
                usuarios: [],
                usuariosCompletados: 0
              };
            }
            
            nuevoProgresoTareas[tarea].puntosTotales += puntos;
            nuevoProgresoTareas[tarea].usuarios.push({
              nombre: usuario.nombre,
              puntos: puntos
            });
            
            if (puntos >= 100) {
              nuevoProgresoTareas[tarea].usuariosCompletados += 1;
            }
          });
        });

        setProgresoTareas(nuevoProgresoTareas);
      })
      .catch((error) => {
        console.error('Error al obtener progreso:', error);
        setError('Error al obtener el progreso de las tareas');
      })
      .finally(() => setLoading(false));
  };

  // Función para manejar el cambio en el dropdown de usuarios
  const handleUsuarioChange = (e) => {
    setUsuarioSeleccionado(e.target.value);
  };


  // Función para manejar el cambio en los checkboxes de tareas
  const handleTareaChange = (tarea) => {
    setTareasSeleccionadas((prevTareas) => {
      if (prevTareas.includes(tarea)) {
        return prevTareas.filter((t) => t !== tarea);
      } else {
        return [...prevTareas, tarea];
      }
    });
  };

  const fetchUsuariosArea = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users-area-${normalizarTexto(areaCorrespondiente)}`); // Ajusta la URL si es necesario
      setUsuariosArea(response.data);
    } catch (error) {
      console.error('Error al obtener usuarios del área:', error);
    }
  };
      // Función para asignar las tareas al usuario seleccionado
      const asignarTareas = async () => {
        try {
          await axios.put(`http://localhost:5000/api/users/${usuarioSeleccionado}`, {
            tareas: tareasSeleccionadas,
          });
          alert('Tareas asignadas correctamente.');
          setMostrarMenuAsignar(false);
      
          // Actualiza el estado usuariosArea inmediatamente
          setUsuariosArea(prevUsuariosArea => {
            return prevUsuariosArea.map(usuario => {
              if (usuario._id === usuarioSeleccionado) {
                return { ...usuario, tareas: tareasSeleccionadas };
              }
              return usuario;
            });
          });
          fetchAllData(); // Esto puede ser opcional ahora, ya que estás actualizando el estado localmente
        } catch (error) {
          console.error('Error al asignar tareas:', error);
          alert('Error al asignar tareas.');
        }
      };

    // Función para manejar el cambio en el dropdown de usuarios para eliminar tareas
    const handleUsuarioEliminarChange = (e) => {
      setUsuarioSeleccionado(e.target.value);
    };
  
    // Función para eliminar una tarea específica de un usuario
    const eliminarTareaUsuario = async (usuarioId, tarea) => {
      try {
        const usuario = usuariosArea.find(u => u._id === usuarioId);
        const nuevasTareas = usuario.tareas.filter(t => t !== tarea);
        const nuevoProgreso = usuario.progreso.filter(p => p.tarea !== tarea); // Filtra el progreso
        await axios.put(`http://localhost:5000/api/users/${usuarioId}`, {
          tareas: nuevasTareas,
          progreso: nuevoProgreso
        });
        alert('Tarea eliminada correctamente.');

        // Actualiza el estado usuariosArea inmediatamente
      setUsuariosArea(prevUsuariosArea => {
        return prevUsuariosArea.map(usuario => {
          if (usuario._id === usuarioId) {
            return { ...usuario, tareas: nuevasTareas, progreso: nuevoProgreso }; // Actualiza ambos campos
          }
          return usuario;
        });
      });

      } catch (error) {
        console.error('Error al eliminar tarea:', error);
        alert('Error al eliminar tarea.');
      }
    };


  const fetchAllData = async () => {
    try {
      fetchSupervisor(); // Obtener la información del supervisor

      if (areaCorrespondiente) {
        await fetchTareas(); // Obtener las tareas
        fetchProgresoPorArea();  // Obtener el progreso (llama a fetchUsuariosConTareas internamente)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('Error al obtener datos');
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllData();
    fetchUsuariosArea();
    const mensajeAlmacenado = localStorage.getItem('mensajeTerreno');
    if (mensajeAlmacenado) {
      setMensajesTerreno([mensajeAlmacenado]);
      localStorage.removeItem('mensajeTerreno');
    }

    // Polling cada 5 segundos (ajusta según necesidad)
    const intervalId = setInterval(fetchAllData, 3000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [areaCorrespondiente]);  // Asegúrate de que se actualice cuando cambie el área

  useEffect(() => {
    fetchSupervisor();
    const mensajeAlmacenado = localStorage.getItem('mensajeTerreno');
    if (mensajeAlmacenado) {
      setMensajesTerreno([mensajeAlmacenado]);
      localStorage.removeItem('mensajeTerreno');
    }
  }, []);

  useEffect(() => {
    if (areaCorrespondiente) {
      fetchTareas();
      fetchProgresoPorArea();
      fetchUsuariosConTareas();
    }
  }, [areaCorrespondiente]);

  const fetchUsuariosConTareas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (!response.ok) throw new Error('Error al obtener los usuarios');
      const usuarios = await response.json();
      const usuariosFiltrados = usuarios.filter(usuario => usuario.area === areaCorrespondiente);
      setUsuarios(usuariosFiltrados);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center mt-5"><p>Cargando...</p></div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;

  const TareasAsignadas = ({ tareas, progresoTareas }) => {
    return (
      <div className="col-12 mb-4">
        <div className="card shadow">
          <div className="card-header">
            <h3 className="mb-0 d-inline-block p-2 bg-primary text-white rounded">
              Tareas del área {areaCorrespondiente}
            </h3>
          </div>
          <div className="card-body">
            {tareas.map((tarea, index) => {
              const progreso = progresoTareas[tarea] || {
                puntosTotales: 0,
                usuarios: [],
                usuariosCompletados: 0
              };
              
              const cantidadUsuarios = progreso.usuarios.length;
              const puntosPosibles = cantidadUsuarios * 100;
              const porcentajeProgreso = (progreso.puntosTotales / puntosPosibles) * 100;
              const colorProgreso = porcentajeProgreso >= 100 ? 'bg-success' :
                                  porcentajeProgreso >= 50 ? 'bg-info' : 'bg-warning';
              const esTareaAsignada = tareasSupervisor.includes(tarea);
  
              return (
                <div key={index} className="card mb-3 shadow-sm"> {/* Nueva card para cada tarea */}
                  <div className="card-body">
                    <div className="mb-2">
                      <div className="d-flex align-items-center mb-2">
                        <strong>Tarea {index + 1}: {tarea}</strong>
                        {esTareaAsignada && <span className="ms-2 badge bg-warning" style={{ backgroundColor: '#c6a700' }}>Asignada</span>}
                      </div>
                      <div className="text-muted mb-2">
                        <small>
                          {progreso.usuariosCompletados}/{cantidadUsuarios} usuarios completados 
                          | Máximo posible: {puntosPosibles} puntos
                        </small>
                      </div>
                    </div>
                    
                    <div className="progress mb-2" style={{ height: '25px' }}>
                      <div
                        className={`progress-bar ${colorProgreso}`}
                        role="progressbar"
                        style={{ width: `${Math.min(porcentajeProgreso, 100)}%` }}
                        aria-valuenow={progreso.puntosTotales}
                        aria-valuemin="0"
                        aria-valuemax={puntosPosibles}
                      >
                        {progreso.puntosTotales}/{puntosPosibles} puntos
                      </div>
                    </div>
  
                    <div className="mt-2">
                      <small className="text-muted">Personas trabajando en esta tarea:</small>
                      <div className="row mt-1">
                        {progreso.usuarios.map((usuario, idx) => (
                          <div key={idx} className="col-md-4 mb-1">
                            <div className="d-flex align-items-center">
                              <div className="me-2" style={{ 
                                width: '10px', 
                                height: '10px', 
                                borderRadius: '50%',
                                backgroundColor: usuario.puntos >= 100 ? '#28a745' : '#c6a700'
                              }}></div>
                              <span>{usuario.nombre}: {usuario.puntos} puntos</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  // El componente EquipoDeTrabajo se mantiene igual
  const EquipoDeTrabajo = ({ usuarios }) => {
    return (
      <div className="col-12">
        <div className="card shadow">
          <div className="card-header">
            <h3 className="mb-0 d-inline-block p-2 bg-primary text-white rounded">
              Equipo de Trabajo
            </h3>
          </div>
          <div className="card-body">
            {usuarios.map((usuario, index) => (
              <div key={index} className="d-flex align-items-center mb-3 p-3 border rounded">
                <div className="avatar me-3" style={{ 
                  width: '50px', 
                  height: '50px', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: '#6c757d'
                }}>
                  {usuario.nombre[0].toUpperCase()}
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1">{usuario.nombre}</h6>
                  <div>
                    <small className="text-muted">Tareas asignadas:</small>
                    <ul className="list-inline mb-0">
                      {usuario.tareas.map((tarea, tareaIndex) => (
                        <li key={tareaIndex} className="list-inline-item">
                          <span className="badge bg-light text-dark me-1">{tarea}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // El resto del código (botones, menús, etc.) se mantiene igual
  return (
    <div className="container mt-5">
      <div className="card text-center mb-4 shadow-lg">
        <div className="card-body">
          <h1 className="card-title">Bienvenido</h1>
          <h2 className="card-subtitle mb-2 text-muted">{nombreSupervisor}</h2>
          <p className="card-text text-primary">Supervisor {areaCorrespondiente}</p>
        </div>
      </div>
  
      {mensajesTerreno.length > 0 && (
        <div className="alert alert-info mb-4 shadow-sm">
          {mensajesTerreno.map((mensaje, index) => (
            <p key={index} className="mb-0">{mensaje}</p>
          ))}
        </div>
      )}
  
      <button className="btn btn-primary mb-3" onClick={() => setMostrarMenuAsignar(!mostrarMenuAsignar)} style={{ backgroundColor: '#0056b3' }}>
        Asignar Tareas
      </button>
  
      {mostrarMenuAsignar && (
        <div className="mt-3 p-3 border rounded">
          <select className="form-select mb-3" onChange={handleUsuarioChange} value={usuarioSeleccionado}>
            <option value="">Selecciona un usuario</option>
            {usuariosArea.map((usuario) => (
              <option key={usuario._id} value={usuario._id}>
                {usuario.nombre}
              </option>
            ))}
          </select>
  
          {tareasSupervisor.map((tarea, index) => ( // Usar tareasSupervisor aquí en lugar de tareasArea
            <div key={index} className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={tarea}
                id={`tarea-${index}`}
                onChange={() => handleTareaChange(tarea)}
                checked={tareasSeleccionadas.includes(tarea)}
              />
              <label className="form-check-label" htmlFor={`tarea-${index}`}>
                {tarea}
              </label>
            </div>
          ))}
  
          <button className="btn btn-success mt-3" onClick={asignarTareas}>
            Confirmar Asignación
          </button>
        </div>
      )}
  
  <button className="btn btn-danger mb-3" onClick={() => setMostrarMenuEliminar(!mostrarMenuEliminar)}>
        Eliminar Tareas
      </button>
  
      {mostrarMenuEliminar && (
        <div className="mt-3 p-3 border rounded">
          <select className="form-select mb-3" onChange={handleUsuarioEliminarChange} value={usuarioSeleccionado}>
            <option value="">Selecciona un usuario</option>
            {usuariosArea.map((usuario) => (
              <option key={usuario._id} value={usuario._id}>
                {usuario.nombre}
              </option>
            ))}
          </select>
  
          {usuarioSeleccionado && usuariosArea.find(u => u._id === usuarioSeleccionado).tareas.map((tarea, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center mb-2">
              <span>{tarea}</span>
              <button className="btn btn-sm btn-danger" onClick={() => eliminarTareaUsuario(usuarioSeleccionado, tarea)}>
              Eliminar
          </button>
        </div>
      ))}
    </div>
  )}
    <div className="row">
      <TareasAsignadas tareas={tareasArea} progresoTareas={progresoTareas} />
      <EquipoDeTrabajo usuarios={usuarios} />
    </div>
  </div>
);
};

export default Supervisor;