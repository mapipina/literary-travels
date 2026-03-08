import { describe, it, expect } from 'vitest';
import { groupBooksByLocation } from './mapUtils';
import type { Book } from '../services/apiClient';

describe('groupBooksByLocation', () => {
    it('groups multiple books with the same coordinates into a single location object', () => {
        const mockBooks: Book[] = [
            { title: 'Book A', author: 'Author 1', location: 'London', coordinates: { lat: 51.5, lng: -0.1 } },
            { title: 'Book B', author: 'Author 2', location: 'London', coordinates: { lat: 51.5, lng: -0.1 } },
            { title: 'Book C', author: 'Author 3', location: 'Paris', coordinates: { lat: 48.8, lng: 2.3 } },
            { title: 'Book D', author: 'Author 4', location: 'Unknown' } 
        ];

        const result = groupBooksByLocation(mockBooks);
        expect(result).toHaveLength(2);

        const londonGroup = result.find(g => g.location === 'London');
        expect(londonGroup?.books).toHaveLength(2);
        expect(londonGroup?.books[0].title).toBe('Book A');
        expect(londonGroup?.books[1].title).toBe('Book B');

        const parisGroup = result.find(g => g.location === 'Paris');
        expect(parisGroup?.books).toHaveLength(1);
    });
});
