import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Trending from './components/Trending';
import Popular from './components/Popular';
import SearchResults from './components/SearchResults';
import MovieDetails from './components/MovieDetails';
import People from './components/People';
import PersonDetails from './components/PersonDetails';
import Sidenav from './components/features/sidenav';

function App() {
  return (
    <div className="bg-[#1F1E24] w-screen h-screen flex">
      <Sidenav />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/people" element={<People />} />
            <Route path="/person/:id" element={<PersonDetails />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/:mediaType/:id" element={<MovieDetails />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
