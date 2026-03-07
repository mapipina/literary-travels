import type { Book } from "../services/apiClient";
import { Badge, Card, SimpleGrid, Text } from '@mantine/core';

export interface BookGridProps {
    books: Book[];
}

export const BookGrid: React.FC<BookGridProps> = ({ books }) => {
    if (books.length === 0) {
        return (
            <Text ta="center" mt="xl" c="dimmed">
                We couldn't find any books based in this location. Try another city.
            </Text>
        );
    }

    return (
        <SimpleGrid 
            cols={{ base: 1, sm: 2, md: 3 }} 
            spacing="lg" 
            verticalSpacing="xl"
            mt="xl"
        >
            {books.map(book => (
                <Card 
                    key={`${book.title}-${book.author}`} 
                    shadow="sm" 
                    padding="lg" 
                    radius="md" 
                    withBorder
                >
                    <Text fw={700} size="lg" lineClamp={2}>
                        {book.title}
                    </Text>
                    
                    <Text c="dimmed" size="sm" mt="xs">
                        {book.author}
                    </Text>
                    
                    <Badge color="blue" variant="light" mt="md">
                        {book.location}
                    </Badge>
                </Card>
            ))}
        </SimpleGrid>
    )
}