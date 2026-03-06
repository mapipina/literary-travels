import { useState } from 'react';
import { Group, Select, TextInput, Button, Text, Paper } from '@mantine/core';

// Placeholders for now, will update in later phases but keeping it simple and easy in meantime
const GENRES = ['Mystery', 'Sci-Fi', 'Historical Fiction', 'Thriller'];
const FORMATS = ['Paperback', 'E-book', 'Audiobook'];

interface SearchBarProps {
  onSubmit: (searchQuery: string) => void;
}

export function SearchBar({ onSubmit }: SearchBarProps) {
  const [genre, setGenre] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [format, setFormat] = useState<string | null>(null);

  const isBtnDisabled = !genre || !location.trim() || !format;

  const handleSubmit = () => {
    if (!isBtnDisabled) {
      onSubmit(`${genre} ${format} ${location}`);
    }
  };

  return (
    <Paper withBorder p="xl" radius="md" shadow="sm">
      <Group justify="center" gap="sm" align="center">
        <Text size="lg" fw={500}>I want</Text>
        <Select
          placeholder="Select genre"
          data={GENRES}
          value={genre}
          onChange={setGenre}
          w={150}
        />
        <Text size="lg" fw={500}>books about</Text>
        <TextInput
          placeholder="e.g., London, Paris..."
          value={location}
          onChange={(e) => setLocation(e.currentTarget.value)}
          w={200}
        />
        <Text size="lg" fw={500}>in this format</Text>
        <Select
          placeholder="Select format"
          data={FORMATS}
          value={format}
          onChange={setFormat}
          w={150}
        />
      </Group>
      <Group justify="center" mt="xl">
        <Button 
          onClick={handleSubmit} 
          disabled={isBtnDisabled}
          size="md"
        >
          Books, yay!
        </Button>
      </Group>
    </Paper>
  );
}
