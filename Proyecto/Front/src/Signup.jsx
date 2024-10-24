import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Supervisor = () => {
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    const obtenerTareasAreaElectrica = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tareas', {
          params: { id_area: "6706b51d8cffb5a4634ee7b0" } // Filtra por el ID del área eléctrica (2)
        });
        setTareas(response.data);
      } catch (error) {
        console.error("Error al obtener las tareas del área eléctrica:", error);
      }
    };

    obtenerTareasAreaElectrica();
  }, []);

  return (
    <div>
      <h1>Tareas del Área Eléctrica</h1>
      <ul>
        {tareas.map(tarea => (
          <li key={tarea._id}>{tarea.nombre}</li> // Asumiendo que hay un campo 'nombre' en las tareas
        ))}
      </ul>
    </div>
  );
};

export default Supervisor;
