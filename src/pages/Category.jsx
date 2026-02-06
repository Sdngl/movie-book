import React from "react";

export default function Category() {
  const categories = [
    { name: "Action", icon: "🔥", count: 24 },
    { name: "Comedy", icon: "😂", count: 18 },
    { name: "Drama", icon: "🎭", count: 32 },
    { name: "Horror", icon: "👻", count: 15 },
    { name: "Sci-Fi", icon: "🚀", count: 21 },
    { name: "Romance", icon: "💕", count: 12 },
    { name: "Thriller", icon: "😱", count: 19 },
    { name: "Animation", icon: "🎬", count: 8 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Category</span></h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:border-purple-500/50 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-4">{cat.icon}</div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{cat.name}</h3>
              <p className="text-slate-500 text-sm mt-1">{cat.count} movies</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
