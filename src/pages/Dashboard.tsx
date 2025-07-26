import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Trophy, Trash2, TrendingUp, Calendar, Award, Target, Zap, Plus, Loader, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface WasteEntry {
  _id: string;
  wasteType: string;
  weight: number;
  pointsEarned: number;
  createdAt: string;
  bin: {
    binId: string;
    location: {
      area: string;
    };
  };
}

interface WasteStats {
  overall: {
    totalEntries: number;
    totalWeight: number;
    totalPoints: number;
    totalCarbonSaved: number;
  };
  byType: Array<{
    _id: string;
    count: number;
    weight: number;
    points: number;
  }>;
  monthly: Array<{
    _id: { year: number; month: number };
    entries: number;
    weight: number;
    points: number;
  }>;
}

interface UserRank {
  rank: number;
  totalPoints: number;
  totalWasteCollected: number;
  usersAbove: number;
  usersBelow: number;
}

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [wasteStats, setWasteStats] = useState<WasteStats | null>(null);
  const [recentEntries, setRecentEntries] = useState<WasteEntry[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📊 Starting dashboard data fetch...');

      // Get user info from localStorage
      const userData = localStorage.getItem('user');
      const sessionId = localStorage.getItem('sessionId');
      const userInfo = userData ? JSON.parse(userData) : null;
      
      console.log('📊 User info:', { 
        hasUserData: !!userData, 
        hasSessionId: !!sessionId, 
        userEmail: userInfo?.email,
        userName: userInfo?.name 
      });
      
      // Enhanced debugging
      console.log('📊 Raw localStorage data:', {
        userData: userData,
        sessionId: sessionId,
        token: localStorage.getItem('token')
      });

      // If no user info at all, set empty data
      if (!userInfo?.email && !sessionId) {
        console.log('📊 No user info found, setting empty data');
        setWasteStats({
          overall: { totalEntries: 0, totalWeight: 0, totalPoints: 0, totalCarbonSaved: 0 },
          byType: [],
          monthly: []
        });
        setRecentEntries([]);
        setUserRank(null);
        setLoading(false);
        return;
      }

      // Always use simple waste system for now (has the data)
      let entriesUrl = `${API_BASE_URL}/api/simple-waste/entries`;
      let statsUrl = `${API_BASE_URL}/api/simple-waste/stats`;
      let headers = { 'Content-Type': 'application/json' };
      
      if (userInfo?.email) {
        entriesUrl += `?userEmail=${encodeURIComponent(userInfo.email)}`;
        statsUrl += `?userEmail=${encodeURIComponent(userInfo.email)}`;
        console.log('📊 Using simple waste endpoints with email:', userInfo.email);
      } else if (sessionId) {
        entriesUrl += `?sessionId=${sessionId}`;
        statsUrl += `?sessionId=${sessionId}`;
        console.log('📊 Using simple waste endpoints with sessionId');
      } else {
        console.log('📊 No user identifier found');
      }
      
      console.log('📊 Fetching from URLs:', { entriesUrl, statsUrl });
      console.log('📊 Request headers:', headers);

      // Fetch entries and stats in parallel
      const [entriesResponse, statsResponse] = await Promise.all([
        fetch(entriesUrl, { headers }).catch(err => ({ ok: false, error: err })),
        fetch(statsUrl, { headers }).catch(err => ({ ok: false, error: err }))
      ]);

      // Process entries
      if (entriesResponse.ok) {
        const entriesData = await entriesResponse.json();
        console.log('📊 Raw entries data:', entriesData);
        
        if (entriesData.success && entriesData.entries) {
          const transformedEntries = entriesData.entries.slice(0, 5).map(entry => ({
            _id: entry._id,
            wasteType: entry.wasteType,
            weight: entry.weight,
            pointsEarned: entry.pointsEarned,
            createdAt: entry.submittedAt || entry.createdAt,
            bin: {
              binId: entry.binId || 'MANUAL_ENTRY',
              location: {
                area: entry.location?.detectedLocation?.area || entry.location?.detectedLocation?.name || 'Delhi NCR'
              }
            }
          }));
          
          console.log('📊 Transformed entries:', transformedEntries);
          setRecentEntries(transformedEntries);
          
          // Use stats from entries response if available
          if (entriesData.stats) {
            console.log('📊 Using stats from entries response:', entriesData.stats);
            setWasteStats({
              overall: {
                totalEntries: entriesData.stats.totalEntries || 0,
                totalWeight: entriesData.stats.totalWeight || 0,
                totalPoints: entriesData.stats.totalPoints || 0,
                totalCarbonSaved: entriesData.stats.totalCarbonSaved || 0
              },
              byType: [],
              monthly: []
            });
          }
        } else {
          console.log('📊 No entries found or invalid response');
          setRecentEntries([]);
        }
      } else {
        console.log('📊 Entries fetch failed:', entriesResponse.status || entriesResponse.error);
        setRecentEntries([]);
      }

      // Process stats (if not already set from entries)
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('📊 Raw stats data:', statsData);
        
        if (statsData.success && statsData.stats) {
          console.log('📊 Using dedicated stats response:', statsData.stats);
          const newWasteStats = {
            overall: {
              totalEntries: statsData.stats.totalEntries || 0,
              totalWeight: statsData.stats.totalWeight || 0,
              totalPoints: statsData.stats.totalPoints || 0,
              totalCarbonSaved: statsData.stats.totalCarbonSaved || 0
            },
            byType: [],
            monthly: []
          };
          console.log('📊 Setting wasteStats to:', newWasteStats);
          setWasteStats(newWasteStats);
        }
      } else {
        console.log('📊 Stats fetch failed:', statsResponse.status || statsResponse.error);
        
        // If authenticated user, try to get stats from user profile
        if (token && userInfo) {
          console.log('📊 Trying to get stats from user profile');
          try {
            const userResponse = await fetch(`${API_BASE_URL}/api/auth/me`, { 
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            
            if (userResponse.ok) {
              const userData = await userResponse.json();
              console.log('📊 User profile data:', userData);
              
              if (userData.success && userData.user) {
                setWasteStats({
                  overall: {
                    totalEntries: userData.user.totalWasteEntries || 0,
                    totalWeight: userData.user.totalWasteCollected || 0,
                    totalPoints: userData.user.points || 0,
                    totalCarbonSaved: userData.user.totalCarbonSaved || 0
                  },
                  byType: [],
                  monthly: []
                });
                console.log('📊 Using user profile stats');
              }
            }
          } catch (error) {
            console.log('📊 Failed to get user profile stats:', error);
          }
        }
        
        // Keep existing stats or set empty if none
        if (!wasteStats) {
          console.log('📊 No stats found, setting empty data');
          setWasteStats({
            overall: { totalEntries: 0, totalWeight: 0, totalPoints: 0, totalCarbonSaved: 0 },
            byType: [],
            monthly: []
          });
        }
      }

      // Set user rank to null for simple system
      setUserRank(null);

    } catch (error: any) {
      console.error('📊 Dashboard data fetch error:', error);
      setError('Unable to load dashboard data. Please try again.');
      
      // Set empty data on error
      setWasteStats({
        overall: { totalEntries: 0, totalWeight: 0, totalPoints: 0, totalCarbonSaved: 0 },
        byType: [],
        monthly: []
      });
      setRecentEntries([]);
      setUserRank(null);
    } finally {
      setLoading(false);
      console.log('📊 Dashboard data fetch completed');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return 'Recently';
  };

  const getWeeklyContribution = () => {
    if (!recentEntries || recentEntries.length === 0) {
      return '0';
    }
    
    // Calculate entries from the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyEntries = recentEntries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= oneWeekAgo;
    });
    
    const weeklyWeight = weeklyEntries.reduce((total, entry) => total + entry.weight, 0);
    return weeklyWeight.toFixed(1);
  };

  const getWeeklyGoalProgress = () => {
    const weeklyContribution = parseFloat(getWeeklyContribution());
    const weeklyGoal = 5; // 5kg weekly goal (more realistic)
    return Math.min((weeklyContribution / weeklyGoal) * 100, 100).toFixed(0);
  };
  
  const getWeeklyStats = () => {
    if (!recentEntries || recentEntries.length === 0) {
      return { entries: 0, weight: 0, points: 0 };
    }
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyEntries = recentEntries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= oneWeekAgo;
    });
    
    return {
      entries: weeklyEntries.length,
      weight: weeklyEntries.reduce((total, entry) => total + entry.weight, 0),
      points: weeklyEntries.reduce((total, entry) => total + entry.pointsEarned, 0)
    };
  };

  const getAchievements = () => {
    const totalWaste = wasteStats?.overall.totalWeight || 0;
    const totalEntries = wasteStats?.overall.totalEntries || 0;
    const eWasteWeight = wasteStats?.byType.find(type => type._id === 'hazardous')?.weight || 0;
    
    return [
      { 
        title: 'Eco Warrior', 
        description: 'Disposed 100kg+ waste', 
        unlocked: totalWaste >= 100 
      },
      { 
        title: 'Weekly Champion', 
        description: 'Top contributor this week', 
        unlocked: userRank ? userRank.rank <= 10 : false 
      },
      { 
        title: 'Consistency King', 
        description: '30+ waste entries', 
        unlocked: totalEntries >= 30 
      },
      { 
        title: 'E-Waste Expert', 
        description: 'Disposed 10kg+ e-waste', 
        unlocked: eWasteWeight >= 10 
      },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Dashboard...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Fetching your environmental impact data
          </p>
        </div>
      </div>
    );
  }

  const hasUserData = wasteStats && (wasteStats.overall.totalEntries > 0 || recentEntries.length > 0);

  const stats = [
    {
      icon: Trash2,
      title: t('totalWaste'),
      value: `${wasteStats?.overall.totalWeight?.toFixed(1) || 0} kg`,
      change: '', // Removed fake percentage
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Calendar,
      title: 'This Week',
      value: `${getWeeklyContribution()} kg`,
      change: `${getWeeklyStats().entries} entries`,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Trophy,
      title: t('rewardPoints'),
      value: `${wasteStats?.overall.totalPoints?.toLocaleString() || 0}`,
      change: '', // Removed fake percentage
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Target,
      title: 'Weekly Goal',
      value: `${getWeeklyGoalProgress()}%`,
      change: '', // Removed fake percentage
      color: 'from-orange-500 to-red-600'
    }
  ];

  const achievements = getAchievements();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here's your environmental impact summary
            {userRank && (
              <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                • Rank #{userRank.rank}
              </span>
            )}
          </p>
          
          {/* Debug/Refresh Button */}
          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              🔄 Refresh Data
            </button>
            <span className="text-sm text-gray-500">
              Current: {wasteStats?.overall.totalWeight || 0}kg, {wasteStats?.overall.totalPoints || 0} points
            </span>
          </div>
        </motion.div>

        {/* Error State - Only for connection issues */}
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
                  Connection Issue
                </h3>
                <p className="text-red-600 dark:text-red-300 mt-1">
                  {error}
                </p>
                <button
                  onClick={fetchDashboardData}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Get Started Section - Only when no user data */}
        {!error && !hasUserData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Start Your Eco Journey! 🌱
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You haven't added any waste entries yet. Start contributing to see your environmental impact and earn rewards!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/bin-tracker">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Find Nearby Bins
                  </motion.button>
                </Link>
                <Link to="/add-waste">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors font-medium"
                  >
                    Add Your First Entry
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                {stat.change && (
                  <span className="text-green-500 text-sm font-medium">{stat.change}</span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {stat.title}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Weekly Summary */}
        {hasUserData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  📅 This Week's Impact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {getWeeklyStats().weight.toFixed(1)} kg
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Waste Collected</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {getWeeklyStats().entries}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Entries This Week</p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {getWeeklyStats().points}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Points Earned</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            {getWeeklyStats().weight > 0 && (
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Weekly Goal Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {getWeeklyStats().weight.toFixed(1)} / 5.0 kg
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((getWeeklyStats().weight / 5) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('recentActivity')}
              </h2>
              <BarChart3 className="w-6 h-6 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {recentEntries.length > 0 ? (
                recentEntries.map((entry, index) => (
                  <motion.div
                    key={entry._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white capitalize">
                          {entry.wasteType} - {entry.weight.toFixed(1)} kg
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Bin {entry.bin.binId} • {formatTimeAgo(entry.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+{entry.pointsEarned}</p>
                      <p className="text-sm text-gray-500">points</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Ready to make an impact?
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Start adding your waste contributions to track your environmental impact and earn rewards!
                  </p>
                  <Link to="/add-waste">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Add Your First Entry
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('achievements')}
              </h2>
              <Award className="w-6 h-6 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`p-4 rounded-xl border-2 ${
                    achievement.unlocked
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      achievement.unlocked
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                    }`}>
                      {achievement.unlocked ? (
                        <Trophy className="w-4 h-4 text-white" />
                      ) : (
                        <Zap className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-semibold ${
                        achievement.unlocked
                          ? 'text-green-800 dark:text-green-300'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {achievement.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Ready to contribute more?</h3>
              <p className="text-green-100">Find a nearby smart bin and continue your eco-journey!</p>
            </div>
            <Link to="/add-waste">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Waste</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;