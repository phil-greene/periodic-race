import { useState, useEffect } from "react";

interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  group: number;
  period: number;
  category: string;
}

interface AnswerOptionsProps {
  options: Element[];
  currentElementIndex: number;
  onAnswer: (selectedIndex: number) => void;
  isPlaying: boolean;
  isPaused: boolean;
}

export default function AnswerOptions({ 
  options, 
  currentElementIndex, 
  onAnswer, 
  isPlaying, 
  isPaused 
}: AnswerOptionsProps) {
  const [wiggleIndex, setWiggleIndex] = useState<number | null>(null);

  const handleOptionClick = (index: number) => {
    if (!isPlaying || isPaused || wiggleIndex !== null) return;
    
    onAnswer(index);
    
    // Show wiggle animation for wrong answers
    // This will be triggered by parent component logic
  };

  // Clear wiggle animation after timeout
  useEffect(() => {
    if (wiggleIndex !== null) {
      const timeout = setTimeout(() => {
        setWiggleIndex(null);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [wiggleIndex]);

  const buttonColors = [
    'from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300 hover:from-blue-100 hover:to-indigo-100',
    'from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-300 hover:from-emerald-100 hover:to-teal-100',
    'from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300 hover:from-amber-100 hover:to-orange-100',
    'from-red-50 to-pink-50 border-red-200 hover:border-red-300 hover:from-red-100 hover:to-pink-100'
  ];

  const circleColors = [
    'bg-blue-500',
    'bg-emerald-500', 
    'bg-amber-500',
    'bg-red-500'
  ];

  if (!options || options.length === 0) {
    return (
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p>Generating options...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2">
      <div className="bg-white rounded-lg shadow-lg p-2">
        <h3 className="text-sm font-semibold text-gray-900 mb-2 text-center">
          Which element has atomic number{' '}
          <span className="font-mono text-blue-600">{currentElementIndex + 1}</span>?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {options.map((option, index) => (
            <button
              key={`${option.atomicNumber}-${index}`}
              onClick={() => handleOptionClick(index)}
              disabled={!isPlaying || isPaused || wiggleIndex !== null}
              className={`answer-button group relative bg-gradient-to-r ${buttonColors[index]} border-2 rounded-lg p-2 text-left transition-all duration-200 hover:shadow-md hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20 min-h-[40px] flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
                wiggleIndex === index ? 'animate-wiggle' : ''
              }`}
            >
              <div className="flex items-center w-full">
                <div className={`flex-shrink-0 w-6 h-6 ${circleColors[index]} text-white rounded-full flex items-center justify-center font-mono font-bold mr-3 text-sm`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 group-hover:text-blue-900">
                    {option.name}
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-blue-700">
                    {option.symbol} - Element name
                  </div>
                </div>
              </div>
              {/* Keyboard hint */}
              <div className="absolute top-2 right-2 text-xs text-gray-400 font-mono">
                {index + 1}
              </div>
            </button>
          ))}
        </div>

        {/* Keyboard instructions */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <i className="fas fa-keyboard mr-1"></i>
          Use keys{' '}
          {[1, 2, 3, 4].map((key, index) => (
            <span key={key}>
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">{key}</kbd>
              {index < 3 ? ' ' : ''}
            </span>
          ))}{' '}
          for quick selection
        </div>
        
        {isPaused && (
          <div className="mt-4 text-center text-amber-600 font-medium">
            <i className="fas fa-pause mr-2"></i>
            Game Paused - Click Resume to continue
          </div>
        )}
      </div>
    </div>
  );
}
