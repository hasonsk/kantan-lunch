import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

// Define the Profile Subschema
const profileSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
    required: false,
    trim: true,
  },
}, { _id: false });

// Define the User Schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  banned: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  profile: {
    type: profileSchema,
    required: true,
  },
  loved_restaurants: [{
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
  }],
}, {
  timestamps: true,
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });

// Pre-save hook to hash passwords
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and Export the User Model
const User = mongoose.model('User', userSchema);
export default User;
