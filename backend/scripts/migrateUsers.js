// backend/scripts/migrateUsers.js
// Run: node scripts/migrateUsers.js

require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const axios = require("axios");

const AUTH0_DOMAIN    = process.env.AUTH0_DOMAIN;
const CLIENT_ID       = "CQOQDxnyRJpCyXcJ5sAhx6vbotVq4L1S";
const CLIENT_SECRET   = "YAgWveO7S22Gy27sLdymJoLtVU3Qv4hEtG7w-vzZEX91zb7mJeSi6dfE_bfFSLSE";
const CONNECTION_ID   = process.env.AUTH0_CONNECTION_ID;

const userSchema = new mongoose.Schema({
  name:     String,
  email:    String,
  password: String,
  phone:    String,
  district: String,
  state:    String,
  role:     { type: String, default: "farmer" },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const getFreshToken = async () => {
  console.log("🔑 Fetching fresh Management API token...");
  const res = await axios.post(
    `https://${AUTH0_DOMAIN}/oauth/token`,
    {
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      audience:      `https://${AUTH0_DOMAIN}/api/v2/`,
      grant_type:    "client_credentials",
    },
    { headers: { "Content-Type": "application/json" } }
  );
  console.log("✅ Token fetched!\n");
  return res.data.access_token;
};

const pollJobStatus = async (jobId, token) => {
  console.log("🔄 Checking job status every 5 seconds...\n");
  for (let i = 0; i < 12; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    try {
      const res = await axios.get(
        `https://${AUTH0_DOMAIN}/api/v2/jobs/${jobId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { status, summary } = res.data;
      console.log(`Status: ${status}`, summary ? `| ${JSON.stringify(summary)}` : "");
      if (status === "completed") {
        console.log("\n🎉 Migration completed!");
        console.log(`✅ Inserted: ${summary?.inserted || 0}`);
        console.log(`🔄 Updated:  ${summary?.updated  || 0}`);
        console.log(`❌ Failed:   ${summary?.failed   || 0}`);
        break;
      }
      if (status === "failed") {
        console.log("❌ Job failed. Check Auth0 Dashboard → Monitoring → Jobs");
        break;
      }
    } catch (e) {
      console.error("Poll error:", e.message);
    }
  }
};

const migrate = async () => {
  try {
    const token = await getFreshToken();

    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected!\n");

    const users = await User.find({});
    console.log(`📦 Found ${users.length} users to migrate\n`);

    if (users.length === 0) {
      console.log("No users found. Exiting.");
      process.exit(0);
    }

    const auth0Users = users.map((user) => ({
      email:          user.email,
      email_verified: true,
      name:           user.name || user.email,
      custom_password_hash: {
        algorithm: "bcrypt",
        hash: { value: user.password },
      },
      app_metadata: {
        mongo_id: user._id.toString(),
        role:     user.role || "farmer",
        phone:    user.phone || "",
        district: user.district || "",
        state:    user.state || "",
      },
    }));

    console.log("📤 Starting Auth0 bulk import...\n");

    const FormData = require("form-data");
    const form = new FormData();
    form.append("users", Buffer.from(JSON.stringify(auth0Users)), {
      filename: "users.json",
      contentType: "application/json",
    });
    form.append("connection_id", CONNECTION_ID);
    form.append("upsert", "true");
    form.append("send_completion_email", "false");

    const response = await axios.post(
      `https://${AUTH0_DOMAIN}/api/v2/jobs/users-imports`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Migration job started!");
    console.log("Job ID:", response.data.id);
    console.log("Status:", response.data.status);

    await pollJobStatus(response.data.id, token);

  } catch (err) {
    console.error("❌ Migration failed:", err.response?.data || err.message);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 MongoDB disconnected");
  }
};

migrate();

