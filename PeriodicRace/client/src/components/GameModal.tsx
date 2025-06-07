interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: 'win' | 'lose' | null;
  score: number;
  completionTime: number;
  onPlayAgain: () => void;
  onViewLeaderboard: () => void;
  formatTime: (seconds: number) => string;
}

export default function GameModal({
  isOpen,
  onClose,
  result,
  score,
  completionTime,
  onPlayAgain,
  onViewLeaderboard,
  formatTime
}: GameModalProps) {
  if (!isOpen) return null;

  const isWin = result === 'win';

  return (
    <div className="fixed inset-0 z-50 modal-backdrop bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300">
        <div className="text-center">
          {/* Win State */}
          {isWin && (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-trophy text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h2>
              <p className="text-gray-600 mb-4">You completed the periodic table!</p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <div className="text-sm text-emerald-700 mb-1">Your Time</div>
                <div className="text-2xl font-mono font-bold text-emerald-900">
                  {formatTime(completionTime)}
                </div>
              </div>
            </>
          )}

          {/* Lose State */}
          {!isWin && (
            <>
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-clock text-white text-2xl"></i>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Time's Up!</h2>
              <p className="text-gray-600 mb-4">
                You filled <span className="font-mono font-bold text-blue-600">{score}</span> out of 118 elements
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="text-sm text-blue-700 mb-1">Keep practicing!</div>
                <div className="text-lg font-semibold text-blue-900">
                  Great effort - try again to improve
                </div>
              </div>
            </>
          )}

          <div className="space-y-3">
            <button
              onClick={onPlayAgain}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <i className="fas fa-play mr-2"></i>
              Play Again
            </button>
            
            <button
              onClick={onViewLeaderboard}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <i className="fas fa-trophy mr-2"></i>
              View Leaderboard
            </button>
            
            {!isWin && (
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <i className="fas fa-times mr-2"></i>
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
