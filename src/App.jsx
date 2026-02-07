// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

/* ========================= Pages ========================= */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Seats from "./pages/Seats";
import Confirmation from "./pages/Confirmation";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";
import MovieDashboard from "./pages/MovieDashboard";
import Users from "./pages/Users";
import Sidebar from "./pages/Sidebar";
import Category from "./pages/Category";
import Genre from "./pages/Genre";
import Contact from "./pages/Contact";
import LogoutConfirmationModal from "./pages/LogoutConfirmationModal";

/* ========================= Layout ========================= */
import Navbar from "./pages/Navbar";
import Footer from "./pages/Footer";

/* ========================= Firestore Seed (DEV ONLY) ========================= */
import { seedFirestoreSafe } from "./seed/seedData";

import "./App.css";

function App() {
  /*
  ⚠️ DEV ONLY
  Uncomment this ONCE to seed missing showtimes & seats.
  Batch size ensures Firestore free plan limits are respected.
  After running, comment it back to prevent reseeding in production.
  */
  // useEffect(() => {
  //   seedFirestoreSafe(3); // Seed 3 movies at a time starting from the 4th movie
  // }, []);

  return (
    <>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Movies */}
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:movieId" element={<MovieDetails />} />
        <Route path="/seats/:movieId/:showtimeId" element={<Seats />} />

        {/* Booking */}
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/movie-dashboard" element={<MovieDashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/sidebar" element={<Sidebar />} />

        {/* Filters & Info */}
        <Route path="/category" element={<Category />} />
        <Route path="/genre" element={<Genre />} />
        <Route path="/contact" element={<Contact />} />

        {/* Misc */}
        <Route path="/logout-confirmation" element={<LogoutConfirmationModal />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
