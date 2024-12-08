import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Like Schema
const likeSchema = new Schema({
  post_id: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false, 
});

// Create a Compound Index to Prevent Duplicate Likes
likeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

// Create and Export the Like Model
const Like = mongoose.model('Like', likeSchema);
export default Like;