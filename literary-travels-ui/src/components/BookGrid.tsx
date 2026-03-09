import type Book from "../types/Book";
import { SimpleGrid, Text } from '@mantine/core';
import { BookCard } from "./BookCard";

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
                <BookCard key={`${book.title}-${book.author}`} book={book}/>
            ))}
        </SimpleGrid>
    )
}
