// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "personal-expense-tracker-f587f.firebaseapp.com",
  projectId: "personal-expense-tracker-f587f",
  storageBucket: "personal-expense-tracker-f587f.firebasestorage.app",
  messagingSenderId: "369613308634",
  appId: "1:369613308634:web:7d6ef939623f1227ee5be3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);


export { db, app, auth };