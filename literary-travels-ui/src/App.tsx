import { AppShell } from '@mantine/core';
import { NavHeader } from './components/NavHeader';
import { AppRoutes } from './Routes';

function App() {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
      }}
    >
      <NavHeader />
      <AppShell.Main>
        <AppRoutes />
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
