import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Admin from "./pages/Admin";
import Confirmation from "./pages/Confirmation";
import Footer from "./pages/Footer";
import MovieDashboard from "./pages/MovieDashboard";
import MyBookings from "./pages/MyBookings";
import Sidebar from "./pages/Sidebar";
import Users from "./pages/Users";
import LogoutConfirmationModal from "./pages/LogoutConfirmationModal";
import Navbar from "./pages/Navbar";

import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/movie-dashboard" element={<MovieDashboard />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/users" element={<Users />} />
        <Route path="/logout-confirmation" element={<LogoutConfirmationModal />} />
        
      </Routes>
    </>
  );
}

export default App;
