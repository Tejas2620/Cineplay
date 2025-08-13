import React from 'react';
import { Link } from 'react-router-dom';

const Sidenav = () => {
  return (
    <div className="w-[260px] h-full bg-gradient-to-b from-[#1F1E24] to-[#2A2A35] border-r border-zinc-800 p-6 flex flex-col relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-32 h-32 bg-[#6556CD] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-5 w-24 h-24 bg-[#8B5CF6] rounded-full blur-2xl"></div>
      </div>

      {/* Logo Section */}
      <div className="flex items-center mb-10 relative z-10">
        <div className="w-12 h-12 bg-gradient-to-br from-[#6556CD] to-[#8B5CF6] rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-[#6556CD]/25">
          <i className="ri-tv-fill text-white text-xl"></i>
        </div>
        <div>
          <h1 className="text-2xl text-white font-bold">Cineplay</h1>
          <p className="text-zinc-400 text-xs">Stream & Discover</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 relative z-10 space-y-6">
        <div>
          <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-4 flex items-center">
            <div className="w-1 h-4 bg-gradient-to-b from-[#6556CD] to-[#8B5CF6] rounded-full mr-2"></div>
            Discover
          </h2>
          <div className="space-y-2">
            <Link
              to="/"
              className="flex items-center px-4 py-3 text-zinc-300 hover:bg-gradient-to-r hover:from-[#6556CD]/20 hover:to-[#8B5CF6]/20 hover:text-white rounded-lg transition-all duration-300 group border border-transparent hover:border-[#6556CD]/30"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <i className="ri-home-fill text-white text-sm"></i>
              </div>
              <span className="font-medium text-sm">Home</span>
            </Link>

            <Link
              to="/trending"
              className="flex items-center px-4 py-3 text-zinc-300 hover:bg-gradient-to-r hover:from-[#6556CD]/20 hover:to-[#8B5CF6]/20 hover:text-white rounded-lg transition-all duration-300 group border border-transparent hover:border-[#6556CD]/30"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <i className="ri-fire-fill text-white text-sm"></i>
              </div>
              <span className="font-medium text-sm">Trending</span>
            </Link>

            <Link
              to="/popular"
              className="flex items-center px-4 py-3 text-zinc-300 hover:bg-gradient-to-r hover:from-[#6556CD]/20 hover:to-[#8B5CF6]/20 hover:text-white rounded-lg transition-all duration-300 group border border-transparent hover:border-[#6556CD]/30"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <i className="ri-star-fill text-white text-sm"></i>
              </div>
              <span className="font-medium text-sm">Popular</span>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-4 flex items-center">
            <div className="w-1 h-4 bg-gradient-to-b from-[#6556CD] to-[#8B5CF6] rounded-full mr-2"></div>
            Content
          </h2>
          <div className="space-y-2">
            <Link
              to="/movies"
              className="flex items-center px-4 py-3 text-zinc-300 hover:bg-gradient-to-r hover:from-[#6556CD]/20 hover:to-[#8B5CF6]/20 hover:text-white rounded-lg transition-all duration-300 group border border-transparent hover:border-[#6556CD]/30"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <i className="ri-movie-2-fill text-white text-sm"></i>
              </div>
              <span className="font-medium text-sm">Movies</span>
            </Link>

            <Link
              to="/tv-shows"
              className="flex items-center px-4 py-3 text-zinc-300 hover:bg-gradient-to-r hover:from-[#6556CD]/20 hover:to-[#8B5CF6]/20 hover:text-white rounded-lg transition-all duration-300 group border border-transparent hover:border-[#6556CD]/30"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <i className="ri-tv-line text-white text-sm"></i>
              </div>
              <span className="font-medium text-sm">TV Shows</span>
            </Link>

            <Link
              to="/people"
              className="flex items-center px-4 py-3 text-zinc-300 hover:bg-gradient-to-r hover:from-[#6556CD]/20 hover:to-[#8B5CF6]/20 hover:text-white rounded-lg transition-all duration-300 group border border-transparent hover:border-[#6556CD]/30"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                <i className="ri-user-star-fill text-white text-sm"></i>
              </div>
              <span className="font-medium text-sm">People</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-zinc-800/50 pt-6 relative z-10">
        <div className="space-y-2 mb-4">
          <Link
            to="/about"
            className="flex items-center px-4 py-3 text-zinc-300 hover:bg-gradient-to-r hover:from-[#6556CD]/20 hover:to-[#8B5CF6]/20 hover:text-white rounded-lg transition-all duration-300 group border border-transparent hover:border-[#6556CD]/30"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-gray-500 to-zinc-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
              <i className="ri-information-line text-white text-sm"></i>
            </div>
            <span className="font-medium text-sm">About</span>
          </Link>

          <Link
            to="/contact"
            className="flex items-center px-4 py-3 text-zinc-300 hover:bg-gradient-to-r hover:from-[#6556CD]/20 hover:to-[#8B5CF6]/20 hover:text-white rounded-lg transition-all duration-300 group border border-transparent hover:border-[#6556CD]/30"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
              <i className="ri-mail-line text-white text-sm"></i>
            </div>
            <span className="font-medium text-sm">Contact Us</span>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="p-4 bg-gradient-to-r from-[#6556CD]/10 to-[#8B5CF6]/10 rounded-lg border border-[#6556CD]/20">
          <div className="flex justify-between items-center text-xs text-zinc-400 mb-2">
            <span>Movies: 50K+</span>
            <span>Shows: 25K+</span>
          </div>
          <div className="w-full bg-zinc-700 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-[#6556CD] to-[#8B5CF6] h-1.5 rounded-full"
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidenav;
