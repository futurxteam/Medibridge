// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Generate JWT token — only include id and role
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role, // "STUDENT" | "EXTERNAL" | "FACULTY"
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Prevent duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user — NO isMedibridgeStudent anymore!
    const user = await User.create({
      name,
      email,
      password: passwordHash,
      role, // "STUDENT", "EXTERNAL", or "FACULTY"
    });

    const token = createToken(user);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Optional: Enforce role match (recommended)
    if (role && user.role !== role) {
      return res.status(400).json({
        message: `This account is registered as ${user.role}. Please select the correct role.`,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/profile (protected route)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createMedibridgeStudentByFaculty = async (req, res) => {
  try {
    // Only FACULTY can use this
    if (req.user.role !== "FACULTY") {
      return res.status(403).json({ message: "Only faculty can create Medibridge students" });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const student = await User.create({
      name,
      email,
      password: passwordHash,
      role: "STUDENT", // Forced to STUDENT
    });

    res.status(201).json({
      message: "Medibridge student created successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
      },
    });
  } catch (err) {
    console.error("Faculty create student error:", err);
    res.status(500).json({ message: "Server error" });
  }
};