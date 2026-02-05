import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

const DefaultAvatar = () => (
  <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold">
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  </div>
);

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false); // controls navbar visibility
  const [lastY, setLastY] = useState(0);
  const navigate = useNavigate();

  // Firebase Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser || { displayName: currentUser.displayName, role: "user" });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Show navbar when hovering near top or moving mouse upward
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY < 50) setShowNavbar(true); // top 50px always shows navbar
      else if (e.clientY < lastY) setShowNavbar(true); // moving mouse upward
      else setShowNavbar(false); // moving downward hides
      setLastY(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [lastY]);

  return (
    <AnimatePresence>
      {showNavbar && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/50 transition-colors"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              {/* Left: Logo & Links */}
              <div className="flex items-center gap-10">
                <Link to="/" className="text-3xl font-extrabold tracking-wider text-red-600 hover:scale-105 transition-transform">
                  Cine<span className="text-white">Loop</span>
                </Link>

                <ul className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-widest text-gray-300">
                  <li><Link to="/movies" className="hover:text-red-500 transition-colors">Movies</Link></li>
                  <li><Link to="/category" className="hover:text-red-500 transition-colors">Category</Link></li>
                  <li><Link to="/genre" className="hover:text-red-500 transition-colors">Genre</Link></li>
                  <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact</Link></li>
                </ul>
              </div>

              {/* Right: Auth */}
              <div className="hidden md:flex items-center gap-6">
                {!user ? (
                  <Link to="/login" className="bg-red-600 px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-red-700 transition-all">
                    Login
                  </Link>
                ) : (
                  <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 text-white focus:outline-none group">
                      {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-red-600 transition-all" /> : <DefaultAvatar />}
                      <div className="hidden lg:flex flex-col text-right mr-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">Welcome</span>
                        <span className="text-xs font-bold leading-none">{user.displayName || "User"}</span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-3 w-48 bg-gray-900 border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden"
                        >
                          {user.role === "admin" && <Link to="/dashboard" className="block px-4 py-3 text-white text-xs font-bold hover:bg-gray-800 transition-colors">DASHBOARD</Link>}
                          <Link to="/my-booking" className="block px-4 py-3 text-white text-xs font-bold hover:bg-gray-800 transition-colors">MY BOOKINGS</Link>
                          <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-500 text-xs font-bold hover:bg-red-600 hover:text-white transition-colors">LOGOUT</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
