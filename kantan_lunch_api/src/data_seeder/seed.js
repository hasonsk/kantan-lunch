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
                full_name: 'Admin User',
                date_of_birth: new Date('1980-01-01'),
                phone_number: '+84912345678',
                avatar: 'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733547284/default-avatar_vqnong.jpg',
            },
        },
        {
            username: 'Akira',
            email: 'johndoe@example.com',
            password: await bcrypt.hash('User@123', 10),
            role: 'user',
            profile: {
                full_name: 'John Doe',
                date_of_birth: new Date('1990-05-15'),
                phone_number: '+84987654321',
                avatar: 'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733542335/kantan_lunch/avatars/eqozecoerlnitx3mdetu.png',
            },
        },
        {
            username: 'Yamada',
            email: 'janedoe@example.com',
            password: await bcrypt.hash('User@123', 10),
            role: 'user',
            profile: {
                full_name: 'Jane Doe',
                date_of_birth: new Date('1992-07-20'),
                phone_number: '+84911223344',
                avatar: 'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733547284/default-avatar_vqnong.jpg',
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
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733536704/kantan_lunch/restaurants/kqfz2t3i9jauumz442kd.jpg',
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733548028/hang-qua-on-13-hang-bong_fhairn.jpg'
            ],
            admin_id: userIds.admin,
            phone_number: '+84123456789',
            open_time: '09:00',
            close_time: '22:00',
            avg_rating: 5.0,
        },
        {
            name: 'The Gourmet Corner Restaurant',
            address: '22, Ta Hien, Hoan Kiem, Hanoi, Vietnam',
            media: [
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733548063/images_msrhwg.jpg',
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733548100/restaurant_n2rebq.jpg'
            ],
            admin_id: userIds.admin,
            phone_number: '+84987654321',
            open_time: '10:00',
            close_time: '22:00',
        },
        {
            name: 'Gia Ngư Restaurant',
            address: '27, Gia Ngu, Hoan Kiem, Hanoi, Vietnam',
            media: [
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733548150/caption_z1lgwh.jpg',
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733548168/photo5jpg_fv9l1r.jpg'
            ],
            admin_id: userIds.admin,
            phone_number: '+84911223344',
            open_time: '12:00',
            close_time: '21:00',
        },
        {
            name: 'Lotus Vietnamese Cuisine',
            address: '23, Lý Quốc Sư, Hoàn Kiếm, Hà Nội, Vietnam',
            media: [
                'https://s3-media0.fl.yelpcdn.com/bphoto/Ncvp67X5Zl6NnhTuwdc22g/348s.jpg',
                'https://cdn.vox-cdn.com/thumbor/SLYoGihF35k2vvUlaTQHixtXiSs=/60x0:910x638/1200x800/filters:focal(60x0:910x638)/cdn.vox-cdn.com/uploads/chorus_image/image/47347628/12049463_10154228129548942_8938779899475510640_n.0.0.jpg'
            ],
            admin_id: userIds.admin,
            phone_number: '+8484198273',
            open_time: '10:00',
            close_time: '21:30',
            avg_rating: 4.8,
        },
        {
            name: 'Pho Delight - Authentic Vietnamese Noodles',
            address: '5, Bát Đàn, Hoàn Kiếm, Hà Nội, Vietnam',
            media: [
                'https://scontent.fhan15-2.fna.fbcdn.net/v/t1.6435-9/36623656_10155365451196962_4549084056884609024_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeF2vyKxgsksdxdxLLo3PwrfK05PEhryGkArTk8SGvIaQDAPd9G40oOpwbVCSnuBqfDPR0i5NzzJT0Z-kdsgWH7K&_nc_ohc=_VO5xMuNGFoQ7kNvgGX4MXg&_nc_zt=23&_nc_ht=scontent.fhan15-2.fna&_nc_gid=AT2tNYQkuKZUGRg3w2Ns5eZ&oh=00_AYBPbf4gZP7PN28U8JNaa88CK4p-eMQU5k5-NG-70gi_HA&oe=67998CB4',
                'https://mikazuki.com.vn/vnt_upload/culinary/09_2024/c94793cf_13f3_481d_ba0d_ac7773a785b8.jpeg'
            ],
            admin_id: userIds.admin,
            phone_number: '+8498012857',
            open_time: '08:00',
            close_time: '20:00',
            avg_rating: 4.3,
        },
        {
            name: 'Green Mango Café & Restaurant',
            address: '18, Nhà Thờ, Hoàn Kiếm, Hà Nội, Vietnam',
            media: [
                'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/ef/3d/09/french-grill-by-night.jpg',
                'https://assets.gia-hanoi.com/unnamed-4.png'
            ],
            admin_id: userIds.admin,
            phone_number: '+8409174233',
            open_time: '07:30',
            close_time: '23:00',
            avg_rating: 4.7,
        },
        {
            name: 'Red Bean Hanoi Restaurant',
            address: '94, Mã Mây, Hoàn Kiếm, Hà Nội, Vietnam',
            media: [
                'https://media.kinhdoanhvaphattrien.vn/files/maitp/2024/09/11/66e177c22d268.jpg',
                'https://static.vinwonders.com/production/nha-hang-nha-trang-topbanner.jpg'
            ],
            admin_id: userIds.admin,
            phone_number: '+8498127542',
            open_time: '11:00',
            close_time: '22:00',
            avg_rating: 4.4,
        },
        // Add more restaurants...
    ];

    // Calculate location coordinates for each restaurant
    for (const restaurant of restaurants) {
        const geoData = await geocoder.geocode(restaurant.address);
        let latitude;
        let longitude;
        if (!geoData.length) {
            console.log(`Invalid address provided: ${restaurant.address}`);
            latitude = 21.028511;
            longitude = 105.853662;
        } else {
            latitude = geoData[0].latitude;
            longitude = geoData[0].longitude;
        }
        restaurant.location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        };
    }

    const createdRestaurants = await Restaurant.insertMany(restaurants);
    return {
        restaurant1: createdRestaurants[0]._id,
        restaurant2: createdRestaurants[1]._id,
        restaurant3: createdRestaurants[2]._id,
        restaurant4: createdRestaurants[3]._id,
        restaurant5: createdRestaurants[4]._id,
        restaurant6: createdRestaurants[5]._id,
        restaurant7: createdRestaurants[6]._id,
        // Add more restaurant Ids...
    };
};

const seedDishes = async (restaurantIds) => {
    const dishes = [
        // MÓN ĂN CHO NHÀ HÀNG HÀNG QUÀ
        {
            name: '寿司盛り合わせ',
            media: [
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733741565/sushi-1_muqgmf.jpg',
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733741565/sushi-2_og0qoh.jpg'
            ],
            price: 1500,
            restaurant_id: restaurantIds.restaurant1,
        },
        // MÓN ĂN CHO NHÀ HÀNG THE GOURMET CORNER
        {
            name: 'ラーメン特選',
            media: [
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733741639/ramen-1_rlo9nu.jpg',
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733741640/ramen-2_tspua4.jpg'
            ],
            price: 1200,
            restaurant_id: restaurantIds.restaurant2,
        },
        // MÓN ĂN CHO NHÀ HÀNG GIA NGƯ
        {
            name: '天ぷらセット',
            media: [
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733741737/tempura-1_p21rhx.jpg',
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733741736/tempura-2_y9bpzo.jpg'
            ],
            price: 1800,
            restaurant_id: restaurantIds.restaurant3,
        },
        // MÓN ĂN CHO NHÀ HÀNG LOTUS VIETNAME
        {
            name: 'Bánh cuốn Hà Nội',
            media: [
                'https://img-global.cpcdn.com/recipes/b235f5db0142062d/1200x630cq70/photo.jpg',
                'https://netspace.edu.vn/app_assets/images/2018/10/25/cach-lam-banh-cuon-thom-ngon-bo-duong-tai-nha-800.jpg',
                'https://danangbest.com/upload_content/banh-cuon-da-nang-1.webp'
            ],
            price: 500,
            restaurant_id: restaurantIds.restaurant4,
        },
        {
            name: 'Chả cá Lã Vọng',
            media: [
                'https://cdn.tgdd.vn/Files/2020/03/31/1245702/cach-lam-cha-ca-la-vong-cha-ca-lang-thom-ngon-c-760x367.jpg',
                'https://haisanloccantho.com/wp-content/uploads/2024/11/cha-ca-la-vong.jpg'
            ],
            price: 1200,
            restaurant_id: restaurantIds.restaurant4,
        },
        // MÓN ĂN CHO NHÀ HÀNG PHO DELIGHT
        {
            name: 'Phở bò truyền thống',
            media: [
                'https://hidafoods.vn/wp-content/uploads/2023/10/cach-nau-pho-bo-bap-hoa-thom-ngon-dam-da-huong-vi-4.jpg',
                'https://cdn.mediamart.vn/images/news/cach-lam-ph-bo-ngon-chun-v-bng-ni-ap-sut-din_ce119f78.jpg',
                'https://inoxtrungthanh.vn/wp-content/uploads/2019/11/140.jpg'
            ],
            price: 800,
            restaurant_id: restaurantIds.restaurant4,
        },
        {
            name: 'Phở gà ta',
            media: [
                'https://i-giadinh.vnecdn.net/2021/09/11/Phoga1-1631342846-8318-1631342910.jpg',
                'https://vnn-imgs-a1.vgcloud.vn/mst.eva.vn/upload/1-2021/images/2021-03-30/chan-com-hoc-me-dam-nau-pho-ga-ta-sieu-ngon-va-chat-luong-an-xong-chang-muon-ra-hang-164044709_1786693674823454_5223686325033793495_n---1617078572-392-width700height525.jpg'
            ],
            price: 700,
            restaurant_id: restaurantIds.restaurant5,
        },
        {
            name: 'Phở bò sốt vang',
            media: [
                'https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/4/3/1030429/Cach-Lam-Bo-Sot-Vang.jpg',
                'https://noiphosaigon.com/wp-content/uploads/2020/12/pho-sot-vang-ha-noi.jpg'
            ],
            price: 400,
            restaurant_id: restaurantIds.restaurant5,
        },
        {
            name: 'Phở gà trộn',
            media: [
                'https://cdn.tgdd.vn/2021/08/CookProduct/pho-ga-tron-thumbnail-1200x676.jpg',
                'https://i-giadinh.vnecdn.net/2024/10/03/Bc6Thnhphm1-1727942049-2491-1727942060.jpg'
            ],
            price: 600,
            restaurant_id: restaurantIds.restaurant5,
        },
        // MÓN ĂN CHO NHÀ HÀNG GREEN MANGO
        {
            name: 'Salad xoài xanh',
            media: [
                'https://afamilycdn.com/zoom/700_438/150157425591193600/2021/7/13/thai-green-mango-salad-recipe-3217675-hero-01-9f0151961b6d4850a25561219c60f9d0-16261698328571285770826-84-0-587-960-crop-16261713249931944425392.jpg',
                'https://bizweb.dktcdn.net/thumb/1024x1024/100/508/185/products/img-6502-jpeg.jpg?v=1722332912060'
            ],
            price: 300,
            restaurant_id: restaurantIds.restaurant6,
        },
        {
            name: 'Cà ri gà kiểu Việt',
            media: [
                'https://i.ytimg.com/vi/xySE3CCA1Kk/maxresdefault.jpg',
                'https://cachnau.vn/wp-content/uploads/2022/02/ca-ri-ga-ngon.jpg'
            ],
            price: 900,
            restaurant_id: restaurantIds.restaurant6,
        },
        {
            name: 'Chè khúc bạch',
            media: [
                'https://file.hstatic.net/200000391061/article/cach-lam-che-khuc-bach-thom-ngon-kho-cuong-1_eecd774b0501415492208a86b2b598d0_1024x1024.jpg',
                'https://longnhantienvua.com/wp-content/uploads/che-khuc-bach-long-nhan.jpg'
            ],
            price: 200,
            restaurant_id: restaurantIds.restaurant6,
        },
        // MÓN ĂN CHO NHÀ HÀNG RED BEAN
        {
            name: 'Cơm gà Hội An',
            media: [
                'https://i-giadinh.vnecdn.net/2021/01/29/com2-1611892464-7028-1611892596.jpg',
                'https://cdn.tgdd.vn/Files/2019/03/29/1157476/cach-nau-com-ga-hoi-an-chinh-goc-chuan-vi-nhat-202208271507268751.jpg'
            ],
            price: 750,
            restaurant_id: restaurantIds.restaurant7,
        },
        {
            name: 'Cơm chiên Dương Châu',
            media: [
                'https://i-giadinh.vnecdn.net/2022/12/30/Buoc-4-4-4790-1672386702.jpg',
                'https://tiki.vn/blog/wp-content/uploads/2023/09/com-chien-duong-chau-13.jpg'
            ],
            price: 350,
            restaurant_id: restaurantIds.restaurant7,
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
            media: [
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733548219/cach-lam-bun-1_sudxnc.jpg',
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733548228/bun-tuoi-soi-to-bun-bo_ksgm6z.jpg'
            ],
            content: 'このレストランで素晴らしい体験をしました！料理は美味しく、スタッフも親切でした。',
            user_id: userIds.user1,
            restaurant_id: restaurantIds.restaurant1,
            rating: 5,
            reviewed: true,
        },
        // Feedback cho nhà hàng Lotus Vietnamese Cuisine
        {   //feedback bánh cuốn
            type: 'Feedback',
            media: [
                'https://static.vinwonders.com/production/banh-cuon-ngon-sai-gon-1.jpg',
            ],
            content: 'バインクオンは香ばしくてとても魅力的な味です',
            user_id: userIds.user2,
            restaurant_id: restaurantIds.restaurant4,
            rating: 5,
            reviewed: true,
        },
        {   // chả cá lã vọng
            type: 'Feedback',
            media: [
                'https://nld.mediacdn.vn/2019/9/22/image1-15691561784732129068728.jpeg',
                'https://nuocmamlegia.com/wp-content/uploads/2021/09/cha-ca-la-vong-tai-nha.jpg'
            ],
            content: `バインクオンとラ・ヴォンのフィッシュケーキを組み合わせた料理には本当に驚きました。
            ロールの柔らかさとかまぼこの香ばしい甘さ、そしてつけダレの唐辛子の辛みが絶妙な味わいを生み出します。
            2つの伝統的なハノイ料理を同時に体験しているような気分になります。`,
            user_id: userIds.user2,
            restaurant_id: restaurantIds.restaurant4,
            rating: 4,
            reviewed: true,
        },
        // Feedback cho nhà hàng Pho Delight
        {   //phở sốt vang
            type: 'Feedback',
            media: [
                'https://media-cdn.tripadvisor.com/media/photo-s/13/be/65/4b/pho-bo-sot-vang-pho-with.jpg',
            ],
            content: 'おいしいフォー、とても濃厚な味わい',
            user_id: userIds.user1,
            restaurant_id: restaurantIds.restaurant5,
            rating: 5,
            reviewed: true,
        },
        { //phở gà ta
            type: 'Feedback',
            media: [
                'https://inhat.vn/wp-content/uploads/2020/10/7c697ce06695a6cbff84-min.jpg',
            ],
            content: `レストランの空間はハノイらしくとても居心地が良いです。ただ、スープのコクが足りず、鶏肉が少しパサついていたので、少し残念に感じました。
            レストランはスープにスパイスを加えて、鶏肉の柔らかい部位を選択する必要があると思います。その代わり、ここのフォーはとてもモチモチしていて美味しく、
            値段もリーズナブルです。`,
            user_id: userIds.user2,
            restaurant_id: restaurantIds.restaurant5,
            rating: 4,
            reviewed: true,
        },       
        // Feedback cho nhà hàng Green Mango
        {   //salad xoài xanh
            type: 'Feedback',
            media: [
                'https://static-images.vnncdn.net/files/publish/2023/11/12/w-goi-xoai-cuoi-tuan-2-804.jpg',
            ],
            content: 'サラダは調和のとれた味で、前菜に適しています',
            user_id: userIds.user1,
            restaurant_id: restaurantIds.restaurant6,
            rating: 5,
            reviewed: true,
        },
        {
            type: 'Feedback',
            media: [
                'https://cdn.buffetposeidon.com/app/media/Kham-pha-am-thuc/04.2024/190424-lam-che-khuc-bach-buffet-poseidon-01.jpeg',
            ],
            content: 'お茶は爽やかで涼しいです',
            user_id: userIds.user2,
            restaurant_id: restaurantIds.restaurant6,
            rating: 4,
            reviewed: true,
        },
        // Feedback cho nhà hàng Red Bean
        {   //cơm gà hội an
            type: 'Feedback',
            media: [
                'https://diadiemhoian.vn/wp-content/uploads/2024/08/com-ga-ba-buoi-hoi-an-4.jpg',
            ],
            content: 'チキンライスが美味しい',
            user_id: userIds.user1,
            restaurant_id: restaurantIds.restaurant7, // Red Bean's restaurant ID
            rating: 5,
            reviewed: true,
        },
        // Add more feedbacks...
    ];
    const createdFeedbacks = await Post.insertMany(feedbacks);
    return {
        feedback1: createdFeedbacks[0]._id,
        feedback2: createdFeedbacks[1]._id,
        feedback3: createdFeedbacks[2]._id,
        feedback4: createdFeedbacks[3]._id,
        feedback5: createdFeedbacks[4]._id,
        feedback6: createdFeedbacks[5]._id,
        feedback7: createdFeedbacks[6]._id,
        feedback8: createdFeedbacks[7]._id,
        // Add more feedbacks Ids...
    }
};

const seedDishFeedback = async (userIds, dishIds) => {
    const dishFeedbacks = [
        {
            type: 'DishFeedback',
            media: [
                'https://res.cloudinary.com/dtjl7hjbe/image/upload/v1733548332/0yrg1d2m8q091_uz5klb.jpg',
            ],
            content: '最高の寿司を楽しみました！新鮮で美味しかったです。',
            user_id: userIds.user2,
            dish_id: dishIds.dish1,
            rating: 5,
            reviewed: true,
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
            media: [],
            content: '本当に素晴らしいサービスですね。',
            user_id: userIds.user2,
            post_id: postIds.feedback1,
            reviewed: true,
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
        console.log(`Created ${Object.keys(createdUserIds).length} users.`);

        const createdRestaurantIds = await seedRestaurants(createdUserIds);
        console.log(`Created ${Object.keys(createdRestaurantIds).length} restaurants.`);

        const createdDisheIds = await seedDishes(createdRestaurantIds);
        console.log(`Created ${Object.keys(createdDisheIds).length} dishes.`);

        const createdPostIds = await seedPosts(createdUserIds, createdRestaurantIds, createdDisheIds);

        const feedbackCount = Object.keys(createdPostIds.feedbackIds).length;
        console.log(`Created ${feedbackCount} feedback posts.`);

        const dishFeedbackCount = Object.keys(createdPostIds.dishFeedbackIds).length;
        console.log(`Created ${dishFeedbackCount} dish feedback posts.`);

        const commentCount = Object.keys(createdPostIds.commentIds).length;
        console.log(`Created ${commentCount} comment posts.`);

        // Aggregate Post IDs for Likes
        const postIds = {
            ...createdPostIds.feedbackIds,
            ...createdPostIds.dishFeedbackIds,
            ...createdPostIds.commentIds,
        };

        await seedLikes(createdUserIds, postIds);
        console.log('Created likes.');

        console.log('Seed Data Complete!');
    } catch (err) {
        console.error('Error seeding data:', err.message);
        process.exit(1);
    }
};

export default seedDB;
