import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { seats = [], seatsData = [], total = 0, showtimeId = "" } = location.state || {};
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [theatre, setTheatre] = useState(null);
  const [user, setUser] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || JSON.parse(localStorage.getItem("user")));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      if (showtimeId) {
        try {
          const showtimeDoc = await getDoc(doc(db, "showtimes", showtimeId));
          if (showtimeDoc.exists()) {
            const showtimeData = showtimeDoc.data();
            setShowtime(showtimeData);

            const movieDoc = await getDoc(doc(db, "movies", showtimeData.movieId));
            if (movieDoc.exists()) {
              setMovie(movieDoc.data());
            }

            const theatreDoc = await getDoc(doc(db, "theatres", showtimeData.theatreId));
            if (theatreDoc.exists()) {
              setTheatre(theatreDoc.data());
            }
          }
        } catch (err) {
          console.error("Error fetching details:", err);
        }
      }
    };

    fetchDetails();
  }, [showtimeId]);

  // Calculate breakdown
  const standardCount = seatsData.filter(s => s.type === "standard").length;
  const vipCount = seatsData.filter(s => s.type === "vip").length;
  const standardTotal = standardCount * 300;
  const vipTotal = vipCount * 500;
  const tax = Math.round(total * 0.13);
  const grandTotal = total + tax;

  const handlePayment = async () => {
    setProcessing(true);
    
    // 10 seconds processing
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Update seat statuses to sold
    for (const seatId of seats) {
      await updateDoc(doc(db, "seats", seatId), {
        status: "sold",
        bookedBy: user?.uid || "guest",
        bookedAt: new Date().toISOString(),
        paymentStatus: "completed",
        movieId: showtime?.movieId,
        theatreId: showtime?.theatreId,
        showtimeId: showtimeId,
        totalAmount: grandTotal
      });
    }
    
    setProcessing(false);
    setShowSuccessPopup(true);
  };

  const handleContinue = () => {
    setShowSuccessPopup(false);
    navigate("/");
  };

  if (seats.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-16 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">No Booking Found</h2>
          <p className="text-slate-400 mb-8">You haven't selected any seats yet.</p>
          <button
            onClick={() => navigate("/movies")}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-black uppercase tracking-widest hover:shadow-lg hover:shadow-purple-500/30 transition-all"
          >
            Browse Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-2">
              Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Payment</span>
            </h1>
            <p className="text-slate-400">Review your booking details and proceed to payment</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Movie & Theatre Info */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <div className="flex items-start gap-4">
                  {movie?.imageUrl && (
                    <img 
                      src={movie.imageUrl} 
                      alt={movie.title}
                      className="w-24 h-36 object-cover rounded-xl"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{movie?.title || "Loading..."}</h2>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {movie?.genre?.slice(0, 3).map((g, i) => (
                        <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-xs font-bold text-slate-300 uppercase">
                          {g}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {movie?.duration} mins
                      </span>
                      <span className="w-1 h-1 bg-slate-600 rounded-full" />
                      <span className="text-yellow-400 flex items-center gap-1">
                        ★ {movie?.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Showtime & Theatre */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Theatre</p>
                      <p className="text-lg font-bold text-white">{theatre?.name || "Loading..."}</p>
                      <p className="text-sm text-slate-400">{theatre?.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Showtime</p>
                      <p className="text-lg font-bold text-white">{showtime?.time || "Loading..."}</p>
                      <p className="text-sm text-slate-400">Today</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reserved Seats */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Selected Seats</p>
                <div className="flex flex-wrap gap-3">
                  {seatsData.map((seat) => (
                    <div
                      key={seat.id}
                      className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                        seat.type === "vip"
                          ? "bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 text-amber-400"
                          : "bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 border border-purple-500/30 text-purple-400"
                      }`}
                    >
                      <span>{seat.seatId}</span>
                      <span className="text-xs opacity-60">रु {seat.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Payment Method</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: "card", name: "Card", icon: "💳" },
                    { id: "esewa", name: "eSewa", icon: "📱" },
                    { id: "khalti", name: "Khalti", icon: "⚡" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 rounded-xl border transition-all ${
                        paymentMethod === method.id
                          ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 border-transparent text-white"
                          : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-2xl mb-2 block">{method.icon}</span>
                      <span className="text-sm font-bold">{method.name}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Expiry</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl sticky top-24">
                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Order Summary</h3>
                
                <div className="pb-6 border-b border-white/10 mb-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Customer</p>
                  <p className="text-white font-bold">{user?.displayName || "Guest"}</p>
                  <p className="text-sm text-slate-400">{user?.email}</p>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                  {standardCount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Standard × {standardCount}</span>
                      <span className="text-white font-bold">रु {standardTotal}</span>
                    </div>
                  )}
                  {vipCount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-amber-400">VIP × {vipCount}</span>
                      <span className="text-white font-bold">रु {vipTotal}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white font-bold">रु {total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Tax (13%)</span>
                    <span className="text-white font-bold">रु {tax}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase tracking-wider">Total</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">
                      रु {grandTotal}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className={`w-full py-4 rounded-xl text-white font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    processing
                      ? "bg-slate-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:shadow-lg hover:shadow-purple-500/30"
                  }`}
                >
                  {processing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing... (10s)
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Pay Now
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-500 text-center mt-4">
                  Secure payment powered by CineLoop
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleContinue} />
          <div className="relative bg-[#0a0a0f] border border-white/10 rounded-3xl p-8 max-w-md w-full backdrop-blur-xl shadow-2xl">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
                Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Done!</span>
              </h2>
              <p className="text-slate-400 mb-6">Your tickets have been booked successfully.</p>
              <button
                onClick={handleContinue}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-xl text-white font-black uppercase tracking-widest hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
