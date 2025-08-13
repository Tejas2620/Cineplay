import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Topnav from './features/Topnav';

const Popular = () => {
  const navigate = useNavigate();
  const [popularContent, setPopularContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    mediaType: 'all',
    sortBy: 'vote_average',
    minRating: 0,
    minVotes: 0,
    genre: 'all',
    year: 'all',
  });

  const mediaTypes = [
    { value: 'all', label: 'All Media' },
    { value: 'movie', label: 'Movies' },
    { value: 'tv', label: 'TV Shows' },
  ];

  const sortOptions = [
    { value: 'vote_average', label: 'Highest Rated' },
    { value: 'vote_count', label: 'Most Voted' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'release_date', label: 'Latest Release' },
    { value: 'title', label: 'Alphabetical' },
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

  const years = [
    { value: 'all', label: 'All Years' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
    { value: '2020', label: '2020' },
    { value: '2019', label: '2019' },
    { value: '2018', label: '2018' },
    { value: '2017', label: '2017' },
    { value: '2016', label: '2016' },
    { value: '2015', label: '2015' },
  ];

  const getPopularContent = async (page = 1, append = false) => {
    if (loading) return;

    setLoading(true);
    try {
      let content = [];

      if (filters.mediaType === 'all') {
        // Get both top-rated movies and TV shows with pagination
        const [movieData, tvData] = await Promise.all([
          axios.get(`/movie/top_rated?page=${page}`),
          axios.get(`/tv/top_rated?page=${page}`),
        ]);
        content = [...movieData.data.results, ...tvData.data.results];

        // Check if we have more pages
        const totalPages = Math.min(
          movieData.data.total_pages,
          tvData.data.total_pages
        );
        setHasMore(page < totalPages);
      } else {
        const { data } = await axios.get(
          `/${filters.mediaType}/top_rated?page=${page}`
        );
        content = data.results;

        // Check if we have more pages
        setHasMore(page < data.total_pages);
      }

      // Apply filters
      content = content.filter((item) => {
        // Rating filter
        if (item.vote_average < filters.minRating) return false;

        // Vote count filter
        if (item.vote_count < filters.minVotes) return false;

        // Genre filter
        if (
          filters.genre !== 'all' &&
          (!item.genre_ids || !item.genre_ids.includes(parseInt(filters.genre)))
        ) {
          return false;
        }

        // Year filter
        if (filters.year !== 'all') {
          const itemYear = item.release_date
            ? new Date(item.release_date).getFullYear().toString()
            : item.first_air_date
            ? new Date(item.first_air_date).getFullYear().toString()
            : null;
          if (itemYear !== filters.year) return false;
        }

        return true;
      });

      // Apply sorting
      content.sort((a, b) => {
        switch (filters.sortBy) {
          case 'vote_average':
            return b.vote_average - a.vote_average;
          case 'vote_count':
            return b.vote_count - a.vote_count;
          case 'popularity':
            return b.popularity - a.popularity;
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

      if (append) {
        setPopularContent((prev) => [...prev, ...content]);
      } else {
        setPopularContent(content);
      }

      setCurrentPage(page);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Load more content when scrolling
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      getPopularContent(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage]);

  // Reset and reload when filters change
  useEffect(() => {
    setPopularContent([]);
    setCurrentPage(1);
    setHasMore(true);
    getPopularContent(1, false);
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const getRatingColor = (rating) => {
    if (rating >= 8.5) return 'text-green-400';
    if (rating >= 7.5) return 'text-yellow-400';
    if (rating >= 6.5) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRatingBadge = (rating) => {
    if (rating >= 8.5) return 'bg-green-600';
    if (rating >= 7.5) return 'bg-yellow-600';
    if (rating >= 6.5) return 'bg-orange-600';
    return 'bg-red-600';
  };

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, [loadMore, hasMore, loading]);

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
              <h1 className="text-4xl font-bold text-zinc-100">
                Popular & Top Rated
              </h1>
            </div>
            <p className="text-zinc-400">
              Discover the highest-rated and most popular content across all
              genres
            </p>
          </div>

          {/* Filters Section */}
          <div className="bg-zinc-800/50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4">
              Advanced Filters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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

              {/* Minimum Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Min Rating
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) =>
                    handleFilterChange('minRating', parseFloat(e.target.value))
                  }
                  className="w-full bg-zinc-700 border border-zinc-600 text-zinc-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD] focus:border-transparent"
                >
                  <option value={0}>Any Rating</option>
                  <option value={6.0}>6.0+</option>
                  <option value={6.5}>6.5+</option>
                  <option value={7.0}>7.0+</option>
                  <option value={7.5}>7.5+</option>
                  <option value={8.0}>8.0+</option>
                  <option value={8.5}>8.5+</option>
                </select>
              </div>

              {/* Minimum Votes Filter */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Min Votes
                </label>
                <select
                  value={filters.minVotes}
                  onChange={(e) =>
                    handleFilterChange('minVotes', parseInt(e.target.value))
                  }
                  className="w-full bg-zinc-700 border border-zinc-600 text-zinc-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD] focus:border-transparent"
                >
                  <option value={0}>Any Votes</option>
                  <option value={100}>100+</option>
                  <option value={500}>500+</option>
                  <option value={1000}>1K+</option>
                  <option value={5000}>5K+</option>
                  <option value={10000}>10K+</option>
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

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Year
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full bg-zinc-700 border border-zinc-600 text-zinc-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD] focus:border-transparent"
                >
                  {years.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-zinc-400">
              Showing {popularContent.length} results
              {hasMore && ` (and counting...)`}
            </p>
            <button
              onClick={() => {
                setPopularContent([]);
                setCurrentPage(1);
                setHasMore(true);
                getPopularContent(1, false);
              }}
              className="bg-[#6556CD] hover:bg-[#5a4bc4] text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <i className="ri-refresh-line mr-2"></i>
              Refresh
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {popularContent.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="group cursor-pointer"
                onClick={() => {
                  const mediaType =
                    item.media_type || (item.first_air_date ? 'tv' : 'movie');
                  navigate(`/${mediaType}/${item.id}`);
                }}
              >
                <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  {/* Rank Badge */}
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-[#6556CD] text-white text-xs font-bold px-2 py-1 rounded-full">
                      #{index + 1}
                    </span>
                  </div>

                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-auto object-cover aspect-[2/3]"
                  />

                  {/* Media Type Badge */}
                  <div className="absolute top-2 right-2">
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
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold flex items-center ${getRatingColor(
                              item.vote_average
                            )}`}
                          >
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
                        <div className="text-zinc-300 text-xs">
                          <i className="ri-user-line mr-1"></i>
                          {item.vote_count?.toLocaleString() || '0'} votes
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating Badge on Hover */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span
                      className={`px-2 py-1 text-xs font-bold rounded-full ${getRatingBadge(
                        item.vote_average
                      )} text-white`}
                    >
                      {item.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading indicator and scroll sentinel */}
          {loading && (
            <div className="flex items-center justify-center h-32 mt-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6556CD]"></div>
            </div>
          )}

          {/* Scroll sentinel for infinite scrolling */}
          <div
            id="scroll-sentinel"
            className="h-4 w-full"
            style={{ visibility: 'hidden' }}
          ></div>

          {/* End of results message */}
          {!hasMore && popularContent.length > 0 && (
            <div className="text-center py-8">
              <p className="text-zinc-400 text-lg">
                🎬 You've reached the end! Showing all {popularContent.length}{' '}
                results.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Popular;
