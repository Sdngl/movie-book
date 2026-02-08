import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { reservedSeatsStore } from "./Seats";

export default function MyBookings() {
  const navigate = useNavigate();
  const [reservedSeats, setReservedSeats] = useState(reservedSeatsStore);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const bookingData = [];
      
      for (const seatId of reservedSeats) {
        try {
          const seatDoc = await getDoc(doc(db, "seats", seatId));
          if (seatDoc.exists()) {
            const seatData = seatDoc.data();
            
            let movieData = null;
            let theatreData = null;
            let showtimeData = null;
            
            if (seatData.movieId) {
              const movieDoc = await getDoc(doc(db, "movies", seatData.movieId));
              if (movieDoc.exists()) {
                movieData = movieDoc.data();
              }
            }
            
            if (seatData.theatreId) {
              const theatreDoc = await getDoc(doc(db, "theatres", seatData.theatreId));
              if (theatreDoc.exists()) {
                theatreData = theatreDoc.data();
              }
            }
            
            if (seatData.showtimeId) {
              const showtimeDoc = await getDoc(doc(db, "showtimes", seatData.showtimeId));
              if (showtimeDoc.exists()) {
                showtimeData = showtimeDoc.data();
              }
            }
            
            bookingData.push({
              seatId: seatId,
              seatData: seatData,
              movie: movieData,
              theatre: theatreData,
              showtime: showtimeData,
              totalAmount: seatData.totalAmount || 0
            });
          }
        } catch (err) {
          console.error("Error fetching booking:", err);
        }
      }
      
      setBookings(bookingData);
      setLoading(false);
    };
    
    fetchBookings();
  }, [reservedSeats]);

  const handleRemoveSeat = async (seatId) => {
    try {
      setReservedSeats((prev) => prev.filter((id) => id !== seatId));

      const index = reservedSeatsStore.indexOf(seatId);
      if (index > -1) reservedSeatsStore.splice(index, 1);

      const seatDocRef = doc(db, "seats", seatId);
      await updateDoc(seatDocRef, {
        status: "available",
        reservedBy: null,
        reservedAt: null,
      });
    } catch (err) {
      console.error("Failed to remove seat:", err);
      alert("Failed to remove seat. Try again.");
    }
  };

  const handleBuyNow = (booking) => {
    navigate("/Confirmation", {
      state: {
        seats: [booking.seatId],
        seatsData: [{
          id: booking.seatId,
          seatId: booking.seatData.seatId || booking.seatId,
          type: booking.seatData.type || "standard",
          price: booking.totalAmount || 300
        }],
        total: booking.totalAmount || 300,
        showtimeId: booking.seatData.showtimeId
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight">My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Bookings</span></h1>
          </div>
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Bookings</span></h1>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg font-bold uppercase tracking-wider">No bookings yet</p>
            <p className="text-slate-600 text-sm mt-2">Book your first movie now!</p>
            <button
              onClick={() => navigate("/movies")}
              className="mt-6 px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-black uppercase tracking-widest hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.seatId}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl hover:border-purple-500/30 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Movie Poster */}
                  <div className="flex-shrink-0 relative">
                    {booking.movie?.imageUrl ? (
                      <img
                        src={booking.movie.imageUrl}
                        alt={booking.movie.title}
                        className="w-32 h-48 object-cover rounded-xl shadow-lg"
                      />
                    ) : (
                      <div className="w-32 h-48 bg-white/10 rounded-xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                        </svg>
                      </div>
                    )}
                    {/* Payment Status Badge */}
                    <div className={`absolute -top-2 -right-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg ${
                      booking.seatData.status === "sold"
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    }`}>
                      {booking.seatData.status === "sold" ? (
                        <span className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Payment Done
                        </span>
                      ) : (
                        "Reserved"
                      )}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">{booking.movie?.title || "Unknown Movie"}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {booking.movie?.genre?.slice(0, 3).map((g, i) => (
                            <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-slate-300 uppercase">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Theatre</p>
                          <p className="text-white font-bold">{booking.theatre?.name || "Unknown"}</p>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.theatre?.location || "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-slate-400 hover:text-purple-400 transition-colors flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {booking.theatre?.location}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Showtime</p>
                          <p className="text-white font-bold">{booking.showtime?.time || "Unknown"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          booking.seatData.type === "vip"
                            ? "bg-gradient-to-br from-amber-600 to-orange-600"
                            : "bg-gradient-to-br from-purple-600 to-fuchsia-600"
                        }`}>
                          <span className="text-white font-black">{booking.seatData.seatId?.slice(-1) || booking.seatId.slice(-1)}</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seat</p>
                          <p className="text-white font-bold">{booking.seatData.seatId || booking.seatId}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info for Sold Seats */}
                    {booking.seatData.status === "sold" && (
                      <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-green-400 font-bold uppercase text-sm">Payment Completed</p>
                            <p className="text-slate-400 text-sm">Amount: रु {booking.totalAmount || 300}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                      {booking.seatData.status !== "sold" && (
                        <button
                          onClick={() => handleBuyNow(booking)}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-bold uppercase tracking-wider hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Pay Now - रु {booking.totalAmount || 300}
                        </button>
                      )}
                      <button
                        onClick={() => handleRemoveSeat(booking.seatId)}
                        className={`px-6 py-3 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                          booking.seatData.status === "sold"
                            ? "bg-white/5 text-slate-500 cursor-not-allowed"
                            : "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30"
                        }`}
                        disabled={booking.seatData.status === "sold"}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {booking.seatData.status === "sold" ? "Completed" : "Remove"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
