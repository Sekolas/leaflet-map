import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import routeData from '../data/routes.json';
import initialPositionIconUrl from '../assets/musoshi.png';
import position1IconUrl from '../assets/marker.png';
import deliveryIconUrl from '../assets/ikon2.png.png';

// Özel ikonlar
const initialPositionIcon = L.icon({
  iconUrl: initialPositionIconUrl,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const position1Icon = L.icon({
  iconUrl: position1IconUrl,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const deliveryIcon = L.icon({
  iconUrl: deliveryIconUrl,
  iconSize: [30, 30],
  iconAnchor: [20, 30],
});

const MapComponent = () => {
  const mapRef = useRef(null);
  const routingControl = useRef(null);
  const initialToStartRoutingControl = useRef(null);

  const [initialPosition, setInitialPosition] = useState([39.748566, 30.474826]);
  const [selectedStartPoint, setSelectedStartPoint] = useState(null);
  const [selectedEndPoint, setSelectedEndPoint] = useState(null);
  const [initialToStartRoute, setInitialToStartRoute] = useState(null);
  const [isRoutingControlReady, setIsRoutingControlReady] = useState(false);

  const route = routeData.routes[0];
  const startPosition = [route.start_point.location.latitude, route.start_point.location.longitude];
  const deliveryPoints = route.delivery_points.map(point => [
    point.location.latitude, point.location.longitude
  ]);

  // Harita tıklama işlemini yönetme
  const MapClickHandler = () => {
    const map = useMapEvents({
      click: (e) => {
        setInitialPosition([e.latlng.lat, e.latlng.lng]);
        map.panTo([e.latlng.lat, e.latlng.lng]);
      },
    });
  };

  const handleMarkerClick = (position) => {
    if (!selectedStartPoint) {
      setSelectedStartPoint(position);
    } else if (!selectedEndPoint) {
      setSelectedEndPoint(position);
    } else {
      // Yeni bir rota çizmek için önceki seçimleri temizle
      setSelectedStartPoint(position);
      setSelectedEndPoint(null);
      setIsRoutingControlReady(false); // Yeni rota için kontrolü sıfırla
    }
  };

  useEffect(() => {
    // Eski kontrolleri temizle
    if (routingControl.current) {
      try {
        mapRef.current.removeControl(routingControl.current);
      } catch (error) {
        console.error('Routing control remove error:', error);
      }
      routingControl.current = null;
    }

    if (initialToStartRoutingControl.current) {
      try {
        mapRef.current.removeControl(initialToStartRoutingControl.current);
      } catch (error) {
        console.error('Initial to Start Routing control remove error:', error);
      }
      initialToStartRoutingControl.current = null;
    }

    // Yeni rotaları oluştur
    if (selectedStartPoint && mapRef.current) { 
      const waypoints = [
        L.latLng(initialPosition[0], initialPosition[1]),
        L.latLng(selectedStartPoint[0], selectedStartPoint[1]),
      ];

      initialToStartRoutingControl.current = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false,
        lineOptions: {
          styles: [{ color: 'blue', weight: 4 }],
        },
        addWaypoints: false,
        fitSelectedRoutes: false,
        createMarker: () => null,
      })
        .addTo(mapRef.current)
        .on('routesfound', (e) => {
          setInitialToStartRoute(e.routes[0].coordinates.map(coord => [coord.lat, coord.lng]));
        });
    } 

    if (selectedStartPoint && selectedEndPoint && mapRef.current) {
      const waypoints = [
        L.latLng(selectedStartPoint[0], selectedStartPoint[1]),
        L.latLng(selectedEndPoint[0], selectedEndPoint[1]),
      ];

      routingControl.current = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false,
        lineOptions: {
          styles: [{ color: 'red', weight: 4, dashArray: '5, 5' }],
        },
        addWaypoints: false,
        fitSelectedRoutes: false,
        createMarker: () => null,
      }).addTo(mapRef.current);

      routingControl.current.on('routesfound', () => {
        setIsRoutingControlReady(true);
      });
    } 
  }, [selectedStartPoint, selectedEndPoint, initialPosition]); 

  return (
    <MapContainer
      ref={mapRef}
      center={initialPosition}
      zoom={13}
      style={{ height: "600px", width: "100%" }}
      whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Harita Tıklama Alanı */}
      <MapClickHandler />

      {/* initialPosition ile selectedStartPoint/selectedEndPoint arası rota */}
      {initialToStartRoute && ( 
        <Polyline positions={initialToStartRoute} color="blue" weight={4} />
      )}

      <Marker position={initialPosition} icon={initialPositionIcon}>
        <Popup>
          Initial Position
        </Popup>
      </Marker>
      <Marker
        position={startPosition}
        icon={position1Icon}
        eventHandlers={{
          click: () => handleMarkerClick(startPosition),
        }}
      >
        <Popup>
          {selectedStartPoint === startPosition ? "Start" : "Start Position"}
        </Popup>
      </Marker>
      {deliveryPoints.map((position, index) => (
        <Marker
          key={index}
          position={position}
          icon={deliveryIcon}
          eventHandlers={{
            click: () => handleMarkerClick(position),
          }}
        >
          <Popup>
            {selectedEndPoint === position ? "End" : `Delivery Point ${index + 1}`}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;