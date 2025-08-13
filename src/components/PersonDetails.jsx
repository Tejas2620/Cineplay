import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Topnav from './templates/topnav';

const PersonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchPersonDetails = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [personRes, creditsRes, imagesRes] = await Promise.all([
        axios.get(`/person/${id}`),
        axios.get(`/person/${id}/combined_credits`),
        axios.get(`/person/${id}/images`),
      ]);

      setPerson(personRes.data);
      setCredits(creditsRes.data);
      setImages(imagesRes.data.profiles || []);
    } catch (error) {
      console.error('Error fetching person details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPersonDetails();
  }, [fetchPersonDetails]);

  useEffect(() => {
    if (person) {
      document.title = `${person.name} | Cineplay`;
    }
  }, [person]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGenderLabel = (gender) => {
    switch (gender) {
      case 1:
        return 'Female';
      case 2:
        return 'Male';
      default:
        return 'Not specified';
    }
  };

  const getDepartmentLabel = (department) => {
    switch (department) {
      case 'Acting':
        return 'Actor/Actress';
      case 'Directing':
        return 'Director';
      case 'Production':
        return 'Producer';
      case 'Writing':
        return 'Writer';
      default:
        return department;
    }
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

  if (!person) {
    return (
      <div className="w-full h-full flex flex-col">
        <Topnav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">
              Person Not Found
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

  // Group credits by department
  const creditsByDepartment =
    credits?.cast?.reduce((acc, credit) => {
      const dept = credit.media_type === 'movie' ? 'Movies' : 'TV Shows';
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(credit);
      return acc;
    }, {}) || {};

  return (
    <div className="w-full h-full flex flex-col">
      <Topnav />
      <main className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="relative w-full h-[70vh] min-h-[500px]">
          {person.profile_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
              alt={person.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center">
              <i className="ri-user-line text-8xl text-zinc-600"></i>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1E24] via-[#1F1E24]/80 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <img
                  src={
                    person.profile_path
                      ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                      : '/placeholder-avatar.png'
                  }
                  alt={person.name}
                  className="w-48 h-72 md:w-64 md:h-96 object-cover rounded-lg shadow-2xl"
                />
              </div>

              <div className="flex-1 text-white">
                <div className="mb-4">
                  <h1 className="text-4xl md:text-6xl font-bold mb-2">
                    {person.name}
                  </h1>
                  <p className="text-xl text-zinc-300">
                    {person.known_for_department &&
                      getDepartmentLabel(person.known_for_department)}
                    {person.birthday && ` • ${formatDate(person.birthday)}`}
                    {person.deathday && ` - ${formatDate(person.deathday)}`}
                  </p>
                </div>

                {person.biography && (
                  <p className="text-zinc-200 text-lg leading-relaxed max-w-4xl mb-6">
                    {person.biography.length > 300
                      ? `${person.biography.substring(0, 300)}...`
                      : person.biography}
                  </p>
                )}
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
                { id: 'career', label: 'Career', icon: 'ri-briefcase-line' },
                { id: 'gallery', label: 'Gallery', icon: 'ri-image-line' },
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
                {/* Biography */}
                {person.biography && (
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-100 mb-4">
                      Biography
                    </h3>
                    <div className="bg-zinc-800/50 rounded-lg p-6">
                      <p className="text-zinc-200 leading-relaxed">
                        {person.biography}
                      </p>
                    </div>
                  </div>
                )}

                {/* Personal Information */}
                <div>
                  <h3 className="text-2xl font-bold text-zinc-100 mb-4">
                    Personal Information
                  </h3>
                  <div className="bg-zinc-800/50 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Gender</span>
                          <span className="text-zinc-200">
                            {getGenderLabel(person.gender)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">Birthday</span>
                          <span className="text-zinc-200">
                            {formatDate(person.birthday)}
                          </span>
                        </div>
                        {person.place_of_birth && (
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Birth Place</span>
                            <span className="text-zinc-200">
                              {person.place_of_birth}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        {person.known_for_department && (
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Department</span>
                            <span className="text-zinc-200">
                              {getDepartmentLabel(person.known_for_department)}
                            </span>
                          </div>
                        )}
                        {person.popularity && (
                          <div className="flex justify-between">
                            <span className="text-zinc-400">Popularity</span>
                            <span className="text-zinc-200">
                              {person.popularity.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Career Stats */}
                <div className="bg-zinc-800/50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-zinc-100 mb-4">
                    Career Stats
                  </h3>
                  <div className="space-y-3">
                    {credits?.cast && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Total Credits</span>
                        <span className="text-zinc-200">
                          {credits.cast.length}
                        </span>
                      </div>
                    )}
                    {person.popularity && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Popularity Score</span>
                        <span className="text-zinc-200">
                          {person.popularity.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Career Tab */}
          {activeTab === 'career' && (
            <div className="space-y-8">
              {Object.entries(creditsByDepartment).map(
                ([dept, deptCredits]) => (
                  <div key={dept}>
                    <h3 className="text-2xl font-bold text-zinc-100 mb-6">
                      {dept} ({deptCredits.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {deptCredits.slice(0, 12).map((credit) => (
                        <div
                          key={`${credit.id}-${credit.media_type}`}
                          className="bg-zinc-800/50 rounded-lg overflow-hidden hover:bg-zinc-800/70 transition-colors duration-200 cursor-pointer"
                          onClick={() =>
                            navigate(`/${credit.media_type}/${credit.id}`)
                          }
                        >
                          <div className="aspect-[2/3] bg-zinc-700 overflow-hidden">
                            {credit.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w500${credit.poster_path}`}
                                alt={credit.title || credit.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <i className="ri-image-line text-4xl text-zinc-600"></i>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-zinc-100 text-sm mb-2 line-clamp-2">
                              {credit.title || credit.name}
                            </h4>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-zinc-400">
                                {credit.character || credit.job}
                              </span>
                              {credit.vote_average > 0 && (
                                <span className="text-yellow-400 font-semibold">
                                  ★ {credit.vote_average.toFixed(1)}
                                </span>
                              )}
                            </div>
                            <p className="text-zinc-500 text-xs mt-2">
                              {credit.release_date
                                ? new Date(credit.release_date).getFullYear()
                                : credit.first_air_date
                                ? new Date(credit.first_air_date).getFullYear()
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}

              {(!credits?.cast || credits.cast.length === 0) && (
                <div className="text-center py-12">
                  <i className="ri-briefcase-line text-6xl text-zinc-600 mb-4"></i>
                  <p className="text-zinc-400 text-lg">
                    No career information available
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Gallery Tab */}
          {activeTab === 'gallery' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-zinc-100 mb-6">
                  Photos ({images.length})
                </h3>
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.slice(0, 20).map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-[2/3] bg-zinc-700 rounded-lg overflow-hidden group cursor-pointer"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                          alt={`${person.name} photo ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <i className="ri-fullscreen-line text-white text-2xl"></i>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <i className="ri-image-line text-6xl text-zinc-600 mb-4"></i>
                    <p className="text-zinc-400 text-lg">No photos available</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PersonDetails;
