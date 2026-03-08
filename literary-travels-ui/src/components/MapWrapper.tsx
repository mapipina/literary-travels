import { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { groupBooksByLocation } from '../utils/mapUtils';
import type { Book } from '../services/apiClient';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to auto-recenter the map when search results change
const MapUpdater = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, map.getZoom());
    }, [center, map]);
    return null;
};

interface MapWrapperProps {
    books: Book[];
}

export const MapWrapper: React.FC<MapWrapperProps> = ({ books }) => {
    const groupedLocations = useMemo(() => groupBooksByLocation(books), [books]);

    // Default to the first found coordinate, or fallback to a standard view (e.g., center of US/Atlantic)
    const centerPoint: [number, number] = groupedLocations.length > 0
        ? [groupedLocations[0].coordinates.lat, groupedLocations[0].coordinates.lng]
        : [39.8283, -98.5795]; // Geographic center of contiguous US

    // If there are no books with coordinates, we can either hide the map or show it empty.
    // For now, we'll render it so the UI doesn't jump around.
    return (
        <MapContainer
            center={centerPoint}
            zoom={4}
            style={{ height: '400px', width: '100%', borderRadius: '8px', zIndex: 1 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapUpdater center={centerPoint} />

            {groupedLocations.map((loc) => (
                <Marker
                    key={`${loc.coordinates.lat}-${loc.coordinates.lng}`}
                    position={[loc.coordinates.lat, loc.coordinates.lng]}
                >
                    <Popup>
                        <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                            <strong style={{ display: 'block', marginBottom: '4px' }}>
                                {loc.location}
                            </strong>
                            <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '0.9rem' }}>
                                {loc.books.map((book, idx) => (
                                    <li key={idx} style={{ marginBottom: '4px' }}>
                                        <em>{book.title}</em> <br/>
                                        <span style={{ color: '#666', fontSize: '0.8rem' }}>by {book.author}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};
