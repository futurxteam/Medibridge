// routes/studentRoutes.js

const express = require("express");
const { auth, requireRole } = require("../middleware/authMiddleware");
const {
  getJobsForStudentOrExternal,
} = require("../controllers/jobController");

const router = express.Router();

// GET /api/student/jobs
// visible for STUDENT and EXTERNAL roles
router.get(
  "/jobs",
  auth,
  requireRole("STUDENT", "EXTERNAL"),
  getJobsForStudentOrExternal
);

module.exports = router;
