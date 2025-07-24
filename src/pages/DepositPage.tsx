import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Smartphone, CreditCard } from 'lucide-react';

interface DepositPageProps {
  onNavigate: (page: string, data?: any) => void;
}

const DepositPage: React.FC<DepositPageProps> = ({ onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const { t } = useLanguage();

  const paymentMethods = [
    { id: 'phonepe', name: 'PhonePe', icon: '📱', color: 'from-purple-600 to-purple-400' },
    { id: 'googlepay', name: 'Google Pay', icon: '💳', color: 'from-blue-600 to-blue-400' },
    { id: 'paytm', name: 'Paytm', icon: '💰', color: 'from-indigo-600 to-indigo-400' },
    { id: 'upi', name: 'UPI', icon: '🏦', color: 'from-green-600 to-green-400' },
  ];

  const handlePay = () => {
    if (!amount || !selectedMethod || parseFloat(amount) < 10 || parseFloat(amount) > 10000) {
      alert('Please enter a valid amount between ₹10 and ₹10,000 and select a payment method');
      return;
    }

    onNavigate('payment', {
      amount: parseFloat(amount),
      method: selectedMethod
    });
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
        
        <h1 className="text-xl font-bold gradient-text">{t('deposit')} 💰</h1>
        
        <div className="w-10" />
      </div>

      <div className="p-6">
        {/* Amount Input */}
        <div className="glass-effect rounded-2xl p-6 mb-6 neon-glow">
          <h2 className="text-xl font-bold text-center mb-6 gradient-text">
            {t('enterAmount')}
          </h2>
          
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-accent">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10 - 10,000"
              min="10"
              max="10000"
              className="w-full pl-12 pr-4 py-4 text-2xl font-bold text-center rounded-lg glass-effect border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-transparent text-white placeholder-gray-400"
            />
          </div>
          
          <div className="text-center text-sm text-gray-400 mt-2">
            Minimum: ₹10 | Maximum: ₹10,000
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[100, 500, 1000, 2000].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="py-2 px-3 rounded-lg glass-effect hover:neon-glow transition-all text-sm font-semibold"
              >
                ₹{quickAmount}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-center mb-6 gradient-text">
            {t('selectPaymentMethod')}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-xl transition-all ${
                  selectedMethod === method.id
                    ? `bg-gradient-to-r ${method.color} neon-glow`
                    : 'glass-effect hover:neon-glow'
                }`}
              >
                <div className="text-3xl mb-2">{method.icon}</div>
                <div className="font-semibold">{method.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={!amount || !selectedMethod}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg neon-glow hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard className="w-6 h-6 inline mr-2" />
          {t('pay')} ₹{amount || '0'}
        </button>

        {/* Info */}
        <div className="glass-effect rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-primary mb-2">Important Notes:</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Deposits are processed instantly after verification</li>
            <li>• Keep your UTR/Reference number safe</li>
            <li>• Contact support if payment is not credited within 10 minutes</li>
            <li>• Minimum deposit: ₹10, Maximum: ₹10,000</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;