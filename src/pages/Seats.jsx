import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  writeBatch,
} from "firebase/firestore";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../config/firebase";

let currentUserId = null;
const TEST_MODE = true;

// Temporary store for reserved seats for MyBookings
export let reservedSeatsStore = [];

// Seat prices
const SEAT_PRICES = {
  standard: 300,
  vip: 500,
};

export default function Seats() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  /* ===================== AUTH CHECK ===================== */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        currentUserId = currentUser.uid;
        setUser(storedUser || { displayName: currentUser.displayName, role: "user" });
      } else {
        currentUserId = null;
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  /* ===================== REAL-TIME SYNC ===================== */
  useEffect(() => {
    const q = query(
      collection(db, "seats"),
      where("showTimeId", "==", showtimeId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSeats = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSeats(fetchedSeats);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [showtimeId]);

  /* ===================== SEAT TOGGLE ===================== */
  const toggleSeat = (seat) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (seat.status === "sold") return;
    if (seat.status === "reserved" && seat.reservedBy !== currentUserId)
      return;

    setSelectedSeats((prev) =>
      prev.includes(seat.id)
        ? prev.filter((id) => id !== seat.id)
        : [...prev, seat.id]
    );

    // Optimistic UI update for seats
    setSeats((current) =>
      current.map((s) =>
        s.id === seat.id
          ? {
              ...s,
              status: selectedSeats.includes(seat.id) ? "available" : "reserved",
              reservedBy: selectedSeats.includes(seat.id) ? null : currentUserId,
            }
          : s
      )
    );
  };

  /* ===================== RESERVE LOGIC ===================== */
  const handleReserve = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (selectedSeats.length === 0) return;

    // 1. Update UI instantly
    setSeats((current) =>
      current.map((seat) =>
        selectedSeats.includes(seat.id)
          ? { ...seat, status: "reserved", reservedBy: currentUserId }
          : seat
      )
    );

    // 2. Update global store for MyBookings
    reservedSeatsStore = [...reservedSeatsStore, ...selectedSeats];
    console.log("Seats reserved and stored for MyBookings:", reservedSeatsStore);

    // 3. Clear selection
    setSelectedSeats([]);

    // 4. Firestore write (optional)
    if (!TEST_MODE) {
      const batch = writeBatch(db);
      reservedSeatsStore.forEach((id) => {
        batch.update(doc(db, "seats", id), {
          status: "reserved",
          reservedBy: currentUserId,
          reservedAt: new Date().toISOString(),
        });
      });

      try {
        await batch.commit();
      } catch (err) {
        console.error("Firestore sync failed:", err);
        alert(
          err.code === "resource-exhausted"
            ? "Firestore quota exceeded. Try fewer seats or test mode."
            : "Failed to reserve seats. Please try again."
        );
      }
    }
  };

  /* ===================== GROUP SEATS ===================== */
  const groupedSeats = seats.reduce((acc, seat) => {
    const row = seat.seatId.charAt(0);
    acc[row] = acc[row] || [];
    acc[row].push(seat);
    return acc;
  }, {});

  const sortedRows = Object.keys(groupedSeats).sort();

  /* ===================== CALCULATE TOTAL ===================== */
  const calculateTotal = () => {
    let total = 0;
    selectedSeats.forEach((seatId) => {
      const seat = seats.find((s) => s.id === seatId);
      if (seat) {
        const price = seat.type === "vip" ? SEAT_PRICES.vip : SEAT_PRICES.standard;
        total += price;
      }
    });
    return total;
  };

  /* ===================== GET SELECTED SEATS DATA ===================== */
  const getSelectedSeatsData = () => {
    return selectedSeats.map((seatId) => {
      const seat = seats.find((s) => s.id === seatId);
      return {
        id: seatId,
        seatId: seat?.seatId || seatId,
        type: seat?.type || "standard",
        price: seat?.type === "vip" ? SEAT_PRICES.vip : SEAT_PRICES.standard,
      };
    });
  };

  /* ===================== BUY NOW HANDLER ===================== */
  const handleBuyNow = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    const selectedSeatsData = getSelectedSeatsData();
    const total = calculateTotal();
    
    navigate("/Confirmation", { 
      state: { 
        seats: selectedSeats,
        seatsData: selectedSeatsData,
        total: total,
        movieId: showtimeId?.split("_")[1] || "",
        showtimeId: showtimeId
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Loading Cinema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 pt-24 pb-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* HEADER */}
        <header className="w-full flex justify-between items-center mb-16">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-all text-sm font-bold tracking-widest"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            EXIT
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter">
              Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Lux</span>
            </h1>
          </div>

          <div className="w-12" />
        </header>

        {/* SCREEN */}
        <div className="w-full max-w-3xl mb-24">
          <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-purple-600 to-transparent rounded-full shadow-[0_0_30px_rgba(147,51,234,0.8)]" />
          <p className="text-center text-[10px] tracking-[1.5em] text-slate-600 font-black mt-4">
            S C R E E N
          </p>
        </div>

        {/* SEATS GRID */}
        <div className="flex flex-col lg:flex-row gap-16 w-full justify-center items-start">
          <div className="grid gap-6 p-10 bg-white/[0.01] border border-white/[0.05] rounded-[3rem] backdrop-blur-xl shadow-inner">
            {sortedRows.map((row, rowIndex) => {
              const isVIPRow = rowIndex >= sortedRows.length - 2;

              return (
                <div key={row} className="flex items-center gap-6">
                  <span className="w-4 text-[10px] font-black text-slate-700">{row}</span>
                  <div className="flex gap-3">
                    {groupedSeats[row]
                      .sort((a, b) => a.seatId.localeCompare(b.seatId))
                      .map((seat) => {
                        const isSelected = selectedSeats.includes(seat.id);
                        const isSold = seat.status === "sold";
                        const isReserved = seat.status === "reserved";
                        const isReservedByMe = seat.reservedBy === currentUserId;
                        const isVIP = seat.type === "vip";

                        let colorClass = "bg-slate-800 border-white/5 text-slate-400";

                        if (isVIPRow && !isSold && !isReserved && !isSelected) {
                          colorClass +=
                            " hover:bg-amber-600/30 hover:border-amber-500 hover:text-amber-400 hover:shadow-[0_0_12px_rgba(245,158,11,0.4)]";
                        }

                        if (isVIP && !isSold && !isReserved && !isSelected) {
                          colorClass =
                            "bg-amber-900/20 border-amber-500/40 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]";
                        }

                        // Sold seats - RED (purchased)
                        if (isSold)
                          colorClass =
                            "bg-red-600/40 border-red-500/50 text-red-400 cursor-not-allowed shadow-[0_0_15px_rgba(220,38,38,0.4)]";

                        if (isReserved) {
                          colorClass = isReservedByMe
                            ? "bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] scale-105"
                            : "bg-slate-900 border-slate-800 text-slate-700 cursor-not-allowed opacity-20";
                        }

                        if (isSelected)
                          colorClass =
                            "bg-purple-500 border-purple-300 text-white scale-110 shadow-[0_0_20px_rgba(168,85,247,0.6)]";

                        return (
                          <button
                            key={seat.id}
                            disabled={isSold || (isReserved && !isReservedByMe)}
                            onClick={() => toggleSeat(seat)}
                            className={`w-10 h-10 rounded-xl text-[10px] font-black border transition-all duration-200 active:scale-90 ${colorClass}`}
                          >
                            {seat.seatId.slice(1)}
                          </button>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* LEGEND */}
          <div className="w-full lg:w-64">
            <div className="p-8 bg-white/[0.02] border border-white/10 rounded-[2rem] space-y-5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Legend
              </h4>
              <Legend color="bg-slate-800" label="Standard (रु 300)" />
              <Legend color="bg-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.5)]" label="VIP (रु 500)" />
              <Legend color="bg-purple-500" label="Selecting" />
              <Legend color="bg-blue-600" label="Reserved" />
              <Legend color="bg-red-600" label="Sold" />
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        {selectedSeats.length > 0 && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl bg-slate-900/90 backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl flex justify-between items-center z-50">
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase">Selection</p>
              <h2 className="text-2xl font-black text-white">
                {selectedSeats.length} <span className="text-purple-500">Seats</span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">Total: रु {calculateTotal()}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleReserve}
                className="px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 transition-all"
              >
                Reserve
              </button>
              <button
                onClick={handleBuyNow}
                className="px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-xl hover:shadow-purple-500/30 transition-all"
              >
                Buy Now - रु {calculateTotal()}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-[10px] font-bold text-slate-400 uppercase">{label}</span>
    </div>
  );
}
