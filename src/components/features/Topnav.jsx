import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const Topnav = () => {
  const [placeholder, setPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const texts = ['Search movies...', 'Search TV shows...', 'Search people...'];

  const categories = [
    { id: 'all', label: 'All', icon: 'ri-search-line' },
    { id: 'movie', label: 'Movies', icon: 'ri-movie-2-line' },
    { id: 'tv', label: 'TV Shows', icon: 'ri-tv-line' },
    { id: 'person', label: 'People', icon: 'ri-user-star-line' },
  ];
  const getSearchResults = async () => {
    if (inputValue.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get('/search/multi', {
        params: {
          query: inputValue,
          include_adult: false,
          language: 'en-US',
          page: 1,
        },
      });

      let filteredResults = response.data.results.filter(
        (item) =>
          item.media_type === 'movie' ||
          item.media_type === 'tv' ||
          item.media_type === 'person'
      );

      // Filter by category if not 'all'
      if (activeCategory !== 'all') {
        filteredResults = filteredResults.filter(
          (item) => item.media_type === activeCategory
        );
      }

      const results = filteredResults.slice(0, 8).map((item) => ({
        id: item.id,
        title: item.title || item.name,
        type:
          item.media_type === 'movie'
            ? 'Movie'
            : item.media_type === 'tv'
            ? 'TV Show'
            : 'Person',
        media_type: item.media_type, // <-- Add this line
        year:
          item.media_type === 'person'
            ? null
            : new Date(item.release_date || item.first_air_date).getFullYear(),
        poster:
          item.media_type === 'person'
            ? item.profile_path
              ? `https://image.tmdb.org/t/p/w92${item.profile_path}`
              : null
            : item.poster_path
            ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
            : null,
        knownFor: item.media_type === 'person' ? item.known_for : null,
        rating: item.vote_average,
        overview: item.overview,
      }));

      setSearchResults(results);
    } catch (error) {
      console.log(error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Add to search history
  const addToHistory = (query) => {
    const newHistory = [
      query,
      ...searchHistory.filter((item) => item !== query),
    ].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setSearchHistory(JSON.parse(saved));
    }
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showDropdown && selectedIndex >= 0 && searchResults[selectedIndex]) {
        const result = searchResults[selectedIndex];
        navigate(
          `/${result.type.toLowerCase().replace(' ', '-')}/${result.id}`
        );
      }
      // Do NOT navigate to search results page on Enter - do nothing
      return;
    }

    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const currentText = texts[currentIndex];

    if (!isDeleting) {
      if (placeholder.length < currentText.length) {
        const timeout = setTimeout(() => {
          setPlaceholder(currentText.slice(0, placeholder.length + 1));
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
        return () => clearTimeout(timeout);
      }
    } else {
      if (placeholder.length > 0) {
        const timeout = setTimeout(() => {
          setPlaceholder(placeholder.slice(0, -1));
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        setIsDeleting(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }
    }
  }, [placeholder, isDeleting, currentIndex, texts]);

  // Search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (inputValue.trim().length >= 2) {
        getSearchResults();
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue, activeCategory]);

  const handleClearInput = () => {
    setInputValue('');
    setSearchResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  const handleSearchSubmit = () => {
    if (inputValue.trim()) {
      addToHistory(inputValue.trim());
      setShowDropdown(false);
      setSelectedIndex(-1);
      if (searchRef.current) {
        const input = searchRef.current.querySelector('input');
        if (input) input.blur();
      }
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const handleHistoryClick = (query) => {
    setInputValue(query);
    addToHistory(query);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className="w-full h-[7vh] relative flex items-center justify-center bg-gradient-to-r from-[#1F1E24] to-[#2A2A35] border-b border-zinc-800 px-8">
      {/* Search Container */}
      <div
        className="relative flex items-center w-full max-w-md"
        ref={searchRef}
      >
        <i className="ri-search-2-line absolute left-4 text-zinc-400 text-lg"></i>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl pl-12 pr-12 py-3 text-white placeholder-zinc-400 focus:outline-none focus:border-[#6556CD] focus:ring-2 focus:ring-[#6556CD]/20 transition-all duration-300"
        />
        {inputValue && (
          <i
            className="ri-close-line absolute right-4 text-zinc-400 text-lg cursor-pointer hover:text-white transition-colors"
            onClick={handleClearInput}
          ></i>
        )}

        {/* Search Results Dropdown */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-md border border-zinc-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-4">
              {/* Categories */}
              <div className="flex gap-2 mb-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeCategory === category.id
                        ? 'bg-[#6556CD] text-white'
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                    }`}
                  >
                    <i className={category.icon}></i>
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Search History */}
              {!inputValue && searchHistory.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold text-sm">
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearHistory}
                      className="text-zinc-400 hover:text-white text-xs"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchHistory.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => handleHistoryClick(query)}
                        className="flex items-center w-full p-2 rounded-lg hover:bg-zinc-800/50 transition-all text-left"
                      >
                        <i className="ri-time-line text-zinc-400 mr-3"></i>
                        <span className="text-zinc-300 text-sm">{query}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              {inputValue && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-semibold text-sm">
                      Search Results
                    </h3>
                    {!isLoading && (
                      <span className="text-zinc-400 text-xs">
                        {searchResults.length} results
                      </span>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6556CD]"></div>
                      <span className="text-zinc-400 text-sm ml-3">
                        Searching...
                      </span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((result, index) => (
                        <Link
                          key={`${result.type}-${result.id}`}
                          to={
                            result.media_type === 'person'
                              ? `/person/${result.id}`
                              : `/${result.media_type}/${result.id}`
                          }
                          className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                            selectedIndex === index
                              ? 'bg-[#6556CD]/20 border border-[#6556CD]/30'
                              : 'hover:bg-zinc-800/50'
                          }`}
                        >
                          <div className="w-12 h-16 bg-gradient-to-br from-[#6556CD] to-[#8B5CF6] rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                            {result.poster ? (
                              <img
                                src={result.poster}
                                alt={result.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <i className="ri-movie-2-line text-white text-lg"></i>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium text-sm group-hover:text-[#6556CD] transition-colors">
                              {result.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-zinc-400 text-xs">
                                {result.type}
                              </span>
                              {result.year && (
                                <>
                                  <span className="text-zinc-500 text-xs">
                                    •
                                  </span>
                                  <span className="text-zinc-400 text-xs">
                                    {result.year}
                                  </span>
                                </>
                              )}
                              {result.type === 'Person' &&
                                result.knownFor &&
                                result.knownFor.length > 0 && (
                                  <>
                                    <span className="text-zinc-500 text-xs">
                                      •
                                    </span>
                                    <span className="text-zinc-400 text-xs">
                                      {result.knownFor[0]?.title ||
                                        result.knownFor[0]?.name}
                                    </span>
                                  </>
                                )}
                              {result.rating && (
                                <>
                                  <span className="text-zinc-500 text-xs">
                                    •
                                  </span>
                                  <span className="text-zinc-400 text-xs">
                                    ⭐ {result.rating.toFixed(1)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <i className="ri-arrow-right-s-line text-zinc-500 group-hover:text-[#6556CD] transition-colors"></i>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <i className="ri-search-line text-zinc-500 text-2xl mb-2"></i>
                      <p className="text-zinc-400 text-sm">No results found</p>
                    </div>
                  )}

                  {searchResults.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-zinc-700">
                      <button
                        onClick={handleSearchSubmit}
                        className="flex items-center justify-center w-full py-2 text-[#6556CD] hover:text-[#8B5CF6] transition-colors text-sm font-medium"
                      >
                        View all results for "{inputValue}"
                        <i className="ri-arrow-right-line ml-2"></i>
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Keyboard shortcuts hint */}
              <div className="mt-3 pt-3 border-t border-zinc-700">
                <div className="flex items-center justify-center gap-4 text-xs text-zinc-500">
                  <span>↑↓ Navigate</span>
                  <span>Enter Select</span>
                  <span>Esc Close</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Topnav;
