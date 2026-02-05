// src/seed/seedData.js
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "../config/Firebase";

// Movies data
const MOVIES = [
  { id: "movie_201", title: "The Wrecking Crew", genre: ["Action","Comedy"], rating: 6.5, synopsis: "Estranged half-brothers reunite to unravel corruption and mystery in Hawaii.", duration: 122, status: "now_showing" },
  { id: "movie_202", title: "Greenland 2", genre: ["Action","Thriller"], rating: 7.0, synopsis: "After surviving a comet disaster, the family faces a new global threat.", duration: 115, status: "coming_soon" },
  { id: "movie_203", title: "Zootopia 2", genre: ["Animation","Adventure","Family"], rating: 8.7, synopsis: "Judy and Nick crack a new dangerous case across Zootopia.", duration: 110, status: "coming_soon" },
  { id: "movie_204", title: "96 Minutes", genre: ["Thriller"], rating: 6.5, synopsis: "A tense thriller where every minute counts.", duration: 96, status: "now_showing" },
  { id: "movie_205", title: "The Shadow’s Edge", genre: ["Action","Thriller"], rating: 7.0, synopsis: "A gritty thriller of crime and shadows.", duration: 105, status: "now_showing" },
  { id: "movie_206", title: "Top Gun: Maverick", genre: ["Action","Drama"], rating: 8.3, synopsis: "Maverick mentors new pilots while facing his past.", duration: 131, status: "now_showing" },
  { id: "movie_207", title: "John Wick: Chapter 4", genre: ["Action","Crime"], rating: 7.8, synopsis: "John Wick faces the High Table and new adversaries.", duration: 169, status: "now_showing" },
  { id: "movie_208", title: "Mad Max: Fury Road", genre: ["Action","Adventure"], rating: 8.1, synopsis: "A wild race for survival in a post-apocalyptic wasteland.", duration: 120, status: "now_showing" },
  { id: "movie_209", title: "Oppenheimer", genre: ["Drama","History"], rating: 8.9, synopsis: "The story of J. Robert Oppenheimer and the atomic bomb.", duration: 180, status: "coming_soon" },
  { id: "movie_210", title: "The Batman", genre: ["Action","Crime"], rating: 8.3, synopsis: "Batman investigates corruption and confronts a serial cryptic killer.", duration: 176, status: "now_showing" },
  { id: "movie_211", title: "Dune: Part Two", genre: ["Sci-Fi","Adventure"], rating: 8.9, synopsis: "Paul Atreides leads a war against the Harkonnens.", duration: 165, status: "coming_soon" },
  { id: "movie_212", title: "Spider-Man: Across the Spider-Verse", genre: ["Animation","Action"], rating: 8.8, synopsis: "Miles Morales traverses the multiverse with other Spider-People.", duration: 140, status: "now_showing" }
];

// Theatres data
const THEATRES = [
  { id: "theatre_101", name: "QFX Cinemas (City Square)", location: "New Baneshwor, Kathmandu" },
  { id: "theatre_102", name: "Big Movies (City Centre)", location: "Kamalpokhari, Kathmandu" },
  { id: "theatre_103", name: "iNi Cinemas (Lotse Mall)", location: "Gongabu Buspark, Kathmandu" },
  { id: "theatre_104", name: "Ranjana Cineplex", location: "New Road, Kathmandu" },
  { id: "theatre_105", name: "FCube Cinemas (KL Tower)", location: "Chabahil, Kathmandu" },
  { id: "theatre_106", name: "One Cinemas (Kalimati)", location: "Kalimati, Kathmandu" },
  { id: "theatre_107", name: "BSR Movies", location: "Kathmandu" },
  { id: "theatre_108", name: "Bishwojyoti Cineplex", location: "Jamal, Kathmandu" }
];

// Define showtimes for each day
const SHOWTIMES_HOURS = ["12:00", "15:00", "18:00"]; // Add or change as needed

// Dynamically generate showtimes
const SHOWTIMES = [];

MOVIES.forEach((movie, movieIndex) => {
  THEATRES.forEach((theatre, theatreIndex) => {
    SHOWTIMES_HOURS.forEach((time, timeIndex) => {
      SHOWTIMES.push({
        id: `show_${movie.id.split("_")[1]}_${theatreIndex * SHOWTIMES_HOURS.length + timeIndex + 1}`,
        movieId: movie.id,
        theatreId: theatre.id,
        time
      });
    });
  });
});

// Generate seats
function generateSeats(showTimeId) {
  const seats = [];
  const rows = ['A','B','C','D','E','F','G','H'];

  rows.forEach(row => {
    for (let col = 1; col <= 8; col++) {
      seats.push({
        id: `${showTimeId}_seat_${row}${col}`,
        seatId: `${row}${col}`,
        status: 'available',
        lockedBy: null,
        lockedAt: null,
        bookingId: null,
        type: (row === 'A' || row === 'B') ? 'VIP' : 'regular'
      });
    }
  });

  return seats;
}

export async function seedFirestore() {
  const movieRef = collection(db, "movies");
  const existingMovies = await getDocs(movieRef);

  if (!existingMovies.empty) {
    console.log("Movies already seeded");
    return;
  }

  console.log("Seeding new data...");

  // Seed movies
  for (const movie of MOVIES) {
    await setDoc(doc(db, "movies", movie.id), movie);
  }

  // Seed theatres
  for (const theatre of THEATRES) {
    await setDoc(doc(db, "theatres", theatre.id), theatre);
  }

  // Seed showtimes
  for (const showtime of SHOWTIMES) {
    await setDoc(doc(db, "showtimes", showtime.id), showtime);
  }

  // Seed seats for each showtime
  for (const show of SHOWTIMES) {
    const seats = generateSeats(show.id);
    for (const seat of seats) {
      await setDoc(doc(db, "seats", seat.id), seat);
    }
  }

  console.log("Done seeding all movie data.");
}
