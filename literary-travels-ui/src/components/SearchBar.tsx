import { useState } from 'react';
import { TextInput, Box, Button, Group } from '@mantine/core';

interface SearchBarProps {
    onSubmit: (location: string) => void; // TODO: Make decision on supporting genre and format then update this
    isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSubmit, isLoading }) => {
    const [location, setLocation] = useState('');

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        
        if (location.trim()) {
            onSubmit(location.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box>
                <TextInput
                    label="Where are you traveling?"
                    placeholder="e.g., London, Paris..."
                    value={location}
                    onChange={(e) => setLocation(e.currentTarget.value)}
                    required
                    data-autofocus
                />
            </Box>
            <Group justify="flex-end" mt="xl">
                <Button 
                    type="submit" 
                    size="md" 
                    loading={isLoading}
                    disabled={!location.trim()}
                >
                    Books, yay!
                </Button>
            </Group>
        </form>
    );
};
