import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Subgerente = () => {
  const [areaCorrespondiente, setAreaCorrespondiente] = useState('');
  const [areaSupervisores, setAreaSupervisores] = useState([]);
  const [tareasArea, setTareasArea] = useState([]);
  const nombreSubgerente = localStorage.getItem('nombreSubgerente');

  const fetchSubgerente = () => {
    axios
      .get('http://localhost:5000/api/subgerentes')
      .then((response) => {
        const subgerente = response.data.find(
          (subgerente) => subgerente.nombre === nombreSubgerente
        );
        if (subgerente) {
          setAreaCorrespondiente(subgerente.area);
        } else {
          console.log('Subgerente no encontrado');
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const fetchSupervisor = () => {
    axios
      .get('http://localhost:5000/api/supervisors')
      .then((response) => {
        const supervisoresArea = response.data.filter(
          (supervisor) => supervisor.area === areaCorrespondiente
        );
        setAreaSupervisores(supervisoresArea);
      })
      .catch((error) => console.error('Error:', error));
  };

  const fetchTareas = () => {
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
          setTareasArea(areaSeleccionada.tareas || []);
        } else {
          setError(`No se encontró el área: ${areaCorrespondiente}`);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };


  useEffect(() => {
    fetchSubgerente();
    
  }, []);

  useEffect(() => {
    if (areaCorrespondiente) {
      fetchSupervisor();
    }
  }, [areaCorrespondiente]);

  useEffect(() => {
    if (tareasArea) {
      fetchTareas();
    }
  }, [tareasArea]);
  

  return (
    <div className="container mt-5">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossOrigin="anonymous"
      />
      <div className="card text-center mb-4 shadow-lg p-3 bg-body rounded">
        <div className="card-body">
          <h1 className="card-title">Bienvenido</h1>
          <h2 className="card-subtitle mb-2 text-muted">{nombreSubgerente}</h2>
          <p className="card-text text-primary">Subgerente {areaCorrespondiente}</p>
        </div>
      </div>

      {/* Lista de supervisores del área */}
      <div className="card shadow-lg p-3 bg-body rounded">
        <div className="card-body">
          <h3>Supervisores del área {areaCorrespondiente}</h3>
          <ul>
            {areaSupervisores.map((supervisor) => (
              <li key={supervisor._id}>{supervisor.nombre}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lista de tareas del área */}
      <div className="card shadow-lg p-3 bg-body rounded">
        <div className="card-body">
          <h3>Tareas del área {areaCorrespondiente}</h3>
          <ul>
          {tareasArea.map((tareasArea, index) => (
            <div 
              key={index} 
              className={`mb-3 p-3 ${index >= 0 ? 'bg-info text-white font-weight-bold' : ''}`}
              
              style={{ borderRadius: '8px' }}
            >
              
              <label>{`Tarea ${index + 1}`}</label>
              <p> {tareasArea}</p>  
              
              
            </div>
          ))}
          </ul>
        </div>
      </div>

      
    </div>
  );
};

export default Subgerente;
