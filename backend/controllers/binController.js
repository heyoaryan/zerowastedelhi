import WasteBin from '../models/WasteBin.js';

// Get All Bins
export const getAllBins = async (req, res) => {
  try {
    const { type, status, area } = req.query;
    
    let filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (area) filter['location.area'] = new RegExp(area, 'i');

    const bins = await WasteBin.find(filter)
      .populate('assignedCollector', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bins.length,
      bins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bins',
      error: error.message
    });
  }
};

// Get Nearby Bins
export const getNearbyBins = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const bins = await WasteBin.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      },
      status: { $ne: 'inactive' }
    });

    res.status(200).json({
      success: true,
      count: bins.length,
      bins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching nearby bins',
      error: error.message
    });
  }
};

// Get Bin by ID
export const getBinById = async (req, res) => {
  try {
    const bin = await WasteBin.findOne({ binId: req.params.binId })
      .populate('assignedCollector', 'name email phone');

    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    res.status(200).json({
      success: true,
      bin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bin',
      error: error.message
    });
  }
};

// Create New Bin (Admin only)
export const createBin = async (req, res) => {
  try {
    const bin = await WasteBin.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Bin created successfully',
      bin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating bin',
      error: error.message
    });
  }
};

// Update Bin Status
export const updateBinStatus = async (req, res) => {
  try {
    const { status, capacity } = req.body;
    
    const bin = await WasteBin.findOne({ binId: req.params.binId });
    if (!bin) {
      return res.status(404).json({
        success: false,
        message: 'Bin not found'
      });
    }

    if (status) bin.status = status;
    if (capacity) bin.capacity.current = capacity;
    
    bin.updateStatus();
    await bin.save();

    res.status(200).json({
      success: true,
      message: 'Bin updated successfully',
      bin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating bin',
      error: error.message
    });
  }
};