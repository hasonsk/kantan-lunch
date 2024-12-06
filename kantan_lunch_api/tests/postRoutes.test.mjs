import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import Restaurant from '../src/models/restaurantModel.js';
import Dish from '../src/models/dishModel.js';
import Post from '../src/models/postModel.js';

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

describe('PUT /api/posts/:id/approve', () => {
    let postId;

    beforeEach(async () => {
        // Get a post to approve from seeded database
        const post = await Post.findOne({ type: 'Feedback' }).lean();

        if (!post) {
            throw new Error('No post found in the seeded database.');
        }

        postId = post._id.toString();
    });

    it('should approve a post successfully with adminToken', async () => {
        const response = await request(app)
            .put(`/api/posts/${postId}/approve`)
            .set('Authorization', `Bearer ${global.adminToken}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Post approved successfully.');

        // Verify the post status is updated
        const updatedPost = await Post.findById(postId).lean();
        expect(updatedPost.reviewed).toBe(true);
    });

    it('should return 400 for invalid post ID format', async () => {
        const invalidId = '12345';

        const response = await request(app)
            .put(`/api/posts/${invalidId}/approve`)
            .set('Authorization', `Bearer ${global.adminToken}`)
            .send();

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .put(`/api/posts/${postId}/approve`)
            .send();

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Not authorized, no token provided.');
    });

    it('should return 403 if user is not an admin', async () => {
        const response = await request(app)
            .put(`/api/posts/${postId}/approve`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send();

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden: You do not have access to this resource.');
    });

    it('should return 404 if post is not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();

        const response = await request(app)
            .put(`/api/posts/${nonExistentId}/approve`)
            .set('Authorization', `Bearer ${global.adminToken}`)
            .send();

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Post not found.');
    });
});

describe('PUT /api/posts/:id/reject', () => {
    let postId;

    beforeEach(async () => {
        // Get a post to reject from seeded database
        const post = await Post.findOne({ type: 'Feedback' }).lean();

        if (!post) {
            throw new Error('No post found in the seeded database.');
        }

        postId = post._id.toString();
    });

    it('should reject a post successfully with adminToken', async () => {
        const response = await request(app)
            .put(`/api/posts/${postId}/reject`)
            .set('Authorization', `Bearer ${global.adminToken}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Post rejected successfully.');

        // Verify the post status is updated
        const updatedPost = await Post.findById(postId).lean();
        expect(updatedPost.reviewed).toBe(false);
    });

    it('should return 400 for invalid post ID format', async () => {
        const invalidId = 'abcde';

        const response = await request(app)
            .put(`/api/posts/${invalidId}/reject`)
            .set('Authorization', `Bearer ${global.adminToken}`)
            .send();

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .put(`/api/posts/${postId}/reject`)
            .send();

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Not authorized, no token provided.');
    });

    it('should return 403 if user is not an admin', async () => {
        const response = await request(app)
            .put(`/api/posts/${postId}/reject`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send();

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden: You do not have access to this resource.');
    });

    it('should return 404 if post is not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();

        const response = await request(app)
            .put(`/api/posts/${nonExistentId}/reject`)
            .set('Authorization', `Bearer ${global.adminToken}`)
            .send();

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Post not found.');
    });
});