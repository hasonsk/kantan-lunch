import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Restaurant from '../models/restaurantModel.js';

const userSeedData = [
    {
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'Admin@123', 
        role: 'admin',
        profile: {
            first_name: 'Admin',
            last_name: 'User',
            date_of_birth: new Date('1980-01-01'),
            phone_number: '+84912345678',
            avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg',
        },
    },
    {
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'User@123',
        role: 'user',
        profile: {
            first_name: 'John',
            last_name: 'Doe',
            date_of_birth: new Date('1990-05-15'),
            phone_number: '+84987654321',
            avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg',
        },
    },
    {
        username: 'janedoe',
        email: 'janedoe@example.com',
        password: 'User@456',
        role: 'user',
        profile: {
            first_name: 'Jane',
            last_name: 'Doe',
            date_of_birth: new Date('1992-07-20'),
            phone_number: '+84911223344',
            avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg',
        },
    },
];

const restaurantSeedData = [
    {
        name: 'Nama Sushi',
        address: '12 P. Trần Đại Nghĩa, Đồng Tâm, Hai Bà Trưng, Hà Nội, Vietnam',
        media: [
            'https://example.com/images/nama-sushi1.jpg',
            'https://example.com/images/nama-sushi2.jpg',
        ],
        phone_number: '+84912345678',
        open_time: "11:00",  // 11:00 AM
        close_time: "23:00", // 11:00 PM
    },
    {
        name: 'Gecko Restaurant',
        address: '10 P. Tạ Quang Bửu, Bách Khoa, Hai Bà Trưng, Hà Nội, Vietnam',
        media: [
            'https://example.com/images/gecko-restaurant1.jpg',
            'https://example.com/images/gecko-restaurant2.jpg',
        ],
        phone_number: '+84987654321',
        open_time: "10:00",  // 10:00 AM
        close_time: "22:00", // 10:00 PM
    },
    {
        name: 'Nhat Ly Goat Restaurant',
        address: '78 Đ. Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội, Vietnam',
        media: [
            'https://example.com/images/nhat-ly-goat1.jpg',
            'https://example.com/images/nhat-ly-goat2.jpg',
        ],
        phone_number: '+84911223344',
        open_time: "12:00",  // 12:00 PM
        close_time: "21:00", // 9:00 PM
    },
];

const seedDB = async () => {
    try {
        // Seed Users
        const existingUsers = await User.find();
        if (existingUsers.length === 0) {
            // Hash mật khẩu cho từng user
            const hashedUsers = await Promise.all(
                userSeedData.map(async (user) => {
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(user.password, salt);
                    return {
                        ...user,
                        password: hashedPassword,
                    };
                })
            );

            const createdUsers = await User.insertMany(hashedUsers);
            console.log('User seed data inserted');

            // Seed Restaurants
            const existingRestaurants = await Restaurant.find();
            if (existingRestaurants.length === 0) {
                // Gán admin_id cho các nhà hàng (sử dụng admin đầu tiên)
                const admin = createdUsers.find(user => user.role === 'admin');
                if (!admin) {
                    throw new Error('Admin user not found');
                }

                const restaurantsWithAdmin = restaurantSeedData.map(rest => ({
                    ...rest,
                    admin_id: admin._id,
                }));

                await Restaurant.insertMany(restaurantsWithAdmin);
                console.log('Restaurant seed data inserted');
            } 
        }
    } catch (err) {
        console.error('Error seeding data:', err.message);
        process.exit(1);
    }
};

export default seedDB;
