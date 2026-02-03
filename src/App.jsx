import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Admin from "./pages/Admin";
import Confirmation from "./pages/Confirmation";

import MovieDashboard from "./pages/MovieDashboard";
import MyBookings from "./pages/MyBookings";
import Sidebar from "./pages/Sidebar";
import Users from "./pages/Users";
import LogoutConfirmationModal from "./pages/LogoutConfirmationModal";
import Category from "./pages/Category";
import Genre from "./pages/Genre";
import Contact from "./pages/Contact";
import Footer from "./pages/Footer";
import Navbar from "./pages/Navbar";

import './App.css';

function App() {
  return (
    <>
      <Navbar />
      {/* <div className="app-container"> */}
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/category" element={<Category />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/genre" element={<Genre />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/movie-dashboard" element={<MovieDashboard />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/users" element={<Users />} />
        <Route path="/logout-confirmation" element={<LogoutConfirmationModal />} />
        
      </Routes>
      {/* </div> */}
      <Footer/>
    </>
  );
}

export default App;
