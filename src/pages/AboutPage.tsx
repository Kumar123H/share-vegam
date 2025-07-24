import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, TrendingUp, Shield, Zap, Users, Award, Heart } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

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
        
        <h1 className="text-xl font-bold gradient-text">{t('aboutUs')} 📘</h1>
        
        <div className="w-10" />
      </div>

      <div className="p-6">
        {/* Hero Section */}
        <div className="glass-effect rounded-2xl p-6 mb-6 text-center neon-glow">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center neon-glow mb-4">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-4">Share Vegam</h2>
          <p className="text-gray-300 leading-relaxed">
            {t('aboutText')}
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="glass-effect rounded-xl p-6 hover:neon-glow transition-all">
            <Zap className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-bold text-accent mb-2">Real-time Gaming</h3>
            <p className="text-gray-400 text-sm">
              Experience live stock market predictions with instant results and real-time betting.
            </p>
          </div>

          <div className="glass-effect rounded-xl p-6 hover:neon-glow transition-all">
            <Shield className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-bold text-primary mb-2">Secure Platform</h3>
            <p className="text-gray-400 text-sm">
              Your funds and personal information are protected with bank-level security.
            </p>
          </div>

          <div className="glass-effect rounded-xl p-6 hover:neon-glow transition-all">
            <Users className="w-8 h-8 text-secondary mb-3" />
            <h3 className="font-bold text-secondary mb-2">Community Driven</h3>
            <p className="text-gray-400 text-sm">
              Join thousands of players in the most exciting stock market casino experience.
            </p>
          </div>

          <div className="glass-effect rounded-xl p-6 hover:neon-glow transition-all">
            <Award className="w-8 h-8 text-accent mb-3" />
            <h3 className="font-bold text-accent mb-2">Daily Rewards</h3>
            <p className="text-gray-400 text-sm">
              Earn daily bonuses and rewards for active participation in the platform.
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h3 className="text-2xl font-bold gradient-text mb-4 text-center">Our Mission</h3>
          <p className="text-gray-300 leading-relaxed text-center">
            To create the most engaging and fair stock market gaming platform that combines 
            the excitement of trading with the thrill of casino gaming, while maintaining 
            the highest standards of security and user experience.
          </p>
        </div>

        {/* Game Rules */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h3 className="text-2xl font-bold gradient-text mb-4">How to Play</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold text-primary">Place Your Bet</h4>
                <p className="text-gray-400 text-sm">Choose UP or DOWN and select your bet amount during the 10-second betting window.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold text-secondary">Watch the Market</h4>
                <p className="text-gray-400 text-sm">Observe the market line movement during the 5-second animation phase.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold text-accent">Win or Learn</h4>
                <p className="text-gray-400 text-sm">If your prediction is correct, win 2x your bet amount. If wrong, try again!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Support */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h3 className="text-2xl font-bold gradient-text mb-4 text-center">Support & Contact</h3>
          <div className="text-center space-y-2">
            <p className="text-gray-300">Need help? We're here for you 24/7</p>
            <div className="flex justify-center space-x-6 mt-4">
              <div className="text-center">
                <div className="text-2xl mb-1">📧</div>
                <div className="text-sm text-gray-400">Email Support</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">💬</div>
                <div className="text-sm text-gray-400">Live Chat</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">📞</div>
                <div className="text-sm text-gray-400">Phone Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsible Gaming */}
        <div className="glass-effect rounded-lg p-4 border border-yellow-500 border-opacity-30">
          <div className="flex items-start space-x-3">
            <Heart className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-500 mb-1">Responsible Gaming</h4>
              <p className="text-sm text-gray-400">
                Play responsibly. Set limits for yourself and never bet more than you can afford to lose. 
                Gaming should be fun and entertaining, not a source of financial stress.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>{t('copyright')}</p>
          <p className="mt-2">Made with ❤️ for the gaming community</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;