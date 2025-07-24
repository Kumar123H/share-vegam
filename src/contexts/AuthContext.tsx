import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

interface UserData {
  email: string;
  userId: string;
  avatar: string;
  walletBalance: number;
  createdAt: string;
  lastBonusClaim?: string;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateWallet: (amount: number) => Promise<void>;
  claimDailyBonus: (amount: number) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

const avatars = [
  '👨‍💼', '👩‍💼', '🧑‍💻', '👨‍🎓', '👩‍🎓', '🧑‍🚀', '👨‍🎨', '👩‍🎨',
  '🧑‍🔬', '👨‍⚕️', '👩‍⚕️', '🧑‍🏫', '👨‍🌾', '👩‍🌾', '🧑‍🍳', '👨‍🔧'
];

const generateUserId = () => {
  return 'SV' + Math.random().toString(36).substr(2, 8).toUpperCase();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const newUserData: UserData = {
      email: user.email!,
      userId: generateUserId(),
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      walletBalance: 0,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'user_details', user.uid), newUserData);
    setUserData(newUserData);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const updateWallet = async (amount: number) => {
    if (!currentUser || !userData) return;
    
    await updateDoc(doc(db, 'user_details', currentUser.uid), {
      walletBalance: increment(amount)
    });
    
    setUserData(prev => prev ? { ...prev, walletBalance: prev.walletBalance + amount } : null);
  };

  const claimDailyBonus = async (amount: number) => {
    if (!currentUser || !userData) return;
    
    const today = new Date().toDateString();
    await updateDoc(doc(db, 'user_details', currentUser.uid), {
      walletBalance: increment(amount),
      lastBonusClaim: today
    });
    
    setUserData(prev => prev ? { 
      ...prev, 
      walletBalance: prev.walletBalance + amount,
      lastBonusClaim: today
    } : null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'user_details', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } else {
        setUserData(null);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    login,
    signup,
    logout,
    updateWallet,
    claimDailyBonus,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};