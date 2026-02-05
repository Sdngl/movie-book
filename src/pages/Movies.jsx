// src/pages/Movies.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/Firebase";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const snapshot = await getDocs(collection(db, "movies"));
        const movieList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMovies(movieList);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 text-lg bg-gradient-to-b from-gray-900 via-black to-gray-800">
        Loading movies...
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 text-lg bg-gradient-to-b from-gray-900 via-black to-gray-800">
        No movies available at the moment.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-10 text-center">Now Showing & Coming Soon</h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map(movie => (
            <div
              key={movie.id}
              className="bg-gray-800/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl hover:scale-105 transform transition cursor-pointer hover:shadow-2xl"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              {/* Poster */}
              <div className="w-full h-64 bg-gray-700 flex items-center justify-center text-gray-400 font-semibold relative">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "Poster"
                )}
                {/* Optional overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Movie Info */}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-1">{movie.title}</h2>
                {movie.genre && movie.genre.length > 0 && (
                  <p className="text-gray-300 text-sm mb-2">{movie.genre.join(", ")}</p>
                )}
                {movie.rating && (
                  <p className="text-yellow-400 font-semibold mb-2">Rating: {movie.rating}</p>
                )}

                {/* Status Badge */}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    movie.status === "now_showing" ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {movie.status ? movie.status.replace("_", " ").toUpperCase() : "UNKNOWN"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
