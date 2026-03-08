
// backend/routes/fieldRoutes.js
const express = require("express");
const Field = require("../models/Field");
const DroneJob = require("../models/DroneJob");
const { auth } = require("../middleware/auth");

const router = express.Router();

// POST /api/fields
router.post("/", auth, async (req, res) => {
  try {
    const { name, village, district, state, cropType, areaInAcre, season } = req.body;
    if (!name) return res.status(400).json({ message: "Field name is required" });

    const field = await Field.create({
      farmer: req.user._id,
      name, village, district, state, cropType, areaInAcre, season,
    });

    res.status(201).json({ message: "Field created", field });
  } catch (err) {
    console.error("Create field error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/fields/my
router.get("/my", auth, async (req, res) => {
  try {
    const fields = await Field.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    res.json({ fields });
  } catch (err) {
    console.error("Get fields error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/fields/:id
router.get("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id.trim();
    const field = await Field.findOne({ _id: id, farmer: req.user._id });
    if (!field) return res.status(404).json({ message: "Field not found" });
    res.json({ field });
  } catch (err) {
    console.error("Get field error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/fields/:id  ← NEW
router.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id.trim();
    const field = await Field.findOneAndDelete({ _id: id, farmer: req.user._id });
    if (!field) return res.status(404).json({ message: "Field not found" });

    // Associated drone jobs bhi delete karo
    await DroneJob.deleteMany({ field: id });

    res.json({ message: "Field deleted successfully" });
  } catch (err) {
    console.error("Delete field error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;