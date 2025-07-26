import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import wasteRoutes from './routes/waste.js';
import binRoutes from './routes/bins.js';
import leaderboardRoutes from './routes/leaderboard.js';
import locationRoutes from './routes/location.js';
import locationWasteRoutes from './routes/locationWaste.js';
import debugRoutes from './routes/debug.js';
import testLocationRoutes from './routes/test-location.js';
import debugLocationRoutes from './routes/debug-location.js';
import simpleWasteRoutes from './routes/simpleWaste.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // increased limit for development
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  skip: (req) => {
    // Skip rate limiting for health check and development
    return req.path === '/api/health' || process.env.NODE_ENV === 'development';
  }
});

app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/bins', binRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/location-waste', locationWasteRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/test-location', testLocationRoutes);
app.use('/api/debug-location', debugLocationRoutes);
app.use('/api/simple-waste', simpleWasteRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Zero Waste Delhi API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Zero Waste Delhi API Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});