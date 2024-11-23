import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './slider.css'


const Terreno = () => {
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [empleadosSimilares, setEmpleadosSimilares] = useState([]);
  const [sliderValues, setSliderValues] = useState({});
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [comentario, setComentario] = useState('');
  const [editMode, setEditMode] = useState({}); // Para rastrear el modo de edición

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

  const handlePercentageClick = (index) => {
    setEditMode({ ...editMode, [index]: true });
};

const handlePercentageBlur = (index) => {
    setEditMode({ ...editMode, [index]: false });
};

const handlePercentageChange = (index, e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value)) value = 0;
    value = Math.min(100, Math.max(0, value)); // Asegura que el valor esté entre 0 y 100
    setSliderValues({ ...sliderValues, [index]: value });
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
            <div className="card-header">
                <h2 className="mb-0 d-inline-block p-2 bg-primary text-white rounded">Tareas Asignadas</h2>
            </div>
            <div className="card-body">
                <ul className="list-group list-group-flush">
                    {empleadoSeleccionado.tareas.map((tarea, index) => (
                        <li key={index} className="list-group-item">
                            <div className="card mb-3 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title mb-1 text-dark">Tarea {index + 1}: {tarea}</h5>
                                    <div className="d-flex align-items-center mb-2">  {/* Contenedor para alinear */}
                                      <input
                                          type="number"
                                          min="0"
                                          max="100"
                                          value={sliderValues[index] || 0}
                                          onChange={(e) => handlePercentageChange(index, e)}
                                          style={{ width: '60px', marginRight: '10px' }} // Ajusta el ancho y margen
                                      />
                                      <input
                                          type="range"
                                          min="0"
                                          max="100"
                                          value={sliderValues[index] || 0}
                                          className="form-range"
                                          onChange={(e) => {handleSliderChange(index, e.target.value);
                                            document.documentElement.style.setProperty('--percentage', `${e.target.value}%`);
                                          }}
                                          
                                          style={{ width: 'calc(100% - 70px)' }} // Ajusta el ancho del slider
                                      />
                                      <button onClick={() => handleSubmit(index)} className="btn btn-success ms-3 shadow-sm">
                                          Enviar
                                      </button>
                                </div>

                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Equipo de Trabajo */}
        <div className="card shadow-lg p-3 mb-4 bg-body rounded">
            <div className="card-header">
                <h2 className="mb-0 d-inline-block p-2 bg-primary text-white rounded">Equipo de Trabajo</h2>
            </div>
            <div className="card-body">

                {empleadosSimilares.map((empleado, index) => (
                    <div key={index} className="card mb-3 shadow-sm"> {/* Tarjeta para cada empleado */}
                        <div className="card-body">
                            <div className="d-flex align-items-center">
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
                                    {empleado.nombre.split(' ').map(palabra => palabra.charAt(0).toUpperCase()).slice(0, 2).join('')}
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="card-title mb-0 text-dark">{empleado.nombre}</h5>
                                    <p className="card-text text-muted mb-1">Área: {empleado.area}</p>
                                    <ul className="list-unstyled">
                                        {empleado.tareas.map((tarea, idx) => (
                                            <li key={idx} className="text-muted">{tarea}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
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
            <div className="mt-4 card p-3 shadow-sm">
                <textarea
                    className="form-control"
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
