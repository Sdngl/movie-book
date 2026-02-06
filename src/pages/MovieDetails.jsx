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

  if (!movie) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading...
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
            <div className="z-10 text-white text-7xl">▶</div>
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
    <div className="bg-gradient-to-b from-black via-gray-900 to-gray-800 min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </button>

          <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
            {trailerMap[movieId] ? (
              <LazyTrailer
                trailerUrl={trailerMap[movieId]}
                posterUrl={movie.posterUrl}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700 text-gray-300">
                Trailer Not Available
              </div>
            )}
          </div>

          <div className="bg-gray-900 p-6 rounded-lg text-gray-100 space-y-2">
            <h1 className="text-3xl font-bold">{movie.title}</h1>
            <p><b>Genre:</b> {movie.genre?.join(", ")}</p>
            <p><b>Duration:</b> {movie.duration} min</p>
            <p><b>Rating:</b> {movie.rating}</p>
            <p>{movie.synopsis}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-gray-900 p-6 rounded-lg text-white space-y-4">
          <h2 className="text-lg font-semibold">Now Showing</h2>

          {!showTimingClicked && (
            <>
              <select
                className="w-full p-3 rounded bg-gray-800"
                value={selectedTheatre}
                onChange={(e) => setSelectedTheatre(e.target.value)}
              >
                <option value="">Choose Theatre</option>
                {theatres.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>

              {selectedTheatre && (
                <button
                  onClick={fetchShowtimes}
                  className="w-full bg-red-600 py-2 rounded"
                >
                  Show Timing
                </button>
              )}
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
                className="text-gray-400"
              >
                ← Back to Theatre
              </button>

              <div className="grid grid-cols-2 gap-3">
                {showtimes.map((show) => (
                  <button
                    key={show.id}
                    onClick={() => setSelectedShowtime(show.id)}
                    className={`py-2 rounded ${
                      selectedShowtime === show.id
                        ? "bg-red-700"
                        : "bg-red-600"
                    }`}
                  >
                    {show.time}
                  </button>
                ))}
              </div>

              {selectedShowtime && (
                <button
                  onClick={() =>
                    navigate(`/seats/${movieId}/${selectedShowtime}`)
                  }
                  className="w-full bg-red-600 py-3 rounded font-semibold"
                >
                  Book Ticket
                </button>
              )}

              {showtimes.length === 0 && (
                <p className="text-gray-400 text-center">
                  No showtimes available.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
