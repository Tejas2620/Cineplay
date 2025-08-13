import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from '../utils/axios';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery().get('q') || '';
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    axios
      .get('/search/multi', {
        params: {
          query,
          include_adult: false,
          language: 'en-US',
          page: 1,
        },
      })
      .then((response) => {
        const filtered = (response.data.results || []).filter(
          (item) =>
            item.media_type === 'movie' ||
            item.media_type === 'tv' ||
            item.media_type === 'person'
        );
        setResults(filtered);
      })
      .catch(() => {
        setError('Failed to fetch results.');
        setResults([]);
      })
      .finally(() => setIsLoading(false));
  }, [query]);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">
        Search Results for "{query}"
      </h2>
      {isLoading && (
        <div className="flex items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#6556CD]"></div>
          <span className="text-zinc-400 text-sm ml-3">Searching...</span>
        </div>
      )}
      {error && <div className="text-red-400 mb-4">{error}</div>}
      {!isLoading && !error && results.length === 0 && (
        <div className="text-zinc-400 text-center py-8">
          <i className="ri-search-line text-2xl mb-2"></i>
          <p>No results found.</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {results.map((item) => (
          <Link
            key={item.id + item.media_type}
            to={
              item.media_type === 'person'
                ? `/person/${item.id}`
                : `/${item.media_type}/${item.id}`
            }
            className="flex items-center p-4 bg-zinc-900/80 rounded-lg border border-zinc-700 hover:border-[#6556CD] transition-all"
            style={{ textDecoration: 'none' }}
          >
            <div className="w-16 h-24 bg-gradient-to-br from-[#6556CD] to-[#8B5CF6] rounded-lg flex items-center justify-center mr-4 overflow-hidden">
              {item.media_type === 'person' ? (
                item.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${item.profile_path}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="ri-user-star-line text-white text-lg"></i>
                )
              ) : item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="ri-movie-2-line text-white text-lg"></i>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-white font-medium text-lg">
                {item.title || item.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-zinc-400 text-xs">
                  {item.media_type === 'movie'
                    ? 'Movie'
                    : item.media_type === 'tv'
                    ? 'TV Show'
                    : 'Person'}
                </span>
                {item.media_type !== 'person' && item.release_date && (
                  <>
                    <span className="text-zinc-500 text-xs">•</span>
                    <span className="text-zinc-400 text-xs">
                      {new Date(
                        item.release_date || item.first_air_date
                      ).getFullYear()}
                    </span>
                  </>
                )}
                {item.media_type === 'person' &&
                  item.known_for &&
                  item.known_for.length > 0 && (
                    <>
                      <span className="text-zinc-500 text-xs">•</span>
                      <span className="text-zinc-400 text-xs">
                        {item.known_for[0]?.title || item.known_for[0]?.name}
                      </span>
                    </>
                  )}
                {item.vote_average && (
                  <>
                    <span className="text-zinc-500 text-xs">•</span>
                    <span className="text-zinc-400 text-xs">
                      ⭐ {item.vote_average.toFixed(1)}
                    </span>
                  </>
                )}
              </div>
              {item.overview && item.media_type !== 'person' && (
                <p className="text-zinc-400 text-xs mt-2 line-clamp-2">
                  {item.overview}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
