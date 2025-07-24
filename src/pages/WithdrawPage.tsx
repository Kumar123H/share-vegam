import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Wallet, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

interface WithdrawPageProps {
  onNavigate: (page: string) => void;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
  createdAt: string;
}

const WithdrawPage: React.FC<WithdrawPageProps> = ({ onNavigate }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRequest[]>([]);
  const { currentUser, userData, updateWallet } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (!currentUser) return;

    const withdrawalsQuery = query(
      collection(db, 'withdrawal_requests'),
      where('userId', '==', currentUser.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(withdrawalsQuery, (snapshot) => {
      const withdrawals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WithdrawalRequest[];
      setWithdrawalHistory(withdrawals);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleWithdraw = async () => {
    if (!amount || !currentUser || !userData) return;

    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount < 100) {
      alert('Minimum withdrawal amount is ₹100');
      return;
    }

    if (withdrawAmount > userData.walletBalance) {
      alert('Insufficient balance');
      return;
    }

    setLoading(true);

    try {
      // Deduct amount from wallet immediately
      await updateWallet(-withdrawAmount);

      // Create withdrawal request
      await addDoc(collection(db, 'withdrawal_requests'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        amount: withdrawAmount,
        status: 'pending',
        timestamp: Date.now(),
        createdAt: new Date().toISOString()
      });

      setAmount('');
      alert('Withdrawal request submitted successfully!');
    } catch (error) {
      console.error('Error submitting withdrawal request:', error);
      alert('Error submitting withdrawal request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'approved': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-gray-500';
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
        
        <h1 className="text-xl font-bold gradient-text">{t('withdraw')} 💸</h1>
        
        <div className="w-10" />
      </div>

      <div className="p-6">
        {/* Wallet Balance */}
        <div className="glass-effect rounded-2xl p-6 mb-6 text-center neon-glow">
          <Wallet className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold gradient-text mb-2">{t('walletBalance')}</h2>
          <div className="text-4xl font-bold text-primary mb-2">₹{userData?.walletBalance || 0}</div>
          <div className="text-sm text-gray-400">Available for withdrawal</div>
        </div>

        {/* Withdrawal Form */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold gradient-text mb-4">Withdraw Funds</h3>
          
          <div className="mb-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-accent">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (Min: ₹100)"
                min="100"
                max={userData?.walletBalance || 0}
                className="w-full pl-12 pr-4 py-4 text-xl font-bold text-center rounded-lg glass-effect border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-transparent text-white placeholder-gray-400"
              />
            </div>
            <div className="text-center text-sm text-gray-400 mt-2">
              Minimum: ₹100 | Available: ₹{userData?.walletBalance || 0}
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[100, 500, 1000, userData?.walletBalance || 0].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                disabled={quickAmount > (userData?.walletBalance || 0)}
                className="py-2 px-3 rounded-lg glass-effect hover:neon-glow transition-all text-sm font-semibold disabled:opacity-50"
              >
                {quickAmount === (userData?.walletBalance || 0) ? 'All' : `₹${quickAmount}`}
              </button>
            ))}
          </div>

          <button
            onClick={handleWithdraw}
            disabled={!amount || loading || parseFloat(amount) > (userData?.walletBalance || 0)}
            className="w-full py-4 rounded-lg bg-gradient-to-r from-secondary to-accent text-white font-bold text-lg neon-glow hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Withdraw ₹${amount || '0'}`}
          </button>
        </div>

        {/* Bank Details Notice */}
        <div className="glass-effect rounded-lg p-4 mb-6 border border-yellow-500 border-opacity-30">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-500 mb-1">Bank Details Required</h4>
              <p className="text-sm text-gray-400">
                Make sure your bank details are updated in your profile before withdrawing.
              </p>
              <button
                onClick={() => onNavigate('bank-details')}
                className="text-primary hover:text-secondary transition-colors text-sm font-semibold mt-1"
              >
                Update Bank Details →
              </button>
            </div>
          </div>
        </div>

        {/* Withdrawal History */}
        <div className="glass-effect rounded-2xl p-6">
          <h3 className="text-xl font-bold gradient-text mb-4">Withdrawal History</h3>
          
          {withdrawalHistory.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No withdrawal requests yet
            </div>
          ) : (
            <div className="space-y-3">
              {withdrawalHistory.map((withdrawal) => (
                <div key={withdrawal.id} className="glass-effect rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-lg">₹{withdrawal.amount}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`flex items-center space-x-2 ${getStatusColor(withdrawal.status)}`}>
                      {getStatusIcon(withdrawal.status)}
                      <span className="font-semibold capitalize">{withdrawal.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="glass-effect rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-primary mb-2">Withdrawal Information:</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Minimum withdrawal amount: ₹100</li>
            <li>• Processing time: 24-48 hours</li>
            <li>• Funds are deducted immediately upon request</li>
            <li>• Ensure your bank details are correct</li>
            <li>• Contact support for any issues</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;