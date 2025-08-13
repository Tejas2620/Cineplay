import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Topnav from './templates/topnav';

const MovieDetails = () => {
  const { id, mediaType } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [videos, setVideos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [watchProviders, setWatchProviders] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showTrailer, setShowTrailer] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsFilter, setReviewsFilter] = useState('all');
  const [reviewsSort, setReviewsSort] = useState('newest');
  const [allReviews, setAllReviews] = useState([]);

  const fetchMovieDetails = useCallback(async () => {
    if (!id || !mediaType) return;

    setLoading(true);
    try {
      const [
        detailsRes,
        creditsRes,
        videosRes,
        reviewsRes,
        providersRes,
        similarRes,
        recommendationsRes,
      ] = await Promise.all([
        axios.get(`/${mediaType}/${id}`),
        axios.get(`/${mediaType}/${id}/credits`),
        axios.get(`/${mediaType}/${id}/videos`),
        axios.get(`/${mediaType}/${id}/reviews`),
        axios.get(`/${mediaType}/${id}/watch/providers`),
        axios.get(`/${mediaType}/${id}/similar`),
        axios.get(`/${mediaType}/${id}/recommendations`),
      ]);

      // Fetch episodes and seasons for TV shows
      if (mediaType === 'tv') {
        try {
          const [seasonsRes] = await Promise.all([
            axios.get(`/tv/${id}/seasons/1`),
          ]);
          setSeasons([seasonsRes.data]);
        } catch (error) {
          console.error('Error fetching TV show episodes:', error);
        }
      }

      setDetails(detailsRes.data);
      setCredits(creditsRes.data);
      setVideos(videosRes.data.results);
      setReviews(reviewsRes.data.results);
      setAllReviews(reviewsRes.data.results);
      setWatchProviders(providersRes.data.results);
      setSimilar(similarRes.data.results);
      setRecommendations(recommendationsRes.data.results);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  }, [id, mediaType]);

  const fetchMoreReviews = useCallback(async () => {
    if (!id || !mediaType) return;

    try {
      const nextPage = reviewsPage + 1;
      const response = await axios.get(
        `/${mediaType}/${id}/reviews?page=${nextPage}`
      );
      const newReviews = response.data.results;

      if (newReviews.length > 0) {
        setAllReviews((prev) => [...prev, ...newReviews]);
        setReviewsPage(nextPage);
      }
    } catch (error) {
      console.error('Error fetching more reviews:', error);
    }
  }, [id, mediaType, reviewsPage]);

  const filterAndSortReviews = useCallback(() => {
    let filtered = [...allReviews];

    // Apply filter
    if (reviewsFilter === 'positive') {
      filtered = filtered.filter(
        (review) => (review.author_details.rating || 0) >= 7
      );
    } else if (reviewsFilter === 'negative') {
      filtered = filtered.filter(
        (review) => (review.author_details.rating || 0) < 5
      );
    } else if (reviewsFilter === 'withRating') {
      filtered = filtered.filter((review) => review.author_details.rating);
    }

    // Apply sort
    if (reviewsSort === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (reviewsSort === 'oldest') {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (reviewsSort === 'highest') {
      filtered.sort(
        (a, b) =>
          (b.author_details.rating || 0) - (a.author_details.rating || 0)
      );
    } else if (reviewsSort === 'lowest') {
      filtered.sort(
        (a, b) =>
          (a.author_details.rating || 0) - (b.author_details.rating || 0)
      );
    }

    setReviews(filtered);
  }, [allReviews, reviewsFilter, reviewsSort]);

  useEffect(() => {
    fetchMovieDetails();
  }, [fetchMovieDetails]);

  useEffect(() => {
    if (details) {
      document.title = `${details.title || details.name} | Cineplay`;
    }
  }, [details]);

  useEffect(() => {
    filterAndSortReviews();
  }, [filterAndSortReviews]);

  const getRatingBadge = (rating) => {
    if (rating >= 8.5) return 'bg-green-600';
    if (rating >= 7.5) return 'bg-yellow-600';
    if (rating >= 6.5) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTrailer = () => {
    const trailer = videos.find(
      (video) =>
        video.type === 'Trailer' &&
        (video.site === 'YouTube' || video.site === 'Vimeo')
    );
    return trailer || videos[0];
  };

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col">
        <Topnav />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6556CD]"></div>
        </main>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="w-full h-full flex flex-col">
        <Topnav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">
              Movie Not Found
            </h2>
            <button
              onClick={() => navigate(-1)}
              className="bg-[#6556CD] hover:bg-[#5a4bc4] text-white px-6 py-3 rounded-lg transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  const trailer = getTrailer();

  return (
    <div className="w-full h-full flex flex-col">
      <Topnav />
      <main className="flex-1 overflow-y-auto">
        {/* Hero Section with Backdrop */}
        <div className="relative w-full h-[70vh] min-h-[500px]">
          <img
            src={`https://image.tmdb.org/t/p/original${details.backdrop_path}`}
            alt={details.title || details.name}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1E24] via-[#1F1E24]/80 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <img
                  src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                  alt={details.title || details.name}
                  className="w-48 h-72 md:w-64 md:h-96 object-cover rounded-lg shadow-2xl"
                />
              </div>

              <div className="flex-1 text-white">
                <div className="mb-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-2">
                    {details.title || details.name}
                  </h1>
                  <p className="text-xl text-zinc-300">
                    {details.release_date
                      ? new Date(details.release_date).getFullYear()
                      : details.first_air_date
                      ? new Date(details.first_air_date).getFullYear()
                      : 'N/A'}
                    {details.runtime && ` • ${formatRuntime(details.runtime)}`}
                  </p>
                </div>

                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-full ${getRatingBadge(
                        details.vote_average
                      )} flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-sm">
                        {details.vote_average?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-300">User Score</p>
                      <p className="text-xs text-zinc-400">
                        {details.vote_count?.toLocaleString()} votes
                      </p>
                    </div>
                  </div>

                  {trailer && (
                    <button
                      onClick={() => setShowTrailer(true)}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                    >
                      <i className="ri-play-fill text-xl"></i>
                      Watch Trailer
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {details.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-zinc-800/80 text-zinc-200 px-3 py-1 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                {details.tagline && (
                  <p className="text-zinc-300 italic text-lg mb-4">
                    "{details.tagline}"
                  </p>
                )}

                <p className="text-zinc-200 text-lg leading-relaxed max-w-4xl">
                  {details.overview}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-zinc-800/50 border-b border-zinc-700">
          <div className="px-6 md:px-12">
            <nav className="flex space-x-8">
              {[
                {
                  id: 'overview',
                  label: 'Overview',
                  icon: 'ri-file-text-line',
                },
                { id: 'cast', label: 'Cast & Crew', icon: 'ri-user-line' },
                ...(mediaType === 'tv'
                  ? [{ id: 'episodes', label: 'Episodes', icon: 'ri-tv-line' }]
                  : []),
                { id: 'reviews', label: 'Reviews', icon: 'ri-chat-quote-line' },
                { id: 'similar', label: 'Similar', icon: 'ri-heart-line' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-[#6556CD] text-[#6556CD]'
                      : 'border-transparent text-zinc-400 hover:text-zinc-300'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 md:px-12 py-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Cast Preview */}
                <div>
                  <h3 className="text-2xl font-bold text-zinc-100 mb-4">
                    Top Cast
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {credits?.cast?.slice(0, 8).map((person) => (
                      <div
                        key={person.id}
                        className="text-center group cursor-pointer"
                        onClick={() => navigate(`/person/${person.id}`)}
                      >
                        <div className="relative mb-3">
                          <img
                            src={
                              person.profile_path
                                ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                                : '/placeholder-avatar.png'
                            }
                            alt={person.name}
                            className="w-20 h-20 rounded-full object-cover mx-auto group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <h4 className="font-semibold text-zinc-100 text-sm mb-1">
                          {person.name}
                        </h4>
                        <p className="text-zinc-400 text-xs">
                          {person.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Where to Watch */}
                {watchProviders && (
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-100 mb-4">
                      Where to Watch
                    </h3>
                    <div className="space-y-6">
                      {/* Streaming Services (Free with subscription) */}
                      {watchProviders.US?.flatrate &&
                        watchProviders.US.flatrate.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                              <i className="ri-play-circle-line text-green-400"></i>
                              Streaming (Included with subscription)
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {watchProviders.US.flatrate.map((provider) => (
                                <div
                                  key={provider.provider_id}
                                  className="text-center group cursor-pointer"
                                >
                                  <div className="relative">
                                    <img
                                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                      alt={provider.provider_name}
                                      className="w-16 h-16 object-contain mx-auto mb-2 group-hover:scale-110 transition-transform duration-200"
                                    />
                                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                      FREE
                                    </div>
                                  </div>
                                  <p className="text-zinc-300 text-sm font-medium">
                                    {provider.provider_name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Free with ads */}
                      {watchProviders.US?.free &&
                        watchProviders.US.free.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                              <i className="ri-tv-line text-blue-400"></i>
                              Free with Ads
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {watchProviders.US.free.map((provider) => (
                                <div
                                  key={provider.provider_id}
                                  className="text-center group cursor-pointer"
                                >
                                  <div className="relative">
                                    <img
                                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                      alt={provider.provider_name}
                                      className="w-16 h-16 object-contain mx-auto mb-2 group-hover:scale-110 transition-transform duration-200"
                                    />
                                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                      FREE
                                    </div>
                                  </div>
                                  <p className="text-zinc-300 text-sm font-medium">
                                    {provider.provider_name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Rent */}
                      {watchProviders.US?.rent &&
                        watchProviders.US.rent.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                              <i className="ri-money-dollar-circle-line text-yellow-400"></i>
                              Rent
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {watchProviders.US.rent.map((provider) => (
                                <div
                                  key={provider.provider_id}
                                  className="text-center group cursor-pointer"
                                >
                                  <div className="relative">
                                    <img
                                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                      alt={provider.provider_name}
                                      className="w-16 h-16 object-contain mx-auto mb-2 group-hover:scale-110 transition-transform duration-200"
                                    />
                                    <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                                      RENT
                                    </div>
                                  </div>
                                  <p className="text-zinc-300 text-sm font-medium">
                                    {provider.provider_name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Buy */}
                      {watchProviders.US?.buy &&
                        watchProviders.US.buy.length > 0 && (
                          <div>
                            <h4 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                              <i className="ri-shopping-cart-line text-purple-400"></i>
                              Buy
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {watchProviders.US.buy.map((provider) => (
                                <div
                                  key={provider.provider_id}
                                  className="text-center group cursor-pointer"
                                >
                                  <div className="relative">
                                    <img
                                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                                      alt={provider.provider_name}
                                      className="w-16 h-16 object-contain mx-auto mb-2 group-hover:scale-110 transition-transform duration-200"
                                    />
                                    <div className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                                      BUY
                                    </div>
                                  </div>
                                  <p className="text-zinc-300 text-sm font-medium">
                                    {provider.provider_name}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* No providers available */}
                      {(!watchProviders.US ||
                        Object.keys(watchProviders.US).length === 0 ||
                        (watchProviders.US.flatrate?.length === 0 &&
                          watchProviders.US.free?.length === 0 &&
                          watchProviders.US.rent?.length === 0 &&
                          watchProviders.US.buy?.length === 0)) && (
                        <div className="text-center py-8">
                          <i className="ri-tv-off-line text-6xl text-zinc-600 mb-4"></i>
                          <p className="text-zinc-400 text-lg">
                            No streaming options available
                          </p>
                          <p className="text-zinc-500 text-sm">
                            This title may not be available for streaming yet
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Production Details */}
                <div>
                  <h3 className="text-2xl font-bold text-zinc-100 mb-4">
                    Production Details
                  </h3>
                  <div className="bg-zinc-800/50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-zinc-200 mb-2">
                          Production Companies
                        </h4>
                        <div className="space-y-2">
                          {details.production_companies?.map((company) => (
                            <div
                              key={company.id}
                              className="flex items-center gap-3"
                            >
                              {company.logo_path && (
                                <img
                                  src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                  alt={company.name}
                                  className="w-8 h-8 object-contain"
                                />
                              )}
                              <span className="text-zinc-300">
                                {company.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-zinc-200 mb-2">
                          Production Countries
                        </h4>
                        <div className="space-y-1">
                          {details.production_countries?.map((country) => (
                            <span
                              key={country.iso_3166_1}
                              className="text-zinc-300 block"
                            >
                              {country.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {details.budget > 0 && (
                      <div className="mt-6 pt-6 border-t border-zinc-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-zinc-200 mb-2">
                              Budget
                            </h4>
                            <p className="text-zinc-300">
                              {formatCurrency(details.budget)}
                            </p>
                          </div>
                          {details.revenue > 0 && (
                            <div>
                              <h4 className="font-semibold text-zinc-200 mb-2">
                                Revenue
                              </h4>
                              <p className="text-zinc-300">
                                {formatCurrency(details.revenue)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-zinc-800/50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-zinc-100 mb-4">
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Status</span>
                      <span className="text-zinc-200">{details.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Original Language</span>
                      <span className="text-zinc-200">
                        {new Intl.DisplayNames(['en'], { type: 'language' }).of(
                          details.original_language
                        )}
                      </span>
                    </div>
                    {details.spoken_languages &&
                      details.spoken_languages.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-zinc-400">
                            Available Languages
                          </span>
                          <span className="text-zinc-200 text-right">
                            {details.spoken_languages.map((lang, index) => (
                              <span key={lang.iso_639_1}>
                                {new Intl.DisplayNames(['en'], {
                                  type: 'language',
                                }).of(lang.iso_639_1)}
                                {index < details.spoken_languages.length - 1
                                  ? ', '
                                  : ''}
                              </span>
                            ))}
                          </span>
                        </div>
                      )}
                    {details.release_date && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Release Date</span>
                        <span className="text-zinc-200">
                          {new Date(details.release_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {details.runtime && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Runtime</span>
                        <span className="text-zinc-200">
                          {formatRuntime(details.runtime)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Keywords */}
                {details.keywords?.keywords && (
                  <div className="bg-zinc-800/50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-zinc-100 mb-4">
                      Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {details.keywords.keywords.slice(0, 10).map((keyword) => (
                        <span
                          key={keyword.id}
                          className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded text-sm"
                        >
                          {keyword.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cast Tab */}
          {activeTab === 'cast' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-zinc-100 mb-6">Cast</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {credits?.cast?.map((person) => (
                    <div
                      key={person.id}
                      className="text-center group cursor-pointer"
                      onClick={() => navigate(`/person/${person.id}`)}
                    >
                      <div className="relative mb-3">
                        <img
                          src={
                            person.profile_path
                              ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                              : '/placeholder-avatar.png'
                          }
                          alt={person.name}
                          className="w-24 h-24 rounded-lg object-cover mx-auto group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <h4 className="font-semibold text-zinc-100 text-sm mb-1">
                        {person.name}
                      </h4>
                      <p className="text-zinc-400 text-xs leading-tight">
                        {person.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-zinc-100 mb-6">Crew</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {credits?.crew?.map((person) => (
                    <div
                      key={`${person.id}-${person.job}`}
                      className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg cursor-pointer hover:bg-zinc-800/70 transition-colors duration-200"
                      onClick={() => navigate(`/person/${person.id}`)}
                    >
                      <img
                        src={
                          person.profile_path
                            ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                            : '/placeholder-avatar.png'
                        }
                        alt={person.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-zinc-100">
                          {person.name}
                        </h4>
                        <p className="text-zinc-400 text-sm">{person.job}</p>
                        {person.department && (
                          <p className="text-zinc-500 text-xs">
                            {person.department}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Episodes Tab - Only for TV Shows */}
          {activeTab === 'episodes' && mediaType === 'tv' && (
            <div className="space-y-8">
              {seasons.map((season) => (
                <div key={season.id} className="space-y-6">
                  <div className="flex items-center gap-4">
                    {season.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${season.poster_path}`}
                        alt={season.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-zinc-100">
                        {season.name}
                      </h3>
                      <p className="text-zinc-400">
                        {season.episode_count} Episodes •{' '}
                        {season.air_date &&
                          new Date(season.air_date).getFullYear()}
                      </p>
                      {season.overview && (
                        <p className="text-zinc-300 mt-2 max-w-2xl">
                          {season.overview}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {season.episodes?.map((episode) => (
                      <div
                        key={episode.id}
                        className="bg-zinc-800/50 rounded-lg p-6 hover:bg-zinc-800/70 transition-colors duration-200"
                      >
                        <div className="flex gap-4">
                          {episode.still_path && (
                            <img
                              src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                              alt={episode.name}
                              className="w-48 h-27 rounded-lg object-cover flex-shrink-0"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-xl font-semibold text-zinc-100">
                                {episode.episode_number}. {episode.name}
                              </h4>
                              <div className="flex items-center gap-2">
                                {episode.vote_average > 0 && (
                                  <div className="flex items-center gap-1 bg-zinc-700 px-2 py-1 rounded">
                                    <i className="ri-star-fill text-yellow-400 text-sm"></i>
                                    <span className="text-zinc-200 text-sm">
                                      {episode.vote_average.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                                {episode.runtime > 0 && (
                                  <span className="text-zinc-400 text-sm">
                                    {Math.floor(episode.runtime / 60)}m{' '}
                                    {episode.runtime % 60}s
                                  </span>
                                )}
                              </div>
                            </div>

                            {episode.air_date && (
                              <p className="text-zinc-400 text-sm mb-3">
                                Aired:{' '}
                                {new Date(
                                  episode.air_date
                                ).toLocaleDateString()}
                              </p>
                            )}

                            {episode.overview && (
                              <p className="text-zinc-300 leading-relaxed">
                                {episode.overview}
                              </p>
                            )}

                            {episode.guest_stars &&
                              episode.guest_stars.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="text-zinc-200 font-medium mb-2">
                                    Guest Stars:
                                  </h5>
                                  <div className="flex flex-wrap gap-2">
                                    {episode.guest_stars
                                      .slice(0, 5)
                                      .map((star) => (
                                        <span
                                          key={star.id}
                                          className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded text-sm"
                                        >
                                          {star.name}
                                        </span>
                                      ))}
                                    {episode.guest_stars.length > 5 && (
                                      <span className="text-zinc-500 text-sm">
                                        +{episode.guest_stars.length - 5} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {seasons.length === 0 && (
                <div className="text-center py-12">
                  <i className="ri-tv-line text-6xl text-zinc-600 mb-4"></i>
                  <p className="text-zinc-400 text-lg">No episodes available</p>
                  <p className="text-zinc-500 text-sm">
                    Episode information for this TV show is not available yet
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h3 className="text-2xl font-bold text-zinc-100">
                  User Reviews ({allReviews.length})
                </h3>

                <div className="flex flex-wrap gap-3">
                  {/* Filter Dropdown */}
                  <select
                    value={reviewsFilter}
                    onChange={(e) => setReviewsFilter(e.target.value)}
                    className="bg-zinc-700 text-zinc-200 px-3 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:border-[#6556CD]"
                  >
                    <option value="all">All Reviews</option>
                    <option value="positive">Positive (7+ stars)</option>
                    <option value="negative">Negative (&lt;5 stars)</option>
                    <option value="withRating">With Rating</option>
                  </select>

                  {/* Sort Dropdown */}
                  <select
                    value={reviewsSort}
                    onChange={(e) => setReviewsSort(e.target.value)}
                    className="bg-zinc-700 text-zinc-200 px-3 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:border-[#6556CD]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="highest">Highest Rated</option>
                    <option value="lowest">Lowest Rated</option>
                  </select>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-zinc-800/50 rounded-lg p-6"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-zinc-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-zinc-300 font-semibold">
                            {review.author.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-zinc-100">
                              {review.author}
                            </h4>
                            {review.author_details.rating && (
                              <div className="flex items-center gap-1">
                                <i className="ri-star-fill text-yellow-400"></i>
                                <span className="text-zinc-300 text-sm">
                                  {review.author_details.rating}/10
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-zinc-400 text-sm">
                            {new Date(review.created_at).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-zinc-200 leading-relaxed">
                        {review.content}
                      </p>
                    </div>
                  ))}

                  {/* Load More Button */}
                  {allReviews.length < 100 && (
                    <div className="text-center pt-6">
                      <button
                        onClick={fetchMoreReviews}
                        className="bg-[#6556CD] hover:bg-[#5a4bc4] text-white px-8 py-3 rounded-lg transition-colors duration-200"
                      >
                        Load More Reviews
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="ri-chat-quote-line text-6xl text-zinc-600 mb-4"></i>
                  <p className="text-zinc-400 text-lg">No reviews found</p>
                </div>
              )}
            </div>
          )}

          {/* Similar Tab */}
          {activeTab === 'similar' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-zinc-100 mb-6">
                  Similar {mediaType === 'tv' ? 'TV Shows' : 'Movies'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {similar?.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={item.title || item.name}
                          className="w-full h-auto object-cover aspect-[2/3]"
                        />
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

              <div>
                <h3 className="text-2xl font-bold text-zinc-100 mb-6">
                  Recommendations
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {recommendations?.map((item) => (
                    <div key={item.id} className="group cursor-pointer">
                      <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <img
                          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                          alt={item.title || item.name}
                          className="w-full h-auto object-cover aspect-[2/3]"
                        />
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
            </div>
          )}
        </div>
      </main>

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-zinc-300 transition-colors duration-200"
            >
              <i className="ri-close-line"></i>
            </button>
            <div className="aspect-video bg-zinc-800 rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                title={trailer.name}
                className="w-full h-full"
                allowFullScreen
                allow="autoplay; encrypted-media"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
