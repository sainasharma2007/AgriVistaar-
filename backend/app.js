require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const mandiRoutes = require('./routes/mandiRoutes');
const authRoutes           = require('./routes/authRoutes');
const fieldRoutes          = require('./routes/fieldRoutes');
const droneJobRoutes       = require('./routes/droneJobRoutes');
const chatRoutes           = require('./routes/chatRoutes');
const fraudRoutes          = require('./routes/fraudRoutes');
const aiRoutes             = require('./routes/aiRoutes');
const droneInspectionRoutes = require('./routes/droneInspectionRoutes');

const app = express();
connectDB();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth',        authRoutes);
app.use('/api/fields',      fieldRoutes);
app.use('/api/drone-jobs',  droneJobRoutes);
app.use('/api/chat',        chatRoutes);
app.use('/api/ai',          fraudRoutes);
app.use('/api/ai',          aiRoutes);
app.use('/api/inspections', droneInspectionRoutes);
app.use('/api/mandi',       mandiRoutes);

app.get('/', (req, res) => {
  res.send('AgriVistaar API running ✅');
});

module.exports = app;