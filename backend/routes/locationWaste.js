import express from 'express';
import { 
  getLocationWasteStats, 
  getUserLocationHistory, 
  getWasteEntriesForLocation,
  getTopPerformingLocations,
  getLocationWasteTrends
} from '../controllers/locationWasteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/stats', getLocationWasteStats);
router.get('/top-locations', getTopPerformingLocations);
router.get('/:locationName/entries', getWasteEntriesForLocation);
router.get('/:locationName/trends', getLocationWasteTrends);

// Protected routes
router.get('/my-history', protect, getUserLocationHistory);

export default router;