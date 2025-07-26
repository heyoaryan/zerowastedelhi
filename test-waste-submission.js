import mongoose from 'mongoose';
import WasteBin from './backend/models/WasteBin.js';
import WasteEntry from './backend/models/WasteEntry.js';

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/waste-management')
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Check existing bins
    const bins = await WasteBin.find({}).limit(10);
    console.log(`📦 Found ${bins.length} bins in database`);
    
    if (bins.length > 0) {
      console.log('Sample bin IDs:', bins.map(b => b.binId).slice(0, 5));
      console.log('Sample bin:', {
        binId: bins[0].binId,
        location: bins[0].location,
        type: bins[0].type,
        capacity: bins[0].capacity
      });
    } else {
      console.log('❌ No bins found in database - this is the problem!');
      
      // Create some test bins
      console.log('Creating test bins...');
      const testBins = [
        {
          binId: 'CP-001',
          location: {
            address: 'Connaught Place Central, New Delhi',
            coordinates: { latitude: 28.6315, longitude: 77.2167 },
            area: 'Connaught Place',
            landmark: 'Central Park'
          },
          type: 'general',
          capacity: { total: 100, current: 25 }
        },
        {
          binId: 'CP-002',
          location: {
            address: 'India Gate, New Delhi',
            coordinates: { latitude: 28.6129, longitude: 77.2295 },
            area: 'India Gate',
            landmark: 'India Gate Main'
          },
          type: 'recyclable',
          capacity: { total: 100, current: 60 }
        },
        {
          binId: 'CP-003',
          location: {
            address: 'Red Fort, New Delhi',
            coordinates: { latitude: 28.6562, longitude: 77.2410 },
            area: 'Red Fort',
            landmark: 'Red Fort Entry'
          },
          type: 'organic',
          capacity: { total: 100, current: 15 }
        }
      ];
      
      for (const binData of testBins) {
        try {
          const bin = new WasteBin(binData);
          await bin.save();
          console.log(`✅ Created bin: ${bin.binId}`);
        } catch (error) {
          console.log(`❌ Failed to create bin ${binData.binId}:`, error.message);
        }
      }
    }
    
    // Check existing waste entries
    const entries = await WasteEntry.find({}).limit(5);
    console.log(`📝 Found ${entries.length} waste entries in database`);
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });