import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Text, Stack, ScrollArea } from '@mantine/core';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type Book from '../types/Book';

const goldIcon = new L.DivIcon({
    className: 'custom-div-icon',
    html: `<svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 36 12 36C12 36 24 21 24 12C24 5.37258 18.6274 0 12 0Z" fill="var(--mantine-color-gold-5)"/>
            <circle cx="12" cy="12" r="6" fill="white"/>
           </svg>`,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
});

// const MapUpdater = ({ center }: { center: [number, number] }) => {
//     const map = useMap();
//     useEffect(() => {
//         map.setView(center, map.getZoom());
//     }, [center, map]);
//     return null;
// };

const MapUpdater = ({ books }: { books: Book[] }) => {
    const map = useMap();

    useEffect(() => {
        const validCoords = books.reduce<L.LatLng[]>((acc, curr) => {
            if (curr.coordinates) {
                acc.push(L.latLng(curr.coordinates.lat, curr.coordinates.lng))
            }
            return acc;
        }, []);

        if (validCoords.length > 0) {
            const bounds = L.latLngBounds(validCoords);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else {
            map.setView([40.7128, -74.0060], 4);
        }
    }, [books, map]);

    return null;
};

interface MapWrapperProps {
    books: Book[];
}

export const MapWrapper = ({ books }: MapWrapperProps) => {
    const groupedBooks = books.reduce((acc, book) => {
        if (!book.coordinates) return acc;
        const key = `${book.coordinates.lat},${book.coordinates.lng}`;

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(book);

        return acc;
    }, {} as Record<string, Book[]>);

    const firstValidBook = books.find(b => b.coordinates);
    const center: [number, number] = firstValidBook && firstValidBook.coordinates
        ? [firstValidBook.coordinates.lat, firstValidBook.coordinates.lng]
        : [40.7128, -74.0060]; // Fallback to NYC

    return (
        <Box style={{ height: 400, width: '100%', borderRadius: 'var(--mantine-radius-md)', overflow: 'hidden' }}>
            <MapContainer
                center={center}
                zoom={4}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <MapUpdater books={books} />
                {Object.entries(groupedBooks).map(([coordStr, locationBooks]) => {
                    const [lat, lng] = coordStr.split(',').map(Number);

                    return (
                        <Marker key={coordStr} position={[lat, lng]} icon={goldIcon}>
                            <Popup minWidth={220}>
                                <ScrollArea h={locationBooks.length > 2 ? 180 : 'auto'} type="hover" offsetScrollbars>
                                    <Stack gap="xs" pr="sm">
                                        {locationBooks.map((book, index) => (
                                            <Box
                                                key={`${book.title}-${index}`}
                                                pb={index !== locationBooks.length - 1 ? "xs" : 0}
                                                style={{
                                                    borderBottom: index !== locationBooks.length - 1 ? '1px solid var(--mantine-color-gray-3)' : 'none'
                                                }}
                                            >
                                                <Text fw={700} size="sm" lh={1.2} mb={2}>
                                                    {book.title}
                                                </Text>
                                                <Text size="xs" c="dimmed">
                                                    by {book.author}
                                                </Text>
                                            </Box>
                                        ))}
                                    </Stack>
                                </ScrollArea>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </Box>
    );
};
