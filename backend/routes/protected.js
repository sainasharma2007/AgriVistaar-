// routes/protected.js
const checkAuth = require('../middleware/auth')

// Before: router.get('/profile', verifyToken, ...)
// After:
router.get('/profile', checkAuth, async (req, res) => {
  const auth0UserId = req.auth.payload.sub // Auth0 user ID
  const user = await User.findOne({ auth0Id: auth0UserId })
  res.json(user)
})