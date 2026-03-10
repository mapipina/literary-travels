import { useState } from 'react';
import { Container, Text } from '@mantine/core';
import { SearchBar } from '../components/SearchBar';
import { BookGrid } from '../components/BookGrid';
import { MapWrapper } from '../components/MapWrapper';
import { searchBooks } from '../services/apiClient';
import type Book from '../types/Book';
import { MOCK_BOOKS } from '../mocks/mockedBooks';

export const SearchPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (location: string) => {
    setIsLoading(true);
    setHasSearched(true);
    const results = await searchBooks(location);
    setBooks(results);
    setIsLoading(false);
  };

  return (
    <Container size="md" pt="xl">
      <Text size="xl" fw={700} ta="center" mb="lg">
        Where are you traveling next?
      </Text>
      <Text ta="center" c="dimmed" mb="xl">
        Get excited for your upcoming trip by reading a book set in your travel destination!
      </Text>

      <SearchBar onSubmit={handleSearch} isLoading={isLoading} />
      
      <MapWrapper books={books} />
      
      {hasSearched && !isLoading && (
        <BookGrid books={MOCK_BOOKS} /> // Toggle to {books} when Wikidata is back
      )}
    </Container>
  );
};
