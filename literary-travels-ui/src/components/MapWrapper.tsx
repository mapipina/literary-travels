import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type Book from '../types/Book';
import { rem } from '@mantine/core';

const goldIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: `
    <div style="
      background-color: #c5a059; 
      width: 24px; 
      height: 24px; 
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export const MapWrapper: React.FC<{ books: Book[] }> = ({ books }) => {
  const defaultCenter: [number, number] = [40.7128, -74.0060]; 
  
  const activeCenter: [number, number] = books[0]?.coordinates 
    ? [books[0].coordinates.lat, books[0].coordinates.lng] 
    : defaultCenter;

  return (
    <div style={{ height: rem(400), borderRadius: '12px', overflow: 'hidden', border: '1px solid #e9ecef' }}>
      <MapContainer center={activeCenter} zoom={4} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <ChangeView center={activeCenter} />
        {books.map((book, idx) => (
          book.coordinates && (
            <Marker 
              key={`${book.title}-${idx}`} 
              position={[book.coordinates.lat, book.coordinates.lng]} 
              icon={goldIcon}
            >
              <Popup>
                <strong>{book.title}</strong><br />
                {book.author}
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};
