import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getBooksByLocation } from './WikidataService';

vi.mock('axios');

describe('WikidataService - getBooksByLocation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('successfully maps a complete Wikidata response', async () => {
        const mockRawData = {
            head: { vars: [] },
            results: {
                bindings: [
                    {
                        bookLabel: { type: 'literal', value: 'The Marlow Murder Club' },
                        authorLabel: { type: 'literal', value: 'Robert Thorogood' },
                        locationLabel: { type: 'literal', value: 'Marlow' },
                        coordinates: { type: 'literal', value: 'Point(-0.77 51.57)' },
                        genreLabel: { type: 'literal', value: 'Cozy Mystery' },
                        pubDate: { type: 'literal', value: '2021-01-07T00:00:00Z' }
                    }
                ]
            }
        };

        vi.mocked(axios.get).mockResolvedValueOnce({ data: mockRawData });

        const result = await getBooksByLocation('Marlow');

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            title: 'The Marlow Murder Club',
            author: 'Robert Thorogood',
            location: 'Marlow',
            coordinates: { lat: 51.57, lng: -0.77 },
            genres: ['Cozy Mystery'],
            publicationYear: 2021
        });
    });

    it('safely handles missing optional fields like genre, date, and coordinates', async () => {
        const mockRawData = {
            head: { vars: [] },
            results: {
                bindings: [
                    {
                        bookLabel: { type: 'literal', value: 'Unknown Book' },
                        // No author, coordinates, genre, or date provided
                        locationLabel: { type: 'literal', value: 'London' }
                    }
                ]
            }
        };

        vi.mocked(axios.get).mockResolvedValueOnce({ data: mockRawData });

        const result = await getBooksByLocation('London');

        expect(result[0]).toEqual({
            title: 'Unknown Book',
            author: 'Unknown',
            location: 'London',
            coordinates: undefined,
            genres: [],
            publicationYear: null
        });
    });

    // Updated: Added new test block to verify the deduplication and genre merging logic
    it('deduplicates books and merges multiple genres into an array', async () => {
        const mockRawData = {
            head: { vars: [] },
            results: {
                bindings: [
                    {
                        bookLabel: { type: 'literal', value: 'The Lady in the Lake' },
                        authorLabel: { type: 'literal', value: 'Raymond Chandler' },
                        locationLabel: { type: 'literal', value: 'Los Angeles' },
                        genreLabel: { type: 'literal', value: 'detective fiction' }
                    },
                    {
                        bookLabel: { type: 'literal', value: 'The Lady in the Lake' },
                        authorLabel: { type: 'literal', value: 'Raymond Chandler' },
                        locationLabel: { type: 'literal', value: 'Los Angeles' },
                        genreLabel: { type: 'literal', value: 'noir fiction' }
                    }
                ]
            }
        };

        vi.mocked(axios.get).mockResolvedValueOnce({ data: mockRawData });

        const result = await getBooksByLocation('Los Angeles');

        expect(result).toHaveLength(1); 
        expect(result).toEqual([{
            title: 'The Lady in the Lake',
            author: 'Raymond Chandler',
            location: 'Los Angeles',
            coordinates: undefined,
            genres: ['detective fiction', 'noir fiction'],
            publicationYear: null
        }]);
    });

    it('throws an error if the Axios request fails', async () => {
        vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network Error'));

        await expect(getBooksByLocation('London')).rejects.toThrow('Network Error');
    });
});
