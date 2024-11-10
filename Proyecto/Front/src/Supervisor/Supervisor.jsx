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
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">Tareas del área {areaCorrespondiente}</h3>
          </div>
          <div className="card-body">
            <ul className="list-unstyled">
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
                  <li key={index} className="mb-4">
                    <div className="mb-2">
                      <div className="d-flex align-items-center mb-2">
                        <strong>Tarea {index + 1}: {tarea}</strong>
                        {esTareaAsignada && <span className="ms-2 badge bg-warning">Asignada</span>}
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
                                backgroundColor: usuario.puntos >= 100 ? '#28a745' : '#ffc107'
                              }}></div>
                              <span>{usuario.nombre}: {usuario.puntos} puntos</span>
                            </div>
                          </div>
                        ))}
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

  const EquipoDeTrabajo = ({ usuarios }) => {
    return (
      <div className="col-12">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h3 className="mb-0">Equipo de Trabajo</h3>
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
                  <p className="mb-1 text-muted">Área: {usuario.area}</p>
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
                <button className="btn btn-primary btn-sm">Detalles</button>
              </div>
            ))}
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

      <div className="row">
        <TareasAsignadas tareas={tareasArea} progresoTareas={progresoTareas} />
        <EquipoDeTrabajo usuarios={usuarios} />
      </div>
    </div>
  );
};

export default Supervisor;