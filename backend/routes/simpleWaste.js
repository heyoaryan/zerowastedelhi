import express from 'express';
import { 
  addSimpleWasteEntry, 
  getSimpleWasteEntries, 
  getSimpleUserStats,
  simpleAuth 
} from '../controllers/simpleWasteController.js';

const router = express.Router();

// Simple authentication (no complex JWT)
router.post('/auth', simpleAuth);

// Add waste entry (no authentication required)
router.post('/add', addSimpleWasteEntry);

// Get user's waste entries
router.get('/entries', getSimpleWasteEntries);

// Get user stats
router.get('/stats', getSimpleUserStats);

// Health check for simple waste system
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Simple waste system is running',
    timestamp: new Date().toISOString()
  });
});

export default router;