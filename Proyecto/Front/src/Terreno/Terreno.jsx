import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Asegúrate de tener Axios instalado o usa fetch si prefieres

const Terreno = () => {
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [empleadosSimilares, setEmpleadosSimilares] = useState([]);

  useEffect(() => {
    // Llamada inicial para obtener el empleado seleccionado (ejemplo: Fernanda Oyarce)
    axios.get('http://localhost:5000/api/users/tareasSimilares/Fernanda Oyarce')
      .then(response => {
        // Asignamos el empleado principal y los empleados con tareas similares
        setEmpleadoSeleccionado(response.data.usuarioPrincipal);
        setEmpleadosSimilares(response.data.usuariosConMismasTareas);
      })
      .catch(error => {
        console.error("Error al obtener los empleados similares", error);
      });
  }, []);

  if (!empleadoSeleccionado) {
    return <div>Cargando datos del empleado...</div>;
  }

  return (
    <div>
      <h1>Bienvenido: {empleadoSeleccionado.nombre}</h1>
      <p>Área: {empleadoSeleccionado.area}</p>
      <h2>Tareas</h2>
      <ul>
        {empleadoSeleccionado.tareas.map((tarea, index) => (
          <li key={index}>{tarea}</li>
        ))}
      </ul>

      <h2>Equipo de trabajo:</h2>
      <ul>
        {empleadosSimilares.map((empleado, index) => (
          <li key={index}>
            {empleado.nombre} - Área: {empleado.area}
            <ul>
              {empleado.tareas.map((tarea, idx) => (
                <li key={idx}>{tarea}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Terreno;
