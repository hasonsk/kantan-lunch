import bcrypt from 'bcryptjs';
import NodeGeocoder from 'node-geocoder';

import User from '../models/userModel.js';
import Restaurant from '../models/restaurantModel.js';
import Dish from '../models/dishModel.js';
import Post from '../models/postModel.js';
import Like from '../models/likeModel.js';

// Cấu hình Geocoder
const geocoderOptions = {
    provider: 'openstreetmap'
};
const geocoder = NodeGeocoder(geocoderOptions);

const seedUsers = async () => {
    const users = [
        {
            username: 'adminuser',
            email: 'admin@example.com',
            password: await bcrypt.hash('Admin@123', 10),
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
            password: await bcrypt.hash('User@123', 10),
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
            password: await bcrypt.hash('User@123', 10),
            role: 'user',
            profile: {
                first_name: 'Jane',
                last_name: 'Doe',
                date_of_birth: new Date('1992-07-20'),
                phone_number: '+84911223344',
                avatar: 'https://static.vecteezy.com/system/resources/previews/009/292/244/original/default-avatar-icon-of-social-media-user-vector.jpg',
            },
        },
        // Add more users...
    ];
    const createdUsers = await User.insertMany(users);
    return {
        admin: createdUsers[0]._id,
        user1: createdUsers[1]._id,
        user2: createdUsers[2]._id,
        // Add more user Ids...
    };
};

const seedRestaurants = async (userIds) => {
    const restaurants = [
        {
            name: 'hàng quà Restaurant - Asian Fusion Food & Coffee',
            address: '13, Hàng Bông, Hàng Trống, Hoàn Kiếm, Hà Nội, Vietnam',
            media: [
                'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/6d/7a/40/hang-qua-on-13-hang-bong.jpg?w=900&h=500&s=1',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHxA3Pp1uvkAJQY8P6fsR5zzrFzyYJpVWyvQ&s'
            ],
            admin_id: userIds.admin,
            phone_number: '+84123456789',
            open_time: '09:00',
            close_time: '22:00',
            location: {
                type: 'Point',
                coordinates: [
                    105.84701888248215,
                    21.030209039234084
                ]
            },
        },
        {
            name: 'The Gourmet Corner Restaurant',
            address: '22, Ta Hien, Hoan Kiem, Hanoi, Vietnam',
            media: [
                'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/e8/95/25/restaurant.jpg?w=1200&h=-1&s=1',
                'https://ik.imagekit.io/tvlk/xpe-asset/AyJ40ZAo1DOyPyKLZ9c3RGQHTP2oT4ZXW+QmPVVkFQiXFSv42UaHGzSmaSzQ8DO5QIbWPZuF+VkYVRk6gh-Vg4ECbfuQRQ4pHjWJ5Rmbtkk=/2000937417198/The%2520Gourmet%2520Corner%2520Restaurant%2520Hanoi%2520-4e5661d4-23c1-44c3-a129-ca7e40d8a28f.jpeg?tr=q-60,c-at_max,w-1280,h-720&_src=imagekit'
            ],
            admin_id: userIds.admin,
            phone_number: '+84987654321',
            open_time: '10:00',
            close_time: '22:00',
            location: {
                type: 'Point',
                coordinates: [
                    105.852058,
                    21.0346357
                ]
            },
        },
        {
            name: 'Gia Ngư Restaurant',
            address: '27, Gia Ngu, Hoan Kiem, Hanoi, Vietnam',
            media: [
                'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/12/cc/e4/caption.jpg?w=1200&h=-1&s=1',
                'https://media-cdn.tripadvisor.com/media/photo-s/19/f4/86/8f/photo5jpg.jpg'
            ],
            admin_id: userIds.admin,
            phone_number: '+84911223344',
            open_time: '12:00',
            close_time: '21:00',
            location: {
                type: 'Point',
                coordinates: [
                    105.8524553,
                    21.033057
                ]
            },
        },
        // Add more restaurants...
    ];

    const createdRestaurants = await Restaurant.insertMany(restaurants);
    return {
        restaurant1: createdRestaurants[0]._id,
        restaurant2: createdRestaurants[1]._id,
        restaurant3: createdRestaurants[2]._id,
        // Add more restaurant Ids...
    };
};

const seedDishes = async (restaurantIds) => {
    const dishes = [
        {
            name: '寿司盛り合わせ',
            media: [
                'https://example.com/sushi1.jpg',
                'https://example.com/sushi2.jpg'
            ],
            price: 1500,
            restaurant_id: restaurantIds.restaurant1,
        },
        {
            name: 'ラーメン特選',
            media: [
                'https://example.com/ramen1.jpg',
                'https://example.com/ramen2.jpg'
            ],
            price: 1200,
            restaurant_id: restaurantIds.restaurant2,
        },
        {
            name: '天ぷらセット',
            media: [
                'https://example.com/tempura1.jpg',
                'https://example.com/tempura2.jpg'
            ],
            price: 1800,
            restaurant_id: restaurantIds.restaurant3,
        },
        // Add more dishes...
    ];
    const createdDishes = await Dish.insertMany(dishes);
    return {
        dish1: createdDishes[0]._id,
        dish2: createdDishes[1]._id,
        dish3: createdDishes[2]._id,
        // Add more dish Ids...
    };
};

const seedFeedback = async (userIds, restaurantIds) => {
    const feedbacks = [
        {
            type: 'Feedback',
            caption: 'Excellent service!',
            media: [
                'https://netspace.edu.vn/upload/images/2017/04/07/cach-lam-bun-1.jpg',
                'https://thucphamdongxanh.com/wp-content/uploads/2019/09/bun-tuoi-soi-to-bun-bo.jpeg'
            ],
            content: 'このレストランで素晴らしい体験をしました！料理は美味しく、スタッフも親切でした。',
            user_id: userIds.user1,
            restaurant_id: restaurantIds.restaurant1,
            rating: 5,
        },
        // Add more feedbacks...
    ];
    const createdFeedbacks = await Post.insertMany(feedbacks);
    return {
        feedback1: createdFeedbacks[0]._id,
        // Add more feedbacks Ids...
    }
};

const seedDishFeedback = async (userIds, dishIds) => {
    const dishFeedbacks = [
        {
            type: 'DishFeedback',
            caption: 'Amazing Sushi!',
            media: [
                'https://example.com/sushi_feedback1.jpg',
                'https://example.com/sushi_feedback2.jpg'
            ],
            content: '最高の寿司を楽しみました！新鮮で美味しかったです。',
            user_id: userIds.user2,
            dish_id: dishIds.dish1,
            rating: 5,
        },
        // Add more dish feedbacks...
    ];
    const createdDishFeedbacks = await Post.insertMany(dishFeedbacks);
    return {
        dishFeedback1: createdDishFeedbacks[0]._id,
        // Add more dish feedback Ids...
    }
};

const seedComments = async (userIds, postIds) => {
    const comments = [
        {
            type: 'Comment',
            caption: 'I agree!',
            media: [],
            content: '本当に素晴らしいサービスですね。',
            user_id: userIds.user2,
            post_id: postIds.feedback1,
        },
        // Add more comments...
    ];
    const createdComments = await Post.insertMany(comments);
    return {
        comment1: createdComments[0]._id,
        // Add more comment Ids...
    };
};

const seedPosts = async (userIds, restaurantIds, dishIds) => {
    const feedbackIds = await seedFeedback(userIds, restaurantIds);

    const dishFeedbackIds = await seedDishFeedback(userIds, dishIds);

    const commentIds = await seedComments(userIds, feedbackIds);
    return { feedbackIds, dishFeedbackIds, commentIds };
};

const seedLikes = async (userIds, postIds) => {
    const likes = [
        {
            post_id: postIds.feedback1,
            user_id: userIds.user2,
        },
        {
            post_id: postIds.dishFeedback1,
            user_id: userIds.user1,
        },
        // Add more likes...
    ];
    return await Like.insertMany(likes);
};

const seedDB = async () => {
    try {
        const userCount = await User.countDocuments();
        const restaurantCount = await Restaurant.countDocuments();

        if (userCount > 0 || restaurantCount > 0) {
            return;
        }

        const createdUserIds = await seedUsers();

        const createdRestaurantIds = await seedRestaurants(createdUserIds);

        const createdDisheIds = await seedDishes(createdRestaurantIds);

        const createdPostIds = await seedPosts(createdUserIds, createdRestaurantIds, createdDisheIds);

        // Aggregate Post IDs for Likes
        const postIds = {
            ...createdPostIds.feedbackIds,
            ...createdPostIds.dishFeedbackIds,
            ...createdPostIds.commentIds,
        };

        await seedLikes(createdUserIds, postIds);

        console.log('Seed Data Complete!');
    } catch (err) {
        console.error('Error seeding data:', err.message);
        process.exit(1);
    }
};

export default seedDB;
