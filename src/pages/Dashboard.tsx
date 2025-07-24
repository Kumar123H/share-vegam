import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUp, Play, Zap } from 'lucide-react';
import DailyBonus from '../components/DailyBonus';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { userData } = useAuth();
  const { t } = useLanguage();
  const [showBonus, setShowBonus] = useState(false);

  useEffect(() => {
    // Show daily bonus if user has deposited and hasn't claimed today
    if (userData && userData.walletBalance > 0) {
      const today = new Date().toDateString();
      if (!userData.lastBonusClaim || userData.lastBonusClaim !== today) {
        setShowBonus(true);
      }
    }
  }, [userData]);

  return (
    <div className="min-h-screen bg-dark">
      {/* Daily Bonus */}
      {showBonus && (
        <DailyBonus onClose={() => setShowBonus(false)} />
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20" />
        <div className="stock-line absolute top-1/2 left-0 right-0" />
        
        <div className="relative p-8 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center neon-glow mb-6 stock-animation">
            <TrendingUp className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Welcome to Share Vegam
          </h1>
          
          <p className="text-gray-300 mb-8 max-w-md mx-auto">
            Experience the thrill of stock market predictions with real-time rewards
          </p>

          {/* Wallet Balance */}
          <div className="glass-effect rounded-2xl p-6 mb-8 max-w-sm mx-auto neon-glow">
            <div className="text-sm text-gray-400 mb-2">{t('walletBalance')}</div>
            <div className="text-3xl font-bold text-primary">₹{userData?.walletBalance || 0}</div>
            <div className="text-xs text-gray-500 mt-2">User ID: {userData?.userId}</div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              onClick={() => onNavigate('game')}
              className="glass-effect rounded-xl p-6 hover:neon-glow-pink transition-all group"
            >
              <Play className="w-8 h-8 text-secondary mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-secondary">Play Game</div>
            </button>
            
            <button
              onClick={() => onNavigate('deposit')}
              className="glass-effect rounded-xl p-6 hover:neon-glow-gold transition-all group"
            >
              <Zap className="w-8 h-8 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="font-semibold text-accent">{t('deposit')}</div>
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-8 gradient-text">Game Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="glass-effect rounded-xl p-6 text-center hover:neon-glow transition-all">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="font-bold text-primary mb-2">Real-time Betting</h3>
            <p className="text-gray-400 text-sm">Place bets on UP or DOWN movements with live results</p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center hover:neon-glow transition-all">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="font-bold text-secondary mb-2">Instant Rewards</h3>
            <p className="text-gray-400 text-sm">Win 2x your bet amount with correct predictions</p>
          </div>
          
          <div className="glass-effect rounded-xl p-6 text-center hover:neon-glow transition-all">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="font-bold text-accent mb-2">Daily Bonuses</h3>
            <p className="text-gray-400 text-sm">Claim daily rewards up to ₹40 for active players</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-6">
        <div className="glass-effect rounded-xl p-6 max-w-md mx-auto">
          <h3 className="font-bold text-center mb-4 gradient-text">Your Stats</h3>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">₹{userData?.walletBalance || 0}</div>
              <div className="text-xs text-gray-400">Current Balance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">{userData?.userId}</div>
              <div className="text-xs text-gray-400">Player ID</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;