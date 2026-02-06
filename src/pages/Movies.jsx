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
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Loading movies...</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <p className="text-slate-400 text-lg font-bold uppercase tracking-widest">No movies available</p>
          <p className="text-slate-600 text-sm mt-2">Check back later for new releases</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
              All <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Movies</span>
            </h1>
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-fuchsia-500 mx-auto rounded-full" />
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