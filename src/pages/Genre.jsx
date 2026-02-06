import React from "react";

export default function Genre() {
  const genres = [
    { name: "Action", color: "from-red-500 to-orange-500", movies: 45 },
    { name: "Adventure", color: "from-green-500 to-emerald-500", movies: 32 },
    { name: "Comedy", color: "from-yellow-500 to-amber-500", movies: 28 },
    { name: "Crime", color: "from-gray-600 to-gray-800", movies: 19 },
    { name: "Drama", color: "from-purple-500 to-violet-500", movies: 52 },
    { name: "Fantasy", color: "from-pink-500 to-rose-500", movies: 15 },
    { name: "Horror", color: "from-red-700 to-red-900", movies: 22 },
    { name: "Mystery", color: "from-indigo-500 to-blue-500", movies: 18 },
    { name: "Romance", color: "from-pink-400 to-red-400", movies: 35 },
    { name: "Sci-Fi", color: "from-cyan-500 to-blue-500", movies: 27 },
    { name: "Thriller", color: "from-slate-500 to-slate-700", movies: 41 },
    { name: "Animation", color: "from-orange-400 to-yellow-500", movies: 12 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Genres</span></h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {genres.map((genre) => (
            <div
              key={genre.name}
              className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-white/20 transition-all cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${genre.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2">{genre.name}</h3>
                <p className="text-slate-500 text-sm">{genre.movies} movies</p>
              </div>
              <div className="absolute bottom-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <text x="10" y="80" fontSize="80" fill="currentColor">{genre.name[0]}</text>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
