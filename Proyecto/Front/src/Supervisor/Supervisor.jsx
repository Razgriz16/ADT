import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Supervisor.css'
// Componente principal
const Supervisor = () => {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajesTerreno, setMensajesTerreno] = useState([]);
  //const [progresoTerreno, setProgresoTerreno] = useState([]);
  const [areaCorrespondiente, setAreaCorrespondiente] = useState('');
  const [progresos, setProgresos] = useState([]);

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
          console.log(supervisorEncontrado)
          
        } else {
          console.log('Supervisor no encontrado');
          // Aquí puedes manejar el caso en el que no se encuentra al supervisor
          // Por ejemplo, mostrar un mensaje de error al usuario
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const fetchTareasElectricas = () => {
    if (!areaCorrespondiente) {
      console.log(`Área ${areaCorrespondiente} no disponible`);
      return;
    }
  
    axios.get(`http://localhost:5000/api/areas`)
      .then((response) => {
        const areas = response.data;
  
        // Buscar el área que coincide con areaCorrespondiente
        const areaSeleccionada = areas.find(area => area.nombre === areaCorrespondiente);
        if (areaSeleccionada) {
          setTareas(areaSeleccionada.tareas || []);
        } else {
          setError(`No se encontró el área: ${areaCorrespondiente}`);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  const handleNuevoMensaje = () => {
    const mensaje = localStorage.getItem('mensajeTerreno');
    if (mensaje) {
      setMensajesTerreno(prevMensajes => [...prevMensajes, mensaje]); // Agrega el mensaje al arreglo
      localStorage.removeItem('mensajeTerreno'); // Limpia el mensaje después de leerlo
      console.log(mensaje);
    }
  };

  

  // Función para actualizar los progresos desde localStorage
  const actualizarProgresos = () => {
    const datos = JSON.parse(localStorage.getItem('progresoTerreno')) || [];
    setProgresos(datos);
  };

/*
  const handleProgresoTareas = () => {
    const progreso = JSON.parse(localStorage.getItem('progresoTerreno')) || [];
    if (progreso) {
      setProgresoTerreno(prevProgreso => [...prevProgreso, progreso]); // Agrega el progreso al arreglo
      localStorage.removeItem('progresoTerreno'); // Limpia el progreso después de leerlo
      console.log(progreso);
    }
  };
  */

  const fetchUsuariosConTareas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const usuarios = await response.json();
      const usuariosFiltrados = usuarios.filter(usuario =>
        usuario.tareas.includes('Ajuste Protecciones') &&
        usuario.tareas.includes('Revisión Puesta Tierra')
      );
      setUsuarios(usuariosFiltrados);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupervisor();
    fetchUsuariosConTareas();
  
    
    window.addEventListener('storage', handleNuevoMensaje);
    handleNuevoMensaje();


    // Escuchar cambios en localStorage
    window.addEventListener('storage', actualizarProgresos);
    actualizarProgresos();

    // Cleanup listener
    return () => {
      window.removeEventListener('storage', handleNuevoMensaje, actualizarProgresos);
    };
  }, []);

  useEffect(() => {
    if (areaCorrespondiente) {
      fetchTareasElectricas();
    }
  }, [areaCorrespondiente]);

  if (loading) return <div className="text-center mt-5"><p>Cargando...</p></div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;


// Componente para mostrar las tareas asignadas con tareas 1 y 2 destacadas
  const TareasAsignadas = ({ tareas }) => {
    return (
      
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Tareas Área {areaCorrespondiente}</h5>
          {tareas.map((tarea, index) => (
            <div 
              key={index} 
              className={`mb-3 p-3 ${index < 2 ? 'bg-info text-white font-weight-bold' : ''}`}
              
              style={{ borderRadius: '8px' }}
            >
              
              <label>{`Tarea ${index + 1}`}</label>
              <p> {tarea}</p>  
              <div className="progress" ><div className="progress-bar bg-info" role="progressbar" aria-valuenow="0" aria-valuemin="50" aria-valuemax="100"></div></div>
              
              
            </div>
          ))}
        </div>
      </div>
    );
  };
  // Componente para mostrar el equipo de trabajo
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
      {/* Bienvenida */}
      
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossOrigin="anonymous"></link>
      <div >

  </div>
      <div className="card text-center mb-4 shadow-lg p-3 bg-body rounded">
        <div className="card-body">
          <h1 className="card-title">Bienvenido</h1>
          <h2 className="card-subtitle mb-2 text-muted">{nombreSupervisor}</h2>
          <p className="card-text text-primary">Supervisor {areaCorrespondiente}</p>
          
        </div>
      </div>
      <div className="alert alert-info mt-3">
        {mensajesTerreno.length > 0
          ? mensajesTerreno.map((mensaje, index) => (
              <p key={index}>{mensaje}</p>
            ))
          : 'No hay mensajes nuevos'}
      </div>
      <TareasAsignadas tareas={tareas} />
      <EquipoDeTrabajo usuarios={usuarios} />
      
      <div className="supervisor">
      <h5>Progreso de Tareas</h5>
      {progresos.map((progreso, index) => (
        <div key={index} className="d-flex align-items-center mb-2">
          <span>{progreso.tarea} - {progreso.hora}</span>
          <div className="progress ms-3" style={{ width: '50%' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progreso.progreso}%` }}
              aria-valuenow={(progreso.progreso)}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {progreso.progreso}%
            </div>
          </div>
        </div>
      ))}
    </div>
      



      </div>
)};

export default Supervisor;
