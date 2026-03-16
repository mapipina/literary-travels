import { useState, useEffect } from "react";
import type { default as Book, BookMetadata, SavedBook } from "../types/Book";
import { Badge, Button, Card, Group, Text, Box, Stack, Image, Skeleton } from "@mantine/core";
import useSWR, { useSWRConfig } from "swr";
import { saveBook, removeBook, fetcher } from "../services/apiClient";

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
    isSavedView?: boolean;
}

type CardStatus = 'idle' | 'saving' | 'saved' | 'removing' | 'removed' | 'error';

export const BookCard: React.FC<BookCardProps> = ({ book, isSavedView = false }) => {
    const { mutate } = useSWRConfig();
    const [status, setStatus] = useState<CardStatus>('idle');

    const queryParams = new URLSearchParams();
    if (book.isbn) queryParams.append('isbn', book.isbn);
    if (book.title) queryParams.append('title', book.title);
    if (book.author) queryParams.append('author', book.author);

    const { data: metadata, isLoading: isMetadataLoading } = useSWR<BookMetadata>(
        `/api/books/metadata?${queryParams.toString()}`,
        fetcher,
        {
            revalidateOnFocus: false, // Avoiding a refetch since book covers don't change (only for movie releases ofc)
            revalidateIfStale: false,
            dedupingInterval: 86400000 // Cache locally for 24 hours
        }
    );

    useEffect(() => {
        if (status === 'error') {
            const timer = setTimeout(() => setStatus('idle'), 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleSave = async () => {
        if (!book.coordinates || book.publicationYear === null) return;
        setStatus('saving');

        try {
            const payload: SavedBook = {
                ...book,
                coordinates: book.coordinates,
                publicationYear: book.publicationYear,
                description: metadata?.description || undefined, 
                coverUrl: metadata?.coverUrl || undefined,
            };
            await saveBook(payload);
            setStatus('saved');
            mutate('/api/books');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const handleRemove = async () => {
        setStatus('removing');

        try {
            await removeBook(book.wikidataId);
            setStatus('removed');
            mutate('/api/books');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    const isActionLoading = status === 'saving' || status === 'removing';
    const isActionComplete = status === 'saved' || status === 'removed';

    return (
        <>
            <style>{shakeAnimation}</style>
            <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Card.Section>
                    <Skeleton visible={isMetadataLoading} height={250} radius="none">
                        <Image
                            src={metadata?.coverUrl || 'https://placehold.co/400x600?text=No+Cover+Found'}
                            height={250}
                            alt={`Cover of ${book.title}`}
                            fit="contain"
                            fallbackSrc="https://placehold.co/400x600?text=No+Cover+Found"
                            referrerPolicy="no-referrer"
                            bg="gray.1"
                            py="sm"
                        />
                    </Skeleton>
                </Card.Section>
                <Card.Section withBorder inheritPadding py="md">
                    <Stack gap={4}>
                        <Text fw={700} size="lg" lineClamp={1} c="indigo.9">
                            {book.title}
                        </Text>
                        <Text size="sm" c="dimmed" fw={500}>
                            by {book.author}
                        </Text>
                        {metadata?.averageRating && (
                            <Text size="sm" fw={700} c="yellow.8">
                                ★ {metadata.averageRating} / 5
                            </Text>
                        )}
                    </Stack>
                </Card.Section>
                <Box py="md" style={{ flex: 1 }}>
                    <Group gap="xs">
                        {book.publicationYear && (
                            <Badge variant="outline" radius="sm">
                                {book.publicationYear}
                            </Badge>
                        )}
                        {book.genres?.map((genre) => (
                            <Badge key={genre} variant="dot" color="navy.7" radius="sm">
                                {genre}
                            </Badge>
                        ))}
                    </Group>
                    <Text size="xs" c="dimmed" mt="md" tt="uppercase" lts={1} fw={700}>
                        📍 {book.location}
                    </Text>
                </Box>
                <Card.Section inheritPadding pb="xl" mt="auto">
                    {!isSavedView ? (
                        <Button
                            fullWidth
                            onClick={handleSave}
                            loading={isActionLoading} // <-- Used here
                            disabled={isActionComplete}
                            color={status === 'error' ? 'red' : status === 'saved' ? 'teal' : 'indigo'}
                            style={{ animation: status === 'error' ? 'shake 0.4s ease-in-out' : 'none' }}
                        >
                            {status === 'idle' && 'Add to My Travels'}
                            {status === 'saving' && 'Saving...'}
                            {status === 'saved' && '✓ Saved'}
                            {status === 'error' && 'Failed - Try Again?'}
                        </Button>
                    ) : (
                        <Button
                            fullWidth
                            variant="light"
                            onClick={handleRemove}
                            loading={isActionLoading} // <-- And used here
                            disabled={isActionComplete}
                            color={status === 'error' ? 'red' : status === 'removed' ? 'gray' : 'red'}
                            style={{ animation: status === 'error' ? 'shake 0.4s ease-in-out' : 'none' }}
                        >
                            {status === 'idle' && 'Remove from Travels'}
                            {status === 'removing' && 'Removing...'}
                            {status === 'removed' && '✓ Removed'}
                            {status === 'error' && 'Failed - Try Again?'}
                        </Button>
                    )}
                </Card.Section>
            </Card>
        </>
    );
};
