import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';

const HorizontalCards = () => {
  const [trendingContent, setTrendingContent] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { value: 'all', label: 'All Trending' },
    { value: 'movie', label: 'Trending Movies' },
    { value: 'tv', label: 'Trending TV Shows' },
  ];

  const getTrendingContent = async () => {
    setLoading(true);
    try {
      let content = [];
      if (selectedCategory === 'all') {
        const [movieData, tvData] = await Promise.all([
          axios.get('/trending/movie/day'),
          axios.get('/trending/tv/day'),
        ]);
        content = [...movieData.data.results, ...tvData.data.results];
        // Shuffle the combined content
        content.sort(() => Math.random() - 0.5);
      } else {
        const { data } = await axios.get(`/trending/${selectedCategory}/day`);
        content = data.results;
      }
      setTrendingContent(content);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTrendingContent();
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleCardClick = (item) => {
    const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
    navigate(`/${mediaType}/${item.id}`);
  };

  return (
    <div className="w-full px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-bold text-2xl text-zinc-100">Trending Now</h1>
        {/* Dropdown Menu */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="appearance-none bg-zinc-800 border border-zinc-600 text-zinc-100 px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6556CD] focus:border-transparent cursor-pointer hover:bg-zinc-700 transition-colors duration-200"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <i className="ri-arrow-down-s-line text-zinc-400"></i>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6556CD]"></div>
        </div>
      ) : (
        <div className="w-full flex gap-4 overflow-x-auto pb-1 scrollbar-hide">
          {trendingContent.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 group cursor-pointer"
              onClick={() => handleCardClick(item)}
            >
              <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <img
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title || item.name}
                  className="h-64 w-44 object-cover"
                />
                {/* Overlay with title and rating */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white font-semibold text-xs mb-2 line-clamp-2">
                      {item.title || item.name}
                    </h3>
                    <div className="flex items-center gap-2">
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
      )}
    </div>
  );
};

export default HorizontalCards;
