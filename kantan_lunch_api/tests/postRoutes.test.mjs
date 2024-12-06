import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import Restaurant from '../src/models/restaurantModel.js';
import Dish from '../src/models/dishModel.js';

describe('POST /api/posts', () => {
    let validFeedback;
    let validDishFeedback;

    beforeEach(async () => {
        // Fetch a restaurant from the seeded database
        const restaurant = await Restaurant.findOne({}).lean();
        if (!restaurant) {
            throw new Error('No restaurant found in the seeded database.');
        }

        const dish = await Dish.findOne({}).lean();

        validFeedback = {
            type: "Feedback",
            caption: "Great service and ambiance!",
            content: "The food was amazing and the staff were very friendly.",
            media: ["https://example.com/image1.jpg"],
            restaurant_id: restaurant._id.toString(),
            rating: 5
        };

        validDishFeedback = {
            type: "DishFeedback",
            caption: "Delicious food!",
            content: "The food was amazing and the staff were very friendly.",
            media: ["https://example.com/image1.jpg"],
            dish_id: dish._id.toString(),
            rating: 5
        };
    });

    it('should create a new Feedback successfully with userToken', async () => {
        const response = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${global.userToken}`)
            .send(validFeedback);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.type).toBe(validFeedback.type);
        expect(response.body.caption).toBe(validFeedback.caption);
    });

    it('should return 400 if required fields are missing', async () => {
        const { type, ...incompletePost } = validFeedback;
        
        const response = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${global.userToken}`)
            .send(incompletePost);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for invalid media URLs', async () => {
        const invalidMediaPost = {
            ...validFeedback,
            media: ["invalid-url"]
        };
        
        const response = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${global.userToken}`)
            .send(invalidMediaPost);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .post('/api/posts')
            .send(validFeedback);
        
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Not authorized, no token provided.');
    });

    it('should return 404 if related restaurant is not found', async () => {
        const invalidRestaurantPost = {
            ...validFeedback,
            restaurant_id: "60d5ec49f9a1b14a3c8d9999" // Assuming this ID does not exist
        };
        
        const response = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${global.userToken}`)
            .send(invalidRestaurantPost);
        
        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Restaurant not found.');
    });

    it('should create a new DishFeedback successfully with userToken', async () => {
        const response = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${global.userToken}`)
            .send(validDishFeedback);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.type).toBe(validDishFeedback.type);
        expect(response.body.caption).toBe(validDishFeedback.caption);
    });

    it('should return 400 if required fields are missing for DishFeedback', async () => {
        const { type, ...incompletePost } = validDishFeedback;
        
        const response = await request(app)
            .post('/api/posts')
            .set('Authorization', `Bearer ${global.userToken}`)
            .send(incompletePost);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});