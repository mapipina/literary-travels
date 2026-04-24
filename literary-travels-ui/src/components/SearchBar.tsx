import { useState, useEffect } from 'react';
import { Select, Button, Group, Box, Loader } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';

// We elevate the payload from a simple string to a strictly typed object
export interface LocationData {
    name: string;
    wikidataId: string;
    lat: number;
    lng: number;
}

interface SearchBarProps {
    onSubmit: (location: LocationData) => void; 
    isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSubmit, isLoading }) => {
    const [location, setLocation] = useState('');
    const [debouncedSearch] = useDebouncedValue(location, 500); // 500ms delay
    
    const [places, setPlaces] = useState<LocationData[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    useEffect(() => {
        if (debouncedSearch.trim().length < 3) {
            setPlaces([]);
            return;
        }

        const fetchPlaces = async () => {
            setIsFetching(true);
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedSearch)}&format=jsonv2&extratags=1&limit=5`
                );
                const data = await response.json();
                const validPlaces: LocationData[] = data
                    .filter((item: any) => item.extratags && item.extratags.wikidata)
                    .map((item: any) => ({
                        name: item.display_name,
                        wikidataId: item.extratags.wikidata,
                        lat: parseFloat(item.lat),
                        lng: parseFloat(item.lon)
                    }));

                setPlaces(validPlaces);
            } catch (error) {
                console.error('Error fetching locations from Nominatim:', error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchPlaces();
    }, [debouncedSearch]);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        
        const selectedPlace = places.find(p => p.wikidataId === selectedValue);
        if (selectedPlace) {
            onSubmit(selectedPlace);
        }
    };

    const selectData = places.map(place => ({
        value: place.wikidataId, 
        label: place.name
    }));

    return (
        <form onSubmit={handleSubmit}>
            <Box>
                <Select
                    label="Where are you traveling?"
                    placeholder="Search for a city..."
                    data={selectData}
                    searchable
                    searchValue={location}
                    onSearchChange={setLocation}
                    value={selectedValue}
                    onChange={setSelectedValue}
                    rightSection={isFetching ? <Loader size="xs" /> : null}
                    nothingFoundMessage={isFetching ? "Searching..." : "No locations found"}
                    filter={({ options }) => options} 
                    size="md"
                    required
                />
            </Box>
            <Group justify="flex-end" mt="xl">
                <Button 
                    type="submit" 
                    size="md" 
                    loading={isLoading}
                    disabled={!selectedValue}
                >
                    Books, yay!
                </Button>
            </Group>
        </form>
    );
};
