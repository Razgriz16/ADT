import React from 'react';

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Bienvenido</h1>
        <h2>Juan Mesa</h2>
        <h3>SubGerente área eléctrica</h3>
      </header>

      <section style={styles.supervisorSection}>
        <h4>Supervisores</h4>

        <div style={styles.supervisorCard}>
          <h5>David Pérez</h5>
          <ul>
            <li>Ajuste de protecciones eléctricas</li>
            <p>Comentarios: Completado sin problemas</p>
            <li>Revisión puesta a tierra</li>
            <p>Comentarios: Ausencia de implementos</p>
          </ul>
          <div style={styles.tasks}>
            <div style={styles.task}>
              <span>Tarea 1</span>
              <p>Ajuste de protecciones eléctricas</p>
              <span>9:41 AM</span>
              <div style={styles.progressBar}>
                <div style={styles.progress}></div>
              </div>
            </div>
            <div style={styles.task}>
              <span>Tarea 2</span>
              <p>Revisión puesta a tierra</p>
              <span>9:41 AM</span>
              <div style={styles.progressBar}>
                <div style={styles.progressHalf}></div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.supervisorCard}>
          <h5>Felipe Oyarce</h5>
          <ul>
            <li>Cambio de aislantes</li>
            <p>Comentarios: Completado sin problemas</p>
            <li>Cambio de conductores</li>
            <p>Comentarios: Completado sin problemas</p>
          </ul>
          <div style={styles.tasks}>
            <div style={styles.task}>
              <span>Tarea 3</span>
              <p>Cambio de aislantes</p>
              <span>9:41 AM</span>
              <div style={styles.progressBar}>
                <div style={styles.progress}></div>
              </div>
            </div>
            <div style={styles.task}>
              <span>Tarea 4</span>
              <p>Cambio de conductores</p>
              <span>9:41 AM</span>
              <div style={styles.progressBar}>
                <div style={styles.progress}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  supervisorSection: {
    marginTop: '20px',
  },
  supervisorCard: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  tasks: {
    marginTop: '20px',
  },
  task: {
    marginBottom: '10px',
  },
  progressBar: {
    width: '100%',
    height: '5px',
    backgroundColor: '#ccc',
    borderRadius: '5px',
  },
  progress: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4caf50',
  },
  progressHalf: {
    width: '50%',
    height: '100%',
    backgroundColor: '#4caf50',
  },
};

export default Dashboard;
