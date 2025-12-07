const express = require('express');
const router = express.Router();
const Like = require('../models/likes.model');

// Like a module
router.post('/like', async (req, res) => {
  try {
    const { userId, moduleId } = req.body;
    if (!userId || !moduleId) return res.status(400).json({ error: "Missing userId or moduleId" });

    // Prevent duplicate likes
    const existing = await Like.findOne({ userId, moduleId });
    if (existing) return res.status(400).json({ error: "Already liked" });

    const like = new Like({ userId, moduleId });
    await like.save();
    return res.status(200).json({ message: "Liked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Unlike a module
router.post('/unlike', async (req, res) => {
  try {
    const { userId, moduleId } = req.body;
    if (!userId || !moduleId) return res.status(400).json({ error: "Missing userId or moduleId" });

    await Like.deleteOne({ userId, moduleId });
    return res.status(200).json({ message: "Unliked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get total likes for a module
router.get('/count/:moduleId', async (req, res) => {
  try {
    const { moduleId } = req.params;
    const count = await Like.countDocuments({ moduleId });
    return res.status(200).json({ likes: count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Check if a user liked a module
router.get('/check/:userId/:moduleId', async (req, res) => {
  try {
    const { userId, moduleId } = req.params;
    const liked = await Like.exists({ userId, moduleId });
    return res.status(200).json({ liked: !!liked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
