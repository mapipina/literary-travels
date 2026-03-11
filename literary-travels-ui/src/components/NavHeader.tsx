import { AppShell, Burger, Group, Title, NavLink, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate, useLocation } from 'react-router-dom';

export const NavHeader = () => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    navigate(path);
    if (opened) toggle();
  };

  return (
    <>
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title 
            order={3} 
            c="blue" 
            style={{ cursor: 'pointer' }} 
            onClick={() => handleNav('/')}
          >
            Literary Travels
          </Title>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text size="xs" fw={700} c="dimmed" mb="xs" tt="uppercase">
          Menu
        </Text>
        <NavLink
          label="Search Destination"
          active={location.pathname === '/'}
          onClick={() => handleNav('/')}
        />
        <NavLink
          label="My Saved Trips"
          active={location.pathname === '/my-trips'}
          onClick={() => handleNav('/my-trips')}
        />
      </AppShell.Navbar>
    </>
  );
};
