// Ensure tests don't trigger DB connection/listen
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../main'); // imports the exported app

describe('Static route tests', () => {
  test('GET /about returns 200 and contains "About Page"', async () => {
    const res = await request(app).get('/about');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/About Page/);
  });

  test('GET /add returns 200 and contains "Register New User"', async () => {
    const res = await request(app).get('/add');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Register New User/);
  });
});
