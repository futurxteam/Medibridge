// routes/facultyRoutes.js

const express = require("express");
const { auth, requireRole } = require("../middleware/authMiddleware");
const {
  createJob,
  getJobsForFaculty,
} = require("../controllers/jobController");

const router = express.Router();

// POST /api/faculty/jobs  -> create new job (FACULTY only)
router.post("/jobs", auth, requireRole("FACULTY"), createJob);

// GET /api/faculty/jobs   -> list jobs posted by this faculty
router.get("/jobs", auth, requireRole("FACULTY"), getJobsForFaculty);

module.exports = router;
