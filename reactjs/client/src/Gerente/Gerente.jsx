import React from "react";

const Task = ({ name, time, progress }) => (
  <div style={styles.taskContainer}>
    <div>
      <p style={styles.taskName}>{name}</p>
      <p style={styles.taskTime}>{time}</p>
    </div>
    <div style={styles.progressContainer}>
      <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
    </div>
  </div>
);

const Area = ({ title, supervisors, tasks }) => (
  <div style={styles.areaContainer}>
    <h3 style={styles.areaTitle}>{title}</h3>
    <p style={styles.supervisors}>Supervisores: {supervisors}</p>
    {tasks.map((task, index) => (
      <Task key={index} {...task} />
    ))}
  </div>
);

const Gerente = () => {
  const electricTasks = [
    { name: "Tarea 1: Ajuste de protecciones eléctricas", time: "9:41 AM", progress: 80 },
    { name: "Tarea 2: Revisión puesta a tierra", time: "9:41 AM", progress: 50 },
    { name: "Tarea 3: Cambio de aislantes", time: "9:41 AM", progress: 20 },
    { name: "Tarea 4: Cambio de conductores", time: "9:41 AM", progress: 0 },
  ];

  const mechanicTasks = [
    { name: "Tarea 1: Cambio de rodamientos", time: "9:41 AM", progress: 100 },
    { name: "Tarea 2: Cambio de aceite", time: "9:41 AM", progress: 60 },
    { name: "Tarea 3: Cambio de correas transportadoras", time: "9:41 AM", progress: 30 },
    { name: "Tarea 4: Mantenimiento general", time: "9:41 AM", progress: 10 },
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Bienvenido</h1>
        <h2>Mauricio Aguilera</h2>
        <h4>Gerente</h4>
      </header>
      <Area title="Área Eléctrica" supervisors="David Pérez, Felipe Oyarce" tasks={electricTasks} />
      <Area title="Área Mecánica" supervisors="Jaime Gonzalez, Jesus Salas" tasks={mechanicTasks} />
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  areaContainer: {
    marginBottom: "40px",
  },
  areaTitle: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  supervisors: {
    fontSize: "14px",
    color: "gray",
  },
  taskContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 0",
  },
  taskName: {
    fontSize: "16px",
  },
  taskTime: {
    fontSize: "12px",
    color: "gray",
  },
  progressContainer: {
    width: "50%",
    backgroundColor: "#f0f0f0",
    borderRadius: "5px",
    overflow: "hidden",
  },
  progressBar: {
    height: "10px",
    backgroundColor: "#4CAF50",
  },
};

export default Gerente;
