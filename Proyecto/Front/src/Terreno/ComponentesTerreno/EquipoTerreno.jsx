import React from 'react';
import './equipoterreno.css';

function TeamMember({ member }) {
  return (
    <div className="team-member">
      <h4>{member.name}</h4>
      <ul>
        {member.tasks.map((task, index) => (
          <li key={index}>
            <strong>{task.task}:</strong> {task.comments || 'Sin comentarios'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TeamMember;
