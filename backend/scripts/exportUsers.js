// scripts/exportUsers.js
const users = await User.find({});
const auth0Users = users.map(user => ({
  email: user.email,
  email_verified: true,
  custom_password_hash: {
    algorithm: "bcrypt",
    hash: { value: user.password } // your existing bcrypt hash
  },
  app_metadata: {
    mongo_id: user._id.toString(), // keep reference!
    role: user.role // farmer, admin, etc.
  }
}));
// Export as .json and upload via Auth0 Management API