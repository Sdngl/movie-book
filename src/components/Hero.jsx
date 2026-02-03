import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const slides = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
  "/images/hero4.jpg",
  "/images/hero5.jpg",
];

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 3000); // ⏱ 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* Background carousel */}
      {slides.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Cinematic overlay (sharp, not faded) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4">
          Welcome to <span className="text-red-600">FilmVerse</span>
        </h1>

        <p className="text-gray-200 max-w-2xl mb-10 text-lg">
          Book movies, select seats, and enjoy a seamless cinema experience.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            to="/movies"
            className="bg-red-600 px-8 py-3 rounded-full font-semibold text-white
                       hover:bg-red-700 transition
                       shadow-[0_0_25px_rgba(220,38,38,0.55)]"
          >
            Book Now
          </Link>

          <Link
            to="/contact"
            className="border border-white/70 px-8 py-3 rounded-full text-white
                       hover:bg-white hover:text-black transition"
          >
            See Location
          </Link>
        </div>
      </div>
    </section>
  );
}
