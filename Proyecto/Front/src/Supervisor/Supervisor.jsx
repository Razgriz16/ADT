import React from 'react';
import './Supervisor.css'; // Import the CSS file for styling

const Dashboard = () => {
  const tasks = [
    { title: 'Ajuste de protecciones eléctricas ⭐', time: '9:41 AM', status: 'completed' },
    { title: 'Revisión puesta a tierra ⭐', time: '9:41 AM', status: 'in-progress' },
    { title: 'Cambio de aislantes', time: '9:41 AM', status: 'pending' },
    { title: 'Cambio de conductores', time: '9:41 AM', status: 'pending' },
  ];

  const teamMembers = [
    {
      name: 'Fernanda Oyarce',
      role: 'Ajuste de protecciones eléctricas',
      comments: 'Se completó sin problemas',
    },
    {
      name: 'Fernando Oyarce',
      role: 'Ajuste de protecciones eléctricas',
      comments: 'Revisión puesta a tierra',
    },
    {
      name: 'Felipe Oyarce',
      role: 'Ajuste de protecciones eléctricas',
      comments: 'Sin comentarios',
    },
  ];

  return (
    <div className="dashboard">
      <h1>Bienvenido</h1>
      <h2>David Pérez</h2>
      <h3>Supervisor área eléctrica</h3>

      <div className="tasks">
        {tasks.map((task, index) => (
          <div className="task" key={index}>
            <span className="task-title">{task.title}</span>
            <span className="task-time">{task.time}</span>
            <div className={`task-progress ${task.status}`}>
              {/* Progress can be represented with a progress bar if needed */}
              <div className="progress-bar" style={{ width: task.status === 'completed' ? '100%' : '50%' }} />
            </div>
          </div>
        ))}
      </div>

      <h3>Equipo de Trabajo</h3>
      <div className="team">
        {teamMembers.map((member, index) => (
          <div className="team-member" key={index}>
            <h4>{member.name}</h4>
            <p>{member.role}</p>
            <p>Comentarios: {member.comments}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
