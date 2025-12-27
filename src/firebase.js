import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBOCyfX_BNX34jM0l-sw7EkSQQaRPDNOk4",
  authDomain: "glowvai-d1530.firebaseapp.com",
  projectId: "glowvai-d1530",
  storageBucket: "glowvai-d1530.firebasestorage.app",
  messagingSenderId: "1042023868158",
  appId: "1:1042023868158:web:8d228783b006204a97e7af",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
