import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Menu, 
  X, 
  User, 
  Wallet, 
  CreditCard, 
  Building2, 
  LogOut,
  Info,
  TrendingUp
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentPage }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { userData, logout } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    { key: 'deposit', icon: Wallet, label: t('deposit'), emoji: '💰' },
    { key: 'bank-details', icon: Building2, label: t('bankDetails'), emoji: '🏦' },
    { key: 'withdraw', icon: CreditCard, label: t('withdraw'), emoji: '💸' },
    { key: 'profile', icon: User, label: t('profile'), emoji: '👤' },
    { key: 'about', icon: Info, label: t('aboutUs'), emoji: '📘' },
  ];

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Header */}
      <header className="glass-effect border-b border-gray-800 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-2 rounded-lg glass-effect hover:neon-glow transition-all"
          >
            <Menu className="w-6 h-6 text-primary" />
          </button>

          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onNavigate('dashboard')}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center neon-glow">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">Share Vegam</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-sm text-gray-400">₹{userData?.walletBalance || 0}</div>
              <div className="text-xs text-gray-500">{userData?.userId}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center text-xl">
              {userData?.avatar}
            </div>
          </div>
        </div>
      </header>

      {/* Side Menu */}
      <div className={`fixed inset-0 z-50 ${menuOpen ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMenuOpen(false)} />
        <div className={`slide-menu ${menuOpen ? 'open' : ''} fixed left-0 top-0 h-full w-80 glass-effect border-r border-gray-800`}>
          <div className="p-6">
            {/* Menu Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold gradient-text">Menu</h2>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User Info */}
            <div className="glass-effect rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{userData?.avatar}</div>
                <div>
                  <div className="font-semibold">{userData?.userId}</div>
                  <div className="text-sm text-gray-400">{userData?.email}</div>
                  <div className="text-primary font-bold">₹{userData?.walletBalance || 0}</div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    onNavigate(item.key);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    currentPage === item.key 
                      ? 'bg-primary bg-opacity-20 text-primary neon-glow' 
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-900 hover:bg-opacity-20 text-red-400 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>
    </div>
  );
};

export default Layout;