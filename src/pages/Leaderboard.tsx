import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp, Crown, Star, Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LeaderboardUser {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    level?: string;
  };
  totalPoints: number;
  totalWasteCollected: number;
  carbonFootprintSaved: number;
  rank?: number;
}

interface MonthlyLeaderboardUser {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    level?: string;
  };
  monthlyPoints: number;
  monthlyWaste: number;
  monthlyCarbonSaved: number;
}

interface UserRank {
  rank: number;
  totalPoints: number;
  totalWasteCollected: number;
  usersAbove: number;
  usersBelow: number;
  user: {
    name: string;
    email: string;
  };
}

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'allTime'>('allTime');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyLeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const headers = token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : {
        'Content-Type': 'application/json'
      };

      // Fetch all-time leaderboard
      const allTimeResponse = await fetch(`${API_BASE_URL}/api/leaderboard`, { headers });
      if (allTimeResponse.ok) {
        const allTimeData = await allTimeResponse.json();
        const rankedData = allTimeData.leaderboard.map((user: LeaderboardUser, index: number) => ({
          ...user,
          rank: index + 1
        }));
        setLeaderboardData(rankedData);
      }

      // Fetch monthly leaderboard
      const monthlyResponse = await fetch(`${API_BASE_URL}/api/leaderboard/monthly`, { headers });
      if (monthlyResponse.ok) {
        const monthlyData = await monthlyResponse.json();
        setMonthlyData(monthlyData.leaderboard || []);
      }

      // Fetch user rank (if authenticated)
      if (token) {
        const rankResponse = await fetch(`${API_BASE_URL}/api/leaderboard/my-rank`, { headers });
        if (rankResponse.ok) {
          const rankData = await rankResponse.json();
          setUserRank(rankData.userRank);
        }
      }

    } catch (error: any) {
      console.error('Error fetching leaderboard data:', error);
      setError('Failed to load leaderboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const getCurrentData = () => {
    switch (activeTab) {
      case 'monthly':
        return monthlyData.map((user, index) => ({
          rank: index + 1,
          name: user.user.name,
          points: user.monthlyPoints,
          waste: `${user.monthlyWaste.toFixed(1)} kg`,
          badge: getBadgeForRank(index + 1),
          avatar: getAvatarForUser(user.user.name),
          level: user.user.level || 'Beginner'
        }));
      case 'allTime':
      default:
        return leaderboardData.map((user) => ({
          rank: user.rank || 0,
          name: user.user.name,
          points: user.totalPoints,
          waste: `${user.totalWasteCollected.toFixed(1)} kg`,
          badge: getBadgeForRank(user.rank || 0),
          avatar: getAvatarForUser(user.user.name),
          level: user.user.level || 'Beginner'
        }));
    }
  };

  const getBadgeForRank = (rank: number) => {
    if (rank === 1) return 'Ultimate Eco Warrior';
    if (rank === 2) return 'Green Champion';
    if (rank === 3) return 'Earth Protector';
    if (rank <= 5) return 'Eco Hero';
    if (rank <= 10) return 'Green Guardian';
    return 'Eco Contributor';
  };

  const getAvatarForUser = (name: string) => {
    const avatars = ['👨‍💻', '👩‍💼', '👨‍⚕️', '👩‍🎓', '👨‍🎨', '👩‍🏫', '👨‍🔬', '👩‍⚖️', '👤', '🧑‍💼'];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatars.length;
    return avatars[index];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Leaderboard...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Fetching top contributors data
          </p>
        </div>
      </div>
    );
  }

  const currentData = getCurrentData();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return Crown;
      case 2: return Trophy;
      case 3: return Medal;
      default: return Star;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-orange-400 to-orange-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                🏆 Leaderboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Top contributors making Delhi cleaner
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchLeaderboardData}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </motion.button>
          </div>
        </motion.div>

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
                  Unable to Load Leaderboard
                </h3>
                <p className="text-red-600 dark:text-red-300 mt-1">
                  {error}
                </p>
                <button
                  onClick={fetchLeaderboardData}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-1 shadow-lg">
            {(['monthly', 'allTime'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab === 'monthly' && 'This Month'}
                {tab === 'allTime' && 'All Time'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Top 3 Spotlight */}
        {currentData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {currentData.slice(0, 3).map((user, index) => {
              const RankIcon = getRankIcon(user.rank);
              return (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl ${
                    user.rank === 1 ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${getRankColor(user.rank)} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <RankIcon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="text-4xl mb-2">{user.avatar}</div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      {user.badge}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Points:</span>
                        <span className="font-bold text-green-600">{user.points.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Waste:</span>
                        <span className="font-bold text-blue-600">{user.waste}</span>
                      </div>
                    </div>
                  </div>

                  {user.rank === 1 && (
                    <motion.div
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                    >
                      ⭐
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Remaining Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complete Rankings
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentData.length > 3 ? (
              currentData.slice(3).map((user, index) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center font-bold text-white">
                        #{user.rank}
                      </div>
                      <div className="text-2xl">{user.avatar}</div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {user.badge}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="font-bold text-green-600">{user.points.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">points</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{user.waste}</p>
                        <p className="text-sm text-gray-500">waste</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-500">+{Math.floor(Math.random() * 100)}</p>
                        <p className="text-xs text-gray-400">this period</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-6 text-center">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Not enough participants yet. Be among the first contributors!
                </p>
              </div>
            )}

            {/* Current User Position */}
            {userRank && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-800"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                      #{userRank.rank}
                    </div>
                    <div className="text-2xl">👤</div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {user?.name || 'You'}
                      </h3>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Your current position
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-bold text-green-600">{userRank.totalPoints.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">points</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{userRank.totalWasteCollected.toFixed(1)} kg</p>
                      <p className="text-sm text-gray-500">waste</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{userRank.usersAbove} above</p>
                      <p className="text-xs text-gray-400">{userRank.usersBelow} below</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-6 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-2">Climb the Leaderboard! 🚀</h3>
          <p className="text-green-100 mb-4">
            Contribute more waste to improve your ranking and earn exclusive rewards
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Find Smart Bins
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;