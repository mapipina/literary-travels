import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '../services/apiClient';
import { Container, Text, SegmentedControl, Group, Title, Box } from '@mantine/core';
import { BookGrid } from '../components/BookGrid';
import { MapWrapper } from '../components/MapWrapper';

export const SavedTrips = () => {
    const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
    const { data: savedBooks, error, isLoading } = useSWR('/api/books', fetcher);

    if (isLoading) return <Text mt="xl" ta="center">Loading your saved books...</Text>;
    if (error) return <Text mt="xl" ta="center" c="red">Failed to load saved trips.</Text>;

    const books = savedBooks || [];

    return (
        <Container size="lg" py="xl">
            <Group justify="space-between" align="center" mb="xl">
                <Title order={2} c="indigo.9">My Literary Travels</Title>
                <SegmentedControl
                    value={viewMode}
                    onChange={(value) => setViewMode(value as 'map' | 'grid')}
                    data={[
                        { label: 'Map View', value: 'map' },
                        { label: 'Grid View', value: 'grid' },
                    ]}
                    color="indigo"
                    radius="md"
                />
            </Group>
            <Box style={{ minHeight: 400 }}>
                {books.length === 0 ? (
                    <Text ta="center" mt="xl" c="dimmed">
                        No saved books or trips. Head over to Search Page
                    </Text>
                ) : viewMode === 'map' ? (
                    <Box style={{ borderRadius: 'var(--mantine-radius-md)', overflow: 'hidden', boxShadow: 'var(--mantine-shadow-md)' }}>
                        <MapWrapper books={books} />
                    </Box>
                ) : (
                    <BookGrid books={books} isSavedView={true} />
                )}
            </Box>
        </Container>
    );
};
