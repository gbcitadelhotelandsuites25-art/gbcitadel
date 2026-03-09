import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBpdVCySCsAJFcuqcsvJ70I0-DI8kj7bFU",
  authDomain: "gb-citadel-enterprise-system.firebaseapp.com",
  projectId: "gb-citadel-enterprise-system",
  storageBucket: "gb-citadel-enterprise-system.firebasestorage.app",
  messagingSenderId: "773789296441",
  appId: "1:773789296441:web:00331a3c7ba6e940fc2ae8",
  measurementId: "G-20ZSH01WE3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);