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
    timestamps: true, // Tự động thêm các trường createdAt và updatedAt
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;