const mongoose = require('mongoose');

const PollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: [{
    text: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
  }],
  image: {
    type: String,  // If you're storing the image as a base64 string or image URL
    required: true,
  },
  imageSize: {
    original: {
      type: Number,  // Store the original size (in bytes)
    },
    optimized: {
      type: Number,  // Store the optimized size (in bytes)
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,  // Automatically adds `createdAt` and `updatedAt`
});

module.exports = mongoose.model('Poll', PollSchema);
