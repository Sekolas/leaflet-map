// MapComponents/InitialPositionMarker.js
import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import initialPositionIconUrl from '../assets/musoshi.png';

const initialPositionIcon = L.icon({
  iconUrl: initialPositionIconUrl,
  iconSize: [30, 30],
  iconAnchor: [20, 30],
});

const InitialPositionMarker = ({ position }) => {
  return (
    <Marker position={position} icon={initialPositionIcon}>
    </Marker>
  );
};

export default InitialPositionMarker;