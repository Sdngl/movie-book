import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-18">

          {/* LEFT */}
          <div className="flex items-center gap-10">
            <Link
              to="/"
              className="text-3xl font-extrabold tracking-wider text-red-600 hover:scale-105 transition"
            >
              Film<span className="text-white">Verse</span>
            </Link>

            <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
              {["Movies", "Category", "Genre", "Contact"].map(item => (
                <li key={item}>
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="hover:text-red-500 transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CENTER */}
          <div className="hidden md:flex flex-1 justify-center px-6">
            <input
              type="text"
              placeholder="Search movies, genres..."
              className="w-full max-w-md bg-gray-900/80 px-5 py-2.5 rounded-full text-sm
                         focus:outline-none focus:ring-2 focus:ring-red-600
                         placeholder-gray-500"
            />
          </div>

          {/* RIGHT */}
          <div className="hidden md:flex">
            <Link
              to="/login"
              className="bg-red-600 px-6 py-2.5 rounded-full text-sm font-semibold
                         hover:bg-red-700 transition shadow"
            >
              Login
            </Link>
          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden bg-black/95 px-6 py-6 space-y-4 border-t border-white/10">
          <input
            type="text"
            placeholder="Search movies..."
            className="w-full bg-gray-900 px-4 py-2.5 rounded-full
                       focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          {["Movies", "Category", "Genre", "Contact"].map(item => (
            <Link
              key={item}
              to={`/${item.toLowerCase()}`}
              className="block text-gray-300 hover:text-red-500"
            >
              {item}
            </Link>
          ))}

          <Link
            to="/login"
            className="block bg-red-600 text-center py-2.5 rounded-full font-semibold"
          >
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
