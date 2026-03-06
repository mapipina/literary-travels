import request from 'supertest';
import { describe, it, expect } from 'vitest';
import app from './app';

describe('API Routes', () => {
  
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

  describe('GET /api/search', () => {
    it('returns search results for a given query', async () => {
      const response = await request(app).get('/api/search?query=London');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Search successful for: London');
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

});
