const mongoose = require("mongoose");

const ReadingHistorySchema = new mongoose.Schema(
  {
    featureId: { type: mongoose.Schema.Types.ObjectId, ref: "Feature", required: true },
    userId: { type: String, required: true }, // Firebase UID
    action: { type: String, default: "viewed" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReadingHistory", ReadingHistorySchema);
