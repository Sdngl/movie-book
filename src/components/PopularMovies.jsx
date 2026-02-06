// src/components/PopularMovies.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../config/firebase";

export default function PopularMovies() {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || JSON.parse(localStorage.getItem("user")));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const q = query(collection(db, "movies"), limit(10));
        const snapshot = await getDocs(q);
        const movieList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMovies(movieList);
      } catch (error) {
        console.error("Failed to fetch movies", error);
      }
    };

    fetchMovies();
  }, []);

  if (movies.length === 0) {
    return (
      <section className="bg-[#0a0a0f] py-20 px-6 md:px-16 flex justify-center items-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
          </div>
          <p className="text-slate-400 text-lg font-bold uppercase tracking-wider">No movies available</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#0a0a0f] py-20 px-6 md:px-16">
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
              Popular{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                Movies
              </span>
            </h2>
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full" />
        </div>

        <Link
          to="/movies"
          className="group flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-slate-400 font-bold hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
        >
          VIEW ALL
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>

      {/* Horizontal Scroll Shelf */}
      <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-8 px-2 -mx-2">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="relative min-w-[200px] md:min-w-[240px] aspect-[2/3] cursor-pointer group rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/5 hover:border-purple-500/50 transition-all duration-500"
          >
            {/* Movie Poster */}
            <img
              src={movie.imageUrl}
              alt={movie.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
            />

            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

            {/* Hover Info Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                {/* Rank Badge */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                  {index + 1}
                </div>

                <h3 className="font-black text-xl text-white mb-3 leading-tight uppercase line-clamp-2">
                  {movie.title}
                </h3>

                <div className="flex items-center gap-3 mb-4 text-xs font-bold">
                  {movie.rating && (
                    <span className="flex items-center gap-1 text-yellow-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      {movie.rating}
                    </span>
                  )}
                  {movie.duration && (
                    <>
                      <span className="w-1 h-1 bg-slate-500 rounded-full" />
                      <span className="text-slate-300">
                        {movie.duration}m
                      </span>
                    </>
                  )}
                </div>

                {movie.genre && movie.genre.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genre.slice(0, 3).map((g, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-bold text-slate-300 uppercase"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  to={user ? `/movie/${movie.id}` : "/login"}
                  className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
