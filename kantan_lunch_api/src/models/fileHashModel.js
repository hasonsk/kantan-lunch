import mongoose from 'mongoose';

const fileHashSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  url: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('FileHash', fileHashSchema);