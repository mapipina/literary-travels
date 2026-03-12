import useSWR from 'swr';
import { fetcher } from '../services/apiClient';
import { Container, Text } from '@mantine/core';
import { BookGrid } from '../components/BookGrid';
import { MapWrapper } from '../components/MapWrapper';

export const SavedTrips = () => {
    const { data: savedBooks, error, isLoading } = useSWR('/api/books', fetcher);

    if (isLoading) return <Text>Loading your roadmap...</Text>;
    if (error) return <Text>Failed to load saved trips.</Text>;

    return (
        <Container size="lg" py="xl">
            <MapWrapper books={savedBooks || []} />
            <BookGrid books={savedBooks || []} isSavedView={true}/>
        </Container>
    );
};
