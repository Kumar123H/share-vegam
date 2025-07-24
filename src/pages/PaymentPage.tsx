import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import QRCode from 'qrcode';

interface PaymentPageProps {
  onNavigate: (page: string) => void;
  paymentData: {
    amount: number;
    method: string;
  };
}

const PaymentPage: React.FC<PaymentPageProps> = ({ onNavigate, paymentData }) => {
  const [timer, setTimer] = useState(300); // 5 minutes
  const [utrNumber, setUtrNumber] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  // QR Code data for different payment methods
  const qrData = {
    phonepe: 'phonepe://pay?pa=merchant@paytm&pn=ShareVegam&am=' + paymentData.amount,
    googlepay: 'tez://upi/pay?pa=merchant@paytm&pn=ShareVegam&am=' + paymentData.amount,
    paytm: 'paytmmp://pay?pa=merchant@paytm&pn=ShareVegam&am=' + paymentData.amount,
    upi: 'upi://pay?pa=merchant@paytm&pn=ShareVegam&am=' + paymentData.amount
  };

  useEffect(() => {
    // Generate QR Code
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(qrData[paymentData.method as keyof typeof qrData]);
        setQrCodeUrl(url);
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    };

    generateQR();
  }, [paymentData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onNavigate('deposit');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onNavigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!utrNumber.trim()) {
      alert('Please enter UTR/Reference number');
      return;
    }

    try {
      await addDoc(collection(db, 'deposit_requests'), {
        userId: currentUser?.uid,
        userEmail: currentUser?.email,
        amount: paymentData.amount,
        method: paymentData.method,
        utrNumber: utrNumber.trim(),
        status: 'pending',
        timestamp: Date.now(),
        createdAt: new Date().toISOString()
      });

      setSubmitted(true);
      
      setTimeout(() => {
        onNavigate('dashboard');
      }, 3000);
    } catch (error) {
      console.error('Error submitting deposit request:', error);
      alert('Error submitting request. Please try again.');
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'phonepe': return '📱';
      case 'googlepay': return '💳';
      case 'paytm': return '💰';
      case 'upi': return '🏦';
      default: return '💳';
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case 'phonepe': return 'PhonePe';
      case 'googlepay': return 'Google Pay';
      case 'paytm': return 'Paytm';
      case 'upi': return 'UPI';
      default: return 'UPI';
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-4">
        <div className="glass-effect rounded-2xl p-8 text-center max-w-md w-full neon-glow">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-primary mb-4">Request Submitted!</h2>
          <p className="text-gray-300 mb-4">
            Your deposit request has been submitted successfully. 
            You will be redirected to the dashboard shortly.
          </p>
          <div className="text-sm text-gray-400">
            Amount: ₹{paymentData.amount}<br />
            UTR: {utrNumber}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="flex items-center justify-between p-4 glass-effect border-b border-gray-800">
        <button
          onClick={() => onNavigate('deposit')}
          className="p-2 rounded-lg glass-effect hover:neon-glow transition-all"
        >
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
        
        <h1 className="text-xl font-bold gradient-text">Payment</h1>
        
        {/* Timer */}
        <div className="flex items-center space-x-2 glass-effect rounded-lg px-3 py-2">
          <Clock className="w-4 h-4 text-accent" />
          <span className="font-mono text-accent">{formatTime(timer)}</span>
        </div>
      </div>

      <div className="p-6">
        {/* Payment Info */}
        <div className="glass-effect rounded-2xl p-6 mb-6 text-center neon-glow">
          <div className="text-4xl mb-4">{getMethodIcon(paymentData.method)}</div>
          <h2 className="text-xl font-bold gradient-text mb-2">
            Pay via {getMethodName(paymentData.method)}
          </h2>
          <div className="text-3xl font-bold text-primary mb-2">₹{paymentData.amount}</div>
          <div className="text-sm text-gray-400">
            Scan QR code or use UPI ID to pay
          </div>
        </div>

        {/* QR Code */}
        <div className="glass-effect rounded-2xl p-6 mb-6 text-center">
          <h3 className="font-bold mb-4 gradient-text">Scan QR Code</h3>
          {qrCodeUrl ? (
            <div className="inline-block p-4 bg-white rounded-xl">
              <img src={qrCodeUrl} alt="Payment QR Code" className="w-48 h-48 mx-auto" />
            </div>
          ) : (
            <div className="w-48 h-48 mx-auto bg-gray-800 rounded-xl flex items-center justify-center">
              <div className="text-gray-400">Loading QR Code...</div>
            </div>
          )}
          
          <div className="mt-4 p-3 glass-effect rounded-lg">
            <div className="text-sm text-gray-400 mb-1">UPI ID:</div>
            <div className="font-mono text-primary">merchant@paytm</div>
          </div>
        </div>

        {/* UTR Input */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <h3 className="font-bold mb-4 gradient-text">Enter Transaction Details</h3>
          <input
            type="text"
            placeholder={t('utrNumber')}
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value)}
            className="w-full p-4 rounded-lg glass-effect border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-transparent text-white placeholder-gray-400"
          />
          <div className="text-xs text-gray-400 mt-2">
            Enter the 12-digit UTR number or transaction reference from your payment app
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!utrNumber.trim()}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg neon-glow hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('submit')} Payment Proof
        </button>

        {/* Instructions */}
        <div className="glass-effect rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-primary mb-2">Payment Instructions:</h3>
          <ol className="text-sm text-gray-400 space-y-1">
            <li>1. Scan the QR code with your payment app</li>
            <li>2. Pay the exact amount: ₹{paymentData.amount}</li>
            <li>3. Copy the UTR/Reference number from payment confirmation</li>
            <li>4. Enter the UTR number above and submit</li>
            <li>5. Your deposit will be credited after verification</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;