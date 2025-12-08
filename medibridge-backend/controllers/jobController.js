// controllers/jobController.js

const Job = require("../models/Job");

// POST /api/faculty/jobs   (FACULTY only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, eligibility } = req.body;

    if (!title || !description || !eligibility) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const job = await Job.create({
      title,
      description,
      eligibility, // "MEDIBRIDGE_ONLY" | "EXTERNAL_ONLY" | "BOTH"
      postedBy: req.user.id, // faculty user id from token
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/student/jobs   (STUDENT or EXTERNAL)
exports.getJobsForStudentOrExternal = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "STUDENT") {
      // Medibridge students → MEDIBRIDGE_ONLY + BOTH
      filter = { eligibility: { $in: ["MEDIBRIDGE_ONLY", "BOTH"] } };
    } else if (req.user.role === "EXTERNAL") {
      // External candidates → EXTERNAL_ONLY + BOTH
      filter = { eligibility: { $in: ["EXTERNAL_ONLY", "BOTH"] } };
    } else {
      // just in case someone hits it with wrong role
      return res.status(403).json({ message: "Not allowed" });
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error("Get jobs for user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/faculty/jobs   (FACULTY only)
exports.getJobsForFaculty = async (req, res) => {
  try {
    // faculty sees only their own posted jobs
    const jobs = await Job.find({ postedBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(jobs);
  } catch (err) {
    console.error("Get faculty jobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
