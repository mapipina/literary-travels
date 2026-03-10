import { useState, useEffect } from "react";
// import { saveBook } from "../services/apiClient"; // Commented out for mock mode
import type { SavedBook, default as Book } from "../types/Book";
import { Badge, Button, Card, Group, Text, Box } from "@mantine/core";

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
    const [status, setStatus] = useState<'idle' | 'loading' | 'saved' | 'error'>('idle');

    useEffect(() => {
        if (status === 'error') {
            const timer = setTimeout(() => setStatus('idle'), 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleSave = async () => {
        if (!book.coordinates || book.publicationYear === null) {
            console.warn("Missing critical data for persistence:", book.title);
            return;
        }

        setStatus('loading');

        // --- START MOCK LOGIC ---
        // Set network latency to 1.5 seconds
        setTimeout(() => {
            const simulateError = true; // Toggle this to true to test the "Shake"

            if (simulateError) {
                console.error("Mock Save Failed: 504 Gateway Timeout");
                setStatus('error');
            } else {
                const payload: SavedBook = {
                    ...book,
                    coordinates: book.coordinates!,
                    publicationYear: book.publicationYear!
                };
                console.log("Mock Save Success - Persisted Payload:", payload);
                setStatus('saved');
            }
        }, 1500);
        // --- END MOCK LOGIC ---

        /* TODO: Reimplement real logic :
        try {
            await saveBook(payload);
            setStatus('saved');
        } catch (error) {
            setStatus('error');
        } 
        */
    };

    return (
        <>
            <style>{shakeAnimation}</style>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Box style={{ flex: 1 }}>
                    <Text fw={700} size="lg" lineClamp={2}>{book.title}</Text>
                    <Text c="dimmed" size="sm" mt="xs">{book.author}</Text>

                    <Group mt="md" gap="xs">
                        {book.genres.slice(0, 3).map((genre) => (
                            <Badge key={genre} variant="light" color="violet">{genre}</Badge>
                        ))}
                    </Group>
                </Box>
                {showSaveButton &&
                <Button
                    fullWidth
                    mt="md"
                    onClick={handleSave}
                    loading={status === 'loading'}
                    disabled={status === 'saved'}
                    color={status === 'error' ? 'red' : status === 'saved' ? 'teal' : 'blue'}
                    variant={status === 'saved' ? 'light' : 'filled'}
                    style={{
                        animation: status === 'error' ? 'shake 0.4s ease-in-out' : 'none',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {status === 'idle' && 'Save Book'}
                    {status === 'loading' && 'Saving...'}
                    {status === 'saved' && '✓ Book has been saved'}
                    {status === 'error' && 'Failed to save - Try Again?'}
                </Button>}
                
            </Card>
        </>
    );
};
