import request from 'supertest';
import app from '../index.js';  

describe('Task API', () => {
  it('GET / should return API status message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Task Management API is running!');
  });
});
