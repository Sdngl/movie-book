import { Link } from "react-router-dom";

const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const FALLBACK_POSTER = "/images/poster.jpg";

export default function MovieCard({ movie }) {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="min-w-[200px] group relative"
    >
      {/* Poster */}
      <div
        className="h-[300px] rounded-2xl overflow-hidden
                   shadow-lg transition transform
                   group-hover:scale-105
                   group-hover:shadow-[0_0_30px_rgba(220,38,38,0.45)]"
      >
        <img
          src={
            movie.poster_path
              ? `${IMAGE_BASE}${movie.poster_path}`
              : FALLBACK_POSTER
          }
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Rating badge */}
      <div
        className="absolute top-3 left-3 bg-black/80 backdrop-blur
                   text-yellow-400 text-sm font-semibold
                   px-3 py-1 rounded-full"
      >
        ⭐ {movie.vote_average?.toFixed(1)}
      </div>

      {/* Title */}
      <h3
        className="mt-4 text-white font-semibold text-center
                   group-hover:text-red-500 transition"
      >
        {movie.title}
      </h3>
    </Link>
  );
}
