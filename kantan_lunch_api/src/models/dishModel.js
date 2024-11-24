import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Dish Schema
const dishSchema = new Schema({
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
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
}, {
  timestamps: true,
});

dishSchema.index({ restaurant_id: 1 });

const Dish = mongoose.model('Dish', dishSchema);
export default Dish;