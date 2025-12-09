// routes/facultyRoutes.js
import { Router } from "express";
import { auth, requireRole } from "../middleware/authMiddleware.js";
import {
  createJob,
  getJobsForFaculty,
  updateJob,
  deleteJob,
  getApplicationsForJob,
  updateApplicationStatus,
} from "../controllers/jobController.js";

const router = Router();

// ── JOB CRUD ──
router.post("/jobs", auth, requireRole("FACULTY"), createJob);
router.get("/jobs", auth, requireRole("FACULTY"), getJobsForFaculty);
router.put("/jobs/:id", auth, requireRole("FACULTY"), updateJob);
router.delete("/jobs/:id", auth, requireRole("FACULTY"), deleteJob);

// ── APPLICATION MANAGEMENT ──
router.get("/jobs/:id/applications", auth, requireRole("FACULTY"), getApplicationsForJob);

export default router;