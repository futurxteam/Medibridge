// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    // hashed password
    password: { type: String, required: true },

    // "STUDENT" | "EXTERNAL" | "FACULTY"
    role: {
      type: String,
      enum: ["STUDENT", "EXTERNAL", "FACULTY"],
      required: true,
    },

    // only relevant for STUDENT role
    isMedibridgeStudent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
