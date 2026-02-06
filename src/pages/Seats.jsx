import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export default function Seats() {
  const { movieId, showtimeId } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const q = query(
          collection(db, "seats"),
          where("showTimeId", "==", showtimeId)
        );
        const snapshot = await getDocs(q);
        const fetchedSeats = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSeats(fetchedSeats);
      } catch (err) {
        console.error("Error fetching seats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [showtimeId]);

  const toggleSeat = (seatId, status) => {
    if (status !== "available") return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  const groupedSeats = seats.reduce((acc, seat) => {
    const row = seat.seatId.charAt(0);
    acc[row] = acc[row] || [];
    acc[row].push(seat);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0f0f]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center">

        {/* HEADER */}
        <div className="w-full flex justify-between items-center mb-16">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-white transition-colors"
          >
            ← BACK
          </button>

          <h1 className="text-2xl font-black italic tracking-widest uppercase">
            Choose Your <span className="text-purple-500">Space</span>
          </h1>

          <div className="w-10" />
        </div>

        {/* SCREEN */}
        <div className="w-full mb-20">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
          <p className="text-center text-[10px] font-bold tracking-[0.8em] text-purple-400 mt-4 uppercase">
            S C R E E N
          </p>
        </div>

        {/* GRID + LEGEND */}
        <div className="flex gap-12">

          {/* SEAT GRID */}
          <div className="flex flex-col items-center gap-4 bg-white/5 p-10 rounded-[3rem] border border-white/5 shadow-2xl">
            {Object.keys(groupedSeats).sort().map((row) => (
              <div
                key={row}
                className={`flex items-center gap-6 transition-all duration-300 ${
                  row === "G" || row === "H"
                    ? "hover:bg-purple-500/10 hover:shadow-[0_0_25px_rgba(168,85,247,0.4)] px-4 py-2 rounded-2xl"
                    : ""
                }`}
              >
                <span className="w-4 text-xs font-black text-gray-600 uppercase">
                  {row}
                </span>

                <div className="flex gap-3">
                  {groupedSeats[row].map((seat) => {
                    const isSelected = selectedSeats.includes(seat.id);
                    const isVIP = seat.type === "vip";

                    let seatClass = "";

                    if (seat.status === "sold") {
                      seatClass =
                        "bg-red-600 text-white cursor-not-allowed opacity-40 shadow-[0_0_10px_rgba(239,68,68,0.6)]";
                    } else if (seat.status === "reserved") {
                      seatClass =
                        "bg-blue-600 text-white cursor-not-allowed opacity-50 shadow-[0_0_10px_rgba(37,99,235,0.6)]";
                    } else if (isSelected) {
                      seatClass =
                        "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.6)] scale-110";
                    } else if (isVIP) {
                      seatClass =
                        "bg-purple-600 text-white shadow-[0_0_10px_rgba(147,51,234,0.5)] hover:shadow-[0_0_20px_rgba(147,51,234,0.8)]";
                    } else {
                      seatClass =
                        "bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)] hover:shadow-[0_0_20px_rgba(16,185,129,0.7)]";
                    }

                    return (
                      <button
                        key={seat.id}
                        disabled={seat.status !== "available"}
                        onClick={() => toggleSeat(seat.id, seat.status)}
                        className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all duration-300 ${seatClass}`}
                      >
                        {seat.seatId.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT LEGEND */}
          <div className="flex flex-col gap-6 bg-black/40 px-6 py-8 rounded-[2rem] border border-white/5 h-fit sticky top-32">
            <Legend label="Available" color="bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            <Legend label="VIP" color="bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.5)]" />
            <Legend label="Selected" color="bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
            <Legend label="Reserved" color="bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.6)]" />
            <Legend label="Sold" color="bg-red-600 shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
          </div>
        </div>

        {/* BOTTOM BAR */}
        {selectedSeats.length > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-white/10 backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Total Selection
              </p>
              <p className="text-xl font-black">
                {selectedSeats.length}{" "}
                <span className="text-purple-500">Seats</span>
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() =>
                  navigate("/reservation", { state: { selectedSeats } })
                }
                className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/20 hover:bg-white/10 transition-all"
              >
                Reserve
              </button>
              <button
                onClick={() =>
                  navigate("/checkout", { state: { selectedSeats } })
                }
                className="px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-purple-600 hover:bg-purple-500 transition-all active:scale-95"
              >
                Buy Now
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
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">
        {label}
      </span>
    </div>
  );
}
