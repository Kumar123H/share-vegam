import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCrKHRzeKjiGbbr-nHXxPokcFBzetNTsbo",
  authDomain: "aviator-gane-account.firebaseapp.com",
  databaseURL: "https://aviator-gane-account-default-rtdb.firebaseio.com",
  projectId: "aviator-gane-account",
  storageBucket: "aviator-gane-account.firebasestorage.app",
  messagingSenderId: "234420518217",
  appId: "1:234420518217:web:b5007e95804fef223f6e98",
  measurementId: "G-TY1K2G0BBJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;