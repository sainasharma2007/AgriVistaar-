// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    auth0Id: {
      type: String,
      unique: true,
      sparse: true,
    },

    name: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      default: "",
    },

    password: {
      type: String,
      default: null,  // ✅ no longer required
    },

    phone: {
      type: String,
    },

    district: {
      type: String,
    },

    state: {
      type: String,
    },

    role: {
      type: String,
      enum: ["farmer", "fpo", "admin"],
      default: "farmer",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
