import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../config/firebase";

export default function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState("");
  const [showtimes, setShowtimes] = useState([]);
  const [showTimingClicked, setShowTimingClicked] = useState(false);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [user, setUser] = useState(null);

  const trailerMap = {
    movie_201: "https://www.youtube.com/watch?v=WBmv0RK4fPo",
    movie_202: "https://www.youtube.com/watch?v=H8ieN10lX40",
    movie_203: "https://www.youtube.com/watch?v=BjkIOU5PhyQ",
    movie_204: "https://www.youtube.com/watch?v=dDuzTlur3NU",
    movie_205: "https://www.youtube.com/watch?v=tYAVuxqamyY",
    movie_206: "https://www.youtube.com/watch?v=0PD9D9pv0KE",
    movie_207: "https://www.youtube.com/watch?v=NAhYJh-gm40",
    movie_208: "https://www.youtube.com/watch?v=sPasJKsvz5A",
    movie_209: "https://www.youtube.com/watch?v=9760oMSJtQQ",
    movie_210: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    movie_211: "https://www.youtube.com/watch?v=Way9Dexny3w",
    movie_212: "https://www.youtube.com/watch?v=cH4E_t3m3lI",
  };

  /* ===================== AUTH CHECK ===================== */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || JSON.parse(localStorage.getItem("user")));
    });
    return () => unsubscribe();
  }, []);

  /* -------------------- Fetch Movie -------------------- */
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const docRef = doc(db, "movies", movieId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setMovie(docSnap.data());
      } catch (err) {
        console.error("Error fetching movie:", err);
      }
    };
    fetchMovie();
  }, [movieId]);

  /* -------------------- Fetch Theatres -------------------- */
  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const snapshot = await getDocs(collection(db, "theatres"));
        setTheatres(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching theatres:", err);
      }
    };
    fetchTheatres();
  }, []);

  /* -------------------- Fetch Showtimes -------------------- */
  const fetchShowtimes = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!selectedTheatre) return;

    try {
      const q = query(
        collection(db, "showtimes"),
        where("movieId", "==", movieId),
        where("theatreId", "==", selectedTheatre)
      );

      const snapshot = await getDocs(q);
      setShowtimes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setShowTimingClicked(true);
    } catch (err) {
      console.error("Error fetching showtimes:", err);
    }
  };

  /* ===================== BOOK NOW HANDLER ===================== */
  const handleBookNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/seats/${movieId}/${selectedShowtime}`);
  };

  /* ===================== THEATRE SELECT HANDLER ===================== */
  const handleTheatreSelect = (e) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedTheatre(e.target.value);
  };

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const getEmbedUrl = (url) => url.replace("watch?v=", "embed/");

  /* -------------------- Lazy Trailer -------------------- */
  const LazyTrailer = ({ trailerUrl, posterUrl }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
      <div className="absolute inset-0 w-full h-full rounded-lg overflow-hidden">
        {!isPlaying ? (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black group"
            onClick={() => setIsPlaying(true)}
          >
            {posterUrl && (
              <img
                src={posterUrl}
                alt="Poster"
                className="absolute inset-0 w-full h-full object-cover blur-sm brightness-75"
              />
            )}
            <div className="z-10 w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-white text-3xl shadow-lg group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        ) : (
          <iframe
            src={`${getEmbedUrl(trailerUrl)}?autoplay=1`}
            title="Trailer"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>

          <div className="relative pt-[56.25%] rounded-2xl overflow-hidden shadow-2xl">
            {trailerMap[movieId] ? (
              <LazyTrailer
                trailerUrl={trailerMap[movieId]}
                posterUrl={movie.posterUrl}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5 text-slate-400">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="font-bold uppercase tracking-wider">Trailer Not Available</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tight">{movie.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              {movie.genre?.map((g, i) => (
                <span key={i} className="px-4 py-1.5 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 border border-purple-500/30 rounded-full text-xs font-bold text-purple-400 uppercase">
                  {g}
                </span>
              ))}
              <span className="px-4 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-xs font-bold text-yellow-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {movie.rating}
              </span>
              <span className="px-4 py-1.5 bg-white/10 rounded-full text-xs font-bold text-slate-300 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {movie.duration} mins
              </span>
            </div>
            
            <p className="text-slate-300 leading-relaxed text-lg">{movie.synopsis}</p>
          </div>
        </div>

        {/* RIGHT - Booking Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl h-fit sticky top-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Book Tickets</h2>
          </div>

          {!showTimingClicked && (
            <>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Theatre</label>
                  <select
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
                    value={selectedTheatre}
                    onChange={handleTheatreSelect}
                  >
                    <option value="" className="bg-[#0a0a0f]">Choose Theatre</option>
                    {theatres.map((t) => (
                      <option key={t.id} value={t.id} className="bg-[#0a0a0f]">
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedTheatre && (
                  <button
                    onClick={fetchShowtimes}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-black uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Show Timings
                  </button>
                )}
              </div>
            </>
          )}

          {showTimingClicked && (
            <>
              <button
                onClick={() => {
                  setShowTimingClicked(false);
                  setShowtimes([]);
                  setSelectedShowtime(null);
                }}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm font-bold uppercase tracking-wider transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Theatre
              </button>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Select Showtime</label>
                  <div className="grid grid-cols-2 gap-3">
                    {showtimes.map((show) => (
                      <button
                        key={show.id}
                        onClick={() => setSelectedShowtime(show.id)}
                        className={`py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                          selectedShowtime === show.id
                            ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-500/30"
                            : "bg-white/5 text-white hover:bg-white/10"
                        }`}
                      >
                        {show.time}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedShowtime && (
                  <button
                    onClick={handleBookNow}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-black uppercase tracking-widest text-sm hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Book Now
                  </button>
                )}

                {showtimes.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-wider">No showtimes available</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
