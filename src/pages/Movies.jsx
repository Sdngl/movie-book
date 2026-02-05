// src/pages/Movies.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

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
        <div className="animate-pulse">Loading movies...</div>
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
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Now Showing & Coming Soon
          </h1>
          <div className="h-1 w-20 bg-yellow-500 mx-auto mt-4 rounded-full"></div>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {movies.map(movie => (
            <div
              key={movie.id}
              className="group bg-gray-900/40 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col border border-gray-800 hover:border-gray-600 cursor-pointer"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              {/* Poster Container with 2:3 Aspect Ratio */}
              <div className="relative w-full aspect-[2/3] overflow-hidden bg-gray-800">
                {movie.imageUrl ? (
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 italic text-sm">
                    No Poster Available
                  </div>
                )}
                
                {/* Status Badge - Top Left Overlay */}
                <div className="absolute top-2 left-2">
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      movie.status === "now_showing" ? "bg-green-600" : "bg-red-600"
                    } shadow-md shadow-black/50`}
                  >
                    {movie.status ? movie.status.replace("_", " ") : "UNKNOWN"}
                  </span>
                </div>

                {/* Bottom Gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />
              </div>

              {/* Movie Info */}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-bold mb-1 line-clamp-1 group-hover:text-yellow-400 transition-colors" title={movie.title}>
                  {movie.title}
                </h2>
                
                {movie.genre && movie.genre.length > 0 && (
                  <p className="text-gray-400 text-xs mb-3 line-clamp-1">
                    {movie.genre.join(" • ")}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between">
                  {movie.rating ? (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-sm">★</span>
                      <span className="text-yellow-400 font-bold text-sm">
                        {movie.rating}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-xs italic">N/A Rating</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}