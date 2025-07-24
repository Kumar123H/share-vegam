import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUp, Globe, Youtube, Facebook, Instagram, Twitter } from 'lucide-react';

interface LoginPageProps {
  onAdminLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAdminLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoTaps, setLogoTaps] = useState(0);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const { login, signup } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleLogoTap = () => {
    setLogoTaps(prev => {
      const newTaps = prev + 1;
      if (newTaps === 3) {
        setShowAdminLogin(true);
        return 0;
      }
      return newTaps;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await signup(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'admin' && adminPassword === 'admin123') {
      onAdminLogin();
    } else {
      setError('Invalid admin credentials');
    }
  };

  if (showAdminLogin) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-effect rounded-2xl p-8 neon-glow">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center neon-glow mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">{t('adminLogin')}</h1>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder={t('username')}
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full p-4 rounded-lg glass-effect border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-transparent text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder={t('password')}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-4 rounded-lg glass-effect border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-transparent text-white placeholder-gray-400"
                  required
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold neon-glow hover:scale-105 transition-all"
              >
                {t('login')}
              </button>

              <button
                type="button"
                onClick={() => setShowAdminLogin(false)}
                className="w-full py-2 text-gray-400 hover:text-white transition-colors"
              >
                Back to User Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Language Selector */}
      <div className="flex justify-center pt-6">
        <div className="glass-effect rounded-full p-1 flex">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-full transition-all ${
              language === 'en' 
                ? 'bg-primary text-white neon-glow' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4 inline mr-1" />
            English
          </button>
          <button
            onClick={() => setLanguage('ta')}
            className={`px-4 py-2 rounded-full transition-all ${
              language === 'ta' 
                ? 'bg-primary text-white neon-glow' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4 inline mr-1" />
            தமிழ்
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-effect rounded-2xl p-8 neon-glow">
            {/* Logo */}
            <div className="text-center mb-8">
              <div 
                className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center neon-glow mb-4 cursor-pointer stock-animation"
                onClick={handleLogoTap}
              >
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold gradient-text">Share Vegam</h1>
              <p className="text-gray-400 mt-2">Stock Market Casino</p>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder={t('email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 rounded-lg glass-effect border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-transparent text-white placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <input
                  type="password"
                  placeholder={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 rounded-lg glass-effect border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-transparent text-white placeholder-gray-400"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <input
                    type="password"
                    placeholder={t('confirmPassword')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-4 rounded-lg glass-effect border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-transparent text-white placeholder-gray-400"
                    required
                  />
                </div>
              )}

              {error && (
                <div className="text-red-400 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold neon-glow hover:scale-105 transition-all disabled:opacity-50"
              >
                {loading ? 'Loading...' : (isLogin ? t('login') : t('signup'))}
              </button>
            </form>

            {/* Toggle Auth Mode */}
            <div className="text-center mt-6">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:text-secondary transition-colors"
              >
                {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')} {isLogin ? t('signup') : t('login')}
              </button>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center space-x-6 mt-8">
              <Youtube className="w-8 h-8 text-red-500 hover:scale-110 transition-transform cursor-pointer" />
              <Facebook className="w-8 h-8 text-blue-500 hover:scale-110 transition-transform cursor-pointer" />
              <Instagram className="w-8 h-8 text-pink-500 hover:scale-110 transition-transform cursor-pointer" />
              <Twitter className="w-8 h-8 text-blue-400 hover:scale-110 transition-transform cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center p-6 text-gray-400 text-sm">
        {t('copyright')}
      </footer>
    </div>
  );
};

export default LoginPage;