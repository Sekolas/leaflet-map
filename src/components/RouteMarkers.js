// MapComponents/RouteMarkers.js
import React from 'react';
import { Marker, Circle } from 'react-leaflet';
import L from 'leaflet';
import routeData from '../data/routes.json';
import position1IconUrl from '../assets/marker.png';
import deliveryIconUrl from '../assets/ikon2.png';

const position1Icon = L.icon({
  iconUrl: position1IconUrl,
  iconSize: [40, 40],
  iconAnchor: [20, 30],
});

const deliveryIcon = L.icon({
  iconUrl: deliveryIconUrl,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const RouteMarkers = ({ selectedStartPoint, selectedEndPoint, onMarkerClick }) => {
  const route = routeData.routes[0];
  const startPosition = [route.start_point.location.latitude, route.start_point.location.longitude];
  const deliveryPoints = route.delivery_points.map(point => [
    point.location.latitude, point.location.longitude
  ]);

  return (
    <>
      <Marker
        position={startPosition}
        icon={position1Icon}
        eventHandlers={{
          click: () => onMarkerClick(startPosition),
        }}
      />
      <Circle center={startPosition} radius={25} color="red" />

      {deliveryPoints.map((position, index) => (
        <React.Fragment key={index}>
          <Marker
            position={position}
            icon={deliveryIcon}
            eventHandlers={{
              click: () => onMarkerClick(position),
            }}
          >
          </Marker>
          <Circle center={position} radius={25} color="orange" />
        </React.Fragment>
      ))}
    </>
  );
};

export default RouteMarkers;