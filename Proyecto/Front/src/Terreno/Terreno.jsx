import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Terreno = () => {
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [empleadosSimilares, setEmpleadosSimilares] = useState([]);
  const [sliderValues, setSliderValues] = useState({});
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [comentario, setComentario] = useState('');

  const handleSliderChange = (index, value) => {
    setSliderValues((prevValues) => ({
      ...prevValues,
      [index]: value,
    }));
  };

  const handleSubmit = (index) => {
    const value = sliderValues[index] || 0;
    const horaActual = new Date().toLocaleTimeString(); // Captura la hora actual
    alert(`Valor del slider ${index + 1}: ${value}%\nHora: ${horaActual}`);
  };

  const handleEnviarComentario = () => {
    alert(`Mensaje enviado: ${comentario}`);
    setComentario(''); // Limpiar la caja de comentarios después de enviar
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/users/tareasSimilares/Fernanda Oyarce')
      .then((response) => {
        setEmpleadoSeleccionado(response.data.usuarioPrincipal);
        setEmpleadosSimilares(response.data.usuariosConMismasTareas);
      })
      .catch((error) => console.error('Error:', error));
  }, []);

  if (!empleadoSeleccionado) {
    return <div className="text-center text-secondary">Cargando datos del empleado...</div>;
  }

  return (
    <div className="container mt-5">
      {/* Bienvenida */}
      <div className="card text-center mb-4 shadow-sm">
        <div className="card-body">
          <h1 className="card-title">Bienvenido</h1>
          <h2 className="card-subtitle mb-2 text-muted">{empleadoSeleccionado.nombre}</h2>
          <p className="card-text">Terreno área {empleadoSeleccionado.area}</p>
        </div>
      </div>

      {/* Tareas */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Tareas</h2>
          <ul className="list-group list-group-flush">
            {empleadoSeleccionado.tareas.map((tarea, index) => (
              <li key={index} className="list-group-item d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="mb-1">Tarea {index + 1}</h5>
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
                    className="btn btn-success ms-3"
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
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Equipo de Trabajo</h2>
          {empleadosSimilares.map((empleado, index) => (
            <div key={index} className="d-flex align-items-center border-bottom py-3">
              <img
                src="https://via.placeholder.com/50"
                alt="Avatar"
                className="rounded-circle me-3"
              />
              <div className="flex-grow-1">
                <h5 className="mb-0">{empleado.nombre}</h5>
                <p className="text-muted mb-1">Área: {empleado.area}</p>
                <ul className="list-unstyled">
                  {empleado.tareas.map((tarea, idx) => (
                    <li key={idx} className="text-muted">• {tarea}</li>
                  ))}
                </ul>
              </div>
              <button className="btn btn-primary ms-auto">+</button>
            </div>
          ))}
        </div>
      </div>

      {/* Botón para mostrar/ocultar caja de comentarios */}
      <div className="text-center mt-4">
        <button
          className="btn btn-secondary"
          onClick={() => setMostrarComentarios(!mostrarComentarios)}
        >
          {mostrarComentarios ? 'Ocultar' : 'Añadir Comentario'}
        </button>
      </div>

      {/* Caja de comentarios */}
      {mostrarComentarios && (
        <div className="mt-3">
          <textarea
            className="form-control"
            rows="4"
            placeholder="Escribe tu comentario aquí..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          ></textarea>
          <div className="text-end mt-2">
            <button
              className="btn btn-primary"
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
