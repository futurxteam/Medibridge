// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");

const app = express();

app.use(express.json());
app.use(cors());

// Auth routes
app.use("/api/auth", authRoutes);

// Role-specific routes
app.use("/api/student", studentRoutes);  // /api/student/jobs
app.use("/api/faculty", facultyRoutes);  // /api/faculty/jobs

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Server running on port", process.env.PORT || 5000)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
