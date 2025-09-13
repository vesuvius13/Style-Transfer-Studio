
import React from 'react';
import { StyleOption } from '../types';

interface StyleSelectorProps {
  selectedStyle: StyleOption;
  onStyleSelect: (style: StyleOption) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleSelect }) => {
  const styles = Object.values(StyleOption);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-center md:text-left">Choose a Style</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {styles.map((style) => (
          <button
            key={style}
            onClick={() => onStyleSelect(style)}
            className={`p-3 text-sm font-medium text-center rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500
              ${selectedStyle === style ? 'bg-purple-600 text-white shadow-lg scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
