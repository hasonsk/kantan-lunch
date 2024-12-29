import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('GET /api/restaurants', () => {
    it('should return a list of restaurants', async () => {
        const response = await request(app).get('/api/restaurants');

        // Check for HTTP status 200
        expect(response.status).toBe(200);

        // Ensure the response body has the expected structure
        expect(response.body).toHaveProperty('total');
        expect(response.body).toHaveProperty('page');
        expect(response.body).toHaveProperty('limit');
        expect(response.body).toHaveProperty('totalPages');
        expect(response.body).toHaveProperty('data');

        // Check that 'data' is an array
        expect(Array.isArray(response.body.data)).toBe(true);

        // Optionally, check the length of the data array
        expect(response.body.data.length).toBeGreaterThan(0);

        // Verify the structure of the first restaurant object
        const restaurant = response.body.data[0];
        expect(restaurant).toHaveProperty('_id');
        expect(restaurant).toHaveProperty('name');
        expect(restaurant).toHaveProperty('media');
        expect(restaurant).toHaveProperty('admin_id');
        expect(restaurant).toHaveProperty('address');
        expect(restaurant).toHaveProperty('location');
        expect(restaurant).toHaveProperty('phone_number');
        expect(restaurant).toHaveProperty('avg_rating');
        expect(restaurant).toHaveProperty('open_time');
        expect(restaurant).toHaveProperty('close_time');
        expect(restaurant).toHaveProperty('averagePrice');
    });

    it('should return 400 for invalid page parameter', async () => {
        const response = await request(app).get('/api/restaurants?page=-1');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return paginated results', async () => {
        const response = await request(app).get('/api/restaurants?page=2&limit=5');
        expect(response.status).toBe(200);
        expect(response.body.page).toBe(2);
        expect(response.body.limit).toBe(5);
        expect(response.body.data.length).toBeLessThanOrEqual(5);
    });

    it('should sort restaurants by name in descending order', async () => {
        const response = await request(app).get('/api/restaurants?sortBy=name&sortOrder=desc');
        expect(response.status).toBe(200);
        const restaurants = response.body.data;
        for (let i = 1; i < restaurants.length; i++) {
            expect(restaurants[i - 1].name >= restaurants[i].name).toBe(true);
        }
    });

    it('should filter restaurants by search term', async () => {
        const searchTerm = 'Pizza';
        const response = await request(app).get(`/api/restaurants?search=${encodeURIComponent(searchTerm)}`);
        expect(response.status).toBe(200);
        response.body.data.forEach(restaurant => {
            const nameMatch = restaurant.name.includes(searchTerm);
            const addressMatch = restaurant.address.includes(searchTerm);
            expect(nameMatch || addressMatch).toBe(true);
        });
    });

    it('should filter restaurants within a specific price range', async () => {
        const minPrice = 100000;
        const maxPrice = 200000;
        const response = await request(app).get(`/api/restaurants?minAvgPrice=${minPrice}&maxAvgPrice=${maxPrice}`);
        expect(response.status).toBe(200);
        response.body.data.forEach(restaurant => {
            expect(restaurant.averagePrice).toBeGreaterThanOrEqual(minPrice);
            expect(restaurant.averagePrice).toBeLessThanOrEqual(maxPrice);
        });
    });

    it('should filter restaurants by average rating', async () => {
        const avgRating = 4;
        const response = await request(app).get(`/api/restaurants?avgRating=${avgRating}`);
        expect(response.status).toBe(200);
        response.body.data.forEach(restaurant => {
            expect(restaurant.avg_rating).toBeGreaterThanOrEqual(avgRating);
        });
    });
});

describe('POST /api/restaurants', () => {
    const validRestaurant = {
        name: 'Test Restaurant',
        address: '123 Test Street',
        phone_number: '+1234567890',
        open_time: '09:00',
        close_time: '22:00',
        media: ['http://example.com/image1.jpg'],
    };

    it('should allow admin to create a restaurant', async () => {
        const response = await request(app)
            .post('/api/restaurants')
            .set('Authorization', `Bearer ${global.adminToken}`)
            .send(validRestaurant);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.name).toBe(validRestaurant.name);
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .post('/api/restaurants')
            .send(validRestaurant);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Not authorized, no token provided.');
    });

    it('should return 403 if user is not admin', async () => {
        const response = await request(app)
            .post('/api/restaurants')
            .set('Authorization', `Bearer ${global.userToken}`)
            .send(validRestaurant);

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden: You do not have access to this resource.');
    });

    it('should return 400 for invalid input data', async () => {
        const invalidData = { ...validRestaurant, phone_number: 'invalid' };
        const response = await request(app)
            .post('/api/restaurants')
            .set('Authorization', `Bearer ${global.adminToken}`)
            .send(invalidData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 409 for duplicate restaurant name', async () => {
        // Create first restaurant
        await request(app)
            .post('/api/restaurants')
            .set('Authorization', `Bearer ${global.adminToken}`)
            .send(validRestaurant);

        // Attempt to create duplicate
        const response = await request(app)
            .post('/api/restaurants')
            .set('Authorization', `Bearer ${global.adminToken}`)
            .send(validRestaurant);

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Duplicate field value entered.');
    });
});