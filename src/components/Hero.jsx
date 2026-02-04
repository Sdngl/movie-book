import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* =========================
   HERO SLIDES
========================= */
const slides = [
  { image: "/images/hero1.jpg", title: "Anaconda", year: "2026", genre: "Action • Adventure", description: "A giant snake terrorizes a remote jungle expedition." },
  { image: "/images/hero2.jpg", title: "Zootopia 2", year: "2026", genre: "Animation • Adventure • Comedy", description: "The city of Zootopia faces new challenges with Judy and Nick." },
  { image: "/images/hero3.jpg", title: "Aquaman 3", year: "2026", genre: "Sci-Fi • Adventure", description: "A journey beyond the stars to save humanity." },
  { image: "/images/hero4.jpg", title: "John Wick", year: "2027", genre: "Action • Thriller", description: "An unstoppable assassin returns for one final war." },
  { image: "/images/hero5.jpg", title: "Dune", year: "2026", genre: "Sci-Fi • Fantasy", description: "Power, prophecy, and survival on a desert planet." },
];


/* =========================
   RELEASE SOON SLIDES
========================= */
const releaseSoon = [
  { image: "/images/release1.jpg", title: "Avatar 3" },
  { image: "/images/release2.jpg", title: "Guardians of the Galaxy 3" },
  { image: "/images/release3.jpg", title: "Mission Impossible 8" },
  { image: "/images/release4.jpg", title: "Black Panther 2" },
  { image: "/images/release5.jpg", title: "Star Wars: Rogue Planet" },
];

const swipeConfidence = 10000;
const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (direction) => ({ x: direction > 0 ? "-100%" : "100%" }),
};

export default function HeroReleaseSoon() {
  const [[index, direction], setIndex] = useState([0, 0]);
  const paused = useRef(false);

  const paginate = (dir) => setIndex(([prev]) => [(prev + dir + slides.length) % slides.length, dir]);

  /* AUTO SLIDE */
  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused.current) paginate(1);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative h-[80vh] flex overflow-hidden pt-20 bg-gray-900 gap-6"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* HERO SLIDER (LEFT 85%) */}
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

      {/* RELEASE SOON SIDEBAR (RIGHT 15%) */}
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
