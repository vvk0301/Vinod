import React from 'react';
import './ButtonGrid.css';

const ButtonGrid = ({ buttons, onButtonClick, loading }) => {
  if (!buttons || buttons.length === 0) {
    return null;
  }

  return (
    <div className="button-grid">
      {buttons.map((button) => (
        <button
          key={button.id}
          className="topic-button"
          onClick={() => onButtonClick(button.id)}
          disabled={loading}
        >
          <span className="button-icon">{button.icon}</span>
          <span className="button-label">{button.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ButtonGrid;