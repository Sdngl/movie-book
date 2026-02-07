// src/components/Hero.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
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
  const [user, setUser] = useState(null);
  const paused = useRef(false);

  /* ===================== AUTH CHECK ===================== */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || JSON.parse(localStorage.getItem("user")));
    });
    return () => unsubscribe();
  }, []);

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

  /* ===================== BOOK NOW HANDLER ===================== */
  const handleBookNow = () => {
    if (!user) {
      window.location.href = "/login";
    }
  };

  if (slides.length === 0) return null;

  return (
    <section className="relative h-[85vh] flex overflow-hidden pt-20 bg-[#0a0a0f]">
      {/* HERO SLIDER - 75% width */}
      <div className="relative w-3/4 h-full overflow-hidden rounded-r-2xl">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            className="absolute inset-0"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              const swipePower = Math.abs(info.offset.x) * info.velocity.x;
              if (swipePower < -swipeConfidence) paginate(1);
              else if (swipePower > swipeConfidence) paginate(-1);
            }}
          >
            {/* Slide Image - Full cover without cropping */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-900/20 via-[#0a0a0f]/80 to-[#0a0a0f]">
              <img
                src={slides[index].imageUrl}
                alt={slides[index].title}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute z-10 inset-y-0 left-0 flex flex-col justify-center pl-12 md:pl-20 max-w-2xl space-y-6 text-white">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-purple-600/80 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider">
                    Now Showing
                  </span>
                  <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                    ★ {slides[index].rating}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-2xl">
                  {slides[index].title}
                </h1>
                
                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {slides[index].duration} mins
                  </span>
                  <span className="w-1 h-1 bg-slate-500 rounded-full" />
                  <span className="uppercase tracking-wider">{slides[index].genre?.join(" • ")}</span>
                </div>
                
                <p className="text-slate-300 leading-relaxed max-w-xl text-lg line-clamp-3">
                  {slides[index].synopsis}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Link
                    to={user ? `/movie/${slides[index].id}` : "/login"}
                    onClick={handleBookNow}
                    className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full font-black uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-purple-600/30 transition-all overflow-hidden inline-flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Book Now
                  </Link>
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full font-black uppercase tracking-widest text-sm hover:bg-white/20 transition-all flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Locations
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white text-2xl hover:bg-white/20 hover:scale-110 transition-all z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white text-2xl hover:bg-white/20 hover:scale-110 transition-all z-20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-12 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex([i, i > index ? 1 : -1])}
              className={`w-2 h-2 rounded-full transition-all ${i === index ? "w-8 bg-purple-500" : "bg-white/30 hover:bg-white/50"}`}
            />
          ))}
        </div>
      </div>

      {/* COMING SOON - 25% width */}
      <div className="w-1/4 flex flex-col gap-4 pl-6 pr-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white text-lg font-black uppercase tracking-wide">
            Coming <span className="text-purple-400">Soon</span>
          </h2>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
        </div>
        <div className="h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
        
        {comingSoon.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-4 cursor-pointer rounded-xl overflow-hidden transition-all border-2 border-transparent hover:border-purple-500/50 hover:bg-white/5 p-2 group"
          >
            {/* Movie Image - Left Side */}
            <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-1 left-1 w-6 h-6 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded flex items-center justify-center text-white font-black text-xs">
                {i + 1}
              </div>
            </div>
            
            {/* Movie Name - Right Side with Purple Text */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm truncate group-hover:text-purple-400 transition-colors">
                {item.title}
              </p>
              <p className="text-slate-500 text-xs mt-1">Coming Soon</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
