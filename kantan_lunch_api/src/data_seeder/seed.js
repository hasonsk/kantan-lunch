import mongoose from 'mongoose';
import Restaurant from '../models/restaurantModel.js';

import { MONGO_URI } from '../config/config.js';

const restaurantSeedData = [
    {
        name: 'Nama Sushi',
        address: '12 P. Trần Đại Nghĩa, Đồng Tâm, Hai Bà Trưng, Hà Nội, Vietnam',
        rating: 4.5,
    },
    {
        name: 'Gecko Restaurant',
        address: '10 P. Tạ Quang Bửu, Bách Khoa, Hai Bà Trưng, Hà Nội, Vietnam',
        rating: 4.3,
    },
    {
        name: 'Nhat Ly Goat Restaurant',
        address: '78 Đ. Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội, Vietnam',
        rating: 4.1,
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        const existingRestaurants = await Restaurant.find();
        if (existingRestaurants.length > 0) {
            return;
        } else {
            await Restaurant.insertMany(restaurantSeedData);
            console.log('Restaurant seed data inserted');
        }

        mongoose.connection.close();
        console.log('Connection closed');
    } catch (err) {
        console.error('Error seeding data:', err.message);
        process.exit(1);
    }
};

export default seedDB;