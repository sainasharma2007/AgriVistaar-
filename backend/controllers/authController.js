const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ REGISTER API HIT");
    console.log("📥 Request body:", req.body);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const { name, email, password, phone, district, state } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log("❌ Missing required fields");
      console.log("   - name:", !!name);
      console.log("   - email:", !!email);
      console.log("   - password:", !!password);
      
      return res.status(400).json({ 
        message: "Missing required fields",
        details: {
          name: !name ? "Name is required" : "OK",
          email: !email ? "Email is required" : "OK",
          password: !password ? "Password is required" : "OK"
        }
      });
    }

    console.log("✅ All required fields present");
    console.log("🔍 Checking for existing user...");

    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log("❌ User already exists with email:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("✅ Email is available");
    console.log("🔐 Hashing password...");

    const hash = await bcrypt.hash(password, 10);

    console.log("💾 Creating user in database...");

    const user = await User.create({
      name,
      email,
      password: hash,
      phone: phone || "",
      district: district || "",
      state: state || "",
    });

    console.log("✅ User created successfully!");
    console.log("👤 User ID:", user._id);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return res.status(201).json({ 
      message: "User registered successfully", 
      userId: user._id,
      user: {
        name: user.name,
        email: user.email
      }
    });
    
  } catch (err) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ REGISTER ERROR");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    return res.status(500).json({ 
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔐 LOGIN API HIT");
    console.log("📥 Request body:", req.body);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing credentials");
      return res.status(400).json({ message: "Email and password are required" });
    }

    console.log("🔍 Finding user...");
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(400).json({ message: "User not found" });
    }

    console.log("✅ User found");
    console.log("🔐 Verifying password...");

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log("❌ Wrong password");
      return res.status(400).json({ message: "Wrong password" });
    }

    console.log("✅ Password correct");

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET not set in environment");
      return res.status(500).json({ message: "Server configuration error" });
    }

    console.log("🎫 Generating JWT token...");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    console.log("✅ Login successful");
    console.log("👤 User ID:", user._id);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        district: user.district,
        state: user.state,
        role: user.role,
      },
    });
    
  } catch (err) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ LOGIN ERROR");
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    
    return res.status(500).json({ 
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = { registerUser, loginUser };


