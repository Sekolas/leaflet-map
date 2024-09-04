// src/App.js
import React, { useState } from 'react';
import MapComponent from './components/Map';
import RouteButtons from './components/RouteButton';
import routeData from './data/routes.json';

function App() {
  const [routeToDraw, setRouteToDraw] = useState(null);
  const [randomRoute, setRandomRoute] = useState(null);

  return (
    <div>
      <RouteButtons setRouteToDraw={setRouteToDraw} routeData={routeData} />
      <MapComponent drawRoute={routeToDraw} routeData={routeData} />
    </div>
  );
}

export default App;
