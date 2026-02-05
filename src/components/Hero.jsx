// src/components/Hero.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const swipeConfidence = 10000;
const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (direction) => ({ x: direction > 0 ? "-100%" : "100%" }),
};

// Example Coming Soon static data
const comingSoon = [
  { title: "Avatar 3", image: "/images/movie_201.jpg" },
  { title: "Guardians of the Galaxy 3", image: "/images/movie_202.jpg" },
  { title: "Mission Impossible 8", image: "/images/movie_210.jpg" },
  { title: "Black Panther 2", image: "/images/movie_209.jpg" },
  { title: "Star Wars: Rogue Planet", image: "/images/movie_211.jpg" },
];

export default function Hero() {
  const [[index, direction], setIndex] = useState([0, 0]);
  const [slides, setSlides] = useState([]);
  const paused = useRef(false);

  // Fetch at least 5 movies from Firebase
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesRef = collection(db, "movies");
        const snapshot = await getDocs(moviesRef);
        const allMovies = snapshot.docs.map((doc) => doc.data());
        setSlides(allMovies.slice(0, 5));
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

  if (slides.length === 0) return null;

  return (
    <section className="relative h-[80vh] flex overflow-hidden pt-20 bg-gray-900">
      {/* HERO SLIDER - 75% width */}
      <div className="relative w-3/4 h-full overflow-hidden rounded-lg shadow-2xl">
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
            <img
              src={slides[index].imageUrl}
              alt={slides[index].title}
              className="w-full h-full object-cover rounded-lg"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent rounded-lg" />

            {/* Content */}
            <div className="absolute z-10 inset-y-0 left-0 flex flex-col justify-center pl-8 md:pl-20 max-w-2xl space-y-4 text-white">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-wide drop-shadow-lg">
                  {slides[index].title}
                </h1>
                <div className="flex gap-3 text-sm text-gray-300 mt-2">
                  <span>{slides[index].duration} mins</span>
                  <span>⭐ {slides[index].rating}</span>
                  <span className="text-gray-400">{slides[index].genre.join(" • ")}</span>
                </div>
                <p className="mt-3 text-gray-200 leading-relaxed max-w-xl">
                  {slides[index].synopsis}
                </p>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-4">
                  <button className="bg-red-600 px-6 py-2 rounded-full font-bold uppercase hover:bg-red-700 transition">
                    Buy Now
                  </button>
                  <button className="bg-gray-800 px-6 py-2 rounded-full font-bold uppercase hover:bg-gray-700 transition">
                    See Location
                  </button>
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

      {/* COMING SOON - 25% width */}
      <div className="w-1/4 flex flex-col gap-4 pl-6">
        <h2 className="text-white text-lg font-bold uppercase tracking-wide border-b border-gray-700 pb-2 mb-2">
          Coming Soon
        </h2>
        {comingSoon.map((item, i) => (
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
            <p className="text-white text-sm mt-1 text-center truncate px-1">{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
