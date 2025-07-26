import express from 'express';
import { getAllBins, getNearbyBins, getBinById, createBin, updateBinStatus } from '../controllers/binController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllBins);
router.get('/nearby', getNearbyBins);
router.get('/:binId', getBinById);

// Protected routes
router.use(protect);

// Admin only routes
router.post('/', authorize('admin'), createBin);
router.put('/:binId/status', authorize('admin'), updateBinStatus);

export default router;