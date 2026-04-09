import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { BookCard } from './BookCard';
import { saveBook, removeBook } from '../services/apiClient';
import useSWR, { useSWRConfig } from 'swr';

vi.mock('../services/apiClient', () => ({
    saveBook: vi.fn(),
    removeBook: vi.fn(),
    fetcher: vi.fn(),
}));

vi.mock('swr', () => ({
    default: vi.fn(),
    useSWRConfig: vi.fn(() => ({ mutate: vi.fn() })),
}));

vi.mock('@mantine/hooks', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@mantine/hooks')>();
    return {
        ...actual,
        useIntersection: () => ({
            ref: vi.fn(),
            entry: { isIntersecting: true }
        })
    };
});

const mockBook = {
    wikidataId: 'Q12345',
    isbn: '9781234567890',
    title: 'The Marlow Murder Club',
    author: 'Robert Thorogood',
    location: 'Marlow',
    coordinates: { lat: 51.57, lng: -0.77 },
    genres: ['cozy mystery'],
    publicationYear: 2021,
};

const mockMetadata = {
    coverUrl: 'https://example.com/cover.jpg',
    description: 'A brilliant cozy mystery set in Marlow.',
    averageRating: 4.5,
    pageCount: 300
};

describe('BookCard Component', () => {
    const mockMutate = vi.fn();

    const renderWithMantine = (ui: React.ReactNode) => {
        return render(<MantineProvider>{ui}</MantineProvider>);
    };

    beforeEach(() => {
        vi.clearAllMocks();
        
        vi.mocked(useSWRConfig).mockReturnValue({ mutate: mockMutate } as any);

        vi.mocked(useSWR).mockReturnValue({
            data: mockMetadata,
            isLoading: false,
            error: undefined,
            mutate: vi.fn(),
            isValidating: false
        } as any);
    });

    describe('Rendering & Metadata', () => {
        it('displays skeleton loaders while metadata is fetching', () => {
            vi.mocked(useSWR).mockReturnValue({
                data: undefined,
                isLoading: true,
                error: undefined,
                mutate: vi.fn(),
                isValidating: false
            } as any);

            renderWithMantine(<BookCard book={mockBook} />);
            
            expect(screen.queryByText(/Read Summary/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/★/i)).not.toBeInTheDocument();
        });

        it('renders enriched metadata and opens the summary modal on click', async () => {
            renderWithMantine(<BookCard book={mockBook} />);

            expect(screen.getByText(/4.5 \/ 5/i)).toBeInTheDocument();

            const readSummaryLink = screen.getByText(/Read Summary/i);
            expect(readSummaryLink).toBeInTheDocument();
            fireEvent.click(readSummaryLink);

            await waitFor(() => {
                expect(screen.getByRole('dialog')).toBeInTheDocument();
                expect(screen.getByText(mockMetadata.description)).toBeInTheDocument();
            });
        });

        it('uses database metadata if SWR returns nothing (Saved Trips view)', () => {
            vi.mocked(useSWR).mockReturnValue({
                data: null,
                isLoading: false,
                error: undefined,
                mutate: vi.fn(),
                isValidating: false
            } as any);

            const savedBookProp = {
                ...mockBook,
                description: 'Saved description from Postgres DB',
                coverUrl: 'https://db-cover.com/image.jpg'
            };

            renderWithMantine(<BookCard book={savedBookProp} isSavedView={true} />);

            expect(screen.getByText(/Read Summary/i)).toBeInTheDocument();
        });
    });

    describe('Save Workflow', () => {
        it('calls saveBook with metadata and triggers SWR mutate on successful save', async () => {
            vi.mocked(saveBook).mockResolvedValueOnce({ message: 'Success' });
            
            renderWithMantine(<BookCard book={mockBook} isSavedView={false} />);
            
            const saveButton = screen.getByRole('button', { name: /Add to My Travels/i });
            fireEvent.click(saveButton);
    
            await waitFor(() => {
                expect(saveBook).toHaveBeenCalledWith({
                    ...mockBook,
                    description: mockMetadata.description, 
                    coverUrl: mockMetadata.coverUrl,       
                });
                expect(mockMutate).toHaveBeenCalledWith('/api/books');
                expect(screen.getByRole('button', { name: /✓ Saved/i })).toBeInTheDocument();
            });
        });
    });

    describe('Delete Workflow', () => {
        it('renders the "Remove from Travels" button when isSavedView is true', () => {
            renderWithMantine(<BookCard book={mockBook} isSavedView={true} />);
            
            const removeButton = screen.getByRole('button', { name: /Remove from Travels/i });
            expect(removeButton).toBeInTheDocument();
            
            expect(screen.queryByRole('button', { name: /Add to My Travels/i })).not.toBeInTheDocument();
        });

        it('calls removeBook and triggers SWR mutate on successful deletion', async () => {
            vi.mocked(removeBook).mockResolvedValueOnce({ message: 'Success' });

            renderWithMantine(<BookCard book={mockBook} isSavedView={true} />);
            
            const removeButton = screen.getByRole('button', { name: /Remove from Travels/i });
            fireEvent.click(removeButton);

            expect(screen.getByRole('button', { name: /Removing.../i })).toBeInTheDocument();

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
});
