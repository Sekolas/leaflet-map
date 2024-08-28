// src/components/RealtimeMarker.js

import React from 'react';

import { Marker, Popup } from 'react-leaflet';


const RealtimeMarker = ({ position, icon }) => (
  <Marker position={position} icon={icon}>
    <Popup>Konum Bilgisi</Popup>
  </Marker>
);

export default RealtimeMarker;