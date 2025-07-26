import express from 'express';
import { addWasteEntry, getUserWasteEntries, getWasteStats } from '../controllers/wasteController.js';
import { protect } from '../middleware/auth.js';
import { validateWasteEntry, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.post('/', validateWasteEntry, handleValidationErrors, addWasteEntry);
router.get('/my-entries', getUserWasteEntries);
router.get('/stats', getWasteStats);

export default router;