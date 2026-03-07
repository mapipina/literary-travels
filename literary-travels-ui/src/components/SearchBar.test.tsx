import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import { SearchBar } from './SearchBar';

describe('SearchBar Component', () => {
  const renderWithMantine = (component: React.ReactNode) => {
    return render(<MantineProvider>{component}</MantineProvider>);
  };

  it('disables the submit button on initial render', () => {
    renderWithMantine(<SearchBar onSubmit={vi.fn()} isLoading={false} />);
    
    const button = screen.getByRole('button', { name: /Books, yay!/i });
    expect(button).toBeDisabled();
  });

  it('enables the button when inputs are filled and calls onSubmit', async () => {
    const user = userEvent.setup(); 
    const mockSubmit = vi.fn();
    
    renderWithMantine(<SearchBar onSubmit={mockSubmit} isLoading={false} />);
    
    const button = screen.getByRole('button', { name: /Books, yay!/i });
    expect(button).toBeDisabled();

    const locationInput = screen.getByPlaceholderText('e.g., London, Paris...');
    await user.type(locationInput, 'Tokyo');

    const genreInput = screen.getByPlaceholderText('Select genre');
    await user.click(genreInput);
    const mysteryOption = await screen.findByText('Mystery');
    // const mysteryOption = await screen.findByRole('option', { name: 'Mystery' });
    await user.click(mysteryOption);

    const formatInput = screen.getByPlaceholderText('Select format');
    await user.click(formatInput);
    const paperbackOption = await screen.findByText('Paperback');
    // const paperbackOption = await screen.findByRole('option', { name: 'Paperback' });
    await user.click(paperbackOption);

    expect(button).not.toBeDisabled();
    await user.click(button);

    expect(mockSubmit).toHaveBeenCalledWith('Tokyo');
  });

  it('disables the submit button when isLoading is true', () => {
    renderWithMantine(<SearchBar onSubmit={vi.fn()} isLoading={true} />);
    
    const button = screen.getByRole('button', { name: /Books, yay!/i });
    expect(button).toBeDisabled();
  });
});
