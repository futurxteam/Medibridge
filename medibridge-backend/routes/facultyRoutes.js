// routes/facultyRoutes.js

import express from "express";
import { auth, requireRole } from "../middleware/authMiddleware.js";
import {
  createJob,
  getJobsForFaculty,
} from "../controllers/jobController.js";

const router = express.Router();

// POST /api/faculty/jobs  -> create new job (FACULTY only)
router.post("/jobs", auth, requireRole("FACULTY"), createJob);

// GET /api/faculty/jobs   -> list jobs posted by this faculty
router.get("/jobs", auth, requireRole("FACULTY"), getJobsForFaculty);

export default router;
