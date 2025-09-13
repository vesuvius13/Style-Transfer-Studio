
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-6 border-b border-gray-700">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        Style Transfer Studio
      </h1>
      <p className="text-gray-400 mt-2">Transform Your Photos with AI Artistry</p>
    </header>
  );
};

export default Header;
