import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { QrCode, MapPin, Scale, Trash2, Camera, Navigation, AlertCircle, CheckCircle, List, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import QrScanner from 'qr-scanner';

const AddWaste: React.FC = () => {
  const [step, setStep] = useState<'location' | 'binSelection' | 'scanner' | 'details' | 'success'>('location');
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [smartBinAvailable, setSmartBinAvailable] = useState(false);
  const [selectedBin, setSelectedBin] = useState<string>('');
  const [scannedBinId, setScannedBinId] = useState<string>('');
  const [availableBins, setAvailableBins] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any>(null);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [availableAreas, setAvailableAreas] = useState<any>({});
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [wasteData, setWasteData] = useState({
    weight: '',
    type: '',
    description: ''
  });
  const { user, updateProfile } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  const wasteTypes = [
    { id: 'plastic', name: 'Plastic', icon: '♻️', points: 10 },
    { id: 'organic', name: 'Organic', icon: '🍃', points: 8 },
    { id: 'paper', name: 'Paper', icon: '📄', points: 6 },
    { id: 'e-waste', name: 'E-Waste', icon: '📱', points: 50 },
    { id: 'glass', name: 'Glass', icon: '🥛', points: 12 },
    { id: 'metal', name: 'Metal', icon: '🔩', points: 15 }
  ];

  const availableSmartBins = [
    { id: 'CP-001', name: 'Connaught Place Central', distance: '0.3 km', status: 'available', fillLevel: 25 },
    { id: 'CP-002', name: 'India Gate Main', distance: '1.2 km', status: 'available', fillLevel: 60 },
    { id: 'CP-003', name: 'Red Fort Entry', distance: '2.1 km', status: 'available', fillLevel: 15 },
    { id: 'CP-004', name: 'Khan Market Center', distance: '3.4 km', status: 'available', fillLevel: 45 },
    { id: 'CP-005', name: 'Chandni Chowk Metro', distance: '4.2 km', status: 'available', fillLevel: 80 }
  ];

  const smartBinLocations = [
    { lat: 28.6315, lng: 77.2167, address: 'Connaught Place Central' },
    { lat: 28.6129, lng: 77.2295, address: 'India Gate' },
    { lat: 28.6562, lng: 77.2410, address: 'Red Fort' }
  ];

  const getSimpleBinsForArea = (area: string) => {
    // Just create simple numbered bins for the selected area
    const simpleBins = [
      { 
        binId: 'BIN001', 
        location: { area: area }, 
        status: 'active', 
        type: 'general'
      },
      { 
        binId: 'BIN002', 
        location: { area: area }, 
        status: 'active', 
        type: 'recyclable'
      },
      { 
        binId: 'BIN003', 
        location: { area: area }, 
        status: 'active', 
        type: 'organic'
      },
      { 
        binId: 'BIN004', 
        location: { area: area }, 
        status: 'active', 
        type: 'general'
      },
      { 
        binId: 'BIN005', 
        location: { area: area }, 
        status: 'active', 
        type: 'recyclable'
      }
    ];
    
    return simpleBins;
  };

  const handleLocationSelection = (district: string, area: string) => {
    const displayAddress = `${area}, ${district}`;
    setSelectedDistrict(district);
    setSelectedArea(area);
    
    if (location) {
      setLocation({
        ...location,
        address: displayAddress
      });
    }
    
    // Get simple bins for the selected area
    const simpleBins = getSimpleBinsForArea(area);
    setAvailableBins(simpleBins);
    setSmartBinAvailable(true);
    
    setShowLocationSelector(false);
    console.log('✅ User selected location:', displayAddress);
    console.log('🗑️ Simple bins created for area:', simpleBins.length);
  };

  const getCurrentLocation = () => {
    setLocationLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log('📍 GPS Location:', { latitude, longitude, accuracy: `${accuracy}m` });
          
          try {
            // Call backend API directly for accurate location detection
            console.log('🎯 Getting accurate location from backend for coordinates:', latitude, longitude);
            console.log('🔍 GPS Accuracy:', accuracy + 'm');
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const response = await fetch(
              `${API_BASE_URL}/api/location/info?latitude=${latitude}&longitude=${longitude}`
            );
            
            console.log('API Response status:', response.status);
            
            if (response.ok) {
              const data = await response.json();
              console.log('🌍 Full API Response:', data);
              console.log('🔍 Location Detection Debug:', {
                success: data.success,
                isInDelhi: data.isInDelhi,
                isInRecognizedArea: data.isInRecognizedArea,
                currentLocation: data.currentLocation,
                coordinates: `${latitude}, ${longitude}`,
                localBinCount: data.localBinCount,
                nearbyBinCount: data.nearbyBinCount,
                allNearbyBins: data.allNearbyBins?.length,
                message: data.message
              });
              
              if (data.success) {
                // Store location data for later use
                setLocationData(data);
                
                // Show all available nearby bins
                const allBins = data.allNearbyBins || [];
                setAvailableBins(allBins);
                setSmartBinAvailable(true); // Always show bins as available
                
                // Show location selector
                if (data.locationData && data.locationData.requiresUserSelection) {
                  console.log('📍 Available areas:', data.locationData.availableAreas);
                  
                  // Set up location selector
                  setAvailableAreas(data.locationData.availableAreas);
                  setShowLocationSelector(true);
                  
                  // Set temporary location with placeholder
                  setLocation({ 
                    lat: latitude, 
                    lng: longitude, 
                    address: 'Please select your area from the list below'
                  });
                } else {
                  // Fallback
                  setLocation({ 
                    lat: latitude, 
                    lng: longitude, 
                    address: 'Delhi NCR Area'
                  });
                  console.log('⚠️ Using fallback location');
                }
                
                console.log('📍 Location setup completed');
                console.log('🗑️ Available bins:', allBins.length);
                
              } else {
                // API call failed or outside service area
                console.log('⚠️ Outside service area or API failed');
                
                setLocation({ 
                  lat: latitude, 
                  lng: longitude, 
                  address: actualAddress
                });
                setLocationData(null);
                setAvailableBins([]);
                setSmartBinAvailable(false);
                
                console.log('📍 Using fallback address:', actualAddress);
              }
            } else {
              throw new Error(`API call failed with status: ${response.status}`);
            }
          } catch (error) {
            console.error('Error calling location API:', error);
            // Fallback to coordinate-based location
            setLocation({ 
              lat: latitude, 
              lng: longitude, 
              address: `GPS Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` 
            });
            setSmartBinAvailable(false);
          }
          
          setLocationLoading(false);
        },
        (error) => {
          console.error('Error getting GPS location:', error);
          
          // Show error message based on error type
          let errorMessage = 'Unable to get your location';
          if (error.code === 1) {
            errorMessage = 'Location access denied. Please enable location permissions.';
          } else if (error.code === 2) {
            errorMessage = 'Location unavailable. Please check your GPS.';
          } else if (error.code === 3) {
            errorMessage = 'Location request timed out. Please try again.';
          }
          
          setLocation({ 
            lat: 0, 
            lng: 0, 
            address: errorMessage 
          });
          setSmartBinAvailable(false);
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000
        }
      );
    } else {
      // Geolocation not supported
      setLocation({ 
        lat: 0, 
        lng: 0, 
        address: 'Geolocation is not supported by this browser' 
      });
      setSmartBinAvailable(false);
      setLocationLoading(false);
    }
  };

  const startQRScanning = async () => {
    // Prevent multiple simultaneous calls
    if (isScanning || qrScannerRef.current) {
      console.log('Scanner already running');
      return;
    }
    
    setIsScanning(true);
    setScanError('');
    
    try {
      if (videoRef.current) {
        // Optimized QR Scanner initialization
        qrScannerRef.current = new QrScanner(
          videoRef.current,
          (result) => {
            // Immediate processing to avoid delays
            const binId = result.data;
            console.log('QR Code detected:', binId);
            
            // Quick bin matching
            const matchedBin = availableBins.find(bin => 
              binId === bin.binId || binId === bin._id || binId.includes(bin.binId)
            );
            
            // Set results immediately
            const finalBinId = matchedBin ? (matchedBin.binId || matchedBin._id) : binId;
            setScannedBinId(finalBinId);
            setSelectedBin(finalBinId);
            
            // Stop scanner and proceed
            stopQRScanning();
            setStep('details');
          },
          {
            onDecodeError: () => {
              // Silent error handling for better performance
            },
            highlightScanRegion: false, // Disable for better performance
            highlightCodeOutline: false, // Disable for better performance
            maxScansPerSecond: 5, // Limit scan rate for better performance
          }
        );
        
        // Start scanner with error handling
        await qrScannerRef.current.start();
        console.log('QR Scanner started successfully');
      }
    } catch (error: any) {
      console.error('Error starting QR scanner:', error);
      setScanError(error.message || 'Failed to start camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopQRScanning = () => {
    try {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
        console.log('QR Scanner stopped');
      }
    } catch (error) {
      console.log('Error stopping scanner:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const simulateQRScan = () => {
    // Quick fallback simulation
    const binId = selectedBin || availableBins[0]?.binId || 'BIN001';
    setScannedBinId(binId);
    setStep('details');
  };

  // Debounced scanner start to prevent multiple rapid clicks
  const debouncedStartScanning = React.useCallback(() => {
    if (!isScanning) {
      startQRScanning();
    }
  }, [isScanning]);

  // Cleanup QR scanner on component unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  const handleSubmitWaste = async () => {
    if (wasteData.weight && wasteData.type && location) {
      setSubmitting(true);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        const userInfo = userData ? JSON.parse(userData) : null;
        
        console.log('🔐 Simple Auth Debug:', {
          hasUser: !!user,
          hasUserData: !!userData,
          userFromContext: user?.name || 'No user in context',
          userFromStorage: userInfo?.name || 'No user in storage'
        });
        
        // Prepare simple waste entry data (no complex authentication needed)
        const simpleWasteData = {
          userName: userInfo?.name || user?.name || 'Anonymous User',
          userEmail: userInfo?.email || user?.email || null,
          wasteType: wasteData.type,
          weight: parseFloat(wasteData.weight),
          description: wasteData.description || `${wasteData.type} waste entry`,
          userLocation: {
            latitude: location.lat,
            longitude: location.lng,
            address: location.address
          },
          sessionId: userInfo?.id || Date.now().toString()
        };

        console.log('📝 Submitting simple waste entry:', simpleWasteData);

        // Submit to simple waste system (no authentication required)
        const response = await fetch(`${API_BASE_URL}/api/simple-waste/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(simpleWasteData)
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Simple waste entry submitted successfully:', result);
          console.log('🎯 Points earned:', result.data?.pointsEarned);
          console.log('🆔 Entry ID:', result.data?.entryId);
          console.log('💾 Database saved:', result.success);
          console.log('📍 Location detected:', result.data?.location?.detected);
          
          // Update local user profile with actual points from backend
          if (user && result.data?.pointsEarned) {
            const updatedUser = {
              ...user,
              totalWaste: (user.totalWaste || 0) + parseFloat(wasteData.weight),
              rewardPoints: (user.rewardPoints || 0) + result.data.pointsEarned
            };
            
            updateProfile(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            console.log('✅ User profile updated with new stats');
          }
          
          // Update user stats in localStorage if returned
          if (result.user) {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = {
              ...currentUser,
              totalWaste: result.user.totalWeight,
              rewardPoints: result.user.totalPoints,
              totalEntries: result.user.totalEntries
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          
          alert(`🎉 Success! Entry saved with ${result.data?.pointsEarned || 0} points earned!\nLocation: ${result.data?.location?.detected || 'Unknown'}`);
          setStep('success');
        } else {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = { message: 'Server returned invalid response' };
          }
          
          console.error('❌ Failed to submit simple waste entry:', {
            status: response.status,
            statusText: response.statusText,
            url: `${API_BASE_URL}/api/simple-waste/add`,
            error: errorData,
            requestData: simpleWasteData
          });
          
          if (response.status === 404) {
            alert('Simple waste API endpoint not found. Please check if backend is running on port 5000.');
          } else if (response.status === 500) {
            alert('Server error. Please try again later.');
          } else {
            alert(`Failed to submit entry: ${errorData.message || `HTTP ${response.status}`}`);
          }
        }
      } catch (error) {
        console.error('Error submitting simple waste entry:', error);
        alert('Failed to submit waste entry. Please check your connection and try again.');
      } finally {
        setSubmitting(false);
      }
    } else {
      alert('Please fill in all required fields and ensure location is detected.');
    }
  };

  const resetForm = () => {
    setStep('location');
    setLocation(null);
    setSmartBinAvailable(false);
    setSelectedBin('');
    setScannedBinId('');
    setWasteData({ weight: '', type: '', description: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Add Your Waste
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Contribute to a cleaner Delhi and earn rewards
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-6 sm:mb-8 overflow-x-auto">
          <div className="flex items-center space-x-2 sm:space-x-4 min-w-max px-4">
            {['location', 'binSelection', 'scanner', 'details', 'success'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                  step === stepName 
                    ? 'bg-green-500 text-white' 
                    : index < ['location', 'binSelection', 'scanner', 'details', 'success'].indexOf(step)
                    ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200'
                    : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {index + 1}
                </div>
                {index < 4 && (
                  <div className={`w-6 sm:w-12 h-0.5 mx-1 sm:mx-2 ${
                    index < ['location', 'binSelection', 'scanner', 'details', 'success'].indexOf(step)
                      ? 'bg-green-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg"
        >
          {/* Location Step */}
          {step === 'location' && (
            <div className="text-center">
              <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Get Your Location
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
                We need your location to find nearby smart bins
              </p>

              {location ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 sm:mb-8"
                >
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 sm:p-6">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Navigation className="w-5 h-5 text-green-500" />
                      <span className="text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                        Current Location
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      {location.address}
                    </p>
                  </div>

                  {/* Always show positive message when location is detected */}
                  {!showLocationSelector && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-4 sm:mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm sm:text-base font-medium text-green-800 dark:text-green-300">
                          Location Confirmed!
                        </span>
                      </div>
                      <p className="text-green-700 dark:text-green-400 text-xs sm:text-sm">
                        {selectedArea 
                          ? `You're in ${selectedArea}. Smart bins and manual entry options are available.`
                          : "Location detected. You can proceed with bin selection or manual entry."
                        }
                      </p>
                    </motion.div>
                  )}

                  {/* Location Selector */}
                  {showLocationSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 sm:mt-6 p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                    >
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <span className="text-sm sm:text-base font-medium text-blue-800 dark:text-blue-300">
                          Select Your Area
                        </span>
                      </div>
                      <p className="text-blue-700 dark:text-blue-400 text-xs sm:text-sm mb-4 text-center">
                        Choose your area from the list below for accurate bin recommendations
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                        {Object.entries(availableAreas).map(([district, areas]) => (
                          <div key={district} className="space-y-2">
                            <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600 pb-1">
                              {district}
                            </h4>
                            <div className="space-y-1">
                              {(areas as string[]).map((area) => (
                                <button
                                  key={area}
                                  onClick={() => handleLocationSelection(district, area)}
                                  className="w-full text-left px-3 py-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded-lg transition-colors duration-200 border border-transparent hover:border-blue-300 dark:hover:border-blue-600"
                                >
                                  {area}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setShowLocationSelector(false)}
                        className="mt-4 w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        Use GPS Coordinates Instead
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {locationLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Getting Location...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-5 h-5" />
                      <span>Get My Location</span>
                    </div>
                  )}
                </motion.button>
              )}

              {location && !showLocationSelector && (
                <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-6">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep('binSelection')}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Select Smart Bin
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedBin('MANUAL_ENTRY');
                      setStep('details');
                    }}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Manual Entry
                  </motion.button>
                </div>
              )}
            </div>
          )}

          {/* Bin Selection Step */}
          {step === 'binSelection' && (
            <div>
              <div className="text-center mb-6 sm:mb-8">
                <List className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mx-auto mb-4 sm:mb-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Select Smart Bin
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Choose a smart bin ({availableBins.length} available)
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
                {availableBins.map((bin, index) => (
                  <motion.div
                    key={bin.binId || bin._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedBin(bin.binId || bin._id)}
                    className={`p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedBin === (bin.binId || bin._id)
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                          bin.type === 'organic' ? 'bg-green-500' :
                          bin.type === 'recyclable' ? 'bg-blue-500' :
                          bin.type === 'hazardous' ? 'bg-red-500' : 'bg-gray-500'
                        }`}>
                          <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                            {bin.binId}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            {bin.location?.area} - {bin.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          bin.status === 'active' ? 'bg-green-100 text-green-800' :
                          bin.status === 'full' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {bin.status}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {selectedBin && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep('scanner')}
                  className="w-full mt-6 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Proceed to Scanner
                </motion.button>
              )}
            </div>
          )}

          {/* Scanner Step */}
          {step === 'scanner' && (
            <div className="text-center">
              <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Scan Smart Bin QR Code
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
                Point your camera at the QR code on the smart bin
              </p>

              {/* Camera View */}
              <div className="relative w-full max-w-sm mx-auto mb-6 sm:mb-8">
                {isScanning ? (
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full h-64 sm:h-80 bg-black rounded-2xl object-cover"
                      playsInline
                      muted
                    />
                    
                    {/* Scanning overlay */}
                    <div className="absolute inset-4 border-2 border-green-500 rounded-xl">
                      <div className="absolute inset-0 border border-green-300 rounded-xl opacity-50">
                        {/* Corner indicators */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-green-500"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-green-500"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-green-500"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-green-500"></div>
                      </div>
                      
                      {/* Scanning line animation */}
                      <motion.div
                        animate={{ y: [-120, 120, -120] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute w-full h-0.5 bg-green-500 opacity-70"
                      />
                    </div>
                    
                    {/* Stop scanning button */}
                    <button
                      onClick={stopQRScanning}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-64 sm:h-80 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Camera will appear here
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error message */}
              {scanError && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 mb-4"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 mx-auto mb-2" />
                  <p className="text-red-800 dark:text-red-300 text-sm">
                    {scanError}
                  </p>
                </motion.div>
              )}

              {/* Success message */}
              {scannedBinId && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 mb-4 sm:mb-6"
                >
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm sm:text-base font-medium text-green-800 dark:text-green-300">
                    Bin Scanned Successfully!
                  </p>
                  <p className="text-green-700 dark:text-green-400 text-xs sm:text-sm">
                    Bin ID: {scannedBinId}
                  </p>
                </motion.div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {!isScanning && !scannedBinId && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={debouncedStartScanning}
                    disabled={isScanning}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Camera className="w-5 h-5" />
                      <span>Start Camera Scanner</span>
                    </div>
                  </motion.button>
                )}
                
                {!isScanning && !scannedBinId && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={simulateQRScan}
                    className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm sm:text-base font-semibold rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <QrCode className="w-5 h-5" />
                      <span>Skip Scanner (Demo)</span>
                    </div>
                  </motion.button>
                )}

                {isScanning && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Point your camera at the QR code on the bin
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Details Step */}
          {step === 'details' && (
            <div>
              <div className="text-center mb-8">
                <Scale className="w-12 h-12 sm:w-16 sm:h-16 text-purple-500 mx-auto mb-4 sm:mb-6" />
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Enter Waste Details
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  Provide information about the waste you're disposing
                </p>
              </div>

              <div className="space-y-6">
                {/* Waste Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Waste Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {wasteTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setWasteData({ ...wasteData, type: type.id })}
                        className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                          wasteData.type === type.id
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className="text-lg sm:text-2xl mb-1 sm:mb-2">{type.icon}</div>
                        <div className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                          {type.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {type.points} pts/kg
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Enter weight in kg"
                    value={wasteData.weight}
                    onChange={(e) => setWasteData({ ...wasteData, weight: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Additional details about the waste..."
                    value={wasteData.description}
                    onChange={(e) => setWasteData({ ...wasteData, description: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Points Preview */}
                {wasteData.weight && wasteData.type && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base font-medium text-blue-800 dark:text-blue-300">
                        Points you'll earn:
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-blue-600">
                        {Math.round((wasteTypes.find(t => t.id === wasteData.type)?.points || 0) * parseFloat(wasteData.weight || '0'))}
                      </span>
                    </div>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitWaste}
                  disabled={!wasteData.weight || !wasteData.type || submitting}
                  className="w-full py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    'Submit Waste Data'
                  )}
                </motion.button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
              >
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white" />
              </motion.div>
              
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Waste Submitted Successfully! 🎉
              </h2>
              
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
                Thank you for contributing to a cleaner Delhi. Your waste has been recorded and you've earned reward points!
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <Trash2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-sm sm:text-base font-bold text-green-800 dark:text-green-300">
                    {wasteData.weight} kg
                  </div>
                  <div className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                    Waste Added
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Scale className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm sm:text-base font-bold text-blue-800 dark:text-blue-300">
                    {wasteTypes.find(t => t.id === wasteData.type)?.name}
                  </div>
                  <div className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                    Waste Type
                  </div>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                    className="text-2xl sm:text-3xl mx-auto mb-2 w-fit"
                  >
                    🏆
                  </motion.div>
                  <div className="text-sm sm:text-base font-bold text-purple-800 dark:text-purple-300">
                    {Math.round((wasteTypes.find(t => t.id === wasteData.type)?.points || 0) * parseFloat(wasteData.weight || '0'))} pts
                  </div>
                  <div className="text-xs sm:text-sm text-purple-600 dark:text-purple-400">
                    Points Earned
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetForm}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Add More Waste
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:border-green-500 dark:hover:border-green-400 transition-all duration-300"
                >
                  Go to Dashboard
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AddWaste;