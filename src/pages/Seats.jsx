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

  /* ---------------- FETCH SEATS ---------------- */
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

  /* ---------------- SEAT TOGGLE ---------------- */
  const toggleSeat = (seatId, status) => {
    if (status !== "available") return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((id) => id !== seatId)
        : [...prev, seatId]
    );
  };

  /* ---------------- GROUP BY ROW ---------------- */
  const groupedSeats = seats.reduce((acc, seat) => {
    const row = seat.seatId.charAt(0);
    acc[row] = acc[row] || [];
    acc[row].push(seat);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading seats...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-gray-800 px-6 py-12 text-white">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold tracking-wide">
            Choose Your Seats
          </h1>
        </div>

        {/* SCREEN */}
        <div className="relative">
          <div className="h-2 bg-gradient-to-r from-gray-700 via-gray-300 to-gray-700 rounded-full mb-4" />
          <p className="text-center text-xs text-gray-400 tracking-widest">
            SCREEN
          </p>
        </div>

        {/* SEATS */}
        <div className="space-y-4">
          {Object.keys(groupedSeats)
            .sort()
            .map((row) => (
              <div key={row} className="flex items-center gap-4">
                <span className="w-6 text-gray-400 font-semibold">{row}</span>

                <div className="grid grid-cols-8 gap-3">
                  {groupedSeats[row].map((seat) => {
                    const isSelected = selectedSeats.includes(seat.id);

                    let seatColor = "bg-green-600 hover:bg-green-500"; // Available
                    if (seat.status === "sold") seatColor = "bg-red-600";
                    if (seat.status === "reserved") seatColor = "bg-blue-600";
                    if (isSelected) seatColor = "bg-yellow-400 text-black";

                    return (
                      <button
                        key={seat.id}
                        disabled={seat.status !== "available"}
                        onClick={() => toggleSeat(seat.id, seat.status)}
                        className={`w-11 h-11 rounded-md text-xs font-bold transition
                          ${seatColor}
                          ${
                            seat.status !== "available"
                              ? "cursor-not-allowed opacity-70"
                              : "hover:scale-105"
                          }`}
                      >
                        {seat.seatId.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

        {/* LEGEND */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
          <Legend color="bg-green-600" label="Available" />
          <Legend color="bg-yellow-400" label="Selected" text="text-black" />
          <Legend color="bg-red-600" label="Sold Out" />
          <Legend color="bg-blue-600" label="Reserved" />
        </div>

        {/* ACTION BAR */}
        {selectedSeats.length > 0 && (
          <div className="sticky bottom-6 bg-gray-900/90 backdrop-blur p-5 rounded-xl flex justify-between items-center shadow-lg">
            <p className="text-lg">
              Selected Seats:{" "}
              <span className="font-bold text-yellow-400">
                {selectedSeats.length}
              </span>
            </p>

            <button
              onClick={() => navigate("/confirmation")}
              className="bg-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Continue →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- LEGEND COMPONENT ---------------- */
function Legend({ color, label, text = "text-white" }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 rounded ${color}`} />
      <span className={text}>{label}</span>
    </div>
  );
}
