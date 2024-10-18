import React, { useState } from 'react';
import './tareasterreno.css';

function TaskList({ tasks }) {
  // Initialize progress states for each task
  const [taskProgress, setTaskProgress] = useState(tasks.map((task) => task.progress));

  // Initialize comment states for each task
  const [taskComments, setTaskComments] = useState(tasks.map((task) => task.comments || ''));

  // Function to determine the color based on progress
  const getSliderColor = (progress) => {
    if (progress >= 70) return '#4caf50'; // Green for progress >= 70%
    if (progress >= 40) return '#ffeb3b'; // Yellow for 40-69%
    return '#f44336'; // Red for less than 40%
  };

  // Function to handle slider change
  const handleSliderChange = (index, event) => {
    const newProgress = [...taskProgress];
    newProgress[index] = event.target.value;
    setTaskProgress(newProgress);
  };

  // Function to handle comment change
  const handleCommentChange = (index, event) => {
    const newComments = [...taskComments];
    newComments[index] = event.target.value;
    setTaskComments(newComments);
  };

  return (
    <div>
      {tasks.map((task, index) => (
        <div key={task.id} className="task-card">
          <h4>{task.name}</h4>
          <p>{task.time}</p>

          <div className="slider-container">
            {/* Slider Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={taskProgress[index]}
              className="slider"
              onChange={(e) => handleSliderChange(index, e)}
              style={{
                background: `linear-gradient(90deg, ${getSliderColor(
                  taskProgress[index]
                )} ${taskProgress[index]}%, #e0e0e0 ${taskProgress[index]}%)`,
              }}
            />
            {/* Show progress value next to slider */}
            <span className="slider-value">{taskProgress[index]}%</span>
          </div>

          {/* Comment Box for each task */}
          <div className="comment-section">
            <textarea
              value={taskComments[index]}
              onChange={(e) => handleCommentChange(index, e)}
              placeholder="Añada algún comentario sobre esta tareaComentarios"
              className="comment-box"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
