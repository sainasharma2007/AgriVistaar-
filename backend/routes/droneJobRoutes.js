// backend/routes/droneJobRoutes.js
const express  = require("express");
const DroneJob = require("../models/DroneJob");
const { auth } = require("../middleware/auth");

const router = express.Router();

// POST /api/drone-jobs
router.post("/", auth, async (req, res) => {
  try {
    const { fieldId, stage, preferredDate, notes } = req.body;
    if (!fieldId) return res.status(400).json({ message: "fieldId is required" });

    const job = await DroneJob.create({
      field:         fieldId,
      farmer:        req.user._id,
      stage,
      preferredDate,
      notes,
    });

    res.status(201).json({ message: "Drone job created", job });
  } catch (err) {
    console.error("Create drone job error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/drone-jobs/my
router.get("/my", auth, async (req, res) => {
  try {
    const jobs = await DroneJob.find({ farmer: req.user._id })
      .populate("field", "name cropType village district")
      .populate("aiAnalysisId") // ✅ full CNN crop analysis data saath aayega
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (err) {
    console.error("Get my jobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/drone-jobs/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const job = await DroneJob.findOne({
      _id:    req.params.id,
      farmer: req.user._id,
    })
      .populate("field", "name cropType village district")
      .populate("aiAnalysisId"); // ✅ single job fetch mein bhi populate

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ job });
  } catch (err) {
    console.error("Get job error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PATCH /api/drone-jobs/:id
router.patch("/:id", auth, async (req, res) => {
  try {
    const { status, imageUrl, analysis, aiAnalysisId, cropHealthStatus, fraudRiskScore } = req.body;
    const updateData = {};
    if (status)                      updateData.status           = status;
    if (imageUrl)                    updateData.imageUrl         = imageUrl;
    if (analysis)                    updateData.analysis         = analysis;
    if (aiAnalysisId)                updateData.aiAnalysisId     = aiAnalysisId;
    if (cropHealthStatus)            updateData.cropHealthStatus = cropHealthStatus;
    if (fraudRiskScore !== undefined) updateData.fraudRiskScore  = fraudRiskScore;

    const job = await DroneJob.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate("field", "name cropType");

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Job updated", job });
  } catch (err) {
    console.error("Update job error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/drone-jobs/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    const job = await DroneJob.findOneAndDelete({
      _id:    req.params.id,
      farmer: req.user._id, // sirf apna scan delete kar sakta hai
    });

    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json({ message: "Scan deleted successfully" });
  } catch (err) {
    console.error("Delete job error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
