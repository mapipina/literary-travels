import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { SearchBar } from './SearchBar';

vi.mock('@mantine/hooks', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@mantine/hooks')>();
    return {
        ...actual,
        useDebouncedValue: (value: any) => [value]
    };
});

describe('SearchBar Component', () => {
    const renderWithMantine = (component: React.ReactNode) => {
        return render(<MantineProvider>{component}</MantineProvider>);
    };

    beforeEach(() => {
        globalThis.fetch = vi.fn().mockResolvedValue({
            json: vi.fn().mockResolvedValue([
                {
                    display_name: 'Miami, Florida',
                    lat: '25.7617',
                    lon: '-80.1918',
                    extratags: { wikidata: 'Q8652' }
                },
                {
                    display_name: 'Ghost Town',
                    lat: '0',
                    lon: '0'
                }
            ])
        });
    });

    it('disables the submit button on initial render', () => {
        renderWithMantine(<SearchBar onSubmit={vi.fn()} isLoading={false} />);
        
        const button = screen.getByRole('button', { name: /Books, yay!/i });
        expect(button).toBeDisabled();
    });

    it('fetches locations, filters invalid ones, allows selection, and submits', async () => {
        const user = userEvent.setup(); 
        const mockSubmit = vi.fn();
        
        renderWithMantine(<SearchBar onSubmit={mockSubmit} isLoading={false} />);
        
        const input = screen.getByPlaceholderText('Search for a city...');
        await user.type(input, 'Mia');

        expect(globalThis.fetch).toHaveBeenCalled();

        const miamiOption = await screen.findByText(/Miami, Florida/i);
        expect(miamiOption).toBeInTheDocument();

        const ghostOption = screen.queryByRole('option', { name: /Ghost Town/i });
        expect(ghostOption).not.toBeInTheDocument();

        await user.click(miamiOption);

        const button = screen.getByRole('button', { name: /Books, yay!/i });
        expect(button).not.toBeDisabled();
        
        await user.click(button);

        expect(mockSubmit).toHaveBeenCalledWith({
            name: 'Miami, Florida',
            wikidataId: 'Q8652',
            lat: 25.7617,
            lng: -80.1918
        });
    });

    it('disables the submit button when isLoading is true', () => {
        renderWithMantine(<SearchBar onSubmit={vi.fn()} isLoading={true} />);
        const button = screen.getByRole('button', { name: /Books, yay!/i });
        expect(button).toBeDisabled();
    });
});
