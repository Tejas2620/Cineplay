import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import Topnav from './features/Topnav';

const People = () => {
  const navigate = useNavigate();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc'); // Fix default value
  const [filterGender, setFilterGender] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [isSearchMode, setIsSearchMode] = useState(false); // Track mode

  // Helper for sorting
  const sortPeople = (list) => {
    switch (sortBy) {
      case 'popularity.desc':
        return [...list].sort((a, b) => b.popularity - a.popularity);
      case 'popularity.asc':
        return [...list].sort((a, b) => a.popularity - b.popularity);
      case 'name.asc':
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case 'name.desc':
        return [...list].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return list;
    }
  };

  const fetchPeople = useCallback(
    async (reset = false) => {
      setLoading(true);
      try {
        let response;
        if (isSearchMode && searchQuery.trim()) {
          response = await axios.get('/search/person', {
            params: {
              query: searchQuery,
              page,
            },
          });
        } else {
          // Only page param for /person/popular
          response = await axios.get('/person/popular', { params: { page } });
        }

        let results = response.data.results;

        // Apply filters client-side
        if (filterGender !== 'all') {
          results = results.filter(
            (person) => person.gender === parseInt(filterGender)
          );
        }
        if (filterDepartment !== 'all') {
          results = results.filter(
            (person) => person.known_for_department === filterDepartment
          );
        }

        // Sort client-side
        results = sortPeople(results);

        if (page === 1 || reset) {
          setPeople(results);
        } else {
          setPeople((prev) => [...prev, ...results]);
        }
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching people:', error);
      } finally {
        setLoading(false);
      }
    },
    [page, sortBy, searchQuery, isSearchMode, filterGender, filterDepartment]
  );

  useEffect(() => {
    // If searchQuery is present, switch to search mode
    setIsSearchMode(!!searchQuery.trim());
  }, [searchQuery]);

  useEffect(() => {
    fetchPeople(true);
  }, [sortBy, filterGender, filterDepartment]);

  useEffect(() => {
    fetchPeople();
  }, [page, isSearchMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPeople(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadMore = () => {
    if (page < totalPages && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePersonClick = (personId) => {
    navigate(`/person/${personId}`);
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
      case 'Sound':
        return 'Sound Department';
      case 'Camera':
        return 'Camera Department';
      case 'Editing':
        return 'Editor';
      case 'Art':
        return 'Art Department';
      case 'Costume & Make-Up':
        return 'Costume & Make-Up';
      case 'Visual Effects':
        return 'Visual Effects';
      default:
        return department;
    }
  };

  return (
    <div className="w-full h-full flex">
      <div className="flex-1 flex flex-col">
        <Topnav />
        <main className="flex-1 overflow-y-auto bg-[#1F1E24]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6556CD] to-[#8B5CF6] p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-4xl font-bold text-white mb-4">
                People in Entertainment
              </h1>
              <p className="text-white/90 text-lg">
                Discover actors, directors, writers, and other talented
                professionals
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-zinc-800/50 border-b border-zinc-700 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                {/* Search */}
                <div className="flex-1 w-full lg:w-auto">
                  <div className="relative">
                    <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400"></i>
                    <input
                      type="text"
                      placeholder="Search for people..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full lg:w-80 pl-10 pr-4 py-3 bg-zinc-700 text-white rounded-lg border border-zinc-600 focus:outline-none focus:border-[#6556CD]"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-zinc-700 text-zinc-200 px-3 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:border-[#6556CD]"
                  >
                    <option value="popularity.desc">Most Popular</option>
                    <option value="popularity.asc">Least Popular</option>
                    <option value="name.asc">Name A-Z</option>
                    <option value="name.desc">Name Z-A</option>
                  </select>

                  <select
                    value={filterGender}
                    onChange={(e) => setFilterGender(e.target.value)}
                    className="bg-zinc-700 text-zinc-200 px-3 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:border-[#6556CD]"
                  >
                    <option value="all">All Genders</option>
                    <option value="1">Female</option>
                    <option value="2">Male</option>
                  </select>

                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="bg-zinc-700 text-zinc-200 px-3 py-2 rounded-lg border border-zinc-600 focus:outline-none focus:border-[#6556CD]"
                  >
                    <option value="all">All Departments</option>
                    <option value="Acting">Acting</option>
                    <option value="Directing">Directing</option>
                    <option value="Production">Production</option>
                    <option value="Writing">Writing</option>
                    <option value="Sound">Sound</option>
                    <option value="Camera">Camera</option>
                    <option value="Editing">Editing</option>
                    <option value="Art">Art</option>
                    <option value="Costume & Make-Up">Costume & Make-Up</option>
                    <option value="Visual Effects">Visual Effects</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* People Grid */}
          <div className="max-w-7xl mx-auto p-6">
            {loading && page === 1 ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6556CD]"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {people
                    .filter((person) => {
                      if (
                        filterGender !== 'all' &&
                        person.gender !== parseInt(filterGender)
                      )
                        return false;
                      if (filterDepartment !== 'all') {
                        const knownFor = person.known_for_department || '';
                        if (knownFor !== filterDepartment) return false;
                      }
                      return true;
                    })
                    .map((person) => (
                      <div
                        key={person.id}
                        onClick={() => handlePersonClick(person.id)}
                        className="group cursor-pointer"
                      >
                        <div className="relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                          <img
                            src={
                              person.profile_path
                                ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
                                : ''
                            }
                            alt={person.name}
                            className={`w-full h-auto object-cover aspect-[2/3] ${
                              person.profile_path ? '' : 'invisible'
                            } rounded-lg border-2 border-zinc-700`}
                          />
                          {!person.profile_path && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 via-zinc-700 to-zinc-900 rounded-lg">
                              <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-zinc-700 flex items-center justify-center shadow-lg mb-3">
                                  <i className="ri-user-3-fill text-4xl text-zinc-400"></i>
                                </div>
                                <span className="text-zinc-300 text-center text-sm font-medium px-2">
                                  {person.name}
                                </span>
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                                {person.name}
                              </h3>
                              <div className="space-y-1">
                                {person.known_for_department && (
                                  <p className="text-zinc-300 text-xs">
                                    {getDepartmentLabel(
                                      person.known_for_department
                                    )}
                                  </p>
                                )}
                                {person.known_for &&
                                  person.known_for.length > 0 && (
                                    <p className="text-zinc-400 text-xs line-clamp-1">
                                      Known for:{' '}
                                      {person.known_for[0]?.title ||
                                        person.known_for[0]?.name}
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Load More Button */}
                {page < totalPages && (
                  <div className="text-center pt-8">
                    <button
                      onClick={loadMore}
                      disabled={loading}
                      className="bg-[#6556CD] hover:bg-[#5a4bc4] disabled:bg-zinc-600 text-white px-8 py-3 rounded-lg transition-colors duration-200"
                    >
                      {loading ? 'Loading...' : 'Load More People'}
                    </button>
                  </div>
                )}

                {/* No Results */}
                {people.length === 0 && !loading && (
                  <div className="text-center py-20">
                    <i className="ri-user-line text-6xl text-zinc-600 mb-4"></i>
                    <p className="text-zinc-400 text-lg">No people found</p>
                    <p className="text-zinc-500 text-sm">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default People;
