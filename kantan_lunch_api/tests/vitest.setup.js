import { beforeAll, afterAll, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import seedDB from '../src/data_seeder/seedForTest.js';
import jwt from 'jsonwebtoken';
import User from '../src/models/userModel.js';

let mongoServer;
let adminToken;
let userToken;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);

    console.log('Connected to In-Memory MongoDB');

    await seedDB();
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    console.log('Disconnected from In-Memory MongoDB');
});

beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
    await seedDB();

    // Retrieve seeded users
    const adminUser = await User.findOne({ role: 'admin' });
    const regularUser = await User.findOne({ role: 'user' });

    // Generate JWT tokens
    adminToken = jwt.sign(
        { id: adminUser._id, role: adminUser.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
    );

    userToken = jwt.sign(
        { id: regularUser._id, role: regularUser.role },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '1h' }
    );

    // Attach tokens to global object
    global.adminToken = adminToken;
    global.userToken = userToken;
});