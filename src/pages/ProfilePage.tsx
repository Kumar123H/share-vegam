import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, User, Mail, Wallet, Hash, Calendar } from 'lucide-react';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { userData, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="flex items-center justify-between p-4 glass-effect border-b border-gray-800">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 rounded-lg glass-effect hover:neon-glow transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        
        <h1 className="text-xl font-bold gradient-text">{t('profile')} 👤</h1>
        
        <div className="w-10" />
      </div>

      <div className="p-6">
        {/* Profile Header */}
        <div className="glass-effect rounded-2xl p-6 mb-6 text-center neon-glow">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-4xl mb-4 neon-glow">
            {userData?.avatar}
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-2">
            {userData?.userId}
          </h2>
          <p className="text-gray-400">{userData?.email}</p>
        </div>

        {/* Profile Details */}
        <div className="space-y-4 mb-6">
          {/* Email */}
          <div className="glass-effect rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-primary" />
              <div>
                <div className="text-sm text-gray-400">Email Address</div>
                <div className="font-semibold">{userData?.email}</div>
              </div>
            </div>
          </div>

          {/* User ID */}
          <div className="glass-effect rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Hash className="w-6 h-6 text-secondary" />
              <div>
                <div className="text-sm text-gray-400">User ID</div>
                <div className="font-semibold">{userData?.userId}</div>
              </div>
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="glass-effect rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Wallet className="w-6 h-6 text-accent" />
              <div>
                <div className="text-sm text-gray-400">{t('walletBalance')}</div>
                <div className="font-bold text-2xl text-accent">₹{userData?.walletBalance || 0}</div>
              </div>
            </div>
          </div>

          {/* Join Date */}
          <div className="glass-effect rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-6 h-6 text-primary" />
              <div>
                <div className="text-sm text-gray-400">Member Since</div>
                <div className="font-semibold">
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onNavigate('bank-details')}
            className="glass-effect rounded-xl p-4 hover:neon-glow transition-all text-center"
          >
            <div className="text-2xl mb-2">🏦</div>
            <div className="font-semibold">Bank Details</div>
          </button>
          
          <button
            onClick={() => onNavigate('withdraw')}
            className="glass-effect rounded-xl p-4 hover:neon-glow transition-all text-center"
          >
            <div className="text-2xl mb-2">💸</div>
            <div className="font-semibold">Withdraw</div>
          </button>
        </div>

        {/* Account Stats */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold gradient-text mb-4">Account Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">₹{userData?.walletBalance || 0}</div>
              <div className="text-sm text-gray-400">Current Balance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {userData?.lastBonusClaim ? '✅' : '❌'}
              </div>
              <div className="text-sm text-gray-400">Daily Bonus</div>
            </div>
          </div>
        </div>

        {/* Avatar Selection */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold gradient-text mb-4">Your Avatar</h3>
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-4xl neon-glow">
              {userData?.avatar}
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm mt-2">
            Avatar is assigned automatically when you sign up
          </p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-lg hover:scale-105 transition-all"
        >
          Logout
        </button>

        {/* App Info */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>Share Vegam v1.0</p>
          <p>Stock Market Casino Platform</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;