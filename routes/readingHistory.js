// routes/readingHistory.js
const express = require("express");
const router = express.Router();
const ReadingHistory = require("../models/ReadingHistory");

// Get reading history for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const histories = await ReadingHistory.find({ userId: req.params.userId })
      .populate("featureId")  // <-- Populates the feature details
      .sort({ createdAt: -1 }); // optional: latest first

    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add reading history
router.post("/add", async (req, res) => {
  try {
    const { userId, featureId } = req.body;
    if (!userId || !featureId) return res.status(400).json({ error: "Missing fields" });

    const history = new ReadingHistory({ userId, featureId });
    await history.save();

    res.json({ message: "History added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
