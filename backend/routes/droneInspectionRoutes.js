const express = require("express");
const router  = express.Router();
const axios   = require("axios");
const DroneInspection = require("../models/DroneInspection");
const DroneJob        = require("../models/DroneJob");
const AiAnalysis      = require("../models/AiAnalysis");
const { auth }        = require("../middleware/auth");

const FLASK_URL = process.env.FLASK_URL || "http://localhost:6000";

// ══════════════════════════════════════════════════════════
// POST /api/inspections/start
// Frontend "Start Inspection" button yeh call karta hai
// ══════════════════════════════════════════════════════════
router.post("/start", auth, async (req, res) => {
  try {
    const { jobId, farmCoordinates, farmSizeAcres } = req.body;

    // DroneInspection record banao — pending
    const inspection = await DroneInspection.create({
      farmerId:  req.user._id,
      productId: jobId,
      status:    "pending",
    });

    // DroneJob bhi pending update karo
    if (jobId) {
      await DroneJob.findByIdAndUpdate(jobId, { status: "scheduled" });
    }

    // Flask drone simulator ko async trigger karo
    axios.post(`${FLASK_URL}/drone/run`, {
      inspectionId:    inspection._id.toString(),
      productId:       jobId,
      farmerId:        req.user._id.toString(),
      farmCoordinates: farmCoordinates || { lat: 28.6139, lng: 77.2090 },
      farmSizeAcres:   farmSizeAcres   || 5,
    }).catch(err => {
      if (err.response && err.response.status === 404) {
        console.log("[Drone] Notice: Member 4's Flask Simulator endpoint /drone/run is currently offline or missing (404). Simulation continuing in mock mode.");
      } else {
        console.log("[Drone] Flask trigger error:", err.message);
      }
    });

    res.json({
      success:      true,
      inspectionId: inspection._id,
      status:       "pending",
      message:      "Drone simulation started! Status check karo /api/inspections/:id/status se",
    });

  } catch (err) {
    console.error("Start inspection error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ══════════════════════════════════════════════════════════
// PATCH /api/inspections/:id/complete
// Member 4 ka drone simulator yeh call karta hai jab done ho
// ══════════════════════════════════════════════════════════
router.patch("/:id/complete", async (req, res) => {
  try {
    const {
      flightPath,
      sensorData,
      farmHealth,     // 'Good' | 'Moderate' | 'Poor'
      alert,          // true | false
      aiQualityScore, // 0-100
      imageUrls,      // array of image URLs (M2 ke liye)
    } = req.body;

    // 1. DroneInspection update karo
    const inspection = await DroneInspection.findByIdAndUpdate(
      req.params.id,
      {
        status:     "completed",
        flightPath: flightPath || [],
        sensorData: sensorData || {},
      },
      { new: true }
    );

    if (!inspection) {
      return res.status(404).json({ success: false, message: "Inspection nahi mili" });
    }

    // 2. DroneJob update karo (productId se link)
    if (inspection.productId) {
      await DroneJob.findByIdAndUpdate(inspection.productId, {
        status:           "completed",
        cropHealthStatus: farmHealth === "Good"     ? "healthy"
                        : farmHealth === "Moderate" ? "stressed"
                        : "diseased",
        fraudRiskScore:   alert ? 0.75 : 0.15, // M3 baad mein override karega
      });
    }

    // 3. AiAnalysis record banao (drone sensor data)
    const aiAnalysis = await AiAnalysis.create({
      inspectionId: inspection._id,
      model_used:   "drone_sensor_v1",
      input_type:   "drone_sensor",
      confidence:   aiQualityScore ? aiQualityScore / 100 : 0.75,
      results: {
        farmHealth,
        aiQualityScore,
        alert,
        sensorReadings: sensorData ? sensorData.length : 0,
        imageUrls:      imageUrls || [],
        recommendation: alert
          ? "Immediate crop inspection recommended"
          : "Farm looks healthy — continue monitoring",
      },
    });

    // 4. Member 3 (Fraud AI) auto-trigger karo
    if (inspection.productId) {
      triggerFraudDetection(
        inspection.productId.toString(),
        inspection._id.toString(),
        alert
      );
    }

    console.log(`[M1] Inspection ${req.params.id} complete — Health: ${farmHealth} | Score: ${aiQualityScore}`);

    res.json({
      success:     true,
      inspectionId: req.params.id,
      farmHealth,
      aiQualityScore,
      alert,
      inspection,
    });

  } catch (err) {
    console.error("Complete inspection error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ══════════════════════════════════════════════════════════
// GET /api/inspections/:id/status
// Frontend polling ke liye
// ══════════════════════════════════════════════════════════
router.get("/:id/status", auth, async (req, res) => {
  try {
    const inspection = await DroneInspection.findById(req.params.id);
    if (!inspection) {
      return res.status(404).json({ success: false, message: "Inspection nahi mili" });
    }
    res.json({
      success:    true,
      status:     inspection.status,
      inspection,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ══════════════════════════════════════════════════════════
// HELPER: Member 3 fraud detection auto-trigger
// ══════════════════════════════════════════════════════════
async function triggerFraudDetection(droneJobId, inspectionId, alert) {
  try {
    const { spawn } = require("child_process");
    const path       = require("path");

    const job   = await DroneJob.findById(droneJobId);
    const field = job ? await require("../models/Field").findById(job.field) : null;

    const price     = field ? (field.areaInAcre || 10) : 10;
    const createdAt = job ? new Date(job.createdAt) : new Date();
    const daysHeld  = Math.max(1, Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24)));
    const hashValid = require("mongoose").isValidObjectId(droneJobId) ? 1 : 0;
    const scanFreq  = alert ? 8 : 2;
    const repeatFlag = alert ? 0.8 : 0.1;

    const scriptPath = path.join(__dirname, "../ai_models/predict_fraud.py");
    const py = spawn("python", [
      scriptPath,
      price, daysHeld, hashValid, scanFreq,
      1.0,  // area_price_ratio
      0.1,  // location_consistency
      0,    // request_time_pattern
      repeatFlag,
    ]);

    let output = "";
    py.stdout.on("data", d => output += d.toString());
    py.on("close", async () => {
      try {
        const result = JSON.parse(output.trim());
        await DroneJob.findByIdAndUpdate(droneJobId, {
          fraudRiskScore: result.fraudRiskScore,
        });
        await AiAnalysis.create({
          inspectionId: inspectionId,
          model_used:   "Isolation Forest v3",
          input_type:   "transaction",
          confidence:   parseFloat((1 - result.fraudRiskScore).toFixed(2)),
          results:      result,
        });
        console.log(`[M3] Fraud score: ${result.fraudRiskScore} | Risk: ${result.riskLevel}`);
      } catch (e) {
        console.log("[M3] Fraud parse error:", e.message);
      }
    });
  } catch (e) {
    console.log("[M3] Fraud trigger error:", e.message);
  }
}

module.exports = router;