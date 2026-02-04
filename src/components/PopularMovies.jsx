import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_KEY = "80d491707d8cf7b38aa19c7ccab0952f";
const DISCOVER_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc`;
const MOVIE_DETAILS_URL = (id) =>
  `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;

export default function PopularMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(DISCOVER_URL);
        const data = await res.json();

        const topMovies = data.results.slice(0, 10);

        const detailedMovies = await Promise.all(
          topMovies.map(async (movie) => {
            const detailsRes = await fetch(MOVIE_DETAILS_URL(movie.id));
            const details = await detailsRes.json();

            return {
              id: movie.id,
              title: movie.title,
              poster_path: movie.poster_path,
              runtime: details.runtime,
              genres: details.genres.map((g) => g.name).join(", "),
            };
          })
        );

        setMovies(detailedMovies);
      } catch (error) {
        console.error("Failed to fetch movies", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <section className="bg-gradient-to-b from-black to-gray-900 py-20 px-6">
      <h2 className="text-3xl font-bold text-white text-center mb-12">
        Popular Movies
      </h2>

      <div className="flex gap-6 overflow-x-auto scroll-smooth pb-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="relative min-w-[200px] h-[300px] cursor-pointer group rounded-lg overflow-hidden shadow-lg"
          >
            {/* Movie Poster */}
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            />

            {/* Hover Info + Book Now */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4 text-center text-white">
              <h3 className="font-bold text-lg mb-2">{movie.title}</h3>
              {movie.runtime && (
                <p className="text-sm mb-1">Length: {movie.runtime} min</p>
              )}
              {movie.genres && <p className="text-sm mb-3">{movie.genres}</p>}

              <Link
                to="/movies"
                className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-red-700 transition"
              >
                ▶ Book Now
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link
          to="/movies"
          className="text-red-500 font-medium hover:underline"
        >
          View All Movies →
        </Link>
      </div>
    </section>
  );
}
