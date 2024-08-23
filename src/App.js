import React, { useState } from 'react';
import MapComponent from './components/Map';

import './App.css';

const App = () => {
  const initialPosition = [];

  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);

  const handleButtonClick = (start, end) => {
    setStartPosition(start);
    setEndPosition(end);
  };

  return (
    <div className="App">
      <h1>React ile Leaflet Haritası</h1>
      <div className="button-group">
      </div>
      <MapComponent startPosition={startPosition} endPosition={endPosition} initialPosition={initialPosition} />
    </div>
  );
};

export default App;

