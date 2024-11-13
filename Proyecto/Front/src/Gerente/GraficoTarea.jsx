import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const GraficoTarea = ({ nombreTarea }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const progresoTerreno = JSON.parse(localStorage.getItem('progresoTerreno')) || [];

    const datosTarea = progresoTerreno.filter(item => item.tarea === nombreTarea);

    // Corrección 1: Parsear los puntos a números
    const data = datosTarea.map(item => parseInt(item.puntos, 10) || 0); // Maneja valores no numéricos

    // Corrección 2: Manejo correcto de las horas
    const labels = datosTarea.map(item => {
      const fecha = new Date(item.hora);
      const horas = fecha.getHours();
      const minutos = fecha.getMinutes();
      // Añadir la fecha si se repiten horas y minutos
      const fechaFormateada = datosTarea.filter(item2 => new Date(item2.hora).getHours() === horas && new Date(item2.hora).getMinutes() === minutos).length > 1 ? 
        `${fecha.getDate()}/${fecha.getMonth() + 1} ${horas}:${minutos.toString().padStart(2, '0')}`:
        `${horas}:${minutos.toString().padStart(2, '0')}`


      return fechaFormateada;
    });



    setChartData({
      labels,
      datasets: [
        {
          label: nombreTarea,
          data: data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    });
  }, [nombreTarea]);


  if (!chartData) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div style={{ width: '400px', margin: '20px auto' }}> {/* Añadido estilo para mejor visualización */}
      <h2>Progreso de {nombreTarea}</h2> {/* Título más descriptivo */}
      <Line data={chartData} options={{
        scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Puntos'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Hora'
              }
            }
          }
      }} />
    </div>
  );
};


export default GraficoTarea;