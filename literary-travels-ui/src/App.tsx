import { AppShell, Burger, Group, Title, Container, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SearchBar } from './components/SearchBar';
import { useState } from 'react';
import { searchBooks, type Book } from './services/apiClient';
import { BookGrid } from './components/BookGrid';

function App() {
  const [opened, { toggle }] = useDisclosure();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (location: string) => {
    setIsLoading(true);
    setHasSearched(true);

    const results = await searchBooks(location);
    setBooks(results);
    setIsLoading(false);
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: true },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
          />
          <Title order={3} c="blue">
            Literary Travels
          </Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Text>Saved Trips</Text>
        <Text>My Map</Text>
      </AppShell.Navbar>

      <AppShell.Main>
        <Container size="md" pt="xl">
          <Text size="xl" fw={700} ta="center" mb="lg">
            Where are you traveling next?
          </Text>
          <Text ta="center" c="dimmed" mb="xl">
            Get excited for your upcoming trip by reading a book set in your travel destination!
          </Text>

          <SearchBar
            onSubmit={handleSearch}
            isLoading={isLoading}
          />
          {/* Temporary data dump */}
          {/* {hasSearched && !isLoading && (
            <pre style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px', overflowX: 'auto' }}>
              {JSON.stringify(books, null, 2)}
            </pre>
          )} */}
          {hasSearched && !isLoading && (
            <BookGrid books={books} />
          )}

        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
