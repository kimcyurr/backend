const express = require("express");
const router = express.Router();
const Likes = require("../models/likes.model");

// ✅ Like a module
router.post("/like", async (req, res) => {
  const { userId, moduleId } = req.body;

  try {
    // Prevent duplicate likes
    const existing = await Likes.findOne({ userId, moduleId });
    if (existing) return res.status(400).json({ message: "Already liked" });

    const like = await Likes.create({ userId, moduleId });
    res.status(200).json({ message: "Liked", like });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Unlike a module
router.post("/unlike", async (req, res) => {
  const { userId, moduleId } = req.body;

  try {
    await Likes.findOneAndDelete({ userId, moduleId });
    res.status(200).json({ message: "Unliked" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Check if a user liked a module
router.get("/check/:userId/:moduleId", async (req, res) => {
  const { userId, moduleId } = req.params;

  try {
    const liked = await Likes.exists({ userId, moduleId });
    res.status(200).json({ liked: !!liked });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Count total likes for a module
router.get("/count/:moduleId", async (req, res) => {
  const { moduleId } = req.params;

  try {
    const count = await Likes.countDocuments({ moduleId });
    res.status(200).json({ likes: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
