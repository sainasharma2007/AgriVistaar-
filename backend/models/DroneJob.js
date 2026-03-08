const mongoose = require("mongoose");

const droneJobSchema = new mongoose.Schema(
  {
    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "scheduled", "completed"],
      default: "requested",
    },
    imageUrl: { type: String },   // drone image URL
    analysis: { type: String },   // health summary text

    // ── Scan request details ─────────────────────────────
    stage:         { type: String },  // "early", "mid", "pre-harvest"
    preferredDate: { type: Date },    // farmer ki pasandida scan date
    notes:         { type: String },  // pilot ke liye notes

    // ── AI integration (Member 2 & 3 use karega) ────────
    aiAnalysisId:     { type: mongoose.Schema.Types.ObjectId, ref: "AiAnalysis" },
    cropHealthStatus: {
      type: String,
      enum: ["healthy", "diseased", "stressed"],
      default: null,
    },
    fraudRiskScore: { type: Number, default: null }, // 0.0 – 1.0
  },
  { timestamps: true }
);

module.exports = mongoose.model("DroneJob", droneJobSchema);