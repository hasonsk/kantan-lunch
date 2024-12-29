// src/models/restaurantModel.js

import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Restaurant Schema
const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  media: [{
    type: String,
    required: true,
    trim: true,
  }],
  admin_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  phone_number: {
    type: String,
    required: true,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please fill a valid phone number'],
  },
  avg_rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  open_time: {
    type: String,
    required: true,
    match: [/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/, 'open_time must be in HH:mm format'],
  },
  close_time: {
    type: String,
    required: true,
    match: [/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/, 'close_time must be in HH:mm format'],
  },
}, {
  timestamps: true,
});

// Indexes
restaurantSchema.index({ admin_id: 1 });

// Static method to calculate and update avg_rating
restaurantSchema.statics.updateAvgRating = async function(restaurantId) {
  const result = await this.model('Post').aggregate([
    {
      $match: {
        restaurant_id: new mongoose.Types.ObjectId(restaurantId),
        type: { $in: ['Feedback', 'DishFeedback'] },
        rating: { $ne: null },
      },
    },
    {
      $group: {
        _id: '$restaurant_id',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  if (result.length > 0) {
    return this.findByIdAndUpdate(restaurantId, { avg_rating: result[0].averageRating }, { new: true });
  } else {
    return this.findByIdAndUpdate(restaurantId, { avg_rating: 0 }, { new: true });
  }
};

// Create and Export the Restaurant Model
const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
