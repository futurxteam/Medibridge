// routes/facultyRoutes.js
import { Router } from "express";
import { auth, requireRole } from "../middleware/authMiddleware.js";
import {
  createJob,
  getJobsForFaculty,
  updateJob,
  deleteJob,
  getApplicationsForJob,
  
} from "../controllers/jobController.js";
import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} from "../controllers/academyRecordController.js";

const router = Router();

// ── JOB CRUD ──
router.post("/jobs", auth, requireRole("FACULTY"), createJob);
router.get("/jobs", auth, requireRole("FACULTY"), getJobsForFaculty);
router.put("/jobs/:id", auth, requireRole("FACULTY"), updateJob);
router.delete("/jobs/:id", auth, requireRole("FACULTY"), deleteJob);

// ── APPLICATION MANAGEMENT ──
router.get("/jobs/:id/applications", auth, requireRole("FACULTY"), getApplicationsForJob);

// CREATE
router.post("/addrecord", createStudent);

// READ ALL
router.get("/getrecord", getStudents);

// READ ONE
router.get("/getrecord/:id", getStudentById);

// UPDATE
router.put("/updaterecord/:id", updateStudent);

// DELETE
router.delete("/delete/:id", deleteStudent);

export default router;













