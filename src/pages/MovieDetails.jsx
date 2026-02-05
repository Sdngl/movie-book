// src/pages/MovieDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/Firebase";

export default function MovieDetails() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState("");
  const [showtimes, setShowtimes] = useState([]);
  const [showTimingClicked, setShowTimingClicked] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  const trailerMap = {
    movie_201: "https://www.youtube.com/watch?v=WBmv0RK4fPo",
    movie_202: "https://www.youtube.com/watch?v=H8ieN10lX40",
    movie_203: "https://www.youtube.com/watch?v=BjkIOU5PhyQ",
    movie_204: "",
    movie_205: "",
    movie_206: "https://www.youtube.com/watch?v=0PD9D9pv0KE",
    movie_207: "https://www.youtube.com/watch?v=NAhYJh-gm40",
    movie_208: "",
    movie_209: "https://www.youtube.com/watch?v=9760oMSJtQQ",
    movie_210: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    movie_211: "https://www.youtube.com/watch?v=Way9Dexny3w",
    movie_212: "https://www.youtube.com/watch?v=cH4E_t3m3lI",
  };

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const docRef = doc(db, "movies", movieId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setMovie(docSnap.data());
        else console.error("No such movie!");
      } catch (err) {
        console.error("Error fetching movie:", err);
      }
    };
    fetchMovie();
  }, [movieId]);

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const snapshot = await getDocs(collection(db, "theatres"));
        setTheatres(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching theatres:", err);
      }
    };
    fetchTheatres();
  }, []);

  const fetchShowtimes = async () => {
    if (!selectedTheatre) return;
    try {
      const q = query(
        collection(db, "showtimes"),
        where("movieId", "==", movieId),
        where("theatreId", "==", selectedTheatre)
      );
      const snapshot = await getDocs(q);
      const shows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setShowtimes(shows);
      setShowTimingClicked(true);
    } catch (err) {
      console.error("Error fetching showtimes:", err);
    }
  };

  if (!movie)
    return <div className="flex justify-center items-center h-screen text-gray-400 text-lg">Loading...</div>;

  const getEmbedUrl = (url) => url.replace("watch?v=", "embed/");

  const LazyTrailer = ({ trailerUrl, posterUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    return (
      <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden shadow-lg">
        {!isPlaying ? (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer group bg-black"
            onClick={() => setIsPlaying(true)}
          >
            {posterUrl && (
              <img
                src={posterUrl}
                alt="Trailer Poster"
                className="absolute inset-0 w-full h-full object-cover filter blur-sm brightness-75 group-hover:brightness-50 transition-all duration-300"
              />
            )}
            <div className="z-10 text-white text-6xl md:text-8xl font-bold opacity-90 group-hover:scale-110 transform transition-transform duration-300">
              ▶
            </div>
          </div>
        ) : (
          <iframe
            src={getEmbedUrl(trailerUrl) + "?autoplay=1"}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full opacity-0 animate-fadeIn"
          ></iframe>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-gray-800 min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Main */}
        <div className="lg:col-span-2 space-y-8">
          <button
            className="text-gray-400 hover:text-white font-medium transition-colors"
            onClick={() => window.history.back()}
          >
            ← Back
          </button>

          <div className="w-full relative pt-[56.25%] rounded-lg overflow-hidden shadow-2xl">
            {trailerMap[movieId] ? (
              <LazyTrailer trailerUrl={trailerMap[movieId]} posterUrl={movie.posterUrl} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-gray-300 font-semibold rounded-lg">
                Trailer Not Available
              </div>
            )}
          </div>

          <div className="bg-gray-900/80 backdrop-blur p-6 rounded-lg shadow-lg space-y-3 text-gray-100">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <p><span className="font-semibold">Genre:</span> {movie.genre?.join(", ")}</p>
            <p><span className="font-semibold">Duration:</span> {movie.duration} min</p>
            <p><span className="font-semibold">Rating:</span> {movie.rating}</p>
            <p className="mt-2">{movie.synopsis}</p>
          </div>
        </div>

        {/* Right/Now Showing */}
        <div className="space-y-6">
          <div className="bg-gray-900/80 backdrop-blur p-6 rounded-lg shadow-lg min-h-[360px] flex flex-col justify-start space-y-4">
            <h2 className="font-semibold mb-4 text-lg text-white">Now Showing</h2>

            {showTimingClicked && (
              <button
                className="text-gray-400 hover:text-white mb-3 font-medium transition-colors"
                onClick={() => {
                  setShowTimingClicked(false);
                  setShowtimes([]);
                  setSelectedShowtime(null);
                }}
              >
                ← Back to Theatre
              </button>
            )}

            {!showTimingClicked && (
              <div className="space-y-3">
                <select
                  className="w-full p-3 rounded border border-gray-600 bg-gray-900 text-white focus:ring-1 focus:ring-red-600 focus:outline-none"
                  value={selectedTheatre}
                  onChange={(e) => setSelectedTheatre(e.target.value)}
                >
                  <option value="">Choose Theatre</option>
                  {theatres.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>

                {selectedTheatre && (
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-lg font-semibold transition-all shadow-lg"
                    onClick={fetchShowtimes}
                  >
                    Show Timing
                  </button>
                )}
              </div>
            )}

            {showTimingClicked && showtimes.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {showtimes.map((show) => (
                    <button
                      key={show.id}
                      className={`py-2 rounded-lg font-medium w-full transition-all shadow-sm
                        ${selectedShowtime === show.id ? "bg-red-700 text-white scale-105" : "bg-red-600 text-white hover:bg-red-700"}
                      `}
                      onClick={() => setSelectedShowtime(show.id)}
                    >
                      {show.time}
                    </button>
                  ))}
                </div>

                {selectedShowtime && (
                  <button className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg">
                    Buy Ticket
                  </button>
                )}
              </div>
            )}

            {showTimingClicked && showtimes.length === 0 && (
              <p className="text-gray-400 text-center mt-4">No showtimes available.</p>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes fadeIn {0% {opacity:0;} 100% {opacity:1;}}
          .animate-fadeIn {animation: fadeIn 0.5s forwards;}
        `}
      </style>
    </div>
  );
}
