import React from 'react';
import TaskList from './ComponentesTerreno/TareasTerreno.jsx';
import TeamMember from './ComponentesTerreno/EquipoTerreno.jsx';
import figmaLogo from '../assets/image2.png';
import './Terreno.css';

function Terreno() {

    const tasks = [
        { id: 1, name: 'Ajuste de protecciones eléctricas', time: '9:41 AM', progress: 0 },
        { id: 2, name: 'Revisión puesta a tierra', time: '9:41 AM', progress: 0 },
      ];
    
      const team = [
        {
          id: 1,
          name: 'Fernanda Oyarce',
          tasks: [
            { task: 'Ajuste de protecciones eléctricas', comments: 'Completado sin problemas' },
            { task: 'Revisión puesta a tierra', comments: 'Ausencia de implementos' },
          ],
        },
        {
          id: 2,
          name: 'Fernando Oyarce',
          tasks: [
            { task: 'Ajuste de protecciones eléctricas', comments: '' },
            { task: 'Revisión puesta a tierra', comments: '' },
          ],
        },
        {
          id: 3,
          name: 'Felipe Oyarce',
          tasks: [
            { task: 'Ajuste de protecciones eléctricas', comments: '' },
            { task: 'Revisión puesta a tierra', comments: '' },
          ],
        },
      ];
    
    return(
<div className="app">
<header className="header">
  

      <div className="header-center">
        {/* Texto de bienvenida */}
        <h1>Bienvenido</h1>
        <h2>Fernanda Oyarce</h2>
        <h3>Terreno área eléctrica</h3>
      </div>

      <div className="header-right">
        {/* Imagen de perfil */}
        <img 
          src={figmaLogo}
          alt="Profile" 
          className="profile-img" 
        />
      </div>
    </header>
      <TaskList tasks={tasks} />

      <section className="team-section">
        <h3>Equipo de Trabajo</h3>
        <div className="team">
          {team.map((member) => (
            <TeamMember key={member.id} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Terreno;