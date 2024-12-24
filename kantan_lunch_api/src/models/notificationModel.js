import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Notification Schema
const notificationSchema = new Schema({
  type: {
    type: String,
    enum: ['like', 'comment'], 
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true, // The recipient of the notification
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User', // The source of the notification
    required: true,
  },
  post_id: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  },
  is_sent: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: false, // Since created_at is manually defined
});

notificationSchema.index({ user_id: 1, created_at: -1 });

// Create and Export the Notification Model
const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;