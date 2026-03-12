import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { BookCard } from './BookCard';
import { saveBook, removeBook } from '../services/apiClient';
import { useSWRConfig } from 'swr';

// 1. Mock the API client and SWR
vi.mock('../services/apiClient', () => ({
    saveBook: vi.fn(),
    removeBook: vi.fn()
}));

vi.mock('swr', () => ({
    useSWRConfig: vi.fn()
}));

describe('BookCard Component - Delete Workflow', () => {
    const mockMutate = vi.fn();

    const mockBook = {
        wikidataId: 'Q12345',
        isbn: null,
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        location: 'Long Island',
        coordinates: { lat: 40.78, lng: -73.96 },
        genres: ['Tragedy'],
        publicationYear: 1925
    };

    const renderWithMantine = (ui: React.ReactNode) => {
        return render(<MantineProvider>{ui}</MantineProvider>);
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Setup the SWR hook mock to return our spy function
        vi.mocked(useSWRConfig).mockReturnValue({ mutate: mockMutate } as any);
    });

    it('renders the "Remove from Travels" button when isSavedView is true', () => {
        renderWithMantine(<BookCard book={mockBook} isSavedView={true} />);
        
        const removeButton = screen.getByRole('button', { name: /Remove from Travels/i });
        expect(removeButton).toBeInTheDocument();
        
        // Ensure the Save button is NOT rendered
        expect(screen.queryByRole('button', { name: /Add to My Travels/i })).not.toBeInTheDocument();
    });

    it('calls removeBook and triggers SWR mutate on successful deletion', async () => {
        vi.mocked(removeBook).mockResolvedValueOnce({ message: 'Success' });

        renderWithMantine(<BookCard book={mockBook} isSavedView={true} />);
        
        const removeButton = screen.getByRole('button', { name: /Remove from Travels/i });
        fireEvent.click(removeButton);

        // Assert loading state appears immediately
        expect(screen.getByRole('button', { name: /Removing.../i })).toBeInTheDocument();

        // Wait for async operations to resolve and assert the final success state
        await waitFor(() => {
            expect(removeBook).toHaveBeenCalledWith('Q12345');
            expect(mockMutate).toHaveBeenCalledWith('/api/books');
            expect(screen.getByRole('button', { name: /✓ Removed/i })).toBeInTheDocument();
        });
    });

it('displays an error state and does not mutate SWR if deletion fails', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        vi.mocked(removeBook).mockRejectedValueOnce(new Error('Network Error'));

        renderWithMantine(<BookCard book={mockBook} isSavedView={true} />);
        
        const removeButton = screen.getByRole('button', { name: /Remove from Travels/i });
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(removeBook).toHaveBeenCalledWith('Q12345');
            expect(mockMutate).not.toHaveBeenCalled(); 
            expect(screen.getByRole('button', { name: /Failed - Try Again\?/i })).toBeInTheDocument();
        });
        consoleSpy.mockRestore();
    });
});
