// controllers/jobController.js
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import StudentProfile from "../models/StudentProfile.js";   // ← THIS LINE WAS MISSING
// POST /api/faculty/jobs → Create job (FACULTY only)
export const createJob = async (req, res) => {
  try {
    const { title, description, eligibility } = req.body;

    if (!title || !description || !eligibility) {
      return res.status(400).json({ message: "Title, description, and eligibility are required." });
    }

    if (!["MEDIBRIDGE_ONLY", "EXTERNAL_ONLY", "BOTH"].includes(eligibility)) {
      return res.status(400).json({ message: "Invalid eligibility value." });
    }

    const job = await Job.create({
      title,
      description,
      eligibility,
      postedBy: req.user.id,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Create job error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/student/jobs → For STUDENT & EXTERNAL
export const getJobsForStudentOrExternal = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "STUDENT") {
      filter.eligibility = { $in: ["MEDIBRIDGE_ONLY", "BOTH"] };
    } else if (req.user.role === "EXTERNAL") {
      filter.eligibility = { $in: ["EXTERNAL_ONLY", "BOTH"] };
    } else {
      return res.status(403).json({ message: "Access denied." });
    }

    const jobs = await Job.find(filter)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("Get jobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/faculty/jobs → Only jobs posted by this faculty
export const getJobsForFaculty = async (req, res) => {
  try {
const jobs = await Job.find().sort({ createdAt: -1 });
      

    res.json(jobs);
  } catch (err) {
    console.error("Get faculty jobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // --- NEW CHECK: Student must have completed profile ---
    if (req.user.role === "STUDENT") {
      const profile = await StudentProfile.findOne({ user: userId });

      if (!profile)
        return res
          .status(400)
          .json({ message: "Complete your profile before applying." });

      // It must have all required fields
      const requiredFields = [
        "phone",
        "address",
        "age",
        "sex",
        "qualification",
        "university",
        "cvUrl",
      ];

      const incomplete = requiredFields.filter((f) => !profile[f]);

      if (incomplete.length > 0) {
        return res.status(400).json({
          message: "Your profile is incomplete",
          missing: incomplete,
        });
      }
    }

    // Check eligibility
    if (req.user.role === "STUDENT" && job.eligibility === "EXTERNAL_ONLY") {
      return res
        .status(403)
        .json({ message: "This job is for external candidates only" });
    }
    if (req.user.role === "EXTERNAL" && job.eligibility === "MEDIBRIDGE_ONLY") {
      return res
        .status(403)
        .json({ message: "This job is for Medibridge students only" });
    }

    // Prevent duplicate applications
    const existing = await Application.findOne({ job: jobId, user: userId });
    if (existing)
      return res.status(400).json({ message: "Already applied to this job" });

    // Create application
    const application = await Application.create({
      job: jobId,
      user: userId,
    });

    await application.populate("user", "name email role");

    res.status(201).json({
      message: "Applied successfully!",
      application,
    });
  } catch (err) {
    console.error("Apply error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/faculty/jobs/:id/applications → Faculty sees who applied
export const getApplicationsForJob = async (req, res) => {
  try {
    const { id: jobId } = req.params;

    const job = await Job.findById(jobId);
if (!job) {
  return res.status(404).json({ message: "Job not found" });
}



    const applications = await Application.find({ job: jobId })
      .populate("user", "name email role")
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Get applications error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// UPDATE JOB
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

const job = await Job.findById(id);
    if (!job) return res.status(404).json({ message: "Job not found or not yours" });

    // Only allow these fields to be updated
    const allowedUpdates = ["title", "description", "eligibility"];
    Object.keys(updates).forEach((key) => {
      if (allowedUpdates.includes(key)) job[key] = updates[key];
    });

    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE JOB (also deletes all applications)
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findOneAndDelete({ _id: id, postedBy: req.user.id });
    if (!job) return res.status(404).json({ message: "Job not found or not yours" });

    // Delete all applications for this job
    await Application.deleteMany({ job: id });

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE APPLICATION STATUS (Pending → Shortlisted / Rejected / Accepted)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["PENDING", "SHORTLISTED", "REJECTED", "ACCEPTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(id).populate("job");
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Security: only owner of the job can update
    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    await application.save();

    await application.populate("user", "name email");

    res.json({
      message: "Status updated",
      application,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};