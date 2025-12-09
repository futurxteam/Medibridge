// controllers/jobController.js (ESM)

import Job from "../models/Job.js";

// POST /api/faculty/jobs   (FACULTY only)
export const createJob = async (req, res) => {
  try {
    const { title, description, eligibility } = req.body;

    if (!title || !description || !eligibility) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const job = await Job.create({
      title,
      description,
      eligibility, // "MEDIBRIDGE_ONLY" | "EXTERNAL_ONLY" | "BOTH"
      postedBy: req.user.id, // faculty user id
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/student/jobs   (STUDENT or EXTERNAL)
export const getJobsForStudentOrExternal = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "STUDENT") {
      filter = { eligibility: { $in: ["MEDIBRIDGE_ONLY", "BOTH"] } };
    } else if (req.user.role === "EXTERNAL") {
      filter = { eligibility: { $in: ["EXTERNAL_ONLY", "BOTH"] } };
    } else {
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
export const getJobsForFaculty = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (err) {
    console.error("Get faculty jobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
