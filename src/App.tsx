import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import GamePage from './pages/GamePage';
import DepositPage from './pages/DepositPage';
import PaymentPage from './pages/PaymentPage';
import WithdrawPage from './pages/WithdrawPage';
import BankDetailsPage from './pages/BankDetailsPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import AdminPanel from './pages/AdminPanel';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAdmin, setIsAdmin] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const handleNavigation = (page: string, data?: any) => {
    if (page === 'payment' && data) {
      setPaymentData(data);
    }
    setCurrentPage(page);
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    setCurrentPage('admin');
  };

  if (isAdmin) {
    return <AdminPanel onNavigate={handleNavigation} />;
  }

  if (!currentUser) {
    return <LoginPage onAdminLogin={handleAdminLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigation} />;
      case 'game':
        return <GamePage onNavigate={handleNavigation} />;
      case 'deposit':
        return <DepositPage onNavigate={handleNavigation} />;
      case 'payment':
        return paymentData ? (
          <PaymentPage onNavigate={handleNavigation} paymentData={paymentData} />
        ) : (
          <DepositPage onNavigate={handleNavigation} />
        );
      case 'withdraw':
        return <WithdrawPage onNavigate={handleNavigation} />;
      case 'bank-details':
        return <BankDetailsPage onNavigate={handleNavigation} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigation} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigation} />;
      default:
        return <Dashboard onNavigate={handleNavigation} />;
    }
  };

  return (
    <Layout onNavigate={handleNavigation} currentPage={currentPage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;