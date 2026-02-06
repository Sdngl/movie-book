import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { reservedSeatsStore } from "./Seats";

export default function MyBookings() {
  const [reservedSeats, setReservedSeats] = useState(reservedSeatsStore);

  const handleRemoveSeat = async (seatId) => {
    try {
      // Remove locally
      setReservedSeats((prev) => prev.filter((id) => id !== seatId));

      // Remove from global store
      const index = reservedSeatsStore.indexOf(seatId);
      if (index > -1) reservedSeatsStore.splice(index, 1);

      // Update Firestore
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

  // Helper to extract info from ID string
  const parseSeatId = (seatId) => {
    // Example ID: "show_movie_202_theatre_103_0_seat_G6"
    const parts = seatId.split("_");
    return {
      movie: parts[2],       // movie_202 -> 202
      theatre: parts[4],     // theatre_103 -> 103
      seat: parts.slice(-1)[0], // last part -> G6
    };
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 flex flex-col items-center">
      <h1 className="text-2xl font-black mb-8">My Reserved Seats</h1>

      <div className="flex flex-col gap-4 w-full max-w-3xl">
        {reservedSeats.length === 0 && (
          <p className="text-gray-400 text-center">No seats reserved yet.</p>
        )}

        {reservedSeats.map((seatId) => {
          const { movie, theatre, seat } = parseSeatId(seatId);

          return (
            <div
              key={seatId}
              className="flex justify-between items-center bg-white/[0.05] border border-white/10 rounded-xl p-4 shadow-md"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-gray-300">
                  Movie: <span className="text-white">{movie}</span>
                </span>
                <span className="text-sm font-bold text-gray-300">
                  Theatre: <span className="text-white">{theatre}</span>
                </span>
                <span className="text-sm font-bold text-gray-300">
                  Seat: <span className="text-white">{seat}</span>
                </span>
                <span className="text-sm font-bold text-blue-400 mt-1">Reserved</span>
              </div>

              <button
                onClick={() => handleRemoveSeat(seatId)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm font-bold"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
