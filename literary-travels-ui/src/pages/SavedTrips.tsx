import { useEffect, useState } from "react";
import { BookGrid } from "../components/BookGrid";
import { MapWrapper } from "../components/MapWrapper"; // Import the map!
import { getAllSavedBooks } from "../services/apiClient";
import type Book from "../types/Book";
import { Container, Title, Stack, Box, Text, Divider, Paper } from "@mantine/core";

export const SavedTrips: React.FC = () => {
    const [savedBooks, setSavedBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSavedBooks = async () => {
            setIsLoading(true);
            const books = await getAllSavedBooks();
            setSavedBooks(books);
            setIsLoading(false);
        };

        loadSavedBooks();
    }, []);

    if (isLoading) {
        return (
            <Container size="lg" py="xl">
                <Text ta="center" c="dimmed">Loading your roadmap...</Text>
            </Container>
        );
    }

    return (
        <Container size="lg" py="xl">
            <Stack gap="xl">
                <Box>
                    <Title order={1} c="navy.9">My Literary Roadmap</Title>
                    <Text c="dimmed" size="sm" mt="xs">
                        {savedBooks.length} {savedBooks.length === 1 ? 'destination' : 'destinations'} explored
                    </Text>
                </Box>

                <Divider size="xs" color="gold.2" />
                {savedBooks.length > 0 && (
                    <Paper shadow="md" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                        <MapWrapper books={savedBooks} />
                    </Paper>
                )}
                <Box>
                    <Title order={2} size="h3" mb="lg" c="navy.7">Saved Collections</Title>
                    <BookGrid books={savedBooks} showSaveButton={false} />
                </Box>
            </Stack>
        </Container>
    );
};
