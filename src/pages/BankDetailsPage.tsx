import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, Building2, Save, CheckCircle } from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface BankDetailsPageProps {
  onNavigate: (page: string) => void;
}

interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

const BankDetailsPage: React.FC<BankDetailsPageProps> = ({ onNavigate }) => {
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: ''
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const loadBankDetails = async () => {
      if (!currentUser) return;

      try {
        const bankDoc = await getDoc(doc(db, 'bank_details', currentUser.uid));
        if (bankDoc.exists()) {
          setBankDetails(bankDoc.data() as BankDetails);
        }
      } catch (error) {
        console.error('Error loading bank details:', error);
      }
    };

    loadBankDetails();
  }, [currentUser]);

  const handleInputChange = (field: keyof BankDetails, value: string) => {
    setBankDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!currentUser) return;

    // Validate required fields
    if (!bankDetails.accountHolderName || !bankDetails.accountNumber || 
        !bankDetails.ifscCode || !bankDetails.bankName) {
      alert('Please fill in all fields');
      return;
    }

    // Validate IFSC code format
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(bankDetails.ifscCode.toUpperCase())) {
      alert('Please enter a valid IFSC code');
      return;
    }

    // Validate account number (basic check)
    if (bankDetails.accountNumber.length < 9 || bankDetails.accountNumber.length > 18) {
      alert('Please enter a valid account number');
      return;
    }

    setLoading(true);

    try {
      await setDoc(doc(db, 'bank_details', currentUser.uid), {
        ...bankDetails,
        ifscCode: bankDetails.ifscCode.toUpperCase(),
        userId: currentUser.uid,
        updatedAt: new Date().toISOString()
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving bank details:', error);
      alert('Error saving bank details. Please try again.');
    } finally {
      setLoading(false);
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
        
        <h1 className="text-xl font-bold gradient-text">{t('bankDetails')} 🏦</h1>
        
        <div className="w-10" />
      </div>

      <div className="p-6">
        {/* Header Info */}
        <div className="glass-effect rounded-2xl p-6 mb-6 text-center neon-glow">
          <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold gradient-text mb-2">Bank Account Details</h2>
          <p className="text-gray-400 text-sm">
            Add your bank details for withdrawals. All information is encrypted and secure.
          </p>
        </div>

        {/* Bank Details Form */}
        <div className="glass-effect rounded-2xl p-6 mb-6">
          <div className="space-y-4">
            {/* Account Holder Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t('accountHolder')} *
              </label>
              <input
                type="text"
                value={bankDetails.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                placeholder="Enter account holder name"
                className="w-full p-4 rounded-lg glass-effect border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-transparent text-white placeholder-gray-400"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t('accountNumber')} *
              </label>
              <input
                type="text"
                value={bankDetails.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/\D/g, ''))}
                placeholder="Enter account number"
                className="w-full p-4 rounded-lg glass-effect border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-transparent text-white placeholder-gray-400"
              />
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t('ifscCode')} *
              </label>
              <input
                type="text"
                value={bankDetails.ifscCode}
                onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                placeholder="Enter IFSC code (e.g., SBIN0001234)"
                maxLength={11}
                className="w-full p-4 rounded-lg glass-effect border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-transparent text-white placeholder-gray-400"
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                {t('bankName')} *
              </label>
              <input
                type="text"
                value={bankDetails.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                placeholder="Enter bank name"
                className="w-full p-4 rounded-lg glass-effect border border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50 bg-transparent text-white placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
            saved 
              ? 'bg-green-600 text-white neon-glow' 
              : 'bg-gradient-to-r from-primary to-secondary text-white neon-glow hover:scale-105'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saved ? (
            <>
              <CheckCircle className="w-6 h-6 inline mr-2" />
              Saved Successfully!
            </>
          ) : loading ? (
            'Saving...'
          ) : (
            <>
              <Save className="w-6 h-6 inline mr-2" />
              {t('save')} Bank Details
            </>
          )}
        </button>

        {/* Security Info */}
        <div className="glass-effect rounded-lg p-4 mt-6">
          <h3 className="font-semibold text-primary mb-2">Security & Privacy:</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• All bank details are encrypted and stored securely</li>
            <li>• Information is only used for withdrawal processing</li>
            <li>• We never share your banking information with third parties</li>
            <li>• You can update your details anytime</li>
            <li>• Double-check all details before saving</li>
          </ul>
        </div>

        {/* Validation Info */}
        <div className="glass-effect rounded-lg p-4 mt-4 border border-yellow-500 border-opacity-30">
          <h3 className="font-semibold text-yellow-500 mb-2">Important Notes:</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Account holder name should match your ID proof</li>
            <li>• IFSC code format: 4 letters + 0 + 6 characters (e.g., SBIN0001234)</li>
            <li>• Account number should be 9-18 digits</li>
            <li>• Ensure all details are correct to avoid withdrawal delays</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsPage;