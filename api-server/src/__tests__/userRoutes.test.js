const {expect, test, describe} = require('@jest/globals');
// supertest is a library for testing HTTP servers
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');

// 🧪 Generating a test token - it mimics an authenticated user
const testToken = jwt.sign(
    {sub: 'test-user-id'},
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn: '1h'}
);

// 🧪 Mocking the request object to include the user'
describe('GET /me', ()=> {
    test('should return the current user profile if authenticated', async () => {
        const response = await request(app)
            .get('/api/user/me')
            .set('Authorization', `Bearer ${testToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('username');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('linkedin_handle');
        expect(response.body).toHaveProperty('profile_picture_url');
    });

    test('should return 401 if not authenticated or token is invalid', async () => {
        const response = await request(app)
            .get('/api/user/me');

        expect(response.statusCode).toBe(403);
        expect(response.body).toHaveProperty('error', 'Invalid or expired token');
    });
});