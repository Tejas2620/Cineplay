import React, { useEffect } from 'react';
import Topnav from './features/topnav';
import Header from './features/header';
import HorizontalCards from './features/HorizontalCards';
import PopularCards from './features/PopularCards';

function Home() {
  useEffect(() => {
    document.title = 'Cineplay | Home ';
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <Topnav />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <HorizontalCards />
        <PopularCards />
      </main>
    </div>
  );
}

export default Home;
