import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true, 
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;

import mongoose from 'mongoose';

// Định nghĩa schema cho món ăn
const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
}, {
    _id: false, // Không cần tạo _id riêng cho mỗi món ăn trong mảng
});

// // Định nghĩa schema cho nhà hàng
// const restaurantSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     address: {
//         type: String,
//         required: true,
//     },
//     phone: {
//         type: String,
//         required: true,
//     },
//     rating: {
//         type: Number,
//         default: 0,
//     },
//     openingHours: {
//         type: String, // Hoặc bạn có thể làm phức tạp hơn với array hoặc object
//         required: true,
//     },
//     menu: [menuItemSchema], // Mảng chứa các món ăn
//     likes: {
//         type: [mongoose.Schema.Types.ObjectId], // Danh sách userId đã thích nhà hàng
//         ref: 'User',
//         default: [],
//     },
// }, {
//     timestamps: true, // Thêm trường createdAt và updatedAt tự động
// });

// const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// export default Restaurant;
