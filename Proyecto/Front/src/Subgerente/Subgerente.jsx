import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const normalizarTexto = (texto) => {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Elimina las tildes
};

const Subgerente = () => {
  const [areaCorrespondiente, setAreaCorrespondiente] = useState('');
  const [areaSupervisores, setAreaSupervisores] = useState([]);
  const [tareasArea, setTareasArea] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showAssignView, setShowAssignView] = useState(false);
  const [tareasConProgreso, setTareasConProgreso] = useState([]);
  const [loading, setLoading] = useState(true);

  const nombreSubgerente = localStorage.getItem('nombreSubgerente');

  const fetchSubgerente = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/subgerentes');
      const subgerente = response.data.find(
        (subgerente) => subgerente.nombre === nombreSubgerente
      );
      if (subgerente) setAreaCorrespondiente(subgerente.area);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchSupervisor = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/supervisors');
      const supervisoresArea = response.data.filter(
        (supervisor) => supervisor.area === areaCorrespondiente
      );
      setAreaSupervisores(supervisoresArea);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchTareas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/areas');
      const areaSeleccionada = response.data.find(area => area.nombre === areaCorrespondiente);
      if (areaSeleccionada) setTareasArea(areaSeleccionada.tareas || []);
    } catch (error) {
      console.error('Error:', error);
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
  
        const nuevoProgresoTareas = {};
        const usuariosPorTarea = {};
  
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
            usuarios: usuariosPorTarea[tarea] || 0
          }
        });
  
        setTareasConProgreso(nuevoProgresoTareas); // Actualizar tareasConProgreso directamente
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  };

  const fetchAllData = async () => {
    try {
      await fetchSubgerente();
      await fetchSupervisor();
      await fetchTareas();
      fetchProgresoPorArea();
    } catch (error) {
      console.error("Error fetching data:", error);
      // Manejo de errores (mostrar un mensaje al usuario, etc.)
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    fetchAllData();  // Llamada inicial

    const intervalId = setInterval(fetchAllData, 3000); // Polling cada 5 segundos

    return () => clearInterval(intervalId); // Limpieza del intervalo
  }, [areaCorrespondiente]);
  
  
  useEffect(() => {
    if (areaCorrespondiente) {
      fetchProgresoPorArea();
    }
  }, [areaCorrespondiente]);
 

  const handleTaskSelection = (task) => {
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(task)
        ? prevSelectedTasks.filter((t) => t !== task)
        : [...prevSelectedTasks, task]
    );
  };

  const assignTasksToSupervisor = async () => {
    if (!selectedSupervisor || selectedTasks.length === 0) {
      alert("Por favor, selecciona un supervisor y al menos una tarea.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/supervisors/${selectedSupervisor}`, {
        tareas: selectedTasks,
      });
      fetchSupervisor(); // Actualizar la lista de supervisores
      alert("Tareas asignadas correctamente.");
      setSelectedTasks([]);
    } catch (error) {
      console.error("Error al asignar tareas:", error);
      alert("Error al asignar tareas.");
    }
  };

  const removeTasksFromSupervisor = async (supervisorId) => {
    try {
      await axios.put(`http://localhost:5000/api/supervisors/${supervisorId}`, {
        tareas: [],
      });
      fetchSupervisor(); // Actualizar la lista de supervisores después de la eliminación
      alert("Tareas eliminadas correctamente.");
    } catch (error) {
      console.error("Error al eliminar tareas:", error);
    }
  };

  return (
    <div className="container mt-5">
      {/* Bienvenida y datos generales */}
      <div className="card text-center mb-4 shadow-lg p-3 bg-body rounded">
        <div className="card-body">
          <h1 className="card-title">Bienvenido</h1>
          <h2 className="card-subtitle mb-2 text-muted">{nombreSubgerente}</h2>
          <p className="card-text text-primary">Subgerente {areaCorrespondiente}</p>
        </div>
      </div>

      <div className="card shadow-lg p-3 bg-body rounded">
  <div className="card-body">
    <div className="row">
      {/* Columna de Supervisores - Modificada */}
      <div className="col-md-6">
              <div className="card shadow"> {/* Tarjeta para los supervisores */}
                <div className="card-header bg-primary text-white">
                  <h3 className="mb-0">Supervisores del área {areaCorrespondiente}</h3>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled">
                    {areaSupervisores.map((supervisor) => (
                      <li key={supervisor._id} className="mb-3"> {/* Margen inferior */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                         <strong>{supervisor.nombre}</strong> {/* Nombre del supervisor con negrita */}
                        </div>
                        {/* Tareas asignadas al supervisor */}
                        <ul className="list-group list-group-flush"> {/* Lista con estilo flush */}
                          {supervisor.tareas && supervisor.tareas.length > 0 ? (
                            supervisor.tareas.map((tarea, index) => (
                              <li key={index} className="list-group-item">
                              <span className="ms-2">• {tarea}</span> {/* Viñeta añadida */}
                            </li>
                            ))
                          ) : (
                            <li className="list-group-item">No hay tareas asignadas</li>
                          )}
                        </ul>

                        {/* Botón para eliminar tareas - dentro de la tarjeta */}
                        <button
                          className="btn btn-danger btn-sm mt-2" // btn-sm para un botón más pequeño
                          onClick={() => removeTasksFromSupervisor(supervisor._id)}
                        >
                          Eliminar Tareas Asignadas
                        </button>
                      </li>
                    ))}
                  </ul>
                  {/* Botón para mostrar/ocultar vista de asignación */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAssignView((prev) => !prev)}
      >
        Asignar Tareas
      </button>
                </div>
              </div>
            </div>

       {/* Columna de Tareas - Modificada */}
       <div className="col-md-6">
              <div className="card shadow"> {/* Tarjeta como en la vista de Gerente */}
                <div className="card-header bg-primary text-white">
                  <h3 className="mb-0">Tareas del área {areaCorrespondiente}</h3>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled"> {/* Lista sin estilo */}
                    {tareasArea.map((task, index) => {
                      const progreso = tareasConProgreso[task] || { puntos: 0, usuarios: 0 };
                      const puntos = progreso.puntos;
                      const maximo = progreso.usuarios * 100;
                      const porcentaje = maximo > 0 ? Math.min((puntos / maximo) * 100, 100) : 0;
                      const colorProgreso = porcentaje >= 100 ? 'bg-success' : porcentaje >= 50 ? 'bg-info' : 'bg-warning';

                      return (
                        <li key={index} className="mb-3"> {/* Margen inferior */}
                          <div className="mb-2"> {/* Margen inferior */}
                            <strong>Tarea {index + 1}: {task}</strong>
                            <div className="text-muted">
                              <small>
                              {/*Se corrige la cantidad de usuarios completados, que antes mostraba la cantidad de usuarios y no los completados*/}
                                {progreso.usuariosCompletados}/{progreso.usuarios} usuarios completados 
                                | Máximo posible: {maximo} puntos
                              </small>
                            </div>
                          </div>
                          <div className="progress" style={{ height: '25px' }}>
                            <div
                              className={`progress-bar ${colorProgreso}`}
                              role="progressbar"
                              style={{ width: `${porcentaje}%` }}
                              aria-valuenow={puntos}
                              aria-valuemin="0"
                              aria-valuemax={maximo}
                            >
                              {puntos}/{maximo} puntos
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

    </div>
  </div>
</div>

      

      {/* Vista de asignación de tareas - Modificada */}
      {showAssignView && (
        <div className="card shadow-lg p-3 bg-body rounded"> {/* Tarjeta principal */}
          <div className="card-body">
            {/* Selección de Supervisor */}
            <div className="mb-3">
              <label htmlFor="supervisorSelect" className="form-label">Seleccionar Supervisor:</label>
              <select
                id="supervisorSelect"
                className="form-select"
                onChange={(e) => setSelectedSupervisor(e.target.value)}
              >
                <option value="">Selecciona un Supervisor</option>
                {areaSupervisores.map((supervisor) => (
                  <option key={supervisor._id} value={supervisor._id}>
                    {supervisor.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Selección de Tareas */}
            <div className="card shadow"> {/* Tarjeta para las tareas */}
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">Tareas del área {areaCorrespondiente}</h3>
              </div>
              <div className="card-body">
                <ul className="list-unstyled">
                  {tareasArea.map((task, index) => (
                    <li key={index} className="mb-2 form-check"> {/* Margen y estilo form-check */}
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`taskCheckbox-${index}`}
                        value={task}
                        checked={selectedTasks.includes(task)}
                        onChange={() => handleTaskSelection(task)}
                      />
                      <label className="form-check-label" htmlFor={`taskCheckbox-${index}`}>
                        {task}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Botón de Asignar */}
             <button className="btn btn-success mt-3" onClick={assignTasksToSupervisor}>
               Asignar Tareas al Supervisor
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subgerente;
