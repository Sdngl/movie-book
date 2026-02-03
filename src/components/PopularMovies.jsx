import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";

const API_URL =
  "https://api.themoviedb.org/3/discover/movie?api_key=80d491707d8cf7b38aa19c7ccab0952f";

export default function PopularMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        // limit to 10 movies
        setMovies(data.results.slice(0, 10));
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
          <MovieCard key={movie.id} movie={movie} />
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
