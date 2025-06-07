interface GameHeaderProps {
  score: number;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  onShowLeaderboard: () => void;
  currentElementIndex: number;
  isPlaying: boolean;
}

export default function GameHeader({ score, timeLeft, formatTime, onShowLeaderboard, currentElementIndex, isPlaying }: GameHeaderProps) {
  const isUrgent = timeLeft <= 30;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-atom text-white text-lg"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Periodic Race</h1>
              <p className="text-xs text-gray-500 hidden sm:block">by Aayush Dave</p>
            </div>
          </div>

          {/* Timer - Center */}
          <div className="flex flex-col items-center" aria-live="polite" aria-label="Timer">
            <div className="flex items-center space-x-2">
              <i className={`far fa-clock ${isUrgent ? 'text-red-500' : 'text-amber-500'}`}></i>
              <span className={`font-mono text-xl font-bold game-timer ${isUrgent ? 'timer-urgent' : 'text-gray-900'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            {isPlaying && (
              <div className="text-xs text-gray-600 mt-1">
                Find element #{currentElementIndex + 1}
              </div>
            )}
          </div>

          {/* Score - Right */}
          <div className="flex items-center space-x-2">
            <i className="fas fa-trophy text-emerald-500"></i>
            <div className="text-right">
              <div className="font-mono text-xl font-bold text-gray-900">{score}</div>
              <div className="text-xs text-gray-500">/ 118</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-1.5 rounded-full transition-all duration-500 ease-out progress-bar" 
            style={{ width: `${(score / 118) * 100}%` }}
          ></div>
        </div>
      </div>
    </header>
  );
}
