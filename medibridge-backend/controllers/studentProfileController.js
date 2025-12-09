import StudentProfile from "../models/StudentProfile.js";

export const getProfile = async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user.id });

  res.json(profile || {});
};

export const updateProfile = async (req, res) => {
  const fields = req.body;

  const updated = await StudentProfile.findOneAndUpdate(
    { user: req.user.id },
    { ...fields, updatedAt: Date.now() },
    { new: true, upsert: true }
  );

  res.json(updated);
};

// Check completion
export const checkProfileCompletion = async (req, res) => {
  const profile = await StudentProfile.findOne({ user: req.user.id });

  if (!profile) return res.json({ complete: false });

  const requiredFields = [
    "phone",
    "address",
    "age",
    "sex",
    "qualification",
    "university",
    "cvUrl"
  ];

  const complete = requiredFields.every((f) => profile[f]);
  res.json({ complete });
};
