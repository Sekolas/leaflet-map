// src/components/RouteButtons.js
import React from 'react';
import '../css/Routebutton.css';

function RouteButtons({ setRouteToDraw, routeData }) {

  const drawRoute1 = () => {
    const route1 = [
      [routeData.routes[0].start_point.location.latitude, routeData.routes[0].start_point.location.longitude],
      [routeData.routes[0].delivery_points[0].location.latitude, routeData.routes[0].delivery_points[0].location.longitude],
    ];
    setRouteToDraw(route1);
  };

  const drawRoute2 = () => {
    const route2 = [
      [routeData.routes[0].start_point.location.latitude, routeData.routes[0].start_point.location.longitude],
      [routeData.routes[0].delivery_points[1].location.latitude, routeData.routes[0].delivery_points[1].location.longitude],
    ];
    setRouteToDraw(route2);
  };

  const drawFullRoute = () => {
    
    const startPosition = [routeData.routes[0].start_point.location.latitude, routeData.routes[0].start_point.location.longitude];
    
    
    const deliveryPoints = routeData.routes[0].delivery_points.map(point => [
      point.location.latitude, point.location.longitude
    ]);

    const fullRoute = [startPosition, ...deliveryPoints, startPosition];

    setRouteToDraw(fullRoute);
  };

  return (
    <div>
      <button className='route-button' onClick={drawRoute1}>Rota 1'i Çiz</button>
      <button className='route-button' onClick={drawRoute2}>Rota 2'yi Çiz</button>
      <button className='route-button' onClick={drawFullRoute}>Tüm Rotayı Çiz</button>
    </div>
  );
}

export default RouteButtons;
