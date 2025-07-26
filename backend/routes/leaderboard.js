import express from 'express';
import { getGlobalLeaderboard, getUserRank, getMonthlyLeaderboard, getLeaderboardStats } from '../controllers/leaderboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getGlobalLeaderboard);
router.get('/monthly', getMonthlyLeaderboard);
router.get('/stats', getLeaderboardStats);

// Protected routes
router.get('/my-rank', protect, getUserRank);

export default router;