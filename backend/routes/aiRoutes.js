

// const express    = require("express");
// const router     = express.Router();
// const AiAnalysis = require("../models/AiAnalysis");
// const DroneJob   = require("../models/DroneJob");
// const { auth }   = require("../middleware/authMiddleware");

// // POST /api/ai/analyze-crop
// // Member 2 ka crop health model yahan connect hoga
// router.post("/analyze-crop", auth, async (req, res) => {
//   try {
//     const { jobId, imageUrl } = req.body;
//     if (!jobId) return res.status(400).json({ message: "jobId required" });

//     // TODO: Member 2 ka Flask ready hone pe uncomment karo
//     // const flaskRes = await axios.post("http://localhost:5001/ml/analyze-crop", { imageUrl });
//     // const aiResult = flaskRes.data;

//     // Abhi dummy response
//     const aiResult = {
//       cropHealthStatus: "healthy",
//       confidence:       0.91,
//       analysis:         "No issues detected. Healthy crop.",
//     };

//     // ✅ BUG FIX: droneJobId → jobId
//     const analysis = await AiAnalysis.create({
//       inspectionId: jobId,           // ← fix
//       model_used:   "crop_health_v1",
//       input_type:   "image",
//       confidence:   aiResult.confidence,
//       results:      aiResult,
//     });

//     await DroneJob.findByIdAndUpdate(jobId, {
//       status:           "completed",
//       analysis:         aiResult.analysis,
//       aiAnalysisId:     analysis._id,
//       cropHealthStatus: aiResult.cropHealthStatus,
//     });

//     res.json({ success: true, analysis });

//   } catch (err) {
//     console.error("Analyze crop error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;



const express    = require("express");
const router     = express.Router();
const AiAnalysis = require("../models/AiAnalysis");
const DroneJob   = require("../models/DroneJob");
const { auth }   = require("../middleware/auth");
const axios      = require("axios");

// POST /api/ai/analyze-crop
router.post("/analyze-crop", auth, async (req, res) => {
  try {
    const { jobId, imageUrl } = req.body;
    console.log("📥 Request body:", req.body);
    console.log("🔗 imageUrl:", imageUrl);
    console.log("🆔 jobId:", jobId);

    if (!jobId) return res.status(400).json({ message: "jobId required" });

    let aiResult;

    try {
      console.log("🚀 Calling Flask...");
      const flaskRes = await axios.post(
        "https://beelike-inflectional-deneen.ngrok-free.dev/ml/analyze-crop",
        { imageUrl, inspectionId: jobId },
        { headers: { 'ngrok-skip-browser-warning': 'true' } }
      );
      console.log("✅ Flask response:", flaskRes.data);
      aiResult = flaskRes.data;

    } catch (flaskErr) {
      console.error("❌ Flask API error:", flaskErr.message);
      console.error("❌ Flask error details:", flaskErr.response?.data);
      aiResult = {
        model_used: "crop_health_v1",
        input_type: "image",
        confidence: 0.91,
        results: {
          cropHealthStatus: "healthy",
          diseaseDetected: [],
          recommendation: "No issues detected. Healthy crop.",
          ndviScore: 0.75,
          affectedArea: 0,
          riskLevel: "low",
          anomalies: []
        }
      };
    }

    const analysis = await AiAnalysis.create({
      inspectionId: jobId,
      model_used:   aiResult.model_used,
      input_type:   aiResult.input_type,
      confidence:   aiResult.confidence,
      results:      aiResult.results,
    });

    await DroneJob.findByIdAndUpdate(jobId, {
      status:           "completed",
      analysis:         aiResult.results?.recommendation,
      aiAnalysisId:     analysis._id,
      cropHealthStatus: aiResult.results?.cropHealthStatus,
    });

    res.json({ success: true, analysis });

  } catch (err) {
    console.error("Analyze crop error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;