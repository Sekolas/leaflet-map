// MapComponents/InitialPositionMarker.js
import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';
import initialPositionIconUrl from '../assets/musoshi.png';

const initialPositionIcon = L.icon({
  iconUrl: initialPositionIconUrl,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const InitialPositionMarker = ({ position }) => {
  return (
    <Marker position={position} icon={initialPositionIcon}>
    </Marker>
  );
};

export default InitialPositionMarker;