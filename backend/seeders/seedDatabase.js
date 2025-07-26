import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import WasteBin from '../models/WasteBin.js';
import WasteEntry from '../models/WasteEntry.js';
import Leaderboard from '../models/Leaderboard.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    await Leaderboard.deleteMany({});

    const users = [
      {
        name: 'Admin User',
        email: 'admin@zerowastedelhi.com',
        password: 'admin123',
        role: 'admin',
        phone: '9876543210',
        address: {
          street: '123 Green Street',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        points: 1500,
        totalWasteCollected: 75,
        level: 'Expert',
        isVerified: true
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'password123',
        phone: '9876543211',
        address: {
          street: '456 Eco Avenue',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110002'
        },
        points: 850,
        totalWasteCollected: 42,
        level: 'Advanced',
        isVerified: true
      },
      {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: 'password123',
        phone: '9876543212',
        address: {
          street: '789 Clean Colony',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110003'
        },
        points: 650,
        totalWasteCollected: 32,
        level: 'Advanced',
        isVerified: true
      },
      {
        name: 'Amit Kumar',
        email: 'amit@example.com',
        password: 'password123',
        phone: '9876543213',
        address: {
          street: '321 Sustainable Street',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110004'
        },
        points: 320,
        totalWasteCollected: 16,
        level: 'Intermediate',
        isVerified: true
      },
      {
        name: 'Sneha Gupta',
        email: 'sneha@example.com',
        password: 'password123',
        phone: '9876543214',
        address: {
          street: '654 Environment Lane',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110005'
        },
        points: 180,
        totalWasteCollected: 9,
        level: 'Intermediate',
        isVerified: true
      }
    ];

    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create leaderboard entries
    for (const user of createdUsers) {
      await Leaderboard.create({
        user: user._id,
        totalPoints: user.points,
        totalWasteCollected: user.totalWasteCollected,
        carbonFootprintSaved: user.totalWasteCollected * 1.5,
        monthlyStats: [
          {
            month: new Date(),
            points: Math.floor(user.points * 0.3),
            wasteCollected: Math.floor(user.totalWasteCollected * 0.3),
            carbonSaved: Math.floor(user.totalWasteCollected * 0.3 * 1.5)
          }
        ]
      });
    }

    console.log('✅ Created leaderboard entries');
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error.message);
  }
};

const seedWasteBins = async () => {
  try {
    await WasteBin.deleteMany({});

    const wasteBins = [
      // Connaught Place area
      {
        binId: 'BIN001',
        location: {
          address: 'Connaught Place, Block A, New Delhi',
          coordinates: { latitude: 28.6315, longitude: 77.2167 },
          area: 'Connaught Place',
          landmark: 'Near Rajiv Chowk Metro Station'
        },
        type: 'recyclable',
        capacity: { total: 100, current: 45 },
        status: 'active'
      },
      {
        binId: 'BIN002',
        location: {
          address: 'Connaught Place, Block C, New Delhi',
          coordinates: { latitude: 28.6320, longitude: 77.2180 },
          area: 'Connaught Place',
          landmark: 'Near Palika Bazaar'
        },
        type: 'organic',
        capacity: { total: 80, current: 35 },
        status: 'active'
      },
      // India Gate area
      {
        binId: 'BIN003',
        location: {
          address: 'India Gate, Rajpath, New Delhi',
          coordinates: { latitude: 28.6129, longitude: 77.2295 },
          area: 'India Gate',
          landmark: 'Main Entrance Gate'
        },
        type: 'general',
        capacity: { total: 120, current: 95 },
        status: 'full'
      },
      {
        binId: 'BIN004',
        location: {
          address: 'India Gate, Parking Area, New Delhi',
          coordinates: { latitude: 28.6140, longitude: 77.2280 },
          area: 'India Gate',
          landmark: 'Visitor Parking'
        },
        type: 'recyclable',
        capacity: { total: 90, current: 25 },
        status: 'active'
      },
      // Karol Bagh area
      {
        binId: 'BIN005',
        location: {
          address: 'Karol Bagh Market, Ajmal Khan Road, New Delhi',
          coordinates: { latitude: 28.6519, longitude: 77.1909 },
          area: 'Karol Bagh',
          landmark: 'Main Market Entrance'
        },
        type: 'organic',
        capacity: { total: 110, current: 88 },
        status: 'full'
      },
      {
        binId: 'BIN006',
        location: {
          address: 'Karol Bagh Metro Station, New Delhi',
          coordinates: { latitude: 28.6530, longitude: 77.1920 },
          area: 'Karol Bagh',
          landmark: 'Metro Station Exit 2'
        },
        type: 'general',
        capacity: { total: 100, current: 40 },
        status: 'active'
      },
      // Lajpat Nagar area
      {
        binId: 'BIN007',
        location: {
          address: 'Lajpat Nagar Central Market, New Delhi',
          coordinates: { latitude: 28.5677, longitude: 77.2436 },
          area: 'Lajpat Nagar',
          landmark: 'Central Market Main Gate'
        },
        type: 'recyclable',
        capacity: { total: 85, current: 60 },
        status: 'active'
      },
      {
        binId: 'BIN008',
        location: {
          address: 'Lajpat Nagar Metro Station, New Delhi',
          coordinates: { latitude: 28.5690, longitude: 77.2450 },
          area: 'Lajpat Nagar',
          landmark: 'Metro Station Platform'
        },
        type: 'hazardous',
        capacity: { total: 50, current: 15 },
        status: 'active'
      },
      // Chandni Chowk area
      {
        binId: 'BIN009',
        location: {
          address: 'Chandni Chowk Main Road, New Delhi',
          coordinates: { latitude: 28.6506, longitude: 77.2334 },
          area: 'Chandni Chowk',
          landmark: 'Near Red Fort Gate'
        },
        type: 'general',
        capacity: { total: 130, current: 110 },
        status: 'full'
      },
      {
        binId: 'BIN010',
        location: {
          address: 'Chandni Chowk Metro Station, New Delhi',
          coordinates: { latitude: 28.6520, longitude: 77.2320 },
          area: 'Chandni Chowk',
          landmark: 'Metro Station Exit'
        },
        type: 'organic',
        capacity: { total: 95, current: 30 },
        status: 'active'
      },
      // Saket area
      {
        binId: 'BIN011',
        location: {
          address: 'Select City Walk Mall, Saket, New Delhi',
          coordinates: { latitude: 28.5245, longitude: 77.2066 },
          area: 'Saket',
          landmark: 'Mall Main Entrance'
        },
        type: 'recyclable',
        capacity: { total: 120, current: 45 },
        status: 'active'
      },
      {
        binId: 'BIN012',
        location: {
          address: 'Saket Metro Station, New Delhi',
          coordinates: { latitude: 28.5200, longitude: 77.2080 },
          area: 'Saket',
          landmark: 'Metro Station Gate 1'
        },
        type: 'organic',
        capacity: { total: 100, current: 25 },
        status: 'active'
      },
      // Khan Market area
      {
        binId: 'BIN013',
        location: {
          address: 'Khan Market, New Delhi',
          coordinates: { latitude: 28.5983, longitude: 77.2319 },
          area: 'Khan Market',
          landmark: 'Main Shopping Area'
        },
        type: 'general',
        capacity: { total: 80, current: 65 },
        status: 'active'
      },
      // Nehru Place area
      {
        binId: 'BIN014',
        location: {
          address: 'Nehru Place IT Market, New Delhi',
          coordinates: { latitude: 28.5494, longitude: 77.2519 },
          area: 'Nehru Place',
          landmark: 'IT Market Entrance'
        },
        type: 'hazardous',
        capacity: { total: 60, current: 20 },
        status: 'active'
      },
      {
        binId: 'BIN015',
        location: {
          address: 'Nehru Place Metro Station, New Delhi',
          coordinates: { latitude: 28.5480, longitude: 77.2530 },
          area: 'Nehru Place',
          landmark: 'Metro Station Exit'
        },
        type: 'recyclable',
        capacity: { total: 90, current: 70 },
        status: 'active'
      },
      // Model Town area
      {
        binId: 'BIN016',
        location: {
          address: 'Model Town Metro Station, New Delhi',
          coordinates: { latitude: 28.7041, longitude: 77.2025 },
          area: 'Model Town',
          landmark: 'Metro Station Gate'
        },
        type: 'organic',
        capacity: { total: 85, current: 40 },
        status: 'active'
      },
      {
        binId: 'BIN017',
        location: {
          address: 'Model Town Shopping Complex, New Delhi',
          coordinates: { latitude: 28.7050, longitude: 77.2010 },
          area: 'Model Town',
          landmark: 'Main Shopping Area'
        },
        type: 'general',
        capacity: { total: 100, current: 75 },
        status: 'active'
      },
      // Burari area
      {
        binId: 'BIN018',
        location: {
          address: 'Burari Crossing, New Delhi',
          coordinates: { latitude: 28.7594, longitude: 77.2022 },
          area: 'Burari',
          landmark: 'Main Crossing'
        },
        type: 'general',
        capacity: { total: 80, current: 35 },
        status: 'active'
      },
      // Sant Nagar area
      {
        binId: 'BIN019',
        location: {
          address: 'Sant Nagar Market, New Delhi',
          coordinates: { latitude: 28.7520, longitude: 77.1980 },
          area: 'Sant Nagar',
          landmark: 'Local Market'
        },
        type: 'organic',
        capacity: { total: 70, current: 50 },
        status: 'active'
      },
      // Swaroop Nagar area
      {
        binId: 'BIN020',
        location: {
          address: 'Swaroop Nagar Metro Station, New Delhi',
          coordinates: { latitude: 28.6833, longitude: 77.2667 },
          area: 'Swaroop Nagar',
          landmark: 'Metro Station'
        },
        type: 'recyclable',
        capacity: { total: 95, current: 60 },
        status: 'active'
      },
      {
        binId: 'BIN021',
        location: {
          address: 'Swaroop Nagar Main Market, New Delhi',
          coordinates: { latitude: 28.6840, longitude: 77.2650 },
          area: 'Swaroop Nagar',
          landmark: 'Main Market'
        },
        type: 'general',
        capacity: { total: 110, current: 85 },
        status: 'active'
      },
      // Ghaziabad area
      {
        binId: 'BIN022',
        location: {
          address: 'Ghaziabad Railway Station, Ghaziabad',
          coordinates: { latitude: 28.6692, longitude: 77.4538 },
          area: 'Ghaziabad',
          landmark: 'Railway Station'
        },
        type: 'general',
        capacity: { total: 120, current: 90 },
        status: 'active'
      },
      {
        binId: 'BIN023',
        location: {
          address: 'Raj Nagar Extension, Ghaziabad',
          coordinates: { latitude: 28.6667, longitude: 77.4167 },
          area: 'Raj Nagar Ghaziabad',
          landmark: 'Shopping Complex'
        },
        type: 'organic',
        capacity: { total: 100, current: 45 },
        status: 'active'
      },
      {
        binId: 'BIN024',
        location: {
          address: 'Vaishali Metro Station, Ghaziabad',
          coordinates: { latitude: 28.6507, longitude: 77.3450 },
          area: 'Vaishali Ghaziabad',
          landmark: 'Metro Station'
        },
        type: 'recyclable',
        capacity: { total: 85, current: 30 },
        status: 'active'
      },
      // Narela area
      {
        binId: 'BIN025',
        location: {
          address: 'Narela Industrial Area, New Delhi',
          coordinates: { latitude: 28.8553, longitude: 77.0892 },
          area: 'Narela',
          landmark: 'Industrial Area Gate'
        },
        type: 'hazardous',
        capacity: { total: 150, current: 80 },
        status: 'active'
      },
      {
        binId: 'BIN026',
        location: {
          address: 'Narela Metro Station, New Delhi',
          coordinates: { latitude: 28.8540, longitude: 77.0900 },
          area: 'Narela',
          landmark: 'Metro Station'
        },
        type: 'general',
        capacity: { total: 100, current: 55 },
        status: 'active'
      },
      // Rohini additional bins
      {
        binId: 'BIN027',
        location: {
          address: 'Rohini Sector 7 Metro, New Delhi',
          coordinates: { latitude: 28.7050, longitude: 77.1040 },
          area: 'Rohini',
          landmark: 'Sector 7 Metro'
        },
        type: 'organic',
        capacity: { total: 90, current: 65 },
        status: 'active'
      },
      // Pitampura additional
      {
        binId: 'BIN028',
        location: {
          address: 'Pitampura TV Tower, New Delhi',
          coordinates: { latitude: 28.6950, longitude: 77.1320 },
          area: 'Pitampura',
          landmark: 'TV Tower'
        },
        type: 'general',
        capacity: { total: 105, current: 80 },
        status: 'active'
      },
      // Dwarka additional
      {
        binId: 'BIN029',
        location: {
          address: 'Dwarka Sector 12 Metro, New Delhi',
          coordinates: { latitude: 28.5930, longitude: 77.0470 },
          area: 'Dwarka',
          landmark: 'Sector 12 Metro'
        },
        type: 'recyclable',
        capacity: { total: 110, current: 40 },
        status: 'active'
      },
      // Laxmi Nagar additional
      {
        binId: 'BIN030',
        location: {
          address: 'Laxmi Nagar Main Market, New Delhi',
          coordinates: { latitude: 28.6350, longitude: 77.2770 },
          area: 'Laxmi Nagar',
          landmark: 'Main Market'
        },
        type: 'organic',
        capacity: { total: 95, current: 70 },
        status: 'active'
      }
    ];

    const createdBins = await WasteBin.create(wasteBins);
    console.log(`✅ Created ${createdBins.length} waste bins`);
    return createdBins;
  } catch (error) {
    console.error('Error seeding waste bins:', error.message);
  }
};

const seedWasteEntries = async (users, bins) => {
  try {
    await WasteEntry.deleteMany({});

    const wasteEntries = [];
    const wasteTypes = ['organic', 'recyclable', 'hazardous', 'general'];

    // Create sample waste entries for each user
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const numEntries = Math.floor(Math.random() * 5) + 3; // 3-7 entries per user

      for (let j = 0; j < numEntries; j++) {
        const randomBin = bins[Math.floor(Math.random() * bins.length)];
        const randomType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
        const weight = Math.random() * 5 + 0.5; // 0.5 to 5.5 kg

        wasteEntries.push({
          user: user._id,
          bin: randomBin._id,
          wasteType: randomType,
          weight: parseFloat(weight.toFixed(2)),
          description: `${randomType} waste disposal`,
          location: {
            coordinates: {
              latitude: randomBin.location.coordinates.latitude + (Math.random() - 0.5) * 0.01,
              longitude: randomBin.location.coordinates.longitude + (Math.random() - 0.5) * 0.01
            },
            address: randomBin.location.address
          },
          status: Math.random() > 0.1 ? 'verified' : 'pending', // 90% verified
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last 30 days
        });
      }
    }

    const createdEntries = await WasteEntry.create(wasteEntries);
    console.log(`✅ Created ${createdEntries.length} waste entries`);
    return createdEntries;
  } catch (error) {
    console.error('Error seeding waste entries:', error.message);
  }
};

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    
    const users = await seedUsers();
    const bins = await seedWasteBins();
    const entries = await seedWasteEntries(users, bins);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Users: ${users?.length || 0}`);
    console.log(`   - Waste Bins: ${bins?.length || 0}`);
    console.log(`   - Waste Entries: ${entries?.length || 0}`);
    console.log('');
    console.log('🔐 Test Login Credentials:');
    console.log('   Admin: admin@zerowastedelhi.com / admin123');
    console.log('   User: rahul@example.com / password123');
    console.log('');
    console.log('💡 You can now see the data in MongoDB Compass!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();