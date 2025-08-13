import React, { useState, useEffect, useRef } from 'react';
import axios from '../../utils/axios';

const INTERVAL = 10000; // 10 seconds per banner
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
  const [categoryIdx, setCategoryIdx] = useState(() =>
    Math.floor(Math.random() * CATEGORIES.length)
  );
  const [loading, setLoading] = useState(true);
  const [contentAnim, setContentAnim] = useState(false);
  const intervalRef = useRef(null);

  // Fetch banners for the current category
  useEffect(() => {
    let isMounted = true;
    async function fetchBanners() {
      setLoading(true);
      try {
        const { data } = await axios.get(CATEGORIES[categoryIdx].endpoint);
        if (isMounted && data.results && data.results.length > 0) {
          const bannersArr = data.results.slice(0, 6);
          setBanners(bannersArr);
          // Pick a random banner index on first load of a new category
          setCurrent(Math.floor(Math.random() * bannersArr.length));
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchBanners();
    return () => {
      isMounted = false;
    };
  }, [categoryIdx]);

  // Auto-slide and auto-category switch
  useEffect(() => {
    if (banners.length === 0) return;
    intervalRef.current = setInterval(() => {
      handleNext();
    }, INTERVAL);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [banners, current]);

  // Animate content entrance
  useEffect(() => {
    setContentAnim(false);
    const timeout = setTimeout(() => setContentAnim(true), 100);
    return () => clearTimeout(timeout);
  }, [current, categoryIdx]);

  const handleNext = () => {
    if (current < banners.length - 1) {
      setCurrent((prev) => prev + 1);
    } else {
      setCategoryIdx((prev) => (prev + 1) % CATEGORIES.length);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1);
    } else {
      setCategoryIdx(
        (prev) => (prev - 1 + CATEGORIES.length) % CATEGORIES.length
      );
    }
  };

  const handleDot = (idx) => {
    if (idx === current) return;
    setCurrent(idx);
  };

  if (loading || banners.length === 0) {
    return (
      <div className="w-full h-[55vh] flex items-center justify-center bg-zinc-900 text-white text-xl">
        Loading...
      </div>
    );
  }

  const banner = banners[current];
  const year = banner.release_date
    ? new Date(banner.release_date).getFullYear()
    : banner.first_air_date
    ? new Date(banner.first_air_date).getFullYear()
    : null;
  const rating = banner.vote_average ? banner.vote_average.toFixed(1) : null;

  return (
    <section className="group relative w-full h-[40vh] md:h-[55vh] flex items-center justify-start overflow-hidden select-none">
      {/* Sharp Background Image with Gradient Overlay */}
      <img
        src={`https://image.tmdb.org/t/p/original${banner.backdrop_path}`}
        alt={banner.title || banner.name}
        className="absolute inset-0 w-full h-full object-cover object-top z-0 bg-black"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#181824]/90 via-[#181824]/60 to-transparent z-10" />
      {/* Content Block */}
      <div
        className={`relative z-20 flex flex-col items-start justify-center h-full pl-4 md:pl-12 max-w-2xl transition-all duration-700 ${
          contentAnim ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{
          marginBottom: 0,
          marginTop: 0,
          paddingBottom: 0,
          paddingTop: 0,
          background: 'transparent',
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-gradient-to-r from-[#6556CD] to-[#8B5CF6] text-xs px-4 py-1 rounded-full font-bold tracking-wider shadow-lg">
            {CATEGORIES[categoryIdx].label}
          </span>
          {year && (
            <span className="text-zinc-200 text-xs font-semibold flex items-center">
              <i className="ri-calendar-line mr-1"></i>
              {year}
            </span>
          )}
          {rating && (
            <span className="text-yellow-400 text-xs font-bold flex items-center">
              <i className="ri-star-fill mr-1"></i>
              {rating}
            </span>
          )}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-2 text-white drop-shadow-2xl leading-tight">
          {banner.title || banner.name || 'Trending Now'}
        </h1>
        <p className="text-sm md:text-lg text-zinc-100 mb-4 drop-shadow-lg max-h-[4.5em] overflow-hidden pr-8">
          {banner.overview ||
            'Enjoy the latest trending movies and shows, handpicked for you.'}
        </p>
        <div className="flex gap-4 mt-1">
          <button className="flex items-center gap-2 bg-white hover:bg-[#6556CD] text-black hover:text-white px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 text-lg">
            <i className="ri-play-fill text-2xl"></i> Play
          </button>
          <button className="flex items-center gap-2 border-2 border-white hover:bg-white/10 text-white px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-200 text-lg">
            <i className="ri-information-line text-2xl"></i> More Info
          </button>
        </div>
      </div>
      {/* Arrows - minimal, only on hover */}
      <button
        className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-[#6556CD] text-white p-2 md:p-3 rounded-full shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
        onClick={handlePrev}
        aria-label="Previous"
        style={{ zIndex: 30 }}
      >
        <i className="ri-arrow-left-s-line text-2xl md:text-3xl"></i>
      </button>
      <button
        className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-[#6556CD] text-white p-2 md:p-3 rounded-full shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
        onClick={handleNext}
        aria-label="Next"
        style={{ zIndex: 30 }}
      >
        <i className="ri-arrow-right-s-line text-2xl md:text-3xl"></i>
      </button>
      {/* Dots for navigation - glowing effect */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDot(idx)}
            className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 shadow-lg ${
              idx === current
                ? 'bg-white scale-125 shadow-[#6556CD]/60'
                : 'bg-white/30'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          ></button>
        ))}
      </div>
    </section>
  );
};

export default Header;
