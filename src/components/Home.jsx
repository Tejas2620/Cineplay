import React, { useEffect } from 'react';
import Topnav from './templates/topnav';
import Header from './templates/header';
import HorizontalCards from './templates/HorizontalCards';
import PopularCards from './templates/PopularCards';

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
