import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import routeData from '../data/routes.json';
import initialPositionIconUrl from '../assets/musoshi.png';
import position1IconUrl from '../assets/marker.png';
import deliveryIconUrl from '../assets/ikon2.png';
import InfoMessage from './PopupMessage';

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
  iconAnchor: [15, 30],
});

const MapComponent = ({ randomRoute, drawRoute }) => {
  const mapRef = useRef(null);
  const routingControl = useRef(null);
  const initialToStartRoutingControl = useRef(null);
  const count=useRef(false);

  const [initialPosition, setInitialPosition] = useState([39.748566, 30.474826]);
  const [selectedStartPoint, setSelectedStartPoint] = useState(null);
  const [selectedEndPoint, setSelectedEndPoint] = useState(null);
  const [initialToStartRoute, setInitialToStartRoute] = useState(null);
  const [isRoutingControlReady, setIsRoutingControlReady] = useState(false);
  const [message, setMessage] = useState('');

  const handleCloseMessage = () => setMessage('');
  const route = routeData.routes[0];
  const startPosition = [route.start_point.location.latitude, route.start_point.location.longitude];
  const deliveryPoints = route.delivery_points.map(point => [
    point.location.latitude, point.location.longitude
  ]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setInitialPosition([e.latlng.lat, e.latlng.lng]);
        mapRef.current.panTo([e.latlng.lat, e.latlng.lng]);
      },
    });
    return null;
  };

  const handleMarkerClick = (position) => {
    if (!selectedStartPoint) {
      setSelectedStartPoint(position);
    } else if (!selectedEndPoint) {
      setSelectedEndPoint(position);
    } else {
      count.current=false;
      setSelectedStartPoint(position);
      setSelectedEndPoint(null);
      setIsRoutingControlReady(false);
    }
  };

  
  useEffect(() => {
    if (routingControl.current) {
      try {
        mapRef.current.removeControl(routingControl.current);
      } catch (error) {
        console.error('Routing control remove error:', error);
      }
      routingControl.current = null;
    }

    // Eski mavi rotayı temizleme işlemi
    setInitialToStartRoute(null); // Eski mavi rotayı haritadan kaldırmak için
    
    if (initialToStartRoutingControl.current) {
      try {
        mapRef.current.removeControl(initialToStartRoutingControl.current);
      } catch (error) {
        console.error('Initial to Start Routing control remove error:', error);
      }
      initialToStartRoutingControl.current = null;
    }
  
    // Mavi rotayı çizme işlemi, yalnızca mesafe kontrolüne göre
    if (selectedStartPoint && mapRef.current) {
      const startCircle = L.circle(L.latLng(selectedStartPoint[0], selectedStartPoint[1]), { radius: 25 });
      const startDistance = mapRef.current.distance(L.latLng(initialPosition[0], initialPosition[1]), startCircle.getLatLng());
  
      // Eğer initialPosition, startCircle'ın içine girdiyse mavi rota kaldırılır
      if (startDistance >= startCircle.getRadius() && !count.current) {
        const waypoints = [
          L.latLng(initialPosition[0], initialPosition[1]),
          L.latLng(selectedStartPoint[0], selectedStartPoint[1]),
        ];
  
        initialToStartRoutingControl.current = L.Routing.control({
          waypoints: waypoints,
          routeWhileDragging: false,
          lineOptions: {
            styles: [{ color: 'blue', weight: 3,dashArray: '3, 5' }],
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
    }

    if (selectedStartPoint && selectedEndPoint && mapRef.current) {
      const endCircle = L.circle(L.latLng(selectedEndPoint[0], selectedEndPoint[1]), { radius: 25 });
      const endDistance = mapRef.current.distance(L.latLng(initialPosition[0], initialPosition[1]), endCircle.getLatLng());
      if (endDistance >= endCircle.getRadius()){
        const waypoints = [
          L.latLng(selectedStartPoint[0], selectedStartPoint[1]),
          L.latLng(selectedEndPoint[0], selectedEndPoint[1]),
        ];
    
        routingControl.current = L.Routing.control({
          waypoints: waypoints,
          routeWhileDragging: false,
          lineOptions: {
            styles: [{ color: 'red', weight: 3, dashArray: '3, 5' }],
          },
          addWaypoints: false,
          fitSelectedRoutes: false,
          createMarker: () => null,
        }).addTo(mapRef.current);
    
        routingControl.current.on('routesfound', () => {
          setIsRoutingControlReady(true);
        });
      }
      
    }
  }, [selectedStartPoint, selectedEndPoint, initialPosition]);
  
  

  useEffect(() => {
    if (mapRef.current) {
      let message = '';
  
      if (selectedStartPoint) {
        const startCircle = L.circle(L.latLng(selectedStartPoint[0], selectedStartPoint[1]), { radius: 25 });
        const startDistance = mapRef.current.distance(L.latLng(initialPosition[0], initialPosition[1]), startCircle.getLatLng());
  
        if (startDistance < startCircle.getRadius()) {
          count.current=true;
          message = 'Start noktasına ulaştınız End noktasına gidiniz!';
        }
      }
  
      if (selectedEndPoint) {
        const endCircle = L.circle(L.latLng(selectedEndPoint[0], selectedEndPoint[1]), { radius: 25 });
        const endDistance = mapRef.current.distance(L.latLng(initialPosition[0], initialPosition[1]), endCircle.getLatLng());
  
        if (endDistance < endCircle.getRadius()) {
          message = 'End noktasına ulaştınız rota tamamlandı!';
        }
      }
  
      setMessage(message);
    }
  }, [initialPosition, selectedStartPoint, selectedEndPoint]);
  
  useEffect(() => {
    if (drawRoute && mapRef.current) {
      if (routingControl.current) {
        try {
          mapRef.current.removeControl(routingControl.current);
        } catch (error) {
          console.error('Routing control remove error:', error);
        }
        routingControl.current = null;
      }

      const waypoints = drawRoute.map(route => 
        L.latLng(route[0], route[1])
      );

      routingControl.current = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false,
        lineOptions: {
          styles: [{ color: 'purple', weight: 4 }],
        },
        addWaypoints: false,
        fitSelectedRoutes: true,
        createMarker: () => null,
      }).addTo(mapRef.current);
    }
  }, [drawRoute]);


  return (
    <div>
      <MapContainer
        ref={mapRef}
        center={initialPosition}
        zoom={13}
        style={{ height: "600px", width: "100%" }}
        whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />

        <MapClickHandler />


        <Marker position={initialPosition} icon={initialPositionIcon}>
        </Marker>

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

      </MapContainer>
      <InfoMessage message={message} onClose={handleCloseMessage}/>
    </div>
  );
};

export default MapComponent;
