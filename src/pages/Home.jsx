import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const movies = [
    {
      title: "Inception",
      img: "https://m.media-amazon.com/images/I/51kTlqKf+NL._AC_SY679_.jpg",
    },
    {
      title: "The Dark Knight",
      img: "https://m.media-amazon.com/images/I/51EbJjlz1dL._AC_SY679_.jpg",
    },
    {
      title: "Interstellar",
      img: "https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_SY679_.jpg",
    },
    {
      title: "Avengers: Endgame",
      img: "https://m.media-amazon.com/images/I/81ExhpBEbHL._AC_SY679_.jpg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 py-10">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg text-center w-full max-w-md mb-10">
        <h1 className="text-4xl font-extrabold mb-6 text-white">Welcome Home!</h1>
        <p className="text-gray-300 mb-8">You are successfully logged in.</p>
        <div className="space-x-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition transform hover:scale-105"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition transform hover:scale-105"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Movie Images */}
      <h2 className="text-2xl font-bold text-white mb-6">Popular Movies</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl px-4">
        {movies.map((movie) => (
          <div key={movie.title} className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transform transition">
            <img src={movie.img} alt={movie.title} className="w-full h-64 object-cover" />
            <p className="text-white text-center mt-2 font-semibold">{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
