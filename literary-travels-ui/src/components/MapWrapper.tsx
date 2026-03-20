import { useState, useEffect, type JSX } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Text, Stack, ScrollArea, Group, Image, Button } from '@mantine/core';
import { useSWRConfig } from 'swr'; 
import { removeBook } from '../services/apiClient';
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

const PopupBookItem = ({ book, isLast }: { book: Book, isLast: boolean }): JSX.Element => {
    const [status, setStatus] = useState<'idle' | 'removing' | 'error'>('idle');
    const { mutate } = useSWRConfig();

    const handleRemove = async () => {
        if (!book.wikidataId) {
            console.error("Cannot remove: This book is missing a wikidataId.");
            setStatus('error');
            return;
        }

        setStatus('removing');
        try {
            await removeBook(book.wikidataId);
            mutate('/api/books');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <Group
            wrap="nowrap"
            align="flex-start"
            pb={!isLast ? "sm" : 0}
            style={{ borderBottom: !isLast ? '1px solid var(--mantine-color-gray-3)' : 'none' }}
        >
            <Image
                src={book.coverUrl || 'https://placehold.co/100x150?text=No+Cover'}
                w={45}
                h={70}
                radius="sm"
                fallbackSrc="https://placehold.co/100x150?text=No+Cover"
            />
            <Stack gap={0} style={{ flex: 1 }}>
                <Text fw={700} size="sm" lh={1.2} mb={4} lineClamp={2}>
                    {book.title}
                </Text>
                <Text size="xs" c="dimmed" mb={8}>
                    by {book.author}
                </Text>
                <Button
                    size="compact-xs"
                    color={status === 'error' ? 'red' : 'gray'}
                    variant="light"
                    onClick={handleRemove}
                    loading={status === 'removing'}
                    style={{ alignSelf: 'flex-start' }}
                >
                    {status === 'error' ? 'Error - Retry' : 'Remove'}
                </Button>
            </Stack>
        </Group>
    );
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
                            <Popup minWidth={260}>
                                <ScrollArea h={locationBooks.length > 2 ? 220 : 'auto'} type="hover" offsetScrollbars>
                                    <Stack gap="sm" pr="sm">
                                        {locationBooks.map((book, index) => (
                                            <PopupBookItem
                                                key={book.wikidataId || `popup-${book.title}-${index}`}
                                                book={book}
                                                isLast={index === locationBooks.length - 1}
                                            />
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
