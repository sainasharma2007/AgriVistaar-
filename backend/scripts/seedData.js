// backend/scripts/seedData.js
// Run: node scripts/seedData.js
// Yeh script demo ke liye 2 farmers, 4 fields, 6 drone jobs insert karega

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User     = require("../models/User");
const Field    = require("../models/Field");
const DroneJob = require("../models/DroneJob");
const AiAnalysis      = require("../models/AiAnalysis");
const DroneInspection = require("../models/DroneInspection");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");

  // ── 1. Purana demo data clean karo ──────────────────────
  await User.deleteMany({ email: { $in: ["raju@farm.com", "priya@farm.com"] } });
  await Field.deleteMany({ name: { $in: ["North Wheat Field", "East Mustard Plot", "South Paddy Field", "West Cotton Field"] } });
  console.log("🧹 Old demo data cleaned");

  // ── 2. 2 Demo Farmers banao ──────────────────────────────
  const hash = await bcrypt.hash("demo123", 10);

  const farmer1 = await User.create({
    name:     "Raju Sharma",
    email:    "raju@farm.com",
    password: hash,
    phone:    "9876543210",
    role:     "farmer",
  });

  const farmer2 = await User.create({
    name:     "Priya Patel",
    email:    "priya@farm.com",
    password: hash,
    phone:    "9876543211",
    role:     "farmer",
  });

  console.log("👤 2 Demo farmers created");
  console.log("   Farmer 1:", farmer1.email, "| Password: demo123");
  console.log("   Farmer 2:", farmer2.email, "| Password: demo123");

  // ── 3. 4 Demo Fields banao ───────────────────────────────
  const field1 = await Field.create({
    farmer:     farmer1._id,
    name:       "North Wheat Field",
    village:    "Rampur",
    district:   "Sitapur",
    state:      "Uttar Pradesh",
    cropType:   "Wheat",
    areaInAcre: 2.5,
    season:     "Rabi",
  });

  const field2 = await Field.create({
    farmer:     farmer1._id,
    name:       "East Mustard Plot",
    village:    "Rampur",
    district:   "Sitapur",
    state:      "Uttar Pradesh",
    cropType:   "Mustard",
    areaInAcre: 1.8,
    season:     "Rabi",
  });

  const field3 = await Field.create({
    farmer:     farmer2._id,
    name:       "South Paddy Field",
    village:    "Lakhimpur",
    district:   "Lakhimpur Kheri",
    state:      "Uttar Pradesh",
    cropType:   "Paddy",
    areaInAcre: 3.2,
    season:     "Kharif",
  });

  const field4 = await Field.create({
    farmer:     farmer2._id,
    name:       "West Cotton Field",
    village:    "Lakhimpur",
    district:   "Lakhimpur Kheri",
    state:      "Uttar Pradesh",
    cropType:   "Cotton",
    areaInAcre: 2.0,
    season:     "Kharif",
  });

  console.log("🌾 4 Demo fields created");

  // ── 4. Demo DroneJobs banao ──────────────────────────────

  // Job 1 — Completed with analysis (Farmer 1, Field 1)
  const job1 = await DroneJob.create({
    field:   field1._id,
    farmer:  farmer1._id,
    status:  "completed",
    stage:   "mid",
    preferredDate: new Date("2026-02-10"),
    notes:   "Focus on north patches",
    imageUrl: "https://placehold.co/800x600/4ade80/ffffff?text=Wheat+Field+Scan",
    analysis: "Mild stress detected in ~18% area, mainly in north side. Recommended nitrogen spray within 3 days.",
    cropHealthStatus: "stressed",
    fraudRiskScore: 0.08,
  });

  // Job 2 — Completed healthy (Farmer 1, Field 2)
  const job2 = await DroneJob.create({
    field:   field2._id,
    farmer:  farmer1._id,
    status:  "completed",
    stage:   "early",
    preferredDate: new Date("2026-02-15"),
    notes:   "",
    imageUrl: "https://placehold.co/800x600/86efac/ffffff?text=Mustard+Field+Scan",
    analysis: "No issues detected. Healthy crop. Yield estimated at 8-10 quintal/acre.",
    cropHealthStatus: "healthy",
    fraudRiskScore: 0.05,
  });

  // Job 3 — Pending (Farmer 1, Field 1 — second request)
  const job3 = await DroneJob.create({
    field:   field1._id,
    farmer:  farmer1._id,
    status:  "requested",
    stage:   "pre-harvest",
    preferredDate: new Date("2026-03-05"),
    notes:   "Pre-harvest check needed",
  });

  // Job 4 — Completed with disease (Farmer 2, Field 3)
  const job4 = await DroneJob.create({
    field:   field3._id,
    farmer:  farmer2._id,
    status:  "completed",
    stage:   "mid",
    preferredDate: new Date("2026-02-08"),
    notes:   "Yellow patches visible in south corner",
    imageUrl: "https://placehold.co/800x600/fbbf24/ffffff?text=Paddy+Field+Scan",
    analysis: "Mild stress detected in ~25% area, mainly in south side. Pest risk medium. Recommended pesticide spray within 2 days.",
    cropHealthStatus: "diseased",
    fraudRiskScore: 0.12,
  });

  // Job 5 — Pending (Farmer 2, Field 4)
  const job5 = await DroneJob.create({
    field:   field4._id,
    farmer:  farmer2._id,
    status:  "requested",
    stage:   "early",
    preferredDate: new Date("2026-02-28"),
    notes:   "",
  });

  // Job 6 — Scheduled (Farmer 2, Field 3 — second request)
  const job6 = await DroneJob.create({
    field:   field3._id,
    farmer:  farmer2._id,
    status:  "scheduled",
    stage:   "pre-harvest",
    preferredDate: new Date("2026-03-10"),
    notes:   "Full field coverage needed",
  });

  console.log("🚁 6 Demo drone jobs created");

  // ── 5. Demo AiAnalysis records banao ────────────────────
  const ai1 = await AiAnalysis.create({
    inspectionId: job1._id,
    model_used:   "crop_health_v1",
    input_type:   "image",
    confidence:   0.87,
    results: {
      cropHealthStatus: "stressed",
      diseaseDetected:  ["nitrogen_deficiency"],
      ndviScore:        0.54,
      affectedArea:     18,
      recommendation:   "Apply Urea 45kg/acre within 3 days",
    },
  });

  const ai2 = await AiAnalysis.create({
    inspectionId: job2._id,
    model_used:   "crop_health_v1",
    input_type:   "image",
    confidence:   0.94,
    results: {
      cropHealthStatus: "healthy",
      diseaseDetected:  [],
      ndviScore:        0.78,
      affectedArea:     0,
      recommendation:   "No action needed. Continue regular irrigation.",
    },
  });

  const ai3 = await AiAnalysis.create({
    inspectionId: job4._id,
    model_used:   "crop_health_v1",
    input_type:   "image",
    confidence:   0.81,
    results: {
      cropHealthStatus: "diseased",
      diseaseDetected:  ["brown_spot", "pest_infestation"],
      ndviScore:        0.41,
      affectedArea:     25,
      recommendation:   "Apply Propiconazole fungicide + pesticide spray immediately",
    },
  });

  // Fraud analysis
  await AiAnalysis.create({
    inspectionId: job1._id,
    model_used:   "fraud_detector_v1",
    input_type:   "transaction",
    confidence:   0.92,
    results: {
      fraudRiskScore: 0.08,
      riskLevel:      "LOW",
      anomalies:      [],
    },
  });

  // Update DroneJobs with aiAnalysisId
  await DroneJob.findByIdAndUpdate(job1._id, { aiAnalysisId: ai1._id });
  await DroneJob.findByIdAndUpdate(job2._id, { aiAnalysisId: ai2._id });
  await DroneJob.findByIdAndUpdate(job4._id, { aiAnalysisId: ai3._id });

  console.log("🤖 4 Demo AI analysis records created");

  // ── 6. Demo DroneInspections banao ──────────────────────
  await DroneInspection.create({
    farmerId:  farmer1._id,
    productId: job1._id,
    status:    "completed",
    flightPath: [
      { lat: 27.5706, lng: 80.6982, alt: 30 },
      { lat: 27.5710, lng: 80.6982, alt: 30 },
      { lat: 27.5710, lng: 80.6990, alt: 30 },
      { lat: 27.5706, lng: 80.6990, alt: 30 },
    ],
    sensorData: {
      ndviValue:    0.54,
      soilMoisture: 42,
      temperature:  28,
      humidity:     65,
    },
  });

  await DroneInspection.create({
    farmerId:  farmer2._id,
    productId: job4._id,
    status:    "completed",
    flightPath: [
      { lat: 27.9500, lng: 80.7800, alt: 25 },
      { lat: 27.9505, lng: 80.7800, alt: 25 },
      { lat: 27.9505, lng: 80.7810, alt: 25 },
      { lat: 27.9500, lng: 80.7810, alt: 25 },
    ],
    sensorData: {
      ndviValue:    0.41,
      soilMoisture: 38,
      temperature:  31,
      humidity:     72,
    },
  });

  console.log("🛸 2 Demo drone inspections created");

  // ── Summary ──────────────────────────────────────────────
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ SEED COMPLETE — Demo data ready!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n📋 LOGIN CREDENTIALS:");
  console.log("   Farmer 1 → raju@farm.com    | demo123");
  console.log("   Farmer 2 → priya@farm.com   | demo123");
  console.log("\n📊 DATA INSERTED:");
  console.log("   👤 Users:            2");
  console.log("   🌾 Fields:           4");
  console.log("   🚁 Drone Jobs:       6  (3 completed, 2 pending, 1 scheduled)");
  console.log("   🤖 AI Analyses:      4");
  console.log("   🛸 Inspections:      2");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed error:", err.message);
  process.exit(1);
});