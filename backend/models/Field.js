const mongoose = require("mongoose");

const fieldSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true }, // e.g. "North field"
    village: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    cropType: { type: String, trim: true },
    areaInAcre: { type: Number },
    season: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Field", fieldSchema);

