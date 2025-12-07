


// //sjdknfskdjfndkjfnfk
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();

// // Routes
// const readingHistoryRoutes = require("./routes/readingHistory");

// // ----------------------------
// // Middleware
// // ----------------------------
// app.use(cors({ origin: "*" }));
// app.use(express.json({ limit: "10mb" }));

// // ----------------------------
// // MongoDB (using environment variable from Render)
// // ----------------------------
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ MongoDB Error:", err));

// // ----------------------------
// // Schema (Feature)
// // ----------------------------
// const FeatureSchema = new mongoose.Schema(
//   {
//     title: String,
//     description: String,
//     image: String,
//     steps: [
//       {
//         title: String,
//         content: String,
//       }
//     ]
//   },
//   { timestamps: true }
// );

// const Feature = mongoose.model("Feature", FeatureSchema);

// // ----------------------------
// // Routes
// // ----------------------------

// // Test Route
// app.get("/", (req, res) => {
//   res.send("Server is running 🔥");
// });

// // Reading History Routes
// app.use("/api/reading-history", readingHistoryRoutes);

// // Add Feature
// app.post("/api/feature/add", async (req, res) => {
//   try {
//     const { title, description, image, steps } = req.body;

//     const newFeature = await Feature.create({
//       title,
//       description,
//       image,
//       steps: Array.isArray(steps) ? steps : []
//     });

//     res.status(200).json({ message: "Feature added", feature: newFeature });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get All Features
// app.get("/api/feature/all", async (req, res) => {
//   try {
//     const features = await Feature.find().sort({ createdAt: -1 });
//     res.json(features);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update Feature
// app.put("/api/feature/update/:id", async (req, res) => {
//   try {
//     const { title, description, image, steps } = req.body;

//     const updateData = {
//       title,
//       description,
//     };

//     if (image) updateData.image = image;
//     if (steps) updateData.steps = steps;

//     const updated = await Feature.findByIdAndUpdate(req.params.id, updateData, {
//       new: true,
//     });

//     res.json({ message: "Feature updated", feature: updated });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Delete Feature
// app.delete("/api/feature/delete/:id", async (req, res) => {
//   try {
//     await Feature.findByIdAndDelete(req.params.id);
//     res.json({ message: "Feature deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ----------------------------
// // Run Server on Render
// // ----------------------------
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });


// ----------------------------
// server.js
// ----------------------------
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load .env locally (Render injects env vars automatically)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();

// ----------------------------
// Middleware
// ----------------------------
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

// ----------------------------
// Routes
// ----------------------------
const readingHistoryRoutes = require("./routes/readingHistory");
const likeRoutes = require("./routes/like");

app.use("/api/reading-history", readingHistoryRoutes);
app.use("/api/likes", likeRoutes);

// ----------------------------
// MongoDB connection
// ----------------------------
const mongoUri = process.env.MONGO_URI;
console.log("Mongo URI:", mongoUri); // Debug: make sure it's set

if (!mongoUri) {
  console.warn("⚠️ MONGO_URI is not defined! The server may not connect to MongoDB.");
} else {
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Error:", err));
}

// ----------------------------
// Feature Schema
// ----------------------------
const FeatureSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    steps: [
      {
        title: String,
        content: String,
      },
    ],
  },
  { timestamps: true }
);

const Feature = mongoose.model("Feature", FeatureSchema);

// ----------------------------
// Test Route
// ----------------------------
app.get("/", (req, res) => {
  res.send("Server is running 🔥");
});

// ----------------------------
// Feature Routes
// ----------------------------

// Add Feature
app.post("/api/feature/add", async (req, res) => {
  try {
    const { title, description, image, steps } = req.body;
    const newFeature = await Feature.create({
      title,
      description,
      image,
      steps: Array.isArray(steps) ? steps : [],
    });
    res.status(200).json({ message: "Feature added", feature: newFeature });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Features
app.get("/api/feature/all", async (req, res) => {
  try {
    const features = await Feature.find().sort({ createdAt: -1 });
    res.json(features);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Feature
app.put("/api/feature/update/:id", async (req, res) => {
  try {
    const { title, description, image, steps } = req.body;
    const updateData = { title, description };
    if (image) updateData.image = image;
    if (steps) updateData.steps = steps;

    const updated = await Feature.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Feature updated", feature: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Feature
app.delete("/api/feature/delete/:id", async (req, res) => {
  try {
    await Feature.findByIdAndDelete(req.params.id);
    res.json({ message: "Feature deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// Start Server
// ----------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


