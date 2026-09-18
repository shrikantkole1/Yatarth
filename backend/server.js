import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import inspectionRoutes from './routes/inspectionRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yatarth_ai';

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/complaints', complaintRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'Yatarth AI — Legal Metrology Act (LMR 2011) Engine',
    dbState: mongoose.connection.readyState === 1 ? 'CONNECTED' : 'IN_MEMORY_FALLBACK',
    timestamp: new Date().toISOString(),
  });
});

// Try connecting to MongoDB asynchronously without blocking server start
mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 })
  .then(() => console.log('✅ Connected to MongoDB Database'))
  .catch((err) => console.warn(`⚠️ MongoDB Connection Skipped (${err.message}). Engine running with In-Memory Database Fallback.`));

app.listen(PORT, () => {
  console.log(`🚀 Yatarth AI Backend API Server running on http://localhost:${PORT}`);
});
