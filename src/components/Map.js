// Map.js
import React, { useRef, useEffect, useState } from 'react';
<<<<<<< Updated upstream
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';
=======
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
>>>>>>> Stashed changes
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

import MapClickHandler from './MapClickHandler';
import InitialPositionMarker from './InitialPositionMarker';
import RouteMarkers from './RouteMarkers';
import RouteControl from './RouteControl';
import InfoMessage from './PopupMessage'; // Bu dosyayı da eklemeniz gerekebilir

const MapComponent = ({ randomRoute, drawRoute }) => {
  const mapRef = useRef(null);
  const [initialPosition, setInitialPosition] = useState([39.748566, 30.474826]);
  const [selectedStartPoint, setSelectedStartPoint] = useState(null);
  const [selectedEndPoint, setSelectedEndPoint] = useState(null);
  const [initialToStartRoute, setInitialToStartRoute] = useState(null);
  const [isRoutingControlReady, setIsRoutingControlReady] = useState(false);
  const [message, setMessage] = useState('');
  const count = useRef(false);

  const handleCloseMessage = () => setMessage('');
  
  const handleMarkerClick = (position) => {
    if (!selectedStartPoint) {
      setSelectedStartPoint(position);
    } else if (!selectedEndPoint) {
      setSelectedEndPoint(position);
    } else {
      setSelectedStartPoint(position);
      setSelectedEndPoint(null);
      setIsRoutingControlReady(false);
    }
  };

  // MapContainer dışına taşıdık
  const handleMapClick = (e) => {
    setInitialPosition([e.latlng.lat, e.latlng.lng]);
    mapRef.current.panTo([e.latlng.lat, e.latlng.lng]);
  };

  return (
    <div>
      <MapContainer
        ref={mapRef}
        center={initialPosition}
        zoom={13}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />

        <MapClickHandler onClick={handleMapClick} />

        <InitialPositionMarker position={initialPosition} />

        <RouteMarkers 
          selectedStartPoint={selectedStartPoint} 
          selectedEndPoint={selectedEndPoint} 
          onMarkerClick={handleMarkerClick} 
        />

<<<<<<< Updated upstream
        <Marker
          position={startPosition}
          icon={position1Icon}
          eventHandlers={{
            click: () => handleMarkerClick(startPosition),
          }}
        >
        </Marker>
        <Circle center={startPosition} radius={25} color="green" />

        {deliveryPoints.map((position, index) => (
          <React.Fragment key={index}>
            <Marker
              position={position}
              icon={deliveryIcon}
              eventHandlers={{
                click: () => handleMarkerClick(position),
              }}
            >
            </Marker>
            <Circle center={position} radius={25} color="orange" />
          </React.Fragment>
        ))}

=======
        <RouteControl 
          mapRef={mapRef}
          initialPosition={initialPosition} 
          selectedStartPoint={selectedStartPoint} 
          selectedEndPoint={selectedEndPoint}
          setInitialToStartRoute={setInitialToStartRoute}
          setIsRoutingControlReady={setIsRoutingControlReady}
          drawRoute={drawRoute}
          count={count}
          setMessage={setMessage}
        />
>>>>>>> Stashed changes
      </MapContainer>
      <InfoMessage message={message} onClose={handleCloseMessage} />
    </div>
  );
};

export default MapComponent;