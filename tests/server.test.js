const request = require('supertest');
const { app } = require('../app'); // import app.js
const mongoose = require('mongoose');
const connection = require('../node/src/config/db');

beforeAll(async () => {
  await connection(); // kết nối DB trước khi test
}, 15000);

afterAll(async () => {
  await mongoose.disconnect(); // đóng kết nối sau khi test xong
});
describe('API Tests', () => {
  it('should return 200 for the home route', async () => {
    const res = await request(app).get('/home');
    expect(res.statusCode).toBe(200);
  }, 10000);

  it('should return 404 for an unknown route', async () => {
    const res = await request(app).get('/unknown-route');
    expect(res.statusCode).toBe(404);
  }, 10000);
});