

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const os = require("os");

// const app = express();

// // ----------------------------
// // Get Local IP (for mobile testing)
// // ----------------------------
// function getLocalIP() {
//   const interfaces = os.networkInterfaces();
//   for (let name in interfaces) {
//     for (let iface of interfaces[name]) {
//       if (iface.family === "IPv4" && !iface.internal && iface.address.startsWith("192.168")) {
//         return iface.address;
//       }
//     }
//   }
//   return "localhost";
// }

// const LOCAL_IP = getLocalIP();

// // ----------------------------
// // Middleware
// // ----------------------------
// app.use(cors({ origin: "*" }));
// app.use(express.json({ limit: "10mb" }));

// // ----------------------------
// // MongoDB Connection
// // ----------------------------
// mongoose
//   .connect(
//     "mongodb+srv://aureakimcyrus15:cymik123@capstone.db06dq4.mongodb.net/capstone?retryWrites=true&w=majority"
//   )
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.log("❌ MongoDB connection error:", err));

// // ----------------------------
// // Schema
// // ----------------------------
// const FeatureSchema = new mongoose.Schema(
//   {
//     title: String,
//     description: String,
//     image: String,
//     steps: { type: [String], default: [] },
//   },
//   { timestamps: true }
// );

// const Feature = mongoose.model("Feature", FeatureSchema);

// // ----------------------------
// // Routes
// // ----------------------------
// app.get("/", (req, res) => {
//   res.send("Server is running 🔥");
// });

// app.post("/api/feature/add", async (req, res) => {
//   try {
//     const { title, description, image, steps } = req.body;

//     if (!title || !description || !image) {
//       return res.status(400).json({ error: "Missing title, description, or image" });
//     }

//     const feature = await Feature.create({
//       title,
//       description,
//       image,
//       steps: Array.isArray(steps) ? steps : [],
//     });

//     res.status(200).json({ message: "Feature added", feature });
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });

// app.get("/api/feature/all", async (req, res) => {
//   try {
//     const features = await Feature.find().sort({ createdAt: -1 });
//     res.status(200).json(features);
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });

// app.put("/api/feature/update/:id", async (req, res) => {
//   try {
//     const { title, description, image, steps } = req.body;

//     const updateData = { title, description };
//     if (image) updateData.image = image;
//     if (steps !== undefined) updateData.steps = Array.isArray(steps) ? steps : [];

//     const updatedFeature = await Feature.findByIdAndUpdate(req.params.id, updateData, {
//       new: true,
//     });

//     if (!updatedFeature) return res.status(404).json({ error: "Feature not found" });

//     res.status(200).json({ message: "Feature updated", feature: updatedFeature });
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });

// app.delete("/api/feature/delete/:id", async (req, res) => {
//   try {
//     const deleted = await Feature.findByIdAndDelete(req.params.id);

//     if (!deleted) return res.status(404).json({ error: "Feature not found" });

//     res.status(200).json({ message: "Feature deleted" });
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });

// // ----------------------------
// // Start Server
// // ----------------------------
// const PORT = 3000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log("🚀 Server running!");
//   console.log(`📱 Mobile: http://${LOCAL_IP}:${PORT}`);
//   console.log(`💻 PC: http://localhost:${PORT}`);
// });


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const os = require("os");

const app = express();
const readingHistoryRoutes = require("./routes/readingHistory");
// const readingHistoryRoutes = require("./routes/readingHistory");
// app.use("/api/reading-history", readingHistoryRoutes);
// At the top of server.js


// After other routes



// ----------------------------
// Get Local IP (for mobile testing)
// ----------------------------
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let name in interfaces) {
    for (let iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal && iface.address.startsWith("192.168")) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const LOCAL_IP = getLocalIP();

// ----------------------------
// Middleware
// ----------------------------
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

// ----------------------------
// MongoDB
// ----------------------------
mongoose
  .connect("mongodb+srv://aureakimcyrus15:cymik123@capstone.db06dq4.mongodb.net/capstone")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ----------------------------
// Schema Update (IMPORTANT)
// ----------------------------
// steps: [{ title: String, content: String }]
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
      }
    ]
  },
  { timestamps: true }
);

const Feature = mongoose.model("Feature", FeatureSchema);

// ----------------------------
// Routes
// ----------------------------

// Test Route
app.get("/", (req, res) => {
  res.send("Server is running 🔥");
});

app.use("/api/reading-history", readingHistoryRoutes);
// Add Feature
app.post("/api/feature/add", async (req, res) => {
  try {
    const { title, description, image, steps } = req.body;

    const newFeature = await Feature.create({
      title,
      description,
      image,
      steps: Array.isArray(steps) ? steps : []
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

    const updateData = {
      title,
      description,
    };

    if (image) updateData.image = image;
    if (steps) updateData.steps = steps; // now array of objects

    const updated = await Feature.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

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
// Run Server
// ----------------------------
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running!");
  console.log(`📱 Mobile: http://${LOCAL_IP}:${PORT}`);
  console.log(`💻 PC: http://localhost:${PORT}`);
});