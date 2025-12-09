// models/Job.js (ESM)

import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    // faculty user who created the job
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // "MEDIBRIDGE_ONLY" → only Medibridge students
    // "EXTERNAL_ONLY"   → only external candidates
    // "BOTH"            → both
    eligibility: {
      type: String,
      enum: ["MEDIBRIDGE_ONLY", "EXTERNAL_ONLY", "BOTH"],
      default: "BOTH",
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);
export default Job;
