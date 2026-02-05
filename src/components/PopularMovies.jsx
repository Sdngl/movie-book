// src/components/PopularMovies.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "../config/firebase";

export default function PopularMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const q = query(collection(db, "movies"), limit(10));
        const snapshot = await getDocs(q);
        const movieList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMovies(movieList);
      } catch (error) {
        console.error("Failed to fetch movies", error);
      }
    };

    fetchMovies();
  }, []);

  if (movies.length === 0) {
    return (
      <section className="bg-black py-20 px-6 md:px-16 flex justify-center items-center">
        <p className="text-gray-400 text-lg">No movies available.</p>
      </section>
    );
  }

  return (
    <section className="bg-black py-20 px-6 md:px-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
            Popular <span className="text-red-600">Movies</span>
          </h2>
          <div className="h-1 w-12 bg-red-600 mt-2 rounded-full"></div>
        </div>
        
        <Link
          to="/movies"
          className="group text-gray-400 font-bold hover:text-white transition-colors flex items-center gap-2"
        >
          VIEW ALL <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>

      {/* Horizontal Scroll Shelf */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 px-2 -mx-2">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="relative min-w-[220px] md:min-w-[260px] aspect-[2/3] cursor-pointer group rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/5"
          >
            {/* Movie Poster */}
            <img
              src={movie.imageUrl}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
            />

            {/* Hover Info Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-black text-xl text-white mb-2 leading-tight uppercase">
                  {movie.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-4 text-[10px] font-bold">
                  {movie.rating && <span className="text-yellow-400">★ {movie.rating}</span>}
                  {movie.genre && movie.genre.length > 0 && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="text-gray-300 uppercase truncate">
                        {movie.genre.slice(0, 2).join(", ")}
                      </span>
                    </>
                  )}
                </div>

                <Link
                  to={`/movie/${movie.id}`}
                  className="w-full bg-white text-black py-2 rounded-lg font-black text-xs hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  ▶ BOOK NOW
                </Link>
              </div>
            </div>

            {/* Optional Rank Number */}
            <div className="absolute top-4 left-4 text-white/20 text-4xl font-black italic group-hover:text-red-600/40 transition-colors">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
