const express = require("express");
const { auth } = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Auth0 user sync - called after every login
router.post("/sync", auth, async (req, res) => {
  try {
    const user = req.user;
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      auth0Id: user.auth0Id,
    });
  } catch (err) {
    console.error("Sync error:", err.message);
    res.status(500).json({ message: "Sync failed" });
  }
});

module.exports = router;