import { useState, useEffect } from "react";
import type { default as Book, SavedBook } from "../types/Book";
import { Badge, Button, Card, Group, Text, Box, Stack } from "@mantine/core";
import { useSWRConfig } from "swr";
import { saveBook } from "../services/apiClient";

const shakeAnimation = `
  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
  }
`;

interface BookCardProps {
    book: Book;
    showSaveButton?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({ book, showSaveButton }) => {
const { mutate } = useSWRConfig(); 
    const [status, setStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle');

    useEffect(() => {
        if (status === 'error') {
            const timer = setTimeout(() => setStatus('idle'), 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleSave = async () => {
        if (!book.coordinates || book.publicationYear === null) return;
        setStatus('loading');

        try {
            const payload: SavedBook = {
                ...book,
                coordinates: book.coordinates,
                publicationYear: book.publicationYear
            };
            await saveBook(payload);
            setStatus('saved');
            mutate('/api/books'); 
            
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <>
            <style>{shakeAnimation}</style>
            <Card>
                <Card.Section withBorder inheritPadding py="md">
                    <Stack gap={4}>
                        <Text fw={700} size="lg" lineClamp={1} c="indigo.9">
                            {book.title}
                        </Text>
                        <Text size="sm" c="dimmed" fw={500}>
                            by {book.author}
                        </Text>
                    </Stack>
                </Card.Section>
                <Box py="md" style={{ flex: 1 }}>
                    <Group gap="xs">
                        {book.genres.slice(0, 3).map((genre) => (
                            <Badge key={genre} variant="dot">
                                {genre}
                            </Badge>
                        ))}
                    </Group>
                    <Text size="xs" c="dimmed" mt="md" tt="uppercase" lts={1} fw={700}>
                        📍 {book.location}
                    </Text>
                </Box>
                {showSaveButton && (
                    <Card.Section inheritPadding pb="xl">
                        <Button
                            fullWidth
                            onClick={handleSave}
                            loading={status === 'loading'}
                            disabled={status === 'saved'}
                            color={status === 'error' ? 'red' : status === 'saved' ? 'teal' : 'indigo'}
                            style={{
                                animation: status === 'error' ? 'shake 0.4s ease-in-out' : 'none',
                            }}
                        >
                            {status === 'idle' && 'Add to My Travels'}
                            {status === 'saved' && '✓ Saved'}
                            {status === 'error' && 'Failed - Try Again?'}
                        </Button>
                    </Card.Section>
                )}
            </Card>
        </>
    );
};
