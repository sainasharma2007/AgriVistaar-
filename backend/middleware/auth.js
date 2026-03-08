const jwksRsa = require("jwks-rsa");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = [
  (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = header.split(" ")[1];

    const client = jwksRsa({
      jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
    });

    const getKey = (header, callback) => {
      client.getSigningKey(header.kid, (err, key) => {
        if (err) return callback(err);
        callback(null, key.getPublicKey());
      });
    };

    jwt.verify(
      token,
      getKey,
      {
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) {
          console.error("JWT verify error:", err.message);
          return res.status(401).json({ message: "Invalid token" });
        }
        req.auth = { payload: decoded };
        next();
      }
    );
  },

  async (req, res, next) => {
    try {
      const auth0Id = req.auth.payload.sub;
      const email = req.auth.payload.email || "";

      // 1. Try find by auth0Id first
      let user = await User.findOne({ auth0Id });

      // 2. If not found, try find by email and link auth0Id
      if (!user && email) {
        user = await User.findOneAndUpdate(
          { email },
          { $set: { auth0Id } },
          { new: true }
        );
      }

      // 3. If still not found, create new user
      if (!user) {
        user = await User.create({
          auth0Id,
          email,
          name: req.auth.payload.name || email,
          role: "farmer",
        });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("Auth middleware error:", err.message);
      return res.status(401).json({ message: "Authentication failed" });
    }
  },
];

const requireFpo = (req, res, next) => {
  if (req.user.role !== "fpo" && req.user.role !== "admin") {
    return res.status(403).json({ message: "FPO access only" });
  }
  next();
};

module.exports = { auth, requireFpo };