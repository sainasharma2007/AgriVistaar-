const mongoose = require("mongoose");

const DroneInspectionSchema = new mongoose.Schema({
productId:   { type: String },
  farmerId:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp:   { type: Date, default: Date.now },
  flightPath:  [{ lat: Number, lng: Number, alt: Number }],
  sensorData:  {
    ndviValue:     Number,
    soilMoisture:  Number,
    temperature:   Number,
    humidity:      Number,
  },
  aiAnalysisResult: { type: mongoose.Schema.Types.ObjectId, ref: "AiAnalysis" },
  status:   { type: String, enum: ["pending","in_progress","completed","failed"], default: "pending" },
  droneId:  { type: String },
}, { timestamps: true });

module.exports = mongoose.model("DroneInspection", DroneInspectionSchema);