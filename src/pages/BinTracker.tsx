import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Trash2, Clock, CheckCircle, AlertCircle, Navigation, Loader, RefreshCw, MapPinIcon } from 'lucide-react';

interface Bin {
  _id: string;
  binId: string;
  location: {
    area: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  status: string;
  capacity: {
    total: number;
    current: number;
  };
  type: string; // Single type, not array
  lastEmptied: string;
  distanceFromUser?: number;
}

interface LocationInfo {
  success: boolean;
  isInDelhi: boolean;
  isInRecognizedArea: boolean;
  userCoordinates: {
    latitude: number;
    longitude: number;
  };
  currentLocation?: {
    name: string;
    area: string;
  };
  allNearbyBins: Bin[];
  message: string;
  hasBinsInArea: boolean;
}

const BinTracker: React.FC = () => {
  const [selectedBin, setSelectedBin] = useState<string | null>(null);
  const [bins, setBins] = useState<Bin[]>([]);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const fetchLocationInfo = async (latitude: number, longitude: number) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(
        `${API_BASE_URL}/api/location/info?latitude=${latitude}&longitude=${longitude}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location info');
      }
      
      const data: LocationInfo = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching location info:', error);
      throw error;
    }
  };

  const loadBinsData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check location permission
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setLocationPermission(permission.state);
      }

      // Get current location
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;

      // Fetch location info and nearby bins
      const locationData = await fetchLocationInfo(latitude, longitude);
      
      if (locationData.success) {
        setLocationInfo(locationData);
        setBins(locationData.allNearbyBins || []);
      } else {
        setError(locationData.message || 'Failed to get location information');
      }
    } catch (error: any) {
      console.error('Error loading bins data:', error);
      
      if (error.code === 1) {
        setError('Location access denied. Please enable location services and refresh the page.');
        setLocationPermission('denied');
      } else if (error.code === 2) {
        setError('Unable to determine your location. Please check your GPS settings.');
      } else if (error.code === 3) {
        setError('Location request timed out. Please try again.');
      } else {
        setError('Failed to load nearby bins. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBinsData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'available': 
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'full': 
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
      case 'maintenance':
      case 'inactive': 
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      default: 
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'available': 
        return CheckCircle;
      case 'full': 
        return AlertCircle;
      case 'maintenance':
      case 'inactive': 
        return Clock;
      default: 
        return Trash2;
    }
  };

  const getFillLevelColor = (level: number) => {
    if (level < 50) return 'bg-green-500';
    if (level < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const calculateFillLevel = (bin: Bin) => {
    if (!bin.capacity || bin.capacity.total === 0) return 0;
    return Math.round((bin.capacity.current / bin.capacity.total) * 100);
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return 'Unknown';
    if (distance < 1) return `${Math.round(distance * 1000)}m`;
    return `${distance.toFixed(1)}km`;
  };

  const formatLastEmptied = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      return 'Recently';
    } catch {
      return 'Unknown';
    }
  };

  const getStatsFromBins = (bins: Bin[]) => {
    const total = bins.length;
    const available = bins.filter(bin => bin.status.toLowerCase() === 'active').length;
    const full = bins.filter(bin => {
      const fillLevel = calculateFillLevel(bin);
      return fillLevel >= 90;
    }).length;
    const maintenance = bins.filter(bin => 
      bin.status.toLowerCase() === 'maintenance' || bin.status.toLowerCase() === 'inactive'
    ).length;

    return { total, available, full, maintenance };
  };

  const stats = getStatsFromBins(bins);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Finding nearby bins...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Getting your location and loading smart bins
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Smart Bin Tracker
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Find and track smart waste bins near you
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadBinsData}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Location Info */}
        {locationInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                <MapPinIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  Your Location
                </h3>
                {locationInfo.currentLocation ? (
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {locationInfo.currentLocation.name}, {locationInfo.currentLocation.area}
                  </p>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Delhi NCR Area
                  </p>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {locationInfo.message}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  locationInfo.hasBinsInArea 
                    ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
                    : 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {locationInfo.hasBinsInArea ? 'Bins Available' : 'Limited Bins'}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
                  Unable to Load Bins
                </h3>
                <p className="text-red-600 dark:text-red-300 mt-1">
                  {error}
                </p>
                {locationPermission === 'denied' && (
                  <p className="text-sm text-red-500 dark:text-red-400 mt-2">
                    To see nearby bins, please enable location access in your browser settings and refresh the page.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Overview */}
        {bins.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Total Bins</p>
                </div>
                <Trash2 className="w-8 h-8 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Available</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-600">{stats.full}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Full</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Maintenance</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Bin List */}
        {bins.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bins.map((bin, index) => {
              const StatusIcon = getStatusIcon(bin.status);
              const fillLevel = calculateFillLevel(bin);
              return (
                <motion.div
                  key={bin._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    selectedBin === bin._id ? 'ring-2 ring-green-500' : ''
                  }`}
                  onClick={() => setSelectedBin(selectedBin === bin._id ? null : bin._id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Trash2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {bin.binId}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {bin.location.area}
                        </p>
                        {bin.location.address && (
                          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                            {bin.location.address}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bin.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {bin.status}
                      </span>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatDistance(bin.distanceFromUser)}
                      </p>
                    </div>
                  </div>

                  {/* Fill Level */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Fill Level</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {fillLevel}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${fillLevel}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-2 rounded-full ${getFillLevelColor(fillLevel)}`}
                      />
                    </div>
                  </div>

                  {/* Waste Types */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Waste Type:</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg capitalize">
                        {bin.type}
                      </span>
                    </div>
                  </div>

                  {/* Last Empty */}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Last emptied: {formatLastEmptied(bin.lastEmptied)}</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${bin.location.coordinates.latitude},${bin.location.coordinates.longitude}`;
                        window.open(url, '_blank');
                      }}
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Navigate</span>
                    </motion.button>
                  </div>

                  {/* Expanded Details */}
                  {selectedBin === bin._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Coordinates</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {bin.location.coordinates.latitude.toFixed(4)}, {bin.location.coordinates.longitude.toFixed(4)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Capacity</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {bin.status.toLowerCase() === 'maintenance' || bin.status.toLowerCase() === 'inactive' 
                              ? 'Under maintenance' 
                              : `${bin.capacity.current}/${bin.capacity.total} kg`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                          disabled={bin.status.toLowerCase() !== 'active'}
                        >
                          Use This Bin
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                        >
                          Report Issue
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : !loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Trash2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No bins found nearby
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We couldn't find any smart bins in your current location.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadBinsData}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BinTracker;