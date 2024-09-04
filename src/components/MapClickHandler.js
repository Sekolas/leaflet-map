// MapComponents/MapClickHandler.js
import { useMapEvents } from 'react-leaflet';

const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: onClick,
  });
  return null;
};

export default MapClickHandler;