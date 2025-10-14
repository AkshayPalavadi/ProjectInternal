// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import cors from "cors";
// import path from "path";

// import connectDB from "./config/db.js";
// import bestEmployeeRoutes from "./routes/bestEmployeeRoutes.js";

// dotenv.config();
// const app = express();
// connectDB();

// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// app.use("/api/best-employee", bestEmployeeRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";

import connectDB from "./config/db.js";
import bestEmployeeRoutes from "./routes/bestEmployeeRoutes.js";
import leavesRoutes from "./routes/leavesRoutes.js";

dotenv.config();
const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // file uploads

// Routes
app.use("/api/best-employee", bestEmployeeRoutes);
app.use("/api/leaves", leavesRoutes);

// Test
app.get("/", (req, res) => res.send("✅ Home & Leaves API running"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
