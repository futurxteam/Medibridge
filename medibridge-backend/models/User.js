// models/User.js (ESM)

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    // "STUDENT" | "EXTERNAL" | "FACULTY"
    role: {
      type: String,
      enum: ["STUDENT", "EXTERNAL", "FACULTY"],
      required: true,
    },

    isMedibridgeStudent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
