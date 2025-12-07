const express = require("express");
const Like = require("../models/Like");
const router = express.Router();

// ❤️ LIKE a feature
router.post("/like", async (req, res) => {
  try {
    const { userId, featureId } = req.body;

    const like = await Like.create({ userId, featureId });

    res.json({ message: "Liked!", data: like });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already liked" });
    }
    res.status(500).json({ error: err.message });
  }
});

// 💔 UNLIKE a feature
router.post("/unlike", async (req, res) => {
  try {
    const { userId, featureId } = req.body;

    await Like.deleteOne({ userId, featureId });

    res.json({ message: "Unliked!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 CHECK IF USER LIKED FEATURE
router.get("/status/:userId/:featureId", async (req, res) => {
  try {
    const { userId, featureId } = req.params;

    const exists = await Like.findOne({ userId, featureId });

    res.json({ liked: exists ? true : false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔢 GET TOTAL LIKES OF FEATURE
router.get("/count/:featureId", async (req, res) => {
  try {
    const count = await Like.countDocuments({ featureId: req.params.featureId });

    res.json({ likes: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
