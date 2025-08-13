import React from 'react';

const About = () => (
  <div className="max-w-2xl mx-auto py-12 px-6">
    <h2 className="text-4xl font-extrabold text-white mb-6">About Cineplay</h2>
    <p className="text-zinc-300 mb-4 text-lg">
      <strong>Cineplay</strong> is a modern web application designed for movie and TV enthusiasts. It provides a seamless experience to discover, explore, and track your favorite entertainment content. Whether you’re searching for the latest blockbusters, binge-worthy TV shows, or learning more about your favorite actors and creators, Cineplay brings all the information to your fingertips.
    </p>
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-white mb-2">Key Features</h3>
      <ul className="list-disc pl-6 text-zinc-300 space-y-2">
        <li>
          <strong>Trending & Popular:</strong> Instantly browse what’s trending and popular in movies and TV.
        </li>
        <li>
          <strong>Advanced Search:</strong> Find movies, TV shows, and people with smart search and filters.
        </li>
        <li>
          <strong>Detailed Information:</strong> View cast, crew, reviews, recommendations, and more for each title.
        </li>
        <li>
          <strong>People Profiles:</strong> Explore biographies, career highlights, and images of actors and creators.
        </li>
        <li>
          <strong>Watchlist & Tracking:</strong> (Coming soon) Save titles to your watchlist and mark them as watched.
        </li>
        <li>
          <strong>Responsive Design:</strong> Enjoy Cineplay on any device, from desktop to mobile.
        </li>
      </ul>
    </div>
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-white mb-2">Technology Stack</h3>
      <ul className="list-disc pl-6 text-zinc-300 space-y-2">
        <li>React & Vite for fast, modern UI development</li>
        <li>Tailwind CSS for beautiful and responsive styling</li>
        <li>TMDB API for up-to-date movie, TV, and people data</li>
        <li>Deployed on Vercel for instant global access</li>
      </ul>
    </div>
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-white mb-2">Open Source & Credits</h3>
      <p className="text-zinc-300">
        Cineplay is an open-source project built for learning, experimentation, and fun. All movie and TV data is provided by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-[#6556CD] underline">TMDB</a>.
      </p>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-white mb-2">Contact & Feedback</h3>
      <p className="text-zinc-300">
        Have suggestions or found a bug? Feel free to open an issue or contribute on <a href="https://github.com/Tejas2620/Cineplay" target="_blank" rel="noopener noreferrer" className="text-[#6556CD] underline">GitHub</a>.
      </p>
    </div>
  </div>
);

export default About;