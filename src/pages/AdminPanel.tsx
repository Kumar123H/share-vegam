import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  CheckCircle,
  XCircle,
  Settings,
  BarChart3
} from 'lucide-react';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  doc,
  getDocs,
  addDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

interface AdminPanelProps {
  onNavigate: (page: string) => void;
}

interface DepositRequest {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  method: string;
  utrNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}

interface WithdrawalRequest {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: number;
}

interface GameStats {
  totalUpBets: number;
  totalDownBets: number;
  currentRound: number;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({ totalUpBets: 0, totalDownBets: 0, currentRound: 1 });
  const [totalUsers, setTotalUsers] = useState(0);
  const [todayDeposits, setTodayDeposits] = useState(0);
  const [todayWithdrawals, setTodayWithdrawals] = useState(0);
  const { t } = useLanguage();

  useEffect(() => {
    // Listen to deposit requests
    const depositsQuery = query(
      collection(db, 'deposit_requests'),
      orderBy('timestamp', 'desc')
    );
    
    const unsubscribeDeposits = onSnapshot(depositsQuery, (snapshot) => {
      const deposits = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DepositRequest[];
      setDepositRequests(deposits);
      
      // Calculate today's deposits
      const today = new Date().toDateString();
      const todayTotal = deposits
        .filter(d => d.status === 'approved' && new Date(d.timestamp).toDateString() === today)
        .reduce((sum, d) => sum + d.amount, 0);
      setTodayDeposits(todayTotal);
    });

    // Listen to withdrawal requests
    const withdrawalsQuery = query(
      collection(db, 'withdrawal_requests'),
      orderBy('timestamp', 'desc')
    );
    
    const unsubscribeWithdrawals = onSnapshot(withdrawalsQuery, (snapshot) => {
      const withdrawals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as WithdrawalRequest[];
      setWithdrawalRequests(withdrawals);
      
      // Calculate today's withdrawals
      const today = new Date().toDateString();
      const todayTotal = withdrawals
        .filter(w => w.status === 'approved' && new Date(w.timestamp).toDateString() === today)
        .reduce((sum, w) => sum + w.amount, 0);
      setTodayWithdrawals(todayTotal);
    });

    // Get total users count
    const getUsersCount = async () => {
      const usersSnapshot = await getDocs(collection(db, 'user_details'));
      setTotalUsers(usersSnapshot.size);
    };

    getUsersCount();

    return () => {
      unsubscribeDeposits();
      unsubscribeWithdrawals();
    };
  }, []);

  const handleDepositAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      await updateDoc(doc(db, 'deposit_requests', requestId), {
        status: action === 'approve' ? 'approved' : 'rejected',
        processedAt: new Date().toISOString()
      });

      if (action === 'approve') {
        // In a real app, you would also update the user's wallet balance
        // This is handled by the admin manually for security
      }
    } catch (error) {
      console.error('Error updating deposit request:', error);
    }
  };

  const handleWithdrawalAction = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      await updateDoc(doc(db, 'withdrawal_requests', requestId), {
        status: action === 'approve' ? 'approved' : 'rejected',
        processedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating withdrawal request:', error);
    }
  };

  const setGameResult = async (result: 'UP' | 'DOWN' | 'TIE') => {
    try {
      await addDoc(collection(db, 'game_results'), {
        result,
        timestamp: Date.now(),
        upBets: gameStats.totalUpBets,
        downBets: gameStats.totalDownBets,
        round: gameStats.currentRound,
        setByAdmin: true
      });

      // Reset game stats for next round
      setGameStats(prev => ({
        totalUpBets: 0,
        totalDownBets: 0,
        currentRound: prev.currentRound + 1
      }));
    } catch (error) {
      console.error('Error setting game result:', error);
    }
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-effect rounded-xl p-6 text-center neon-glow">
          <Users className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary">{totalUsers}</div>
          <div className="text-sm text-gray-400">{t('totalUsers')}</div>
        </div>
        
        <div className="glass-effect rounded-xl p-6 text-center neon-glow">
          <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
          <div className="text-2xl font-bold text-secondary">₹{todayDeposits}</div>
          <div className="text-sm text-gray-400">{t('todayDeposits')}</div>
        </div>
        
        <div className="glass-effect rounded-xl p-6 text-center neon-glow">
          <TrendingDown className="w-8 h-8 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold text-accent">₹{todayWithdrawals}</div>
          <div className="text-sm text-gray-400">{t('todayWithdrawals')}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 glass-effect rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>New user registered</span>
            </div>
            <span className="text-sm text-gray-400">2 min ago</span>
          </div>
          <div className="flex items-center justify-between p-3 glass-effect rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Deposit request submitted</span>
            </div>
            <span className="text-sm text-gray-400">5 min ago</span>
          </div>
          <div className="flex items-center justify-between p-3 glass-effect rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Game round completed</span>
            </div>
            <span className="text-sm text-gray-400">8 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDepositRequests = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold gradient-text">{t('depositRequests')}</h3>
      {depositRequests.length === 0 ? (
        <div className="glass-effect rounded-xl p-8 text-center">
          <div className="text-gray-400">No deposit requests</div>
        </div>
      ) : (
        depositRequests.map((request) => (
          <div key={request.id} className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-lg">₹{request.amount}</div>
                <div className="text-sm text-gray-400">{request.userEmail}</div>
                <div className="text-xs text-gray-500">
                  {new Date(request.timestamp).toLocaleString()}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                request.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                request.status === 'approved' ? 'bg-green-900 text-green-300' :
                'bg-red-900 text-red-300'
              }`}>
                {request.status}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-400">Method:</span> {request.method}
              </div>
              <div>
                <span className="text-gray-400">UTR:</span> {request.utrNumber}
              </div>
            </div>

            {request.status === 'pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDepositAction(request.id, 'approve')}
                  className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('approve')}</span>
                </button>
                <button
                  onClick={() => handleDepositAction(request.id, 'reject')}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{t('reject')}</span>
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderWithdrawalRequests = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold gradient-text">{t('withdrawalRequests')}</h3>
      {withdrawalRequests.length === 0 ? (
        <div className="glass-effect rounded-xl p-8 text-center">
          <div className="text-gray-400">No withdrawal requests</div>
        </div>
      ) : (
        withdrawalRequests.map((request) => (
          <div key={request.id} className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-lg">₹{request.amount}</div>
                <div className="text-sm text-gray-400">{request.userEmail}</div>
                <div className="text-xs text-gray-500">
                  {new Date(request.timestamp).toLocaleString()}
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                request.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                request.status === 'approved' ? 'bg-green-900 text-green-300' :
                'bg-red-900 text-red-300'
              }`}>
                {request.status}
              </div>
            </div>

            {request.status === 'pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleWithdrawalAction(request.id, 'approve')}
                  className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('approve')}</span>
                </button>
                <button
                  onClick={() => handleWithdrawalAction(request.id, 'reject')}
                  className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>{t('reject')}</span>
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderGameControl = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold gradient-text">{t('gameControl')}</h3>
      
      {/* Current Game Stats */}
      <div className="glass-effect rounded-xl p-6">
        <h4 className="font-bold mb-4">Current Round #{gameStats.currentRound}</h4>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 glass-effect rounded-lg">
            <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">₹{gameStats.totalUpBets}</div>
            <div className="text-sm text-gray-400">Total UP Bets</div>
          </div>
          <div className="text-center p-4 glass-effect rounded-lg">
            <TrendingDown className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-500">₹{gameStats.totalDownBets}</div>
            <div className="text-sm text-gray-400">Total DOWN Bets</div>
          </div>
        </div>

        {/* Set Result Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => setGameResult('UP')}
            className="py-3 px-4 bg-gradient-to-r from-primary to-green-400 rounded-lg font-semibold hover:scale-105 transition-all"
          >
            Set UP ⬆️
          </button>
          <button
            onClick={() => setGameResult('DOWN')}
            className="py-3 px-4 bg-gradient-to-r from-red-500 to-red-400 rounded-lg font-semibold hover:scale-105 transition-all"
          >
            Set DOWN ⬇️
          </button>
          <button
            onClick={() => setGameResult('TIE')}
            className="py-3 px-4 bg-gradient-to-r from-gray-600 to-gray-500 rounded-lg font-semibold hover:scale-105 transition-all"
          >
            Set TIE ⚪
          </button>
        </div>
      </div>

      {/* Game Settings */}
      <div className="glass-effect rounded-xl p-6">
        <h4 className="font-bold mb-4">Game Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Betting Timer</span>
            <span className="text-primary">10 seconds</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Animation Timer</span>
            <span className="text-secondary">5 seconds</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Result Timer</span>
            <span className="text-accent">3 seconds</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Win Multiplier</span>
            <span className="text-primary">2x</span>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'deposits', label: 'Deposits', icon: TrendingUp },
    { id: 'withdrawals', label: 'Withdrawals', icon: TrendingDown },
    { id: 'game', label: 'Game Control', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="flex items-center justify-between p-4 glass-effect border-b border-gray-800">
        <button
          onClick={() => onNavigate('login')}
          className="p-2 rounded-lg glass-effect hover:neon-glow transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        
        <h1 className="text-xl font-bold gradient-text">Admin Panel</h1>
        
        <div className="w-10" />
      </div>

      {/* Tab Navigation */}
      <div className="glass-effect border-b border-gray-800">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'deposits' && renderDepositRequests()}
        {activeTab === 'withdrawals' && renderWithdrawalRequests()}
        {activeTab === 'game' && renderGameControl()}
      </div>
    </div>
  );
};

export default AdminPanel;