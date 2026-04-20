import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIDbTYhNvN_mYrSyJo0azkPz7lsdYDlhQ",
  authDomain: "persona-ai-12fb7.firebaseapp.com",
  projectId: "persona-ai-12fb7",
  storageBucket: "persona-ai-12fb7.firebasestorage.app",
  messagingSenderId: "954599608369",
  appId: "1:954599608369:web:52ffedc000167257b70510",
  measurementId: "G-Q0S0FT1QP5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();