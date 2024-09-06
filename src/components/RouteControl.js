// MapComponents/RouteControl.js
import { useEffect, useRef } from 'react';
import L from 'leaflet';

const RouteControl = ({ 
  mapRef, 
  initialPosition, 
  selectedStartPoint, 
  selectedEndPoint, 
  setInitialToStartRoute,
  setIsRoutingControlReady,
  drawRoute,
  count,
  setMessage
}) => {
  const routingControl = useRef(null);
  const initialToStartRoutingControl = useRef(null);

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
          routeWhileDragging: true,
          lineOptions: {
            styles: [{ color: 'blue', weight: 3,dashArray: '3, 5' }],
          },
          addWaypoints: true,
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
      if (endDistance >= endCircle.getRadius() && !count.current){
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
      else if (endDistance >= endCircle.getRadius() && count.current){
        if (routingControl.current) {
          try {
            mapRef.current.removeControl(routingControl.current);
          } catch (error) {
            console.error('Routing control remove error:', error);
          }
          routingControl.current = null;
        }
        const waypoints = [
          L.latLng(initialPosition[0], initialPosition[1]),
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
          message = 'End noktasına ulaştınız rota tamamlandı Yeni Rota Belirleyiniz!';
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

  return null;
};

export default RouteControl;