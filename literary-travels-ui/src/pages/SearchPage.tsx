import { useState } from 'react';
import useSWR from 'swr';
import { Container, Text, Title, Box, Paper, Stack, rem } from '@mantine/core';
import { SearchBar } from '../components/SearchBar';
import { BookGrid } from '../components/BookGrid';
import { MapWrapper } from '../components/MapWrapper';
import { fetcher } from '../services/apiClient';

export const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const { data: books, error, isLoading } = useSWR(
    searchQuery ? `/api/search?query=${searchQuery}` : null,
    fetcher
  );

  const handleSearch = (location: string) => {
    setSearchQuery(location);
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
        <Paper p="xl" shadow="xl">
          <SearchBar onSubmit={handleSearch} isLoading={isLoading} />
        </Paper>
      </Container>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          {error && (
            <Text c="red" ta="center">
              Whoops! Something went wrong. Check console for more details. 
            </Text>
          )}
          {searchQuery && !isLoading && books && (
            <>
              {books.length > 0 && (
                <Paper shadow="md" style={{ overflow: 'hidden' }}>
                  <MapWrapper books={books} />
                </Paper>
              )}
              <Box>
                <Title order={2} mb="lg">
                  Recommended Reading
                </Title>
                <BookGrid books={books} showSaveButton={true} />
              </Box>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
};
