// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "movie-booking-s.firebaseapp.com",
  projectId: "movie-booking-s",
  storageBucket: "movie-booking-s.firebasestorage.app",
  messagingSenderId: "633334302714",
  appId: "1:633334302714:web:27a6903b2148fff2abc643",
  measurementId: "G-0BTFH87WP8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);