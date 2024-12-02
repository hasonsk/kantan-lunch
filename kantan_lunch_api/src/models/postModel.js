import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Post Schema
const postSchema = new Schema({
  type: {
    type: String,
    enum: ['Feedback', 'DishFeedback', 'Comment'],
    required: true,
  },
  caption: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  media: [{
    type: String,
    required: true,
    trim: true,
  }],
  content: {
    type: String,
    required: true,
    trim: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  like_count: {
    type: Number,
    default: 0,
    min: 0,
  },
  reviewed: {
    type: Boolean,
    default: false,
  },
  
  // Fields for Feedback and DishFeedback
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: function() {
      return this.type === 'Feedback' || this.type === 'DishFeedback';
    },
  },

  // Fields only for Feedback
  restaurant_id: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: function() {
      return this.type === 'Feedback';
    },
  },
  
  // Fields only for DishFeedback
  dish_id: {
    type: Schema.Types.ObjectId,
    ref: 'Dish',
    required: function() {
      return this.type === 'DishFeedback';
    },
  },
  
  // Fields only for Comment
  post_id: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: function() {
      return this.type === 'Comment';
    },
  },
}, {
  timestamps: true,
});

postSchema.index({ user_id: 1 });
postSchema.index({ type: 1 });
postSchema.index({ restaurant_id: 1 });
postSchema.index({ dish_id: 1 });
postSchema.index({ post_id: 1 });

// Create and Export the Post Model
const Post = mongoose.model('Post', postSchema);
export default Post;