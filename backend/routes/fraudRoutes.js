const express = require('express');
const router = express.Router();
const { detectFraud, getFraudStatus } = require('../controllers/fraudController');
const { auth } = require('../middleware/auth'); // ← protect → auth

// POST /api/ai/detect-fraud
router.post('/detect-fraud', auth, detectFraud); // ← protect → auth

// GET /api/ai/fraud-status/:droneJobId
router.get('/fraud-status/:droneJobId', auth, getFraudStatus); // ← protect → auth

module.exports = router;
