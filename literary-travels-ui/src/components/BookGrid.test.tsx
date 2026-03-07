import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { BookGrid } from './BookGrid';
import type { Book } from '../services/apiClient';

describe('BookGrid Component', () => {
    const renderWithMantine = (component: React.ReactNode) => {
        return render(<MantineProvider>{component}</MantineProvider>);
    };

    it('renders the empty state message when the books array is empty', () => {
        renderWithMantine(<BookGrid books={[]} />);
        
        const emptyMessage = screen.getByText(/We couldn't find any books based in this location/i);
        expect(emptyMessage).toBeInTheDocument();
    });

    it('renders a grid of books with their titles and authors', () => {
        const mockBooks: Book[] = [
            {
                title: 'The Marlow Murder Club',
                author: 'Robert Thorogood',
                location: 'Marlow',
            },
            {
                title: 'Shakespeare and Hathaway',
                author: 'Jude Tindall',
                location: 'Stratford-upon-Avon',
            }
        ];

        renderWithMantine(<BookGrid books={mockBooks} />);

        expect(screen.getByText('The Marlow Murder Club')).toBeInTheDocument();
        expect(screen.getByText('Shakespeare and Hathaway')).toBeInTheDocument();
        expect(screen.getByText('Robert Thorogood')).toBeInTheDocument();
        expect(screen.getByText('Jude Tindall')).toBeInTheDocument();
    });

    it('conditionally renders genre and year badges only if the data exists', () => {
        const mockBooks: Book[] = [
            {
                title: 'The Marlow Murder Club',
                author: 'Robert Thorogood',
                location: 'Marlow',
                publicationYear: 2021,
                genre: 'Cozy Mystery'
            },
            {
                title: 'Shakespeare and Hathaway',
                author: 'Jude Tindall',
                location: 'Stratford-upon-Avon',
            }
        ];

        renderWithMantine(<BookGrid books={mockBooks} />);

        expect(screen.getByText('2021')).toBeInTheDocument();
        expect(screen.getByText('Cozy Mystery')).toBeInTheDocument();
        expect(screen.getByText('Shakespeare and Hathaway')).toBeInTheDocument();
    });
});
