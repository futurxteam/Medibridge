// routes/studentRoutes.js

import express from "express";
import { auth, requireRole } from "../middleware/authMiddleware.js";
import { getJobsForStudentOrExternal } from "../controllers/jobController.js";

const router = express.Router();

// GET /api/student/jobs
// visible for STUDENT and EXTERNAL roles
router.get(
  "/jobs",
  auth,
  requireRole("STUDENT", "EXTERNAL"),
  getJobsForStudentOrExternal
);

export default router;
