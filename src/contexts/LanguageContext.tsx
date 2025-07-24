import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Auth
    'login': 'Login',
    'signup': 'Sign Up',
    'email': 'Email',
    'password': 'Password',
    'confirmPassword': 'Confirm Password',
    'alreadyHaveAccount': 'Already have an account?',
    'dontHaveAccount': "Don't have an account?",
    'adminLogin': 'Admin Login',
    'username': 'Username',
    
    // Navigation
    'deposit': 'Deposit',
    'bankDetails': 'Bank Details',
    'withdraw': 'Withdraw',
    'profile': 'Profile',
    'aboutUs': 'About Us',
    'game': 'Game',
    'dashboard': 'Dashboard',
    
    // Game
    'up': 'UP',
    'down': 'DOWN',
    'tie': 'TIE',
    'placeBet': 'Place Bet',
    'betting': 'Betting',
    'result': 'Result',
    'previousResults': 'Previous Results',
    'walletBalance': 'Wallet Balance',
    'betAmount': 'Bet Amount',
    
    // Payment
    'selectPaymentMethod': 'Select Payment Method',
    'enterAmount': 'Enter Amount',
    'pay': 'Pay',
    'utrNumber': 'UTR/Reference Number',
    'submit': 'Submit',
    'paymentTimer': 'Payment Timer',
    
    // Profile
    'accountHolder': 'Account Holder Name',
    'accountNumber': 'Account Number',
    'ifscCode': 'IFSC Code',
    'bankName': 'Bank Name',
    'save': 'Save',
    
    // Admin
    'totalUsers': 'Total Users',
    'todayDeposits': 'Today\'s Deposits',
    'todayWithdrawals': 'Today\'s Withdrawals',
    'depositRequests': 'Deposit Requests',
    'withdrawalRequests': 'Withdrawal Requests',
    'gameControl': 'Game Control',
    'approve': 'Approve',
    'reject': 'Reject',
    'setResult': 'Set Result',
    
    // Bonus
    'dailyBonus': 'Daily Bonus',
    'claim': 'Claim',
    'congratulations': 'Congratulations!',
    'bonusAdded': 'Bonus added to your wallet',
    
    // About
    'aboutText': 'We created Share Vegam to combine thrill of stock trading with real-time rewards. Play safe, bet smart, and enjoy Tamil + English fun gameplay.',
    
    // Footer
    'copyright': '©️ 2025 Share Vegam | About Us | Add Yourself'
  },
  ta: {
    // Auth
    'login': 'உள்நுழைய',
    'signup': 'பதிவு செய்ய',
    'email': 'மின்னஞ்சல்',
    'password': 'கடவுச்சொல்',
    'confirmPassword': 'கடவுச்சொல்லை உறுதிப்படுத்தவும்',
    'alreadyHaveAccount': 'ஏற்கனவே கணக்கு உள்ளதா?',
    'dontHaveAccount': 'கணக்கு இல்லையா?',
    'adminLogin': 'நிர்வாக உள்நுழைவு',
    'username': 'பயனர் பெயர்',
    
    // Navigation
    'deposit': 'வைப்பு',
    'bankDetails': 'வங்கி விவரங்கள்',
    'withdraw': 'பணம் எடுக்க',
    'profile': 'சுயவிவரம்',
    'aboutUs': 'எங்களைப் பற்றி',
    'game': 'விளையாட்டு',
    'dashboard': 'டாஷ்போர்டு',
    
    // Game
    'up': 'மேலே',
    'down': 'கீழே',
    'tie': 'சமன்',
    'placeBet': 'பந்தயம்',
    'betting': 'பந்தயம்',
    'result': 'முடிவு',
    'previousResults': 'முந்தைய முடிவுகள்',
    'walletBalance': 'பணப்பை இருப்பு',
    'betAmount': 'பந்தய தொகை',
    
    // Payment
    'selectPaymentMethod': 'பணம் செலுத்தும் முறையைத் தேர்ந்தெடுக்கவும்',
    'enterAmount': 'தொகையை உள்ளிடவும்',
    'pay': 'செலுத்து',
    'utrNumber': 'UTR/குறிப்பு எண்',
    'submit': 'சமர்ப்பிக்கவும்',
    'paymentTimer': 'பணம் செலுத்தும் நேரம்',
    
    // Profile
    'accountHolder': 'கணக்கு வைத்திருப்பவர் பெயர்',
    'accountNumber': 'கணக்கு எண்',
    'ifscCode': 'IFSC குறியீடு',
    'bankName': 'வங்கி பெயர்',
    'save': 'சேமி',
    
    // Admin
    'totalUsers': 'மொத்த பயனர்கள்',
    'todayDeposits': 'இன்றைய வைப்புகள்',
    'todayWithdrawals': 'இன்றைய பணம் எடுப்புகள்',
    'depositRequests': 'வைப்பு கோரிக்கைகள்',
    'withdrawalRequests': 'பணம் எடுப்பு கோரிக்கைகள்',
    'gameControl': 'விளையாட்டு கட்டுப்பாடு',
    'approve': 'அங்கீகரி',
    'reject': 'நிராகரி',
    'setResult': 'முடிவை அமை',
    
    // Bonus
    'dailyBonus': 'தினசரி போனஸ்',
    'claim': 'கோரு',
    'congratulations': 'வாழ்த்துகள்!',
    'bonusAdded': 'போனஸ் உங்கள் பணப்பையில் சேர்க்கப்பட்டது',
    
    // About
    'aboutText': 'பங்கு வர்த்தகத்தின் சிலிர்ப்பை நிகழ்நேர வெகுமதிகளுடன் இணைக்க Share Vegam ஐ உருவாக்கினோம். பாதுகாப்பாக விளையாடுங்கள், புத்திசாலித்தனமாக பந்தயம் வைக்கவும், தமிழ் + ஆங்கில வேடிக்கையான விளையாட்டை அனுபவிக்கவும்.',
    
    // Footer
    'copyright': '©️ 2025 Share Vegam | எங்களைப் பற்றி | உங்களைச் சேர்க்கவும்'
  }
};

const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};