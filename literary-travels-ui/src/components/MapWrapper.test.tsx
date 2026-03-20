import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { MapWrapper } from './MapWrapper';
import type Book from '../types/Book';

vi.mock('swr', () => ({
    useSWRConfig: vi.fn(() => ({ mutate: vi.fn() })),
}));

vi.mock('../services/apiClient', () => ({
    removeBook: vi.fn(),
}));

vi.mock('react-leaflet', () => {
    return {
        MapContainer: ({ children, center }: any) => (
            <div data-testid="map-container" data-center={JSON.stringify(center)}>
                {children}
            </div>
        ),
        TileLayer: () => <div data-testid="tile-layer" />,
        Marker: ({ children, position }: any) => (
            <div data-testid="map-marker" data-position={JSON.stringify(position)}>
                {children}
            </div>
        ),
        Popup: ({ children }: any) => <div data-testid="map-popup">{children}</div>,
        useMap: () => ({
            setView: vi.fn(),
            fitBounds: vi.fn(),
            getZoom: vi.fn().mockReturnValue(4)
        })
    };
});

vi.mock('leaflet', () => {
    return {
        default: {
            DivIcon: class {},
            latLng: vi.fn((lat, lng) => ({ lat, lng })),
            latLngBounds: vi.fn((coords) => coords) 
        }
    };
});

describe('MapWrapper Component', () => {
    const renderWithMantine = (component: React.ReactNode) => {
        return render(<MantineProvider>{component}</MantineProvider>);
    };

    const mockBooks: Book[] = [
        {
            wikidataId: 'Q1', 
            isbn: null,
            title: 'Midnight in Paris',
            author: 'Jane Doe',
            location: 'Paris',
            coordinates: { lat: 48.8566, lng: 2.3522 },
            genres: [],
            publicationYear: null
        },
        {
            wikidataId: 'Q2',
            isbn: null,
            title: 'London Calling',
            author: 'John Smith',
            location: 'London',
            coordinates: { lat: 51.5074, lng: -0.1278 },
            genres: [],
            publicationYear: null
        },
        {
            wikidataId: 'Q3',
            isbn: null,
            title: 'Lost in the Void',
            author: 'Ghost Writer',
            location: 'Unknown',
            genres: [],
            publicationYear: null
        },
        {
            wikidataId: 'Q4',
            isbn: null,
            title: 'Another Day in Paris',
            author: 'Jane Doe',
            location: 'Paris',
            coordinates: { lat: 48.8566, lng: 2.3522 },
            genres: [],
            publicationYear: null
        }
    ];
    it('renders the base map container and tile layer', () => {
        renderWithMantine(<MapWrapper books={[]} />);
        
        expect(screen.getByTestId('map-container')).toBeInTheDocument();
        expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
    });

    it('centers the map on the first book that has coordinates', () => {
        renderWithMantine(<MapWrapper books={mockBooks} />);
        
        const mapContainer = screen.getByTestId('map-container');
        expect(mapContainer.getAttribute('data-center')).toBe(JSON.stringify([48.8566, 2.3522]));
    });

    it('renders exactly one marker per unique coordinate and groups books inside', () => {
        renderWithMantine(<MapWrapper books={mockBooks} />);
        
        const markers = screen.getAllByTestId('map-marker');

        expect(markers).toHaveLength(2);
        
        expect(screen.getByText(/Midnight in Paris/i)).toBeInTheDocument();
        expect(screen.getByText(/Another Day in Paris/i)).toBeInTheDocument();
        expect(screen.getByText(/London Calling/i)).toBeInTheDocument();
    });

    it('falls back to the default center (NYC) when no books have coordinates', () => {
        const booksWithoutCoords = [mockBooks[2]]; 
        
        renderWithMantine(<MapWrapper books={booksWithoutCoords} />);
        
        const mapContainer = screen.getByTestId('map-container');
        expect(mapContainer.getAttribute('data-center')).toBe(JSON.stringify([40.7128, -74.006]));
        expect(screen.queryByTestId('map-marker')).not.toBeInTheDocument();
    });
});
