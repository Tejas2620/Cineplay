import React, { useState, useEffect, useRef } from 'react';
import axios from '../../utils/axios';
import { useNavigate } from 'react-router-dom';

const INTERVAL = 10000;
const CATEGORIES = [
  {
    label: 'Trending Movies Today',
    endpoint: '/trending/movie/day',
    type: 'movie',
  },
  {
    label: 'Trending Movies This Week',
    endpoint: '/trending/movie/week',
    type: 'movie',
  },
  {
    label: 'Trending TV Shows Today',
    endpoint: '/trending/tv/day',
    type: 'tv',
  },
  {
    label: 'Trending TV Shows This Week',
    endpoint: '/trending/tv/week',
    type: 'tv',
  },
  {
    label: 'Popular Movies',
    endpoint: '/movie/popular',
    type: 'movie',
  },
  {
    label: 'Popular TV Shows',
    endpoint: '/tv/popular',
    type: 'tv',
  },
];

const Header = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();

  // Fetch banners for all categories
  useEffect(() => {
    const fetchBanners = async () => {
      const all = await Promise.all(
        CATEGORIES.map(async (cat) => {
          const res = await axios.get(cat.endpoint);
          return res.data.results[0]; // Get top result for each category
        })
      );
      setBanners(all);
    };
    fetchBanners();
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [banners]);

  // Play trailer handler
  const handlePlay = async () => {
    const banner = banners[current];
    if (!banner) return;
    // Fetch videos for the current banner
    const res = await axios.get(
      `/${banner.media_type || banner.type}/${banner.id}/videos`
    );
    const trailer = res.data.results.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube'
    );
    if (trailer) {
      setTrailerKey(trailer.key);
      setShowTrailer(true);
    } else {
      setTrailerKey(null);
      setShowTrailer(true);
    }
  };

  // More Info handler
  const handleMoreInfo = () => {
    const banner = banners[current];
    if (!banner) return;
    navigate(`/${banner.media_type || banner.type}/${banner.id}`);
  };

  const banner = banners[current];

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center bg-black">
      {banner && (
        <div className="absolute inset-0 flex flex-col items-start justify-center px-12 z-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            {banner.title || banner.name}
          </h1>
          <p className="text-zinc-300 max-w-xl mb-6">{banner.overview}</p>
          <div className="flex gap-4">
            <button
              className="bg-white text-black px-8 py-3 rounded-full font-bold shadow-xl hover:bg-[#6556CD] hover:text-white transition-all"
              onClick={handlePlay}
            >
              <i className="ri-play-fill text-2xl"></i> Play
            </button>
            <button
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold shadow-xl hover:bg-white/10 transition-all"
              onClick={handleMoreInfo}
            >
              <i className="ri-information-line text-2xl"></i> More Info
            </button>
          </div>
        </div>
      )}
      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred, dark overlay */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setShowTrailer(false)}
          />
          {/* Modal content */}
          <div className="relative bg-zinc-900 rounded-2xl shadow-2xl p-0 w-full max-w-2xl animate-fade-in">
            <button
              className="absolute top-3 right-3 text-white text-2xl bg-zinc-800 rounded-full p-2 hover:bg-[#6556CD] transition"
              onClick={() => setShowTrailer(false)}
              aria-label="Close"
            >
              &times;
            </button>
            {trailerKey ? (
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Trailer"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="rounded-b-2xl"
              ></iframe>
            ) : (
              <div className="text-white text-center py-20">
                No trailer available.
              </div>
            )}
          </div>
          <style>
            {`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }
        .animate-fade-in { animation: fade-in 0.4s ease; }
      `}
          </style>
        </div>
      )}
      {/* Banner background image */}
      {banner?.backdrop_path && (
        <img
          src={`https://image.tmdb.org/t/p/original${banner.backdrop_path}`}
          alt={banner.title || banner.name}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      )}
    </div>
  );
};

export default Header;
