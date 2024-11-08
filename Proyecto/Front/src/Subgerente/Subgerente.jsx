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
      console.log(`Área ${areaCorrespondiente} no disponible`);
      return;
    }
  
    const areaCorrespondienteMinuscula = normalizarTexto(areaCorrespondiente);
  
    axios
      .get(`http://localhost:5000/api/users-area-${areaCorrespondienteMinuscula}`)
      .then((response) => {
        const usuarios = response.data;
  
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
  
        // Formatear las tareas y los puntos
        const tareasConProgreso = Object.entries(sumaPuntosPorTarea).map(([tarea, puntos]) => ({
          tarea,
          puntos: Math.min(puntos, 200), // Limitar a un máximo de 200
        }));
        setTareasConProgreso(tareasConProgreso);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  };
  
  
  useEffect(() => {
    if (areaCorrespondiente) {
      fetchProgresoPorArea();
    }
  }, [areaCorrespondiente]);
  
  useEffect(() => {
    fetchSubgerente();
    fetchSupervisor();
    fetchTareas();
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
      {/* Columna de Supervisores */}
      <div className="col-md-6">
        <h3>Supervisores del área {areaCorrespondiente}</h3>
        <ul>
          {areaSupervisores.map((supervisor) => (
            <li key={supervisor._id}>
              <strong>{supervisor.nombre}</strong>
              <ul>
                {supervisor.tareas && supervisor.tareas.length > 0 ? (
                  supervisor.tareas.map((tarea, index) => (
                    <li key={index}>{tarea}</li>
                  ))
                ) : (
                  <li>No hay tareas asignadas</li>
                )}
              </ul>
              <button
                className="btn btn-danger mt-2"
                onClick={() => removeTasksFromSupervisor(supervisor._id)}
              >
                Eliminar Tareas Asignadas
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Columna de Tareas */}
      <div className="col-md-6">
  <h3>Tareas del área {areaCorrespondiente}</h3>
  <ul>
    {tareasArea.map((task, index) => {
      // Buscar el progreso de la tarea actual
      const progreso = tareasConProgreso.find((t) => t.tarea === task);
      return (
        <li key={index}>
          <div className="d-flex justify-content-between align-items-center">
            <span>Tarea {index + 1}: {task}</span>
            {progreso && (
              <div className="progress" style={{ width: '50%' }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${(progreso.puntos / 200) * 100}%` }}
                  aria-valuenow={progreso.puntos}
                  aria-valuemin="0"
                  aria-valuemax="200"
                >
                  {progreso.puntos}/200
                </div>
              </div>
            )}
          </div>
        </li>
      );
    })}
  </ul>
</div>

    </div>
  </div>
</div>

      {/* Botón para mostrar/ocultar vista de asignación */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAssignView((prev) => !prev)}
      >
        Asignar Tareas
      </button>

      {/* Vista de asignación de tareas */}
      {showAssignView && (
        <div>
          <div className="mb-3">
            <label htmlFor="supervisorSelect">Seleccionar Supervisor:</label>
            <select
              id="supervisorSelect"
              className="form-control"
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

          <div className="card shadow-lg p-3 bg-body rounded">
            <div className="card-body">
              <h3>Tareas del área {areaCorrespondiente}</h3>
              <ul>
                {tareasArea.map((task, index) => (
                  <li key={index}>
                    <input
                      type="checkbox"
                      value={task}
                      checked={selectedTasks.includes(task)}
                      onChange={() => handleTaskSelection(task)}
                    />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button className="btn btn-success mt-3" onClick={assignTasksToSupervisor}>
            Asignar Tareas al Supervisor
          </button>
        </div>
      )}
    </div>
  );
};

export default Subgerente;
