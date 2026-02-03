import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="text-3xl font-extrabold text-red-600 tracking-wide transform transition duration-300 hover:scale-105 hover:drop-shadow-lg">
            <Link to="/">FilmVerse</Link>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8 font-semibold text-white">
            <li>
              <Link className="hover:text-red-600 transition duration-200" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-600 transition duration-200" to="/movies">
                Movies
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-600 transition duration-200" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="hover:text-red-600 transition duration-200" to="/register">
                Register
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-red-600 p-2 rounded-md focus:outline-none"
            >
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <ul className="md:hidden bg-black px-4 pt-2 pb-4 space-y-2 shadow-lg font-semibold text-white">
          <li>
            <Link className="block hover:text-red-600 transition duration-200" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="block hover:text-red-600 transition duration-200" to="/movies">
              Movies
            </Link>
          </li>
          <li>
            <Link className="block hover:text-red-600 transition duration-200" to="/login">
              Login
            </Link>
          </li>
          <li>
            <Link className="block hover:text-red-600 transition duration-200" to="/register">
              Register
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
