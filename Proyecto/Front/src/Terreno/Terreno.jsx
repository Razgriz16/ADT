import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const Terreno = () => {
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [empleadosSimilares, setEmpleadosSimilares] = useState([]);
  const [sliderValues, setSliderValues] = useState({});
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [comentario, setComentario] = useState('');

  const handleTareasSimilares = () => {
    const nombre = localStorage.getItem('nombre');
    axios
      .get(`http://localhost:5000/api/users/tareasSimilares/${nombre}`)
      .then((response) => {
        setEmpleadoSeleccionado(response.data.usuarioPrincipal);
        setEmpleadosSimilares(response.data.usuariosConMismasTareas);

        // Obtener el progreso actual del usuario desde el backend
        const empleadoId = response.data.usuarioPrincipal.id;
        axios.get(`http://localhost:5000/api/users/${empleadoId}`)
          .then(userResponse => {
            const progresoActual = userResponse.data.progreso || []; // Manejar el caso donde no haya progreso
            const initialSliderValues = {};
            response.data.usuarioPrincipal.tareas.forEach((tarea, index) => {
              const progresoTarea = progresoActual.find(p => p.tarea === tarea);
              initialSliderValues[index] = progresoTarea ? progresoTarea.puntos : 0;
            });
            setSliderValues(initialSliderValues);
          })
          .catch(error => console.error("Error al obtener el usuario:", error));

      })
      .catch((error) => console.error('Error:', error));
  };


  const handleSliderChange = (index, value) => {
    setSliderValues((prevValues) => ({
      ...prevValues,
      [index]: value,
    }));
  };

  const handleSubmit = () => {
    const progresoArray = empleadoSeleccionado.tareas.map((nombreTarea, index) => ({
      tarea: nombreTarea,
      puntos: sliderValues[index] || 0,
      hora: new Date().toISOString(), // Guardar la hora en formato ISO
    }));
  
    // Obtener los progresos previos del localStorage y añadir los nuevos
    const mensajesPrevios = JSON.parse(localStorage.getItem('progresoTerreno')) || [];
    mensajesPrevios.push(...progresoArray);
    localStorage.setItem('progresoTerreno', JSON.stringify(mensajesPrevios));
    console.log(localStorage.getItem('progresoTerreno'))
  
    // Actualizar en el backend (esto permanece igual)
    const empleadoId = empleadoSeleccionado.id;
    axios.put(`http://localhost:5000/api/users/${empleadoId}`, { progreso: progresoArray })
      .then(response => {
        console.log("Actualización exitosa:", response.data);
        alert('Actualización exitosa');
      })
      .catch(error => {
        console.error("Error al actualizar:", error);
      });
  };

  const handleEnviarComentario = () => {
    const nombre = localStorage.getItem('nombre');
    const mensajeConNombre = `${nombre}: ${comentario}\n`;
    alert(`Mensaje enviado: ${comentario}`);
    localStorage.setItem('mensajeTerreno', mensajeConNombre);
    setComentario('');
  };

  useEffect(() => {
    handleTareasSimilares();
  }, []);


  if (!empleadoSeleccionado) {
    return <div className="text-center text-secondary">Cargando datos del empleado...</div>;
  }

  return (
    <div className="container mt-5">
      {/* Bienvenida */}
      
      <div className="card text-center mb-4 shadow-lg p-3 bg-body rounded">
        <div className="card-body">
          <h1 className="card-title">Bienvenido</h1>
          <h2 className="card-subtitle mb-2 text-muted">{empleadoSeleccionado.nombre}</h2>
          <p className="card-text text-primary">Terreno área {empleadoSeleccionado.area}</p>
        </div>
      </div>

      {/* Tareas */}
      <div className="card mb-4 shadow-sm p-3">
        <div className="card-body">
          <h2 className="card-title mb-4">Tareas Asignadas</h2>
          <ul className="list-group list-group-flush">
            {empleadoSeleccionado.tareas.map((tarea, index) => (
              <li key={index} className="list-group-item d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="mb-1 text-dark">Tarea {index + 1}</h5>
                  <small className="text-muted">{tarea}</small>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-3 text-primary fw-bold">
                    {sliderValues[index] || 0}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValues[index] || 0}
                    className="form-range"
                    onChange={(e) => handleSliderChange(index, e.target.value)}
                  />
                  <button
                    onClick={() => handleSubmit(index)}
                    className="btn btn-success ms-3 shadow-sm"
                  >
                    Enviar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Equipo de Trabajo */}
      <div className="card shadow-lg p-3 mb-4 bg-body rounded">
        <div className="card-body">
          <h2 className="card-title mb-4">Equipo de Trabajo</h2>
          {empleadosSimilares.map((empleado, index) => (
            <div key={index} className="d-flex align-items-center border-bottom py-3">
              <img
                src="https://via.placeholder.com/50"
                alt="Avatar"
                className="rounded-circle me-3"
              />
              <div className="flex-grow-1">
                <h5 className="mb-0 text-dark">{empleado.nombre}</h5>
                <p className="text-muted mb-1">Área: {empleado.area}</p>
                <ul className="list-unstyled">
                  {empleado.tareas.map((tarea, idx) => (
                    <li key={idx} className="text-muted">• {tarea}</li>
                  ))}
                </ul>
              </div>
              <button className="btn btn-outline-primary ms-auto">Detalles</button>
            </div>
          ))}
        </div>
      </div>

      {/* Botón para mostrar/ocultar caja de comentarios */}
      <div className="text-center mt-4">
        <button
          className={`btn ${mostrarComentarios ? 'btn-danger' : 'btn-secondary'} shadow-sm`}
          onClick={() => setMostrarComentarios(!mostrarComentarios)}
        >
          {mostrarComentarios ? 'Ocultar Comentario' : 'Añadir Comentario'}
        </button>
      </div>

      {/* Caja de comentarios */}
      {mostrarComentarios && (
        <div className="mt-4">
          <textarea
            className="form-control shadow-sm"
            rows="4"
            placeholder="Escribe tu comentario aquí..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          ></textarea>
          <div className="text-end mt-3">
            <button
              className="btn btn-primary shadow-sm"
              onClick={handleEnviarComentario}
            >
              Enviar Comentario
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Terreno;
