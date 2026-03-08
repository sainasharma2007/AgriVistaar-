// const { spawn } = require("child_process");
// const path = require("path");
// const mongoose = require("mongoose");
// const AiAnalysis = require("../models/AiAnalysis");
// const DroneJob = require("../models/DroneJob");
// const Field = require("../models/Field");

// // POST /api/ai/detect-fraud
// exports.detectFraud = async (req, res) => {
//   try {
//     const { droneJobId, fieldId } = req.body;

//     if (!droneJobId || !fieldId) {
//       return res.status(400).json({
//         success: false,
//         message: "droneJobId aur fieldId dono required hain",
//       });
//     }

//     const droneJob = await DroneJob.findById(droneJobId);
//     if (!droneJob) {
//       return res.status(404).json({ success: false, message: "DroneJob nahi mila" });
//     }

//     const field = await Field.findById(fieldId);
//     if (!field) {
//       return res.status(404).json({ success: false, message: "Field nahi mili" });
//     }

//     const price     = droneJob.areaInAcre || 10;
//     const createdAt = new Date(droneJob.createdAt);
//     const daysHeld  = Math.max(1, Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24)));
//     const hashValid = mongoose.isValidObjectId(droneJob.farmer) ? 1 : 0;

// const scriptPath = path.join(__dirname, "../ai_models/predict_fraud.py"); // ← sirf ye change karo
//     const pythonProcess = spawn("python", [scriptPath, price, daysHeld, hashValid]);

//     let dataString = "";

//     pythonProcess.stdout.on("data", (data) => {
//       dataString += data.toString();
//     });

//     pythonProcess.stderr.on("data", (data) => {
//       const msg = data.toString();
//       if (!msg.includes("UserWarning") && !msg.includes("warnings.warn")) {
//         console.error("Python Error:", msg);
//       }
//     });

//     pythonProcess.on("close", async (code) => {
//       if (code !== 0) {
//         return res.status(500).json({ success: false, message: "AI Model crash ho gaya" });
//       }

//       try {
//         const result         = JSON.parse(dataString.trim());
//         const fraudRiskScore = result.fraudRiskScore;
//         const riskLevel      = result.riskLevel;
//         const isFlagged      = result.is_fraud === 1;
//         const cropStatus     = riskLevel === "HIGH"   ? "At Risk"
//                              : riskLevel === "MEDIUM" ? "Moderate"
//                              : "Healthy";

//         // DroneJob update karo
//         await DroneJob.findByIdAndUpdate(droneJobId, {
//           fraudRiskScore,
//           cropHealthStatus: cropStatus,
//           analysis: result.details,
//           status: isFlagged ? "flagged" : droneJob.status,
//         });

//         // AiAnalysis save karo
//         await AiAnalysis.create({
//           inspectionId: droneJobId,
//           model_used:   "Isolation Forest v2",
//           confidence:   fraudRiskScore,
//           input_type:   "drone_sensor",
//           results: {
//             fraudRiskScore,
//             riskLevel,
//             cropHealthStatus: cropStatus,
//             recommendation: riskLevel === "HIGH"   ? "Immediate inspection required"
//                           : riskLevel === "MEDIUM" ? "Monitor closely"
//                           : "No action needed",
//             anomalies: isFlagged ? ["Price anomaly", "Rapid transfer"] : [],
//           },
//         });

//         return res.status(200).json({
//           success: true,
//           droneJobId,
//           fieldId,
//           fraudRiskScore,
//           riskLevel,
//           isFlagged,
//           cropHealthStatus: cropStatus,
//           details: result.details,
//           model:   result.model,
//         });

//       } catch (e) {
//         console.error("JSON Parse Error:", e);
//         return res.status(500).json({ success: false, message: "AI output parse nahi hua" });
//       }
//     });

//   } catch (error) {
//     console.error("Server Error:", error);
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// // GET /api/ai/fraud-status/:droneJobId
// exports.getFraudStatus = async (req, res) => {
//   try {
//     const droneJob = await DroneJob.findById(req.params.droneJobId)
//       .populate("farmer", "name email");

//     if (!droneJob) {
//       return res.status(404).json({ success: false, message: "DroneJob nahi mila" });
//     }

//     return res.status(200).json({
//       success:          true,
//       droneJobId:       req.params.droneJobId,
//       fraudRiskScore:   droneJob.fraudRiskScore   || null,
//       cropHealthStatus: droneJob.cropHealthStatus || null,
//       status:           droneJob.status,
//       farmer:           droneJob.farmer,
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server Error", error: error.message });
//   }
// };

const { spawn }   = require("child_process");
const path        = require("path");
const mongoose    = require("mongoose");
const AiAnalysis  = require("../models/AiAnalysis");
const DroneJob    = require("../models/DroneJob");
const Field       = require("../models/Field");

// POST /api/ai/detect-fraud
exports.detectFraud = async (req, res) => {
  try {
    const { droneJobId, fieldId } = req.body;

    if (!droneJobId || !fieldId) {
      return res.status(400).json({
        success: false,
        message: "droneJobId aur fieldId dono required hain",
      });
    }

    const droneJob = await DroneJob.findById(droneJobId);
    if (!droneJob) {
      return res.status(404).json({ success: false, message: "DroneJob nahi mila" });
    }

    const field = await Field.findById(fieldId);
    if (!field) {
      return res.status(404).json({ success: false, message: "Field nahi mili" });
    }

    // ── 8 features calculate karo ────────────────────────
    const price     = field.areaInAcre || 10;
    const createdAt = new Date(droneJob.createdAt);
    const daysHeld  = Math.max(1, Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24)));
    const hashValid = mongoose.isValidObjectId(droneJob.farmer) ? 1 : 0;
    const scanFreq  = droneJob.fraudRiskScore > 0.5 ? 8 : 2;    // previous risk se guess
    const areaPriceRatio = price > 0 ? Math.min(price / 5, 5.0) : 1.0;
    const locationConsistency = 0.1; // default: consistent
    const requestTimePattern  = 0;   // default: normal hours
    const repeatFlag = droneJob.fraudRiskScore > 0.5 ? 0.8 : 0.1;

    const scriptPath = path.join(__dirname, "../ai_models/predict_fraud.py");

    // ✅ Sab 8 features bhejo Python ko
    const pythonProcess = spawn("python", [
      scriptPath,
      price,
      daysHeld,
      hashValid,
      scanFreq,
      areaPriceRatio,
      locationConsistency,
      requestTimePattern,
      repeatFlag,
    ]);

    let dataString = "";
    pythonProcess.stdout.on("data", (data) => { dataString += data.toString(); });
    pythonProcess.stderr.on("data", (data) => {
      const msg = data.toString();
      if (!msg.includes("UserWarning") && !msg.includes("warnings.warn")) {
        console.error("Python Error:", msg);
      }
    });

    pythonProcess.on("close", async (code) => {
      if (code !== 0) {
        return res.status(500).json({ success: false, message: "AI Model crash ho gaya" });
      }

      try {
        const result         = JSON.parse(dataString.trim());
        const fraudRiskScore = result.fraudRiskScore;
        const riskLevel      = result.riskLevel;
        const isFlagged      = result.is_fraud === 1;
        const cropStatus     = riskLevel === "HIGH"   ? "At Risk"
                             : riskLevel === "MEDIUM" ? "Moderate"
                             : "Healthy";

        await DroneJob.findByIdAndUpdate(droneJobId, {
          fraudRiskScore,
          cropHealthStatus: cropStatus,
          analysis: result.details,
          status:   isFlagged ? "flagged" : droneJob.status,
        });

        await AiAnalysis.create({
          inspectionId: droneJobId,
          model_used:   "Isolation Forest v3",
          confidence:   fraudRiskScore,
          input_type:   "drone_sensor",
          results: {
            fraudRiskScore,
            riskLevel,
            cropHealthStatus: cropStatus,
            recommendation: riskLevel === "HIGH"   ? "Immediate inspection required"
                          : riskLevel === "MEDIUM" ? "Monitor closely"
                          : "No action needed",
            anomalies: isFlagged ? ["Price anomaly", "Rapid transfer"] : [],
          },
        });

        return res.status(200).json({
          success: true,
          droneJobId,
          fieldId,
          fraudRiskScore,
          riskLevel,
          isFlagged,
          cropHealthStatus: cropStatus,
          details: result.details,
          model:   result.model,
        });

      } catch (e) {
        console.error("JSON Parse Error:", e);
        return res.status(500).json({ success: false, message: "AI output parse nahi hua" });
      }
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// GET /api/ai/fraud-status/:droneJobId
exports.getFraudStatus = async (req, res) => {
  try {
    const droneJob = await DroneJob.findById(req.params.droneJobId)
      .populate("farmer", "name email");

    if (!droneJob) {
      return res.status(404).json({ success: false, message: "DroneJob nahi mila" });
    }

    return res.status(200).json({
      success:          true,
      droneJobId:       req.params.droneJobId,
      fraudRiskScore:   droneJob.fraudRiskScore   || null,
      cropHealthStatus: droneJob.cropHealthStatus || null,
      status:           droneJob.status,
      farmer:           droneJob.farmer,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};