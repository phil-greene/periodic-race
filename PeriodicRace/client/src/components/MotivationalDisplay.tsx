import { useState, useEffect } from "react";
import { getRandomContent } from "@/data/quotes";
import { Quote, Lightbulb, Play } from "lucide-react";

interface MotivationalDisplayProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function MotivationalDisplay({ isVisible, onClose }: MotivationalDisplayProps) {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    if (isVisible) {
      setContent(getRandomContent());
    }
  }, [isVisible]);

  if (!isVisible || !content) return null;

  const isQuote = content.type === 'quote';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 transform transition-all duration-300">
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            {isQuote ? (
              <i className="fas fa-quote-left text-white text-2xl"></i>
            ) : (
              <i className="fas fa-lightbulb text-white text-2xl"></i>
            )}
          </div>

          {/* Content */}
          {isQuote ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inspiration</h3>
              <blockquote className="text-gray-700 italic text-lg mb-4 leading-relaxed">
                "{content.content.text}"
              </blockquote>
              <p className="text-gray-600 font-medium">
                — {content.content.author}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-blue-600 mb-2">
                {content.content.title}
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                {content.content.text}
              </p>
            </>
          )}

          {/* Continue Button */}
          <button
            onClick={onClose}
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            <i className="fas fa-play mr-2"></i>
            Continue Playing
          </button>
        </div>
      </div>
    </div>
  );
}