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
  const navigate = useNavigate();

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

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/60 border-b border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-10">
            <Link to="/" className="text-3xl font-extrabold tracking-tighter text-red-600 hover:scale-105 transition-transform italic">
              Cine<span className="text-white">Loop</span>
            </Link>
            <ul className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
              <li><Link to="/movies" className="hover:text-red-500 transition-colors">Movies</Link></li>
              <li><Link to="/category" className="hover:text-red-500 transition-colors">Category</Link></li>
              <li><Link to="/genre" className="hover:text-red-500 transition-colors">Genre</Link></li>
              <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div className="flex items-center gap-6">
            {!user ? (
              <Link to="/login" className="bg-red-600 px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all">
                Login
              </Link>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="flex items-center gap-3 text-white focus:outline-none group bg-white/5 p-1.5 pr-4 rounded-full border border-white/10 hover:bg-white/10 transition-all"
                >
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <DefaultAvatar />
                  )}
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-[9px] text-gray-500 font-black uppercase leading-none mb-1">Profile</span>
                    <span className="text-xs font-bold leading-none tracking-tight">{user.displayName || "User"}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }} 
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-56 bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
                    >
                      <div className="p-4 border-b border-white/5 bg-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase mb-1">Signed in as</p>
                        <p className="text-xs font-bold text-white truncate">{user.displayName || "Member"}</p>
                      </div>

                      <div className="p-2">
                        {user.role === "admin" && (
                          <Link to="/dashboard" className="flex items-center px-4 py-3 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 rounded-lg transition-colors">
                            Dashboard
                          </Link>
                        )}
                        <Link 
                          to="/my-bookings" 
                          className="flex items-center px-4 py-3 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 rounded-lg transition-colors"
                        >
                          My Bookings
                        </Link>
                        <hr className="my-2 border-white/5" />
                        <button 
                          onClick={handleLogout} 
                          className="w-full text-left px-4 py-3 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white rounded-lg transition-all"
                        >
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
