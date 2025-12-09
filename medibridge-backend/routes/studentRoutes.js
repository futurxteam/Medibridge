// routes/studentRoutes.js   ←  replace your current file with this
import { Router } from "express";
import { auth, requireRole } from "../middleware/authMiddleware.js";
import {
  getJobsForStudentOrExternal,
  applyToJob,
} from "../controllers/jobController.js";
import {
  getProfile,
  updateProfile,
} from "../controllers/studentProfileController.js";

const router = Router();

// GET jobs – both STUDENT and EXTERNAL
router.get(
  "/jobs",
  auth,
  requireRole("STUDENT", "EXTERNAL"),
  getJobsForStudentOrExternal
);

// APPLY – clean URL
router.post(
  "/apply/:jobId",
  auth,
  requireRole("STUDENT", "EXTERNAL"),
  applyToJob
);

router.get(
  "/profile",
  auth,
  requireRole("STUDENT", "EXTERNAL"),
  getProfile
);

// CREATE or UPDATE profile
router.put(
  "/profile",
  auth,
  requireRole("STUDENT", "EXTERNAL"),
  updateProfile
);

export default router;