// const mongoose = require("mongoose");

// const AiAnalysisSchema = new mongoose.Schema({
//   // Member 3 ke saath compatible
//   droneJobId: { type: mongoose.Schema.Types.ObjectId, ref: "DroneJob" },
//   fieldId:    { type: mongoose.Schema.Types.ObjectId, ref: "Field" },
  
//   // Member 1 ka extra data
//   model_used:  { type: String },
//   input_type:  { type: String },
//   confidence:  { type: Number },
//   results:     { type: mongoose.Schema.Types.Mixed },

//   // Fraud detection fields
//   fraudRiskScore:    { type: Number },
//   riskLevel:         { type: String },
//   isFlagged:         { type: Boolean },
//   cropHealthStatus:  { type: String },

// }, { timestamps: true });

// module.exports = mongoose.model("AiAnalysis", AiAnalysisSchema);

const mongoose = require("mongoose");
const AiAnalysisSchema = new mongoose.Schema({
  inspectionId: { type: mongoose.Schema.Types.ObjectId, ref: "DroneInspection" },
  model_used:   { type: String },
  input_type:   { type: String },
  confidence:   { type: Number },
  results:      { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });
module.exports = mongoose.model("AiAnalysis", AiAnalysisSchema);