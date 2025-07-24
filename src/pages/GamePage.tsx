import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { TrendingUp, TrendingDown, ArrowLeft, Minus } from 'lucide-react';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

interface GamePageProps {
  onNavigate: (page: string) => void;
}

interface GameResult {
  id: string;
  result: 'UP' | 'DOWN' | 'TIE';
  timestamp: number;
}

const GamePage: React.FC<GamePageProps> = ({ onNavigate }) => {
  const [gamePhase, setGamePhase] = useState<'betting' | 'animation' | 'result'>('betting');
  const [timer, setTimer] = useState(10);
  const [upBet, setUpBet] = useState(0);
  const [downBet, setDownBet] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [gameResult, setGameResult] = useState<'UP' | 'DOWN' | 'TIE' | null>(null);
  const [previousResults, setPreviousResults] = useState<GameResult[]>([]);
  const [linePosition, setLinePosition] = useState(50);
  const [isAnimating, setIsAnimating] = useState(false);

  const { userData, updateWallet } = useAuth();
  const { t } = useLanguage();

  const betAmounts = [10, 20, 50, 100];

  useEffect(() => {
    // Listen to previous results
    const resultsQuery = query(
      collection(db, 'game_results'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(resultsQuery, (snapshot) => {
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GameResult[];
      setPreviousResults(results);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gamePhase === 'betting' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (gamePhase === 'betting' && timer === 0) {
      setGamePhase('animation');
      setTimer(5);
      startAnimation();
    } else if (gamePhase === 'animation' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (gamePhase === 'animation' && timer === 0) {
      setGamePhase('result');
      setTimer(3);
      determineResult();
    } else if (gamePhase === 'result' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (gamePhase === 'result' && timer === 0) {
      resetGame();
    }

    return () => clearInterval(interval);
  }, [gamePhase, timer]);

  const startAnimation = () => {
    setIsAnimating(true);
    let position = 50;
    const animationInterval = setInterval(() => {
      position = Math.random() * 80 + 10; // Random position between 10-90
      setLinePosition(position);
    }, 100);

    setTimeout(() => {
      clearInterval(animationInterval);
      setIsAnimating(false);
    }, 5000);
  };

  const determineResult = async () => {
    // In a real app, this would be controlled by admin
    // For demo, we'll use random with slight bias toward player bets
    const results: ('UP' | 'DOWN' | 'TIE')[] = ['UP', 'DOWN', 'TIE'];
    const randomResult = results[Math.floor(Math.random() * results.length)];
    
    setGameResult(randomResult);
    setLinePosition(randomResult === 'UP' ? 80 : randomResult === 'DOWN' ? 20 : 50);

    // Calculate winnings
    let winnings = 0;
    if (randomResult === 'UP' && upBet > 0) {
      winnings = upBet * 2;
    } else if (randomResult === 'DOWN' && downBet > 0) {
      winnings = downBet * 2;
    }

    if (winnings > 0) {
      await updateWallet(winnings);
    }

    // Save result to Firebase
    await addDoc(collection(db, 'game_results'), {
      result: randomResult,
      timestamp: Date.now(),
      upBets: upBet,
      downBets: downBet
    });
  };

  const resetGame = () => {
    setGamePhase('betting');
    setTimer(10);
    setUpBet(0);
    setDownBet(0);
    setGameResult(null);
    setLinePosition(50);
  };

  const placeBet = (direction: 'UP' | 'DOWN') => {
    if (gamePhase !== 'betting' || !userData || userData.walletBalance < selectedAmount) return;

    if (direction === 'UP') {
      setUpBet(prev => prev + selectedAmount);
    } else {
      setDownBet(prev => prev + selectedAmount);
    }

    updateWallet(-selectedAmount);
  };

  const getResultIcon = (result: 'UP' | 'DOWN' | 'TIE') => {
    switch (result) {
      case 'UP': return '🔺';
      case 'DOWN': return '🔻';
      case 'TIE': return '⚪';
    }
  };

  const getResultColor = (result: 'UP' | 'DOWN' | 'TIE') => {
    switch (result) {
      case 'UP': return 'bg-primary';
      case 'DOWN': return 'bg-red-500';
      case 'TIE': return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 glass-effect border-b border-gray-800">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 rounded-lg glass-effect hover:neon-glow transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        
        <h1 className="text-xl font-bold gradient-text">Stock Game</h1>
        
        <div className="text-right">
          <div className="text-sm text-gray-400">Balance</div>
          <div className="font-bold text-primary">₹{userData?.walletBalance || 0}</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col">
        {/* Chart Area */}
        <div className="flex-1 relative bg-gradient-to-b from-dark-light to-dark p-4">
          <div className="h-full relative glass-effect rounded-xl overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-t border-gray-800 opacity-30"
                  style={{ top: `${(i + 1) * 20}%` }}
                />
              ))}
            </div>

            {/* Center Line */}
            <div className="absolute left-0 right-0 top-1/2 border-t-2 border-accent opacity-50" />

            {/* Moving Line */}
            <div
              className={`absolute left-0 right-0 border-t-4 transition-all duration-300 ${
                isAnimating ? 'border-secondary' : 
                gameResult === 'UP' ? 'border-primary' :
                gameResult === 'DOWN' ? 'border-red-500' : 'border-accent'
              }`}
              style={{ 
                top: `${linePosition}%`,
                boxShadow: isAnimating ? '0 0 20px rgba(236, 72, 153, 0.5)' : 'none'
              }}
            />

            {/* Timer */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="countdown-timer w-16 h-16">
                <div className="countdown-inner">
                  <span className="text-xl font-bold text-white">{timer}</span>
                </div>
              </div>
            </div>

            {/* Game Phase Indicator */}
            <div className="absolute top-4 right-4 glass-effect rounded-lg px-4 py-2">
              <div className="text-sm font-semibold">
                {gamePhase === 'betting' && 'Place Your Bets'}
                {gamePhase === 'animation' && 'Market Moving...'}
                {gamePhase === 'result' && `Result: ${gameResult}`}
              </div>
            </div>

            {/* Result Display */}
            {gameResult && gamePhase === 'result' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="glass-effect rounded-2xl p-8 text-center neon-glow">
                  <div className="text-6xl mb-4">{getResultIcon(gameResult)}</div>
                  <div className="text-2xl font-bold mb-2">
                    {gameResult === 'UP' && upBet > 0 && `Won ₹${upBet * 2}!`}
                    {gameResult === 'DOWN' && downBet > 0 && `Won ₹${downBet * 2}!`}
                    {gameResult === 'TIE' && 'Tie - Better luck next time!'}
                    {((gameResult === 'UP' && upBet === 0) || (gameResult === 'DOWN' && downBet === 0)) && 'No bet placed'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Previous Results */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">{t('previousResults')}</h3>
          <div className="result-history">
            {previousResults.map((result) => (
              <div
                key={result.id}
                className={`result-item ${getResultColor(result.result)}`}
              >
                {getResultIcon(result.result)}
              </div>
            ))}
          </div>
        </div>

        {/* Betting Controls */}
        <div className="glass-effect border-t border-gray-800 p-4">
          {/* Current Bets */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="glass-effect rounded-lg p-3 text-center">
              <div className="text-primary font-bold">UP Bet</div>
              <div className="text-xl">₹{upBet}</div>
            </div>
            <div className="glass-effect rounded-lg p-3 text-center">
              <div className="text-red-500 font-bold">DOWN Bet</div>
              <div className="text-xl">₹{downBet}</div>
            </div>
          </div>

          {/* Bet Amount Selection */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {betAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setSelectedAmount(amount)}
                className={`p-3 rounded-lg font-semibold transition-all ${
                  selectedAmount === amount
                    ? 'bg-accent text-black neon-glow-gold'
                    : 'glass-effect hover:neon-glow'
                }`}
              >
                ₹{amount}
              </button>
            ))}
          </div>

          {/* Bet Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => placeBet('UP')}
              disabled={gamePhase !== 'betting' || !userData || userData.walletBalance < selectedAmount}
              className="betting-button py-4 rounded-lg bg-gradient-to-r from-primary to-green-400 text-white font-bold text-lg neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrendingUp className="w-6 h-6 inline mr-2" />
              {t('up')} ⬆️
            </button>
            
            <button
              onClick={() => placeBet('DOWN')}
              disabled={gamePhase !== 'betting' || !userData || userData.walletBalance < selectedAmount}
              className="betting-button py-4 rounded-lg bg-gradient-to-r from-red-500 to-red-400 text-white font-bold text-lg neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrendingDown className="w-6 h-6 inline mr-2" />
              {t('down')} ⬇️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;