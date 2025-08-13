import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Topnav from './features/topnav';

const Trending = () => {
  const navigate = useNavigate();
  const [trendingContent, setTrendingContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    mediaType: 'all',
    timeWindow: 'day',
    genre: 'all',
    sortBy: 'popularity',
  });

  const mediaTypes = [
    { value: 'all', label: 'All Media' },
    { value: 'movie', label: 'Movies' },
    { value: 'tv', label: 'TV Shows' },
  ];

  const timeWindows = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  const genres = [
    { value: 'all', label: 'All Genres' },
    { value: '28', label: 'Action' },
    { value: '12', label: 'Adventure' },
    { value: '16', label: 'Animation' },
    { value: '35', label: 'Comedy' },
    { value: '80', label: 'Crime' },
    { value: '99', label: 'Documentary' },
    { value: '18', label: 'Drama' },
    { value: '10751', label: 'Family' },
    { value: '14', label: 'Fantasy' },
    { value: '36', label: 'History' },
    { value: '27', label: 'Horror' },
    { value: '10402', label: 'Music' },
    { value: '9648', label: 'Mystery' },
    { value: '10749', label: 'Romance' },
    { value: '878', label: 'Science Fiction' },
    { value: '10770', label: 'TV Movie' },
    { value: '53', label: 'Thriller' },
    { value: '10752', label: 'War' },
    { value: '37', label: 'Western' },
  ];

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'vote_average', label: 'Rating' },
    { value: 'release_date', label: 'Release Date' },
    { value: 'title', label: 'Title' },
  ];

  const getTrendingContent = async () => {
    setLoading(true);
    try {
      let content = [];

      if (filters.mediaType === 'all') {
        // Get both movies and TV shows
        const [movieData, tvData] = await Promise.all([
          axios.get(`/trending/movie/${filters.timeWindow}`),
          axios.get(`/trending/tv/${filters.timeWindow}`),
        ]);
        content = [...movieData.data.results, ...tvData.data.results];
      } else {
        const { data } = await axios.get(
          `/trending/${filters.mediaType}/${filters.timeWindow}`
        );
        content = data.results;
      }

      // Apply genre filter
      if (filters.genre !== 'all') {
        content = content.filter(
          (item) =>
            item.genre_ids && item.genre_ids.includes(parseInt(filters.genre))
        );
      }

      // Apply sorting
      content.sort((a, b) => {
        switch (filters.sortBy) {
          case 'popularity':
            return b.popularity - a.popularity;
          case 'vote_average':
            return b.vote_average - a.vote_average;
          case 'release_date': {
            const dateA = new Date(a.release_date || a.first_air_date || 0);
            const dateB = new Date(b.release_date || b.first_air_date || 0);
            return dateB - dateA;
          }
          case 'title':
            return (a.title || a.name || '').localeCompare(
              b.title || b.name || ''
            );
          default:
            return 0;
        }
      });

      setTrendingContent(content.slice(0, 30));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrendingContent();
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <div className="w-full h-full flex flex-col">
      <Topnav />
      <main className="flex-1 overflow-y-auto">
        {/* Header Section */}
        <div className="w-full px-6 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="bg-zinc-700 hover:bg-zinc-600 text-zinc-300 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                ← Back
              </button>
              <h1 className="text-4xl font-bold text-zinc-100">Trending</h1>
            </div>
            <p className="text-zinc-400">
              Discover what's trending right now across movies and TV shows
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-zinc-800/50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
              Filters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Media Type Filter */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Media Type
                </label>
                <select
                  value={filters.mediaType}
                  onChange={(e) =>
                    handleFilterChange('mediaType', e.target.value)
                  }
                  className="w-full bg-zinc-700 border border-zinc-600 text-zinc-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD] focus:border-transparent"
                >
                  {mediaTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Time Window Filter */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Time Period
                </label>
                <select
                  value={filters.timeWindow}
                  onChange={(e) =>
                    handleFilterChange('timeWindow', e.target.value)
                  }
                  className="w-full bg-zinc-700 border border-zinc-600 text-zinc-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD] focus:border-transparent"
                >
                  {timeWindows.map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Genre
                </label>
                <select
                  value={filters.genre}
                  onChange={(e) => handleFilterChange('genre', e.target.value)}
                  className="w-full bg-zinc-700 border border-zinc-600 text-zinc-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD] focus:border-transparent"
                >
                  {genres.map((genre) => (
                    <option key={genre.value} value={genre.value}>
                      {genre.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Filter */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full bg-zinc-700 border border-zinc-600 text-zinc-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD] focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-zinc-400">
              Showing {trendingContent.length} results
            </p>
            <button
              onClick={getTrendingContent}
              className="bg-[#6556CD] hover:bg-[#5a4bc4] text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <i className="ri-refresh-line mr-2"></i>
              Refresh
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6556CD]"></div>
          </div>
        ) : (
          <div className="px-6 pb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {trendingContent.map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer"
                  onClick={() => {
                    const mediaType =
                      item.media_type || (item.first_air_date ? 'tv' : 'movie');
                    navigate(`/${mediaType}/${item.id}`);
                  }}
                >
                  <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={item.title || item.name}
                      className="w-full h-auto object-cover aspect-[2/3]"
                    />
                    {/* Media Type Badge */}
                    <div className="absolute top-2 left-2">
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full ${
                          item.media_type === 'tv' || item.first_air_date
                            ? 'bg-purple-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        {item.media_type === 'tv' || item.first_air_date
                          ? 'TV'
                          : 'Movie'}
                      </span>
                    </div>

                    {/* Overlay with title and rating */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                          {item.title || item.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-400 text-xs font-bold flex items-center">
                            <i className="ri-star-fill mr-1"></i>
                            {item.vote_average?.toFixed(1) || 'N/A'}
                          </span>
                          <span className="text-zinc-300 text-xs">
                            {item.release_date
                              ? new Date(item.release_date).getFullYear()
                              : item.first_air_date
                              ? new Date(item.first_air_date).getFullYear()
                              : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Trending;
