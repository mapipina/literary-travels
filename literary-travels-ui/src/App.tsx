import { AppShell, Burger, Group, Title, Container, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { SearchBar } from './components/SearchBar';

function App() {
  const [opened, { toggle }] = useDisclosure();

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
            onSubmit={(query) => {
              console.log("Time to fetch data for:", query);
              // will replace w api call later, placeholder for now
            }}
          />

        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
