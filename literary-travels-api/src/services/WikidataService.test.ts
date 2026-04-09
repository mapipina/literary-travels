import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { getBooksByLocation } from './WikidataService';

vi.mock('axios');

// --- Mock Fixtures ---
const createMockResponse = (bindings: any[]) => ({
    head: { vars: [] },
    results: { bindings }
});

const standardBookBindings = [
    {
        book: { type: 'uri', value: 'http://www.wikidata.org/entity/Q104870535' },
        bookLabel: { type: 'literal', value: 'The Marlow Murder Club' },
        authorLabel: { type: 'literal', value: 'Robert Thorogood' },
        locationLabel: { type: 'literal', value: 'Marlow' },
        coordinates: { type: 'literal', value: 'Point(-0.77 51.57)' },
        genreLabel: { type: 'literal', value: 'Cozy Mystery' },
        pubDate: { type: 'literal', value: '2021-01-07T00:00:00Z' },
        isbn13: { type: 'literal', value: '978-0-00-841198-8' }
    }
];

const incompleteBookBindings = [
    {
        book: { type: 'uri', value: 'http://www.wikidata.org/entity/Q99999' },
        bookLabel: { type: 'literal', value: 'Unknown Book' },
        locationLabel: { type: 'literal', value: 'London' }
    }
];

const duplicateGenreBindings = [
    {
        book: { type: 'uri', value: 'http://www.wikidata.org/entity/Q1080000' },
        bookLabel: { type: 'literal', value: 'The Lady in the Lake' },
        authorLabel: { type: 'literal', value: 'Raymond Chandler' },
        locationLabel: { type: 'literal', value: 'Los Angeles' },
        genreLabel: { type: 'literal', value: 'detective fiction' }
    },
    {
        book: { type: 'uri', value: 'http://www.wikidata.org/entity/Q1080000' },
        bookLabel: { type: 'literal', value: 'The Lady in the Lake' },
        authorLabel: { type: 'literal', value: 'Raymond Chandler' },
        locationLabel: { type: 'literal', value: 'Los Angeles' },
        genreLabel: { type: 'literal', value: 'noir fiction' }
    }
];

const multipleAuthorBindings = [
    {
        book: { type: 'uri', value: 'http://www.wikidata.org/entity/Q4093' }, 
        bookLabel: { type: 'literal', value: 'The Communist Manifesto' },
        authorLabel: { type: 'literal', value: 'Karl Marx' },
        locationLabel: { type: 'literal', value: 'Germany' },
    },
    {
        book: { type: 'uri', value: 'http://www.wikidata.org/entity/Q4093' }, 
        bookLabel: { type: 'literal', value: 'The Communist Manifesto' },
        authorLabel: { type: 'literal', value: 'Friedrich Engels' },
        locationLabel: { type: 'literal', value: 'Germany' },
    }
];

// --- Test Suite ---
describe('WikidataService - getBooksByLocation', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('successfully maps a complete Wikidata response', async () => {
        vi.mocked(axios.get).mockResolvedValueOnce({ data: createMockResponse(standardBookBindings) });

        const result = await getBooksByLocation('Q104870535', 'Marlow');

        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            wikidataId: 'Q104870535',
            isbn: '978-0-00-841198-8',
            title: 'The Marlow Murder Club',
            author: 'Robert Thorogood',
            location: 'Marlow',
            coordinates: { lat: 51.57, lng: -0.77 },
            genres: ['Cozy Mystery'],
            publicationYear: 2021
        });
    });

    it('safely handles missing optional fields like genre, date, isbn, and coordinates', async () => {
        vi.mocked(axios.get).mockResolvedValueOnce({ data: createMockResponse(incompleteBookBindings) });

        const result = await getBooksByLocation('Q99999', 'London');

        expect(result[0]).toEqual({
            wikidataId: 'Q99999',
            isbn: null,
            title: 'Unknown Book',
            author: 'Unknown',
            location: 'London',
            coordinates: undefined,
            genres: [],
            publicationYear: null
        });
    });

    it('deduplicates books by wikidataId and merges multiple genres into an array', async () => {
        vi.mocked(axios.get).mockResolvedValueOnce({ data: createMockResponse(duplicateGenreBindings) });

        const result = await getBooksByLocation('Q1080000', 'Los Angeles');

        expect(result).toHaveLength(1); 
        expect(result[0]).toEqual({
            wikidataId: 'Q1080000',
            isbn: null,
            title: 'The Lady in the Lake',
            author: 'Raymond Chandler',
            location: 'Los Angeles',
            coordinates: undefined,
            genres: ['detective fiction', 'noir fiction'],
            publicationYear: null
        });
    });

    it('concatenates authors and illustrators when multiple creators share the same wikidataId', async () => {
        vi.mocked(axios.get).mockResolvedValueOnce({ data: createMockResponse(multipleAuthorBindings) });

        const result = await getBooksByLocation('Q4093', 'Germany');

        expect(result).toHaveLength(1); 
        expect(result[0].author).toBe('Karl Marx, Friedrich Engels');
    });

    it('throws an error if the Axios request fails', async () => {
        vi.mocked(axios.get).mockRejectedValueOnce(new Error('Network Error'));

        await expect(getBooksByLocation('Q99999', 'London')).rejects.toThrow('Network Error');
    });
});
