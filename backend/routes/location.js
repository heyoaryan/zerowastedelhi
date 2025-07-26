import express from 'express';
import { 
  getLocationInfo, 
  searchLocations, 
  getAllDelhiLocations, 
  getBinsForLocation 
} from '../controllers/locationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/info', getLocationInfo);
router.get('/search', searchLocations);
router.get('/delhi-locations', getAllDelhiLocations);
router.get('/:locationName/bins', getBinsForLocation);

export default router;