import React from 'react';
import '../css/InfoMessage.css';

const InfoMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="info-message">
      <div className="info-message-content">
        <p>{message}</p>
        <button onClick={onClose}>Kapat</button>
      </div>
    </div>
  );
};

export default InfoMessage;
