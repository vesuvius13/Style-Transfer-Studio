
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import Spinner from './components/Spinner';
import { StyleOption } from './types';
import { applyStyleTransfer } from './services/geminiService';

interface OriginalImage {
  file: File;
  dataUrl: string;
}

const ImageDisplay: React.FC<{ title: string; imageUrl: string | null; isLoading?: boolean }> = ({ title, imageUrl, isLoading = false }) => (
  <div className="w-full">
    <h3 className="text-lg font-semibold text-center mb-2 text-gray-400">{title}</h3>
    <div className="aspect-square w-full rounded-lg bg-gray-800 border-2 border-gray-700 flex items-center justify-center overflow-hidden">
      {isLoading ? <Spinner /> : imageUrl ? <img src={imageUrl} alt={title} className="w-full h-full object-contain" /> : <div className="text-gray-500">Image will appear here</div>}
    </div>
  </div>
);

function App() {
  const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
  const [stylizedImage, setStylizedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StyleOption>(StyleOption.PENCIL);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage({ file, dataUrl: reader.result as string });
      setStylizedImage(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleApplyStyle = async () => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setStylizedImage(null);

    try {
      const result = await applyStyleTransfer(originalImage.dataUrl, originalImage.file.type, selectedStyle);
      setStylizedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setStylizedImage(null);
    setError(null);
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header />
      <main className="p-4 md:p-8">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 md:col-span-2 space-y-8 p-6 bg-gray-800/50 rounded-lg">
              <StyleSelector selectedStyle={selectedStyle} onStyleSelect={setSelectedStyle} />
              <div className="flex flex-col space-y-4">
                 <button
                    onClick={handleApplyStyle}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                 >
                    {isLoading ? <Spinner message="Creating..." /> : 'Apply Style'}
                 </button>

                 {stylizedImage && !isLoading && (
                   <a
                     href={stylizedImage}
                     download={`stylized-${selectedStyle.replace(/\s+/g, '-').toLowerCase()}.png`}
                     className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-500 transition-colors duration-300 flex items-center justify-center text-center"
                     aria-label="Download Stylized Image"
                   >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                       <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                     </svg>
                     Download Stylized Image
                   </a>
                 )}

                 <button
                    onClick={handleReset}
                    className="w-full bg-gray-600 text-gray-200 font-bold py-3 px-4 rounded-lg hover:bg-gray-500 transition-colors duration-300"
                  >
                    Start Over
                 </button>
              </div>
            </div>

            <div className="md:col-span-2 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
               <ImageDisplay title="Original Image" imageUrl={originalImage.dataUrl} />
               <ImageDisplay title="Stylized Image" imageUrl={stylizedImage} isLoading={isLoading} />
            </div>

            {error && (
              <div className="md:col-span-2 lg:col-span-3 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
