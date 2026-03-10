import { useState } from 'react';
import { Container, Text, Title, Box, Paper, Stack, rem } from '@mantine/core';
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
    <Box>
      <Box 
        bg="navy.8" 
        pt={80} 
        pb={120} 
        style={{ borderBottom: '4px solid var(--mantine-color-gold-5)' }}
      >
        <Container size="md">
          <Stack align="center" gap="xs">
            <Title order={1} c="white" ta="center" size={rem(48)}>
              Where are you traveling next?
            </Title>
            <Text c="navy.1" size="lg" ta="center" fw={500} opacity={0.8}>
              Get excited for your upcoming trip by reading a book set in your travel destination!
            </Text>
          </Stack>
        </Container>
      </Box>
      <Container size="md" mt={-60}>
        <Paper p="xl" shadow="xl" radius="md" withBorder>
          <SearchBar onSubmit={handleSearch} isLoading={isLoading} />
        </Paper>
      </Container>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <MapWrapper books={books} />
          
          {hasSearched && !isLoading && (
            <Box>
              <Title order={2} mb="lg" c="navy.9">
                Recommended Reading
              </Title>
              <BookGrid books={MOCK_BOOKS} />
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  );
};
