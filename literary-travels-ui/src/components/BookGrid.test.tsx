import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { BookGrid } from './BookGrid';
import type Book from '../types/Book';

vi.mock('swr', () => ({
    default: vi.fn(() => ({ data: null, isLoading: false })),
    useSWRConfig: vi.fn(() => ({ mutate: vi.fn() })),
}));

vi.mock('../services/apiClient', () => ({
    saveBook: vi.fn(),
    removeBook: vi.fn(),
    fetcher: vi.fn()
}));

describe('BookGrid Component', () => {
    const renderWithMantine = (component: React.ReactNode) => {
        return render(<MantineProvider>{component}</MantineProvider>);
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the empty state message when the books array is empty', () => {
        renderWithMantine(<BookGrid books={[]} />);
        
        const emptyMessage = screen.getByText(/We couldn't find any books based in this location/i);
        expect(emptyMessage).toBeInTheDocument();
    });

    it('renders a grid of books with their titles and authors', () => {
        const mockBooks: Book[] = [
            {
                wikidataId: 'Q1',
                isbn: '9780593336585',
                title: 'The Marlow Murder Club',
                author: 'Robert Thorogood',
                location: 'Marlow',
                genres: [],
                publicationYear: null
            },
            {
                wikidataId: 'Q2',
                isbn: null,
                title: 'Shakespeare and Hathaway',
                author: 'Jude Tindall',
                location: 'Stratford-upon-Avon',
                genres: [],
                publicationYear: null 
            }
        ];

        renderWithMantine(<BookGrid books={mockBooks} />);

        expect(screen.getByText(/The Marlow Murder Club/i)).toBeInTheDocument();
        expect(screen.getByText(/Shakespeare and Hathaway/i)).toBeInTheDocument();
        expect(screen.getByText(/Robert Thorogood/i)).toBeInTheDocument();
        expect(screen.getByText(/Jude Tindall/i)).toBeInTheDocument();
    });

    it('conditionally renders genre and year badges only if the data exists', () => {
        const mockBooks: Book[] = [
            {
                wikidataId: 'Q1',
                isbn: '9780593336585',
                title: 'The Marlow Murder Club',
                author: 'Robert Thorogood',
                location: 'Marlow',
                publicationYear: 2021,
                genres: ['Cozy Mystery']
            },
            {
                wikidataId: 'Q2',
                isbn: null,
                title: 'Shakespeare and Hathaway',
                author: 'Jude Tindall',
                location: 'Stratford-upon-Avon',
                genres: [],
                publicationYear: null
            }
        ];

        renderWithMantine(<BookGrid books={mockBooks} />);

        expect(screen.getByText(/2021/i)).toBeInTheDocument();
        expect(screen.getByText(/Cozy Mystery/i)).toBeInTheDocument();
        expect(screen.getByText(/Shakespeare and Hathaway/i)).toBeInTheDocument();
    });
});
