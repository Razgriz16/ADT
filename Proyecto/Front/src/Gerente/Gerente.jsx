import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Gerente = () => {

  const nombreGerente = 'Mauricio Aguilera'

  const fetchGerente = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gerentes');
      const gerente = response.data.find(
        (gerente) => gerente.nombre === nombreGerente
      );
    }
    catch{
      console.log('Error al obtener los gerentes');
    }
  }

  const fetchTareasElectrica = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gerentes');
      const gerente = response.data.find(
        (gerente) => gerente.nombre === nombreGerente
      );
    }
    catch{
      console.log('Error al obtener los gerentes');
    }
  }

  const fetchTareasMecanica = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gerentes');
      const gerente = response.data.find(
        (gerente) => gerente.nombre === nombreGerente
      );
    }
    catch{
      console.log('Error al obtener los gerentes');
    }
  }
  const fetchTareasOperaciones = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/gerentes');
      const gerente = response.data.find(
        (gerente) => gerente.nombre === nombreGerente
      );
    }
    catch{
      console.log('Error al obtener los gerentes');
    }
  }
  useEffect(() => {
    fetchGerente();
    }, []);



  return (
    <div className="container mt-5">
      <div className="card text-center mb-4 shadow-lg p-3 bg-body rounded">
        <div className="card-body">
          <h1 className="card-title">Bienvenido</h1>
          <h2 className="card-subtitle mb-2 text-muted">{nombreGerente}</h2>
          <p className="card-text text-primary">Gerente</p>
        </div>
      </div>
    </div>
  );
};


export default Gerente;






