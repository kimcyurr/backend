const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  featureId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Prevent duplicate likes from the same user on same feature
LikeSchema.index({ userId: 1, featureId: 1 }, { unique: true });

module.exports = mongoose.model("Like", LikeSchema);
