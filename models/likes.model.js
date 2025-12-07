const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    moduleId: { type: String, required: true },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('Like', LikeSchema);
