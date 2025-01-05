// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "apartment-properties.firebaseapp.com",
  projectId: "apartment-properties",
  storageBucket: "apartment-properties.firebasestorage.app",
  messagingSenderId: "155194609845",
  appId: "1:155194609845:web:1d258944edc38bca766efc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);