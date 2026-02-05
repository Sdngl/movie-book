import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/Firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

// Default avatar component
const DefaultAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-bold">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      className="w-5 h-5"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  </div>
);

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // user dropdown
  const navigate = useNavigate();

  // Sync auth state
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
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-18">

          {/* LEFT */}
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="text-3xl font-extrabold tracking-wider text-red-600 hover:scale-105 transition-transform"
            >
              Cine<span className="text-white">Loop</span>
            </Link>

            {user && (
              <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
                {["Home", "Category", "Genre", "Contact"].map((item) => (
                  <li key={item}>
                    <Link
                      to={`/${item.toLowerCase()}`}
                      className="hover:text-red-500 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <Link
                to="/login"
                className="bg-red-600 px-6 py-2.5 rounded-full text-sm font-semibold
                           hover:bg-red-700 transition-colors shadow"
              >
                Login
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-white focus:outline-none"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <DefaultAvatar />
                  )}
                  {user.displayName || user.name || "User"}
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-black border border-white/10
                                  rounded-lg shadow-lg z-50">
                    {user.role === "admin" && (
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-white text-sm hover:bg-gray-800 transition-colors"
                      >
                        Dashboard
                      </Link>
                    )}

                    <Link
                      to="/my-booking"
                      className="block px-4 py-2 text-white text-sm hover:bg-gray-800 transition-colors"
                    >
                      My Booking
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-white text-sm hover:bg-red-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 px-6 py-6 space-y-4 border-t border-white/10">
          {user ? (
            <>
              {["Home", "Category", "Genre", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="block text-gray-300 hover:text-red-500 transition-colors"
                >
                  {item}
                </Link>
              ))}

              {user.role === "admin" && (
                <Link
                  to="/dashboard"
                  className="block text-gray-300 hover:text-red-500 transition-colors"
                >
                  Dashboard
                </Link>
              )}

              <Link
                to="/my-booking"
                className="block text-gray-300 hover:text-red-500 transition-colors"
              >
                My Booking
              </Link>

              <button
                onClick={handleLogout}
                className="block bg-red-600 text-center py-2.5 rounded-full font-semibold hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="block bg-red-600 text-center py-2.5 rounded-full font-semibold hover:bg-red-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
