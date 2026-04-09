import request from 'supertest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from './app'; 
import { getBooksByLocation } from './services/WikidataService';
import SearchCache from './models/SearchCache';
import SavedBook from './models/SavedBook';

vi.mock('./config/database', () => {
  return {
    default: {
      authenticate: vi.fn().mockResolvedValue(undefined),
      define: vi.fn(),
      sync: vi.fn().mockResolvedValue(undefined),
    },
  };
});

vi.mock('./models/SavedBook', () => {
  return {
    default: {
      findOne: vi.fn(),
      create: vi.fn(),
      findAll: vi.fn(),
      init: vi.fn(),
    }
  };
});
vi.mock('./models/SearchCache', () => {
  return {
    default: {
      findOne: vi.fn(), 
      upsert: vi.fn().mockResolvedValue(true),
      init: vi.fn(),
    }
  };
});
vi.mock('./services/WikidataService');
const mockedGetBooks = vi.mocked(getBooksByLocation);

describe('API Routes', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to Cache Miss for most tests unless overridden
    vi.mocked(SearchCache.findOne).mockResolvedValue(null);
  });

  describe('GET /api/health', () => {
    it('returns a 200 OK status and correct message with db heartbeat', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });

  describe('GET /api/search', () => {

    it('returns 400 if the location parameter is missing', async () => {
        const response = await request(app).get('/api/search');
        expect(response.status).toBe(400);
    });

    it('CACHE HIT: returns cached data and bypasses Wikidata', async () => {
        const mockCachedData = [{ title: 'Cached Book', author: 'Cached Author' }];
        const futureDate = new Date();
        futureDate.setHours(futureDate.getHours() + 1);

        vi.mocked(SearchCache.findOne).mockResolvedValueOnce({
            location: 'paris',
            data: mockCachedData,
            expiresAt: futureDate
        } as any);

        const response = await request(app).get('/api/search?wikidataId=Q90&name=Paris');
        
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Found cached books for Paris');
        expect(response.body.data).toEqual(mockCachedData);
        expect(mockedGetBooks).not.toHaveBeenCalled();
    });

    it('CACHE MISS: queries Wikidata and upserts to cache', async () => {
        const mockApiData = [{ title: 'API Book', author: 'API Author' }];
        mockedGetBooks.mockResolvedValueOnce(mockApiData as any);

        const response = await request(app).get('/api/search?wikidataId=Q84&name=London');
        
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual(mockApiData);
        expect(mockedGetBooks).toHaveBeenCalledWith('Q84', 'London');
        expect(SearchCache.upsert).toHaveBeenCalled();
    });
  });

describe('POST /api/books', () => {
    
    it('returns 400 if critical payload data is missing', async () => {
      const invalidPayload = { title: 'Incomplete Book', author: 'Author', location: 'City' };
      
      const response = await request(app)
        .post('/api/books')
        .send({ book: invalidPayload });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Critical data missing');
    });

    it('returns 409 if the book is already in the database', async () => {
      vi.mocked(SavedBook.findOne).mockResolvedValueOnce({ title: 'Duplicate' } as any);

      const validPayload = { 
        wikidataId: 'Q123',
        title: 'Duplicate', 
        author: 'Author', 
        location: 'City', 
        coordinates: { lat: 10, lng: 20 } 
      };

      const response = await request(app)
        .post('/api/books')
        .send({ book: validPayload });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('This book is already in your saved trips.');
    });

    it('returns 201 and creates the book successfully', async () => {
      vi.mocked(SavedBook.findOne).mockResolvedValueOnce(null);
      vi.mocked(SavedBook.create).mockResolvedValueOnce({ id: 1, title: 'New Book' } as any);

      const validPayload = { 
        wikidataId: 'Q456',
        title: 'New Book', 
        author: 'Author', 
        location: 'City', 
        coordinates: { lat: 10, lng: 20 } 
      };

      const response = await request(app)
        .post('/api/books')
        .send({ book: validPayload });

      expect(response.status).toBe(201);
      expect(SavedBook.create).toHaveBeenCalledWith(expect.objectContaining({
        wikidataId: 'Q456',
        lat: 10,
        lng: 20
      }));
    });
  });

  describe('GET /api/books', () => {
    it('returns 200 and reshapes flat DB rows into nested coordinates', async () => {
      const mockDbRows = [
        {
          get: () => ({ title: 'Book 1', lat: 40.7128, lng: -74.0060 })
        }
      ];
      vi.mocked(SavedBook.findAll).mockResolvedValueOnce(mockDbRows as any);

      const response = await request(app).get('/api/books');

      expect(response.status).toBe(200);
      expect(response.body.data[0].coordinates).toEqual({
        lat: 40.7128,
        lng: -74.0060
      });
    });

    it('returns 500 if the database query fails', async () => {
      vi.mocked(SavedBook.findAll).mockRejectedValueOnce(new Error('DB Connection Lost'));

      const response = await request(app).get('/api/books');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to retrieve books from db');
    });
  });
});
