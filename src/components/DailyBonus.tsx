import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Gift, Sparkles } from 'lucide-react';

interface DailyBonusProps {
  onClose: () => void;
}

const DailyBonus: React.FC<DailyBonusProps> = ({ onClose }) => {
  const [claimed, setClaimed] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState(0);
  const { claimDailyBonus } = useAuth();
  const { t } = useLanguage();

  const bonusTiers = [5, 10, 15, 20, 25, 30, 40];

  const handleClaim = async () => {
    const randomBonus = bonusTiers[Math.floor(Math.random() * bonusTiers.length)];
    await claimDailyBonus(randomBonus);
    setClaimedAmount(randomBonus);
    setClaimed(true);
    
    setTimeout(() => {
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="glass-effect rounded-2xl p-8 max-w-sm w-full neon-glow-gold relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sparkles Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <Sparkles className="absolute top-4 left-4 w-6 h-6 text-accent animate-pulse" />
          <Sparkles className="absolute top-8 right-8 w-4 h-4 text-primary animate-bounce" />
          <Sparkles className="absolute bottom-8 left-8 w-5 h-5 text-secondary animate-pulse" />
        </div>

        <div className="text-center">
          {!claimed ? (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center neon-glow-gold mb-6">
                <Gift className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold gradient-text mb-4">
                {t('dailyBonus')}
              </h2>
              
              <p className="text-gray-300 mb-6">
                Claim your daily bonus reward!
              </p>

              <div className="grid grid-cols-4 gap-2 mb-6">
                {bonusTiers.map((amount) => (
                  <div
                    key={amount}
                    className="glass-effect rounded-lg p-2 text-center"
                  >
                    <div className="text-accent font-bold">₹{amount}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleClaim}
                className="w-full py-4 rounded-lg bg-gradient-to-r from-accent to-primary text-white font-semibold neon-glow-gold hover:scale-105 transition-all"
              >
                {t('claim')} 🎁
              </button>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center neon-glow mb-6 animate-bounce">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-primary mb-4">
                {t('congratulations')}!
              </h2>
              
              <div className="text-4xl font-bold text-accent mb-4">
                ₹{claimedAmount}
              </div>
              
              <p className="text-gray-300">
                {t('bonusAdded')}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyBonus;