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

  it('enables the button when input is filled and calls onSubmit via click', async () => {
    const user = userEvent.setup(); 
    const mockSubmit = vi.fn();
    
    renderWithMantine(<SearchBar onSubmit={mockSubmit} isLoading={false} />);
    
    const button = screen.getByRole('button', { name: /Books, yay!/i });
    expect(button).toBeDisabled();

    const locationInput = screen.getByPlaceholderText('e.g., London, Paris...');
    await user.type(locationInput, 'Tokyo');

    expect(button).not.toBeDisabled();
    await user.click(button);

    expect(mockSubmit).toHaveBeenCalledWith('Tokyo');
  });

  it('calls onSubmit when the Enter key is pressed', async () => {
    const user = userEvent.setup(); 
    const mockSubmit = vi.fn();
    
    renderWithMantine(<SearchBar onSubmit={mockSubmit} isLoading={false} />);
    
    const locationInput = screen.getByPlaceholderText('e.g., London, Paris...');
    
    await user.type(locationInput, 'Kyoto{enter}');
    expect(mockSubmit).toHaveBeenCalledWith('Kyoto');
  });

  it('disables the submit button when isLoading is true', () => {
    renderWithMantine(<SearchBar onSubmit={vi.fn()} isLoading={true} />);
    
    const button = screen.getByRole('button', { name: /Books, yay!/i });
    expect(button).toBeDisabled();
  });
});
