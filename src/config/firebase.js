// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "movie-booking-s.firebaseapp.com",
  projectId: "movie-booking-s",
  storageBucket: "movie-booking-s.appspot.com",
  messagingSenderId: "633334302714",
  appId: "1:633334302714:web:27a6903b2148fff2abc643",
  measurementId: "G-0BTFH87WP8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Optional analytics
export const analytics = getAnalytics(app);

// Firebase Authentication instance
export const auth = getAuth(app);
