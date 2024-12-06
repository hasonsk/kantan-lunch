import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import User from '../src/models/userModel.js';
import Restaurant from '../src/models/restaurantModel.js';

describe('POST /api/users/register', () => {
    const validUser = {
        username: "johndoe1",
        email: "johndoe1@example.com",
        password: "password123",
        profile: {
            first_name: "John",
            last_name: "Doe",
            date_of_birth: "1990-01-01",
            phone_number: "+1234567890",
            avatar: "https://example.com/avatar.jpg"
        },
        loved_restaurants: []
    };

    it('should register a new user successfully', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send(validUser);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.username).toBe(validUser.username);
        expect(response.body.email).toBe(validUser.email);
        expect(response.body).toHaveProperty('token');
    });

    it('should return 400 if required fields are missing', async () => {
        const { username, ...incompleteUser } = validUser;

        const response = await request(app)
            .post('/api/users/register')
            .send(incompleteUser);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 409 if email or username already exists', async () => {
        // Register the user first time
        await request(app)
            .post('/api/users/register')
            .send(validUser);
        
        // Attempt to register the same user again
        const response = await request(app)
            .post('/api/users/register')
            .send(validUser);
        
        expect(response.status).toBe(409);
        expect(response.body.message).toBe('User with this email or username already exists.');
    });

    it('should return 400 for invalid email format', async () => {
        const invalidEmailUser = {
            ...validUser,
            email: "invalidemail"
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(invalidEmailUser);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for short password', async () => {
        const shortPasswordUser = {
            ...validUser,
            password: "123"
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(shortPasswordUser);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});

describe('POST /api/users/login', () => {
    const userCredentials = {
        email: "johndoe1@example.com",
        password: "password123"
    };

    beforeEach(async () => {
        // Register a user to login
        const user = {
            username: "johndoe1",
            email: userCredentials.email,
            password: userCredentials.password,
            profile: {
                first_name: "John",
                last_name: "Doe",
                date_of_birth: "1990-01-01",
                phone_number: "+1234567890",
                avatar: "https://example.com/avatar.jpg"
            },
            loved_restaurants: []
        };

        await request(app)
            .post('/api/users/register')
            .send(user);
    });

    it('should login successfully with valid credentials', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send(userCredentials);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.email).toBe(userCredentials.email);
        expect(response.body).toHaveProperty('token');
    });

    it('should return 401 with incorrect password', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({ email: userCredentials.email, password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid email or password.');
    });

    it('should return 401 with non-existent email', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({ email: 'nonexistent@example.com', password: 'password123' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid email or password.');
    });

    it('should return 400 if email is missing', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({ password: 'password123' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if password is missing', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({ email: userCredentials.email });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });
});

describe('PUT /api/users/change-password', () => {
    const changePasswordEndpoint = '/api/users/change-password';
    const credentials = {
        email: 'johndoe@example.com',
        currentPassword: 'User@123',
        newPassword: 'Newpassword@456'
    };

    it('should change password successfully with valid credentials', async () => {
        const payload = {
            currentPassword: credentials.currentPassword,
            newPassword: credentials.newPassword
        };

        const response = await request(app)
            .put(changePasswordEndpoint)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send(payload);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Password changed successfully.');

        // Verify login with new password
        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({ email: credentials.email, password: credentials.newPassword });
        
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toHaveProperty('token');
    });

    it('should return 400 if currentPassword is missing', async () => {
        const payload = {
            newPassword: credentials.newPassword
        };

        const response = await request(app)
            .put(changePasswordEndpoint)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if newPassword is missing', async () => {
        const payload = {
            currentPassword: credentials.currentPassword
        };

        const response = await request(app)
            .put(changePasswordEndpoint)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 if newPassword is less than 6 characters', async () => {
        const invalidPayload = {
            currentPassword: credentials.currentPassword,
            newPassword: '123'
        };

        const response = await request(app)
            .put(changePasswordEndpoint)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send(invalidPayload);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .put(changePasswordEndpoint)
            .send(credentials);
        
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Not authorized, no token provided.');
    });

    it('should return 401 if currentPassword is incorrect', async () => {
        const invalidCredentials = {
            currentPassword: 'wrongpassword',
            newPassword: 'newpassword456'
        };

        const response = await request(app)
            .put(changePasswordEndpoint)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send(invalidCredentials);
        
        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid current password.');
    });
});

describe('POST /api/users/:id/loved_restaurants', () => {
    let userId;
    let restaurantId;
    let otherUserId;

    beforeEach(async () => {
        // Get the seeded user and restaurant
        const user = await User.findOne({ role: 'user' });
        if (!user) {
            throw new Error('No user found with role "user" in the seeded database.');
        }
        userId = user._id.toString();
    
        const restaurant = await Restaurant.findOne({});
        if (!restaurant) {
            throw new Error('No restaurant found in the seeded database.');
        }
        restaurantId = restaurant._id.toString();

        // Get another user
        const otherUser = await User.findOne({ _id: { $ne: userId } });
        if (!otherUser) {
            throw new Error('No other user found in the seeded database.');
        }
        otherUserId = otherUser._id.toString();
    });

    it('should add a restaurant to loved_restaurants successfully', async () => {
        const response = await request(app)
            .post(`/api/users/${userId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send({ restaurantId });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Restaurant added to loved restaurants.');
        expect(response.body.data.loved_restaurants).toContain(restaurantId);
    });

    it('should return 400 for invalid user ID format', async () => {
        const invalidUserId = '12345';
        const response = await request(app)
            .post(`/api/users/${invalidUserId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send({ restaurantId });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for invalid restaurant ID format', async () => {
        const invalidRestaurantId = 'invalidId';
        const response = await request(app)
            .post(`/api/users/${userId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send({ restaurantId: invalidRestaurantId });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .post(`/api/users/${userId}/loved_restaurants`)
            .send({ restaurantId });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Not authorized, no token provided.');
    });

    it('should return 403 if user is not authorized to add loved restaurants', async () => {
        // Assume global.adminToken does not have 'user' role
        const response = await request(app)
            .post(`/api/users/${userId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.adminToken}`)
            .send({ restaurantId });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden: You do not have access to this resource.');
    });

    it('should return 403 if user is not the same as the user ID in the URL', async () => {
        const response = await request(app)
            .post(`/api/users/${otherUserId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send({ restaurantId });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden: You do not have permission to perform this action.');
    });

    it('should return 404 if restaurant is not found', async () => {
        const nonExistentRestaurantId = new mongoose.Types.ObjectId().toString();
        const response = await request(app)
            .post(`/api/users/${userId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send({ restaurantId: nonExistentRestaurantId });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Restaurant not found.');
    });

    it('should not add the same restaurant multiple times', async () => {
        // First addition
        await request(app)
            .post(`/api/users/${userId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send({ restaurantId });

        // Attempt to add the same restaurant again
        const response = await request(app)
            .post(`/api/users/${userId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send({ restaurantId });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Restaurant added to loved restaurants.');
        expect(response.body.data.loved_restaurants.filter(id => id === restaurantId)).toHaveLength(1);
    });
});

describe('DELETE /api/users/:id/loved_restaurants', () => {
    let userId;
    let restaurantId;
    let otherUserId;

    beforeEach(async () => {
        // Get the seeded user and restaurant
        const user = await User.findOne({ role: 'user' });
        if (!user) {
            throw new Error('No user found with role "user" in the seeded database.');
        }
        userId = user._id.toString();
    
        const restaurant = await Restaurant.findOne({});
        if (!restaurant) {
            throw new Error('No restaurant found in the seeded database.');
        }
        restaurantId = restaurant._id.toString();

        // Get another user
        const otherUser = await User.findOne({ _id: { $ne: userId } });
        if (!otherUser) {
            throw new Error('No other user found in the seeded database.');
        }
        otherUserId = otherUser._id.toString();

        // Add the restaurant to loved_restaurants before attempting to remove it
        await request(app)
            .post(`/api/users/${userId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .send({ restaurantId });
    });

    it('should remove a restaurant from loved_restaurants successfully', async () => {
        const response = await request(app)
            .delete(`/api/users/${userId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .query({ restaurantId });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Restaurant removed from loved restaurants.');
        expect(response.body.data.loved_restaurants).not.toContain(restaurantId);
    });

    it('should return 400 for invalid user ID format', async () => {
        const invalidUserId = '12345';
        const response = await request(app)
            .delete(`/api/users/${invalidUserId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .query({ restaurantId });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 400 for invalid restaurant ID format', async () => {
        const invalidRestaurantId = 'invalidId';
        const response = await request(app)
            .delete(`/api/users/${userId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .query({ restaurantId: invalidRestaurantId });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .delete(`/api/users/${userId}/loved_restaurants`)
            .query({ restaurantId });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Not authorized, no token provided.');
    });

    it('should return 403 if user is not authorized to remove loved restaurants', async () => {
        const response = await request(app)
            .delete(`/api/users/${userId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.adminToken}`)
            .query({ restaurantId });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden: You do not have access to this resource.');
    });

    it('should return 403 if user is not the same as the user ID in the URL', async () => {
        const response = await request(app)
            .delete(`/api/users/${otherUserId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .query({ restaurantId });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden: You do not have permission to perform this action.');
    });

    it('should return 404 if restaurant is not found', async () => {
        const nonExistentRestaurantId = new mongoose.Types.ObjectId().toString();
        const response = await request(app)
            .delete(`/api/users/${userId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .query({ restaurantId: nonExistentRestaurantId });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Restaurant not found.');
    });

    it('should return 400 if restaurant is not in loved_restaurants', async () => {
        // First, remove the restaurant
        await request(app)
            .delete(`/api/users/${userId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .query({ restaurantId });

        // Attempt to remove it again
        const response = await request(app)
            .delete(`/api/users/${userId}/loved_restaurants`)
            .set('Authorization', `Bearer ${global.userToken}`)
            .query({ restaurantId });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Restaurant is not in the loved restaurants list.');
    });
});