import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './app'; 
import { getBooksByLocation } from './services/WikidataService';

vi.mock('./services/WikidataService');
const mockedGetBooks = vi.mocked(getBooksByLocation);

describe('API Routes', () => {
  
  // Your original health check block
  describe('GET /api/health', () => {
    it('returns a 200 OK status and correct message', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        message: 'Literary Travels API is running.'
      });
    });
  });

  // The new search endpoint block
  describe('GET /api/search', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns 400 if the location parameter is missing', async () => {
        const response = await request(app).get('/api/search');
        
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Location param is required.' });
    });

    it('returns 200 and a success message when books are found', async () => {
        mockedGetBooks.mockResolvedValueOnce([
            {
              title: 'Mock Book', author: 'Mock Author', location: 'Paris',
              coordinates: undefined
            }
        ]);

        const response = await request(app).get('/api/search?query=Paris');
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Found matched books for Paris');
        expect(response.body.data).toHaveLength(1);
    });

    it('returns 200 and an empty message when no books are found', async () => {
        mockedGetBooks.mockResolvedValueOnce([]); // Empty array

        const response = await request(app).get('/api/search?query=Atlantis');
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('No books found based in Atlantis');
        expect(response.body.data).toEqual([]);
    });

    it('returns 500 if the Wikidata service throws an error', async () => {
        mockedGetBooks.mockRejectedValueOnce(new Error('Wikidata is down'));

        const response = await request(app).get('/api/search?query=London');
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to retrieve data from Wikidata' });
    });
  });

});
