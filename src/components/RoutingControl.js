// import React, { useRef, useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import 'leaflet-routing-machine';
// import routeData from '../data/routes.json';
// import initialPositionIconUrl from '../assets/musoshi.png';
// import position1IconUrl from '../assets/marker.png';
// import deliveryIconUrl from '../assets/ikon2.png.png';

// // Özel ikonlar
// const initialPositionIcon = L.icon({
//   iconUrl: initialPositionIconUrl,
//   iconSize: [40, 40],
//   iconAnchor: [20, 40],
// });

// const deliveryIcon = L.icon({
//   iconUrl: deliveryIconUrl,
//   iconSize: [30, 30],
//   iconAnchor: [20, 30],
// });

// const position1Icon = L.icon({
//   iconUrl: position1IconUrl,
//   iconSize: [45, 45],
//   iconAnchor: [30, 40],
// });

// const MapComponent = () => {
//   const mapRef = useRef(null);
//   const routingControl = useRef(null);
//   const [initialPosition, setInitialPosition] = useState([39.748566, 30.474826]);
//   const [remainingDeliveryPoints, setRemainingDeliveryPoints] = useState(
//     routeData.routes[0].delivery_points.map(point => ({
//       ...point,
//       latlng: [point.location.latitude, point.location.longitude]
//     }))
//   );

//   // Harita tıklandığında initialPosition'ı güncelleyin
//   const MapClickHandler = () => {
//     useMapEvents({
//       click: (e) => {
//         setInitialPosition([e.latlng.lat, e.latlng.lng]);
//       },
//     });
//     return null;
//   };

//   // İşaretçi tıklama işleyicisini ele al
//   const handleMarkerClick = (position) => {
//     // Tıklanan işaretçiyi remainingDeliveryPoints dizisinden kaldır
//     const newDeliveryPoints = remainingDeliveryPoints.filter(
//       point => !(point.latlng[0] === position[0] && point.latlng[1] === position[1])
//     );
//     setRemainingDeliveryPoints(newDeliveryPoints);

//     // Tıklanan işaretçinin konumunu initialPosition olarak ayarla
//     setInitialPosition(position);

//     // Tüm noktalar kaldırıldığında rotayı başlangıç noktasına oluştur
//     if (newDeliveryPoints.length === 0) {
//       const startPoint = routeData.routes[0].delivery_points[0].latlng;
//       createRoute(initialPosition, startPoint); 
//     } else {
//       // Tıklanan işaretçiyi hariç tutarak en yakın noktayı bul
//       const nearestPoint = findNearestPoint(position, newDeliveryPoints);
//       if (nearestPoint) { // En yakın nokta bulunduysa
//         createRoute(initialPosition, nearestPoint.latlng);
//       } 
//     }
//   };

//   const createRoute = (start, end) => {
//     if (routingControl.current) {
//       mapRef.current.removeControl(routingControl.current);
//     }

//     routingControl.current = L.Routing.control({
//       waypoints: [
//         L.latLng(start[0], start[1]),
//         L.latLng(end[0], end[1]),
//       ],
//       routeWhileDragging: false,
//       lineOptions: {
//         styles: [{ color: 'blue', weight: 4, dashArray: '5, 5' }],
//       },
//       addWaypoints: false,
//       createMarker: () => null,
//     }).addTo(mapRef.current);
//   }
 

//   // En yakın noktayı bulma fonksiyonu
//   const findNearestPoint = (currentPosition, points) => {
//     let nearestPoint = null;
//     let nearestDistance = Infinity;

//     points.forEach(point => {
//       const distance = Math.sqrt(
//         Math.pow(point.latlng[0] - currentPosition[0], 2) + Math.pow(point.latlng[1] - currentPosition[1], 2)
//       );
//       if (distance < nearestDistance) {
//         nearestDistance = distance;
//         nearestPoint = point;
//       }
//     });

//     return nearestPoint;
//   };

//   return (
//     <MapContainer
//       ref={mapRef}
//       center={initialPosition}
//       zoom={13}
//       style={{ height: "600px", width: "100%" }}
//       whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//       />
//       <MapClickHandler />
//       <Marker position={initialPosition} icon={initialPositionIcon} />
//       {remainingDeliveryPoints.map((point, index) => (
//         <Marker
//           key={index}
//           position={point.latlng}
//           icon={index === 0 ? position1Icon : deliveryIcon}
//           eventHandlers={{ click: () => handleMarkerClick(point.latlng) }}
//         />
//       ))}
//     </MapContainer>
//   );
// };

// export default MapComponent;