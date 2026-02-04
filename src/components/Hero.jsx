import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const swipeConfidence = 10000;
const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (direction) => ({ x: direction > 0 ? "-100%" : "100%" }),
};

// Release Soon static data
const releaseSoon = [
  { image: "/images/release1.jpg", title: "Avatar 3" },
  { image: "/images/release2.jpg", title: "Guardians of the Galaxy 3" },
  { image: "/images/release3.jpg", title: "Mission Impossible 8" },
  { image: "/images/release4.jpg", title: "Black Panther 2" },
  { image: "/images/release5.jpg", title: "Star Wars: Rogue Planet" },
];

export default function HeroReleaseSoon() {
  const [[index, direction], setIndex] = useState([0, 0]);
  const [slides, setSlides] = useState([]);
  const paused = useRef(false);

  // Fetch top 5 movies from TMDB
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch(
          "https://api.themoviedb.org/3/discover/movie?api_key=80d491707d8cf7b38aa19c7ccab0952f&language=en-US&sort_by=popularity.desc&page=1"
        );
        const data = await res.json();
        // Take only first 5 movies and map to your slide format
        const top5 = data.results.slice(0, 5).map((movie) => ({
          image: `https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`,
          title: movie.title,
          year: movie.release_date ? movie.release_date.slice(0, 4) : "N/A",
          genre: movie.genre_ids.join(" • "), // optionally you can map ids to names if needed
          description: movie.overview,
          rating: movie.vote_average,
        }));
        setSlides(top5);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      }
    };

    fetchMovies();
  }, []);

  const paginate = (dir) =>
    setIndex(([prev]) => [(prev + dir + slides.length) % slides.length, dir]);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused.current && slides.length > 0) paginate(1);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides]);

  if (slides.length === 0) return null; // wait until slides loaded

  return (
    <section
      className="relative h-[80vh] flex overflow-hidden pt-20 bg-gray-900 gap-6"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* HERO SLIDER */}
      <div className="relative w-[85%] overflow-hidden rounded-lg shadow-2xl -mt-6">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            className="absolute inset-0"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.9, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              const swipePower = Math.abs(info.offset.x) * info.velocity.x;
              if (swipePower < -swipeConfidence) paginate(1);
              else if (swipePower > swipeConfidence) paginate(-1);
            }}
          >
            {/* Slide Image */}
            <div
              className="absolute inset-0 bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url(${slides[index].image})` }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent rounded-lg" />

            {/* Content */}
            <div className="relative z-10 h-full flex items-center pl-8 md:pl-20 max-w-2xl space-y-4 text-white">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-wide drop-shadow-lg">
                  {slides[index].title}
                </h1>
                <div className="flex gap-3 text-sm text-gray-300 mt-2">
                  <span>{slides[index].year}</span>
                  <span>⭐ {slides[index].rating}</span>
                  <span className="text-gray-400">{slides[index].genre}</span>
                </div>
                <p className="mt-3 text-gray-200 leading-relaxed max-w-xl">
                  {slides[index].description}
                </p>
                <div className="flex gap-4 mt-6">
                  <Link className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700 transition">
                    ▶ Book Now
                  </Link>
                  <Link className="border border-white/60 text-white px-6 py-2 rounded-md font-medium hover:bg-white hover:text-black transition">
                    See Location
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl font-light hover:opacity-70 transition"
        >
          ‹
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl font-light hover:opacity-70 transition"
        >
          ›
        </button>
      </div>

      {/* RELEASE SOON */}
      <div className="w-[15%] flex flex-col gap-4 pl-4 mt-6">
        <h2 className="text-white text-lg font-bold uppercase tracking-wide border-b border-gray-700 pb-2 mb-2">
          Release Soon
        </h2>
        {releaseSoon.map((item, i) => (
          <div
            key={i}
            className="relative cursor-pointer rounded-md overflow-hidden transition-all border-2 border-transparent hover:scale-105 hover:border-gray-400"
          >
            <div className="absolute top-1 left-1 bg-black/60 text-white font-bold px-2 rounded">
              {i + 1}
            </div>
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-24 object-cover rounded-sm"
            />
            <p className="text-white text-sm mt-1 text-center truncate px-1">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
