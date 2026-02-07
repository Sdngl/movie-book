// src/seed/seedData.js
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

/* ========================= IMAGE BASE (HIGH QUALITY) ========================= */
const TMDB_BASE = "https://image.tmdb.org/t/p/original";

/* ========================= MOVIES ========================= */
const MOVIES = [
  { id: "movie_201", title: "The Wrecking Crew", genre: ["Action", "Comedy", "Crime"], rating: 6.779, synopsis: "Estranged half-brothers Jonny and James reunite after their father's mysterious death...", duration: 122, status: "now_showing", imageUrl: `${TMDB_BASE}/gbVwHl4YPSq6BcC92TQpe7qUTh6.jpg` },
  { id: "movie_202", title: "Greenland 2: Migration", genre: ["Adventure", "Thriller", "Sci-Fi"], rating: 6.463, synopsis: "Having found safety in the Greenland bunker, the Garrity family must now risk everything...", duration: 115, status: "now_showing", imageUrl: `${TMDB_BASE}/1mF4othta76CEXcL1YFInYudQ7K.jpg` },
  { id: "movie_203", title: "Zootopia 2", genre: ["Animation", "Comedy", "Adventure", "Family", "Mystery"], rating: 7.6, synopsis: "Judy Hopps and Nick Wilde uncover a new mystery that shakes Zootopia to its core.", duration: 110, status: "now_showing", imageUrl: `${TMDB_BASE}/oJ7g2CifqpStmoYQyaLQgEU32qO.jpg` },
  { id: "movie_204", title: "The Shadow's Edge", genre: ["Action", "Crime", "Drama", "Thriller"], rating: 7.157, synopsis: "Macau police bring a retired tracking expert back to stop a professional crime ring.", duration: 105, status: "now_showing", imageUrl: `${TMDB_BASE}/e0RU6KpdnrqFxDKlI3NOqN8nHL6.jpg` },
  { id: "movie_205", title: "The Housemaid", genre: ["Mystery", "Thriller"], rating: 7.098, synopsis: "A live-in housemaid uncovers dark secrets behind a wealthy family's perfect image.", duration: 100, status: "now_showing", imageUrl: `${TMDB_BASE}/cWsBscZzwu5brg9YjNkGewRUvJX.jpg` },
  { id: "movie_206", title: "Oscar Shaw", genre: ["Action", "Crime", "Thriller"], rating: 5.8, synopsis: "A retired detective returns for one last mission of vengeance and redemption.", duration: 110, status: "coming_soon", imageUrl: `${TMDB_BASE}/tsE3nySukwrfUjouz8vzvKTcXNC.jpg` },
  { id: "movie_207", title: "Anaconda", genre: ["Adventure", "Comedy", "Horror"], rating: 5.858, synopsis: "A jungle filmmaking trip turns deadly when nature and criminals strike back.", duration: 120, status: "now_showing", imageUrl: `${TMDB_BASE}/qxMv3HwAB3XPuwNLMhVRg795Ktp.jpg` },
  { id: "movie_208", title: "96 Minutes", genre: ["Action", "Crime", "Romance"], rating: 6.381, synopsis: "A bomb threat aboard a high-speed train tests courage, love, and intelligence.", duration: 96, status: "now_showing", imageUrl: `${TMDB_BASE}/gWKZ1iLhukvLoh8XY2N4tMvRQ2M.jpg` },
  { id: "movie_209", title: "Murder at the Embassy", genre: ["Mystery", "Thriller", "Action"], rating: 5.5, synopsis: "A closed-room murder inside the British Embassy sparks a global conspiracy.", duration: 110, status: "now_showing", imageUrl: `${TMDB_BASE}/3DBmBItPdy0A2ol59jgHhS54Lua.jpg` },
  { id: "movie_210", title: "The Internship", genre: ["Action"], rating: 6, synopsis: "A secret assassin program unleashes its deadliest graduates.", duration: 115, status: "coming_soon", imageUrl: `${TMDB_BASE}/fYqSOkix4rbDiZW0ACNnvZCpT6X.jpg` },
  { id: "movie_211", title: "Avatar: Fire and Ash", genre: ["Sci-Fi", "Adventure", "Fantasy"], rating: 7.295, synopsis: "Jake Sully faces a brutal new Na’vi tribe in the aftermath of devastating loss.", duration: 160, status: "now_showing", imageUrl: `${TMDB_BASE}/5bxrxnRaxZooBAxgUVBZ13dpzC7.jpg` },
  { id: "movie_212", title: "Predator: Badlands", genre: ["Action", "Sci-Fi", "Adventure"], rating: 7.752, synopsis: "A young Predator teams up with a damaged android in hostile territory.", duration: 130, status: "now_showing", imageUrl: `${TMDB_BASE}/pHpq9yNUIo6aDoCXEBzjSolywgz.jpg` },
];

/* ========================= THEATRES ========================= */
const THEATRES = [
  { id: "theatre_101", name: "QFX Cinemas (City Square)", location: "New Baneshwor, Kathmandu" },
  { id: "theatre_102", name: "Big Movies (City Centre)", location: "Kamalpokhari, Kathmandu" },
  { id: "theatre_103", name: "iNi Cinemas (Lotse Mall)", location: "Gongabu Buspark, Kathmandu" },
  { id: "theatre_104", name: "Ranjana Cineplex", location: "New Road, Kathmandu" },
  { id: "theatre_105", name: "FCube Cinemas (KL Tower)", location: "Chabahil, Kathmandu" },
  { id: "theatre_106", name: "One Cinemas (Kalimati)", location: "Kalimati, Kathmandu" },
  { id: "theatre_107", name: "BSR Movies", location: "Kathmandu" },
  { id: "theatre_108", name: "Bishwojyoti Cineplex", location: "Jamal, Kathmandu" },
];

/* ========================= SHOWTIMES ========================= */
const SHOWTIMES_HOURS = ["12:00", "15:00", "18:00"];

/* ========================= SEATS ========================= */
function generateSeats(showTimeId) {
  const seats = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  rows.forEach((row) => {
    for (let col = 1; col <= 8; col++) {
      seats.push({
        id: `${showTimeId}_seat_${row}${col}`,
        showTimeId,
        seatId: `${row}${col}`,
        status: "available",
        lockedBy: null,
        lockedAt: null,
        bookingId: null,
        type: row === "A" || row === "B" ? "VIP" : "regular",
      });
    }
  });
  return seats;
}

/* ========================= SEED FIRESTORE SAFELY ========================= */
export async function seedFirestoreSafe(batchSize = 3) {
  console.log("Seeding missing showtimes and seats safely...");

  try {
    // 1️⃣ Seed movies & theatres (merge ensures no duplicates)
    for (const movie of MOVIES) {
      await setDoc(doc(db, "movies", movie.id), movie, { merge: true });
    }
    for (const theatre of THEATRES) {
      await setDoc(doc(db, "theatres", theatre.id), theatre, { merge: true });
    }

    // 2️⃣ Seed showtimes & seats in batches
    let startIndex = 3; // Start from 4th movie
    while (startIndex < MOVIES.length) {
      const batchMovies = MOVIES.slice(startIndex, startIndex + batchSize);

      for (const movie of batchMovies) {
        for (const theatre of THEATRES) {
          for (let idx = 0; idx < SHOWTIMES_HOURS.length; idx++) {
            const time = SHOWTIMES_HOURS[idx];
            const showtimeId = `show_${movie.id}_${theatre.id}_${idx}`;
            const showtimeRef = doc(db, "showtimes", showtimeId);
            const showtimeSnap = await getDoc(showtimeRef);

            if (!showtimeSnap.exists()) {
              // Seed showtime
              await setDoc(showtimeRef, { id: showtimeId, movieId: movie.id, theatreId: theatre.id, time });

              // Seed seats
              const seats = generateSeats(showtimeId);
              for (const seat of seats) {
                await setDoc(doc(db, "seats", seat.id), seat);
              }

              console.log(`✅ Seeded showtime & seats: ${showtimeId}`);
            } else {
              console.log(`⏭ Showtime already exists: ${showtimeId}`);
            }
          }
        }
      }

      console.log(`✅ Batch seeded movies ${startIndex + 1} to ${startIndex + batchMovies.length}`);
      startIndex += batchSize;
    }

    console.log("🎬 Missing showtimes & seats seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding Firestore:", error);
  }
}
